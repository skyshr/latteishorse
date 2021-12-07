const moveAnimTriggerMargin = 250; // 스크롤 범위
const moveAnimElementList = document.querySelectorAll('.moveAnim');


const moveAnimFunc = function() {
    for (const element of moveAnimElementList) {
        if (!element.classList.contains('show')) {
            if (window.innerHeight > element.getBoundingClientRect().top + moveAnimTriggerMargin) {
                element.classList.add('show');
            }
        }
    }
}

window.addEventListener('load', moveAnimFunc);
window.addEventListener('scroll', moveAnimFunc);



const toggleBtn = document.querySelector('.nav_toggleBtn');
const menu = document.querySelector('.nav_menu');
const signUp = document.querySelector('.nav_signUp');

toggleBtn.addEventListener('click', () => {
    menu.classList.toggle('active');
    signUp.classList.toggle('active');
});



window.onload = function () {
    var elm = ".forWheelPage";
    $(elm).each(function (index) {
        // 개별적으로 Wheel 이벤트 적용
        $(this).on("mousewheel DOMMouseScroll", function (e) {
            e.preventDefault();
            var delta = 0;
            if (!event) event = window.event;
            if (event.wheelDelta) {
                delta = event.wheelDelta / 120;
                if (window.opera) delta = -delta;
            } 
            else if (event.detail)
                delta = -event.detail / 3;
            var moveTop = $(window).scrollTop();
            var elmSelecter = $(elm).eq(index);
            // 마우스휠을 위에서 아래로
            if (delta < 0) {
                if ($(elmSelecter).next() != undefined) {
                    try{
                        moveTop = $(elmSelecter).next().offset().top;
                    }catch(e){}
                }
            // 마우스휠을 아래에서 위로
            } else {
                if ($(elmSelecter).prev() != undefined) {
                    try{
                        moveTop = $(elmSelecter).prev().offset().top;
                    }catch(e){}
                }
            }
             
            // 화면 이동 0.8초(800)
            $("html,body").stop().animate({
                scrollTop: moveTop + 'px'
            }, {
                duration: 800, complete: function () {
                }
            });
        });
    });
}
