import THREE from "three";

class RenderSystem {
  constructor() {
    this._renderer = new THREE.WebGLRenderer();
    this._renderer.setPixelRatio(window.devicePixelRatio || 1);
    document.body.appendChild(this._renderer.domElement);

    this.scene = new THREE.Scene();
    this._camera = new THREE.PerspectiveCamera(45, null, 1, 1000);

    window.addEventListener("resize", () => this._onResize());
    this._onResize();
  }

  tick(dt) {
    this._renderer.render(this.scene, this._camera);
  }

  _onResize() {
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
  }
}

export default RenderSystem;
