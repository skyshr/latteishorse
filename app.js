const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require('dotenv').config();
const session = require("express-session");

// app.use(express.static(`${__dirname}/css`));
// app.use(express.static(`${__dirname}/js`));
app.use(express.static(`views`));
// app.use(express.static(`css`));
// app.use(express.static(`${__dirname}/views`));
// app.use(express.static(`views`));

app.set('view engine', 'pug');
app.set('views', './views');
// app.set('views', './');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    secure: false,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie : {
        maxAge:(1000 * 60 * 30)
    },
}));

const host = '127.0.0.1';
const port = 3000;

const pool = require("./mysqlcon");

app.get('/', (req, res) => {
// <<<<<<< HEAD
    if (req.session.uid==undefined) {
        let dataPrim =null;
        return res.render('index', {loginstate:req.session.loginstate, id:req.session.uid, dataPrim: dataPrim});
    }
    try {
        pool.getConnection((err, connection) => {
            connection.query(`SELECT * FROM userinfo WHERE userid= "${req.session.uid}"`, (err, result) => {
                if (err) throw err;
                
                let id = result[0].userid;
                let point = result[0].userpoint;
                let dataPrim = {id: id, point: point};
                res.render('index', {loginstate:req.session.loginstate, id:req.session.uid, dataPrim: dataPrim});
                connection.release();
            });
        })
    } catch (err) {
        if (err) throw err;
        connection.release();
    }
    // res.render('index', {loginstate:req.session.loginstate, id:req.session.uid}); 
    // console.log("loginstate: " + req.session.loginstate);
    // console.log("session uid: " + req.session.uid);
// =======
//     res.render('index', {loginstate:req.session.loginstate, id:req.session.uid, userpoint:req.session.userpoint}); 
//     console.log(req.session.loginstate);
//     console.log(req.session.uid);
//     console.log(req.session.userpoint);
// >>>>>>> b815abcf2ccb248b5149500a9410aeaff41616ed
});

// 스킨페이지테스트중
// app.get('/skinTrade', (req, res) => {
//     res.render('garen'); 
// });

// 마이페이지
app.get('/mypage', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        var sQuery = `SELECT * FROM userboard  where userid='${req.session.uid}'`;
        connection.query(sQuery, (err, rows, fields) => {
            if(err) throw err;

            console.log(rows.length);
            console.log(rows[0]);

            connection.query(`SELECT champseq FROM userinfo where userid="${req.session.uid}"`, (err, result)=> {
                if (err) throw err;
                let tmp =result[0].champseq.split('/');
                if (tmp.length==1) {
                    let imgsrc = null;
                    connection.release();
                    return res.render('mypage', {title:"마이페이지", imgsrc: imgsrc, rows:rows, pass:true, loginstate:req.session.loginstate, id:req.session.uid});
                }
                let imgsrc = []
                console.log(tmp);
                tmp.forEach(val => {
                    let number = Number(val);
                    console.log(typeof(number));
                    if (val!=0) {
                        console.log(number);
                        let test = `${number}`;
                        console.log(typeof(test));
                        connection.query(`SELECT imgsrc FROM skininfo where seq="${number}"`, (err, res4) => {
                            if (err) console.log('error');
                            console.log("res: " + res4[0].imgsrc);
                            let a = `img/skin/${res4[0].imgsrc.split('_')[0]}/${res4[0].imgsrc}`;
                            let path = {imgsrc: a};
                            imgsrc.push(path);
                            console.log(imgsrc);
                            if (imgsrc.length==tmp.length-1) {
                                res.render('mypage', {title:"마이페이지", imgsrc: imgsrc, rows:rows, pass:true, loginstate:req.session.loginstate, id:req.session.uid});
                                connection.release();
                            }
                            // res.render('mypage', {title:"마이페이지", rows:rows, pass:true, loginstate:req.session.loginstate, id:req.session.uid});
                        })
                    }
                })
                // console.log('imgsrc: ' + imgsrc);
            });
                    
            
        
            // let skinName = [];
                
            // var sQuery = `SELECT champseq FROM userinfo  where userid='${req.session.uid}'`;
            // connection.query(sQuery, (err, result, fields) => {
            //     if(err) throw err;
            //     result[0].champseq.split('/');
            //     for(i=0; i<result[0].champseq.split('/').length; i++) {
            //         if(i=0) {continue}
            //         else{
            //             var skQuery = `SELECT imgsrc FROM skininfo where seq='${result[i]}'`
            //             connection.query(skQuery, (err, result, fields) => {
            //                 var name = result[0].split('_')[0];
            //                 var path = `img/skin/${name}/${result[0]}`;
            //                 skinName.push({skinsrc:path});
            //                 res.render('mypage', {title:"마이페이지", rows:rows, skinpath:skinName, pass:true, loginstate:req.session.loginstate, id:req.session.uid});
            //             });
            //         };
            //     }
            // })
        });
    });
});

