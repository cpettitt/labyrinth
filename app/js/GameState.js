import map from "lodash/collection/map";

class GameState {
  constructor(mapStr) {
    const rowStrs = mapStr.split("\n");
    this.width = Math.max.apply(Math, rowStrs.map(r => r.length));
    this.height = rowStrs.length;
    this._cellData = new Array(this.width);
    for (let x = 0; x < this.width; ++x) {
      this._cellData[x] = new Array(this.height);
      for (let y = 0; y < this.height; ++y) {
        const cell = rowStrs[y][x];        
        this._cellData[x][y] = {
          isWalkable: cell !== "x",
          isWall: cell === "x"
        };
      }
    }
  }

  getCellData(gridX, gridY) {
    return this._cellData[gridX][gridY];
  }
}

export default GameState;
