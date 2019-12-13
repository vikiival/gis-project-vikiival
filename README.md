## Application description

Goal of this application is to find accomodation according to selected preferences in selected range.
After user finds his/her favourite it shows all preferenced point/polygons on map.
After that it shows path to selected point/polygon

**Scenarios**:
As we mentionded before we have three main scenarios:
 - Automatically refresh data when user moves and according to selected name
 - Filter Points of Interest(POI) based on name, type and distance
 - Show path between selected pois - User selects pois on map and then after click path is showed.

## Frontend
We implemented frontend in Vue.JS along with Typescript. 
This framework for allowed us simplier dynamic data handling.
We used OpenLayers instead of MapBox because it has perfect integration with Vue.js.
For communication with backend we use REST API

There are 3 main components:
- **App.vue** - basic component which renders all other components
- **Map.vue** - top component for other map components, main logic is implemented here
- **Sidebar.vue** - component which represents left panel for interaction

## Backend

On backend side we used Node.JS with Knex (Query Builder) and Knex-postgis.
Using Knex allowed us to write more dynamic queries (e.g filter and search).
As we mentionded it exposes REST API and sends response in JSON format.

## Data

We downloaded data of Slovakia. Data comes from GeoFabrik.

**Hacking Datbase Importing**:

Because we want to find paths in our project. We need to use a path searching algorithm. We used dijskra which is implemented in `pgRounting` extension.
To use pgRounting we have to parse our data to XML (osm). Then we will import data using `osm2pgrouting` and `osm2pgsql`.

Also we also enable `hstore` extension which created column with metadata.
We used this metatags in our full-text search.

```
osmium cat slovakia-latest.osm.pbf -o sk.osm
osm2pgrouting --f sk.osm --conf mapconfig.xml --dbname slovakia --username postgres
osm2pgsql -c -d slovakia -f slovakia-latest.osm.pbf --hstore
```

**Queries**:

One of the biggest obstacles in this project was to create query for dijksra, however we managed it.

```sql
SELECT ways.name as name, st_asgeojson(ways.the_geom)::json as geo
    FROM pgr_dijkstra('
          SELECT gid AS id,
                source,
                target,
                cost_s AS cost
                FROM ways', ${source}, ${target}, false) AS dijkstra
            LEFT JOIN ways
                      ON (edge = gid)
    where ways.the_geom is not null
    ORDER BY seq;
```

**Optimalizations**:
We used indexes for for search tags, way and the_geom (line for dijkstra)

```
create index search_tag_point_index ON planet_osm_point USING GIN(search_tag);
create index planet_point_index on planet_osm_point using gist((way::geography));
create index way_index on ways using gist((the_geom));
```

## API

**Return all unique categories for each type**
```
GET /api/category/:type
```


**Return all hotels on actual viewport**
```json
POST /api/hotels
{
	"extent":[ 16.96579435505948, 48.10381675765325, 17.178353746679388, 48.20184929541517 ]
}
```
response
```json
[
  {
    "name": "Gaudio",
    "id": "3618392207",
    "geo": {
      "type": "Point",
      "coordinates": [
        17.0941971,
        48.1224043999083
      ]
    },
    "meta": {
      "stars": "3",
      "website": "http://www.hotelgaudio.sk/",
      "internet_access": "wlan"
    }
  }
]
```
**Return all POIs for selected hotel and range**
```json
POST /api/search
{
  "coordinates": [
    17.0837956,
    48.1562999999002
  ],
  "searchParams": {
    "name": "dvor",
    "options": null,
    "distance": 10
  }
}
```
```json
[
      {
    "name": "Františkov dvor",
    "id": "4430152918",
    "geo": {
      "type": "Point",
      "coordinates": [
        17.0446169,
        48.2042402998886
      ]
    },
    "meta": {},
    "isPOI": true
  }
]
```
**Show path between selected points**
```json
POST /api/path
{
	"coordinates": [17.0684561, 48.1605090998991],
	"pois": [17.1079439, 48.1067316999121]
}
```
```json
[
  {
    "name": null,
    "geo": {
      "type": "LineString",
      "coordinates": [
        [
          17.067974,
          48.1594723
        ],
        [
          17.0679963,
          48.1595707
        ]
      ]
    }
  }
]
```


## Misc

**ScreenShots**:

Selecting hotels according to name filter.
![Screenshot](01.png)

Setting hotel as starting point for our journey
![Screenshot](02.png)

Filtered and selected POIs for trip
![Screenshot](03.png)

Path from hotel to selected POI
![Screenshot](04.png)


**Instalation Manual**:

Frontend: `yarn && yarn start`
Backend: `npm install && npm start`
Database: 
there is several different plugins
```
create extension unaccent;
create extension pg_trgm;
create extension postgis;
create extension pgrouting;
create extension hstore;
```

**Database Modification**:
We modified table `planet_osm_point` with another column which stores data for fulltext search
```
alter table planet_osm_point add search_tag tsvector;

update planet_osm_point set search_tag = (
    to_tsvector('sk', name || ' ' || tags));
```

Also table `way` was added because of pgRouting.
Each table got column `tags` which is key:value store with entity metadata.