app.post('/logout', (req, res) => {
    delete req.session.loginstate;
    delete req.session.uid;
    delete req.session.userpoint;
    delete req.session.idx;
    res.send(`<script>window.location.href = "/"; </script>`);
});

app.get('/signup', (req, res) => {
    res.render('signup'); 
});

app.post('/signup', (req, res) => { 
    console.log(req.body.address);
    pool.getConnection((err, connection) => {
        if(err) throw err;      

        var sQuery = `INSERT INTO userinfo (userid, userpassword, username, useremail, useraddress, useraddressdet, userpoint) VALUES ('${req.body.id}', '${req.body.password}', '${req.body.username}', '${req.body.email}', '${req.body.address}', '${req.body.addressdet}', 200)`;
        var checkQuery = `SELECT userid FROM userinfo where userid='${req.body.id}'`;
        // var sQuery2 = `SELECT * FROM userboard WHERE userid=${req.session.uid}`;
        

        connection.query(checkQuery, (err, result, fields) => {
            if(err) throw err;

            if(result[0]) {
                connection.release();
                res.send('<script>alert("이미 있는 아이디입니다 다시 입력해주세요"); window.location.href = "/signup"; </script>');
            } else {
                connection.query(sQuery, (err, result, fields) => {
                    if(err) throw err;
                
                    console.log(result); 
                });
                connection.release();
                res.send("<script>alert('회원가입이 완료되었습니다.'); window.close();</script>");
            };
        });
    });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;

        var sQuery = `SELECT userid, userpassword, userpoint FROM userinfo where userid='${req.body.id}'`;
        console.log(sQuery);
        
        connection.query(sQuery, (err, result, fields) => {
            if(err) return err;


            console.log(result[0]);
            if(result.length == 0) {
                connection.release();
                res.send('<script>alert("아이디를 확인해주세요"); window.location.href = "/login"; </script>');
            }
            else if(req.body.id == result[0].userid) {
                if(req.body.pwd == result[0].userpassword) {
                    console.log("로그인 성공");
                    req.session.loginstate = 'okay';
                    req.session.uid = result[0].userid;
                    req.session.userpoint = result[0].userpoint;
                    connection.release();
                    res.send("<script>alert('환영합니다!');opener.parent.location.reload();window.close();</script>");
                    console.log(req.session.loginstate);
                    console.log(req.session.uid);
                }
                else {
                    console.log("비밀번호 오류");
                    connection.release();
                    res.send('<script>alert("비밀번호를 확인해주세요"); window.location.href = "/login"; </script>');
                }
            }; 
        });
    });
});

app.listen(port, host, () => {
    console.log(`Application running at http://${host}:${port}/`);
})

// req.session.save(function(){ 
//     rsp.redirect('/');
// });
// delete req.session.uid;
// req.session.destory(function(err){});

app.get('/board/page', (req, res) => {  // page/1 이 아니라  /page 로만 라우팅됫을때 /page/1 로 보내준다
    res.redirect('/board/page/1');
    console.log("==============");
    console.log(req.session.loginstate);
});

