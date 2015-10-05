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
  }

  tick(dt) {
    if (this._gameState.input.debug) {
      this.toggleEnabled();
    }

    if (this.isEnabled) {
      const player = this._gameState.player;
      const size = player.bbox.size();
      const center = player.bbox.center();
      this._playerBBox.scale.set(size.x, 1, size.y);
      this._playerBBox.position.set(center.x, 0, center.y);
      console.log(this._playerBBox);
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
}

export default DebugSystem;
