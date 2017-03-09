import {cycler} from "./lib";

let canvasElement = document.querySelector("canvas") as HTMLCanvasElement;
let canvas = canvasElement.getContext('2d');

canvasElement.width = 255;
canvasElement.height = 255;
cycler(canvas, 255, 255);