# Determining the Wikidata entry for a UN/LOCODE

## Don't let just proximity decide the Wikidata entry
Doublecheck its type, name etc to be sure you're not blindly picking the closest hotel or random city etc.

## Don't blindly trust names
CAFRR "Fraser Mills" is actually named "Fraser River" in the UN/LOCODE dataset; the real Fraser Mills is CAFRA.

## Don't blindly trust UN/LOCODE's spelling
WPI's spelling and the Wikidata spelling don't always match. (EGRSH: UN/LOCODE name "Ras Shukheir"; WPI name "Ras Shukhier"; https://www.wikidata.org/wiki/Q7294676: "Ras Shokeir")

- Assume the code in front of you is the only one that could apply to a place. They come in clusters — CAFRA (road) / CAFRR (port); ISKEF / ISKEV for Keflavík, and which one is "the" code is often genuinely unclear. Look for siblings before tagging, without assuming either one owns the place.

## Don't guess Q numbers from memory
The Q-number space is large and irregular. Items get merged, deleted, renumbered, and labels collide across unrelated entities. Numbers recalled from training have been confidently wrong:
- Q25266 — claimed to be Tortola; actually the year 1923.
- Q316390 — claimed as the island Antigua; needs verification before any tag.

Rule: never write a Q-number into the dataset without verifying it through a live Wikidata query in the same session.

## `wbsearchentities` is unreliable as a single source
The Wikidata search API matches against English labels and aliases only, sorts by an opaque relevance score, and happily returns coincidental matches:
- "Tortola" → returns a family-name item before the BVI island
- "Rotuma" → returns a biological genus before the Fijian island
- "Himekawa" → returns a station, river, dam, fictional character — but not Q11447424 (姫川港, the actual port), because that item has no English label

Use it for first-pass discovery, but always verify the candidate by inspecting `P31` (instance of), `P17` (country), `P625` (coordinates), and the entity description before committing.

## For non-Latin-script places, search in the local script
Many Japanese / Chinese / Arabic Wikidata items have only a local-language label and are invisible to English search.

Working example: JPHMK "Himekawa". English search returned 8 unrelated items. Searching for `姫川港` in Japanese returned Q11447424 immediately — the actual port, correctly classified `P31 = port (Q44782)`, located in Itoigawa, Niigata.

Fallback strategy when English search misses:
1. Translate the name into the local language/script.
2. Search Wikidata with `language=` set appropriately.
3. Or query the local-language Wikipedia and follow the sitelink to Wikidata.

The same problem applies to Latin-script countries when an entity only has a local-language label. IDKID "Kidjang, Bintan": English searches for "Port of Kijang" / "Sri Bayintan port" returned only bot-imported registry stubs (Q137515327, Q137463023). The substantive entity, Q139254012 `Pelabuhan Sri Bayintan`, had only an Indonesian label plus an Indonesian Wikipedia article and was missing from every English search — it only surfaced by querying Indonesian Wikipedia for `Sri Bayintan` and following the sitelink. So: when English search returns only bot stubs and no substantive entity, try the local-language Wikipedia even when the country uses Latin script.

## When labels collide, rank by sitelink count
Multiple Wikidata items often share a label. The substantive one almost always has more Wikipedia sitelinks; the duplicates are usually bot-imported stubs.

| Q | Label | Sitelinks | Verdict |
|---|---|---|---|
| Q1140993 | Crooked Island | 29 | substantive entity ✓ |
| Q21713450 | Crooked Island | 2 | a stub |

Default SPARQL ordering is arbitrary — without `ORDER BY`, you'll often pick the wrong one. Pattern that works:

```sparql
SELECT ?item ?itemLabel (COUNT(DISTINCT ?sl) AS ?sitelinks) WHERE {
  ?item rdfs:label "<name>"@en.
  ?item wdt:P31/wdt:P279* wd:Q23442.   # subclass of island (loosen if no results)
  MINUS { ?item wdt:P1937 ?u. }         # skip items that already have a UN/LOCODE
  OPTIONAL { ?sl schema:about ?item. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
GROUP BY ?item ?itemLabel
ORDER BY DESC(?sitelinks)
LIMIT 5
```

Lower Q-number (older item) is a weaker but correlated signal.

## SPARQL type filters miss valid items
`wdt:P31/wdt:P279* wd:Q23442` (subclass-of island) misses items typed only as:
- atoll
- archipelago
- dependency / dependent territory
- administrative territorial entity (BVI, Cook Islands, etc.)
- island group (Yap = Q209638)

When the strict-island query returns no result, drop the type filter and inspect candidates manually. Real-world hits found this way:
- Tortola → Q827604, instance of administrative territorial entity
- Rotuma → Q459763, instance of dependency of Fiji
- Yap → Q209638, instance of island group

## Country QIDs aren't always the right axis for islands
- British Virgin Islands (Q25305): many of its islands have `P17 = Q145` (United Kingdom) instead.
- Turks and Caicos (Q18221): same issue.
- Iran (Q794) generally works.

If `wdt:P17 wd:<country>` returns nothing, drop it. Use the country to verify a sensible result, not as a hard filter.

## Use external identifiers when the UN/LOCODE has them
UN/LOCODE entries often carry IATA codes, function-code hints, or implicit WPI listings. These can short-circuit the search.

- **IATA code** → `SELECT ?item WHERE { ?item wdt:P238 "<IATA>" }`.
  USPWI had IATA `KPR`; one SPARQL query returned Q4373203 "Port Williams Seaplane Base", coordinates matching WPI to the meter.
- **WPI ID** → `wdt:P7625`. Used to find the WPI-bot stubs (see below).
- **Function code position 4** → the entity is an airport; look for `P238` (IATA) or `P239` (ICAO).
- **Function code position 7** → fixed transport / offshore terminal; the substantive entity may not exist, fall back to the bot stub.

## WPI-bot-imported stubs (Q11138xxxxx range)
A Wikidata bot imported every NGA Pub 150 entry as a stub. These items:
- Have Q numbers in the **Q11138xxxxx** range
- Have **P7625** (WPI port ID)
- Have **P31 = Q44782** (port)
- Have **P625** matching WPI's coordinates to the meter
- Often have **no P1937** (UN/LOCODE) yet
- Have a label like "X Oil Terminal" or just "X"
- Have **few sitelinks** (often only 1)

For offshore platforms, FPSOs, mooring buoys, and one-off terminals where no substantive entity exists, the WPI bot stub is the right thing to tag. Examples that landed cleanly:
- NGAKP → Q111386614 (Akpo Oil Terminal)
- CGYOM → Q111386596 (Yombo Terminal)
- IDAJN → Q111387309 (Ardjuna Oil Field)
- PHSCA → Q111387420 (San Carlos)
- VNNGT → Q111387062 (Nghe Tinh)

For named cities and well-known islands, prefer the substantive entity (lower Q, more sitelinks). The bot stub is a duplicate that should ideally be merged into the city entity later.

## Beware UN/LOCODE name suffixes
The UN/LOCODE name often encodes what kind of entity is meant:

| Suffix / pattern | Means | Tag |
|---|---|---|
| `X Pt` / `X Port` | port facility, *not* the city | port-specific entity, or skip |
| `X Apt` / `X Airport` | airport facility | airport entity (P238 IATA) |
| `X Terminal` | one specific terminal | bot stub or skip |
| `X Jetty` / `X Quay` | one specific feature | typically skip — too granular |
| `X Marine Terminal` | offshore SPM | bot stub |
| `X Oil Terminal` / `X Field` | offshore oil entity | bot stub |
| `X, Y` (comma) | X within larger Y | search for X in Y's region |
| `X/Y` (slash) | disambiguation hint: X near Y | use `q=X, Y, Country` in Nominatim, then verify |
| `X Island` / `X Is` | the island itself | island entity |
| Bare name | the place itself | substantive entity |

Don't tag a city's Wikidata item with an `X Pt` UN/LOCODE. CNHBG "Harbin Pt" is the port facility, not Harbin city (Q36985 covers the city). Either find a port-specific entity, propose creating one, or leave it untagged.

## Verification checklist before committing a tag
1. Reverse-geocode `P625` via Nominatim. Does the result fall in the expected country / region?
2. Check `P31` (instance of). Is it a sensible type (island / city / port / terminal)?
3. Check `P17` (country). Matches the UN/LOCODE country prefix?
4. Check `P131*` (admin entity, transitive). Falls under the UN/LOCODE's subdivision code?
5. Check `P1937` is empty. If already set, you're duplicating — investigate why.
6. Read the English description. Two lines usually settles the "right entity?" question fast.

## When automation gives up: one-at-a-time review
There is no SPARQL-and-script technique that gets the right answer for every UN/LOCODE without manual review. Cases where automation breaks:
- Substantive entity has no English label (Japan, China, Arabic-script countries)
- Substantive entity is classified as something other than the obvious type
- Country QID doesn't match the island's `P17`
- Both a bot stub and a substantive entity exist and both look plausible
- The UN/LOCODE name is itself ambiguous (which "San Carlos"? which "Tortola"?)

For these, slow down. Open the Wikidata page in a browser, read the description, decide. Trying to batch through them is faster only if the batching tool is reliable, and currently the SPARQL-via-script route is not.

## Country-code mismatches in UN/LOCODE itself
UN/LOCODE sometimes assigns the wrong country prefix:
- TMTMZ "Termez" — TM is Turkmenistan, but Termez is a famous Uzbek city on the Afghan border. Either UN/LOCODE has the country wrong (should be UZ) or there's a separate Termez in Turkmenistan.

If you spot this, flag it as an upstream UNECE issue rather than tagging a wrong-country entity to "match" the bad UN/LOCODE.

## Cluster codes — look for siblings before tagging
UN/LOCODE often has multiple codes for closely-related entities in the same place (port vs road, airport vs city, two parts of the same harbour). When the place you're trying to tag is one of a cluster, the right Wikidata entity may differ between siblings.

Examples:
- CAFRA (road) / CAFRR (port) — same Fraser River area, but the river entity and the road point are different items.
- ISKEF / ISKEV — both relate to Keflavík; which "owns" Keflavík airport vs Keflavík town is unclear without inspection.

Before tagging, scan for sibling codes in the same country with related names. Decide what each one represents *before* picking the Wikidata target for any of them.
