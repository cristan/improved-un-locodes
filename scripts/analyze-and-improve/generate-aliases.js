import {readUnlocodesCsv} from "./util/readUnlocodesCsv.js";
import fs from "node:fs";
import {writeCsv} from "./util/csv.js";
import {runWikidataQuery} from "./util/wikidata.js";

async function generateAliases() {
    const csvDatabase = await readUnlocodesCsv()
    const sparqlQuery = `
  SELECT ?unlocode ?spelling
WHERE {
  ?place wdt:P1937 ?unlocode.

  {
    ?place rdfs:label ?spelling.
  }
  UNION
  {
    ?place skos:altLabel ?spelling.
  }
}
`;
    const queried = await runWikidataQuery(sparqlQuery);
    const dataSorted = queried.sort(function (a, b) {
        return a.unlocode.value.localeCompare(b.unlocode.value) || a.spelling.value.localeCompare(b.spelling.value)
    })

    const dataOut = fs.createWriteStream('../../data/aliases-improved.csv')
    writeCsv(dataOut, ["Unlocode", "Alias"])

    const addedSpellings = {}
    for (const entry of Object.values(dataSorted)) {
        const unlocode = entry.unlocode.value
        const spelling = entry.spelling.value
        if (!csvDatabase[unlocode]) {
            console.log(`Received spelling ${spelling} for unlocode ${unlocode}, but that UN/LOCODE doesn't exist. Skipping.`)
            continue
        }
        if (addedSpellings[unlocode +"|"+ spelling]) {
            continue
        }
        if (spelling === csvDatabase[unlocode].city) {
            continue
        }
        addedSpellings[unlocode +"|"+ spelling] = true

        const columns = [unlocode, spelling]
        writeCsv(dataOut, columns)
    }
}

generateAliases()