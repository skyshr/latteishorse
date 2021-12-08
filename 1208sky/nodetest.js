const fs = require('fs');
const dirpath = '"./iconimg/';

let arr = []
let champMatch = fs.readFileSync('./all.json', 'utf-8');
var data = JSON.parse(champMatch);
// console.log(data['Garen']); //가렌
// var files = fs.readdirSync('./iconimg');
Object.keys(data).map((key) => {
    arr.push(dirpath+key+'.png"');
});
// console.log(arr)
let str = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test</title>
    <style>
        .champion {
            background-color: violet;
            width: 900px;
            height: auto;
            margin-left: 13%;
            margin-top: 15%;
        }

        .line_seperator {
            background-color: yellowgreen;
            display: flex;
            justify-content: flex-start;
        }

        .main-container {
            background-color: tomato;
            display: flex;
            width: 95%;
            height: auto;
            margin: auto;
            justify-content: center;
            flex-wrap: wrap;
            text-align: center;
        }

        button {
            margin: auto;
        }

        a {
            margin: auto;
            background-color: turquoise;
        }

        .test {
            margin: auto;
            padding-bottom: 7px;
            font-size: 0.65rem;
        }
        
        .t1 {
            margin: auto;
            visibility: hidden;
        }

        .champname {
            margin: auto;
        }

        img {
            width: 90px;
            height: 90px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="champion">
        <div class="line_seperator">
            <form action="/" method="get">
                <button type='submit' class="line">전체</a></button>
                <button type='submit' class="line">탑</a></button>
                <button type='submit' class="line">정글</button>
                <button type='submit' class="line">미드</button>
                <button type='submit' class="line">원딜</button>
                <button type='submit' class="line">서폿</button>
            </form>
        </div>
        <div class="main-container">
            `;

for (var element of arr) {
    let tmp = element.split('/')[2].split('.')[0]; //Garen
    if (!data[tmp].includes("1")) {
    str += `
    <div class="test">
        <div class="content-box">
            <div class="img-box">
                <form class="form" action="/${tmp}" method="get">
                    <img src=${element} class="imgicon">
                </form>
            </div>
            <div class="champname">${data[tmp]}</div>
        </div>
    </div>`
    }
}

str+= 
`<div class="test"><div class="t1"><img src="./iconimg/Teemo.png"><div class="champname">티모</div></div></div>
<div class="test"><div class="t1"><img src="./iconimg/Teemo.png"><div class="champname">티모</div></div></div>
<div class="test"><div class="t1"><img src="./iconimg/Teemo.png"><div class="champname">티모</div></div></div>
<div class="test"><div class="t1"><img src="./iconimg/Teemo.png"><div class="champname">티모</div></div></div>
<div class="test"><div class="t1"><img src="./iconimg/Teemo.png"><div class="champname">티모</div></div></div>
</div>
</div>
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script src="./testFront.js"></script>
</body>
</html>`

// console.log(str);
fs.writeFileSync('./test3.html', str);