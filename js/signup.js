const id = document.querySelector("#id");
const username = document.querySelector("#username");
const pwd = document.querySelector("#pwd");
const checkPwd = document.querySelector("#checkPwd");
const email = document.querySelector("#email");
const signUpBtn = document.querySelector("#signUpBtn");

// const crypto = require("crypto");

var re = /^[A-Za-z0-9]{5,15}[@]{1}[A-Za-z0-9]{5,10}[.]{1}[A-Za-z]{2,3}$/;

signUpBtn.addEventListener("click", signUp);

function signUp(){
    if (!id.value) {
        id.focus();
        return alert("아이디를 입력해주세요.");
    }
    else if (!pwd.value) {
        pwd.focus();
        return alert("비밀번호를 입력해주세요")
    }
    
    else if (pwd.value != checkPwd.value) {
        checkPwd.focus();
        return alert("비밀번호가 일치하지 않습니다.");
    }
    else if (!username.value) {
        username.focus();
        return alert("이름을 입력해주세요")
    }
    else if (!email.value || re.test(email)) {
        email.focus();
        return alert("올바른 이메일 주소를 입력하세요.");
    }
    
};


// const password = "비밀번호486";

// 회원가입할 때
// salt 생성
// crypto.randomBytes(64, (error, buf) => {
//     if (error) {
//         console.log(error);
//         return;
//     }
//     const salt = buf.toString("base64");
//     // 생성한 salt 기반으로 비밀번호 암호화
//     crypto.pbkdf2(password, salt, 256, 64, "sha512", (err, key) => {
//         if (err) {
//             console.log(err);
//             return;
//         }
//         const hash = key.toString("base64");

//         // 로그인 시에 비밀번호 비교
//         const pw = "비밀번호485";
//         crypto.pbkdf2(pw, salt, 256, 64, "sha512", (err2, key2) => {
//             if (err2) {
//                 console.log(err2);
//                 return;
//             }

//             const hash2 = key2.toString("base64");
//             if (hash === hash2) {
//                 console.log("로그인 성공!");
//             } else {
//                 console.log("로그인 실패!");
//             }
//         });
//     });
// });