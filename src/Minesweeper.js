import React, { Component } from "react";
import BoardHead from "./components/BoardHead";
import Board from "./components/Board";

class App extends Component {
  constructor() {
    super();

    this.state = {
      gameStatus: "waiting", // or running, waiting, or ended
      time: 0, // time will be in seconds
      mines: 10,
      rows: 10,
      columns: 10,
      flagCount: 10,
      openCells: 0,
    };

    this.baseState = this.state; //states to  default for reset
  }

  //if status is running keep checking for a winner
  componentDidUpdate(nextProps, nextState) {
    if (this.state.gameStatus === "running") {
      this.checkForWinner();
    }
  }
  
//if all cells clicked  = winner
  checkForWinner = () => {
    if (this.state.mines + this.state.openCells >= this.state.rows * this.state.columns) { //length * width
      this.setState({
        gameStatus: "winner"
      }, alert("you won in minesweeper :| "))
    }
  }

  componentWillMount() {        //intervals array used for time
    this.intervals = [];
  }

  setInterval = (fn, t) => {    //function, time
    this.intervals.push(setInterval(fn, t));
  };

  //will set all states to their default
  reset = () => {
    this.intervals.map(clearInterval);  //reset timer
    this.setState({... this.baseState}, () => { //spread operator goes through all paramaters
      this.intervals = [];
    });
  };

  //start time 
  //count in seconds
  tick = () => {
    if (this.state.openCells > 0 && this.state.gameStatus === "running") {
      let time = this.state.time + 1;
      this.setState({ time });
    }
  };

  //change game status (gameover)
  endGame = () => {
    this.setState({
      gameStatus: "ended"
    });
  };

  //reduce amount of flags
  //flags count also posible to be in negative
  changeFlagAmount = amount => {
    this.setState({ flagCount: this.state.flagCount + amount });
  };

  //what happens when a cell is clicked
  //states change ,timer starts
  handleCellClick = () => {
    if (this.state.openCells === 0 && this.state.gameStatus !== "running") {
      this.setState(
        {
          gameStatus: "running"
        },
        this.setInterval(this.tick, 1000)  //calls tick every second
      );
    }
    this.setState(prevState => {
      return { openCells: prevState.openCells + 1 };
    });
  };


  //Instriction for Game Link
  instruction = () => {
    window.open("http://www.freeminesweeper.org/help/minehelpinstructions.html");
  }

  render() {
    return (
      <div className="minesweeper">
        <h1>Minesweeper ,I think ;)</h1>
        <BoardHead
          time={this.state.time}
          flagsUsed={this.state.flagCount}
          reset={this.reset}
          status={this.state.gameStatus}
        />
        <Board
          openCells={this.state.openCells}
          mines={this.state.mines}
          rows={this.state.rows}
          columns={this.state.columns}
          endGame={this.endGame}
          status={this.state.gameStatus}
          onCellClick={this.handleCellClick}
          changeFlagAmount={this.changeFlagAmount}
        />
        <button className="btnInstruction" onClick={this.instruction}>Instructions</button>
      </div>
    );
  }
}

export default App;
