import React from "react";

const Cell = props => {
  //What cell will look like when click on
  let cell = () => {
    if (props.data.isOpen) {
      if (props.data.hasMine) {
        return (
          <div
            className="cell open"
            onContextMenu={e => {
              // don't load the context menu, use flag when right clicking
              e.preventDefault();
            }}
            onClick={() => props.open(props.data)} //when click on mine what it looks like
          >
            <span>Boom</span>
          </div>
        );
      } else if (props.data.count === 0) {
        return (
          <div
            className="cell open"
            onContextMenu={e => {
              // don't load the context menu, use flag when right clicking
              e.preventDefault();
              props.flag(props.data);
            }}
            onClick={() => props.open(props.data)}
          />
        );
      } else {
        return (
          <div
            className="cell open"
            onContextMenu={e => {
                  // don't load the context menu, use flag when right clicking
              e.preventDefault();
            }}
            onClick={() => props.open(props.data)} //display amount of mines near cell
          >
            {props.data.count}
          </div>
        );
      }
    } else if (props.data.hasFlag) {
      return (
        <div
          className="cell open-flag"
          onContextMenu={e => {
              // don't load the context menu, use flag when right clicking
            e.preventDefault();
            props.flag(props.data);
          }}
          onClick={() => props.open(props.data)}  //display flag icon
        >
          <span><i className="icon ion-flag"></i></span>  
        </div>
      );
    } else {
      return (
        <div
          className="cell"
          onContextMenu={e => {
            // don't load the context menu, use flag when right clicking
            e.preventDefault();
            props.flag(props.data);   
          }}
          onClick={() => props.open(props.data)}
        />
      );
    }
  };
  return cell();
};

export default Cell;
