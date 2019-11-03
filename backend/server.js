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
        .then(data => res.send(data))
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
        10000
      )
    )
    .limit(10)
    .then(data => res.send(data))
})

app.post('/api/pois', ({ params, body }, res) => {
  const [lat, long] = body.coordinates
  db.select('name', st.asGeoJSON(st.transform('way', 4326)).as('geo'))
    .from(DB_TABLE.polygon)
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
