const toggle_movie = document.getElementById("toggle_movie");
const toggle_time = document.getElementById("toggle_time");

toggle_movie.addEventListener("click", ()=>{ // 영화별 선택 누를 때 
    const url = new URL(window.location.href);

    if ( url.pathname !== "/choice" ) {
        window.location.href = "/choice";
    }
});

toggle_time.addEventListener("click", ()=>{ // 시간별 선택 누를 때
    const url = new URL(window.location.href);

    if ( url.pathname !== "/choice_time" ) {
        window.location.href = "/choice_time";
    }
});

document.addEventListener("DOMContentLoaded", () => { // 토글 색상 변경
    const url = new URL(window.location.href);
    console.log( url.pathname );

    if ( url.pathname === '/choice') {
        toggle_movie.className = "toggleItem activeToggle";
        toggle_time.className = "toggleItem";
    } else if ( url.pathname === '/choice_time' ) {
        toggle_movie.className = "toggleItem";
        toggle_time.className = "toggleItem activeToggle";
    }
});