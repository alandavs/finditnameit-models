// Real engine model — Khronos glTF sample 2CylinderEngine (CC-style sample model).
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export const items = [
  { id: "engine", name: "Engine assembly", aliases: ["engine", "motor"], region: "whole", near: "", fame: 1, fact: "A complete 2-cylinder engine model. Click parts to explore.", hint: "The whole engine." },
  { id: "block", name: "Engine block", aliases: ["block", "crankcase"], region: "main", near: "cylinders", fame: 1, fact: "Main structural casting that holds the cylinders and crankshaft.", hint: "The large central body." },
  { id: "cylinders", name: "Cylinders", aliases: ["cylinder", "bores"], region: "block", near: "pistons", fame: 1, fact: "The bores where pistons travel and combustion occurs.", hint: "The round housings for the pistons." },
  { id: "pistons", name: "Pistons", aliases: ["piston"], region: "cylinders", near: "crankshaft", fame: 1, fact: "Move up and down to convert combustion force into motion.", hint: "The moving parts inside the cylinders." },
  { id: "crankshaft", name: "Crankshaft", aliases: ["crank"], region: "lower", near: "pistons", fame: 1, fact: "Converts the up-and-down piston motion into rotation.", hint: "The spinning shaft at the bottom." },
  { id: "valves", name: "Valves", aliases: ["valve"], region: "head", near: "cylinders", fame: 2, fact: "Open and close to control intake and exhaust.", hint: "The parts that open the ports." }
];

export function build(scene) {
  const g = new THREE.Group();
  g.name = "gas-engine";
  scene.add(g);

  const loader = new GLTFLoader();
  loader.load(
    "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/2CylinderEngine/glTF-Binary/2CylinderEngine.glb",
    (gltf) => {
      const model = gltf.scene;
      model.scale.setScalar(0.01); // sample is in mm-ish scale
      model.position.set(0, 0, 0);
      model.traverse(child => {
        if (child.isMesh) {
          child.userData.id = "engine"; // make the whole thing pickable for now
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      g.add(model);
      // Re-fit once loaded
      if (window.__viewer) window.__viewer.fit(g);
    },
    undefined,
    (err) => console.error("GLB load failed", err)
  );

  return g;
}
