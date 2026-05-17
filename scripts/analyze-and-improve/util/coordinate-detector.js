import {WIKIDATA_BEST} from "../manual-wikidata-best.js";
import {convertToDecimal, convertToUnlocode, getDistanceFromLatLonInKm} from "./coordinatesConverter.js";
import {UNLOCODE_BEST} from "../manual-unlocode-best.js";
import {downloadByCityIfNeeded} from "./nominatim-downloader.js";
import {getNominatimData, readNominatimDataByCity} from "./nominatim-loader.js";
import {ALIASES} from "../manual-aliases.js";

export async function detectCoordinates(unlocode, csvDatabase, wikidataDatabase, maxDistance) {
    if (ALIASES[unlocode]) {
        const detectedCoordinates = await detectCoordinates(ALIASES[unlocode], csvDatabase, wikidataDatabase, maxDistance)
        detectedCoordinates.type = "Other UN/LOCODE"
        detectedCoordinates.source = ALIASES[unlocode]
        return detectedCoordinates
    }

    const entry = csvDatabase[unlocode]

    const nominatimData = await getNominatimData(entry)
    const nominatimResult = nominatimData?.result
    const firstNominatimResult = nominatimResult?.[0]

    const decimalCoordinates = convertToDecimal(entry.coordinates)
    const wikiDataEntry = wikidataDatabase[unlocode]

    if (wikiDataEntry && decimalCoordinates && getDistanceFromLatLonInKm(decimalCoordinates.lat, decimalCoordinates.lon, wikiDataEntry.lat, wikiDataEntry.lon) < Math.min(10, maxDistance)) {
        // When we have a Wikidata entry, check if it's close to the original unlocode one. If yes, just believe the UN/LOCODE's location, regardless of what nominatim says
        return getUnlocodeResult(entry, decimalCoordinates, firstNominatimResult)
    }
    // When Wikidata is marked as best, or there are no alternatives, choose Wikidata
    if (WIKIDATA_BEST.includes(unlocode) || (!decimalCoordinates && !nominatimData && wikiDataEntry)) {
        return {...wikiDataEntry, type: "Wikidata", decimalCoordinates: {lat: wikiDataEntry.lat, lon: wikiDataEntry.lon}}
    }

    if (!nominatimData || UNLOCODE_BEST.includes(unlocode)) {
        // When Nominatim can't find it, which most likely means a non-standard name is found.
        // For example ITMND which has the name "Mondello, Palermo" or ITAQW with the name "Acconia Di Curinga"
        // These should be called "Mondello" and "Acconia" to be found in nominatim.

        // Return the UN/LOCODE entry, regardless of whether it has coordinates or not
        return getUnlocodeResult(entry, decimalCoordinates, firstNominatimResult)
    }

    // Whenever we find something close to the UN/LOCODE coordinates, assume that's the one they meant.
    if (decimalCoordinates) {
        const closestHit = findClosestNominatimHit(nominatimResult, decimalCoordinates)
        const firstDist = getDistanceFromLatLonInKm(decimalCoordinates.lat, decimalCoordinates.lon, firstNominatimResult.lat, firstNominatimResult.lon)
        if (firstDist < 100 || closestHit.distance < 25) {
            if (closestHit.distance < 10) {
                return getUnlocodeResult(entry, decimalCoordinates, closestHit.hit)
            }
            return {...closestHit.hit, decimalCoordinates, type: "Nominatim", options: undefined}
        }

        if (nominatimData.scrapeType === "byRegion") {
            // We couldn't find any close result by region. Let's scrape by city as well to see if there is a location in another region where the coordinates do match (like ITAN2)
            // This means that either the coordinates are wrong, or the region is wrong.
            await downloadByCityIfNeeded(entry)
            const nominatimDataByCity = readNominatimDataByCity(unlocode, entry.city)?.result
            if (nominatimDataByCity && nominatimDataByCity.length > 0) {
                const closestByCity = findClosestNominatimHit(nominatimDataByCity, decimalCoordinates)
                if (closestByCity.distance < 25) {
                    if (closestByCity.distance < 10) {
                        return getUnlocodeResult(entry, decimalCoordinates, closestByCity.hit)
                    }
                    return {...closestByCity.hit, decimalCoordinates, type: "Nominatim", options: undefined}
                }
            }
        }
    }

    // Go for Wikidata when its region matches the subdivision of the UN/LOCODE
    // Note that there's an argument to be made to always return Wikidata over here (or maybe even as a first choice).
    // It is very accurate, though it isn't perfect: a lot were tagged by bots. We could decide to investigate and improve Wikidata before we do either.
    if (nominatimData?.scrapeType !== "byRegion"
        && entry.subdivisionCode
        && wikiDataEntry?.subdivisionCodes.includes(entry.subdivisionCode)) {
        return {...wikiDataEntry, type: "Wikidata", decimalCoordinates: {lat: wikiDataEntry.lat, lon: wikiDataEntry.lon}}
    }

    // No overrides encountered, no results found close to the unlocode coordinates.
    // Return the first nominatim result.
    let options = undefined
    if (nominatimResult.length > 1 || wikiDataEntry) {
        options = []
        options.push(...nominatimResult)
        let wikiDataEntryUsed = false
        options.forEach(a => {
            if (!wikiDataEntryUsed && wikiDataEntry && convertToUnlocode(a.lat, a.lon) === convertToUnlocode(wikiDataEntry.lat, wikiDataEntry.lon)) {
                a.sources = [a, wikiDataEntry]
                wikiDataEntryUsed = true
            }
        })
        if (wikiDataEntry && !wikiDataEntryUsed) {
            options.push(wikiDataEntry)
        }
    }
    return {...firstNominatimResult, decimalCoordinates, type: "Nominatim", options}
}

function getUnlocodeResult(entry, decimalCoordinates, source) {
    if (!decimalCoordinates) {
        return undefined
    }
    return {...entry, decimalCoordinates, type: "UN/LOCODE", source}
}

function findClosestNominatimHit(nominatimResult, decimalCoordinates) {
    let closest = {hit: nominatimResult[0], distance: Infinity}
    for (const n of nominatimResult) {
        const d = getDistanceFromLatLonInKm(decimalCoordinates.lat, decimalCoordinates.lon, n.lat, n.lon)
        if (d < closest.distance) {
            closest = {hit: n, distance: d}
        }
    }
    return closest
}