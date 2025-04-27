import {readUnlocodesCsv, readSubdivisionData} from "./util/readUnlocodesCsv.js";
import {convertToDecimal} from "./util/coordinatesConverter.js";

async function validateRegionCodes() {
    const csvDatabase = await readUnlocodesCsv(true)
    // const subdivisions = readSubdivisionData()

    let count = 0
    let allCount = 0
    for (const unlocode of Object.keys(csvDatabase)) {
        allCount++

        const entry = csvDatabase[unlocode]

        const decimalCoordinates = convertToDecimal(entry.coordinates)
        if (!decimalCoordinates) {
            console.log(`https://unlocode.info/${unlocode} ${unlocode} ${entry.city} https://www.google.com/search?q=${encodeURIComponent(entry.city +", "+ entry.countryName)}`)
            // console.log(entry.iata !== "" ? entry.iata : entry.location)
            count++
            continue
        }
    }
    console.log(count +" out of "+ allCount +`(${100-((count / allCount) * 100)}%)`)
}

validateRegionCodes()
// I didn't check the /JP items yet: there are a lot of them and few have actually relevant results.