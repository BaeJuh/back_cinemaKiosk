const touchLayer = document.getElementById("touchLayer");

const clock = document.getElementById("barClockArea");

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

touchLayer.addEventListener("click", () => {
    window.location.href = "/home";
});