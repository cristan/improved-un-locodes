import fs from "node:fs";

export function readWikidata() {
    const data = JSON.parse(fs.readFileSync('../../data/wikidata/wikidata.json', 'utf8'))
    const wikiData = {}

    data.forEach(entry => {
        const wikiDataEntry = simplifyWikidata(entry)

        if (wikiData[entry.unlocode]) {
            // Whenever there are multiple items with the same UN/LOCODE, the one with the lowest number usually is best, since it was created first
            // For example: London (Q84) vs Port of London (Q1545354)
            const existingId = Number(wikiData[entry.unlocode].sourceUrl.split("Q").pop())
            const thisId = Number(wikiDataEntry.sourceUrl.split("Q").pop())
            if (thisId < existingId) {
                wikiData[entry.unlocode] = wikiDataEntry
            }

            return
        }

        wikiData[entry.unlocode] = wikiDataEntry
    })

    // The script currently doesn't know how to handle 1 entry with 2 unlocodes. Hacky hardcoded workaround for now.
    wikiData["CNHUA"] = wikiData["CNGZG"]

    return wikiData
}

export function simplifyWikidata(entry) {
    // Strip the "XX-" country prefix on each code
    // Entries without a dash are dropped. These are rare and not ISO 3166-2 anyway.
    const subdivisionCodes = (entry.subdivisionCodes ?? [])
        .map(c => c.split("-")[1])
        .filter(c => c)

    return {
        ...entry,
        sourceUrl: entry.item,
        subdivisionCodes,
        alternatives: []
    }
}
