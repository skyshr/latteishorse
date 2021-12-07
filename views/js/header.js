const toggleBtn = document.querySelector('.nav_toggleBtn');
const menu = document.querySelector('.nav_menu');
const signUp = document.querySelector('.nav_signUp');

toggleBtn.addEventListener('click', () => {
    menu.classList.toggle('active');
    signUp.classList.toggle('active');
});