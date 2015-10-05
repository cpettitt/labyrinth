import THREE from "three";
import map from "lodash/collection/map";

class GameState {
  constructor(mapStr) {
    const rowStrs = mapStr.split("\n");
    this.width = Math.max.apply(Math, rowStrs.map(r => r.length));
    this.height = rowStrs.length;

    const player = this.player = {
      size: new THREE.Vector2(0.2, 0.3),
      position: new THREE.Vector2(),
      rotation: 0,
      velocity: 0,
      moveRate: 2,
      angularVelocity: 0,
      turnRate: 2 * Math.PI,
    };

    this._cellData = new Array(this.width);
    for (let x = 0; x < this.width; ++x) {
      this._cellData[x] = new Array(this.height);
      for (let y = 0; y < this.height; ++y) {
        const cell = rowStrs[y][x];
        this._cellData[x][y] = {
          isWalkable: cell !== "x",
          isWall: cell === "x"
        };

        switch (cell) {
          case "^":
            player.position.set(x, y);
            player.rotation = 0;
            break;
          case ">":
            player.position.set(x, y);
            player.rotation = -Math.PI * 0.5;
            break;
          case "v":
            player.position.set(x, y);
            player.rotation = -Math.PI;
            break;
          case "<":
            player.position.set(x, y);
            player.rotation = -Math.PI * 1.5;
            break;
        }
      }
    }
  }

  getCellData(gridX, gridY) {
    return this._cellData[gridX][gridY];
  }
}

export default GameState;
