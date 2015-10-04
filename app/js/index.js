import DebugSystem from "./DebugSystem";
import RenderSystem from "./RenderSystem";
import Stats from "stats.js";

require("../css/main.css");

const renderSystem = new RenderSystem(document.body);
const debugSystem = new DebugSystem();

const stats = new Stats();

debugSystem.on("enabled", () => document.body.appendChild(stats.domElement));
debugSystem.on("disabled", () => stats.domElement.parentElement.removeChild(stats.domElement));

function loop() {
  stats.begin();
  const dt = 1/60;
  renderSystem.tick(dt);
  stats.end();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

console.log("Bundle loaded!");