app.get('/board/page/:page', (req, res) => { // 게시글 리스트에 :page가 추가된것임
    var page = req.params.page; // 현재 페이지는 params 을 req 요청받아옴
    pool.getConnection((err, connection) => {
        if(err) throw err;
        var sQuery =  "select idx, userid, title, date_format(modidate,'%Y-%m-%d %H:%i:%s') modidate, " +
        "date_format(regdate,'%Y-%m-%d %H:%i:%s') regdate, hit from userboard";  // select 구절 그대로

        connection.query(sQuery, (err, rows) => {
            if (err) throw err;
            if (req.session.uid==null) {
                let dataPrim = null;
                connection.release();
                return res.render('boardpage', {title : '글목록', rows:rows, page:page, length:rows.length-1, page_num:10, pass:true, loginstate:req.session.loginstate, id:req.session.uid, dataPrim: dataPrim}); 
            }
            connection.query(`SELECT * FROM userinfo WHERE userid= "${req.session.uid}"`, (err, result) => {
                if (err) throw err;
                
                let id = result[0].userid;
                let point = result[0].userpoint;
                let dataPrim = {id: id, point: point};
                connection.release();
                return res.render('boardpage', {title : '글목록', rows:rows, page:page, length:rows.length-1, page_num:10, pass:true, loginstate:req.session.loginstate, id:req.session.uid, dataPrim: dataPrim}); 
            })
            // res.render('boardpage', {title : '글목록', rows:rows, page:page, length:rows.length-1, page_num:10, pass:true, loginstate:req.session.loginstate, id:req.session.uid}); 
            // length 데이터 전체넘버 랜더링,-1을 한이유는 db에서는1부터지만 for문에서는 0부터 시작 ,page_num: 한페이지에 보여줄 갯수
            // console.log(rows.length-1);
        });
        // connection.release();
    });
});

app.post('/board/search', (req,res) => {
    var item = req.body.category;
    var searchvalue = req.body.search;
    console.log(item + searchvalue);
    pool.getConnection((err, connection) => {
        if(err) throw err;
        var sQuery =  `select idx, userid, title, date_format(modidate,'%Y-%m-%d %H:%i:%s') modidate, date_format(regdate,'%Y-%m-%d %H:%i:%s') regdate, hit from userboard where ${item}="${searchvalue}"`;  

        connection.query(sQuery, (err, rows) => {
            if (err) throw err;
            if (req.session.uid==null) {
                let dataPrim = null;
                connection.release();
                console.log(rows[0]);
                return res.render('searchpage', {title : '검색결과', rows:rows, length:rows.length-1, page_num:10, pass:true, loginstate:req.session.loginstate, id:req.session.uid, dataPrim: dataPrim}); 
            }
            connection.query(`SELECT * FROM userinfo WHERE userid= "${req.session.uid}"`, (err, result) => {
                if (err) throw err;
                
                let id = result[0].userid;
                let point = result[0].userpoint;
                let dataPrim = {id: id, point: point};
                connection.release();
                console.log(rows[0]);
                return res.render('searchpage', {title : '검색결과', rows:rows, length:rows.length-1, page_num:10, pass:true, loginstate:req.session.loginstate, id:req.session.uid, dataPrim: dataPrim}); 
            })
        });
    });
})

app.get('/board/write', (req, res) => {  // board/write 로 접속하면 글쓰기페이지로 이동
    console.log(req.session.uid)
    pool.getConnection((err, connection) =>{
        if(err) throw err;
        connection.query(`SELECT * FROM userinfo WHERE userid= "${req.session.uid}"`, (err, result) => {
            if (err) throw err;
            
            let id = result[0].userid;
            let point = result[0].userpoint;
            let dataPrim = {id: id, point: point};
            connection.release();
            return res.render('write', {title : "게시판 글쓰기", loginstate:req.session.loginstate, id:req.session.uid, dataPrim: dataPrim});
        })
    })
    // res.render('write', {title : "게시판 글쓰기", loginstate:req.session.loginstate, id:req.session.uid})
});

app.post('/board/write', (req, res) => {
    var userid= req.session.uid;                   
    var title = req.body.title;
    var content = req.body.content;
    var datas = [userid, title, content]; // 모든데이터를 배열로 묶기
    // req 객체로 body 속성에서 input 파라미터 가져오기
    pool.getConnection((err, connection) =>{
        if(err) throw err;
        var sQuery = "insert into userboard(userid, title, content, regdate, modidate, hit, likeuser) values(?,?,?,now(),now(),0,0)";  // ? 는 매개변수
        var pQuery = `UPDATE userinfo set userpoint=userpoint+10 where userid='${userid}'`;
        connection.query(sQuery, datas, (err,rows) => { // datas 를 매개변수로 추가
            if (err) throw err;

            connection.query(pQuery, (err, result) => {
                if(err) throw err;
              
                res.redirect('/board/page');
            })
        })
        connection.release();
    });
});

