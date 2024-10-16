// 테스트 코드임 테스트 코드임 테스트 코드임 테스트 코드임 테스트 코드임 테스트 코드임 테스트 코드임 

const test = document.getElementById("testId");

test.style.display = "none";

document.addEventListener("DOMContentLoaded", () => { // 토글 색상 변경
    const url = new URL(window.location.href);

    if ( url.pathname === '/choice') {
        test.style.display = "none";
    } else if ( url.pathname === '/choice_time' ) {
        test.style.display = "block";
    }
});