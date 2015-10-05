import { EventEmitter } from "events";
import Mousetrap from "mousetrap";

class DebugSystem extends EventEmitter {
  constructor() {
    super();
    this.isEnabled = false;

    Mousetrap.bind("~", () => {
      this.toggleEnabled();
      return false;
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