app.get('/board/read/:idx', (req, res) => { // board/read/idx숫자 형식으로 받을거
    var idx = req.params.idx; // :idx 로 맵핑할 req 값을 가져온다
    req.session.idx = idx;
    pool.getConnection((err, connection) =>{ //조회수 1씩 증가
        if(err) throw err;
        var hQuery = `UPDATE userboard set hit=hit+1 where idx='${idx}'`;
        connection.query(hQuery,[idx], (err, result) => {
            if(err) throw err;
            var sQuery = "SELECT idx, userid, title, content, date_format(modidate, '%Y-%m-%d %H:%i:%s') modidate, " +   
            "date_format(regdate,'%Y-%m-%d %H:%i:%s') regdate, hit from userboard where idx=?";
            connection.query(sQuery,[idx], (err, rows) => {  // 한개의 글만조회하기때문에 마지막idx에 매개변수를 받는다
                if(err) throw err;
                var cQuery = "SELECT idx, userid, comments from commentboard where board_idx=?";
                connection.query(cQuery,[idx], (err, comrows) => {
                    if(err) throw err;
                    connection.query(`SELECT * FROM userinfo WHERE userid= "${req.session.uid}"`, (err, result) => {
                        if (err) throw err;
                        let dataPrim=null;
                        if(result.length!=0){
                            let id = result[0].userid;
                            let point = result[0].userpoint;
                            dataPrim = {id: id, point: point};
                        }
                        
                        req.session.idx = idx;
                        connection.release();
                        return res.render('read', {title : '글 상세보기', rows:rows[0], comrows:comrows, loginstate:req.session.loginstate, id:req.session.uid, dataPrim:dataPrim}); // 첫번째행 한개의데이터만 랜더링 요청
                    })
                })
                    // res.render('read', {title : '글 상세보기', rows:rows[0], comrows:comrows, loginstate:req.session.loginstate, id:req.session.uid}); // 첫번째행 한개의데이터만 랜더링 요청
            })
            
        // connection.release();
        });
    });
});

app.post('/board/like', (req, res) => {
    var idx = req.session.idx;
    var id = req.session.uid;
    var cQuery =`SELECT likeuser FROM userboard WHERE idx='${idx}'`;
    
    pool.getConnection((err, connection)=>{
        if(err) throw err;

        connection.query(cQuery, (err, result) => {
            if(err) throw err;

            var likeusers = result[0].likeuser.split('/'); //배열
            if(!likeusers.includes(id)) {
                likeusers.push(id);
                var likeuserstr = likeusers.join('/');
                var sQuery =`UPDATE userboard set likeuser="${likeuserstr}" where idx='${idx}'`;
                connection.query(sQuery, (err,rows) => {
                    if(err) throw err;

                    connection.release();
                    res.redirect('/board/read/' + idx);
                });
            } else {
                var filtered = likeusers.filter((element) => element !== `${id}`);
                var likeuserj = filtered.join('/')
                var tQuery =`UPDATE userboard set likeuser="${likeuserj}" where idx='${idx}'`;
                connection.query(tQuery, (err,rows) => {
                    if(err) throw err;

                    connection.release();
                    res.redirect('/board/read/' + idx);
                });
            }
        })
    }) 
})

app.post('/board/update', (req, res) => {
    console.log("update")
    var idx = req.body.idx;
    var userid = req.session.uid;
    var title = req.body.title;
    var content = req.body.content;
    var datas = [idx, userid, title, content]; // 변수설정한 값을 datas 에 배열화

    pool.getConnection((err, connection) => {
        if(err) throw err;
        
        var cQuery = `SELECT userid FROM userboard where idx='${idx}'`
        connection.query(cQuery, (err, result) =>{
            if(err) throw err;

            console.log(result[0].userid);
            if(userid == result[0].userid) {
                var sQuery = `UPDATE userboard set userid='${userid}', title='${title}', content='${content}' ,modidate=now()  where idx='${idx}'`; 
                connection.query(sQuery, datas, (err, result) => {
                    if (err) console.error(err);
                    else {
                        res.redirect('/board/read/' + idx);
                    }
                    connection.release();
                });
            } 
            else {
                res.send('<script>alert("작성자만 수정할 수 있습니다"); window.location.href = "/board/page"; </script>');
            }
        });
    })
    
});

