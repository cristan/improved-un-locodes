import {readUnlocodesCsv, readSubdivisionData, readProposalCsv} from "./util/readUnlocodesCsv.js";
import {convertToDecimal} from "./util/coordinatesConverter.js";
import {getNominatimData} from "./util/nominatim-loader.js";

function deepEquals(x, y) {
    if (x === y) {
        return true;
    }
    else if ((typeof x == "object" && x != null) && (typeof y == "object" && y != null)) {
        if (Object.keys(x).length != Object.keys(y).length)
            return false;

        for (var prop in x) {
            if (y.hasOwnProperty(prop))
            {
                if (! deepEquals(x[prop], y[prop]))
                    return false;
            }
            else
                return false;
        }

        return true;
    }
    else
        return false;
}

async function validateNameWithoutDiacritics() {
    const proposalDatabase = await readProposalCsv()
    const originalDatabase = await readUnlocodesCsv()

    console.log(proposalDatabase["NLRTM"])
    console.log(originalDatabase["NLRTM"])

    const validCharactersInNameWithoutDiacritics = /^[&=,/\.'a-zA-Z0-9\s\-\(\)]+$/
    const validCharacters = /^[&=,/\.'a-zA-Z0-9\s\-\(\)řäÉáéôëåúùòýâÁàêèüóñçøíöÜÇìïÖÚÅÄîãõæØÓÔÎûÂÑÆÕÈÍ]+$/
    for (const unlocode of Object.keys(proposalDatabase)) {
        const propsedEntry = proposalDatabase[unlocode]
        const originalEntry = originalDatabase[unlocode]
        if (!originalEntry) {
            continue
        }
        // if (!validCharactersInNameWithoutDiacritics.test(propsedEntry.city)) {
        //     console.log(`[${unlocode}] ${propsedEntry.city}`)
        // }
        // if (!validCharacters.test(propsedEntry.city)) {
        //     console.log(`[${unlocode}] ${propsedEntry.city}`)
        // }
        if (!deepEquals(propsedEntry, originalEntry)) {
            console.log(`${JSON.stringify(propsedEntry)} vs ${JSON.stringify(originalEntry)}`)
        }

        // if (propsedEntry.city != originalEntry.city) {
        //     console.log(`[${unlocode}] ${propsedEntry.city} != ${originalEntry.city}`)
        // }
    }
}



validateNameWithoutDiacritics()