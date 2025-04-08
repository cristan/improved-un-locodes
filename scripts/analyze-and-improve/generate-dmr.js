import {readUnlocodesCsv} from "./util/readUnlocodesCsv.js";
import {readWikidata} from "./util/wikidata-reader.js";
import fs from "node:fs";
import {delay} from "./util/nominatim-downloader.js";

const unlocodes = ["ESMAD", "USABQ", "USLAX", "TRANK", "USATL", "USAUS", "AZBAK", "GHACC", "USBUF", "ROBUH", "KENBO", "VECCS", "PHCEB", "USCMH", "USDEN", "INHYD", "GBLON", "USLRO", "USBNA", "USMSY", "USOAK", "LULUX", "USMIA", "ITMIL", "USMES", "UYMVD", "IEDUB", "MXGDL", "CNGZG", "FIHEL", "ESBCN", "USCHI", "USPHX", "USPHL", "USSAT", "USDAL", "INDEL", "PKKHI", "PKLHE", "PHMNL", "PELIM", "IDMES", "MYKUL", "KWKWI", "NGLOS", "CDFIH", "ETADD", "SDKRT", "AOLAD", "DELEJ", "USMEM", "USMSY", "HTPAP", "SRPBM", "USSFO", "USSEA", "SGSIN", "MKSKP", "USSLC", "USTPA", "HNTGU", "LBKYE", "CATOR", "TNTUN", "ESVLC", "CAOTT", "CUSCU", "CAQUE", "CAMTR", "CAVAN", "USPIT", "USPQD", "INPNQ", "ZAPLZ", "NGPHC", "MUPLU", "EGPSD", "CZPRG", "ECUIO", "USRAG", "USRCH", "LVRIX", "USROC", "USSAT", "USWAS", "CAWNP", "MMRGN", "ESZAZ", "CHZRH", ]
let beginning = 16000
const username = ""
const email = ""

async function generateDmr() {
    const csvDatabase = await readUnlocodesCsv()
    const csvImprovedDatabase = await readUnlocodesCsv(true)
    const wikidataDatabase = readWikidata()

    const dataOut = fs.createWriteStream('./dmr.csv')

    const today = new Date().toLocaleDateString("en-US")

    const filteredEntries = Object.values(csvImprovedDatabase).filter(entry => {
        return entry.country === "IT"
    })

    for (const entry of Object.values(filteredEntries)) {
        const unlocode = entry.unlocode
        if (csvDatabase[unlocode].coordinates) {
            // When there already are coordinates, skip it.
            continue
        }
        // const entry = csvImprovedDatabase[unlocode]
        const wikiDataEntry = wikidataDatabase[unlocode]
        let webLink = undefined
        if (!wikiDataEntry) {
            console.log(`No wikidata entry found for ${unlocode} (${entry.city})`)
            continue
        } else {
            webLink = await getWikipediaUrl(wikiDataEntry.item)
            if (!webLink) {
                continue
            }
        }
        const columns = ["", `UN-2025-${beginning++}`, "|", "",unlocode.substring(0, 2),"",unlocode.substring(2),"","","","","","","","",entry.coordinates, "", "", "", webLink, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", today, username, email]
        writeCsv(dataOut, columns)
    }
}

async function getWikipediaUrl(wikiDataId) {
    const directory = `../../data/wikidata/wikipedia-urls`
    if (!fs.existsSync(directory)){
        fs.mkdirSync(directory, { recursive: true });
    }
    const realWikiDataId = wikiDataId.replace("http://www.wikidata.org/entity/", "")
    const fileName = `${directory}/${realWikiDataId}.json`
    const fileAlreadyExists = fs.existsSync(fileName)
    if (!fileAlreadyExists) {
        console.log(`Downloading ${realWikiDataId}.`)
        const wikiDataQuery = `https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=sitelinks&ids=${realWikiDataId}`
        await delay(1000)
        const resultAsText = await (await fetch(wikiDataQuery)).text()
        await fs.writeFileSync(fileName, resultAsText)
    }
    const fileContents = fs.readFileSync(fileName, 'utf8')
    const sitelinks = JSON.parse(fileContents).entities[realWikiDataId].sitelinks
    const sitelink = sitelinks.enwiki ?? sitelinks.itwiki
    if (!sitelink) {
        console.log(`No enwiki or itwiki entry found for ${wikiDataId}`)
        return undefined
    }
    return `https://${sitelink.site.substring(0, 2)}.wikipedia.org/wiki/${sitelink.title}`.replaceAll(" ", "_")
}

generateDmr()