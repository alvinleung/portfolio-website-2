/// <reference path="./lib/TSDef/p5.global-mode.d.ts" />

"use strict";

let img;
const VIEWPORT_WIDTH = 1280;
const VIEWPORT_HEIGHT = 720;

// an array that store the intensity of each sample point
const rasterisedImgData = [[0]];

// const tiles = 100;
const maxTileCount = 40;

let capture;

function setup() {
  angleMode(DEGREES);
  pixelDensity(1);
  createCanvas(VIEWPORT_WIDTH, VIEWPORT_HEIGHT, WEBGL);

  perspective(PI / 0.01, width / height, 0.1, 10000);

  // const resizedWidth = 200;
  // const resizedHeight = resizedWidth * (img.height / img.width);
  // img.resize(resizedWidth, resizedHeight);

  capture = createCapture(VIDEO);
  capture.size(320, 240);
  capture.hide();
}

let mouseWheelValue = 0;
const mouseWheelSensitivity = 0.1;
let colourMode = false;

function draw() {
  // clean the width
  clear();
  background(0);
  noStroke(0);
  rectMode(CENTER);
  // make sure the vidoe data is ready
  if (!capture.loadedmetadata) return;

  // offset the coordinate so the object is centered

  push();
  translate(-width / 2, -height / 2);
  image(capture, 0, 0, width, height); // draw the image capture to the screen
  pop();

  loadPixels();

  // translate(-capture.width / 2, -capture.height / 2);
  const xTileCount = maxTileCount;
  const xTileSize = width / maxTileCount;
  const yTileCount = Math.floor(height / xTileSize);
  const yTileSize = xTileSize;

  rotate3dSpace();

  // scale(0.5);
  // image(img, 0, 0, VIEWPORT_WDITH);

  background(0);

  // scale down the render along center anchor
  translate(width / 2, height / 2);
  scale(0.5);
  translate(-width / 2, -height / 2);

  for (let x = 0; x < xTileCount; x++) {
    for (let y = 0; y < yTileCount; y++) {
      const samplePixelColour = getPixelAt(x * xTileSize, y * yTileSize);

      const samplePixelIntensity =
        brightness([
          samplePixelColour[0] + samplePixelColour[1] + samplePixelColour[2],
        ]) / 255;

      const size = samplePixelIntensity * 20;
      push();
      const offset = sin(mouseWheelValue * mouseWheelSensitivity) * 50 + 5;

      if (colourMode)
        fill(samplePixelColour[0], samplePixelColour[1], samplePixelColour[2]);
      else fill(255);

      scale(-1, -1); // correct the uside down image
      translate(x * xTileSize, y * yTileSize, size * offset);
      scale(-1, -1); // correct the uside down image

      translate(width, height);
      rect(0, 0, size, size);
      pop();
    }
  }
}

function rotate3dSpace() {
  const objectHorizontalRotate = -(mouseX - width / 2) * 0.1;
  const objectVerticalRotate = (mouseY - height / 2) * 0.1;

  rotateY(objectHorizontalRotate);
  rotateX(objectVerticalRotate);
  translate(-width / 2, -height / 2);
}

function drawMosaicPicture(x, y, samplePixelColour) {
  if (samplePixelColour != undefined) {
    fill(samplePixelColour);
    rect(x * 10, y * 10, 10, 10);
  }
}

// get pixel array from serialised pxiel array
function getPixelAt(x, y) {
  const d = pixelDensity();
  const index = 4 * (y * d * width * d + x * d);

  // if (pixels[index] === undefined) {
  //   alert(x);
  //   alert(y);
  //   alert(index);
  //   return;
  // }
  // fill(pixels[index]);
  // rect(x * 10, y * 10, 10, 10);

  // each pixel occupy three value, hence "3"
  return [pixels[index], pixels[index + 1], pixels[index + 2]];
  // return pixels[index];
}

function mouseWheel(event) {
  mouseWheelValue += event.delta;
}

function mouseReleased() {
  colourMode = !colourMode;
}
