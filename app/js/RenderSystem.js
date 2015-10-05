import THREE from "three";

class RenderSystem {
  constructor(gameState) {
    this._renderer = new THREE.WebGLRenderer();
    this._renderer.setPixelRatio(window.devicePixelRatio || 1);
    document.body.appendChild(this._renderer.domElement);

    this.scene = new THREE.Scene();
    this._camera = new THREE.PerspectiveCamera(45, null, 0.1, 100);
    this._camera.position.set(4.5, 10, 3.6);
    this._camera.lookAt(new THREE.Vector3(4.5, 0, 3.5));

    window.addEventListener("resize", () => this._onResize());
    this._onResize();

    this._gameState = gameState;
    console.log(this._gameState.width, this._gameState.height);
    this._ground = this._createGround();
    this._hemiLight = this._createHemiLight();
    this._createWalls();
  }

  tick(dt) {
    this._renderer.render(this.scene, this._camera);
  }

  _onResize() {
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
  }

  _createGround() {
    const geo = new THREE.PlaneGeometry(this._gameState.width, this._gameState.height);
    const mat = new THREE.MeshPhongMaterial({ color: 0xa3845c });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI * 0.5;
    mesh.position.set((this._gameState.width - 1) * 0.5, -0.5, (this._gameState.height - 1) * 0.5);
    this.scene.add(mesh);
    return mesh;
  }

  _createHemiLight() {
    const light = new THREE.HemisphereLight(0xffffbb, 0xa3845c, 1.2);
    light.position.set(0, 10, 0);
    this.scene.add(light);
    return light;
  }

  _createWalls() {
    const state = this._gameState;

    const mat = new THREE.MeshPhongMaterial({ color: 0x6699ff });

    // Faces for each side of the cube
    const px = cubeFaceHelper( 1, 0,  0,              0,  Math.PI * 0.5);
    const nx = cubeFaceHelper(-1, 0,  0,              0, -Math.PI * 0.5);
    const py = cubeFaceHelper( 0, 1,  0, -Math.PI * 0.5,              0);
    const pz = cubeFaceHelper( 0, 0,  1,              0,              0);
    const nz = cubeFaceHelper( 0, 0, -1,              0,  Math.PI      );

    // TODO evaluate merging all wall meshes later...
    for (var x = 0; x < state.width; ++x) {
      for (var y = 0; y < state.height; ++y) {
        const cellData = state.getCellData(x, y);
        if (cellData.isWall) {
          const geo = new THREE.Geometry();

          if (x + 1 < state.width && !state.getCellData(x + 1, y).isWall) { geo.merge(px); }
          if (x > 0 && !state.getCellData(x - 1, y).isWall) { geo.merge(nx); }
          geo.merge(py);
          if (y + 1 < state.height && !state.getCellData(x, y + 1).isWall) { geo.merge(pz); }
          if (y > 0 && !state.getCellData(x, y - 1).isWall) { geo.merge(nz); }

          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.set(x, 0.5, y);
          cellData.meshId = mesh.id;
          this.scene.add(mesh);
        }
      }
    }
  }
}

function cubeFaceHelper(tranX, tranY, tranZ, rotX, rotY) {
  const plane = new THREE.PlaneGeometry(1, 1);
  if (rotX) { plane.rotateX(rotX); }
  if (rotY) { plane.rotateY(rotY); }
  plane.translate(tranX * 0.5, tranY * 0.5, tranZ * 0.5);
  return plane;
}

export default RenderSystem;
