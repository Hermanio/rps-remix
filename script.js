"use strict";

var moveHistory   = [];
var playerScore   = 0;
var tiesCounter   = 0;
var opponentScore = 0;
var timer;
var roundCounter  = 0;
var timeCounter   = 0;

var isGameRunning = false;

window.onload = function () {
	togglePlayButtons();
	updateScoreBoard();
};
function updateImages(humanMove, opponentMove) {
	document.getElementById("playerImage").src   = "./images/" + humanMove + ".png";
	document.getElementById("opponentImage").src = "./images/" + opponentMove + ".png";
}

function updateScoreBoard() {
	document.getElementById("playerScore").innerHTML   = playerScore;
	document.getElementById("tiesCounter").innerHTML   = tiesCounter;
	document.getElementById("opponentScore").innerHTML = opponentScore;
	document.getElementById("roundCounter").innerHTML  = roundCounter;
	document.getElementById("timeCounter").innerHTML   = timeCounter;

}

function clearMoveHistory() {
	var moveHistoryContainer       = document.getElementById("moveHistory");
	moveHistoryContainer.innerHTML = "";
}

function updateMoveHistory() {

	var moveHistoryContainer = document.getElementById("moveHistory");
	var singleMoveHistoryElementContainer;

	//image elements (literally images)
	var roundCounterElement;
	var humanMoveImageElement;
	var opponentMoveImageElement;

	//container elements (column parts)
	var humanMoveContainer;
	var roundCounterContainer;
	var opponentMoveContainer;

	singleMoveHistoryElementContainer           = document.createElement('div');
	singleMoveHistoryElementContainer.className = "row marginCancel";

	humanMoveImageElement = document.createElement('img');
	humanMoveImageElement.classList.add("img-responsive");
	humanMoveImageElement.classList.add("move-icon");
	humanMoveImageElement.setAttribute("src", "./images/" + moveHistory[moveHistory.length - 1].humanMove + "-icon.png");

	roundCounterElement           = document.createElement('div');
	roundCounterElement.innerText = moveHistory[moveHistory.length - 1].roundCounter;

	opponentMoveImageElement = document.createElement('img');
	opponentMoveImageElement.classList.add("img-responsive");
	opponentMoveImageElement.classList.add("move-icon");
	opponentMoveImageElement.setAttribute("src", "./images/" + moveHistory[moveHistory.length - 1].opponentMove + "-icon.png");

	humanMoveContainer = document.createElement("div");
	humanMoveContainer.classList.add("col-xs-4");
	humanMoveContainer.classList.add("paddingCancel");

	humanMoveContainer.appendChild(humanMoveImageElement);

	roundCounterContainer = document.createElement("div");
	roundCounterContainer.classList.add("col-xs-4");
	roundCounterContainer.classList.add("paddingCancel");
	roundCounterContainer.appendChild(roundCounterElement);

	opponentMoveContainer = document.createElement("div");
	opponentMoveContainer.classList.add("col-xs-4");
	opponentMoveContainer.classList.add("paddingCancel");

	opponentMoveContainer.appendChild(opponentMoveImageElement);

	singleMoveHistoryElementContainer.appendChild(humanMoveContainer);
	singleMoveHistoryElementContainer.appendChild(roundCounterContainer);
	singleMoveHistoryElementContainer.appendChild(opponentMoveContainer);

	// jQuery because it makes life a lot easier and fixes huge memory usage bug
	$(moveHistoryContainer).prepend(singleMoveHistoryElementContainer);

}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function runAnimation(view, animation) {
	switch(view) {
		case "player-view":
			document.getElementById("playerImage").classList.add("imageMovement");
			setTimeout(function () {
				document.getElementById("playerImage").classList.remove("imageMovement");
				console.log("animation ended");
			}, 1000); //animation runs for 1 second
			break;
		case "opponent-view":
			document.getElementById("opponentImage").classList.add("imageMovement");
			setTimeout(function () {
				document.getElementById("opponentImage").classList.remove("imageMovement");
				console.log("animation ended");
			}, 1000); //animation runs for 1 second
			break;
		case "score-view-container":
		default:
			break;
	}
	document.getElementById(view).classList.add(animation);
	console.log("animation added");
	setTimeout(function () {
		document.getElementById(view).classList.remove(animation);
		console.log("animation ended");
	}, 1000); //animation runs for 1 second
}
function updateScore(humanMove, opponentMove) {
	if (humanMove === opponentMove) {
		runAnimation("score-view-container", "draw");
		tiesCounter++;
		console.log("Tied!");
	} else if (
		humanMove === 'rock' && opponentMove === 'scissors' ||
		humanMove === 'paper' && opponentMove === 'rock' ||
		humanMove === 'scissors' && opponentMove === 'paper') {
		runAnimation("player-view", "player-win");
		playerScore++;
		console.log("player win");
	} else {
		runAnimation("opponent-view", "opponent-win");
		opponentScore++;
		console.log("opponent win!");
	}

	roundCounter++;
}

