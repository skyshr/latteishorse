// const fs = require("fs");
// import { box } from "./node_m";
// console.log(test);

async function placeImg(line) {
    try {
        let res = ''
        if (line=="all") {
            res = await axios.get('/all');
        }
        else if (line=="top") {
            res = await axios.get('/top');
        }
        else if (line=="jng") {
            res = await axios.get('/jng');
        }
        else if (line=="mid") {
            res = await axios.get('/mid');
        }
        else if (line=="adc") {
            res = await axios.get('/adc');
        } 
        else {
            res = await axios.get('/sup');
        }
        const data = res.data;
        let box = document.querySelector('.main-container');
        console.log("line: " + line);
        console.log(box);
        box.innerHTML = '';
        
        Object.keys(data).map((key) => {
            const mainDiv = document.createElement('div');
            const imgDiv = document.createElement('div');
            const contentDiv = document.createElement('div');
            const champimg = document.createElement('img');
            if(data[key]!="1") {
                champimg.setAttribute('src', `./img/iconimg/${key}.png`);
            }
            contentDiv.innerHTML = data[key];

            imgDiv.appendChild(champimg);
            imgDiv.appendChild(contentDiv);
            mainDiv.appendChild(imgDiv);
            box.appendChild(mainDiv);
            if (data[key]=="1") {
                imgDiv.setAttribute('class', 't1');
                champimg.setAttribute('src', './img/iconimg/Teemo.png');
            }
            mainDiv.setAttribute('class', 'test');

        });
    } catch (err) {
        console.error(err);
    }
}

var sections = document.querySelectorAll('.line');

for (var i = 0; i<sections.length; i++) {
    sections[i].addEventListener('click', (e) => {
        e.preventDefault();
        const text = e.target.innerHTML;
        // console.log(text);
        let str = '';
        try {
            if (text=="전체") {
                str = "all";
            }
            else if (text=="탑") {
                str = "top";
            }
            else if (text=="정글") {
                str = 'jng';
            }
            else if (text=="미드") {
                str = 'mid';
            }
            else if (text=="원딜") {
                str = 'adc';
            }
            else {
                str = 'sup';
            }
            // console.log("str: " + str);
            placeImg(str);
        } catch(err) {
            console.error(err);
        }
    });
}