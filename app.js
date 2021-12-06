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
    saveUninitialized: true,
    cookie : {
        maxAge:(1000 * 60 * 30)
    },
}));

const host = '127.0.0.1';
const port = 3000;

const pool = require("./mysqlcon");

app.get('/test', (req, res) => {
    res.render('maintest', {loginstate:req.session.loginstate, id:req.session.uid}); 
});
app.get('/', (req, res) => {
    res.render('index', {loginstate:req.session.loginstate, id:req.session.uid}); 
});

app.post('/logout', (req, res) => {
    delete req.session.loginstate;
    delete req.session.uid;
    res.send('<script>window.location.href = "/"; </script>'); 
    console.log(req.session.loginstate)
});

app.get('/signup', (req, res) => {
    res.render('signup'); 
});

app.post('/signup', (req, res) => { 
    console.log(req.body.address);
    pool.getConnection((err, connection) => {
        if(err) throw err;      

        var sQuery = `INSERT INTO userinfo (userid, userpassword, username, useremail, useraddress, useraddressdet) VALUES ('${req.body.id}', '${req.body.password}', '${req.body.username}', '${req.body.email}', '${req.body.address}', '${req.body.addressdet}')`;
        var checkQuery = `SELECT userid FROM userinfo where userid='${req.body.id}'`;
        

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
                res.send("<script>window.close();</script>");
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

        var sQuery = `SELECT userid, userpassword FROM userinfo where userid='${req.body.id}'`;
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
                    connection.release();
                    res.send("<script>opener.parent.location.reload();window.close();</script>");
                    console.log(req.session.loginstate);
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

app.get('/form', (req, res) => { 
    res.render('form', {
        name : '보더코딩',  // ejs 파일 의 <%%> 태그안에 담길 변수들
        blog : '보더코딩의 블로그',
        homepage : '보더코딩의 홈페이지'
    }); // res.render 는 해당 'view' 파일을 지정할수잇음
});

app.post('/form', (req, res) => { // post 요청에 응당하는 router
    res.json(req.body) // 요청받은데이터를 json 함수로 response 하겟음
});


app.get('/board/list', (req, res) => {  // list/1 이 아니라  /list 로만 라우팅됫을때 /list/1 로 보내준다
    res.redirect('/board/list/1');
});

app.get('/board/list/:page', (req, res) => { // board/list/page숫자 형식으로 받을거
    pool.getConnection((err, connection) => {
        if(err) throw err;
        var page = req.params.page; // :page 로 맵핑할 req 값을 가져온다
        var sQuery = "SELECT idx, name, title, date_format(modidate, '%Y-%m-%d %H:%i:%s') modidate, " +   
            "date_format(regdate,'%Y-%m-%d %H:%i:%s') regdate from userboard";
        connection.query(sQuery, (err, rows) => {  // select 쿼리문 날린 데이터를 rows 변수에 담는다 오류가 있으면 err
            if(err) throw err;
            res.render('list', {title : '게시판 리스트', rows:rows});
        });
        connection.release();
    });
});

app.get('/board/write', (req, res) => {  // board/write 로 접속하면 글쓰기페이지로 이동
    res.render('write', {title : "게시판 글쓰기"})
});

app.post('/board/write', (req, res) => {
    var name = req.body.name;                   
    var title = req.body.title;
    var content = req.body.content;
    var passwd = req.body.passwd;
    var datas = [name, title, content, passwd]; // 모든데이터를 배열로 묶기
    // req 객체로 body 속성에서 input 파라미터 가져오기
    pool.getConnection((err, connection) =>{
        if(err) throw err;
        var sQuery = "insert into userboard(name, title, content, regdate, modidate, passwd,hit) values(?,?,?,now(),now(),?,0)";  // ? 는 매개변수
        connection.query(sQuery, datas, (err,rows) => { // datas 를 매개변수로 추가
            if (err) throw err;
            res.redirect('/board/list')
        })
        connection.release();
    });
});

app.get('/board/read/:idx', (req, res) => { // board/read/idx숫자 형식으로 받을거
    var idx = req.params.idx; // :idx 로 맵핑할 req 값을 가져온다
    pool.getConnection((err, connection) =>{
        if(err) throw err;
        var sQuery = "SELECT idx, name, title, content, date_format(modidate, '%Y-%m-%d %H:%i:%s') modidate, " +   
        "date_format(regdate,'%Y-%m-%d %H:%i:%s') regdate, hit from userboard where idx=?";
        connection.query(sQuery,[idx], (err, rows) => {  // 한개의 글만조회하기때문에 마지막idx에 매개변수를 받는다
            if(err) throw err;
            res.render('read', {title : '글 상세보기', rows:rows[0]}); // 첫번째행 한개의데이터만 랜더링 요청
        });
        connection.release();
    });
});



app.post('/board/update', (req, res) => {
    var idx = req.body.idx;
    var name = req.body.name;
    var title = req.body.title;
    var content = req.body.content;
    var passwd = req.body.passwd;
    var datas = [idx, name, title, content, passwd]; // 변수설정한 값을 datas 에 배열화

    pool.getConnection((err, connection) => {
        if(err) throw err;
            var sQuery = "UPDATE userboard set name=?, title=?, content=? ,modidate=now() where idx=? and passwd=?"; // id 값과 비밀번호를 조건절로 걸엇음
            connection.query(sQuery, datas, (err, result) => {
            if (err) console.error(err);
            if(result.affectedRows == 0) //affectedRows  해당쿼리로 변경된수의 행 불러오기 0이면 업데이트 되지않으므로 비밀번호가 틀린것임
                { res.send("<script>alert('비밀번호가 일치하지않습니다');history.back();</script>")
                } 
                else {
                res.redirect('/board/read/' + idx);
                }
            connection.release();
        });
    })
    
});

app.get('/board/page/:page', (req, res) => { // 게시글 리스트에 :page가 추가된것임
    var page = req.params.page; // 현재 페이지는 params 을 req 요청받아옴
    pool.getConnection((err, connection) => {
        if(err) throw err;
        var sQuery =  "select idx, name, title, date_format(modidate,'%Y-%m-%d %H:%i:%s') modidate, " +
        "date_format(regdate,'%Y-%m-%d %H:%i:%s') regdate, hit from userboard";  // select 구절 그대로

        connection.query(sQuery, (err, rows) => {
            if (err) throw err;
            res.render('page', {title : '글목록', rows:rows, page:page, length:rows.length-1, page_num:10, pass:true}); 
            // length 데이터 전체넘버 랜더링,-1을 한이유는 db에서는1부터지만 for문에서는 0부터 시작 ,page_num: 한페이지에 보여줄 갯수
            console.log(rows.length-1);
        });
        connection.release();
    });
});

app.post('/board/delete', (req, res) => {
    var idx = req.body.idx;
    var passwd = req.body.passwd;
    var datas = [idx, passwd];

    pool.getConnection((err, connection) => {
        if(err) throw err;
        var sQuery = "delete from userboard where idx=? and passwd=?"; // 업데이트 수정과 거의 비슷한 쿼리문
        connection.query(sQuery, datas, (err, result) => {
            if(err) throw err;
            else if(result.affectedRows == 0){
                res.send("<script>alert('패스워드가 일치하지 않습니다.');history.back();</script>");
            } else {
                res.redirect('/board/list');
            }
        });
        connection.release();
    })
    
});