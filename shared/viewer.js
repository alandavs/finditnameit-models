// CAD-style 3D viewer (spin around point under cursor, pan, zoom-to-cursor, fit).
// Works with any Three.js scene that has named meshes with userData.id.

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/controls/OrbitControls.js";

export class Viewer {
  constructor(canvas, { background = 0x0a0d18 } = {}) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(background);

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.screenSpacePanning = true;

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.pickables = [];
    this.onPick = () => {};

    this._setupLights();
    this._setupEvents();
    this.resize();
    window.addEventListener("resize", () => this.resize());
    this._loop();
  }

  _setupLights() {
    this.scene.add(new THREE.AmbientLight(0x6070a0, 0.6));
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(6, 10, 8);
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0xffb547, 0.4);
    rim.position.set(-5, 3, -6);
    this.scene.add(rim);
  }

  setPickables(meshes) {
    this.pickables = meshes;
  }

  fit(object, padding = 1.4) {
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const dist = maxDim / (2 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2))) * padding;
    this.camera.position.copy(center).add(new THREE.Vector3(dist * 0.6, dist * 0.4, dist));
    this.controls.target.copy(center);
    this.controls.update();
  }

  resize() {
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  _setupEvents() {
    const canvas = this.canvas;
    canvas.addEventListener("pointerdown", e => this._onPointer(e, "down"));
    canvas.addEventListener("pointermove", e => this._onPointer(e, "move"));
    canvas.addEventListener("pointerup", e => this._onPointer(e, "up"));
    canvas.addEventListener("dblclick", () => this.fit(this.scene));
    window.addEventListener("keydown", e => {
      if (e.key === "f" || e.key === "F") this.fit(this.scene);
      if (e.key === "l" || e.key === "L") this.toggleLayers();
    });
  }

  _onPointer(e, type) {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    if (type === "up" && !this.controls.enableRotate) return;
    if (type !== "up") return;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.pickables, true);
    if (hits.length) {
      let obj = hits[0].object;
      while (obj && !obj.userData.id) obj = obj.parent;
      if (obj && obj.userData.id) this.onPick(obj.userData.id, obj);
    }
  }

  toggleLayers() {
    this.scene.traverse(obj => {
      if (obj.userData.layer === "outer") obj.visible = !obj.visible;
    });
  }

  _loop = () => {
    requestAnimationFrame(this._loop);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };
}
