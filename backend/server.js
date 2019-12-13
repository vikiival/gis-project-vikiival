const express = require('express')
const knex = require('knex')
const knexPostgis = require('knex-postgis')
var cors = require('cors')

const { DB_TABLE, HOTELS } = require('./constants')
const { hasColumn } = require('./utils')

const app = express()
const port = 8080

app.use([cors(), express.json()])

const db = knex({
  dialect: 'postgres',
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: '5432',
    user: 'postgres',
    database: 'slovakia',
  },
})

const st = knexPostgis(db)

// db('planet_osm_point').count('*').then(data => res.send(data))

app.get('/api/shops', (req, res) => {
  db.select('name', st.asGeoJSON(st.transform('way', 4326)).as('geo'))
    .from(DB_TABLE.point)
    .whereNotNull('name')
    .andWhere('shop', 'supermarket')
    .limit(10)
    .then(data => res.send(data))
})

app.get('/api/category/:type', ({ params }, res) => {
  hasColumn(db, DB_TABLE.point, params.type, has => {
    has &&
      db(DB_TABLE.point)
        .distinct(params.type)
        .whereNotNull(params.type)
        .then(data => res.send(data.map(el => el[params.type] )))
  })
})

app.post('/api/hotels', ({ body }, res) => {
  const [minx, miny, maxx, maxy] = body.extent
  
  db
    .select(db.raw(
      `name, osm_id as id, st_asgeojson(st_transform(way, 4326))::json as geo, hstore_to_json(tags) as meta`
    ))
    .from(DB_TABLE.point)
    .whereNotNull('name')
    .whereIn('tourism', HOTELS)
    .whereRaw(`
    ST_Contains(st_makeenvelope(${minx}, ${miny}, ${maxx}, ${maxy}, 4326), st_transform(way, 4326))
    `)
    .then(data => res.send(data))
})

app.post('/api/pois', ({ params, body }, res) => {
  const [lat, long] = body.coordinates
  db.select('name','osm_id', st.asGeoJSON(st.transform('way', 4326)).as('geo'))
    .from(DB_TABLE.point)
    .whereNotNull('name')
    .andWhere(
      st.dwithin(
        'way',
        st.transform(st.setSRID(st.makePoint(lat, long), 4326), 3857),
        10000
      )
    )
    .then(data => res.send(data))
})

app.post('/api/path', async ({ params, body }, res) => {
  const [lat, long] = body.coordinates
  const [latP, longP] = body.pois[0]

  console.log(body);
  

  const sourcePoints = await db.select('id')
  .from(DB_TABLE.vertices)
  .orderBy(
    st.distance(
      'the_geom',
      st.setSRID(st.makePoint(lat, long), 4326)
    )
  )
  .limit(10)

  const targetPoints = await db.select('id')
  .from(DB_TABLE.vertices)
  .orderBy(
    st.distance(
      'the_geom',
      st.setSRID(st.makePoint(latP, longP), 4326)
    )

  )
  .limit(10)

  const source = sourcePoints.reduce((prev, act) => prev.id > act.id ? prev.id : act.id)
  const target = targetPoints.reduce((prev, act) => prev.id > act.id ? prev.id : act.id)
  console.log('source and target' ,source, target);
  

  db.raw(`
    SELECT dijkstra.*, ways.name, st_asgeojson(ways.the_geom) as geo
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
  `)
  .then(({rows}) => res.send(rows))

})

app.post('/api/search', ({ body }, res) => {
  const { name, distance } = body.searchParams
  const [lat, long] = body.coordinates
   const query = db
    .select(db.raw(
      `name, osm_id as id, st_asgeojson(st_transform(way, 4326))::json as geo, hstore_to_json(tags) as meta`
    ))
    .from(DB_TABLE.point)
    .whereNotNull('name')
    .limit(100)

    if (name) {
      query.whereRaw("search_tag @@ to_tsquery('sk', ?)", [name])
    }

    if (distance && body.coordinates) {
      query.where(
        st.dwithin(
          'way',
          st.transform(st.setSRID(st.makePoint(lat, long), 4326), 3857),
          distance * 1000
        )
      )
    }

    query.then(data => res.send(data.map(el => ({ ...el, isPOI: true }))))
})


app.get('/api/kek', (req, res) => {
  db
  .raw(`select st_asgeojson(st_envelope('LINESTRING(17.035887268561574 48.145116112475534, 17.09792420449326 48.1737239281984 )'::geometry))::json as geo`)
  .then(({rows}) => res.send(rows))
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
