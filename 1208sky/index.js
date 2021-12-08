const bodyParser = require("body-parser");
const express = require("express");
const path = require('path');
// const mysql = require('./dbcon');
const mysql = require('sync-mysql');
var dbconfig = require('./dbconfig.json');
const fs = require('fs');

const app = express();

const host = '127.0.0.1';
const port = 3000;

var connection = new mysql({
    host: dbconfig.host,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database
});

var tmp = JSON.parse(fs.readFileSync('./all.json'));

// for (var element of tmp) {
//     for (var key in element) {
//         var query = `INSERT INTO skininfo (champid, imgsrc) VALUES ("${element[key]}", "${key}")`;
//         connection.query(query);
//     }
// }
// console.log(tmp[0]);
for (var element in tmp) {
    let str = '';
    // console.log(Object.keys(element)[0]);
    let test = fs.readdirSync(`./views/skin/${element}`);
    for (var src of test) {
        str += `${src}/`
    }
    connection.query(`INSERT INTO imagetest (champid, src) VALUES ("${element}", "${str}")`);
}

// var con = mysql.createConnection({
//     host = process.env.HOST,
//     password = process.env.PASSWORD,
//     user : process.env.USER,
//     database : process.env.DATABASE       

// });

// getDbConnection((con));

// mysql.getConnection((err, connection) => {
//     if (!err) {
//         // connection.query("SELECT * FROM class4");
//         console.log("DB Connection Pool Success");
//     }
//     connection.release();
// });

// app.set('view engine', 'ejs');
// app.set('views', './views');

// app.use(express.static(path.join(__dirname, './views')));
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended: true}))

// app.get('/', (req, res) => {
//     res.render('garen');
// })

// app.post('/', (req, res) => {
//     console.log(req.body);
//     console.log(req.body.test0);
// })

// app.post('/:name', (req, res) => { 
//     // console.log(req.params.name);
//     let tmp = req.params.name;
//     console.log(tmp);
//     const sql = `SELECT * FROM usertest WHERE champaddr=("${tmp}")`;
//     try {
//         mysql.getConnection((err, connection) => {
//             // console.log("connection_pool GET");
//             if(err) throw err;
//             connection.query(sql, (err, result)=>{
//                 if(err) throw err;
//                 else {
//                     if(result.length === 0){
//                         connection.query(`INSERT INTO usertest (champaddr) VALUES ("${tmp}")`, (err, result) => {
//                             if (err) throw err;
//                             else {
//                                 res.send(`<script>alert("구매 완료 되었습니다.");
//                                 window.location.href='/';</script>`);
//                             }
//                         });
//                     }
//                     else{
//                         res.send(`<script>alert("이미 보유한 스킨입니다");
//                         window.location.href='/';</script>`);
//                     }
//                 }
//             });
//             connection.release();
//         });
//     } catch (err) {
//         console.log(err);
//     } 
// });

// app.listen(port, host, () => {
//     console.log(`Application server running at http://${host}:${port}...`);
// });