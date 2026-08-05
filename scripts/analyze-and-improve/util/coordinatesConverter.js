export const coordinatesRegex = /^(\d{2})(\d{2})([NS])\s+(\d{3})(\d{2})([EW])$/
export const decimalRegex = /^(\d+\.\d+)([NS])\s(\d+\.\d+)([EW])$/

const MAX_LATITUDE = 90
const MAX_LONGITUDE = 180

function toDecimal(degrees, minutes, direction, maxDegrees, negativeDirection) {
    if (minutes >= 60 || degrees > maxDegrees) {
        return undefined
    }
    const decimal = degrees + minutes / 60
    return `${direction === negativeDirection ? "-" : ""}${decimal.toFixed(5)}`
}

export function convertToDecimal(input) {
    if (!input) {
        return ""
    }

    if (input === "2444N 05045") {
        input = "2444N 05045E"
    }

    const decimalMatch = input.match(decimalRegex)
    if (decimalMatch) {
        return {
            lat: `${decimalMatch[0] === 'S' ? "-" : ""}${decimalMatch[1]}`,
            lon: `${decimalMatch[2] === 'W' ? "-" : ""}${decimalMatch[3]}`
        }
    }

    const latMatch = input.match(coordinatesRegex)
    if (!latMatch) {
        console.warn(`Invalid coordinate format ${input}`)
        return undefined
    }

    const lat = toDecimal(parseInt(latMatch[1]), parseInt(latMatch[2]), latMatch[3], MAX_LATITUDE, 'S')
    const lon = toDecimal(parseInt(latMatch[4]), parseInt(latMatch[5]), latMatch[6], MAX_LONGITUDE, 'W')
    if (lat === undefined || lon === undefined) {
        return undefined
    }

    return {lat, lon}
}

export function convertNmToUnlocodeText(nm) {
    return `<a href="${nm.sourceUrl}">${convertToUnlocode(nm.lat, nm.lon)}</a>`
}

export function convertToBoth(lat, lon) {
    return `${convertToUnlocode(lat, lon)} (${lat}, ${lon})`
}

export function convertToUnlocode(decimalLat, decimalLon) {
    const latDegreesMinutes = convertToDegreesMinutes(Math.abs(decimalLat));
    const lonDegreesMinutes = convertToDegreesMinutes(Math.abs(decimalLon));

    const latDirection = convertToDirection(decimalLat, 'N', 'S');
    const lonDirection = convertToDirection(decimalLon, 'E', 'W');

    const lat = `${latDegreesMinutes[0].toString().padStart(2, '0')}${latDegreesMinutes[1].toString().padStart(2, '0')}${latDirection}`;
    const lon = `${lonDegreesMinutes[0].toString().padStart(3, '0')}${lonDegreesMinutes[1].toString().padStart(2, '0')}${lonDirection}`;

    return `${lat} ${lon}`;
}

function convertToDegreesMinutes(decimal) {
    const totalMinutes = Math.round(decimal * 60);
    return [Math.floor(totalMinutes / 60), totalMinutes % 60];
}

function convertToDirection(coord, positiveSymbol, negativeSymbol) {
    return coord >= 0 ? positiveSymbol : negativeSymbol;
}

export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1) // deg2rad below
    const dLon = deg2rad(lon2 - lon1)
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c // Distance in km
    return d
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}
