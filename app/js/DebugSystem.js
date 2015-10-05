import THREE from "three";
import { EventEmitter } from "events";

class DebugSystem extends EventEmitter {
  constructor(gameState, scene) {
    super();
    this.isEnabled = false;

    this._gameState = gameState;
    this._scene = scene;

    const player = gameState.player;
    this._playerBBox = new PlayerBBox(player);
  }

  tick(dt) {
    if (this._gameState.input.debug) {
      this.toggleEnabled();
    }

    if (this.isEnabled) {
      this._playerBBox.update();
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

class PlayerBBox extends THREE.Mesh {
  constructor(player) {
    super(new THREE.BoxGeometry(1, 1, 1),
          new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }));
    this._player = player;
  }

  update() {
    const position = new THREE.Vector3(this._player.position.x, 0, this._player.position.y);
    const geometry = this._player.geometry.clone();

    // TODO the need to null out bounding containers seems to be a bug in three.js
    geometry.boundingBox = null;
    geometry.boundingSphere = null;
    // END

    geometry.rotateY(this._player.rotation);
    geometry.computeBoundingBox();
    const box = geometry.boundingBox.translate(position);
    box.size(this.scale);
    box.center(this.position);
  }
}

export default DebugSystem;
