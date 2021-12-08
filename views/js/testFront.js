// const fs = require("fs");
// import { box } from "./node_m";
// console.log(test);

var tmp = document.querySelectorAll('.form');
var imgicon = document.querySelectorAll('.imgicon');
// console.log("tmp length: " + tmp.length);
// console.log(tmp[6].innerHTML);
// console.log(tmp);
// console.log(imgicon);

for (let i=0; i<tmp.length; i++) {
    // console.log(tmp[i].innerHTML);
    imgicon[i].addEventListener('click', ()=> {
        console.log(i);
        tmp[i].submit();
    });
}

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
            const test = document.createElement('div'); //div class="test"
            const contentBox = document.createElement('div');
            const imgBox = document.createElement('div'); 
            const form = document.createElement('form');
            const champname = document.createElement('div');
            const img = document.createElement('img');
            form.setAttribute('method', 'get');
            test.setAttribute('class', 'test');
            champname.setAttribute('class', 'champname');
            imgBox.setAttribute('class', 'img-box');
            contentBox.setAttribute('class', 'content-box');

            if(data[key]!="1") {
                img.setAttribute('src', `./img/iconimg/${key}.png`);
                form.setAttribute('class', 'form');
                form.setAttribute('action', `/skin/${key}`);
                img.setAttribute('class', 'imgicon');
            }

            else {
                img.setAttribute('src', './img/iconimg/Teemo.png');
                contentBox.setAttribute('class', 't1');
            }

            champname.innerHTML = data[key];
            form.appendChild(img);
            imgBox.appendChild(form);
            contentBox.appendChild(imgBox);
            contentBox.appendChild(champname);
            test.appendChild(contentBox);
            box.appendChild(test);

        });

        let tt = document.querySelectorAll('.form');
        let imgic = document.querySelectorAll('.imgicon');

        for (let i=0; i<imgicon.length; i++) {
            imgic[i].addEventListener('click', ()=>{
                tt[i].submit();
            })
        }
        return
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
            console.log("str: " + str);
            placeImg(str);
        } catch(err) {
            console.error(err);
        }
    });
}