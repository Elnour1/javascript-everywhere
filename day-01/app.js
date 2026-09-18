let myName = "Nour Elsayed"
let myCity = "Cairo"
let ReasonJoining = "I want to learn JavaScript and become a web developer."
function introduction(myName, myCity, ReasonJoining) {
    return `My name is ${myName}. I live in ${myCity}. I joined this program because ${ReasonJoining}`;
}
console.log(introduction(myName, myCity, ReasonJoining));
function changeText() {
    document.getElementById("introduction").innerText = "Good that you got here.";
    document.getElementById("introduction").style.color = "green";
}

function consoleLog() {
    console.log("Good that you got here.");
}