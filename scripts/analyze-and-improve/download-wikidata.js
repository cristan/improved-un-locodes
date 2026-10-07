import fs from "node:fs"
import {runQleverQuery} from "./util/wikidata.js";

const locationsQuery = `
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT DISTINCT ?item ?unlocode ?itemLabel ?coords
WHERE {
  ?item wdt:P1937 ?unlocode.
  ?item wdt:P625 ?coords.
  OPTIONAL { ?item rdfs:label ?itemLabel. FILTER(LANG(?itemLabel) = "en") }
}
`

// Walking the admin chain reaches the ISO-coded ancestor through municipalities and districts
// that don't have their own P300 code.
const maxAdminChainLength = 6
const adminChain = Array.from({length: maxAdminChainLength + 1}, (_, hops) => hops === 0
    ? "{ ?item wdt:P300 ?code }"
    : `{ ?item ${Array(hops).fill("wdt:P131").join("/")} ?ancestor . ?ancestor wdt:P300 ?code }`)
    .join("\n  UNION ")

const subdivisionCodesQuery = `
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
SELECT ?item (GROUP_CONCAT(DISTINCT ?code; SEPARATOR=", ") AS ?subdivisionCodes)
WHERE {
  ?item wdt:P1937 ?unlocode .
  ${adminChain}
}
GROUP BY ?item
`

const coordsRegex = /POINT\(([-\d\.]*)\s([-\d\.]*)\)/

async function downloadFromWikidata() {
    const response = await runQleverQuery(locationsQuery)
    // Sort so the JSON is stable across runs — GROUP_CONCAT's order isn't guaranteed.
    const subdivisionCodesPerItem = new Map((await runQleverQuery(subdivisionCodesQuery))
        .map(result => [result.item.value, result.subdivisionCodes.value.split(", ").sort()]))

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
                itemLabel: result.itemLabel?.value ?? result.item.value.replace("http://www.wikidata.org/entity/", ""),
                lat: extractCoordinates(result.coords.value).lat,
                lon: extractCoordinates(result.coords.value).lon,
                unlocode: result.unlocode.value,
            }
            const subdivisionCodes = subdivisionCodesPerItem.get(result.item.value)
            if (subdivisionCodes) {
                item.subdivisionCodes = subdivisionCodes
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
        lat: stripTrailingZeros(match[2]),
        lon: stripTrailingZeros(match[1])
    }
}

// QLever pads every coordinate to 6 decimals, which would claim more precision than Wikidata holds.
function stripTrailingZeros(number) {
    return number.replace(/(\.\d*[1-9])0+$|\.0+$/, "$1")
}

downloadFromWikidata()
