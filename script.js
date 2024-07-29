//Initializing canvas element
const canvas = document.getElementById("canvas1");
const context = canvas.getContext("2d");

document
  .getElementById("loadFileButton")
  .addEventListener("click", function () {
    document.getElementById("file").click();
  });

//Initializing img element
const image1 = new Image();

const inputSlider = document.getElementById("resolution");
const inputLabel = document.getElementById("resolutionLabel");

inputSlider.addEventListener("change", handleSlider);

class Cell {
  constructor(x, y, symbol, color) {
    this.x = x;
    this.y = y;
    this.symbol = symbol;
    this.color = color;
  }
  draw(context) {
    context.fillStyle = "white";
    context.fillText(this.symbol, this.x + 0.5, this.y + 0.5);
    context.fillStyle = this.color;
    context.fillText(this.symbol, this.x, this.y);
  }
}

class AsciiEffect {
  #imageCellArray = [];
  #charachters = [];
  #pixels = [];
  #context;
  #width;
  #height;

  constructor(context, width, height) {
    this.#context = context;
    this.#width = width;
    this.#height = height;
    this.#context.drawImage(image1, 0, 0, this.#width, this.#height);
    this.#pixels = this.#context.getImageData(0, 0, this.#width, this.#height);
  }
  #convertToSymbol(averageColor) {
    if (averageColor > 225) return "█";
    else if (averageColor > 225) return "@";
    else if (averageColor > 200) return "$";
    else if (averageColor > 175) return "?";
    else if (averageColor > 150) return "P";
    else if (averageColor > 125) return "o";
    else if (averageColor > 100) return "c";
    else if (averageColor > 75) return ":";
    else if (averageColor > 50) return ".";
    else if (averageColor > 25) return " ";
    else return "";
  }
  #scanImage(cellSize) {
    this.#imageCellArray = [];
    for (let y = 0; y < this.#pixels.height; y += cellSize) {
      for (let x = 0; x < this.#pixels.width; x += cellSize) {
        const posX = x * 4;
        const posY = y * 4;
        const pos = posY * this.#pixels.width + posX;

        if (this.#pixels.data[pos + 3] > 128) {
          const red = this.#pixels.data[pos];
          const green = this.#pixels.data[pos + 1];
          const blue = this.#pixels.data[pos + 2];
          const total = red + green + blue;
          const averageColor = total / 3;
          const color = `rgb(${red}, ${green}, ${blue})`;
          const symbol = this.#convertToSymbol(averageColor);
          this.#imageCellArray.push(new Cell(x, y, symbol, color));
        }
      }
    }
  }
  #drawAscii() {
    this.#context.clearRect(0, 0, this.#width, this.#height);
    for (let i = 0; i < this.#imageCellArray.length; i++) {
      this.#imageCellArray[i].draw(this.#context);
    }
  }
  draw(cellSize) {
    this.#scanImage(cellSize);
    this.#drawAscii();
  }
}

let asciiImage;

image1.onload = function Initialize() {
  canvas.width = image1.naturalWidth;
  canvas.height = image1.naturalHeight;
  asciiImage = new AsciiEffect(
    context,
    image1.naturalWidth,
    image1.naturalHeight
  );
  handleSlider();
};

function handleSlider() {
  if (inputSlider.value == 1) {
    inputLabel.innerHTML = "Original Image";
    context.drawImage(image1, 0, 0);
  } else {
    inputLabel.innerHTML = `Resolution ${inputSlider.value} px:`;
    context.font = parseInt(inputSlider.value) * 2 + "px monospace";
    asciiImage.draw(parseInt(inputSlider.value));
  }
}

document
  .getElementById("downloadButton")
  .addEventListener("click", async function () {
    var link = document.createElement("a");
    let foo = prompt("Type here");
    link.download = `${foo}.png`;
    link.href = document.getElementById("canvas1").toDataURL();
    link.click();
  });

function loadImageFromFile() {
  let fileInput = document.getElementById("file");
  let files = fileInput.files;
  if (files.length == 0) {
    return;
  }

  /*
    When the button is clicked, it lunches the input's (type = "file") event.
    After chosing the file img elements src are set to the img path.
    */
  let file = files[0];
  fileReader = new FileReader();
  fileReader.onload = function (e) {
    image1.src = e.target.result;
  };
  fileReader.onerror = function () {
    console.warn("oops, something went wrong.");
  };
  fileReader.readAsDataURL(file);
}