app.post('/board/delete', (req, res) => {
    console.log("delete")
    var userid = req.session.uid;
    var idx = req.body.idx;
    var passwd = req.body.passwd;
    var datas = [idx, passwd];

    pool.getConnection((err, connection) => {
        if(err) throw err;

        var cQuery = `SELECT userid FROM userboard where idx='${idx}'`
        connection.query(cQuery, (err, result) =>{
            if(err) throw err;

            console.log(result[0].userid);
            if(userid == result[0].userid) {
                var sQuery = `DELETE from userboard where idx='${idx}'`; // 업데이트 수정과 거의 비슷한 쿼리문
                    connection.query(sQuery, datas, (err, result) => {
                    if(err) throw err;
                    else {
                        res.redirect('/board/page')
                    }
                    connection.release();
                }); 
            }
            else{
                res.send('<script>alert("작성자만 삭제할 수 있습니다"); window.location.href = "/board/page"; </script>');
            }
        });
    });
});

app.get('/board/rewrite', (req, res) => { 
    var idx = req.session.idx; 
    pool.getConnection((err, connection) =>{ 
        if(err) throw err;

        // if(err) throw err;
        var sQuery = "SELECT idx, userid, title, content, date_format(modidate, '%Y-%m-%d %H:%i:%s') modidate, " +   
        "date_format(regdate,'%Y-%m-%d %H:%i:%s') regdate, hit from userboard where idx=?";

        connection.query(sQuery,[idx], (err, rows) => {  // 한개의 글만조회하기때문에 마지막idx에 매개변수를 받는다
            if(err) throw err;
            
            let id = rows[0].userid;
            let point = rows[0].userpoint;
            let dataPrim = {id: id, point: point};
            connection.release();
            return res.render('rewrite', {title : '글 수정/삭제', rows:rows[0], loginstate:req.session.loginstate, id:req.session.uid, dataPrim: dataPrim})
            
            // res.render('read', {title : '글 수정/삭제', rows:rows[0], loginstate:req.session.loginstate, id:req.session.uid}); // 첫번째행 한개의데이터만 랜더링 요청
        });
    // connection.release();
//         connection.query(sQuery,[idx], (err, rows) => {  
//             if(err) throw err;
        
//             res.render('rewrite', {title : '글 수정/삭제', rows:rows[0], loginstate:req.session.loginstate, id:req.session.uid});
//         });
//         connection.release();

    });
});


app.post('/board/comment', (req, res) => {
    var userid = req.session.uid;
    var comments = req.body.comment;
    var board_idx = req.body.idx;
    var datas = [userid, comments, board_idx];
    pool.getConnection((err, connection) =>{
        if(err) throw err;
        var pQuery = `UPDATE userinfo set userpoint=userpoint+5 where userid='${userid}'`;
        var sQuery = "insert into commentboard(userid, comments, board_idx) values(?,?,?)";  // ? 는 매개변수
        connection.query(sQuery, datas, (err,rows) => { // datas 를 매개변수로 추가
            if (err) throw err;
            connection.query(pQuery, (err, result) => {
                if(err) throw err;
                
                connection.release();
                res.redirect('/board/read/' + board_idx);
            })
        })
    });
});

app.post('/board/comment/delete', (req, res) => {
    var board_idx = req.body.idx;
    var comidx = req.body.comidx;
    pool.getConnection((err, connection) =>{
        if(err) throw err;
        var sQuery = `DELETE from commentboard where idx='${comidx}'`; 
            connection.query(sQuery, (err, result) => {
            if(err) throw err;
            else {
                res.redirect('/board/read/' + board_idx)
            }
            connection.release();
        }); 
    });
});

//sky 추가

const fsp = require('fs').promises;

app.get('/all', async(req, res) => {
    const data = await fsp.readFile('./all.json');
    res.writeHead(200, {'Content-Type': 'text/html'});
    return res.end(data);
});

app.get('/top', async(req, res) => {
    const data = await fsp.readFile('./top.json');
    res.writeHead(200, {'Content-Type': 'text/html'});
    return res.end(data);
});

app.get('/mid', async(req, res) => {
    const data = await fsp.readFile('./mid.json');
    res.writeHead(200, {'Content-Type': 'text/html'});
    return res.end(data);
});

app.get('/jng', async(req, res) => {
    const data = await fsp.readFile('./jng.json');
    res.writeHead(200, {'Content-Type': 'text/html'});
    return res.end(data);
});

app.get('/adc', async(req, res) => {
    const data = await fsp.readFile('./adc.json');
    res.writeHead(200, {'Content-Type': 'text/html'});
    return res.end(data);
});

