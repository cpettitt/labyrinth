import THREE from "three";

class RenderSystem {
  constructor(gameState) {
    this._renderer = new THREE.WebGLRenderer();
    this._renderer.setPixelRatio(window.devicePixelRatio || 1);
    this._renderer.shadowMap.enabled = true;
    this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(this._renderer.domElement);

    this.scene = new THREE.Scene();
    this._camera = new THREE.PerspectiveCamera(45, null, 0.1, 100);
    this._camera.position.set(4.5, 10, 3.6);
    this._camera.lookAt(new THREE.Vector3(4.5, 0, 3.5));

    window.addEventListener("resize", () => this._onResize());
    this._onResize();

    this._gameState = gameState;
    this._ground = this._createGround();
    this._hemiLight = this._createHemiLight();
    this._shadowLight = this._createShadowLight();
    this._player = this._createPlayer();
    this._createWalls();
  }

  tick(dt) {
    const player = this._gameState.player;
    this._player.position.set(player.position.x, 0, player.position.y);
    this._player.rotation.y = player.rotation;
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
    mesh.receiveShadow = true;
    this.scene.add(mesh);
    return mesh;
  }

  _createHemiLight() {
    const light = new THREE.HemisphereLight(0xffffbb, 0xa3845c, 1.1);
    light.position.set(0, 10, 0);
    this.scene.add(light);
    return light;
  }

  _createShadowLight() {
    const light = new THREE.DirectionalLight();
    light.position.set(2.5, 5, 3.5);
    light.lookAt(new THREE.Vector3(4.5, 0, 3.5));
    light.shadowMapWidth = 1024;
    light.shadowMapHeight = 1024;
    light.shadowDarkness = 0.3;
    light.shadowCameraNear = 0.1;
    light.shadowCameraFar = 10;
    light.shadowCameraTop = 10;
    light.shadowCameraBottom = -10;
    light.shadowCameraRight = 10;
    light.shadowCameraLeft = -10;
    light.castShadow = true;
    light.onlyShadow = true;
    // light.shadowCameraVisible = true;
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
          mesh.position.set(x, 0, y);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          cellData.meshId = mesh.id;
          this.scene.add(mesh);
        }
      }
    }
  }

  _createPlayer() {
    const player = this._gameState.player;

    const mat = new THREE.MeshPhongMaterial({ color: 0x66ff99 });
    const mesh = new THREE.Mesh(player.geometry, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.scene.add(mesh);
    return mesh;
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
