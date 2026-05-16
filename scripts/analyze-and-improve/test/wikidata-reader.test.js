import {simplifyWikidata} from "../util/wikidata-reader.js"
import {expect} from "chai"

describe("simplifyWikidata", () => {
    it("strips the country prefix from each code and adds sourceUrl/alternatives", () => {
        // GB2AB Aston, current data/wikidata/wikidata.json. P131* yields the council area alongside
        // super-region codes (ENG, UKM) that UN/LOCODE never uses on entries.
        const entry = {item: "http://www.wikidata.org/entity/Q649838", itemLabel: "Aston", lat: "52.5", lon: "-1.88", unlocode: "GB2AB", subdivisionCodes: ["GB-BIR", "GB-ENG", "GB-UKM"]}
        expect(simplifyWikidata(entry)).to.deep.equal({
            item: "http://www.wikidata.org/entity/Q649838",
            itemLabel: "Aston",
            lat: "52.5",
            lon: "-1.88",
            unlocode: "GB2AB",
            subdivisionCodes: ["BIR", "ENG", "UKM"],
            sourceUrl: "http://www.wikidata.org/entity/Q649838",
            alternatives: []
        })
    })

    it("drops codes without a dash (non-ISO-3166-2 oddities)", () => {
        // PSBJA Beit Jala. Has a "PS-BTH" governorate code AND a bare "WBK" (West Bank) value that isn't ISO 3166-2.
        const entry = {item: "http://www.wikidata.org/entity/Q803984", itemLabel: "Beit Yala", lat: "31.715833333", lon: "35.1875", unlocode: "PSBJA", subdivisionCodes: ["PS-BTH", "WBK"]}
        expect(simplifyWikidata(entry).subdivisionCodes).to.deep.equal(["BTH"])
    })

    it("returns an empty array when subdivisionCodes is missing", () => {
        // AEDBP: Port of Dibba. No subdivisioncodes here.
        const entry = {item: "http://www.wikidata.org/entity/Q12246923", itemLabel: "Port of Dibba", lat: "25.613475", lon: "56.300685", unlocode: "AEDBP"}
        expect(simplifyWikidata(entry).subdivisionCodes).to.deep.equal([])
    })
})
