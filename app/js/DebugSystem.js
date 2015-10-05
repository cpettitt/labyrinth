import { EventEmitter } from "events";

class DebugSystem extends EventEmitter {
  constructor(gameState) {
    super();
    this._input = gameState.input;
    this.isEnabled = false;
  }

  tick(dt) {
    if (this._input.debug) {
      this.toggleEnabled();
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
    this.emit("enabled");
  }

  disable() {
    this.isEnabled = false;
    this.emit("disabled");
  }
}

export default DebugSystem;
