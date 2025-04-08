import {readUnlocodesCsv} from "./util/readUnlocodesCsv.js";
import {convertToDecimal, convertToUnlocode, getDistanceFromLatLonInKm} from "./util/coordinatesConverter.js";
import {readWikidata} from "./util/wikidata-reader.js";
import {UNLOCODE_BEST} from "./manual-unlocode-best.js";

// Before you run this, make sure to run download-wikidata.js to compare with the latest state at Wikidata
async function validateAllCoordinates() {
    const csvDatabase = await readUnlocodesCsv(true)
    const wikidata = readWikidata();

    console.log()

    let allCount = 0
    let count = 0
    for (const unlocode of Object.keys(csvDatabase)) {
        const entry = csvDatabase[unlocode]

        const decimalCoordinates = convertToDecimal(entry.coordinates)
        const wikiEntry = wikidata[unlocode];
        if (!decimalCoordinates || !wikiEntry) {
            continue
        }

        const distance = Math.round(getDistanceFromLatLonInKm(decimalCoordinates.lat, decimalCoordinates.lon, wikiEntry.lat, wikiEntry.lon))
        if (distance > 100 && !UNLOCODE_BEST.includes(unlocode)) {
            console.log(`https://unlocode.info/${unlocode} ${entry.city} vs ${wikiEntry.itemLabel} ${distance}km distance between https://www.google.com/maps?z=12&ll=${decimalCoordinates.lat},${decimalCoordinates.lon} and https://www.google.com/maps?z=12&ll=${wikiEntry.lat},${wikiEntry.lon}. ${unlocode},${convertToUnlocode(wikiEntry.lat, wikiEntry.lon)} Source: ${wikiEntry.sourceUrl}`)
            count++
        }
        allCount++
    }
    console.log(count +" out of "+ allCount +`(${((count / allCount) * 100)}%)`)
}

// Checked until PEBLP
validateAllCoordinates()