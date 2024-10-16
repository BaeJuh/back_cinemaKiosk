class BottomBar {
    constructor(id) {
        this.id = id;
    }

    homeBtnAction() {
        const homeBtn = document.getElementById("homeBtn");
        homeBtn.addEventListener("click", () => {
            window.location.href = "/home";
        });
    }

    backBtnAction() {
        const backBtn = document.getElementById("backBtn");
    }

    clockAction() {
        const clock = document.getElementById("bottomBarClock");

        const setClock = () => {
            const time = new Date();
            const hour = time.getHours().toString().padStart(2, "0");
            const minute = time.getMinutes().toString().padStart(2, "0");

            clock.innerText = `${hour}:${minute}`;
        }
        setClock();
        setInterval(() => {
            setClock();
        }, 5000);
    }

    initBottomBar( target ) {
        const bottomBarHTML = `
            <article class="barButtonsArea">
                <button class="barButtons staffCallButton">직원호출</button>
                <button id="homeBtn" class="barButtons"><i class="bottomBarIcon fa-solid fa-house"></i></button>
                <button id="backBtn" class="barButtons"><i class="bottomBarIcon fa-solid fa-backward"></i></button>
            </article>
            <img class="logoImg" src="images/logo.png" alt="로고이미지">
            <article class="clockArea"><i class="bottomBarIcon fa-regular fa-clock"></i>
                <span id="bottomBarClock" class="timeDisplay">00:00</span>
            </article>
        `;

        target.innerHTML = bottomBarHTML;
    }

    controller( target ) {
        this.initBottomBar( target );
        this.clockAction();
        this.homeBtnAction();
    }
}

const bottomBar = new BottomBar("original");
bottomBar.controller(document.getElementById("bottomBarArea"));