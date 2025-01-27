import {readCsv} from "./util/readCsv.js";
import {
    convertToBoth,
    convertToDecimal,
    convertToUnlocode,
    getDistanceFromLatLonInKm
} from "./util/coordinatesConverter.js";
import {getNominatimData} from "./util/nominatim-loader.js";
import {validateCoordinates} from "./util/coordinates-validator.js";
import {UNLOCODE_BEST} from "./manual-unlocode-best.js";
import {getInvalidRegionMessage, getNoRegionMessage} from "./util/region-validator.js";
import {readWikidata} from "./util/wikidata-reader.js";
import {detectCoordinates} from "./util/coordinate-detector.js";
import {ALIASES} from "./manual-aliases.js";

async function validateEntries() {
    // console.debug = function() {};

    const csvDatabase = await readCsv()
    const wikiData = readWikidata()

    console.log()

    const coordinatesLogs = []
    const invalidRegionMessages = []
    const noSuggestionFoundMessages = []
    const newCoordinateLogs = []
    const entriesToBeDeletedLogs = []
    const wrongNameLogs = []

    const useHtml = true
    const maxDistance = 100
    const filteredEntries = Object.values(csvDatabase).filter(entry => {
        return entry.country === "IN"
    })
    for (const entry of Object.values(filteredEntries)) {
        const unlocode = entry.unlocode

        if (ALIASES[unlocode]) {
            entriesToBeDeletedLogs.push(`https://unlocode.info/${unlocode} (${entry.city}) should be deleted in favor of https://unlocode.info/${ALIASES[unlocode]} (${csvDatabase[ALIASES[unlocode]].city})`)
            continue
        }

        const wikiEntry = wikiData[unlocode]

        const nominatimData = await getNominatimData(entry)
        const coordinatesLog = await validateCoordinates(entry, nominatimData, wikiEntry, maxDistance)
        if (coordinatesLog) {
            coordinatesLogs.push(coordinatesLog)
        } else {
            const invalidRegionMessage = getInvalidRegionMessage(entry, nominatimData)
            if (invalidRegionMessage) {
                invalidRegionMessages.push(invalidRegionMessage)
            }
        }

        if (!entry.coordinates) {
            const detected = await detectCoordinates(unlocode, csvDatabase, wikiData, 100)
            if (!detected) {
                noSuggestionFoundMessages.push(`https://unlocode.info/${entry.unlocode}: (${entry.city}): Entry could not be found and has no coordinates. Please validate if this entry should be kept`)
            } else {
                const options = detected.options ?? [detected]
                const optionsString = options
                    .map(o => {
                        if (o.sources) {
                            return `${convertToBoth(o.lat, o.lon)} Sources: ${o.sources.map(s => s.sourceUrl).join(" and ")}`
                        } else {
                            return `${convertToBoth(o.lat, o.lon)} Source: ${o.sourceUrl}`
                        }
                    })
                    .join(" or ")
                newCoordinateLogs.push(`https://unlocode.info/${unlocode} (${entry.city}) Coordinates should be set to ${optionsString}`)
            }
        }

        // TODO: also look at Nominatim
        if (wikiEntry) {
            const notSetRegex = /Q\d+/
            if(wikiEntry.itemLabel !== entry.city && !notSetRegex.test(wikiEntry.itemLabel) && !wikiEntry.alternatives.some(a => a.itemLabel !== entry.city) && !wikiEntry.itemLabel.includes(entry.city) && !entry.city.includes(wikiEntry.itemLabel)) {
                wrongNameLogs.push(`https://unlocode.info/${unlocode}: (${entry.city}): Name should be set to ${wikiEntry.itemLabel}. Source: ${wikiEntry.sourceUrl}`)
            }
        }
    }

    if (coordinatesLogs.length > 0) {
        console.log(`<h1>Location issues (${coordinatesLogs.length})</h1>`)
    }
    for (const coordinatesLog of coordinatesLogs) {
        doLog(coordinatesLog + "\n", useHtml)
    }

    if (invalidRegionMessages.length > 0) {
        console.log(`<h1>Non-valid region codes used (${invalidRegionMessages.length})</h1>`)
    }
    for (const invalidRegionMessage of invalidRegionMessages) {
        doLog(invalidRegionMessage, useHtml)
    }

    const noRegionMessages = filteredEntries.map(entry => {
        return getNoRegionMessage(entry)
    }).filter(noRegionMessage => !!noRegionMessage)

    if (noRegionMessages.length > 0) {
        console.log(`<h1>Entries without a region (${noRegionMessages.length})</h1>`)
    }
    for (const noRegionMessage of noRegionMessages) {
        doLog(noRegionMessage, useHtml)
    }

    if (entriesToBeDeletedLogs.length > 0) {
        console.log(`<h1>Entries to be deleted (${entriesToBeDeletedLogs.length})</h1>`)
    }
    for (const entriesToBeDeletedLog of entriesToBeDeletedLogs) {
        doLog(entriesToBeDeletedLog, useHtml)
    }

    if (wrongNameLogs.length > 0) {
        console.log(`<h1>Entries with incorrect names (${wrongNameLogs.length})</h1>`)
    }
    for (const wrongNameLog of wrongNameLogs) {
        doLog(wrongNameLog, useHtml)
    }

    if (newCoordinateLogs.length > 0) {
        console.log(`<h1>Suggested new coordinates (${newCoordinateLogs.length})</h1>`)
    }
    for (const newCoordinateLog of newCoordinateLogs) {
        doLog(newCoordinateLog, useHtml)
    }

    if (noSuggestionFoundMessages.length > 0) {
        console.log(`<h1>Entries who could not be found (${noSuggestionFoundMessages.length})</h1>`)
    }
    for (const noSuggestionFoundMessage of noSuggestionFoundMessages) {
        doLog(noSuggestionFoundMessage, useHtml)
    }

    const noStatusLogs = Object.values(filteredEntries).flatMap(csvEntry => csvEntry.status ? [] : `https://unlocode.info/${csvEntry.unlocode}`)
    if (noStatusLogs.length > 0) {
        console.log(`<h1>Entries without a status (${noStatusLogs.length})</h1>`)
    }
    for (const noStatusLog of noStatusLogs) {
        doLog(noStatusLog, useHtml)
    }

    const noDateLogs = Object.values(filteredEntries).flatMap(csvEntry => csvEntry.date ? [] : `https://unlocode.info/${csvEntry.unlocode}`)
    if (noDateLogs.length > 0) {
        console.log(`<h1>Entries without date (${noDateLogs.length})</h1>`)
    }
    for (const noDateLog of noDateLogs) {
        doLog(noDateLog, useHtml)
    }

    // TODO: Split location issues into pressing (1000km off plus) and regular location issues
    // TODO: take into account wikidata for the coordinate suggestions (not for GB, but definitely for IT)
    // TODO: Determine when an entry has been added in case of missing date?
    // TODO: Wrong status? (like Request Rejected or Request under Consideration, while it's more than 10 years old)
}

function doLog(text, useHtml) {
    if (!useHtml) {
        console.log(text +"\n")
    } else {
        // const urlReplacement = "https://www.openstreetmap.org/#map=12/$2/$3"
        const urlReplacement = "https://www.google.com/maps/@$2,$3,12z"

        const html = text
                .replaceAll(/https:\/\/unlocode\.info\/(\w{5})/g, '<a href="$&">$1</a>')
                .replaceAll(/(\d*[NS]\s\d*[EW]) \((-?[\d\.]*), (-?[\d\.]*)\)/g, `<a href="${urlReplacement}">$1</a>`)
        console.log(html.replaceAll("\n", "<br>")+"<br>")
    }
}

validateEntries()