app.get('/sup', async(req, res) => {
    const data = await fsp.readFile('./sup.json');
    res.writeHead(200, {'Content-Type': 'text/html'});
    return res.end(data);
});

app.get('/skin/:name', (req, res) => { //imagetest table있어야함
    var tmp = req.params.name;
    console.log(tmp);
    if (req.session.loginstate==undefined) {
        return res.send("<script>alert('로그인이 필요한 서비스입니다.');window.location.href='/'</script>")};
    const sql = `SELECT * FROM imagetest WHERE champid=("${tmp}")`;
    const path = `img/skin/${tmp}/`
    let skinName = [];
    try {
        pool.getConnection((err, connection) => {
            if(err) throw err;
            
            connection.query(sql, (err, result)=>{
                console.log("connection success!");
                if(err) throw err;
                    // console.log("imgPath: " + imgPath);

                connection.query(`SELECT * FROM skininfo WHERE imgsrc LIKE '%${tmp}%'`, (err, result) => {
                    if (err) throw err;
                    
                    else {
                        for (var element of result) {
                            skinName.push({imgsrc : `${path}${element.imgsrc}`, skin: `${element.champid}`, money: `${element.cpoint}`});
                        }
                        // console.log(result);
                        // console.log(skinName);
                        // console.log(skinName);
                        // res.render('garen', {test: skinName});

                        connection.query(`SELECT * FROM userinfo WHERE userid= "${req.session.uid}"`, (err, result) => {
                            if (err) throw err;
                            
                            let id = result[0].userid;
                            let point = result[0].userpoint;
                            let dataPrim = {id: id, point: point};
                            res.render('garen', {test: skinName, dataPrim: dataPrim, loginstate:req.session.loginstate, id:req.session.uid});
                            connection.release();
                        });
                    }
                });
            });
        });
    } catch (err) {
        console.log(err);
    }
});

app.get('/skinTrade', (req, res) => {
    if (req.session.loginstate==undefined) {
        // let dataPrim = {id: '', point: ''};
        let dataPrim = null
        return res.render('test2', {dataPrim:dataPrim})
    }
    try {
        pool.getConnection((err, connection) => {
            if(err) throw err;
            connection.query(`SELECT * FROM userinfo WHERE userid="${req.session.uid}"`, (err, result)=>{
                if(err) throw err;
                let id = result[0].userid;
                let point = result[0].userpoint;
                console.log("id, point : " + id + " " + point);
                let dataPrim = {id: id, point: point};
                res.render('test2', {dataPrim: dataPrim,  loginstate:req.session.loginstate, id:req.session.uid});
            });
            connection.release();
        });
    } catch(err) {
        console.log(err);
    }
})

app.post('/skin/:name', (req, res) => { 
    // console.log(req.params.name);
    // console.log('userid: ' + req.session.uid);
    console.log("post");
    let tmp = req.params.name+'.jpg';
    
    const sql = `SELECT * FROM skininfo WHERE imgsrc=("${tmp}")`;
    let num = null;
    try {
        pool.getConnection((err, connection) => {
            if(err) throw err;
            connection.query(sql, (err, result)=>{
                if(err) throw err;
                let point = result[0].cpoint;
                
                num = String(result[0].seq);
                connection.query(`SELECT * FROM userinfo WHERE userid=("${req.session.uid}")`, (err, result) => {
                    if (err) throw err;
                    let tmp = result[0].champseq;
                    let money = result[0].userpoint;
                    if(tmp==undefined || !tmp.includes(num)){
                        if (money>point) {
                            tmp+=`/${num}`
                            money-=point;
                            connection.query(`UPDATE userinfo SET champseq = ("${tmp}"), userpoint = ("${money}") WHERE userid="${req.session.uid}"`, (err, result) => {
                                if (err) throw err;
                                else {
                                    console.log(result);
                                    res.send(`<script>alert("구매 완료 되었습니다.");
                                    window.location.href='/';</script>`);
                                }
                            });
                        }
                        else {
                            res.send(`<script>alert("포인트가 부족합니다.")</script>`)
                        }
                    }
                    else{
                        res.send(`<script>alert("이미 보유한 스킨입니다");
                        window.location.href='/';</script>`);
                    }

                })
            });
            connection.release();
        });
    } catch (err) {
        console.log(err);
    } 
});
