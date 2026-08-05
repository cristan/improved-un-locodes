import {coordinatesRegex} from "./util/coordinatesConverter.js"
import {readUnlocodesCsv} from "./util/readUnlocodesCsv.js"

async function validateBrokenCoordinates() {
    const csvDatabase = await readUnlocodesCsv(true)
    for (const unlocode of Object.keys(csvDatabase)) {
        const coordinates = csvDatabase[unlocode].coordinates
        if (!coordinates) {
            continue
        }

        const match = coordinates.match(coordinatesRegex)
        if (!match) {
            console.log(`Invalid coordinate format for ${unlocode}: ${coordinates}`)
            continue
        }

        const latDegrees = parseInt(match[1])
        const latMinutes = parseInt(match[2])
        const lonDegrees = parseInt(match[4])
        const lonMinutes = parseInt(match[5])

        if (latDegrees > 90) {
            console.log(`Invalid latitude degrees for ${unlocode}: ${coordinates} (degrees=${latDegrees}, must be 0-90).`)
        } else if (lonDegrees > 180) {
            console.log(`Invalid longitude degrees for ${unlocode}: ${coordinates} (degrees=${lonDegrees}, must be 0-180).`)
        } else if (latMinutes >= 60) {
            console.log(`Invalid latitude minutes for ${unlocode}: ${coordinates} (minutes=${latMinutes}, must be 0-59).`)
        } else if (lonMinutes >= 60) {
            console.log(`Invalid longitude minutes for ${unlocode}: ${coordinates} (minutes=${lonMinutes}, must be 0-59).`)
        }
    }
}

validateBrokenCoordinates()
