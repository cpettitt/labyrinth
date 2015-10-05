import THREE from "three";

class PhysicsSystem {
  constructor(gameState) {
    this._gameState = gameState;
    this._playerGeometry = new THREE.Geometry();
  }

  tick(dt) {
    const input = this._gameState.input;
    const player = this._gameState.player;

    player.rotation += player.angularVelocity * dt;
    player.position.x += player.velocity * Math.sin(player.rotation) * dt;
    player.position.y += player.velocity * Math.cos(player.rotation) * dt;

    const forwardBackward = input.backward - input.forward;
    player.velocity = forwardBackward * player.moveRate;

    const turnLeftRight = input.turnLeft - input.turnRight;
    player.angularVelocity = turnLeftRight * player.turnRate;

    player.bbox = this._computePlayerBBox();
  }

  _computePlayerBBox() {
    const player = this._gameState.player;
    const position = new THREE.Vector2(player.position.x, player.position.y);
    const geometry = this._playerGeometry.copy(player.geometry);

    geometry.rotateY(player.rotation);
    geometry.computeBoundingBox();

    const bbox3 = geometry.boundingBox;
    const bbox = new THREE.Box2(new THREE.Vector2(bbox3.min.x, bbox3.min.z),
                                new THREE.Vector2(bbox3.max.x, bbox3.max.z));
    bbox.translate(position);
    return bbox;
  }
}

export default PhysicsSystem;
