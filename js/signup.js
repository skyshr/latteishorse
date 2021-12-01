const userid = document.querySelector("#userid");
const username = document.querySelector("#username");
const pwd = document.querySelector("#pwd");
const checkPwd = document.querySelector("#checkPwd");
const email = document.querySelector("#email");
const signUpBtn = document.querySelector("#signUpBtn");
const addr = document.querySelector("#addr");
const addrDet = document.querySelector("#addrDet");
const checkId = document.querySelector(".checkId");
const idChecked = document.querySelector("#idChecked");


var re = /^[A-Za-z0-9]{5,15}[@]{1}[A-Za-z0-9]{5,10}[.]{1}[A-Za-z]{2,3}$/;

signUpBtn.addEventListener("click", signUp);


function signUp(e){
    e.preventDefault()
    if (!userid.value) {
        userid.focus();
        // return alert("아이디를 입력해주세요.");
    }
    else if (!pwd.value) {
        pwd.focus();
        // return alert("비밀번호를 입력해주세요");
    }
    
    else if (pwd.value != checkPwd.value) {
        checkPwd.focus();
        // return alert("비밀번호가 일치하지 않습니다.");
    }
    else if (!username.value) {
        username.focus();
        // return alert("이름을 입력해주세요")
    }
    else if (!email.value || re.test(email)) {
        email.focus();
        // return alert("올바른 이메일 주소를 입력하세요.");
    }
    else if (!addr.value) {
        addr.focus();
        // return alert("주소");
    }
    else if (!addrDet.value) {
        addrDet.focus();
        // return alert("상세 주소를 입력하세요.");
    }
    else if (userid.getAttribute("checkResult") == "fail"){
        // alert("아이디 중복체크를 해주시기 바랍니다.");
        userid.focus();
        return false;
      }
    else{
        alert("회원가입이 완료되었습니다")
        location.reload();
    }
};

function idOverlap() {
    if(!userid.value) {
        alert('아이디를 입력해주세요.')
        return;
    }
    userid.addEventListener("keyup", () => {
        userid.setAttribute("checkResult", "fail");
        checkId.style.display = "inline";
        idChecked.style.display = "none";
    });
    
    // 아이디가 기존 db에 존재하면
    // alert ("이미 존재하는 ID입니다");
    // 존재하지 않으면 
    alert ("사용가능한 ID입니다");
    userid.setAttribute("checkResult", "success");
    checkId.style.display = "none";
    idChecked.style.display = "inline";
};

