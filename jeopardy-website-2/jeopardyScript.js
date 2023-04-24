// Particle-related JS variables.
let hostToken = "ea3c2338e55789e7a7d111e97413ffb8c1775c99";
let hostID = "39001d000e47313037363132";
// Michael's IoT - Player 1 - Yellow Button
let accessToken = "a121cf36f50a3d6b55e3a45985ef3c28fe437ec6";
let deviceID = "2c0025001947313037363132";
// Tony's IoT - Player 2 - Blue Button
let accessToken2 = "6d55a9b06976533656f501d0b0aa189fcc34ec6e";
let deviceID2 = "1c0032000847313037363132";
let particle = new Particle();

// 2D array with both questions and answers for Jeopardy, the arrays are ordered the same way they would be on the board.
let jeopardyQuestions = [
    ["British Guiana is now called this.", "This famous soft drink was invented in 1892.", "This Pokemon is the #1 in the Pokedex.", "This Minnesota company invented the Post-It note.", "This is where the Pyramid of the Sun is located.", "This man was known as the father of computer"],
    ["It is the title of Stephen King's novel about a creepy clown.", "This word in spanish means 'little golden things'.", "This Pokemon was the first to be created.", "This Minnesota mall became the first fully indoor mall in the United States.", "This was the first toy to be advertised on television.", "The basic goal of computer process is to convert data into."],
    ["The major powers of Europe were involved in this war that lasted the 7 years between 1756 & 1763.", "This country invented the french fries.", "This person is the creator of Pokemon.", "This Minnesota town is the home of the 'Jolly Green Giant' vegetable mascot.", "This country was Cleopatra's birthplace.", "This is the most powerful computer."],
    ["You must be at least 21 to play at Luxor Las Vegas' 38 tables for this game.", "This food can never go bad", "Ash is from this town.", "This meat product is manufactured in Austin, MN.", "This country has the oldest dynasty that is still ruling.", "This is where the CPU and memory located in the computer."],
    ["This is the highest mountain in Kenya.", "This is the oldest soft drink in the USA.", "This Pokemon is known for singing its enemies to sleep.", "This Minnesota company manufactures the Super Bowl rings.", "This African country named its capital after a U.S. president.", "This is the most common acronym of the word COMPUTER."]
];
let jeopardyAnswers = [
    ["Guyana", "Coca Cola", "Bulbasaur", "3M", "Teotihuacán, Mexico", "Charles Babbage"],
    ["IT", "Doritos", "Rhydon", "Southdale Mall", "Mr. Potato Head", "Information"],
    ["The Seven Years War", "Belgium", "Satoshi Tajiri", "Le Sueur, MN", "Greece", "Supercomputer"],
    ["21", "Honey", "Pallet Town", "Spam", "Japan", "Motherboard"],
    ["Mt. Kenya", "Dr. Pepper", "Jigglypuff", "Jostens", "Liberia", "Commonly Operating Machine Purposely Used for Technical and Educational Research"]
];

// Constant variables.
const buttonDiv = document.getElementById("buttonDiv");
const buzzerNoti = document.getElementById("buzzerNotification");
const jeopardyScreen = document.getElementById("tempButton");
jeopardyScreen.style.visibility = "hidden";

// Dynamic variables.
let responseTimes = [null, null];
let winner = 0;
let wasStealing = false;
let selectedMoney = 0;
let selectedButton;
let scores = [0, 0];
let buttonMode = 1;

// Set up of correctButton and incorrectButton for awarding points and allowing for steals during Jeopardy.
let correctButton = document.getElementById("correctButton");
particle.getEventStream({ deviceId: hostID, name: 'Correct', auth: hostToken }).then(function (stream) {
    stream.on('event', function (data) {
        onCorrectAnswer()
    });
});
correctButton.style.visibility = "hidden";
let incorrectButton = document.getElementById("incorrectButton");
particle.getEventStream({ deviceId: hostID, name: 'Incorrect', auth: hostToken }).then(function (stream) {
    stream.on('event', function (data) {
        onWrongAnswer()
    });
});
incorrectButton.style.visibility = "hidden";

// Function handling the correct button, awards money depending on who won the buzzer race.
function onCorrectAnswer() {
    buzzerNoti.innerHTML = "Player " + winner + " provided the correct answer! They win: $" + selectedMoney;
    scores[winner - 1] += selectedMoney;
    buttonMode = 2;
    newJeopardy(2, 3);
    updateScores();
}

// Function handling the wrong button, allows the other player to steal.
function onWrongAnswer() {
    scores[winner - 1] -= selectedMoney;
    updateScores();

    if (wasStealing) {
        buttonMode = 2;
        newJeopardy(2, 3);
        return;
    }

    buzzerNoti.innerHTML = "Player " + winner + " provided the wrong answer, another player can now steal!";
    responseTimes[0] = null;
    responseTimes[1] = null;
    waitForButtonPress(winner == 1 ? 2 : 1);
    wasStealing = true;
    winner = 0;
    setTimeout(getButtonResponse, 5000);
}

function createButton(width, height) {
    // Create all  buttons on the board.
    for (let i = 0; i < height; i++) {
        for (let b = 0; b < width; b++) {
            let btn = document.createElement("BUTTON");
            let text = document.createTextNode("$" + (i + 1) * 100);
            btn.appendChild(text);
            buttonDiv.appendChild(btn);
            btn.id = (b + 1) + "button" + (i + 1) * 100;
            btn.className = "boxButton";
            btn.onclick = function () { buttonFunction(i, b) };
        }
        let linebreak = document.createElement('br');
        buttonDiv.appendChild(linebreak);
    }
}

