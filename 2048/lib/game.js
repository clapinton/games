//On each move, add class to the tile with:
// • position .pos-2-1, with transform rule to the relevant position
// • value .val-4, with rules to set the color depending on the value

import $ from "jquery";
import Grid from "./grid";
import Background from "./background";

class Game {

  constructor(grid) {

    this.grid = grid;
    this.background = new Background();
    this.newSession = true;

    this.keyCodes = {
      38: "UP",
      40: "DOWN",
      37: "LEFT",
      39: "RIGHT"
    }

    this.konamiCode = {
      keys: [38, 38, 40, 40, 37, 39, 37, 39, 66, 65, 13],
      nextKeyIndex: 0
    }

    this.gamePoints = 0;

    this.setKeyListener();

  }

  setKeyListener() {
    $("body").keydown( event => {
      event.preventDefault();

      // Pushing to GTM dataLayer
      let dataLayer = window.dataLayer = window.dataLayer || [];      
      dataLayer.push({
        'event': 'keyboardPress'
      });

      const cheat = this.checkKonamiCode(event.which);

      if (cheat) {
        this.newKonamiGame();
      } else {
        if (this.newSession) {
          $("#game").css("filter", "blur(0px)");
          $(".overlay").addClass("hidden");
          this.newSession = false;
        };
        const keyPressed = this.keyCodes[event.which];
        if (keyPressed) this.playRound(keyPressed)
      }
    });

  }

  playRound(keyPressed) {

    this.grid.roundPoints= 0;
    this.removeMerged();
    this.grid.searchTilesToMerge(keyPressed);
    this.grid.moveTiles(keyPressed);
    this.grid.renderDom();
    this.grid.spawnTile();
    this.updateScore();

    if (this.grid.roundPoints) {
      this.flashRoundPoints();
    }

    // window.setTimeout(() => {
      if (this.grid.isGridFull()) this.gameOver();
    // }, 200);

    if (this.grid.isBeatingScore(2048)) this.youWin();
  }

  newGame() {
    $(".tile").remove();
    this.grid.newGrid();

    this.gamePoints = 0;
    this.updateScore();

    this.konamiCode.nextKeyIndex = 0;

    $(".overlay").addClass("hidden");
    $("#game").css("filter", "blur(0px)");

    this.setKeyListener();

  }

  flashRoundPoints() {
    const bubble = document.getElementsByClassName("points-bubble")[0];
    $(bubble).text(this.grid.roundPoints);
    bubble.animate({
      opacity: [0,1,0],
      transform: ["none", "translateY(-50px)"]
    }, {
      // Iterations last for 500ms.
      duration: 500,

      // The timing function to use with each iteration.
      easing: 'linear'
    });

    this.background.spawnTile(this.grid.roundPoints);
  }

  updateScore() {
    this.gamePoints += this.grid.roundPoints;
    $(".game-score span").text(this.gamePoints);
  }

  gameOver() {
    const $gameOver = $(`<div>
            <h2>Game Over</h2>
            <h3 class="new-game-btn">New Game</h3>
          </div>`)

    $(".overlay").html($gameOver);
    $(".overlay").removeClass("hidden");
    $("#game").css("filter", "blur(10px)");
    $("body").off("keydown");
    $(".new-game-btn").click( e => this.newGame());
  }

  youWin() {
    $("body").off("keydown");
    const $gameOver = $(`<div>
            <img src="./assets/images/rosebud.gif"/>
            <h3 class="new-game-btn">New Game</h3>
          </div>`)

    $(".overlay").html($gameOver);
    $(".overlay").removeClass("hidden");
    $("#game").css("filter", "blur(10px)");
    $("body").off("keydown");
    $(".new-game-btn").click( e => this.newGame());
  }

  removeMerged() {
    $(".merged").remove();
  }

  checkKonamiCode(key) {
    const correctKey = this.konamiCode.keys[this.konamiCode.nextKeyIndex];
    if (correctKey === key) {
      this.konamiCode.nextKeyIndex+=1;
    } else {
      this.konamiCode.nextKeyIndex = 0;
    }

    if (this.konamiCode.nextKeyIndex === 11) {
      this.konamiCode.nextKeyIndex = 0;
      return true;
    }
    return false;
  }

  newKonamiGame() {
    $(".tile").remove();
    this.grid.newKonamiGrid();
  }

}

export default Game;
