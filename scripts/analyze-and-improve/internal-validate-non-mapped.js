import {readUnlocodesCsv, readSubdivisionData} from "./util/readUnlocodesCsv.js";
import {convertToDecimal} from "./util/coordinatesConverter.js";

async function validateNonMapped() {
    const csvDatabase = await readUnlocodesCsv(true)
    // const subdivisions = readSubdivisionData()

    let count = 0
    let allCount = 0
    for (const unlocode of Object.keys(csvDatabase)) {
        allCount++

        const entry = csvDatabase[unlocode]

        const decimalCoordinates = convertToDecimal(entry.coordinates)
        if (!decimalCoordinates) {
            console.log(`${unlocode} | ${entry.city} | ${entry.subdivisionCode} | ${entry.subdivisionName??""} ${entry["function"]} | ${entry.date} | ${entry.status}`)
            // console.log(entry.iata !== "" ? entry.iata : entry.location)
            count++
            continue
        }
    }
    console.log(count +" out of "+ allCount +`(${100-((count / allCount) * 100)}%)`)
}

validateNonMapped()
// I didn't check the /JP items yet: there are a lot of them and few have actually relevant results. I did let gemini check them, so there's likely little useful locations left.