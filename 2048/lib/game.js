//On each move, add class to the tile with:
// • position .pos-2-1, with transform rule to the relevant position
// • value .val-4, with rules to set the color depending on the value

import $ from "jquery";
import Grid from "./grid";

class Game {

  constructor(grid) {

    this.grid = grid;

    this.keyCodes = {
      38: "UP",
      40: "DOWN",
      37: "LEFT",
      39: "RIGHT"
    }

    $("body").keydown( event => this.playRound(event));

  }

  playRound() {
    console.log("play");
    const keyPressed = this.keyCodes[event.which];
    if (keyPressed) this.grid.moveTiles(keyPressed);

    window.setTimeout(() => {
      if (this.grid.isGridFull()) this.gameOver();
    }, 200);
  }

  gameOver() {
    console.log("Game over");
    $("body").off("keydown");
  }

}

export default Game;
