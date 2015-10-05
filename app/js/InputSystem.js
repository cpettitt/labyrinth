import Mousetrap from "mousetrap";

class InputSystem {
  constructor(gameState) {
    this._input = gameState.input = {
      forward: false,
      backward: false,
      turnLeft: false,
      turnRight: false
    };

    this._bindOnOff("up", "forward");
    this._bindOnOff("down", "backward");
    this._bindOnOff("left", "turnLeft");
    this._bindOnOff("right", "turnRight");
  }

  tick(dt) {}

  _bindOnOff(key, inputName) {
    Mousetrap.bind(key, () => {
      this._input[inputName] = true;
      return false;
    }, "keydown");

    Mousetrap.bind(key, () => {
      this._input[inputName] = false;
      return false;
    }, "keyup");
  }
}

export default InputSystem;
