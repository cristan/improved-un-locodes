import fs from "node:fs"
import {SUBDIVISION_ALIASES} from "../subdivision-aliases.js";

export async function downloadByQueryIfNeeded(entry, query) {
    const directory = `../../data/nominatim/${entry.country}/${entry.location}/byQuery`
    if (!fs.existsSync(directory)){
        fs.mkdirSync(directory, { recursive: true });
    }
    const fileName = `${directory}/${entry.unlocode}.json`
    const fileAlreadyExists = fs.existsSync(fileName)
    if (fileAlreadyExists) {
        // console.log(`${fileName} already exists. Skipping.`)
        return
    }

    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=jsonv2&accept-language=en&addressdetails=1&limit=20&q=${encodeURI(query)}&countrycodes=${entry.country.toLowerCase()}`
    await delay(1000)
    const fromNominatim = await (await fetch(nominatimUrl, {
        headers: { 'User-Agent': 'Bot for github.com/cristan/improved-un-locodes' }
    })).text()
    await fs.writeFileSync(fileName, fromNominatim)
}

export async function downloadByRegionIfNeeded(entry) {
    const region = entry.subdivisionCode
    if (!region) {
        throw new Error(`${entry.unlocode} doesn't have a subdivision — use downloadByCityIfNeeded`)
    }

    const directory = `../../data/nominatim/${entry.country}/${entry.location}/byRegion`
    if (!fs.existsSync(directory)){
        fs.mkdirSync(directory, { recursive: true });
    }
    const fileName = `${directory}/${entry.unlocode}.json`
    if (fs.existsSync(fileName)) return

    // Structured city= + country= + state=, where state= uses the current ISO 3166-2 code
    // (translating retired UN/LOCODE subdivision codes via SUBDIVISION_ALIASES).
    const isoRegion = SUBDIVISION_ALIASES[`${entry.country}|${region}`] ?? region
    const nominatimQuery = `https://nominatim.openstreetmap.org/search?format=jsonv2&accept-language=en&addressdetails=1&limit=20&city=${encodeURI(getDownloadCityName(entry))}&country=${encodeURI(entry.country)}&state=${entry.country}-${isoRegion}`
    await delay(1000)
    const fromNominatim = await (await fetch(nominatimQuery, {
        headers: { 'User-Agent': 'Bot for github.com/cristan/improved-un-locodes' }
    })).text()
    await fs.writeFileSync(fileName, fromNominatim)
}

export async function downloadByCityIfNeeded(entry) {
    const directory = `../../data/nominatim/${entry.country}/${entry.location}/byCity`
    if (!fs.existsSync(directory)){
        fs.mkdirSync(directory, { recursive: true });
    }
    const fileName = `${directory}/${entry.unlocode}.json`
    if (fs.existsSync(fileName)) return

    // Structured city= + country=, no region restriction.
    const nominatimQuery = `https://nominatim.openstreetmap.org/search?format=jsonv2&accept-language=en&addressdetails=1&limit=20&city=${encodeURI(getDownloadCityName(entry))}&country=${encodeURI(entry.country)}`
    await delay(1000)
    const fromNominatim = await (await fetch(nominatimQuery, {
        headers: { 'User-Agent': 'Bot for github.com/cristan/improved-un-locodes' }
    })).text()
    await fs.writeFileSync(fileName, fromNominatim)
}

export function getDownloadCityName(entry) {
    const cityName = entry.city;
    return cityName
        .replace(/\s\(.*\)/, "")
        .replace(/\/.*/, "")
        .replace(" Apt", " Airport")
}

export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
