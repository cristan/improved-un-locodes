An enhanced UN/LOCODE dataset with significant improvements:

# Significantly better coordinates
The main reason this project exists: coordinates in [the original UN/LOCODE list](https://github.com/datasets/un-locode) have major problems:

**1. Only 80% of locations have coordinates**

UN/LOCODEs without coordinates don't just include tiny villages, but world's most important cities like Oakland ([USOAK](https://unlocode.info/USOAK)), Barcelona ([ESBCN](https://unlocode.info/ESBCN)) and London ([GBLON](https://unlocode.info/GBLON)).

**2. Many coordinates are just wrong**

Quite a few coordinates have typos ([ATWIS](https://unlocode.info/ATWIS)), but many are just flat out wrong ([EGSCN](https://unlocode.info/EGSCN))

Many coordinates are automatically improved by combining the data with data from OpenStreetMap's [Nominatim API](https://nominatim.org/release-docs/latest/api/Overview/) and [Wikidata](https://www.wikidata.org/). This is then doublechecked against multiple alternative datasources and manually corrected if needed, resulting in an exceedingly accurate dataset.

## CSV with improved locations
This is solved with [code-list-improved.csv](data/code-list-improved.csv). It has much more accurate coordinates, and it has way more of them (98.7%; this includes all ports in World Port Index).

# Other features
Next to the improved UN/LOCODEs, there are other nifty things in this repo:

## A defined hierarchy
An example: [DEBHQ](https://unlocode.info/DEBHQ) (Bahrenfeld), is in Hamburg ([DEHAM](https://unlocode.info/DEHAM)), but how would you know these are essentially the same place?

For this, [parents.csv](data/parents.csv) is created, which looks like this:

```
Unlocode,Parent
DEBHQ,DEHAM
```
With this, you can easily find out these are related.

## Actually working aliases
It's impossible to find out that both "Vienna" and "Wien" are in fact the same city with UN/LOCODE [ATVIE](https://unlocode.info/ATVIE). That is, if you use the official dataset.

Not so much with [aliases-improved.csv](data/aliases-improved.csv), which looks like this:

```
Unlocode,Alias
ATVIE,Wien
ATVIE,Vienna
```

This is much more usable than the [aliases](data/alias.csv) in the original.  Not only because of the improved user-friendliness, but mostly because of its sheer size. The official dataset has less than 100 aliases, this one has over 670.000.

# About UN/LOCODES
The United Nations Code for Trade and Transport Locations is a code list maintained by UNECE (a United Nations agency) to facilitate trade. The list comes from the [UNECE page](http://www.unece.org/cefact/locode/welcome.html), released at least once a year. However, this dataset is based on [datasets/un-locode](https://github.com/datasets/un-locode), which is already much better than the original (different CSVs for different purposes instead of cramming it all in 1).

# Shameless plug
[CargoProbe](https://www.cargoprobe.com) offers the functionalities of this dataset [as an API](https://www.cargoprobe.com/service-un-lode-api/). This also has additional nifty things: like when you only have the city name "Rotterdam", it's clever enough to return the data of [NLRTM](https://unlocode.info/NLRTM) instead of [USRAJ](https://unlocode.info/USRAJ).

Their main product is essentially track and trace for shipping containers, but they do a lot more. Check them out if that interests you.

# License

### UN/LOCODE data
All unlocode data is licensed under the [ODC Public Domain Dedication and Licence (PDDL)](http://opendatacommons.org/licenses/pddl/1-0/).

### Nominatim data
ODbL 1.0. http://osm.org/copyright

### Wikidata
CC-0 (No rights reserved)

### All other contents in this repo
[ODC Public Domain Dedication and Licence (PDDL)](http://opendatacommons.org/licenses/pddl/1-0/)
