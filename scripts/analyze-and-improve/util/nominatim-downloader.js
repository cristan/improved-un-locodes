import fs from "node:fs"
import {SUBDIVISION_ALIASES} from "../subdivision-aliases.js";

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org/search?format=jsonv2&accept-language=en&addressdetails=1&limit=20"
const USER_AGENT = "Bot for github.com/cristan/improved-un-locodes"

export async function downloadByQueryIfNeeded(entry, query) {
    const url = `${NOMINATIM_BASE}&q=${encodeURI(query)}&countrycodes=${entry.country.toLowerCase()}`
    return downloadIfNeeded(entry, "byQuery", url)
}

export async function downloadByRegionIfNeeded(entry) {
    const region = entry.subdivisionCode
    if (!region) {
        throw new Error(`${entry.unlocode} doesn't have a subdivision — use downloadByCityIfNeeded`)
    }

    // Structured city= + country= + state=, where state= uses the current ISO 3166-2 code
    // (translating retired UN/LOCODE subdivision codes via SUBDIVISION_ALIASES).
    const isoRegion = SUBDIVISION_ALIASES[`${entry.country}|${region}`] ?? region
    const url = `${NOMINATIM_BASE}&city=${encodeURI(getDownloadCityName(entry))}&country=${encodeURI(entry.country)}&state=${entry.country}-${isoRegion}`
    return downloadIfNeeded(entry, "byRegion", url)
}

export async function downloadByCityIfNeeded(entry) {
    // Structured city= + country=, no region restriction.
    const url = `${NOMINATIM_BASE}&city=${encodeURI(getDownloadCityName(entry))}&country=${encodeURI(entry.country)}`
    return downloadIfNeeded(entry, "byCity", url)
}

/**
 * Replaces "/" by ", " in order to find entries like "Sangi/Cebu"
 */
export async function downloadByCommaQueryIfNeeded(entry) {
    const name = entry.city
        .replace(/\s\(.*\)/, "")
        .replace(" Apt", " Airport")
    const query = name.split("/").map(s => s.trim()).join(", ") + ", " + entry.country
    const url = `${NOMINATIM_BASE}&q=${encodeURI(query)}&countrycodes=${entry.country.toLowerCase()}`
    return downloadIfNeeded(entry, "byCommaQuery", url)
}

/**
 * Downloads Nominatim's response for `nominatimUrl` and caches it under
 * `data/nominatim/{country}/{location}/{subdir}/{unlocode}.json`.
 * If the cached file already exists, returns immediately without hitting the network.
 */
async function downloadIfNeeded(entry, subdir, nominatimUrl) {
    const directory = `../../data/nominatim/${entry.country}/${entry.location}/${subdir}`
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
    const fileName = `${directory}/${entry.unlocode}.json`
    if (fs.existsSync(fileName)) return

    await delay(1000)
    const fromNominatim = await (await fetch(nominatimUrl, {
        headers: { 'User-Agent': USER_AGENT }
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
