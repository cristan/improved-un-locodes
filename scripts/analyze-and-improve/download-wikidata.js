import fs from "node:fs"
import {runWikidataQuery} from "./util/wikidata.js";

// P131* walks the admin chain transitively, so we reach the ISO-coded ancestor through
// municipalities/districts that don't have their own P300 code.
const sparqlQuery = `
SELECT DISTINCT ?item ?unlocode ?itemLabel ?coords (GROUP_CONCAT(DISTINCT ?code; SEPARATOR=", ") AS ?subdivisionCodes)
WHERE {
  ?item wdt:P1937 ?unlocode.
  ?item wdt:P625 ?coords.
  OPTIONAL {
    ?item wdt:P131* ?adminEntity.
    ?adminEntity wdt:P300 ?code.
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
GROUP BY ?item ?unlocode ?itemLabel ?coords
`

const coordsRegex = /Point\(([-\d\.]*)\s([-\d\.]*)\)/

async function downloadFromWikidata() {
    const response = await runWikidataQuery(sparqlQuery)

    const simplifiedData = response
        .filter(result => {
            const match = coordsRegex.exec(result.coords.value)
            if (!match || match.length < 3) {
                console.warn(`Unexpected coordinates format at ${JSON.stringify(result)}`)
                return false
            }
            return true
        })
        .map(result => {
            const item = {
                item: result.item.value,
                itemLabel: result.itemLabel.value,
                lat: extractCoordinates(result.coords.value).lat,
                lon: extractCoordinates(result.coords.value).lon,
                unlocode: result.unlocode.value,
            }
            if (result.subdivisionCodes.value) {
                // Sort so the JSON is stable across runs — GROUP_CONCAT's order isn't guaranteed.
                item.subdivisionCodes = result.subdivisionCodes.value.split(", ").sort()
            }
            return item
        })


    // Sort the data, so they will have a consistent order
    // This will help a lot with handling the wikidata dataset in Git
    // Done client-side to reduce load on the Wikidata server: the query is heavy enough as it is.
    const allDataSorted = simplifiedData.sort(function (a, b) {
        // Sometimes, the same item has multiple coordinates, resulting in the item getting returned multiple times,
        // hence we also sort on coordinates. Example: https://www.wikidata.org/wiki/Q6799987 or https://www.wikidata.org/wiki/Q3529964
        // Sorting is more of a hack though: we just want 1 coordinate: the most important one. In the 2 previous example, it can be determined,
        // but in most cases like https://www.wikidata.org/wiki/Q406639 you just have 2 and both are fine, but we need to pick one (the newest?).
        return a.unlocode.localeCompare(b.unlocode) || a.item.localeCompare(b.item) || a.lat.localeCompare(b.lat) || a.lon.localeCompare(b.lon)
    })

    await fs.writeFileSync("../../data/wikidata/wikidata.json", JSON.stringify(allDataSorted, null, 2))
}

function extractCoordinates(coordsValue) {
    const match = coordsRegex.exec(coordsValue)
    return {
        lat: match[2],
        lon: match[1]
    }
}

downloadFromWikidata()
