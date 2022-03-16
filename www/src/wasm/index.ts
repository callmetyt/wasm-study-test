import CONSTS from "../config/consts";
import createFpsRender from "../utils/fps";
import { drawCells, drawGrid } from "../utils/canvasDraw";

// webpack5 syncWebAssembly
import("wasm-tset").then(async (module) => {
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
  const resetRandom =
    document.querySelector<HTMLButtonElement>("#resetRandom")!;

  const Universe = module.Universe;
  const Cell = module.Cell;

  const memory = await import("wasm-tset/hello_wasm_bg.wasm").then(
    (module) => module.memory
  );

  const universe = Universe.new();
  const width = universe.width();
  const height = universe.height();

  canvas.height = (CELL_SIZE + CELL_GAP) * height + CELL_GAP;
  canvas.width = (CELL_SIZE + CELL_GAP) * width + CELL_GAP;

  let animationFrameId: number | null = null;

  // main render funciton
  const render = () => {
    fpsRender();

    universe.tick();
    WasmDrawCells();

    animationFrameId = requestAnimationFrame(render);
  };

  // start animation
  drawGrid(ctx, width, height);
  render();
  // setInterval(() => {
  //   render();
  // }, 30);

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
    universe.reset_cells_dead();
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
      stopBtn.innerText = "start";
    }
    WasmDrawCells();
  });
  resetRandom.addEventListener("click", () => {
    universe.reset_cells_random();
    WasmDrawCells();
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

    universe.toggle_cell(row, col);

    WasmDrawCells();
  });

  function WasmDrawCells() {
    // get cells's pionter
    const cellsPtr = universe.cells();
    // use javascript's 8 bit no symbol int array
    const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

    drawCells(cells, ctx, width, height);
  }
});
// jump control
document
  .querySelector<HTMLButtonElement>("#jump")!
  .addEventListener("click", () => {
    location.replace("native.html");
  });

console.log("this is wasm!");
