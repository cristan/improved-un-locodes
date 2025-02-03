import {readCsv} from "./util/readCsv.js";
import {
    convertToDecimal,
    convertToUnlocode,
    decimalRegex,
    getDistanceFromLatLonInKm
} from "./util/coordinatesConverter.js";
import fs from "node:fs";
import {readWikidata} from "./util/wikidata-reader.js";
import {detectCoordinates} from "./util/coordinate-detector.js";
import {DELETIONS_STILL_IN_USE} from "./manual-undelete.js";

async function generateImprovedCoordinates() {
    const csvDatabase = await readCsv()
    const wikidataDatabase = readWikidata()

    const filename = 'code-list-improved.csv'
    const dataOut = fs.createWriteStream('../../data/' + filename)
    writeCsv(dataOut, ["Change", "Country", "Location", "Name","NameWoDiacritics","Subdivision","Status","Function","Date","IATA","Coordinates","Remarks","CoordinatesDecimal","Distance","Source"])

    let correctedCoordinates = 0
    let newlyAddedCoordinates = 0
    for (const unlocode of Object.keys(csvDatabase)) {
        const entry = csvDatabase[unlocode]

        // Convert all coordinates to UN/LOCODE style degrees coordinates
        const detectedCoordinates = await detectCoordinates(unlocode, csvDatabase, wikidataDatabase, 100)
        let degreesCoordinates = entry.coordinates
        if (entry.coordinates === "2444N 05045") {// The only malformed coordinate in the original UN/LOCODE dataset
            degreesCoordinates = "2444N 05045E"
        }
        if (degreesCoordinates.match(decimalRegex)) {
            const decimalCoordinates = convertToDecimal(degreesCoordinates)
            degreesCoordinates = convertToUnlocode(decimalCoordinates.lat, decimalCoordinates.lon)
        }

        const columns = [entry.change, entry.country, entry.location,entry.city,entry.nameWithoutDiacritics,entry.subdivisionCode,entry.status,entry.function,entry.date,entry.iata,degreesCoordinates,entry.remarks]
        if (!detectedCoordinates) {
            columns.push("", "N/A", "N/A")
            writeCsv(dataOut, columns)
        }
        else if (detectedCoordinates.type === "Wikidata") {
            const status = entry.coordinates ? "N/A (hardcoded to Wikidata)" : "N/A (no UN/LOCODE)"
            const wikiDataColumns = [entry.change, entry.country, entry.location, entry.city, entry.nameWithoutDiacritics, entry.subdivisionCode, entry.status, entry.function, entry.date, entry.iata, convertToUnlocode(detectedCoordinates.lat, detectedCoordinates.lon), entry.remarks, detectedCoordinates.lat +","+detectedCoordinates.lon, status, detectedCoordinates.sourceUrl]
            writeCsv(dataOut, wikiDataColumns)
            if (entry.coordinates) {
                correctedCoordinates++
            } else {
                newlyAddedCoordinates++
            }
        } else if (detectedCoordinates.type === "UN/LOCODE") {
            if (!detectedCoordinates.source) {
                columns.push(detectedCoordinates.decimalCoordinates.lat +","+detectedCoordinates.decimalCoordinates.lon, "N/A (no Nominatim)", "UN/LOCODE")
            } else {
                const distance = Math.round(getDistanceFromLatLonInKm(detectedCoordinates.decimalCoordinates.lat, detectedCoordinates.decimalCoordinates.lon, detectedCoordinates.source.lat, detectedCoordinates.source.lon));
                columns.push(detectedCoordinates.decimalCoordinates.lat +","+detectedCoordinates.decimalCoordinates.lon, distance, "UN/LOCODE")
            }
            writeCsv(dataOut, columns)
        } else if (detectedCoordinates.type === "Other UN/LOCODE") {
            columns.push(detectedCoordinates.decimalCoordinates.lat +","+detectedCoordinates.decimalCoordinates.lon, "N/A (coordinate of another UN/LOCODE used)", detectedCoordinates.source)
            columns[10] = detectedCoordinates.coordinates
            writeCsv(dataOut, columns)
        } else {
            let distance = "N/A (no UN/LOCODE)"
            if (entry.coordinates) {
                if (detectedCoordinates.decimalCoordinates) {
                    distance = Math.round(getDistanceFromLatLonInKm(detectedCoordinates.decimalCoordinates.lat, detectedCoordinates.decimalCoordinates.lon, detectedCoordinates.lat, detectedCoordinates.lon));
                }
                correctedCoordinates++
            } else {
                newlyAddedCoordinates++
            }
            writeNominatimDataToCsv(dataOut, entry, detectedCoordinates, distance)
        }
    }
    for (const deletedUnlocode of Object.keys(DELETIONS_STILL_IN_USE)) {
        const newUnlocode = DELETIONS_STILL_IN_USE[deletedUnlocode]
        const entry = csvDatabase[newUnlocode]
        const decimalCoordinates = convertToDecimal(entry.coordinates)
        const entries = ["X", deletedUnlocode.substring(0, 2), deletedUnlocode.substring(2), entry.city, entry.nameWithoutDiacritics, entry.subdivisionCode, "XX", entry.function, entry.date, entry.iata, entry.coordinates, `Use ${newUnlocode}`, decimalCoordinates.lat +","+decimalCoordinates.lon, "N/A", newUnlocode]
        writeCsv(dataOut, entries)
    }
    console.log(`Created ${filename} with ${correctedCoordinates} corrected coordinates and ${newlyAddedCoordinates} new ones`)
}

function writeNominatimDataToCsv(dataOut, entry, firstNominatimResult, distance) {
    const nominatimEntries = [entry.change, entry.country, entry.location, entry.city, entry.nameWithoutDiacritics, entry.subdivisionCode, entry.status, entry.function, entry.date, entry.iata, convertToUnlocode(firstNominatimResult.lat, firstNominatimResult.lon), entry.remarks, firstNominatimResult.lat +","+ firstNominatimResult.lon, distance, firstNominatimResult.sourceUrl]
    writeCsv(dataOut, nominatimEntries)
}

function writeCsv(dataOut, entries) {
    const withQuotesIfNeeded = entries.map(entry => {
        if (typeof entry === "string" && (entry.includes(",") || entry.includes("\n"))) {
            return `\"${entry}\"`
        } else {
            return entry
        }
    })
    dataOut.write(withQuotesIfNeeded.join(",")+ "\n")
}

generateImprovedCoordinates()