// Cases where Wikidata is best.
// A cool thing about this is that Wikidata is an open dataset, so if you encounter any issues,
// you can always fix it there, fixing it for the entire world.
// If the unlocode wasn't in code-list-improved.csv before, it should show up automatically after running download-wikidata.js and generate-improved-coordinates.js
// Otherwise, you'd have to add the unlocode here

export const WIKIDATA_BEST = [
    "CNHUA",
    "PRPSE",
    "AULVO",
    "AUMKR",
    "AUONG",
    "AOJMB",
    "AOMEG",
    "AURCM",
    "CAZFW",
    "CDIKL",
    "COCIE",
    "AUWUN",
    "BECLM",// Quite the important one! Nominatim is pointing to the one in the wrong region!
    "CALAW",
    "VELSV",
    "VEBAV",
    "VESFX", // No port possible at the Nominatim coordinates
    "ESSAT",
    "EGAIS",
    "ESSAT",
    "MYLBU",
    "IDLAT",
    "PRLAM",
    "JPABO",
    "PHZAM",
    "CABAY",
    "CASTC",
    "ITFAL",
    "RUSTY",
    "JPAOK",
    "VEBJV",
    "CNDAA",
    "VEETV",
    "NGKOK",
    "PELPP",
    "PHMAB",
    "PGMAS",
    "PEMRI",
    "JPSKM",
    "CAPTN",
    "GRADI",
    "PHWNP",
    "ASPPG",// Because of typo in the original. Hopefully will be fixed the next release
    "IDPNJ",// Port
    "CAPTN",
    "VEMIV",
    "ESSCI",
    "GTSNJ",
    "IDTBA",
    "VNVPH",
    "AUBQL",
    "AUMRG",
    "CDFDU",
    "CNHXG",
    "CNXHH",// Not 100% sure, but seems more likely than what Nominatim comes up with
    "CNHUY",// only 60% sure this is better than Nominatim
    "CNHLN",
    "CNYSA",
    "COPBO",// Deceiving one! Coordinates do point to a Puerto Bolívar, but the wrong one. Source: https://www.vesselfinder.com/ports/COPBO001
    "DEEGE",
    "DKFRE",// Much biggger, so seems more likely
    "DKGRI",// Same
    "DKNKV",// Same
    "DKVJN",
    "IDKBU",
    "IDWON",
    "INATT",// Both are possible, but this one is bigger
    "INBDA",// Both equally small, but this has a port
    "INNDC",
    "INJAY",
    "IRKHS",// At least shows up on Google Maps
    "IRTEW",// Close to Tohid airport
    "ITABO",// Is actually in Parma
    "ITBBG",
    "ITCN5",// The maintainer of Italy actually looked at the Wikidata entries for Italy, so if in doubt, choose Wikidata
    "ITIGN",
    "ITZIC",
    "ITZXG",
    "ITMRZ",
    "IT2LE",
    "ITMRZ",
    "ITPSU",//Official coordinates point to Passerano, Roma, but the region is set to Asti.
    "ITPSP",
    "ITTQR",
    "ITCLM",
    "ITSNN",
    "ITZTX",
    "ITZVB",
    "ITVIN",
    "ITAN2",
    "ITYBB",
    "ITCOO",
    "ITZP2",
    "ITSSD",
    "ITSPC",
    "ITZAL",
    "UGPAF",// Maybe not technically the airport, but close enough
    "USUBP",
    "USARP",// Much bigger
    "ZAGIY",
    "USWQG",// Slightly bigger
    "USWMQ",
    "USAAO",
    "USSYW",
    "USUXY",
    "USFKL",
    "USBPX",// Not sure if the Bayport Industrial District is meant, but it's at least in Texas
    "TREGZ",
    "TRAKS",
    "RUZHL",
    "RUNVY",
    "ROZUI",
    "PLZDY",
    "PKZRT",
    "PKTHT",
    "PKHPR",
    "PKHFD",
    "PHPRO",
    "ATLKN",
    "ATSTD",
    "ATWAR",
    "AUSCG",
    "CNTJA",
    "CNCFG",
    "CNHUS",
    "GBTIL",
    "GBABN",// Typo in region: NTH vs NHT
    "PGTIZ",// There's no airport at the Nominatim one
    "ARXPD",
    "MXSCR",
    "MNLTI",
    "MXSCR",
    "PKKHP",
    "NLZHN",
    "CKPZK",
    "MYMEA",
    "NGAKP",// 0308S 06049E is a typo: should have been 0308N 00649E
    "AEHIL",
    "DEDLE",// Unlocode "5198N 10887E" has invalid minutes (98>60); should be ~5159N 01053E. Wikidata Q798961 has it right.
    "DEHAQ",// Unlocode "4947N 01145E" puts Haar in Upper Franconia, but Wikidata Q504820 (the only Haar in Bayern) is near München at 4807N 01144E.
    "NIMSP",// Unlocode "1155N 08690W" has invalid lon minutes (90>59); intended was likely "1155N 08609W" instead of "1155N 08690W".
    "DENEW",// No Unlocode coords. Nominatim's first RP-Neustadt is Neustadt an der Weinstraße, but the name "Neustadt (Wied)" unambiguously is Q676583.
    "DERDB",// No Unlocode coords. Name "Rieden (Amberg-Sulzbach)" disambiguates to Q549110; Nominatim's first Bayern Rieden is in Ostallgäu.
    "DEUTG",// No Unlocode coords. Nominatim picks a tiny hamlet in Deggendorf, but the real station fitting "Utting" + function -23----- is Utting am Ammersee (Q167673, Ammerseebahn).
    "DEWBU",// The Unlocode coordinate points to the Bavarian Weißenburg (same place as DEWNG), but the subdivision BB says Brandenburg. Wikidata Q2556968 (Weißenburg, Ortsteil of Schlieben in Brandenburg) matches the subdivision.
    "DEWDF",// The Unlocode coordinate "5037N 01023E" wrongly points to Walldorf (Meiningen, Thuringia), but bare name "Walldorf" + subdivision BW unambiguously means Q22872 (Walldorf in Baden-Württemberg, SAP HQ). The Meiningen Walldorf has no Unlocode of its own.
    "DKKVG",// "Kvistgaard" is the old spelling of "Kvistgård". Nominatim's å/aa mismatch yields a farm and a house instead of the village. Q2236093 is the real Kvistgård near Helsingør (Coast Line station).
    "FMTKK",// Nominatim picks (8.61,151.83) in the Chuuk Northwest Islands. State Q221684 is closer but broad; Weno (Q1009384) or Chuuk Intl Airport (Q166512, IATA=TKK) would be better targets.
    "GBCOY",// Sub=ESS + function=Port unambiguously means Coryton Refinery on the Thames (Q2127138). Pipeline picked Coryton village in Cornwall.
    "GLQUE",// Disko Qullissat is OSM-tagged as isolated_dwelling (abandoned mining town), which the loader filters out. Pipeline then falls to an island in Kujalleq with the same name. Q923319 is the real Qullissat on Disko.
    "GREFP",// The Unlocode coordinate "2192N 03841W" has invalid lat minutes (92>59) and wrong sign, parses to South Atlantic. Q1223774 Efpalio (Central Greece) is correct.
    "IDKAT",// 6 Kaliangets in Indonesia; the famous Port of Kalianget (Q12504170, Sumenep/Madura) is Nominatim's 6th hit. Pipeline picked a random village in Banjarnegara, Central Java.
    "IDMXB",// Three Masambas in Indonesia. Q4194199 is the South Sulawesi town (matches the 3-letter code MXB, which is also IATA for the airport serving it). Pipeline picks a different Masamba in Poso Regency.
    "IDPJG",// Name explicitly says "(Lampung, Sumatra)". Q19746903 Port of Panjang at Lampung Bay matches; pipeline picked a Java Panjang.
    "IESCF",// Notes column says "Clare". Pipeline picked "Scariff House" residential building in Dublin; Q2668587 is the actual Scarriff village in County Clare.
    "INPNQ",// Unlocode = IATA PNQ (Pune International Airport). Q1538 is the city of Pune. Pipeline picked an unrelated node 214km south.
    "ITCXM",// ITCMI separately covers "Carmignano di Brenta", so bare ITCXM is the Tuscany comune Q20385 (Prato). Pipeline picked a Veneto hamlet.
    "MXELS",// MXESO separately covers an El Salto in JAL. Wikidata Q5352072 picks the Durango El Salto (Pueblo Nuevo municipal seat); pipeline picks Greater Guadalajara's El Salto.
    "MXJAL",// Unlocode = IATA JAL (Xalapa Airport, capital of Veracruz). Q221051 is Xalapa. Pipeline picked Tabasco's Jalapa.
    "MXSGM",// MXSIO separately covers a San Ignacio in Sinaloa, so MXSGM is a different one. The 3-letter code SGM matches IATA for the airfield in Baja California Sur, identifying the BCS town Q2219661 as the target. Pipeline picks the Sinaloa one.
    "PHCGM",// The Unlocode coordinate points to Mindanao Camiguin, but name "Camiguin Island/Aparri" pairs with Aparri (Cagayan, north Luzon) = Babuyan Camiguin (Q1028896).
    "RUSVE",// Many Svetlayas in Russia. Q1853228 Svetlaya in Primorsky Krai is on the Sea of Japan coast — matches Port function. Pipeline picked an inland Bashkortostan one.
    "UGMBA",// Q1015727 Mbale City is the well-known city in Eastern Uganda. Pipeline picked a hamlet near Kampala.
    "USBLX",// Q754583 = Bel Air town, county seat of Harford County (the well-known Bel Air). Pipeline picked a smaller Bel Air in western MD.
    "USWPJ",// "Westwood Village" specifically means the LA UCLA-area commercial district (Q14684258). Pipeline picked a Bay Area node.
    "UZAZN",// "Andizhan" = Russian spelling of Andijan. Unlocode = IATA AZN (Andizhan Airport Q978217). Q487656 is the city in Fergana Valley. The Unlocode coordinate points to central Uzbekistan (wrong).
    "CNYUE",// There _is_ a Yueqing there https://www.openstreetmap.org/relation/16924968 but it's a small town, not in Zhejiang Sheng and not relevant for shipping, while the other one is. It also matches https://magicport.ai/ports/china/yueqing-port-cnyue
    "JPCHF",// Source: https://magicport.ai/ports/japan/chofu-port-jpchf
    "IRBAM",// Source: https://magicport.ai/ports/iran/amirabad-port-irbam
    "PAMIT",

    // WPI (World Port Index) was used as a source of truth here
    "GBPRH",
    "VNPHU",
    "VNBEN",
    "SESAK",
    "CUGYB",
    "NOBER",
    "IEKLR",
    "EGMAH",
    "CGYOM",
    "IDAJN",
    "NOHUR",
    "USPWI",
    "VNNGT",
    "PHSCA",
    "JPHMK",
    "PHTNU",
]
// There are 2 San Martino in Strada's! :O The one of the official coordinates, and the one in https://www.wikidata.org/wiki/Q42950
// ITSPC https://maps.app.goo.gl/EARFzs2N9RaX3Cbv7 vs https://www.wikidata.org/wiki/Q42950
