// Retired UN/LOCODE subdivision codes mapped to their current ISO 3166-2 codes.
// Used to compare entry.subdivisionCode against Nominatim's address["ISO3166-2-lvl*"].
//
// Only safe mappings: renames and combinations. No splits.
// Source per country: ISO Online Browsing Platform (https://www.iso.org/obp/ui/#iso:code:3166:XX).

export const SUBDIVISION_ALIASES = {
    // IN — https://en.wikipedia.org/wiki/ISO_3166-2:IN

    // Uttarakhand: UL (Uttaranchal) → UT (2011-12-13) → UK (2023-11-23).
    "IN|UL": "UK",
    "IN|UT": "UK",

    // Dadra and Nagar Haveli + Daman and Diu → DH. ISO 2020-11-11. Pure merger.
    "IN|DN": "DH",
    "IN|DD": "DH",

    // State codes reassigned. ISO 2023-11-23. Pure renames.
    "IN|OR": "OD",  // Odisha
    "IN|CT": "CG",  // Chhattīsgarh
    "IN|TG": "TS",  // Telangāna

    // NO — https://en.wikipedia.org/wiki/ISO_3166-2:NO + https://en.wikipedia.org/wiki/Counties_of_Norway

    // Sør-Trøndelag + Nord-Trøndelag → Trøndelag (via NO-23). ISO 2018-11-26 + 2019-04-09.
    "NO|16": "50",
    "NO|17": "50",
    "NO|23": "50",  // NO-23 → NO-50 code change, 2019-04-09.

    // Hedmark + Oppland → Innlandet. ISO 2020-11-24.
    "NO|04": "34",  // Hedmark
    "NO|05": "34",  // Oppland — IMPERFECT: Lunner and Jevnaker transferred from Oppland to
    //                  Viken in 2020 (now NO-32 Akershus), so they will not match this alias.
    //                  Source: regjeringen.no "Nye kommunenummer for Rindal, Jevnaker og Lunner".

    // Aust-Agder + Vest-Agder → Agder. ISO 2020-11-24.
    "NO|09": "42",  // Aust-Agder
    "NO|10": "42",  // Vest-Agder

    // Hordaland + Sogn og Fjordane → Vestland. ISO 2020-11-24.
    "NO|12": "46",  // Hordaland
    "NO|14": "46",  // Sogn og Fjordane — IMPERFECT: Hornindal merged into Volda (Møre og
    //                  Romsdal NO-15) in 2020. Source: Lovdata "Forskrift om samanslåing av
    //                  Hornindal kommune og Volda".

    // Norway 2024-01-01: the three 2020 merger counties (Viken NO-30, Vestfold og Telemark NO-38,
    // Troms og Finnmark NO-54) were dissolved back into their original pre-merger counties.
    // Each pre-2020 code aliases to its post-2024 code. ISO 3166-2 has not been updated for the
    // 2024 split as of 2026 — Nominatim follows the Norwegian government codes (NO-31, NO-32, etc.).
    // Source: en.wikipedia.org/wiki/Counties_of_Norway (15 counties table).
    "NO|01": "31",  // Østfold — IMPERFECT: Rømskog merged into Aurskog-Høland (Akershus NO-32)
    //                  in 2020. Source: Wikipedia "Aurskog-Høland".
    "NO|02": "32",  // Akershus
    "NO|06": "33",  // Buskerud — IMPERFECT: Hurum + Røyken merged with Asker into new Asker
    //                  (Akershus NO-32) in 2020. Source: Wikipedia "Hurum", "Asker Municipality".
    "NO|07": "39",  // Vestfold — IMPERFECT: Svelvik merged into Drammen (Buskerud NO-33) in 2020.
    //                  Source: Wikipedia "Svelvik Municipality".
    "NO|08": "40",  // Telemark
    "NO|19": "55",  // Troms
    "NO|20": "56",  // Finnmark

    // GB — https://en.wikipedia.org/wiki/ISO_3166-2:GB

    // Northern Ireland 2015-04-01: 26 district councils consolidated into 11.
    // Local Government Act (Northern Ireland) 2014. ISO deletion announced 2015-11-27.
    // Source: Wikipedia "Reform of local government in Northern Ireland" (11-district table).
    "GB|ANT": "ANN",  // Antrim → Antrim and Newtownabbey
    "GB|NTA": "ANN",  // Newtownabbey → Antrim and Newtownabbey
    "GB|ARD": "AND",  // Ards → Ards and North Down
    "GB|NDN": "AND",  // North Down — IMPERFECT: a small part of the Knocknagoney area
    //                                 was transferred to Belfast (GB-BFS), not AND.
    "GB|ARM": "ABC",  // Armagh → Armagh City, Banbridge and Craigavon
    "GB|BNB": "ABC",  // Banbridge — IMPERFECT: the Slieve Croob area in eastern Banbridge
    //                                 was transferred to NMD, not ABC. Source: Wikipedia
    //                                 "Banbridge (district)".
    "GB|CGV": "ABC",  // Craigavon → Armagh City, Banbridge and Craigavon
    "GB|BLY": "CCG",  // Ballymoney → Causeway Coast and Glens
    "GB|CLR": "CCG",  // Coleraine → Causeway Coast and Glens
    "GB|LMV": "CCG",  // Limavady → Causeway Coast and Glens
    "GB|MYL": "CCG",  // Moyle → Causeway Coast and Glens
    "GB|DRY": "DRS",  // Derry → Derry and Strabane
    "GB|STB": "DRS",  // Strabane → Derry and Strabane
    "GB|FER": "FMO",  // Fermanagh → Fermanagh and Omagh
    "GB|OMH": "FMO",  // Omagh → Fermanagh and Omagh
    "GB|CSR": "LBC",  // Castlereagh — IMPERFECT: parts of Castlereagh (Belvoir, Braniel,
    //                                 Cregagh, Gilnahirk wards etc.) were transferred to
    //                                 Belfast (GB-BFS), not LBC.
    "GB|LSB": "LBC",  // Lisburn — IMPERFECT: parts of Lisburn (Dunmurry, Colin Glen,
    //                                 Kilwee, Lagmore etc.) were transferred to Belfast.
    "GB|BLA": "MEA",  // Ballymena → Mid and East Antrim
    "GB|CKF": "MEA",  // Carrickfergus → Mid and East Antrim
    "GB|LRN": "MEA",  // Larne → Mid and East Antrim
    "GB|CKT": "MUL",  // Cookstown → Mid Ulster
    "GB|DGN": "MUL",  // Dungannon → Mid Ulster
    "GB|MFT": "MUL",  // Magherafelt → Mid Ulster
    "GB|DOW": "NMD",  // Down → Newry, Mourne and Down
    "GB|NYM": "NMD",  // Newry and Mourne → Newry, Mourne and Down

    // England 2019-04-01: Bournemouth, Christchurch and Poole (BCP) unitary authority created.
    // Bournemouth (BMH) and Poole (POL) merged wholly. ISO 2020-11-24.
    // (Christchurch came from Dorset — that's a split, so DOR is NOT aliased.)
    "GB|BMH": "BCP",  // Bournemouth
    "GB|POL": "BCP",  // Poole

    // GR — Kallikratis reform (Law 3852/2010): 51 prefectures → 13 administrative regions,
    // implemented 2011. Each prefecture became one regional unit within exactly one region —
    // clean consolidation, no splits.
    // Source: en.wikipedia.org/wiki/ISO_3166-2:GR has an authoritative "In administrative region"
    // column for every retired GR-XX department code. ISO removed the prefecture codes 2016-11-15.

    // → A (Eastern Macedonia and Thrace)
    "GR|52": "A",  // Dráma
    "GR|71": "A",  // Évros
    "GR|55": "A",  // Kavála
    "GR|73": "A",  // Rodópi
    "GR|72": "A",  // Xánthi

    // → B (Central Macedonia)
    "GR|64": "B",  // Chalkidikí
    "GR|53": "B",  // Imathía
    "GR|57": "B",  // Kilkís
    "GR|59": "B",  // Pélla
    "GR|61": "B",  // Piería
    "GR|62": "B",  // Sérres
    "GR|54": "B",  // Thessaloníki

    // → C (Western Macedonia)
    "GR|63": "C",  // Flórina
    "GR|51": "C",  // Grevená
    "GR|56": "C",  // Kastoriá
    "GR|58": "C",  // Kozáni

    // → D (Epirus)
    "GR|31": "D",  // Árta
    "GR|33": "D",  // Ioánnina
    "GR|34": "D",  // Préveza
    "GR|32": "D",  // Thesprotía

    // → E (Thessaly)
    "GR|41": "E",  // Kardítsa
    "GR|42": "E",  // Lárisa
    "GR|43": "E",  // Magnisía
    "GR|44": "E",  // Tríkala

    // → F (Ionian Islands)
    "GR|23": "F",  // Kefallinía
    "GR|22": "F",  // Kérkyra
    "GR|24": "F",  // Lefkáda
    "GR|21": "F",  // Zákynthos

    // → G (Western Greece)
    "GR|13": "G",  // Achaḯa
    "GR|01": "G",  // Aitoloakarnanía
    "GR|14": "G",  // Ileía

    // → H (Central Greece)
    "GR|05": "H",  // Evrytanía
    "GR|04": "H",  // Évvoia
    "GR|07": "H",  // Fokída
    "GR|06": "H",  // Fthiótida
    "GR|03": "H",  // Voiotía

    // → I (Attica)
    "GR|A1": "I",  // Attikí (department)

    // → J (Peloponnese)
    "GR|11": "J",  // Argolída
    "GR|12": "J",  // Arkadía
    "GR|15": "J",  // Korinthía
    "GR|16": "J",  // Lakonía
    "GR|17": "J",  // Messinía

    // → K (Northern Aegean)
    "GR|85": "K",  // Chíos
    "GR|83": "K",  // Lésvos
    "GR|84": "K",  // Sámos

    // → L (Southern Aegean)
    "GR|81": "L",  // Dodekánisa
    "GR|82": "L",  // Kykládes

    // → M (Crete)
    "GR|94": "M",  // Chaniá
    "GR|91": "M",  // Irakleío
    "GR|92": "M",  // Lasíthi
    "GR|93": "M",  // Rethýmnis

}
