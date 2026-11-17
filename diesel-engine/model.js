// Diesel engine — student cutaway (compression-ignition).
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

export const items = [
  { id: "block", name: "Engine block", aliases: ["block"], region: "main structure", near: "cylinders", fame: 1, fact: "Heavier casting than a gas engine to handle higher compression.", hint: "The main structural casting." },
  { id: "cylinders", name: "Cylinders", aliases: ["bores"], region: "block", near: "pistons", fame: 1, fact: "Higher compression ratio than gas engines (typically 15–20:1).", hint: "Where the pistons travel." },
  { id: "pistons", name: "Pistons", aliases: ["piston"], region: "cylinders", near: "connecting-rods", fame: 1, fact: "Compress the air so hot that injected fuel auto-ignites.", hint: "The moving parts inside the cylinders." },
  { id: "injectors", name: "Fuel injectors", aliases: ["injectors", "injection"], region: "top", near: "cylinders", fame: 1, fact: "Spray fuel directly into the hot compressed air. No spark plugs.", hint: "The parts that squirt fuel in." },
  { id: "crankshaft", name: "Crankshaft", aliases: ["crank"], region: "lower end", near: "pistons", fame: 1, fact: "Converts piston motion to rotation, same job as in a gas engine.", hint: "The spinning shaft at the bottom." },
  { id: "glow-plugs", name: "Glow plugs", aliases: ["glow plug"], region: "top", near: "injectors", fame: 3, fact: "Heat the chamber for cold starts so the fuel can ignite.", hint: "Small heaters used only for starting." }
];

export function build(scene) {
  const g = new THREE.Group();
  const matDark = new THREE.MeshStandardMaterial({ color: 0x2a2a33, metalness: 0.65, roughness: 0.4 });
  const matMetal = new THREE.MeshStandardMaterial({ color: 0x888899, metalness: 0.75, roughness: 0.3 });
  const matBlue = new THREE.MeshStandardMaterial({ color: 0x3366cc, metalness: 0.3, roughness: 0.5 });
  const matYellow = new THREE.MeshStandardMaterial({ color: 0xddaa22, metalness: 0.4, roughness: 0.45 });

  const block = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.8, 1.6), matDark);
  block.position.y = 0.2; block.userData = { id: "block" }; g.add(block);

  for (let i = 0; i < 4; i++) {
    const x = (i - 1.5) * 0.74;
    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 1.4, 18), matMetal);
    cyl.position.set(x, 1.15, 0); cyl.userData = { id: "cylinders" }; g.add(cyl);
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.35, 14), matYellow);
    p.position.set(x, 1.5, 0); p.userData = { id: "pistons" }; g.add(p);
    const inj = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8), matBlue);
    inj.position.set(x, 2.2, 0); inj.userData = { id: "injectors" }; g.add(inj);
  }
  const crank = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.6, 12), matMetal);
  crank.rotation.z = Math.PI / 2; crank.position.y = -0.5; crank.userData = { id: "crankshaft" }; g.add(crank);

  scene.add(g);
  return g;
}
