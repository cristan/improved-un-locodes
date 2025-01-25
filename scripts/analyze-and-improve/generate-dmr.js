import {readCsv} from "./util/readCsv.js";
import {readWikidata} from "./util/wikidata-reader.js";
import fs from "node:fs";
import {delay} from "./util/nominatim-downloader.js";

const unlocodes = ["ESMAD", "USABQ", "USLAX", "TRANK", "USATL", "USAUS", "AZBAK", "GHACC", "USBUF", "ROBUH", "KENBO", "VECCS", "PHCEB", "USCMH", "USDEN", "INHYD", "GBLON", "USLRO", "USBNA", "USMSY", "USOAK", "LULUX", "USMIA", "ITMIL", "USMES", "UYMVD", "IEDUB", "MXGDL", "CNGZG", "FIHEL", "ESBCN", "USCHI", "USPHX", "USPHL", "USSAT", "USDAL", "INDEL", "PKKHI", "PKLHE", "PHMNL", "PELIM", "IDMES", "MYKUL", "KWKWI", "NGLOS", "CDFIH", "ETADD", "SDKRT", "AOLAD", "DELEJ", "USMEM", "USMSY", "HTPAP", "SRPBM", "USSFO", "USSEA", "SGSIN", "MKSKP", "USSLC", "USTPA", "HNTGU", "LBKYE", "CATOR", "TNTUN", "ESVLC", "CAOTT", "CUSCU", "CAQUE", "CAMTR", "CAVAN", "USPIT", "USPQD", "INPNQ", "ZAPLZ", "NGPHC", "MUPLU", "EGPSD", "CZPRG", "ECUIO", "USRAG", "USRCH", "LVRIX", "USROC", "USSAT", "USWAS", "CAWNP", "MMRGN", "ESZAZ", "CHZRH", ]
let beginning = 16000

async function generateDmr() {
    // const csvDatabase = await readCsv()
    const csvImprovedDatabase = await readCsv(true)
    const wikidataDatabase = readWikidata()

    const dataOut = fs.createWriteStream('./dmr.csv')

    for (const unlocode of unlocodes) {
        const entry = csvImprovedDatabase[unlocode]
        const fromWikiData = wikidataDatabase[unlocode]
        let webLink = undefined
        if (!fromWikiData) {
            console.log(`No wikidata entry found for ${unlocode} (${entry.city})`)
        } else {
            webLink = await getEnWikipediaUrl(fromWikiData.item)
        }
        const columns = ["", `UN-2025-${beginning++}`, "|", "",unlocode.substring(0, 2),"",unlocode.substring(2),"","","","","","","","",entry.coordinates, "", "", "", webLink]
        writeCsv(dataOut, columns)
    }
}

async function getEnWikipediaUrl(wikiDataId) {
    const directory = `../../data/wikidata/wikipedia-urls`
    if (!fs.existsSync(directory)){
        fs.mkdirSync(directory, { recursive: true });
    }
    const realWikiDataId = wikiDataId.replace("http://www.wikidata.org/entity/", "")
    const fileName = `${directory}/${realWikiDataId}.json`
    const fileAlreadyExists = fs.existsSync(fileName)
    if (!fileAlreadyExists) {
        const wikiDataQuery = `https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=sitelinks&ids=${realWikiDataId}&sitefilter=enwiki`
        await delay(1000)
        const resultAsText = await (await fetch(wikiDataQuery)).text()
        await fs.writeFileSync(fileName, resultAsText)
    }
    const fileContents = fs.readFileSync(fileName, 'utf8');
    const enWikiTitle = JSON.parse(fileContents).entities[realWikiDataId].sitelinks.enwiki.title;
    return `https://en.wikipedia.org/wiki/${enWikiTitle}`.replaceAll(" ", "_")
}

function writeCsv(dataOut, entries) {
    const withQuotesIfNeeded = entries.map(entry => {
        if (typeof entry === "string" && entry.includes(",")) {
            return `\"${entry}\"`
        } else {
            return entry
        }
    })
    dataOut.write(withQuotesIfNeeded.join(",")+ "\n")
}

generateDmr()