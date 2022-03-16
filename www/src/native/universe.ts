export type ALIVE = 1;
export type DEAD = 0;
export type Cells = ALIVE | DEAD;

export class Universe {
  private width: number;
  private height: number;
  private cells: Cells[];
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.cells = [];
    for (let i = 0; i < height * width; i++) {
      this.cells.push(Math.random() > 0.5 ? 0 : 1);
    }
  }
  getCells(): Cells[] {
    return this.cells;
  }
  tick() {
    // 地图循环相邻，e.g：第一行和最后一行视为相邻
    const nextCells = [...this.cells];
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        // 邻居计算，Dead为0，Alive为1，合计数值进行判断
        let count = 0;
        // 相邻行计算
        const topRow = (row + this.height - 1) % this.height;
        const bottomRow = (row + this.height + 1) % this.height;
        // 相邻列计算
        const leftCol = (col + this.width - 1) % this.width;
        const rightCol = (col + this.width + 1) % this.width;
        // 计算总和
        count +=
          this.getSignleCell(topRow, leftCol) +
          this.getSignleCell(topRow, col) +
          this.getSignleCell(topRow, rightCol) +
          this.getSignleCell(row, leftCol) +
          this.getSignleCell(row, rightCol) +
          this.getSignleCell(bottomRow, leftCol) +
          this.getSignleCell(bottomRow, col) +
          this.getSignleCell(bottomRow, rightCol);
        // 修改状态
        const targetStatus = this.getSignleCell(row, col);
        if (targetStatus === 1 && count < 2) {
          // 存活且邻居少于2，死亡
          nextCells[row * this.width + col] = 0;
        } else if (targetStatus === 1 && (count === 2 || count === 3)) {
          // 存活且邻居等于2||3，存活
          nextCells[row * this.width + col] = 1;
        } else if (targetStatus === 1 && count > 3) {
          // 存活且邻居大于3，死亡
          nextCells[row * this.width + col] = 0;
        } else if (targetStatus === 0 && count === 3) {
          // 死亡且邻居等于3，存活
          nextCells[row * this.width + col] = 1;
        }
      }
    }
    this.cells = nextCells;
  }
  resetRandom() {
    let nextCells: Cells[] = [];
    for (let i = 0; i < this.height * this.width; i++) {
      nextCells.push(Math.random() > 0.5 ? 0 : 1);
    }
    this.cells = nextCells;
  }
  resetDead() {
    this.cells.fill(0);
  }
  toggleCell(row: number, col: number) {
    this.cells[row * this.width + col] = this.cells[row * this.width + col]
      ? 0
      : 1;
  }
  private getSignleCell(row: number, col: number): Cells {
    return this.cells[row * this.width + col];
  }
}
