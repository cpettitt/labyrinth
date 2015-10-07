import forEach from "lodash/collection/forEach";
import Mousetrap from "mousetrap";

class InputSystem {
  constructor(gameState) {
    this._input = gameState.input = {
      debug: false,
      forward: false,
      backward: false,
      turnLeft: false,
      turnRight: false,
      toggleCamera: false
    };

    this._bindPress("~", "debug");
    this._bindPress("c", "toggleCamera")
    this._bindHold("w", "forward");
    this._bindHold("s", "backward");
    this._bindHold("a", "turnLeft");
    this._bindHold("d", "turnRight");
    this._bindHold("up", "forward");
    this._bindHold("down", "backward");
    this._bindHold("left", "turnLeft");
    this._bindHold("right", "turnRight");

    this._queued = {};
  }

  tick(dt) {
    forEach(this._queued, (activate, inputName) => {
      this._input[inputName] = activate;
      if (activate) {
        this._queued[inputName] = false;
      }
    });
  }

  _bindPress(key, inputName) {
    Mousetrap.bind(key, () => {
      this._queued[inputName] = true;
    });
  }

  _bindHold(key, inputName) {
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
