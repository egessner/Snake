/* eslint linebreak-style: ['error', 'windows'] */
/* GLOBALS */
const SQUARESIZE = 20;
const FPS = 30; // why on earth does snake need to be 30 fps? cause fuck it
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
let apple;
let snake;
let gameOver;

/**
 * @description set up the game of snake
 */
function init() {
  gameOver = false;
  mainCanvas = document.getElementById('mainCanvas');
  button = document.getElementById('restartButton');
  scoreLabel = document.getElementById('scoreLabel');
  context = mainCanvas.getContext('2d');

  then = Date.now();
  framecount = 0;
  // gameOver = 0;
  score = 0;
  // create the grid
  createGrid(40, 40);
  // create the snake
  snake = new Snake(20, 20, 10);
  // spawn apple
  spawnApple();

  updateGrid();
  // printGrid();

  run();

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
    grid.push(new Array(width).fill(3));
  }
  clearGrid();
}

/**
 * @description clear the grid, not the most elegant way of updating locations
 */
function clearGrid() {
  for (let i = 1; i < grid.length-1; i++) {
    for (let k = 1; k < grid[i].length-1; k++) {
      grid[i][k] = 0;
    }
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
 * @description spawns an apple on the game
 */
function spawnApple() {
  let y = Math.ceil(Math.random() * grid.length-1);
  let x = Math.ceil(Math.random() * grid[0].length-1);
  while (grid[y][x] == 1 || grid[y][x] == 3) {
    y = Math.ceil(Math.random() * grid.length-1);
    x = Math.ceil(Math.random() * grid[0].length-1);
  }
  apple = [x, y];
  score++;
  updateScore(); // bad practice
}

/**
 * @description update grid with snake location and apple
 */
function updateGrid() {
  clearGrid(); // start with a blank slate
  // first the snake
  const snakePos = snake.getPosition();
  for (let i = 0; i < snakePos.length; i++) { // iterate the snake pos
    if (!snakePos[i]) {
      break;
    }
    const snakeX = snakePos[i][0];
    const snakeY = snakePos[i][1];
    grid[snakeY][snakeX] = 1;
  }
  // next the apple
  grid[apple[1]][apple[0]] = 2; // ugly!
}

/**
 * @description detect collision or apple consumption
 * we track the snake in two places, snake class and grid
 * so before we update the grid we can use the snake class to see if
 * it will hit anything
 */
function detectEvent() {
  // all we need to look at is the head, 3 cases
  // tail, border, apple
  const headPos = snake.getHeadPosition();
  switch (grid[headPos[1]][headPos[0]]) {
    case 1: // tail
      killGame();
      break;
    case 2: // apple
      snake.grow();
      spawnApple();
      break;
    case 3: // border
      killGame();
      break;
  }
}

/**
 * @description draw the game boi
 */
function run() {
  now = Date.now();
  delta = now - then;
  if (delta > INTERVAL) {
    framecount++;
    then = now - (delta % INTERVAL);

    if (framecount >= 5) {
      snake.moveForward();
      detectEvent();
      framecount = 0;
    }
    if (!gameOver) {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
      context.strokeRect(0, 0, mainCanvas.width, mainCanvas.height);
      updateGrid();
      draw();
    }
  }
  if (!gameOver) {
    requestID = requestAnimationFrame(run);
  }
}

/**
 * @description draw the game
 */
function draw() {
  // outline
  context.strokeRect(0, 0, mainCanvas.width, mainCanvas.height);
  // draw outline of each square, might comment out later
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] == 3) {
        context.fillStyle = '#666565';
        context.fillRect(x * SQUARESIZE, y * SQUARESIZE,
            SQUARESIZE, SQUARESIZE);
      } else if (grid[y][x] == 1) {
        context.fillStyle = '#37942b';
        context.fillRect(x * SQUARESIZE, y * SQUARESIZE,
            SQUARESIZE, SQUARESIZE);
      } else if (grid[y][x] == 2) {
        context.fillStyle = '#e84d2a';
        context.fillRect(x * SQUARESIZE, y * SQUARESIZE,
            SQUARESIZE, SQUARESIZE);
      }
      context.strokeStyle = '#b1b3b1';
      context.strokeRect(x * SQUARESIZE, y * SQUARESIZE,
          SQUARESIZE, SQUARESIZE);
    }
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
 * @description update the score
 */
function updateScore() {
  scoreLabel.innerHTML = 'Score ' + score;
}

/**
 * @description
 */
function killGame() {
  gameOver = true;
  console.log('game over');
  // printGrid();
  cancelAnimationFrame(requestID);
  document.removeEventListener('keypress', onKeyPress);
}

/**
 * @description main
 */
function main() {
  init();
  requestID = requestAnimationFrame(run);
}
main();
