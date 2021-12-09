// localStorage.setItem('point', 100);
// import {a} from "./test"
// console.log('a:' + a);
var btn = document.querySelectorAll('.buy');
var price = document.querySelectorAll('.test');

console.log("btn length: " + btn.length);

function make() {
    let currentPoint = 100;
    if (localStorage.getItem('point')) currentPoint = Number(localStorage.getItem('point'));
    console.log(Number(localStorage.getItem('point')));
    console.log(currentPoint);
    for (let element=0; element< btn.length; element++) {
        let btnBox = document.querySelectorAll('.btn-box');
        let p = price[element].innerHTML;
        // console.log(check);

        if (p > currentPoint) {
            // if (check) {
            //     check.innerHTML = '포인트 부족';
            // }
            // else {
                let tmp = document.createElement('span');
                tmp.setAttribute('id', 'test');
                tmp.innerHTML = '포인트 부족';
                tmp.style.fontSize = "80%";
                tmp.style.color = "red";
                btnBox[element].appendChild(tmp);
            // }
        }
        else {
            // if (check!=null) {
            //     check.innerHTML = "구매 가능";
            // }
            // else {
                let tmp = document.createElement('span');
                tmp.setAttribute('id', 'test');
                tmp.innerHTML = '구매 가능';
                tmp.style.fontSize = "80%";
                tmp.style.color = "green"
                btnBox[element].appendChild(tmp);
            // }
        }
    
            // setTimeout( () => {
            //     document.querySelectorAll('.btn-box')[element].appendChild(tmp);
            // },600);
    
        btn[element].addEventListener('click', () => {
            if (currentPoint >= p) {
                let tmp = confirm(`${p} 포인트가 차감됩니다.
정말 진행하시겠습니까?`);
                if (tmp) {
                    document.querySelectorAll('.form')[element].submit();
                }
            }
            
            else {
                alert('포인트가 부족합니다.');
            }
            // window.location.href = "./garen.html";
            // console.log("point: " + currentPoint);
            // window.location.href = './garen.html';
            // history(0);
            
        });
    }
}
// make();
window.onload = make();