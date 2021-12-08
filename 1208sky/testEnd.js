const fs = require('fs').promises;

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require("body-parser");
const mysql = require('./dbcon');
// const mysql1 = require('sync-mysql');

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static(path.join(__dirname, './views')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/all', async(req, res) => {
    const data = await fs.readFile('./all.json');
    res.writeHead(200, {'Content-Type': 'text/html'});
    return res.end(data);
});

app.get('/top', async(req, res) => {
    const data = await fs.readFile('./top.json');
    res.writeHead(200, {'Content-Type': 'text/html'});
    return res.end(data);
});

app.get('/mid', async(req, res) => {
    const data = await fs.readFile('./mid.json');
    res.writeHead(200, {'Content-Type': 'text/html'});
    return res.end(data);
});

app.get('/jng', async(req, res) => {
    const data = await fs.readFile('./jng.json');
    res.writeHead(200, {'Content-Type': 'text/html'});
    return res.end(data);
});

app.get('/adc', async(req, res) => {
    const data = await fs.readFile('./adc.json');
    res.writeHead(200, {'Content-Type': 'text/html'});
    return res.end(data);
});

app.get('/sup', async(req, res) => {
    const data = await fs.readFile('./sup.json');
    res.writeHead(200, {'Content-Type': 'text/html'});
    return res.end(data);
});

app.get('/:name', (req, res) => {
    var tmp = req.params.name;
    console.log(tmp);
    const sql = `SELECT * FROM imagetest WHERE champid=("${tmp}")`;
    const path = `skin/${tmp}/`
    let skinName = [];
    try {
        mysql.getConnection((err, connection) => {
            if(err) throw err;
            
            connection.query(sql, (err, result)=>{
                console.log("connection success!");
                if(err) throw err;
                    // console.log("imgPath: " + imgPath);

                connection.query(`SELECT * FROM skininfo WHERE imgsrc LIKE '%${tmp}%'`, (err, result) => {
                    if (err) throw err;
                    
                    else {
                        for (var element of result) {
                            skinName.push({imgsrc : `${path}${element.imgsrc}`, skin: `${element.champid}`});
                        }
                        // console.log(result);
                        // console.log(skinName);
                        console.log(skinName);
                        res.render('garen', {test: skinName});
                    }
                });
            });
            connection.release();
        });
    } catch (err) {
        console.log(err);
    }
});

app.get('/', (req, res) => {
    res.render('test2');
})

app.listen(3000, () => {
    console.log('server listening at 3000...');
});