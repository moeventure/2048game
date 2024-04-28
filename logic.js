let board;
let score = 0;
let rows = 4;
let columns = 4;

// create function
function setGame() {
  //initialize the 4x4 game board with all tiles set to 0
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  //to create the gameboard
  //first loop is to create the rows, and second loop is to create the columns
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      //create a div element representing tiles
      //Making a small box for each cell in the board
      let tile = document.createElement("div");
      tile.id = r.toString() + "-" + c.toString();
      let num = board[r][c];

      updateTile(tile, num);

      //Append the tile to the game board container
      //This means placing the tile inside the grid, in the right column and right row
      //Document.getElementById("board") is targettung the div from the html file
      document.getElementById("board").append(tile);
    }
  }

  setTwo();
  setTwo();
}

function setTwo() {
  // Check the hasEmptyTile boolean result, if hasEmptyTile == False, the setTwo will not proceed.
  if (!hasEmptyTile()) {
    return;
  }

  let found = false;

  while (!found) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * columns);

    if (board[r][c] == 0) {
      board[r][c] = 2;

      let tile = document.getElementById(r.toString() + "-" + c.toString());
      tile.innerText = 2;

      tile.classList.add("x2");

      // Set the found variable to true to break the loop
      found = true;
    }
  }
}

//function to update the appearnace of the tile based on its number
function updateTile(tile, num) {
  tile.innerText = "";
  tile.classList.value = "";
  //CSS class named tile is added to the classlist of the time, this will be for styling the tiles
  tile.classList.value = "tile";

  if (num > 0) {
    tile.innerText = num.toString();
    if (num <= 4096) {
      tile.classList.add("x" + num.toString());
    } else {
      tile.classList.add("x8192");
    }
  }
}

// Event that triggers when the web page finished loading
window.onload = function () {
  setGame();
};

//fjnction that handle the user's keyboard input when they press certain keywords
//e represents the event object, which contains information about the event occured
function handleSlide(e) {
  if (
    [
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "KeyW",
      "KeyA",
      "KeyS",
      "KeyD",
    ].includes(e.code)
  ) {
    // prevents default behavior on keydown
    e.preventDefault();

    if ((e.code == "ArrowLeft" || e.code == "KeyA") && canMoveLeft()) {
      slideLeft();
      setTwo();
    } else if ((e.code == "ArrowRight" || e.code == "KeyD") && canMoveRight()) {
      slideRight();
      setTwo();
    } else if ((e.code == "ArrowUp" || e.code == "KeyW") && canMoveUp()) {
      slideUp();
      setTwo();
    } else if ((e.code == "ArrowDown" || e.code == "KeyS") && canMoveDown()) {
      slideDown();
      setTwo();
    }

    document.getElementById("score").innerText = score;
    checkWin();

    if (hasLost()) {
      setTimeout(() => {
        alert("Game over! You have lost the game. game will restart.");
        alert("Click any arrow to restart.");
        restartgame();
      }, 100);
    }
  }
}

//[2,0,0,2] => [2,2]
//[4,2,0,2] => [4,2,2]
function filterZero(row) {
  return row.filter((num) => num != 0);
}

//[2,0,0,2] => [2,2] => [4,0,0,0]
//[4,2,0,2] => [4,4,0,0]
function slide(row) {
  row = filterZero(row); //[2, 2, 4] = 3, 2
  // Iterate through the row to check for adjacent equal numbers
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] == row[i + 1]) {
      row[i] *= 2;

      row[i + 1] = 0;
      // [4,0,4];
      score += row[i];
    }
  }
  row = filterZero(row); //[4,4] => [4,4,0,0]
  // adding the zeroes back
  while (row.length < columns) {
    row.push(0);
  } //[4, 4, 0, 0]

  return row;
}

function slideLeft() {
  console.log("You pressed Left!");

  // Iterate through each row
  for (let r = 0; r < rows; r++) {
    let row = board[r];
    let originalRow = row.slice(); //store the orig row contents in a new variable
    row = slide(row); //calling the slide function

    board[r] = row; //update the value in the array

    // Update the id of the tile
    // For each tile in the row, the code finds the corresponding HTML element by Its
    for (let c = 0; c < columns; c++) {
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);

      //Line for the animation
      if (originalRow[c] !== num && num !== 0) {
        tile.style.animation = "slide-from-right 0.3s";
        setTimeout(() => {
          tile.style.animation = "";
        }, 300);
      }
    }
  }
}

function slideRight() {
  console.log("You pressed Right!");
  for (let r = 0; r < rows; r++) {
    let row = board[r];
    let originalRow = row.slice();
    row.reverse();

    row = slide(row);
    row.reverse();

    board[r] = row;

    for (let c = 0; c < columns; c++) {
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);

      //Line for animation
      if (originalRow[c] !== num && num !== 0) {
        tile.style.animation = "slide-from-left 0.3s";
        setTimeout(() => {
          tile.style.animation = "";
        }, 300);
      }
    }
  }
}

function slideUp() {
  for (let c = 0; c < columns; c++) {
    //[2,2,8,0]
    let column = [board[0][c], board[1][c], board[2][c], board[3][c]];
    //[4,8,0,0]
    let originalColumn = column.slice(); //we contaion the original array in a new variable.
    column = slide(column);

    let changedIndices = [];
    for (let r = 0; r < rows; r++) {
      if (originalColumn[r] !== column[r]) {
        changedIndices.push(r);
      }
    }

    //Update the id of the title
    for (let r = 0; r < rows; r++) {
      board[r][c] = column[r];

      //1st iteration:
      //board[0][0] = column[0] = 4;
      //2nd iteration:
      //board[1][0] = column[1] = 8;
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);

      // Line animation
      if (changedIndices.includes(r) && num !== 0) {
        tile.style.animation = "slide-from-bottom 0.3s";
        setTimeout(() => {
          tile.style.animation = "";
        }, 300);
      }
    }
  }
}

