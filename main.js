/** TODO
 * - Determine size of grid
 * - create grid
 * - function to randomly assing 'apple' to square on grid
 * - somehow we need to keep track of where the snake is
 *  - snake class - this will help with scaling too
 * - movement of the snake should be pretty simmple
 *  - move forward one square at a set interval
 *  - how do we want to handle turning? 
 *    - i guess we can just add an event listner on key presses and if 
 * its a turning key check if its a valid movement then update the snakes head
 * direction and then when move forward is called we will move forward in head direction
 */
/* eslint linebreak-style: ['error', 'windows'] */
/* GLOBALS */
const SQUARESIZE = 20;
const FPS = 30;
const INTERVAL = 1000 / FPS;

let mainCanvas;
let context;
let button;
let now;
let then;
let delta;
let framecount;
let grid;
let requestID;
let score;
let scoreLabel;
let apples;
let snake;

/**
 * @description set up the game of snake
 */
function init() {
  mainCanvas = document.getElementById('mainCanvas');
  button = document.getElementById('restartButton');
  context = mainCanvas.getContext('2d');

  then = Date.now();
  framecount = 0;
  // gameOver = 0;
  score = 0;
  // create the grid
  createGrid(40, 40);
  // create the snake
  snake = new Snake(20, 20, 10);
  console.log(snake.headDirection);
  // spawn apple

  updateGrid();
  // printGrid();

  draw();

  document.addEventListener('keypress', onKeyPress);
  button.addEventListener('click', main);
}

/**
 * @description creates a height * width 2d array main grid and 4*4 sidegrid,
 * @param {int} width
 * @param {int} height
 */
function createGrid(width, height) {
  grid = [];
  for (let h = 0; h < height; h++) {
    grid.push(new Array(width).fill(0));
  }
}

/**
 * @description clear the grid, not the most elegant way of updating locations
 */
function clearGrid() {
  for (let i = 0; i < grid.length; i++) {
    grid[i].fill(0);
  }
}

/**
 * @description print out the grid to the console for testing
 */
function printGrid() {
  for (let y = 0; y < grid.length; y++) {
    console.log(y + '\t' + grid[y].toString() + '\n');
  }
}

/**
 * @description update grid with snake location and apple
 */
function updateGrid() {
  clearGrid(); // start with a blank slate
  // first the snake
  const snakePos = snake.getPosition();
  for (let i = 0; i < snakePos.length; i++) { // iterate the snake pos
    const snakeX = snakePos[i][0];
    const snakeY = snakePos[i][1];
    grid[snakeY][snakeX] = 1;
  }
}

/**
 * @description draw the game boi
 */
function draw() {
  now = Date.now();
  delta = now - then;
  if (delta > INTERVAL) {
    framecount++;
    then = now - (delta % INTERVAL);

    if (framecount >= 5) {
      snake.moveForward();
      framecount = 0;
    }

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
    context.strokeRect(0, 0, mainCanvas.width, mainCanvas.height);
    updateGrid();
    drawOutline();
    drawSnake();
  }
  requestID = requestAnimationFrame(draw);
}

/**
 * @description draw outline of main canvas
 */
function drawOutline() {
  context.strokeRect(0, 0, mainCanvas.width, mainCanvas.height);
  // draw outline of each square, might comment out later
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      context.strokeRect(x * SQUARESIZE, y * SQUARESIZE,
          SQUARESIZE, SQUARESIZE);
    }
  }
}

/**
 * @description draw the snake
 */
function drawSnake() {
  const snakePos = snake.getPosition();
  for (let i = 0; i < snakePos.length; i++) { // iterate the snake pos
    const snakeX = snakePos[i][0];
    const snakeY = snakePos[i][1];
    context.fillStyle = '#008000';
    context.fillRect(snakeX * SQUARESIZE, snakeY * SQUARESIZE,
        SQUARESIZE, SQUARESIZE);
    context.strokeRect(snakeX * SQUARESIZE, snakeY * SQUARESIZE,
        SQUARESIZE, SQUARESIZE);
  }
}

/**
 * @description On key press wrapper
 * @param {*} keypress
 */
function onKeyPress(keypress) {
  let newDirection;
  switch (keypress.code) {
    case 'KeyW':
      newDirection = 1;
      break;
    case 'KeyD':
      newDirection = 2;
      break;
    case 'KeyS':
      newDirection = 3;
      break;
    case 'KeyA':
      newDirection = 4;
      break;
  }
  if (newDirection) {
    snake.turn(newDirection);
  }
}

/**
 * @description main
 */
function main() {
  init();
  requestID = requestAnimationFrame(draw);
}
main();
