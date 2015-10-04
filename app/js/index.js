import RenderSystem from "./RenderSystem";

require("../css/main.css");

const renderSystem = new RenderSystem(document.body);

function loop() {
  const dt = 1/60;
  renderSystem.tick(dt);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

console.log("Bundle loaded!");
