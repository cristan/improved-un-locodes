// There are cases where the UN/LOCODE coordinates are actually good, but Nominatim doesn't find the correct place
// Not all differences are manually checked, so there are bound to be more

export const UNLOCODE_BEST =[
    "ARCEN",
    "ARFRT",
    "AREJO",
    "ARVLY",
    "AUDON",
    "AURH8",
    "AURHI",
    "BESGS",
    "BGPTK",
    "BOCLN",
    "BOSPD",
    "CAABL",
    "CABEI",
    "CABOD",
    "CASPL",
    "CASMN",
    "CAQEE",
    "CALMS",
    "CALMD",
    "CALCV",
    "CAMPR",
    "CAPHB",
    "CAPNN",
    "CAS8A",
    "CAS7T",
    "CASBT",
    "CANSC",
    "CASCU",
    "CASUG",
    "CAEMT",
    "CASAJ",
    "CAJPH",
    "CASM8",
    "CASYB",
    "CAUTP",
    "CAWOI",
    "CLLAC",
    "CLPOS",
    "CNCDO",
    "CNGHN",
    "CNXSN",//象山 Xiangshan Mountain is meant somehow according to Ms.Zhang. There is indeed a much bigger Xiangshan, but that one isn't in Zhejiang Shen.
    "CNLLY",
    "CNXIA",
    "COACR",
    "COARI",
    "COBUE",
    "CODQS",
    "COEPI",
    "COPUL",
    "COSAO",
    "COSJA",
    "COSAR",
    "CZHVI",
    "DERB2",
    "DESJO",
    "DEULN",
    "DKBRR",
    "DKFRS",
    "DKGAN",
    "DKHOM",
    "DKTHY",
    "DKABK",
    "ECEGO",
    "ESBEE",
    "ESCSC",
    "ESZBH",
    "ESMOY",
    "ESRSO",
    "ESTGS",
    "ESZNL",
    "ETS7O",
    "FIAKK",
    "FIKVL",
    "FISPJ",
    "FISAA",
    "FIUPK",
    "GBYBR",
    "GBRGP",// Little weird to have a unlocode for a park, but otherwise it checks out
    "GBSSP",
    "GBSRX",
    "GHKPA",
    "GRAPN",
    "GRTEM",
    "GRLPK",
    "GTMAG",
    "GTSN2", // Not marked as an airport, but probably fine
    "IDBTL", // Tiniest village ever, but it is there
    "IDBAM",
    "IDRAU",
    "INBLL",
    "INGPP",
    "INJHD",
    "INPAJ",
    "INCBS", // Pretty stupid name in unlocode, but ok
    "INBRS", // same here
    "INZUM",
    "ITCC2",
    "ITBBJ",
    "ITRMG",// Name should probably be changed from Rio Maggiore to Riomaggiore, but the coordinates match
    "ITFDB",
    "JPSWR",
    "JPTOA",
    "LSMPS",
    "MXAOE",
    "MXACC",
    "MXJCM",
    "MXTAB",
    "MXELR",
    "MXGNS",
    // MXHGO is a hard one. It points to a valid location, but Nominatim points to a way bigger one, also in the correct region
    "MXIGU",
    "MXIXT",
    "MXJCN",
    "MXJUZ",//Colonia Juárez is there. Probably correct
    "MXOJO",// Name shoyld probably be Ojocaliente instead of Ojo Caliente
    "MXPJZ",
    "MXPBJ",
    "MXRSR",// Named El Rosario in Google Maps
    "MXSJF",
    "MXSFA",
    "MXSGL",
    "MXTXP",
    "MXTNI",
    "MXVAL",
    "MXVIF",// Better name: Villaflores
    "MXVHA",// Better name: Vistahermosa de Negrete
    "MZZBZ",
    "NGKRU",
    "NGOGI",
    "NGOGO",
    "NLNGD", // Better name: Nooitgedacht
    "NOSKK", // Incorrect region, so not 100% sure
    "NOTDL",
    "PACBL",
    "PAEGL",
    "PATUW",
    "PECHO",
    "PEMBA",
    "PKMAN",
    "PLBUO",
    "PLLDG", // Incorrect region, but probably ok
    "PLLBN", // Most likely Lubań
    "PLNWI", // Incorrect region, but probably ok
    "PLNWK",
    "PLPAS",
    "PLSRT",  // Incorrect region, but probably ok
    "PRBOQ",
    "PRFLO",
    "PRLAR",
    "PRLMA",
    "PRLPS",
    "PRMOC",
    "PRNAR",
    "PRPTL",
    "PRRGD",
    "PRSAL",
    "PRSGM",
    "PRSLP",
    "PRSBS",
    "PRSIS",
    "PRTRJ",
    "ROSFG", // Spelled slightly different and maybe the region is incorrect, but the alternative isn't better at all
    "RUALX",
    "RUAHK",
    "RUBAL",
    // RUBOG = no false positive at all. It looks alright, but it's 1000km+ away from Kaliningradskaya oblast, (KGD)
    "RUBKN",
    "RUCHG",// Name is fairly different. Probably still good
    "RUDYA",// Name is fairly different. Probably still good
    "RUKTN",
    "RUKRP",
    "RUKRY",
    "RUKU2",
    "RUL3N",
    "RULT5",
    "RUMSK",
    "RUMOS",
    "RUOYE",
    "RUOLK",
    "RUODY",
    "RUPNY",
    "RUPRV",
    "RUREP",// Wrong region though
    "RURSS",
    "RUSAR",
    "RUSOB",
    "RUSTV",
    "RUZSY",
    "SAQAH",
    "SAASQ",
    // SDYEI is a nice match, but in South Sudan instead of Sudan
    "SEBTS",
    "SEGND",
    "SEKVK",
    "SEKYK",
    "SENML",
    "SEVKO",
    "TMASB", // Spelling differs slightly
    "UABKL", // Different spelling
    "UAPRN", // Different spelling
    "USKVW", // Different spelling
    "USNNU", // Different spelling
    "USAN7", // Spelling is probably wrong
    "US5JD", // Tiny little neighbourhood not found by the current nominatim query, but it is there.
    "USYAJ",
    "USA2N",
    "US9BC", // Spelling is probably wrong
    "USIFK", // Spelling is probably wrong
    "US6BY",
    "USBK2",
    "USQBX",
    "USB86",
    "USBKQ",
    "USBKQ", // Typo: Brook_s_ville
    "USUCQ", // Spelling is probably wrong
    "US4CS", // Spelling is probably wrong
    "USHZG", // Spelling is probably wrong
    "USCLC", // Points to clear lake park. A little weird, but it is in Texas
    "USHDA", // Nominatim finds something in a completely wrong state. Better have no location than a completely wrong one.
    "USDVM",
    "USDON", // Spelling is probably wrong
    "USDU4", // Spelling is probably wrong
    "USABX", // Spelling is probably wrong
    "USE2L", // Spelling is probably wrong
    "USAIW", // Spelling is probably wrong
    "USFLF", // Spelling is probably wrong
    "USFI7",
    "USFL5", // Same Fleming Island as USFI7 :O
    "USLLJ", // Spelling is probably wrong
    "USG9A", // Spelling is probably wrong
    "USU4B", // Spelling is probably wrong
    "USG4D", // Spelling is probably wrong
    "USZHF", // Spelling is probably wrong
    "USHJR", // Spelling is probably wrong
    "USUTG", // Spelling is probably wrong
    "US2IS",
    "USZKB",
    "USK5T", // Spelling is probably wrong
    "USLR4",
    "USLB3",
    "USRXU",
    "US3MH",
    "USM7W", // Note that there is another Manchester in New Jersey: USNMJ. (that one seems to point to nowhere)
    "USXXZ", // Spelling is probably wrong
    "US5MS",
    "USNXC",
    "USNB5",
    "USNSD",
    "USOFJ",
    "USOHK", // Spelling is probably wrong
    "USP3H", // Spelling is probably wrong
    "US5LT", // Spelling is probably wrong
    "USP5N",
    "USPC2",
    "USPZH",
    "USPUG", // Spelling is probably wrong
    "USRWP",
    "USPXR",
    "USRN3", // Spelling is probably wrong
    "USRKM", // Spelling is probably wrong
    "USVFA",
    "USRC4", // Spelling is probably wrong
    "USRN4",
    "USTCA",
    "USHZA",
    "US2JO",
    "USJHH",
    "USSN8",
    "USRI8", // Spelling is probably wrong
    "USSI2",
    "USS98",
    "USGTX",
    "USYNR",
    "USM6S",
    "USM6S", // Spelling is probably wrong
    "USUK7",
    "USV74",
    "USWLJ",
    "USW4R",
    "USNGN",
    "USYWN",
    "USWOT",
    "USQWH", // Spelling is probably wrong
    "USWEK",
    "USIGF",
    "UZKSQ", // Spelling is probably wrong
    "VESBB",
    "VNLGS",
    "ZAELG",
    "ZAMDL",
    "ZAOLI",
    "ZAZEK",
    "INDMA",
    "INSIK", // Probably a typo: Sika vs Sikka
    "AOCUI", // Apparently, the coordinates point to the correct Port of Cuio
    "MYANG", // I'm not actually sure, but I don't see any evidence where else it could be
    "MYBGR", // Same here
    "CNJLY",
    "CNXIJ", // A little weird, since it's in the middle of the ocean, but it matches https://shipnext.com/port/xijiang-marine-terminal-cnxij-chn and atobviac, so I guess it's fine?
    "CNTZO",
    "USSUT",//atobviac
    "VNRDG",// oil platform at sea
    "CAPTN",
    "MYWSP",// Caused by the hard name Westport/Port Klang
    "PHMAB",
    "CLLAJ",
    "DEFUB",// There's actually a space in the city name!
    "ECVEI", // It's a little weird that Velasco Ibarra and El Empalme are the same city, but they are
    "ESCZA",
    "GBMKO",// Tiny, but it matches
    "GBNGO",// Two Newingtons in Kent, but the other is next to a rail, so I'd guess it would have gotten Rail as a function if that were the one
    "INISP",
    "THBPG",

    // Places where the official coordinates match the ones at WPI (World Port Index) within 10km. These are probably fine.
    // WPI itself isn't redistributed by this project (NGA Pub 150's "no copyright claimed" notice sounds like a legal landmine).
    "CANWP",  // UC↔WPI 1.3km
    "CASAT",  // UC↔WPI 3.0km
    "PEPUB",  // UC↔WPI 2.6km
    "PRARR",  // UC↔WPI 0.0km
    "PRSJU",  // UC↔WPI 4.0km
    "RULES",  // UC↔WPI 2.2km
    "NGANA",  // UC↔WPI 1.9km (oil terminal, middle of ocean)
    "THERA",  // UC↔WPI 6.6km
    "MXPIC",  // UC↔WPI 4.1km
    "IDNPL",  // UC↔WPI 2.6km
    "GBSVZ",  // UC↔WPI 1.2km
    "EGAQU",  // UC↔WPI 0.0km
    "NZMCY",  // UC↔WPI 4.0km
    "IDTJB",  // UC↔WPI 1.9km
    "ESACE",  // UC↔WPI 1.9km
    "MHENT",  // UC↔WPI 1.9km
    "GBHUL",  // UC↔WPI 2.9km
    "NOVAL",  // UC↔WPI 1.1km
    "IDSZH",  // UC↔WPI 1.9km
    "NGOKN",  // UC↔WPI 4.1km
    "CNHNK",  // UC↔WPI 1.6km
    "RUVIT",  // UC↔WPI 0.7km
    "PESNX",  // UC↔WPI 1.9km. Two San Nicolas in Peru — this is the one aToBviaC uses.
    "ARLPG",  // UC↔WPI 1.9km
    "ARRZA",  // UC↔WPI 7.2km (Puerto Santa Cruz)
    "CAGOO",  // UC↔WPI 9.6km
    "CAPNO",  // UC↔WPI 1.9km (Pointe-Noire QC, North Shore)
    "CIESP",  // UC↔WPI 7.6km
    "CNFAN",  // UC↔WPI 1.9km
    "CNLYG",  // UC↔WPI 2.4km
    "ECPEV",  // UC↔WPI 7.6km (Puerto Marítimo de Guayaquil)
    "INBOM",  // UC↔WPI 5.3km (Mumbai)
    "INGGV",  // UC↔WPI 1.9km
    "NZWRE",  // UC↔WPI 5.8km
    "SADMM",  // UC↔WPI 0.0km
    "SYALD",  // UC↔WPI 2.4km
    "TRBOT",  // UC↔WPI 6.3km

    // 61 km off the WPI coordinates, but it's at least closer than my algorithm comes up with. Needs more investigation.
    "ARSPD",
]