function buttonFunction(i, b) {
    // Update money prize for specific question;
    selectedMoney = (i + 1) * 100;

    /* Make correct and incorrect buttons visible - Disabled in favor of physical host board buttons.
    correctButton.style.visibility = "visible";
    incorrectButton.style.visibility = "visible"; */

    // Create new button used to display jeopardy information, enlarge button to entire screen.
    jeopardyScreen.style.visibility = "visible";
    jeopardyScreen.innerHTML = jeopardyQuestions[i][b];
    jeopardyScreen.style.height = "100vh";
    jeopardyScreen.style.width = "100%";
    jeopardyScreen.style.position = 'absolute';
    jeopardyScreen.style.bottom = 0;
    jeopardyScreen.style.left = 0;
    jeopardyScreen.style.zIndex = 10;
    jeopardyScreen.onclick = function () { newJeopardy(i, b) };

    selectedButton = document.getElementById((b + 1) + "button" + (i + 1) * 100);

    wasStealing = false;

    particle.callFunction({ deviceId: hostID, name: 'aerSetAnswer', argument: jeopardyAnswers[i][b], auth: hostToken });

    // Call the timer in particle.
    let updateIotTime = particle.callFunction({ deviceId: deviceID, name: 'aerStartTimer', argument: '', auth: accessToken });
    let updateIotTime2 = particle.callFunction({ deviceId: deviceID2, name: 'aerStartTimer', argument: '', auth: accessToken2 });
    // Reset response times.
    responseTimes[0] = null;
    responseTimes[1] = null;
    // Allow buttons to respond to particle.
    waitForButtonPress(1);
    waitForButtonPress(2);
    // Determine who won.
    setTimeout(getButtonResponse, 5000);
}

function waitForButtonPress(device) {
    particle.getEventStream({ deviceId: device == 1 ? deviceID : deviceID2, name: 'ButtonPressed', auth: device == 1 ? accessToken : accessToken2 }).then(function (stream) {
        stream.on('event', function (data) {
            responseTimes[device - 1] = data.published_at;
            stream.abort();
        });
    });
}

// Check which particle responded first.
function getButtonResponse(){
    // timestamp ex: 2023-04-05T15:24:28.137Z
    // String manipulation of the json timestamp in order to determine who pressed the button first.
    let pTime1;
    let pTime2;
    
    if (responseTimes[0] != null){pTime1 = responseTimes[0].slice(11, 13)*3600 + responseTimes[0].slice(14, 16)*60 + responseTimes[0].slice(17, 19) + responseTimes[0].slice(20, 22)/1000}
    if (responseTimes[1] != null){pTime2 = responseTimes[1].slice(11, 13)*3600 + responseTimes[1].slice(14, 16)*60 + responseTimes[1].slice(17, 19) + responseTimes[1].slice(20, 22)/1000}

    if(responseTimes[0] == null && responseTimes[1] == null){
    if(jeopardyScreen.style.visibility == "visible" && buttonMode == 1){
            buzzerNoti.innerHTML = "No one buzzed in...";
    }
    }else if(pTime1 < pTime2 || responseTimes[1] == null){
    if(jeopardyScreen.style.visibility == "visible" && buttonMode == 1){
            buzzerNoti.innerHTML = "Particle 1 buzzed in!";
    }
        winner = 1;
    }else if(pTime2 < pTime1 || responseTimes[0] == null){
    if(jeopardyScreen.style.visibility == "visible" && buttonMode == 1){
            buzzerNoti.innerHTML = "Particle 2 buzzed in!";
    }
        winner = 2;
    }
    responseTimes[0] = null;
    responseTimes[1] = null;
}


// Functionality for the fullscreen mode; handles questions and answers
function newJeopardy(i, b) {
    selectedButton.innerHTML = "​";
    selectedButton.disabled = true;
    // New button functionality.
    if (buttonMode == 1) {
        // Fetch Jeopardy Answer from the 2D array.
        jeopardyScreen.innerHTML = '"' + jeopardyAnswers[i][b] + '"';
        buzzerNoti.innerHTML = "​";
        buttonMode++;
    } else if (buttonMode == 2) {
        // Make the new button invisible again, return back to original board.
        buttonMode = 1;
        buzzerNoti.innerHTML = "​";

        jeopardyScreen.innerHTML = "​";
        jeopardyScreen.style.height = "10%";
        jeopardyScreen.style.width = "10%";
        jeopardyScreen.style.visibility = "hidden";

        correctButton.style.visibility = "hidden";
        incorrectButton.style.visibility = "hidden";

        jeopardyScreen.style.zIndex = 0;
        // Set winner back to 0, deselect prize.
        winner = 0;
        selected = 0;
    }
}
// Function for updating scores.
function updateScores() {
    let pscore1 = document.getElementById("score1");
    let pscore2 = document.getElementById("score2");

    particle.callFunction({ deviceId: deviceID, name: 'aerSetScore', argument: scores[0].toString(), auth: accessToken });
    particle.callFunction({ deviceId: deviceID2, name: 'aerSetScore', argument: scores[1].toString(), auth: accessToken2 });

    pscore1.innerHTML = "$" + scores[0];
    pscore2.innerHTML = "$" + scores[1];
}
// Run functions
window.createButton(6, 5);

correctButton.onclick = function () { onCorrectAnswer() };
incorrectButton.onclick = function () { onWrongAnswer() };