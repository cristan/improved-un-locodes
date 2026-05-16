import {simplifyWikidata} from "../util/wikidata-reader.js"
import {expect} from "chai"

describe("simplifyWikidata", () => {
    it("strips the country prefix and adds sourceUrl/alternatives", () => {
        // GB2AB: Aston. Subdivision code `GB-BIR` should be turned into `BIR`
        const entry = {item: "http://www.wikidata.org/entity/Q649838", itemLabel: "Aston", lat: "52.5", lon: "-1.88", unlocode: "GB2AB", subdivisionCode1: "GB-BIR"}
        expect(simplifyWikidata(entry)).to.deep.equal({
            item: "http://www.wikidata.org/entity/Q649838",
            itemLabel: "Aston",
            lat: "52.5",
            lon: "-1.88",
            unlocode: "GB2AB",
            // Kept because of how the code works now. Not really used as far as I can tell.
            subdivisionCode1: "GB-BIR",
            sourceUrl: "http://www.wikidata.org/entity/Q649838",
            subdivisionCode: "BIR",
            alternatives: []
        })
    })

    it("leaves subdivisionCode undefined when subdivisionCode1 is missing", () => {
        // AEDBP: Port of Dibba. Has no subdivisionCode1.
        const entry = {item: "http://www.wikidata.org/entity/Q12246923", itemLabel: "Port of Dibba", lat: "25.613475", lon: "56.300685", unlocode: "AEDBP"}
        expect(simplifyWikidata(entry).subdivisionCode).to.be.undefined
    })
})
