const endpointUrl = `https://query.wikidata.org/sparql?format=json&flavor=simple`

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