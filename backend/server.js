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

app.get('/api/hotels', (req, res) => {
  db.select('name', st.asGeoJSON(st.transform('way', 4326)).as('geo'))
    .from(DB_TABLE.point)
    .whereNotNull('name')
    .whereIn('tourism', HOTELS)
    .andWhere(
      st.dwithin(
        'way',
        st.transform(
          st.setSRID(st.makePoint(17.064152399999998, 48.1587654), 4326),
          3857
        ),
        3000
      )
    ).orderBy(st.distance(
      'way',
      st.transform(
        st.setSRID(st.makePoint(17.064152399999998, 48.1587654), 4326),
        3857
      )
    ), 'asc')
    .limit(10)
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
    .limit(10)
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
  `).then(({rows}) => res.send(rows))

})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))
