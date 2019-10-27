const express = require('express');
const knex = require('knex');
const knexPostgis = require('knex-postgis');
var cors = require('cors');

const { DB_TABLE } = require('./constants')
const { hasColumn } = require('./utils')

const app = express()
const port = 8080

app.use([cors(), express.json()])

const db = knex({
  dialect: 'postgres',
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    port: '5432',
    user : 'postgres',
    database : 'slovakia'
  }
});

const st = knexPostgis(db);

// db('planet_osm_point').count('*').then(data => res.send(data))


app.get('/api/shops', (req, res) => {
  db.select('name', st.asGeoJSON(st.transform('way', 4326)).as('geo')).from(DB_TABLE.point).whereNotNull('name').andWhere('shop', 'supermarket').limit(10).then(data => res.send(data))
  
})

app.get('/api/category/:type', ({ params }, res) => {
  hasColumn(db, DB_TABLE.point, 'tourism', (has) => {
    has && db(DB_TABLE.point).distinct('tourism').whereNotNull('tourism').then(data => res.send(data))
  })
})

// app.post('/api/:type/search', ({params, body}, res) => {
//   regex = new RegExp(body.text.toLowerCase())
//   res.send({ data: data[params.type].filter(item => item.name.toLowerCase().match(regex) || item.handle.toLowerCase().match(regex)) })

// })

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
