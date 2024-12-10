/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
function runProgram(){
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Constant Variables
  var FRAME_RATE = 60;
  var FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  const KEY = {
    ENTER: 13,
    UP: 38,
    LEFT: 37,
    DOWN: 40,
    RIGHT: 39,
  }
  var walker = {
    positionX: 0,
    positionY: 0,
    speedX: 0,
    speedY: 0,
  }
  
  // Game Item Objects


  // one-time setup
  var interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)
  $(document).on('keydown', handleKeyDown);
  $(document).on('keyup', handleKeyUp);                           // change 'eventType' to the type of event you want to handle

  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame() {
    repositionGameItem()
    wallCollision()
    redrawGameItem()
    
  }
  
  /* 
  Called in response to events.
  */
  function handleKeyDown(e) {
    // if (e.which === KEY.ENTER) {
    //   console.log("enter pressed");
    // }else if(e.which === KEY.UP){
    //   console.log("up pressed")
    // }else if(e.which === KEY>LEFT){
    //   console.log('left pressed')
    // }
    switch (e.which){
      case KEY.ENTER:
        console.log("enter pressed")
        break;
      case KEY.UP:
        console.log("up pressed")
        walker.speedY = -5;
        break;
      case KEY.DOWN:
        console.log("down pressed")
        walker.speedY = 5;
        break;
      case KEY.RIGHT:
        console.log("right pressed")
        walker.speedX = 5;
        break;
      case KEY.LEFT:
        console.log("left pressed")
        walker.speedX = -5;
        break;
    }

  }

  function handleKeyUp(e){
    switch (e.which){
      case KEY.ENTER:
        console.log("enter pressed")
        break;
      case KEY.UP:
        console.log("up pressed")
        walker.speedY = 0;
        break;
      case KEY.DOWN:
        console.log("down pressed")
        walker.speedY = 0;
        break;
      case KEY.RIGHT:
        console.log("right pressed")
        walker.speedX = 0;
        break;
      case KEY.LEFT:
        console.log("left pressed")
        walker.speedX = 0;
        break;
  }
}

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  
  function endGame() {
    // stop the interval timer
    clearInterval(interval);

    // turn off event handlers
    $(document).off();
  }

  function repositionGameItem(){
    walker.positionX += walker.speedX;
    walker.positionY += walker.speedY;

  }

  function redrawGameItem(){
    $("#walker").css("left", walker.positionX);
    $("#walker").css("top", walker.positionY);

  }

  function wallCollision(){
    if(walker.positionX + $("#walker").width() >= $("#board").width()){
      walker.positionX = $("#board").width() - $("#walker").width()
    }else if(walker.positionX <= 0){
      walker.positionX = 0
    }
    if(walker.positionY + $("#walker").height() >= $("#board").height()){
      walker.positionY = $("#board").height() - $("#walker").height()
    }else if(walker.positionY <= 0){
      walker.positionY = 0
    }
  }
  
}
