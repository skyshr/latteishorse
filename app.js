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
        maxAge:(1000 * 60 * 30)
    },
}));

const host = '127.0.0.1';
const port = 3000;

const pool = require("./mysqlcon");

app.get('/', (req, res) => {
    res.render('maintest'); 
});

app.get('/signup', (req, res) => {
    res.render('signup'); 
});

app.post('/signup', (req, res) => { 
    console.log(req.body.address);
    pool.getConnection((err, connection) => {
        if(err) throw err;      

        var sQuery = `INSERT INTO userinfo (userid, userpassword, username, useremail, useraddress, useraddressdet) VALUES ('${req.body.id}', '${req.body.password}', '${req.body.username}', '${req.body.email}', '${req.body.address}', '${req.body.addressdet}')`;
        
        connection.query(sQuery, (err, result, fields) => {
            console.log(result);
        });
        

        connection.release();
    });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;

        var sQuery = `SELECT userid, userpassword FROM userinfo where userid='${req.body.id}'`;
        console.log(sQuery);
        
        connection.query(sQuery, (err, result, fields) => {
            if(err) return res.send("<script>alert('없는 아이디 입니다.');</script>");


            console.log(result[0]);
            if(!result[0]) {
                res.send("<script>alert('없는 아이디 입니다.');</script>");
            }
            // else if(req.body.id == result[0].userid) {
            //     if(req.body.pwd == result[0].userpassword) {
            //         console.log("로그인 성공");
            //         req.session['loginstate'] = 'okay';
            //         res.send("<script>window.close();</script>");
            //         console.log(req.session['loginstate']);
            //     }
            // }; 
        });
        connection.release();
    });
});

app.listen(port, host, () => {
    console.log(`Application running at http://${host}:${port}/`);
})