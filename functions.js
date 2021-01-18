// checking if the device is touch screen or desktop and setting up the game timer(in ms)
let isTouchScreen = "ontouchstart" in document.documentElement;
let timer = isTouchScreen ? 2000 : 4000;
// on document load animate the letters
$(document).ready(function () {
  animateDiv("#p");
  animateDiv("#o1");
  animateDiv("#s");
  animateDiv("#a");
  animateDiv("#o2");
});
// the initial value of variables
const expectedClickOrder = ["p", "o", "s", "a", "o"];
let clickOrder = [];

// function that calculates the new value for top/left properties of the div that contain letter
const calculateNewPosition = () => {
  // container height and width
  const containerHeight = $("#container").height();
  const containerWidth = $("#container").width();
  // function that returns either 1 or -1(so we can randomize both negative and positive values for new height/width for the letter)
  const positiveOrNegative = Math.round(Math.random()) * 2 - 1;
  // value for narrowing the possible value for the new width
  const widthCutter = containerWidth < 450 ? 0.12 : 0.25;
  // new hight value for the letter
  const newLetterHeightPosition =
    Math.floor(Math.random() * (containerHeight * 0.35)) * positiveOrNegative;
  // new width value for the letter
  const newLetterWidthPosition =
    Math.floor(Math.random() * (containerWidth * widthCutter)) *
    positiveOrNegative;
  // returning new values for height/width
  return [newLetterHeightPosition, newLetterWidthPosition];
};
// function that detects if the 2 letters gonna colide. If so the current animation is stopped, and new one is created(with new random values)(using jquery-collision)
/**
 *
 * @param {string} id -id of the div that contain letter
 */
const collisionDetection = (id) => {
  let collidersSelector = id;
  let obstaclesSelector = ".letter-div";
  let hits = $(collidersSelector).collision(obstaclesSelector);
  // hits represents the array of colided elements, if its more than 1, that means 2 elements are in collision.
  if (hits.length > 1) {
    // stopping the current animation, and creating the new one for the same element
    $(id).animate().stop();
    animateDiv(id);
  }
};
// function for animating div that contain letter
/**
 *
 * @param {string} id -id of the div that contain letter
 */
const animateDiv = (id) => {
  let newPosition = calculateNewPosition();
  // setting up new values for top and left value of the div
  $(id).animate(
    { top: newPosition[0], left: newPosition[1] },
    {
      duration: 3000,
      progress: checkCollision(id),
    }
  );
};
// function that is called whenever the div that contain letter is clicked
/**
 *
 * @param {string} letter - the value of letter that is clicked
 * @param {string} id -the id of the two 'o' letters, so we can make them distinct.
 */
const clickedLetter = (letter, id) => {
  clickOrder.push(letter);
  // checking if the letters are in correct order
  for (let i = 0; i < clickOrder.length; i++) {
    // if the letters are not in correct order, start new game
    if (clickOrder[i] !== expectedClickOrder[i]) {
      clickOrder = [];
      newGame();
    } else {
      // if the correct letter is clicked attach the 'hide-letter css class'
      const letterId = id ? letter + id : letter;
      $(`#${letterId}`).addClass("hide-letter");
      if (
        // if the last letter is correctly clicked clear the timers and show the end message with new game button
        clickOrder.length === expectedClickOrder.length &&
        i === 4
      ) {
        $("#success-message").removeClass("hide-success-message-div");
        clearTimeouts();
      }
    }
  }
};

// function for reloading a window(new game)
const newGame = () => {
  clearTimeouts();
  location.reload();
};
// timeout function with timer value(4 sec for desktop and 2 sec for touch screen devices)
let setTimerTimeout;
const setTimer = () => {
  setTimerTimeout = setTimeout(() => {
    newGame();
  }, timer);
};
// timeout function that is calling a collisionDetection function(every 650ms)
let checkCollisionTimeout;
/**
 *
 * @param {string} id -id of the div that contain letter
 */
const checkCollision = (id) => {
  checkCollisionTimeout = setTimeout(() => {
    collisionDetection(id);
  }, 650);
};
// clearTimeouts function that is removing checkCollisionTimeout and setTimerTimeout(called if the game is successfuly finished)
const clearTimeouts = () => {
  clearTimeout(checkCollisionTimeout);
  clearTimeout(setTimerTimeout);
};
// calling the timeout function
setTimer();
