// Real engine model — Khronos glTF sample 2CylinderEngine, with fallback.
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export const items = [
  { id: "engine", name: "Engine assembly", aliases: ["engine", "motor"], region: "whole", near: "", fame: 1, fact: "A complete 2-cylinder engine. Tap anywhere on it.", hint: "The whole engine." },
  { id: "block", name: "Engine block", aliases: ["block", "crankcase"], region: "main", near: "cylinders", fame: 1, fact: "Main structural casting that holds the cylinders and crankshaft.", hint: "The large central body." },
  { id: "cylinders", name: "Cylinders", aliases: ["cylinder", "bores"], region: "block", near: "pistons", fame: 1, fact: "The bores where pistons travel and combustion occurs.", hint: "The round housings for the pistons." },
  { id: "pistons", name: "Pistons", aliases: ["piston"], region: "cylinders", near: "crankshaft", fame: 1, fact: "Move up and down to convert combustion force into motion.", hint: "The moving parts inside the cylinders." },
  { id: "crankshaft", name: "Crankshaft", aliases: ["crank"], region: "lower", near: "pistons", fame: 1, fact: "Converts the up-and-down piston motion into rotation.", hint: "The spinning shaft at the bottom." },
  { id: "valves", name: "Valves", aliases: ["valve"], region: "head", near: "cylinders", fame: 2, fact: "Open and close to control intake and exhaust.", hint: "The parts that open the ports." }
];

export function build(scene, onLoaded) {
  const g = new THREE.Group();
  g.name = "gas-engine";
  scene.add(g);

  // Immediate fallback so something is always clickable
  const fallback = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.8, 0.8),
    new THREE.MeshStandardMaterial({ color: 0x4a5568, metalness: 0.6, roughness: 0.4 })
  );
  fallback.position.y = 0.2;
  fallback.userData = { id: "engine" };
  g.add(fallback);

  const loader = new GLTFLoader();
  loader.load(
    "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/2CylinderEngine/glTF-Binary/2CylinderEngine.glb",
    (gltf) => {
      const model = gltf.scene;
      model.scale.setScalar(0.008);
      model.position.set(0, -0.4, 0);

      model.traverse(child => {
        if (child.isMesh) {
          child.userData = { id: "engine" };
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      g.remove(fallback);
      g.add(model);
      if (onLoaded) onLoaded(g);
    },
    undefined,
    (err) => {
      console.error("GLB load failed, keeping fallback", err);
      if (onLoaded) onLoaded(g);
    }
  );

  // Call onLoaded immediately so the fallback is pickable right away
  setTimeout(() => { if (onLoaded) onLoaded(g); }, 100);

  return g;
}
