import DebugSystem from "./DebugSystem";
import GameState from "./GameState";
import InputSystem from "./InputSystem";
import MapBuilder from "./MapBuilder";
import PhysicsSystem from "./PhysicsSystem";
import RenderSystem from "./RenderSystem";
import Stats from "stats.js";

require("../css/main.css");

const mapStr = new MapBuilder(10, 10).build();

const gameState = new GameState(mapStr);
const renderSystem = new RenderSystem(gameState);
const inputSystem = new InputSystem(gameState);
const physicsSystem = new PhysicsSystem(gameState);
const debugSystem = new DebugSystem(gameState, renderSystem.scene);

const stats = new Stats();

debugSystem.on("enabled", () => document.body.appendChild(stats.domElement));
debugSystem.on("disabled", () => stats.domElement.parentElement.removeChild(stats.domElement));

function loop() {
  stats.begin();
  // TODO fix your timestep :)
  const dt = 1/60;
  physicsSystem.tick(dt);
  renderSystem.tick(dt);
  inputSystem.tick(dt);
  debugSystem.tick(dt);
  stats.end();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

console.log("Bundle loaded!");
