/// <reference path="./lib/TSDef/p5.global-mode.d.ts" />

"use strict";

let img;
const VIEWPORT_WIDTH = 1280;
const VIEWPORT_HEIGHT = 720;

// an array that store the intensity of each sample point
const rasterisedImgData = [[0]];

const tiles = 40;
let tileSize;

const dotSize = 20;

function preload() {
  img = loadImage("assets/Mona_Lisa-restored--samll.jpg");
}

function setup() {
  angleMode(DEGREES);
  createCanvas(VIEWPORT_WIDTH, VIEWPORT_HEIGHT, WEBGL);
  const resizedWidth = 200;
  const resizedHeight = resizedWidth * (img.height / img.width);
  img.resize(resizedWidth, resizedHeight);

  tileSize = img.width / tiles;

  // setup the canvas
  for (let x = 0; x < tiles; x++) {
    rasterisedImgData[x] = [];

    for (let y = 0; y < tiles; y++) {
      const c = img.get(x * tileSize, y * tileSize);
      const b = brightness(c) / 255;
      rasterisedImgData[x][y] = b;
    }
  }
}

let mouseWheelValue = 0;
const mouseWheelSensitivity = 0.1;

function draw() {
  // clean the width
  clear();
  background(0);
  noStroke(0);

  const objectHorizontalRotate = (mouseX - width / 2) * 0.1;
  const objectVerticalRotate = -(mouseY - height / 2) * 0.1;

  rotateY(objectHorizontalRotate);
  rotateX(objectVerticalRotate);

  // offset the coordinate so the object is centered
  translate((-img.width / 2) * 2, (-img.height / 2) * 2);
  scale(2);

  // image(img, 0, 0, VIEWPORT_WDITH);
  for (let x = 0; x < tiles; x++) {
    for (let y = 0; y < tiles; y++) {
      const size = rasterisedImgData[x][y] * 5;
      push();
      const offset = sin(mouseWheelValue * mouseWheelSensitivity) * 50 + 20;
      translate(x * tileSize, y * tileSize, size * offset);
      ellipse(0, 0, size, size);
      pop();
    }
  }
}

function mouseWheel(event) {
  mouseWheelValue += event.delta;
}
