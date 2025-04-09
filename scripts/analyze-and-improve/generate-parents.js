import {readUnlocodesCsv} from "./util/readUnlocodesCsv.js";
import {runWikidataQuery} from "./util/wikidata.js";
import fs from "node:fs";
import {writeCsv} from "./util/csv.js";

async function generateParents() {
    const csvDatabase = await readUnlocodesCsv()
    const sparqlQuery = `
SELECT DISTINCT ?locode ?parent ?topParent WHERE {
  # Get the child with a locode
  ?childEntity wdt:P1937 ?locode ;
               wdt:P131 ?parentEntity .
  
  # Get the direct parent and its locode (if it exists)
  OPTIONAL {
    ?parentEntity wdt:P1937 ?parent .
  }
  
  # Get the top-level parent (even if the direct parent doesn't have a locode)
  OPTIONAL {
    ?parentEntity wdt:P131* ?topParentEntity .
    ?topParentEntity wdt:P1937 ?topParent .
  }
}
`;
    const queried = await runWikidataQuery(sparqlQuery);

    const data = []
    for (const queriedElement of queried) {
        const parent = queriedElement.parent?.value || queriedElement.topParent?.value;
        if (!parent) {
            continue
        }
        const entry = {
            unlocode: queriedElement.locode.value,
            parent
        }
        if (!data.some(e => e.unlocode === entry.unlocode && e.parent === entry.parent)) {
            data.push(entry)
        }
    }

    const dataSorted = data.sort(function (a, b) {
        return a.unlocode.localeCompare(b.unlocode) || a.parent.localeCompare(b.parent)
    })

    const dataOut = fs.createWriteStream('../../data/parents.csv')
    writeCsv(dataOut, ["Unlocode", "Parent"])

    for (const entry of Object.values(dataSorted)) {
        const unlocode = entry.unlocode
        const parent = entry.parent
        if (unlocode === parent) {
            continue
        }

        if (!csvDatabase[unlocode]) {
            console.log(`Unlocode ${unlocode} not found in database`)
            continue
        }
        if (!csvDatabase[parent]) {
            console.log(`Unlocode ${parent} not found in database`)
            continue
        }

        const columns = [unlocode, parent]
        writeCsv(dataOut, columns)
    }
}

generateParents()