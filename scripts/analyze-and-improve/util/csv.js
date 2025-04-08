export function parseCSV(csvString) {
    const result = []
    let currentField = ''
    let insideQuotes = false

    for (let i = 0; i < csvString.length; i++) {
        const char = csvString[i]

        if (char === '"') {
            // Toggle insideQuotes when encountering a quote
            insideQuotes = !insideQuotes
        } else if (char === ',' && !insideQuotes) {
            // Add the current field to the result array and reset currentField
            result.push(currentField)
            currentField = ''
        } else {
            // Add the character to the current field
            currentField += char
        }
        if (i === csvString.length - 1) {
            result.push(currentField)
        }
    }
    return result
}

export function writeCsv(dataOut, entries) {
    const withQuotesIfNeeded = entries.map(entry => {
        if (typeof entry === "string" && (entry.includes(",") || entry.includes("\n"))) {
            return `\"${entry}\"`
        } else {
            return entry
        }
    })
    dataOut.write(withQuotesIfNeeded.join(",")+ "\n")
}