const bodyParser = require("body-parser");
const express = require("express");
const path = require('path');
const mysql = require('./dbcon');
// const bodyParser = require('body-parser');
// const getDbConnection = require('./dbcon');

const app = express();

const host = '127.0.0.1';
const port = 3000;

const fs = require('fs');

var tmp = fs.readdirSync('./views/skin');

tmp.forEach(element => {
    let str = '';
    let test = fs.readdirSync(`./views/skin/${element}`);
    test.forEach(val => {
        str += val + '/';
    });
    const sql = `SELECT * FROM imagetest WHERE champid=("${element}")`;
    try {
        mysql.getConnection((err, connection)=>{
            if(err) throw err;
            connection.query(sql, (err, result)=>{
                if(err) throw err;
                else {
                    if(result.length === 0){
                        connection.query(`INSERT INTO imagetest (champid, src) VALUES ("${element}", "${str}")`, (err, result) => {
                            if (err) throw err;
                        });
                    }
                }
            });
            connection.release();
        });
    } catch (err) {
        console.log(err);
        connection.release();
    } 
});

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
//     let tmp = './imgicon/' + req.params.name.replace('_','/')+'.jpg';
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

app.listen(port, host, () => {
    console.log(`Application server running at http://${host}:${port}...`);
});