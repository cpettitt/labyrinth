import THREE from "three";
import { EventEmitter } from "events";

class DebugSystem extends EventEmitter {
  constructor(gameState, scene) {
    super();
    this.isEnabled = false;

    this._gameState = gameState;
    this._scene = scene;

    this._playerBBox = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial({ color: 0x999999, wireframe: true }));
    this._collisionBBoxes = new THREE.Object3D();
    this._scene.add(this._collisionBBoxes);
  }

  tick(dt) {
    if (this._gameState.input.debug) {
      this.toggleEnabled();
    }

    if (this.isEnabled) {
      this._updatePlayerBBox();
      this._updateCollisionBBoxes();
    }
  }

  toggleEnabled() {
    if (this.isEnabled) {
      this.disable();
    } else {
      this.enable();
    }
  }

  enable() {
    this.isEnabled = true;
    this._scene.add(this._playerBBox);
    this.emit("enabled");
  }

  disable() {
    this.isEnabled = false;
    this._scene.remove(this._playerBBox);
    this.emit("disabled");
  }

  _updatePlayerBBox() {
    const player = this._gameState.player;
    const size = player.bbox.size();
    const center = player.bbox.center();
    this._playerBBox.scale.set(size.x, 1, size.y);
    this._playerBBox.position.set(center.x, 0, center.y);
  }

  _updateCollisionBBoxes() {
    this._collisionBBoxes.remove.apply(this._collisionBBoxes, this._collisionBBoxes.children);

    const gs = this._gameState;
    for (let x = 0; x < gs.width; ++x) {
      for (let y = 0; y < gs.height; ++y) {
        const cellData = gs.getCellData(x, y);
        if (cellData.isCollision) {
          // TODO better reuse of geometry and material
          const geo = new THREE.BoxGeometry(1, 1, 1);
          const mat = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.set(x, 0, y);
          this._collisionBBoxes.add(mesh);
        }
      }
    }
  }
}

export default DebugSystem;
