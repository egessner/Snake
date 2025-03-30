/* eslint linebreak-style: ['error', 'windows'] */
/**
 * @classdesc Snake
 */
class Snake {
  /**
   * @description todo
   */
  constructor() {
    this.headDirection; // probably an int?
    this.length = 2;
    // array w/ size of this.length, head is at 0
    this.position = new Array(this.length);
  }

  /**
   * @description takes the array and moves each square forward one based on
   * the current head direction. Not the snakes job to detect a border,
   * that will be the game runner, not sure about tail detection yet
   */
  moveForward() {

  }

  /**
   * @description turn the snake, ie update the headDirection
   */
  turn() {

  }

  /**
   * @description grow the snake array by one, the new square will be at a null
   * position until the snake moves forward one.
   */
  grow() {

  }

  /**
   * @description returns snakes current position
   * @return {Array} this.position
   */
  getPosition() {
    return this.position;
  }
}