function makeMove(move) {
	var humanMove    = move;
	var opponentMove = makeOpponentMove();

	moveHistory.push(
		{
			roundCounter : roundCounter,
			humanMove    : move,
			opponentMove : opponentMove
		}
	);

	updateScore(humanMove, opponentMove);
	updateImages(humanMove, opponentMove);
	updateScoreBoard();
	updateMoveHistory();

}

function generateRandomMove() {
	var moveList = ['rock', 'paper', 'scissors'];

	return moveList[getRandomInt(0, 2)];
}

function generateWinningMove(humanMove) {
	switch (humanMove) {
		case "rock":
			return "paper";
		case "paper":
			return "scissors";
		case "scissors":
			return "rock";
		default:
			console.log("Invalid move");
			break;
	}
}

function makeOpponentMove() {
	var opponentMove;
	var lastHumanMoves = [];

	if (moveHistory.length >= 3) {
		var lastMovesFromMoveHistory = moveHistory.slice(moveHistory.length - 3);
		console.log(lastMovesFromMoveHistory);

		for (var i = 0; i < lastMovesFromMoveHistory.length; i++) {
			lastHumanMoves.push(lastMovesFromMoveHistory[i].humanMove);
		}

		if (lastHumanMoves[0] === lastHumanMoves[1] && lastHumanMoves[0] === lastHumanMoves[2]) {
			opponentMove = generateWinningMove(lastHumanMoves[0]);
		} else {
			opponentMove = generateRandomMove();
		}

	} else {
		opponentMove = generateRandomMove();
	}

	return opponentMove;
}

function togglePlayButtons() {
	var buttonContainer = document.getElementById("playButtonContainer");
	if (isGameRunning) {
		buttonContainer.className = "";
		document.getElementById("startButton").classList.add("hidden");
		document.getElementById("stopButton").classList.remove("hidden");

		// document.getElementById("startButton").style.visibility = "hidden";
		// document.getElementById("stopButton").style.visibility = "visible";
	} else {
		buttonContainer.className = "hidden";
		document.getElementById("startButton").classList.remove("hidden");
		document.getElementById("stopButton").classList.add("hidden");
		// document.getElementById("startButton").style.visibility = "visible";
		//document.getElementById("stopButton").style.visibility = "hidden";
	}

}

function updateTime() {
	timeCounter++;
	updateScoreBoard();
}

function startGame() {
	isGameRunning = true;
	togglePlayButtons();

	timer = window.setInterval(updateTime, 1000);
}
function stopGame() {
	//do stuff
	moveHistory   = [];
	playerScore   = 0;
	tiesCounter   = 0;
	opponentScore = 0;
	roundCounter  = 0;
	timeCounter   = 0;

	isGameRunning = false;

	window.clearInterval(timer);
	togglePlayButtons();

	updateImages("default", "default");
	updateScoreBoard();
	clearMoveHistory();
}