class PhysicsSystem {
  constructor(gameState) {
    this._gameState = gameState;
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
  }
}

export default PhysicsSystem;
