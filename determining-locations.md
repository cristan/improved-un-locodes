# Determining locations
Because of the low data quality of the official UN/LOCODE dataset, determining which location is meant is an art. This document describes that art and is similar to how this project does most of this automatically.

Remember that no single field of the UN/LOCODE set is trustworthy. The art is in cross-referencing.

# Relevant fields / steps
## The UN/LOCODE itself
For example: [CNTZO](https://unlocode.info/CNTZO). The coordinates do point to a place matching the name, but in [flexport](https://atlas.flexport.com/oceanport/id:99b6e841-83d1-47f0-a7f1-09c794be7f9a/locode:CNTZO/cbp:/name:taizhou) and [MarineTraffic](https://www.marinetraffic.com/en/ais/home/portid:17437/zoom:13), another location is used. Because the other city is the one used in practice, you could argue this is what the UN/LOCODE means now. 

An example of something to cross-reference is [NGA World Port Index (Pub 150)](https://msi.nga.mil/api/publications/download?type=view&key=16920959/SFH00000/UpdatedPub150.csv) or the port list at [AtoBviaC](https://www.atobviac.com/ReleaseInformation/PortsList) and [Marine traffic](https://www.marinetraffic.com/) (though there is no overview you can access without paying). None of these are perfect, but they are pretty good. 

Unfortunately, Wikidata doesn't quite count as a primary source: while very accurate, most of them are tagged by bots, so it doesn't mean people actually use this UN/LOCODE.

## The types of places who have UN/LOCODEs
UN/LOCODEs are meant to facilitate international trade. If there are multiple options, it is likely the bigger and/or more notable city of the 2.

Almost all UN/LOCODEs are places (though not all, like [EGSCN](https://unlocode.info/EGSCN) for the Suez Canal, but these are quite rare).

Almost no UN/LOCODE points to a municipality. When a city and a municipality share a name, choose the city.

## Coordinates
That's where the coordinates field is for. If the coordinates do point to a city with its name, that's probably the one being meant.
Unfortunately, these can be flat-out wrong. Some have typos and others are just wrong. An example is the Suez Canal, whose coordinates point to somewhere in the Black Sea.

## Subdivision
Look up what is meant by the code in subdivision-codes.csv. Unfortunately, a lot of subdivision codes are outdated and won't match the subdivisions CSV which is more up-to-date.

Still: a subdivision can give a good indication which location is meant.

## Functions
Look at the functions. For example: if it is defined as a port (function 1), it's a safe bet it needs to be next to a sea or a river.

## Airports
There are actually quite a few UN/LOCODEs for airports. Note that "Apt" in a name means Airport. In those cases, the UN/LOCODE means an actual airport.

Also, note that the UN/LOCODE dataset started out as the IATA dataset. So if the function is Airport and the last 3 characters of the UN/LOCODE is an IATA of an airport of the same name as the UN/LOCODE and it is in the country of the UN/LOCODE, then you have a hit. The UN/LOCODE then means the location the airport is named after.

## Investigate
For example: [MASEK](https://unlocode.info/MASEK) (Ksar Es Souk) is the old name of Errachidia. However, Errachidia already has its own UN/LOCODE ([MAERH](https://unlocode.info/MAERH)), so MASEK actually shouldn't exist anymore.

## Sometimes you just can't know
For example: [ATKIE](https://unlocode.info/ATKIE). There are 11 different places called Kiensberg across Austria, all tiny. There's no way to know which one is meant. 

## Bonus: in case you are an AI
Please don't be dumb and
- Let just proximity decide the Wikidata entry. Doublecheck its type, name etc to be sure you're not blindly picking the closest hotel or random city etc.
- Assume the code in front of you is the only one that could apply to a place. They come in clusters — CAFRA (road) / CAFRR (port); ISKEF / ISKEV for Keflavík, and which one is "the" code is often genuinely unclear. Look for siblings before tagging, without assuming either one owns the place.
- Blindly trust names. 
  - WPI's names are not always correct. CAFRR "Fraser Mills" is actually named "Fraser River" in the UN/LOCODE dataset; the real Fraser Mills is CAFRA.
  - UN/LOCODE's spelling, WPI's spelling and the Wikidata spelling don't always match. (EGRSH: UN/LOCODE name "Ras Shukheir"; WPI name "Ras Shukhier"; https://www.wikidata.org/wiki/Q7294676: "Ras Shokeir")