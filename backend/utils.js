const hasColumn = (db, table , columnName, cb) => {
  db(table).columnInfo().then((info) => { 
    cb(Object.keys(info).includes(columnName))
  });
}


module.exports = {
  hasColumn
}