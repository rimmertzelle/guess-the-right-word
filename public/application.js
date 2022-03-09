// TODO [X] give error message on the screen
// TODO [] measure progress in localstorage
// TODO [] add timer
// TODO [] really clean up the code
// TODO [] event handler on enter key
// TODO [] messages on the screen dissapear after a couple of seconds
window.addEventListener("load", init);

// Global variables
const goodAnswersElement = document.getElementById("good");
const wrongAnswersElement = document.getElementById("wrong");
const usedHintsElement = document.getElementById("hints");
let goodAnswers = 0;
let wrongAnswers = 0;
let usedHints = 0;
const focus = null;
let choosenWord = "";
let typedWord = [];
let allWords = [];
let alphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  " ",
  "-",
];

/**
 * Initialize the application
 */
function init() {
  allWords = getAllWords();
  getNextWord();
  window.addEventListener("keydown", keyDownhandler);
  document.getElementById("enter").addEventListener("click", clickEnterHandler);
  document.getElementById("show").addEventListener("click", clickShowHandler);
}

/**
 * Get the next word out of the array
 */
function getNextWord() {
  allWords.then((result) => {
    console.log(result);
    const question = chooseWord(result, result.length - 1);
    writeMeaningToDom(question[1]);
    addLettersToTiles(question[0]);
    console.log("sentence", question[2]);
    if (question[2]) {
      addSentenceToTheDOM(question[2], question[0]);
    } else {
      addSentenceToTheDOM(" Wow no peep sentence", "peep");
    }
    choosenWord = question[0];
    hasFocus();
  });
}

/**
 * Function to handle the keydown event
 *
 * @param {*} event
 */
function keyDownhandler(event) {
  console.log(event.key);
  console.log("keyhandler", choosenWord.length);

  if (event.key === "Backspace") {
    typedWord.pop();
    writeLetterToTiles();
  } else if (
    alphabet.includes(event.key) &&
    typedWord.length < choosenWord.length
  ) {
    document.getElementById("feedback").innerHTML = "";
    typedWord.push(event.key);
    writeLetterToTiles();
  } else {
    console.error("Word is to long");
  }
}

/**
 * Handle the Enter click event
 */
function clickEnterHandler(event) {
  console.log(event);
  checkWord();
  updateScoresInDom();
  nextTurn();
}

/**
 * Handle the show click event
 *
 * @param {*} event
 */
function clickShowHandler(event) {
  makeHintButtonUnclickable();
  updateScores("hints");
  updateScoresInDom();
}

function makeHintButtonUnclickable() {
  document.getElementById("hint").classList.remove("idle");
  document.getElementById("show").classList.add("disabled");
}

function makeHintButtonClickable() {
  document.getElementById("hint").classList.add("idle");
  document.getElementById("show").classList.remove("disabled");
}

/**
 * Update all the scores
 *
 * @param {*} update
 */
function updateScores(update) {
  switch (update) {
    case "good":
      goodAnswers += 1;
      break;
    case "wrong":
      wrongAnswers += 1;
      break;
    case "hints":
      usedHints += 1;
      break;
    default:
      console.error("No score", update);
      break;
  }
}

/**
 * Get the words, hints and sentence from the google sheets
 *
 * @returns return the words from the google sheets
 */
async function getAllWords() {
  try {
    const response = await fetch("/words");
    const words = await response.json();
    return words;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Add the sentece to the dom
 *
 * @param {*} sentence - sentence
 * @param {*} word - word n the sentence
 */
function addSentenceToTheDOM(sentence, word) {
  console.log("choosen word", choosenWord);
  const sentenceElementInDOM = document.getElementById("sentence");
  sentenceElementInDOM.innerHTML = "";
  const newSentence = sentence.replace(word, "XXX");
  const p = document.createElement("p");
  p.innerText = newSentence;
  sentenceElementInDOM.append(p);
}

/**
 *
 */
function nextTurn() {
  // choose an new word
  // write word to the new word
  // set focus

  document.getElementById("hint").innerHTML = "";
  document.getElementById("word").innerHTML = "";

  typedWord = [];
  getNextWord();
  makeHintButtonClickable();
  console.log(allWords);
}

/**
 * Function to add and remove focus
 */
function hasFocus() {
  const focusIndex = typedWord.length;
  const allInFocus = document.querySelectorAll(".focus");
  for (let i = 0; i < allInFocus.length; i++) {
    allInFocus[i].classList.remove("focus");
  }
  if (focusIndex < choosenWord.length) {
    const letterInFocus = document.getElementById("letter-" + focusIndex);
    letterInFocus.classList.add("focus");
  }
}

function checkWord() {
  console.log(
    `Does chosen word ${choosenWord.toLocaleLowerCase()} matchs with ${typedWord.join(
      ""
    )}`
  );
  if (choosenWord.toLowerCase() === typedWord.join("")) {
    console.log("match");
    writeMessage("added one point", "win");
    updateScores("good");
  } else {
    writeMessage("you can try it another time", "loose");
    updateScores("wrong");
  }
}

/**
 * Wrrite the message to the DOM
 *
 * @param {*} message
 * @param {*} type
 */
function writeMessage(message, type) {
  const ph = document.getElementById("feedback");
  ph.innerHTML = "";
  let p = document.createElement("p");
  p.classList.add(type);
  p.innerText = message;
  ph.append(p);
}

/**
 * Update all the scores in the DOM
 */
function updateScoresInDom() {
  goodAnswersElement.innerText = goodAnswers;
  wrongAnswersElement.innerText = wrongAnswers;
  usedHintsElement.innerText = usedHints;
}

/**
 * Function to write the hint to the DOM
 *
 * @param {*} meaning
 */
function writeMeaningToDom(meaning) {
  const ph = document.getElementById("hint");
  ph.innerText = meaning;
}

/**
 * Choose one of the words
 *
 * @param {*} allWords
 * @param {*} ArrLength
 * @returns a word, hint and sentence
 */
function chooseWord(allWords, ArrLength) {
  return allWords[randomNumber(0, ArrLength)];
}

/**
 * Write the letters of the word to the tiles
 */
function writeLetterToTiles() {
  // empty all the letters
  let li = document.getElementsByClassName("tileCard");
  [...li].forEach((tile) => {
    tile.innerHTML = "";
  });
  // add each letter to the DOM
  typedWord.forEach((letter, index) => {
    let ph = document.getElementById("letter-" + index);
    ph.innerText = letter;
  });
  hasFocus();
}

/**
 * Add the first and last letter to the DOM
 * 
 * @param {*} word
 */
function addLettersToTiles(word) {
  const placeholder = document.getElementById("word");
  const newWord = [...word];
  newWord.forEach((letter, index) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.innerText = letter;
    li.id = "letter-" + index;
    li.classList.add("tileCard");
    console.log(word.length);
    if (index !== 0 && index !== word.length - 1) {
      span.classList.add("idle");
    }
    li.append(span);
    placeholder.append(li);
  });
}

/**
 * Returns a random number between min and max
 *
 * @param min - lower boundary
 * @param max - upper boundary
 * @returns a random number between min and max
 */
function randomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}
