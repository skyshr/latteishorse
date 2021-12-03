// const fs = require("fs");
// import { box } from "./node_m";
// console.log(test);

async function placeImg(line) {
    try {
        if (line=="all") {
            const res = await axios.get('/all');
        }
        else if (line=="top") {
            const res = await axios.get('/top');
        }
        else if (line=="jng") {
            const res = await axios.get('/jng');
        }
        else if (line=="mid") {
            const res = await axios.get('/mid');
        }
        else if (line=="adc") {
            const res = await axios.get('/adc');
        } 
        else {
            const res = await axios.get('/sup');
        }
        const data = res.data;
        let box = document.querySelector('.main-container');
        console.log("line: " + line);
        console.log(box);
        box.innerHTML = '';
        
        Object.keys(data).map((key) => {
            const mainDiv = document.createElement('div');
            mainDiv.setAttribute('class', 'test');
            const imgDiv = document.createElement('div');
            const contentDiv = document.createElement('div');
            const champimg = document.createElement('img');
            champimg.setAttribute('src', `./iconimg/${key}.jpg`);
            contentDiv.textContent = key;

            imgDiv.appendChild(champimg);
            imgDiv.appendChild(contentDiv);
            mainDiv.appendChild(imgDiv);
            box.appendChild(mainDiv);
        });
    } catch (err) {
        console.error(err);
    }
}

var sections = document.querySelectorAll('.line');

for (var i = 0; i<sections.length; i++) {
    sections.item(i).addEventListner('click', (e) => {
        e.preventDefault();
        const text = e.target.innerHTML;
        console.log(text);
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
            else if (text=="바텀") {
                str = 'adc';
            }
            else {
                str = 'sup';
            }
            placeImg(str);
        } catch(err) {
            console.error(err);
        }
    });
}