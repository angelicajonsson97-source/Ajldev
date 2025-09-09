const greeting = document.getElementById("greeting");
const hour = new Date().getHours();

if (hour < 12) {
    greeting.textContent = "God morgon och välkommen till min sida! ☀️";
} else if (hour < 18) {
    greeting.textContent = "God eftermiddag! Hoppas du har en fin dag. 🌼";
} else {
    greeting.textContent = "God kväll! Tack för att du besöker min sida. 🌙";
}