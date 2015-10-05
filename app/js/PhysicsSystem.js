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

    this._checkCollisions(player.bbox);
  }

  _checkCollisions(playerBBox) {
    // TODO smarter broadphase
    const gs = this._gameState;
    const collisionVectors = [];
    for (let x = 0; x < gs.width; ++x) {
      for (let y = 0; y < gs.height; ++y) {
        const cellData = gs.getCellData(x, y);
        cellData.isCollision = false;
        if (!cellData.isWalkable) {
          const overlap = this._checkAABBCollision(cellData.bbox, playerBBox);
          if (overlap) {
            collisionVectors.push(overlap);
            cellData.isCollision = true;
          }
        }
      }
    }

    if (collisionVectors.length) {
      const resolution = new THREE.Vector2();
      collisionVectors.forEach(v => {
        resolution.add(v);
      });
      this._gameState.player.position.sub(resolution);
    }
  }

  /**
   * Return a vector that indicates where to move boxB so that it is not
   * colliding with boxA or return `undefined` if there is no collision.
   */
  _checkAABBCollision(boxA, boxB) {
    const centerDelta = boxA.center().sub(boxB.center());
    const overlap = boxA.size().add(boxB.size())
                        .multiplyScalar(0.5)
                        .sub(vec2Abs(centerDelta.clone()));

    if (overlap.x <= 0 || overlap.y <= 0) {
      return;
    }

    // No separating axis, so figure out the projection vector
    if (overlap.x < overlap.y) {
      if (centerDelta.x < 0) {
        overlap.x = -overlap.x;
      }
      overlap.y = 0;
    } else {
      overlap.x = 0;
      if (centerDelta.y < 0) {
        overlap.y = -overlap.y;
      }
    }
    return overlap;
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

function vec2Abs(vec) {
  vec.x = Math.abs(vec.x);
  vec.y = Math.abs(vec.y);
  return vec;
}

export default PhysicsSystem;
