const endpointUrl = `https://query.wikidata.org/sparql?format=json&flavor=simple`
const qleverEndpointUrl = `https://qlever.dev/api/wikidata`

export async function runQleverQuery(query) {
    const fromQlever = await fetch(qleverEndpointUrl, {
        method: 'POST',
        headers: {
            'User-Agent': 'Bot for github.com/cristan/improved-un-locodes',
            'Content-Type': 'application/sparql-query',
            'Accept': 'application/sparql-results+json'
        },
        body: query
    })

    const json = await fromQlever.json();
    return json.results.bindings;
}

export async function runWikidataQuery(query) {
    const queryUrl = `${endpointUrl}&query=${encodeURIComponent(query)}`

    const fromWikidata = await fetch(queryUrl, {
        headers: {
            'User-Agent': 'Bot for github.com/cristan/improved-un-locodes'
        }
    })

    const json = await fromWikidata.json();
    return json.results.bindings;
}