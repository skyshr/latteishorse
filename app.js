const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require('dotenv').config();
const session = require("express-session");

app.use(express.static(`${__dirname}/css`));
app.use(express.static(`${__dirname}/js`));
app.use(express.static('views'));

app.set('view engine', 'pug');
app.set('views', './views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    secure: false,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie : {
        maxAge:(1000 * 60 * 100)
    },
}));

const host = '127.0.0.1';
const port = 3000;

const mysql = require('mysql');
var con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

app.get('/', (req, res) => {
    res.render('maintest'); 
});

app.get('/login', (req, res) => {
    res.render('login'); 
});

app.get('/signup', (req, res) => {
    console.log("열기성공");
    res.render('signup'); 
});

app.post('/signup', (req, res) => { 
    console.log(req.body.address);
    con.connect((err) => {       
        var sQuery = `INSERT INTO userinfo (userid, userpassword, username, useremail, useraddress, useraddressdet) VALUES ('${req.body.id}', '${req.body.password}', '${req.body.username}', '${req.body.email}', '${req.body.address}', '${req.body.addressdet}')`;
        
        con.query(sQuery, (err, result, fields) => {
            if(err) throw err;
            console.log("Database NODEPOTFOLIO Create Success!!!");
            console.log(result);
            // console.log(fields);
        });
    });
});

// app.get('/result', (req, res) => {0
//     const result = JSON.parse(newUser.toString(newUser));
//     res.render('result', JSON.stringify(newUser)); 
// });

app.listen(port, host, () => {
    console.log(`Application running at http://${host}:${port}/`);
})