function slideDown() {
  for (let c = 0; c < columns; c++) {
    let column = [board[0][c], board[1][c], board[2][c], board[3][c]];

    let originalColumn = column.slice(); //we contaion the original array in a new variable.

    column.reverse();
    column = slide(column);
    column.reverse();

    let changedIndices = [];
    for (let r = 0; r < rows; r++) {
      if (originalColumn[r] !== column[r]) {
        changedIndices.push(r);
      }
    }

    // Update the id of the tile
    for (let r = 0; r < rows; r++) {
      board[r][c] = column[r];

      // 1st iteration:
      // board[0][0] = column[0] = 4
      // 2nd iteration:
      // board[1][0] = column[1] = 8
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);

      // Line animation
      if (changedIndices.includes(r) && num !== 0) {
        tile.style.animation = "slide-from-top 0.3s";
        setTimeout(() => {
          tile.style.animation = "";
        }, 300);
      }
    }
  }
}

document.addEventListener("keydown", handleSlide);

//boolean value
function hasEmptyTile() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] == 0) {
        return true;
      }
    }
  }
  return false;
}

let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

//create a function to check if the user has the 2048 tile
function checkWin() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] == 2048 && is2048Exist == false) {
        alert("You win! You got the 2048!");
        is2048Exist = true;
      } else if (board[r][c] == 4096 && is4096Exist == false) {
        alert("You win! You got the 4096!");
        is4096Exist = true;
      } else if (board[r][c] == 8192 && is8192Exist == false) {
        alert("You win! You got the 8192!");
        is8192Exist = true;
      }
    }
  }
}

function hasLost() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) {
        return false;
      }

      const currentTile = board[r][c];
      //Check if currenttile's adjacent cells for possible merging
      if (
        (r > 0 && currentTile === board[r - 1][c]) ||
        (r < rows - 1 && currentTile === board[r + 1][c]) ||
        (c > 0 && currentTile === board[r][c - 1]) ||
        (c < columns - 1 && currentTile === board[r][c + 1])
      ) {
        return false;
      }
    }
  }
  //no possible moves left or empty tiles
  return true;
}

function restartgame() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      board[r][c] = 0;
    }
  }
  score = 0;

  setTwo();
  setTwo();
}

//function that will check if we can move going to the left
function canMoveLeft() {
  //it goes through each row of the grid, one by one it checks whether there is a possible move
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] !== 0) {
        if (board[r][c - 1] === 0 || board[r][c - 1] === board[r][c]) {
          return true;
        }
      }
    }
  }
  return false;
}

// Check if there are available merging moves or empty tile in the right direction
function canMoveRight() {
  for (let r = 0; r < rows; r++) {
    for (let c = columns - 2; c >= 0; c--) {
      if (board[r][c] !== 0) {
        if (board[r][c + 1] === 0 || board[r][c + 1] === board[r][c]) {
          return true;
        }
      }
    }
  }

  return false;
}

//function that will check if we can move going to the top
function canMoveUp() {
  //it goes through each row of the grid, one by one it checks whether there is a possible move
  for (let c = 0; c < columns; c++) {
    for (let r = 1; r < columns; r++) {
      if (board[r][c] !== 0) {
        if (board[r - 1][c] === 0 || board[r - 1][c] === board[r][c]) {
          return true;
        }
      }
    }
  }
  return false;
}

//function that will check if we can move going to the top
function canMoveDown() {
  //it goes through each row of the grid, one by one it checks whether there is a possible move
  for (let c = 0; c < columns; c++) {
    for (let r = rows - 2; r >= 0; r--) {
      if (board[r][c] !== 0) {
        if (board[r + 1][c] === 0 || board[r + 1][c] === board[r][c]) {
          return true;
        }
      }
    }
  }
  return false;
}

//Declaring variables used for touch input
let startX = 0;
let startY = 0;

//touchstart, touchmove, touchend
//touchstart unang pagpindot ng user, touchmove yung motion ng agscroll ng user, touchend yung pinakang ending or bumitaw yung daliri
//This will listen to when we touch the screen andassigns the x and y coordinate of that touch.
//Coordinates of the first touch
// Declaring variables used for touch input
document.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

document.addEventListener(
  "touchmove",
  (e) => {
    if (!e.target.className.includes("tile")) {
      return;
    }

    e.preventDefault(); //to disable the scrolling
  },
  { passive: false }
);
//passive false will ensure that the preventDefault will work

document.addEventListener("touchend", (e) => {
  if (!e.target.className.includes("tile")) {
    return;
  }

  let diffX = startX - e.changedTouches[0].clientX;
  let diffY = startY - e.changedTouches[0].clientY;

  // We are going to check the direction whether it is in respect of x-axis or y-axis.
  // Movement will be in respect of the x-axis
  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 0 && canMoveLeft()) {
      slideLeft();
      setTwo();
    } else if (diffX < 0 && canMoveRight()) {
      slideRight();
      setTwo();
    }
  } else {
    if (diffY > 0 && canMoveDown()) {
      slideUp();
      setTwo();
    } else if (diffY < 0 && canMoveUp()) {
      slideDown();
      setTwo();
    }
  }

  document.getElementById("score").innerText = score;

  checkWin();

  if (hasLost()) {
    // setTimeout to delay alert
    setTimeout(() => {
      alert("Game Over! You have lost the game. Game will restart!");
      alert("Click any arrow key to restart.");
      restartGame();
    }, 50);
  }
});

//going to left
//if malaki difference sa y, then sa y axis
//if malaki difference sa x, then sa x axis
