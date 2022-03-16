import createFpsRender from "../utils/fps";
import CONSTS from "../config/consts";
import { Universe } from "./universe";
import { drawCells, drawGrid } from "../utils/canvasDraw";

// fps div
const fpsNode = document.querySelector<HTMLDivElement>("#fps")!;
const fpsRender = createFpsRender(fpsNode);

// consts
const { CELL_GAP, CELL_SIZE } = CONSTS;

const canvas = document.querySelector<HTMLCanvasElement>(
  "#game-of-life-canvas"
)!;
const ctx = canvas.getContext("2d")!;
const stopBtn = document.querySelector<HTMLButtonElement>("#stop")!;
const resetDeadBtn = document.querySelector<HTMLButtonElement>("#resetDead")!;
const resetRandom = document.querySelector<HTMLButtonElement>("#resetRandom")!;

const width = 120;
const height = 120;
const universe = new Universe(width, height);

canvas.height = (CELL_SIZE + CELL_GAP) * height + CELL_GAP;
canvas.width = (CELL_SIZE + CELL_GAP) * width + CELL_GAP;

let animationFrameId: number | null = null;

// main render funciton
const render = () => {
  fpsRender();

  universe.tick();
  NativeDrawCells();

  animationFrameId = requestAnimationFrame(render);
};

// start animation
drawGrid(ctx, width, height);
render();

// button control
stopBtn.addEventListener("click", (e) => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    (e.target! as HTMLButtonElement).innerText = "start";
  } else {
    animationFrameId = requestAnimationFrame(render);
    (e.target! as HTMLButtonElement).innerText = "stop";
  }
});
resetDeadBtn.addEventListener("click", () => {
  universe.resetDead();
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    stopBtn.innerText = "start";
  }
  NativeDrawCells();
});
resetRandom.addEventListener("click", () => {
  universe.resetRandom();
  NativeDrawCells();
});

//canvas control
canvas.addEventListener("click", (e) => {
  const boundingRect = canvas.getBoundingClientRect();

  const scaleX = canvas.width / boundingRect.width;
  const scaleY = canvas.height / boundingRect.height;

  const canvasLeft = (e.clientX - boundingRect.left) * scaleX;
  const canvasTop = (e.clientY - boundingRect.top) * scaleY;

  const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), height - 1);
  const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), width - 1);

  universe.toggleCell(row, col);

  NativeDrawCells();
});

function NativeDrawCells() {
  // get cells's pionter
  const cells = universe.getCells();

  drawCells(cells, ctx, width, height);
}

// jump control
document
  .querySelector<HTMLButtonElement>("#jump")!
  .addEventListener("click", () => {
    location.replace("index.html");
  });

console.log("this is native js!");
