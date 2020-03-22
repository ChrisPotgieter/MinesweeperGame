import React from "react";

//Boradhead will have a timer, resetBtn, numberOfFlags
const BoardHead = props => {
  let minutes = Math.floor(props.time / 60);
  let formattedSeconds = props.time - minutes * 60 || 0;  //time not started set to zero

  formattedSeconds =      //ternary operator(if el in one)
    formattedSeconds < 10 ? `0${formattedSeconds}` : formattedSeconds;  //if seconds < 10 add another 0 ---0:00
  let time = `${minutes}:${formattedSeconds}`;  
  let status =
    props.status === "running" || props.status === "waiting" ? (  //smile face reset button change when status change
      <i className="icon ion-happy-outline" />
    ) : (
      <i className="icon ion-sad-outline" />
    );
  return (
    <div className="board-head">
      <div className="flag-count">{props.flagsUsed}</div>
      <button className="reset" onClick={props.reset}>
        {status}
      </button>
      <div className="timer">{time}</div>
    </div>
  );
};

export default BoardHead;
