// Inline-4 gas engine — detailed student cutaway
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

export const items = [
  { id: "block", name: "Engine block", aliases: ["cylinder block", "block"], region: "main structure", near: "cylinders", fame: 1, fact: "The main casting. Holds the cylinders, crankshaft main bearings, and coolant jackets.", hint: "The big solid piece everything bolts to." },
  { id: "cylinders", name: "Cylinders", aliases: ["bores", "cylinder bores"], region: "block", near: "pistons", fame: 1, fact: "Four precision bores. The piston rings seal against these walls.", hint: "The round holes the pistons slide in." },
  { id: "pistons", name: "Pistons", aliases: ["piston"], region: "cylinders", near: "connecting-rods", fame: 1, fact: "Aluminum pistons with ring grooves. They transfer combustion force downward.", hint: "The moving plugs inside each cylinder." },
  { id: "rings", name: "Piston rings", aliases: ["rings", "compression rings"], region: "pistons", near: "pistons", fame: 2, fact: "Seal the combustion chamber and control oil. Usually two compression rings + one oil ring.", hint: "The thin bands around each piston." },
  { id: "connecting-rods", name: "Connecting rods", aliases: ["con rods", "rods"], region: "lower end", near: "crankshaft", fame: 1, fact: "Forged steel links that convert the piston’s linear motion into crank rotation.", hint: "The rods between pistons and crankshaft." },
  { id: "crankshaft", name: "Crankshaft", aliases: ["crank"], region: "lower end", near: "connecting-rods", fame: 1, fact: "Converts reciprocating motion into rotation. Has counterweights for balance.", hint: "The long spinning shaft at the bottom." },
  { id: "main-bearings", name: "Main bearings", aliases: ["crank bearings"], region: "lower end", near: "crankshaft", fame: 3, fact: "Support the crankshaft in the block and carry oil pressure.", hint: "The supports the crankshaft spins in." },
  { id: "spark-plugs", name: "Spark plugs", aliases: ["plugs"], region: "cylinder head", near: "valves", fame: 1, fact: "Ignite the compressed air-fuel mix with a high-voltage spark.", hint: "The small plugs screwed into the top of each cylinder." },
  { id: "valves", name: "Valves", aliases: ["intake valve", "exhaust valve"], region: "cylinder head", near: "camshaft", fame: 1, fact: "Poppet valves that open and close the intake and exhaust ports.", hint: "The parts that open and close the ports." },
  { id: "camshaft", name: "Camshaft", aliases: ["cam"], region: "cylinder head", near: "valves", fame: 2, fact: "Times valve opening. Lobes push the valves (directly or via rockers).", hint: "The shaft with the egg-shaped lobes." },
  { id: "timing-chain", name: "Timing chain", aliases: ["timing belt", "chain"], region: "front", near: "camshaft", fame: 2, fact: "Keeps the camshaft in sync with the crankshaft.", hint: "The chain or belt at the front of the engine." },
  { id: "valve-cover", name: "Valve cover", aliases: ["rocker cover"], region: "top", near: "camshaft", fame: 2, fact: "Outer cover. Remove it to inspect the valvetrain.", hint: "The lid on top — marked as an outer layer." },
  { id: "oil-pan", name: "Oil pan", aliases: ["sump"], region: "bottom", near: "crankshaft", fame: 2, fact: "Reservoir for engine oil. The pickup tube sits inside it.", hint: "The pan hanging under the block." },
  { id: "oil-pump", name: "Oil pump", aliases: ["pump"], region: "bottom", near: "oil-pan", fame: 3, fact: "Circulates oil under pressure to bearings and the valvetrain.", hint: "Usually driven off the crankshaft at the bottom." }
];

export function build(scene) {
  const g = new THREE.Group();
  g.name = "gas-engine";

  const matBlock = new THREE.MeshStandardMaterial({ color: 0x2c2c38, metalness: 0.55, roughness: 0.45 });
  const matMetal = new THREE.MeshStandardMaterial({ color: 0x8a8a9a, metalness: 0.8, roughness: 0.28 });
  const matAlum = new THREE.MeshStandardMaterial({ color: 0xb0c0d0, metalness: 0.75, roughness: 0.22 });
  const matYellow = new THREE.MeshStandardMaterial({ color: 0xd4a017, metalness: 0.35, roughness: 0.5 });
  const matRed = new THREE.MeshStandardMaterial({ color: 0xc0392b, metalness: 0.25, roughness: 0.55 });
  const matDark = new THREE.MeshStandardMaterial({ color: 0x1a1a22, metalness: 0.4, roughness: 0.6 });

  const block = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.5, 1.55), matBlock);
  block.position.y = 0.15;
  block.userData = { id: "block", layer: "main" };
  g.add(block);

  for (let i = 0; i < 4; i++) {
    const x = (i - 1.5) * 0.75;
    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 1.25, 24), matMetal);
    cyl.position.set(x, 1.05, 0);
    cyl.userData = { id: "cylinders", layer: "main" };
    g.add(cyl);

    const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, 0.28, 20), matYellow);
    piston.position.set(x, 1.38 + (i % 2) * 0.1, 0);
    piston.userData = { id: "pistons", layer: "inner" };
    g.add(piston);

    for (let r = 0; r < 2; r++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.235, 0.012, 8, 20), matMetal);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(x, 1.42 + r * 0.04, 0);
      ring.userData = { id: "rings", layer: "inner" };
      g.add(ring);
    }

    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.85, 10), matMetal);
    rod.position.set(x, 0.55, 0);
    rod.userData = { id: "connecting-rods", layer: "inner" };
    g.add(rod);
  }

  const crank = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3.7, 16), matAlum);
  crank.rotation.z = Math.PI / 2;
  crank.position.set(0, -0.42, 0);
  crank.userData = { id: "crankshaft", layer: "inner" };
  g.add(crank);

  for (let i = 0; i < 4; i++) {
    const plug = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.42, 10), matRed);
    plug.position.set((i - 1.5) * 0.75, 2.05, 0.22);
    plug.userData = { id: "spark-plugs", layer: "outer" };
    g.add(plug);
  }

  const cover = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.32, 1.75), matAlum);
  cover.position.y = 2.28;
  cover.userData = { id: "valve-cover", layer: "outer" };
  g.add(cover);

  const pan = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.38, 1.35), matDark);
  pan.position.y = -0.92;
  pan.userData = { id: "oil-pan", layer: "outer" };
  g.add(pan);

  scene.add(g);
  return g;
}
