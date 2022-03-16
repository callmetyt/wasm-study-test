import CONSTS from "../config/consts";

// consts
const { CELL_GAP, CELL_SIZE, DEAD_COLOR, GRID_COLOR, ALIVE_COLOR } = CONSTS;

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOR;

  for (let i = 0; i <= width; i++) {
    ctx.moveTo(i * (CELL_SIZE + CELL_GAP) + CELL_GAP, 0);
    ctx.lineTo(
      i * (CELL_SIZE + CELL_GAP) + CELL_GAP,
      (CELL_SIZE + CELL_GAP) * height + CELL_GAP
    );
  }

  for (let j = 0; j <= height; j++) {
    ctx.moveTo(0, j * (CELL_SIZE + CELL_GAP) + CELL_GAP);
    ctx.lineTo(
      (CELL_SIZE + CELL_GAP) * width + CELL_GAP,
      j * (CELL_SIZE + CELL_GAP) + CELL_GAP
    );
  }

  ctx.stroke();
}

export function drawCells(
  cells: Uint8Array | number[],
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  ctx.beginPath();

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col, width);

      ctx.fillStyle = cells[idx] === 0 ? DEAD_COLOR : ALIVE_COLOR;

      ctx.fillRect(
        col * (CELL_SIZE + CELL_GAP) + CELL_GAP,
        row * (CELL_SIZE + CELL_GAP) + CELL_GAP,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  ctx.stroke();
}

// get cell in linear memory(WebAssembly ues this)
function getIndex(row: number, column: number, width: number) {
  return row * width + column;
}
