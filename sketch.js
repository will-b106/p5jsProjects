function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
    // Fill the array with 0s
    for (let j = 0; j < arr[i].length; j++) {
      arr[i][j] = 0;
    }
  }
  return arr;
}

let grid;
let velocityGrid;
let w = 5;
let cols, rows;
let hueValue = 200;
let gravity = 0.1;
const totalPixels = 900 * 800;

function withinCols(i) {
  return i >= 0 && i <= cols - 1;
}

function withinRows(j) {
  return j >= 0 && j <= rows - 1;
}

function setup() {
  createCanvas(900, 800);
  colorMode(HSB, 360, 255, 255);
  cols = width / w;
  rows = height / w;
  grid = make2DArray(cols, rows);
  velocityGrid = make2DArray(cols, rows, 1);
}

function mouseDragged() {}

function draw() {
  background(0);
  if (mouseIsPressed) {
    let mouseCol = floor(mouseX / w);
    let mouseRow = floor(mouseY / w);

    let matrix = 5;
    let extent = floor(matrix / 2);
    for (let i = -extent; i <= extent; i++) {
      for (let j = -extent; j <= extent; j++) {
        if (random(1) < 0.75) {
          let col = mouseCol + i;
          let row = mouseRow + j;
          // stop from overwriting previous coloured pixels
          if (withinCols(col) && withinRows(row) && grid[col][row] === 0) {  
            grid[col][row] = hueValue;
            velocityGrid[col][row] = 1;
          }
        }
      }
    }
    hueValue += 0.5;
    if (hueValue > 360) {
      hueValue = 1;
    }
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      // Calculate the interpolation factor based on the position in the grid
      let interpFactor = map(j, 0, rows - 1, 0, 1);
      // Applies a cubic function to create a faster transition between colours
      interpFactor = pow(interpFactor, 3)
      // Interpolate between brown and nude using the interpolation factor
      let r = lerp(30, 60, interpFactor);
      let g = lerp(50, 70, interpFactor);
      let b = lerp(40, 130, interpFactor);
      let sandColor = color(r, g, b);

      noStroke();
      if (grid[i][j] > 0) {
        //fill(grid[i][j], 255, 255);
        fill(sandColor);
        //console.log(sandColor);
        let x = i * w;
        let y = j * w;
        square(x, y, w);
      }
    }
  }

  let nextGrid = make2DArray(cols, rows);
  let nextVelocityGrid = make2DArray(cols, rows);

  // Check every cell
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      // What is the state?
      let state = grid[i][j];
      let velocity = velocityGrid[i][j];
      let moved = false;
      if (state > 0) {
        let newPos = int(j + velocity);
        for (let y = newPos; y > j; y--) {
          let below = grid[i][y];
          let dir = 1;
          if (random(1) < 0.5) {
            dir *= -1;
          }
          let belowA = -1;
          let belowB = -1;
          if (withinCols(i + dir)) belowA = grid[i + dir][y];
          if (withinCols(i - dir)) belowB = grid[i - dir][y];

          if (below === 0) {
            nextGrid[i][y] = state;
            nextVelocityGrid[i][y] = velocity + gravity;
            moved = true;
            break;
          } else if (belowA === 0) {
            nextGrid[i + dir][y] = state;
            nextVelocityGrid[i + dir][y] = velocity + gravity;
            moved = true;
            break;
          } else if (belowB === 0) {
            nextGrid[i - dir][y] = state;
            nextVelocityGrid[i - dir][y] = velocity + gravity;
            moved = true;
            break;
          }
        }
      }

      if (state > 0 && !moved) {
        nextGrid[i][j] = grid[i][j];
        nextVelocityGrid[i][j] = velocityGrid[i][j] + gravity;
      }
    }
  }
  grid = nextGrid;
  velocityGrid = nextVelocityGrid;
}