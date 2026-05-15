import {filterOutUselessEntries} from "../util/nominatim-loader.js"
import {expect} from "chai"

describe("filterOutUselessEntries", () => {
    it("drops natural/peak entries", () => {
        // ITBBJ "Buia". A mountain pass is found. Should be filtered out: mountain passes don't get UN/LOCODEs.
        const peak = {"place_id":68441872,"licence":"Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright","osm_type":"node","osm_id":1360226160,"lat":"43.0989935","lon":"11.0233525","category":"natural","type":"peak","place_rank":18,"importance":0.30000999999999994,"addresstype":"peak","name":"Poggio di Valle Buia","display_name":"Poggio di Valle Buia, Montieri, Grosseto, Tuscany, 58026, Italy","address":{"peak":"Poggio di Valle Buia","village":"Montieri","county":"Grosseto","ISO3166-2-lvl6":"IT-GR","state":"Tuscany","ISO3166-2-lvl4":"IT-52","postcode":"58026","country":"Italy","country_code":"it"},"boundingbox":["43.0989435","43.0990435","11.0233025","11.0234025"]}
        const result = filterOutUselessEntries([peak], "IT", "Buia")
        expect(result).to.have.lengthOf(0)
    })

    it("keeps landuse entries", () => {
        // CNYTN "Yantian Pt". The port is represented as landuse/industrial and should be kept.
        const yantianPort = {"place_id":205586524,"licence":"Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright","osm_type":"way","osm_id":261283912,"lat":"22.57401045","lon":"114.27493725337686","category":"landuse","type":"industrial","place_rank":22,"importance":0.2000099999999999,"addresstype":"industrial","name":"Yantian Port","display_name":"Yantian Port, Yantian Sub-district, Yantian District, Shenzhen, Guangdong Province, 518000, China","address":{"industrial":"Yantian Port","suburb":"Yantian Sub-district","city":"Yantian District","state":"Guangdong Province","ISO3166-2-lvl4":"CN-GD","postcode":"518000","country":"China","country_code":"cn"},"boundingbox":["22.5662204","22.5836772","114.2480685","114.2887268"]}
        const result = filterOutUselessEntries([yantianPort], "CN", "Yantian Pt")
        expect(result).to.have.lengthOf(1)
    })

    it("drops waterway entries when the city name doesn't contain 'canal'", () => {
        // ATAWD "Abwinden". Without this drop, the locode for the village would resolve to the
        // Abwinden-Asten hydropower plant (Nominatim's first hit for "Abwinden").
        const hydropowerPlant = {"place_id":144206536,"licence":"Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright","osm_type":"way","osm_id":8043915,"lat":"48.2497992","lon":"14.432116568054388","category":"waterway","type":"dam","place_rank":20,"importance":0.25000999999999995,"addresstype":"dam","name":"Wasserkraftwerk Abwinden-Asten","display_name":"Wasserkraftwerk Abwinden-Asten, Luftenberg an der Donau, Bezirk Perg, 4225, Austria","address":{"dam":"Wasserkraftwerk Abwinden-Asten","village":"Luftenberg an der Donau","county":"Bezirk Perg","postcode":"4225","country":"Austria","country_code":"at"},"boundingbox":["48.2470265","48.2524622","14.4254645","14.4353558"]}
        const result = filterOutUselessEntries([hydropowerPlant], "AT", "Abwinden")
        expect(result).to.have.lengthOf(0)
    })

    it("keeps waterway entries when the city name contains 'canal'", () => {
        // EGSCN "Suez Canal". The waterway should be kept because of the "Canal" in the city name.
        const suezCanal = {"place_id":42159040,"licence":"Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright","osm_type":"relation","osm_id":7719838,"lat":"30.6052767","lon":"32.3331003","category":"waterway","type":"canal","place_rank":19,"importance":0.6460707217612922,"addresstype":"canal","name":"Suez Canal","display_name":"Suez Canal, Al Ismailiya, Egypt","address":{"canal":"Suez Canal","state":"Al Ismailiya","ISO3166-2-lvl4":"EG-IS","country":"Egypt","country_code":"eg"},"boundingbox":["29.9303352","31.2757122","32.3037758","32.5868369"]}
        const result = filterOutUselessEntries([suezCanal], "EG", "Suez Canal")
        expect(result).to.have.lengthOf(1)
    })

    it("drops entries with addresstype=isolated_dwelling", () => {
        // SETOP "Torup". A single rural building too small to have its own UN/LOCODE despite category=place.
        const isolatedDwelling = {"place_id":147422060,"licence":"Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright","osm_type":"node","osm_id":7450072545,"lat":"56.6478326","lon":"13.0079091","category":"place","type":"isolated_dwelling","place_rank":22,"importance":0.2000099999999999,"addresstype":"isolated_dwelling","name":"Torup","display_name":"Torup, Halmstad, Halmstads kommun, Halland County, Sweden","address":{"isolated_dwelling":"Torup","city":"Halmstad","municipality":"Halmstads kommun","county":"Halland County","ISO3166-2-lvl4":"SE-N","country":"Sweden","country_code":"se"}}
        const result = filterOutUselessEntries([isolatedDwelling], "SE", "Torup")
        expect(result).to.have.lengthOf(0)
    })

    it("drops entries from a different country", () => {
        // MYLPK "Northport/Pt Klang". Nominatim finds a place in the another country (the US). This should be dropped.
        const northportNY = {"place_id":16191510,"licence":"Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright","osm_type":"relation","osm_id":175524,"lat":"40.9009595","lon":"-73.343167","category":"boundary","type":"administrative","place_rank":16,"importance":0.4413879474399188,"addresstype":"village","name":"Village of Northport","display_name":"Village of Northport, Town of Huntington, Suffolk County, New York, 11768, United States","address":{"village":"Village of Northport","town":"Town of Huntington","county":"Suffolk County","state":"New York","ISO3166-2-lvl4":"US-NY","postcode":"11768","country":"United States","country_code":"us"}}
        const result = filterOutUselessEntries([northportNY], "MY", "Northport/Pt Klang")
        expect(result).to.have.lengthOf(0)
    })
})
