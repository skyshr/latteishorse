const mysql = require('sync-mysql');
var dbconfig = require('./dbconfig.json');
const fs = require('fs');

var connection = new mysql({
    host: dbconfig.host,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database
});

var tmp = JSON.parse(fs.readFileSync('./skin.json'));

for (var element of tmp) {
    for (var key in element) {
        var query = `INSERT INTO test (champid, imgsrc) VALUES ("${element[key]}", "${key}")`;
        connection.query(query);
    }
}