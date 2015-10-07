import THREE from "three";

class RenderSystem {
  constructor(gameState) {
    this._renderer = new THREE.WebGLRenderer();
    this._renderer.setPixelRatio(window.devicePixelRatio || 1);
    this._renderer.shadowMap.enabled = false;
    this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this._renderer.setClearColor(0, 1);
    document.body.appendChild(this._renderer.domElement);

    this.scene = new THREE.Scene();

    // Camera follows player's rotation
    this._camera1 = new THREE.PerspectiveCamera(60, null, 0.1, 20);
    this._camera1.position.set(0, 5, 3);
    this._camera1.lookAt(new THREE.Vector3(0, 0.25, -0.5));

    // Fixed rotation, but follow player
    this._camera2 = new THREE.PerspectiveCamera(60, null, 0.1, 20);

    this._currentCamera = 0;

    window.addEventListener("resize", () => this._onResize());
    this._onResize();

    this._gameState = gameState;
    this._ground = this._createGround();
    this._hemiLight = this._createHemiLight();
    this._shadowLight = this._createShadowLight();
    this._player = this._createPlayer();
    this._createWalls();

    this._player.add(this._camera1);
  }

  tick(dt) {
    const player = this._gameState.player;
    this._player.position.set(player.position.x, 0, player.position.y);
    this._player.rotation.y = player.rotation;

    if (this._gameState.input.toggleCamera) {
      this._currentCamera++;
    }

    this._camera2.position.set(0, 5, 3).add(this._player.position);
    this._camera2.lookAt(this._player.position);

    this._renderer.render(this.scene, this["_camera" + (this._currentCamera % 2 + 1)]);
  }

  _onResize() {
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    this._camera1.aspect = window.innerWidth / window.innerHeight;
    this._camera1.updateProjectionMatrix();
    this._camera2.aspect = window.innerWidth / window.innerHeight;
    this._camera2.updateProjectionMatrix();
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

    light.position.set(0, 10, 0);

    // Set up a target at which to orient the light
    light.target = new THREE.Object3D();
    light.target.position.set(this._gameState.width * 0.3, 0, this._gameState.height * 0.3);
    this.scene.add(light.target);

    light.shadowMapWidth = 2048;
    light.shadowMapHeight = 2048;
    light.shadowDarkness = 0.3;
    light.shadowCameraNear = 0.1;
    light.shadowCameraFar = Math.max(this._gameState.width, this._gameState.height) + light.position.y;
    light.shadowCameraTop = Math.max(this._gameState.width, this._gameState.height);
    light.shadowCameraBottom = -Math.max(this._gameState.width, this._gameState.height);
    light.shadowCameraRight = Math.max(this._gameState.width, this._gameState.height);
    light.shadowCameraLeft = -Math.max(this._gameState.width, this._gameState.height);
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

          if (x + 1 === state.width || !state.getCellData(x + 1, y).isWall) { geo.merge(px); }
          if (!x || !state.getCellData(x - 1, y).isWall) { geo.merge(nx); }
          geo.merge(py);
          if (y + 1 === state.height || !state.getCellData(x, y + 1).isWall) { geo.merge(pz); }
          if (!y || !state.getCellData(x, y - 1).isWall) { geo.merge(nz); }

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
