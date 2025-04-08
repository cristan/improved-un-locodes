import fs from "node:fs"
import {parseCSV} from "./csv.js";

const UNLOCODE_COLUMN_CHANGE = 0
const UNLOCODE_COLUMN_COUNTRY = 1
const UNLOCODE_COLUMN_LOCATION = 2
const UNLOCODE_COLUMN_CITY = 3
const UNLOCODE_COLUMN_NAME_WITHOUT_DIACRITICS = 4
const UNLOCODE_COLUMN_SUBDIVISION = 5
const UNLOCODE_COLUMN_STATUS = 6
const UNLOCODE_COLUMN_FUNCTION = 7
const UNLOCODE_COLUMN_DATE = 8
const UNLOCODE_COLUMN_IATA = 9
const UNLOCODE_COLUMN_COORDINATES = 10
const UNLOCODE_COLUMN_REMARKS = 11

export function readSubdivisionData() {
    const subdivisionCodesRaw = fs.readFileSync("../../data/subdivision-codes.csv", 'utf8').split("\n")
    subdivisionCodesRaw.shift()
    const subdivisionDatabase = {}
    for (const record of subdivisionCodesRaw) {
        const columns = parseCSV(record)
        const countryCode = columns[0]
        const subdivisionCode = columns[1]
        const subdivisionName = columns[2]
        subdivisionDatabase[`${countryCode}|${subdivisionCode}`] = subdivisionName
    }
    return subdivisionDatabase
}

export async function readUnlocodesCsv(improved = false) {
    const subdivisionDatabase = readSubdivisionData()

    const countryList = fs.readFileSync(`../../data/country-codes.csv`, 'utf8').split("\r\n")
    // Ignore the first entry: that's the header
    countryList.shift()
    const countries = {}
    for (const record of countryList) {
        const columns = parseCSV(record)
        countries[columns[0]] = columns[1]
    }

    const codeList = fs.readFileSync(`../../data/code-list${improved ? '-improved' : ''}.csv`, 'utf8').split(improved ? "\n" : "\r\n")
    // Ignore the first entry: that's the header
    codeList.shift()
    const csvDatabase = {}
    for (const record of codeList) {
        const columns = parseCSV(record)
        if (columns[UNLOCODE_COLUMN_COUNTRY] === undefined) {
            continue
        }

        const change = columns[UNLOCODE_COLUMN_CHANGE]
        const country = columns[UNLOCODE_COLUMN_COUNTRY]
        const countryName = countries[country]
        const location = columns[UNLOCODE_COLUMN_LOCATION]
        const unlocode = `${country}${location}`
        const city = columns[UNLOCODE_COLUMN_CITY]
        const nameWithoutDiacritics = columns[UNLOCODE_COLUMN_NAME_WITHOUT_DIACRITICS]
        const subdivisionCode = columns[UNLOCODE_COLUMN_SUBDIVISION]
        const subdivisionName = subdivisionDatabase[`${country}|${subdivisionCode}`]
        const status = columns[UNLOCODE_COLUMN_STATUS]
        const function_ = columns[UNLOCODE_COLUMN_FUNCTION]
        const date = columns[UNLOCODE_COLUMN_DATE]
        const iata = columns[UNLOCODE_COLUMN_IATA]
        const coordinates = columns[UNLOCODE_COLUMN_COORDINATES]
        const remarks = columns[UNLOCODE_COLUMN_REMARKS]

        const unlocodeEntry = { change, city, country, countryName, nameWithoutDiacritics, location, subdivisionCode, subdivisionName, status, "function": function_, coordinates, date, iata, unlocode, remarks };
        if (improved) {
            const source = columns[13]
            csvDatabase[unlocode] = {
                source,
                ...unlocodeEntry
            }
        } else {
            csvDatabase[unlocode] = unlocodeEntry
        }
    }
    return csvDatabase
}