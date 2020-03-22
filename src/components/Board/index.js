import React, { Component } from "react";
import Row from "../Row";

class Board extends Component {
  constructor(props) {    //passing props
    super(props);

    this.state = {
      rows: this.createBoard(props)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.openCells > nextProps.openCells ||
      this.props.columns !== nextProps.columns
    ) {
      this.setState({
        rows: this.createBoard(nextProps)
      });
    }
  }

// create  a 2d grid for board based on columns and rows 
  createBoard = props => {
    let board = []; //empty array for board(cells,flags, mines .. will be added)
    for (let i = 0; i < props.rows; i++) {  //rows =10
      board.push([]);     //all rows will have empty array
      for (let j = 0; j < props.columns; j++) { //columns =10
        //push in array object(Cells)
        board[i].push({ 
          x: j,  //x position on board
          y: i,  //y position on board
          count: 0,  //number of mines near cell
          isOpen: false,
          hasMine: false,
          hasFlag: false
        });
      }
    }
    // after board created add our mines randomly!
    for (let i = 0; i < props.mines; i++) {
      //random position of mines (random x/ y)
      let randomRow = Math.floor(Math.random() * props.rows);
      let randomCol = Math.floor(Math.random() * props.columns);

      let cell = board[randomRow][randomCol];

// if cell already has mine change position by 1
      if (cell.hasMine) {    
        i--;
      } else {
        cell.hasMine = true;
      }
    }
    return board;
  };

  // create function to turn on and off flags
  flag = cell => {
    if (this.props.status === "ended") {
      return;
    }
    let rows = this.state.rows;

    cell.hasFlag = !cell.hasFlag;
    this.setState({ rows });
    this.props.changeFlagAmount(cell.hasFlag ? -1 : 1);
  };

  //open cell
  //cell will be a number /mine/ openmore then one cell
  open = cell => {
  //game over cant do anything
    if (this.props.status === "ended") {
      return;
    }
    // finding all the mines
    let asyncCountMines = new Promise(resolve => {      //calls resovle when promis is succesfull
      let mines = this.findMines(cell);                 //when mines are found move to resolve
      resolve(mines);
    });

    asyncCountMines.then(numberOfMines => {
      let rows = this.state.rows;

      let current = rows[cell.y][cell.x];                 //get x and y position

      if (current.hasMine && this.props.openCells === 0) {   //first time clicking on board
        console.log("mine was on first click");
        let newRows = this.createBoard(this.props);
        this.setState({ rows: newRows }, () => {
          this.open(cell);
        });
      } else {
        if (!cell.hasFlag && !current.isOpen) {                   //call onCellClick to dislpay count 
          this.props.onCellClick();

          current.isOpen = true;                                  
          current.count = numberOfMines;

          this.setState({ rows });
          // now that we know its not a flag and its not a BOMB we should try to open cells around it!
          if (!current.hasMine && numberOfMines === 0) {
            this.openAroundCell(cell);
          }

          if (current.hasMine && this.props.openCells !== 0) {      //gameover when user finds mine
            this.props.endGame();
          }
        }
      }
    });
  };

  findMines = cell => {
    let minesInProximity = 0;  //start with no mines
    // look for mines around one cell
    for (let row = -1; row <= 1; row++) {
      for (let col = -1; col <= 1; col++) {
        //now checking if on edge of board(not go over board)
        //will = -1 if you are over the edge of the board
        if (cell.y + row >= 0 && cell.x + col >= 0) {
          if (
            cell.y + row < this.state.rows.length &&
            cell.x + col < this.state.rows[0].length  //0 is the row number you are at
          ) {
            if (
              this.state.rows[cell.y + row][cell.x + col].hasMine &&
              !(row === 0 && col === 0)
            ) {
              minesInProximity++;
            }
          }
        }
      }
    }
    return minesInProximity;
  };
//simler with mines
  openAroundCell = cell => {
     //got through each cell, open cell one by one untill a mine is found
    let rows = this.state.rows;
    for (let row = -1; row <= 1; row++) {

      for (let col = -1; col <= 1; col++) {
        if (cell.y + row >= 0 && cell.x + col >= 0) {
          if (
            cell.y + row < this.state.rows.length &&
            cell.x + col < this.state.rows[0].length //0 is the row number you are at
          ) {
            if (
              !this.state.rows[cell.y + row][cell.x + col].hasMine &&
              !rows[cell.y + row][cell.x + col].isOpen
            ) {
              this.open(rows[cell.y + row][cell.x + col]);
            }
          }
        }
      }
    }
  };

  render() {
    //creating the rows
    let rows = this.state.rows.map((cells, index) => (
      <Row
        cells={cells} //each row contains all the cells
        open={this.open} 
        flag={this.flag}
        key={index} //keep track of the position
      />
    ));
    return <div className="board">{rows}</div>;
  }
}

export default Board;
