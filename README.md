An enhanced UN/LOCODE dataset with significant improvements:

# Significantly better coordinates
The main reason this project exists: coordinates in [the original UN/LOCODE list](https://github.com/datasets/un-locode) have major problems:

**1. Only 80% of locations have coordinates**

This doesn't just include tiny villages, but world's most important cities like London (GBLON), Madrid (ESMAD), Luxembourg (LULUX) and Milano (ITMIL).

**2. Many coordinates are just wrong**

Quite a few coordinates have typos (ATWIS), but many are just flat out wrong (EGSCN)

This project aims to solve most of these cases by combining the data with data from OpenStreetMap's [Nominatim API](https://nominatim.org/release-docs/latest/api/Overview/) and [Wikidata](https://www.wikidata.org/).

**3. Multiple coordinate formats**

Most UN/LOCODES coordinates look like USNYC: 4042N 07400W. However, entries in Bhutan like BTPDL have decimal coordinates: 26.8128N 89.1903E. This project solves this with 2 columns: the `Coordinates` column now has only the UN/LOCODE style degrees, while the `CoordinatesDecimal` column has a decimal representation.

You can find the improved list as [code-list-improved.csv](data/code-list-improved.csv). It has both corrected coordinates, as well as just way more of them (98.4%).

# A defined hierarchy
For example: [CNSHZ](https://unlocode.info/CNSHA) (Shanghai Hongqiao International Apt), is in Shanghai ([CNSGH](https://unlocode.info/CNSGH)), but how would you know these are essentially the same place? Ideally, you'd want to know the Airport is in Shanghai.

For this, [parents.csv](data/parents.csv) is created, which looks like this:

```
Unlocode,Parent
CNSHZ,CNSGH
CNPDG,CNSGH
```
With this, you can easily find out these are all related.

# Actually working aliases
Both "Vienna" and "Wien" refer to the same city. How do you find out both are ATVIE? The actual spelling in the dataset is Wein (for some reason), so that's no help. [alias.csv](data/alias.csv) isn't much help either: it doesn't doesn't include "Vienna". It also has other problems like spelling which doesn't match the UN/LOCODE entry, which makes this nigh impossible to use.

Enter [aliases-improved.csv](data/aliases-improved.csv), which looks like this:

```
Unlocode,Alias
ATVIE,Wien
ATVIE,Vienna
```

This is much more useful. Not only because of the easier setup, but mostly because of its sheer size. The official dataset has less than 100 aliases, this one has over 575.000.

# About UN/LOCODES
The United Nations Code for Trade and Transport Locations is a code list mantained by UNECE (a United Nations agency) to facilitate trade. The list is comes from the [UNECE page](http://www.unece.org/cefact/locode/welcome.html), released twice a year.

# License

### UN/LOCODE data
All unlocode data is licensed under the [ODC Public Domain Dedication and Licence (PDDL)](http://opendatacommons.org/licenses/pddl/1-0/).

### Nominatim data
ODbL 1.0. http://osm.org/copyright

### Wikidata
CC-0 (No rights reserved)

### All other contents in this repo
CC-0 (No rights reserved)
