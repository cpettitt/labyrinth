import THREE from "three";
import map from "lodash/collection/map";

class GameState {
  constructor(mapStr) {
    const rowStrs = mapStr.split("\n");
    this.width = Math.max.apply(Math, rowStrs.map(r => r.length));
    this.height = rowStrs.length;

    const player = this.player = {
      geometry: this._createPlayerGeometry(new THREE.Vector2(0.2, 0.3)),
      position: new THREE.Vector2(),
      rotation: 0,
      velocity: 0,
      moveRate: 3,
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
          isWall: cell === "x",
          bbox: new THREE.Box2(new THREE.Vector2(x - 0.5, y - 0.5),
                               new THREE.Vector2(x + 0.5, y + 0.5)),
          isCollision: false
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

  _createPlayerGeometry(size) {
    const shape = new THREE.Shape();
    shape.moveTo(0, size.y);
    shape.lineTo(size.x * 0.5, 0);
    shape.lineTo(-size.x * 0.5, 0);
    shape.lineTo(0, size.y);

    const geo = shape.extrude({ amount: 0.05, bevelEnabled: false });
    geo.rotateX(-Math.PI * 0.5);
    geo.translate(0, 0, size.y / 3);

    return geo;
  }
}

export default GameState;
