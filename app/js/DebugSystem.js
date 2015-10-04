import { EventEmitter } from "events";

class DebugSystem extends EventEmitter {
  constructor() {
    super();
    this.isEnabled = false;

    // TODO bind for enable / disable should come from keyboard system
    window.addEventListener("keydown", event => {
      if (event.keyCode === 192 && event.shiftKey) {
        this.toggleEnabled();
        event.preventDefault();
      }
    });
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
