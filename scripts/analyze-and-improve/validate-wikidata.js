import {parseCSV, readCsv} from "./util/readCsv.js";
import {getNominatimData} from "./util/nominatim-loader.js";
import {readWikidata} from "./util/wikidata-reader.js";
import {delay} from "./util/nominatim-downloader.js";
import {runWikidataQuery} from "./download-wikidata.js";
import fs from "node:fs";

const municipalityOfTheNetherlands = "Q2039348"

async function createReport() {
    const csvDatabase = await readCsv()
    const wikiData = readWikidata()

    const commonUnlocodes = readCommonUnlocodes()

    for (const unlocode of commonUnlocodes) {
        const entry = csvDatabase[unlocode]

        let count = 0

        const wikiDataEntry = wikiData[unlocode]
        if (!wikiDataEntry) {
            await delay(1000)
            const nominatimData = await getNominatimData(entry)
            if (!nominatimData) {
                continue
            }
            const osmId = nominatimData.result[0].osm_id;
            // console.log(`${unlocode} (${entry.city}) has no Wikidata entry. ${osmId}`)

            const entries = await queryWikidata(entry.city, entry.country)
            if (!entries.length) {
                console.log(`https://unlocode.info/${unlocode} ${entry.city}: No Wikidata entry found`)
                continue
            }
            const veryLikelyMatch = entries.find(entry => entry.osmRelationID == osmId && entry.instanceType !== municipalityOfTheNetherlands)
            if (veryLikelyMatch) {
                console.log(`https://unlocode.info/${unlocode} ${entry.city}: ${veryLikelyMatch.url} should have the un/locode ${unlocode}`)
                continue
            } else {
                for (const wdEntry of entries) {
                    console.log(`https://unlocode.info/${unlocode} ${entry.city}: ${wdEntry.url} should maybe have the un/locode ${unlocode}. OpenStreetMap ID: ${wdEntry.osmRelationID}`)
                }
            }

            count++
            if (count >= 3) {
                break
            }
        }
    }
}

createReport()

function readCommonUnlocodes() {
    const records = fs.readFileSync(`common-unlocodes.csv`, 'utf8').split("\n");
    const unlocodes = []
    for (const record of records) {
        const columns = parseCSV(record)
        unlocodes.push(columns[0])
    }
    return unlocodes
}

async function queryWikidata(name, countryCode) {
    const countryCodes = {
        'NL': 'Q55',
        'DE': 'Q183',
        'CN': 'Q148',
        'IN': 'Q668',
        'US': 'Q30',
        'MY': 'Q833',
        'TH': 'Q869',
        'KR': 'Q884',
        'ID': 'Q252',
        'TW': 'Q865',
        'TR': 'Q43',
        'CZ': 'Q213',
        'CA': 'Q16',
        'JO': 'Q810',
        'VN': 'Q881',
        'EG': 'Q79',
        'ES': 'Q29',
        'PA': 'Q804',
        'PL': 'Q36',
        'MT': 'Q233',
        'AE': 'Q878',
        'AR': 'Q414',
        'AT': 'Q40',
        'AU': 'Q408',
        'BD': 'Q902',
        'BE': 'Q31',
        'BH': 'Q398',
        'BR': 'Q155',
        'BS': 'Q778',
        'CM': 'Q1009',
        'CO': 'Q739',
        'DJ': 'Q977',
        'DK': 'Q35',
        'DO': 'Q786',
        'DZ': 'Q262',
        'EC': 'Q736',
        'ER': 'Q986',
        'FI': 'Q33',
        'FR': 'Q142',
        'GB': 'Q145',
        'GH': 'Q117',
        'GN': 'Q1006',
        'GP': 'Q17012',
        'GR': 'Q41',
        'GT': 'Q774',
        'HK': 'Q8646',
        'HU': 'Q28',
        'IE': 'Q27',
        'IL': 'Q801',
        'IQ': 'Q796',
        'IT': 'Q38',
        'JM': 'Q766',
        'JP': 'Q17',
        'KE': 'Q114',
        'KW': 'Q817',
        'LB': 'Q822',
        'LK': 'Q854',
        'MA': 'Q1028',
        'MR': 'Q1025',
        'MU': 'Q1027',
        'MX': 'Q96',
        'MZ': 'Q1029',
        'NO': 'Q20',
        'NZ': 'Q664',
        'OM': 'Q842',
        'PE': 'Q419',
        'PH': 'Q928',
        'PK': 'Q843',
        'PT': 'Q45',
        'QA': 'Q846',
        'RE': 'Q17070',
        'RO': 'Q218',
        'SA': 'Q851',
        'SE': 'Q34',
        'SG': 'Q334',
        'SK': 'Q214',
        'SN': 'Q1041',
        'TZ': 'Q924',
        'UY': 'Q77',
        'YE': 'Q805',
        'ZA': 'Q258'
    };
    const countryItem = countryCodes[countryCode]
    if (!countryItem) {
        throw new Error(`Unexpected country code ${countryCode} for entry with name ${name}`)
    }

    const sparqlQuery = `
  SELECT ?item ?itemLabel ?osmRelationID ?instanceType WHERE {
    ?item rdfs:label "${name}"@en;
          wdt:P17 wd:${countryItem};  # P17 = country
          wdt:P31 ?instanceType.
    
    FILTER NOT EXISTS { ?item wdt:P31 wd:Q106259. } # Should not be instance of polder (Q106259), 
    FILTER NOT EXISTS { ?item wdt:P31 wd:Q12529452. } # Should not be instance of landform (Q12529452), 
    FILTER NOT EXISTS { ?item wdt:P31 wd:Q79007. } # Should not be instance of street (Q79007), 
    
    OPTIONAL { ?item wdt:P402 ?osmRelationID. }  # OPTIONAL for P402
    
    SERVICE wikibase:label {
      bd:serviceParam wikibase:language "en".
    }    
  }
`;

    const queried = await runWikidataQuery(sparqlQuery);
    // console.log(JSON.stringify(queried, null, 4))
    const toReturn = queried.results.bindings.map(result => {
        return {
            url: result.item.value,
            name: result.itemLabel.value,
            osmRelationID: result.osmRelationID?.value,
            instanceType: result.instanceType.value.replace("http://www.wikidata.org/entity/", "")
        }
    });
    return toReturn
}