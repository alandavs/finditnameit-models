// Realistic inline-4 gas engine cutaway for student learning.
import * as THREE from "three";

export const items = [
  { id: "block", name: "Engine block", aliases: ["cylinder block"], region: "main structure", near: "cylinders", fame: 1, fact: "Cast iron or aluminum block that holds the cylinders, main bearings and coolant passages.", hint: "The large main casting." },
  { id: "cylinders", name: "Cylinders", aliases: ["bores"], region: "block", near: "pistons", fame: 1, fact: "Four precision bores where the pistons travel. Combustion happens above each piston.", hint: "The round holes the pistons slide in." },
  { id: "pistons", name: "Pistons", aliases: ["piston"], region: "cylinders", near: "connecting-rods", fame: 1, fact: "Transfer combustion force to the connecting rods. Have ring grooves for sealing.", hint: "The moving plugs inside the cylinders." },
  { id: "connecting-rods", name: "Connecting rods", aliases: ["con rods"], region: "lower end", near: "crankshaft", fame: 1, fact: "Convert the linear motion of the pistons into rotation of the crankshaft.", hint: "The rods linking pistons to the crank." },
  { id: "crankshaft", name: "Crankshaft", aliases: ["crank"], region: "lower end", near: "connecting-rods", fame: 1, fact: "Turns reciprocating piston motion into rotational power output. Counterweights balance the throws.", hint: "The long spinning shaft at the bottom." },
  { id: "spark-plugs", name: "Spark plugs", aliases: ["plugs"], region: "cylinder head", near: "valves", fame: 1, fact: "Ignite the compressed air-fuel mixture with a timed high-voltage spark.", hint: "The small plugs on top of each cylinder." },
  { id: "valves", name: "Valves", aliases: ["intake valves", "exhaust valves"], region: "cylinder head", near: "camshaft", fame: 1, fact: "Open and close to let the mixture in and exhaust out. Typically 2 or 4 per cylinder.", hint: "The parts that open and close the ports." },
  { id: "camshaft", name: "Camshaft", aliases: ["cam"], region: "cylinder head", near: "valves", fame: 2, fact: "Times the opening of the valves. Driven at half crank speed by the timing chain.", hint: "The shaft with the egg-shaped lobes." },
  { id: "valve-cover", name: "Valve cover", aliases: ["rocker cover"], region: "top", near: "camshaft", fame: 2, fact: "Covers the valvetrain. Can be removed to inspect cams and valves.", hint: "The lid on top of the engine." },
  { id: "intake-manifold", name: "Intake manifold", aliases: ["intake"], region: "side", near: "valves", fame: 2, fact: "Distributes the air-fuel mixture evenly to each cylinder.", hint: "The manifold on the intake side." },
  { id: "exhaust-manifold", name: "Exhaust manifold", aliases: ["exhaust"], region: "side", near: "valves", fame: 2, fact: "Collects exhaust gases from each cylinder and sends them to the exhaust system.", hint: "The manifold on the exhaust side." },
  { id: "oil-pan", name: "Oil pan", aliases: ["sump"], region: "bottom", near: "crankshaft", fame: 2, fact: "Holds the engine oil. The pickup tube draws oil from it.", hint: "The pan under the block." }
];

export function build(scene) {
  const g = new THREE.Group();
  g.name = "gas-engine";

  // Better PBR materials
  const matBlock = new THREE.MeshStandardMaterial({ color: 0x3a3a42, metalness: 0.65, roughness: 0.38 });
  const matAlum = new THREE.MeshStandardMaterial({ color: 0xc8d0d8, metalness: 0.85, roughness: 0.18 });
  const matSteel = new THREE.MeshStandardMaterial({ color: 0x9aa0aa, metalness: 0.9, roughness: 0.22 });
  const matPiston = new THREE.MeshStandardMaterial({ color: 0xd4b84a, metalness: 0.4, roughness: 0.45 });
  const matRed = new THREE.MeshStandardMaterial({ color: 0xb33a3a, metalness: 0.3, roughness: 0.5 });
  const matDark = new THREE.MeshStandardMaterial({ color: 0x1c1c22, metalness: 0.5, roughness: 0.55 });
  const matIntake = new THREE.MeshStandardMaterial({ color: 0x4a6a8a, metalness: 0.4, roughness: 0.4 });
  const matExhaust = new THREE.MeshStandardMaterial({ color: 0x6a4a3a, metalness: 0.45, roughness: 0.42 });

  // Block (slightly tapered realistic shape)
  const blockGeo = new THREE.BoxGeometry(4.2, 1.8, 1.7);
  const block = new THREE.Mesh(blockGeo, matBlock);
  block.position.y = 0.2;
  block.userData = { id: "block", layer: "main" };
  g.add(block);

  // Cylinder head
  const head = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.7, 1.8), matAlum);
  head.position.y = 1.55;
  head.userData = { id: "block", layer: "main" }; // group with block for now
  g.add(head);

  // Four cylinders + pistons + rods + valves
  for (let i = 0; i < 4; i++) {
    const x = (i - 1.5) * 0.92;

    // Cylinder bore (visible as open)
    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 1.6, 32), matSteel);
    cyl.position.set(x, 0.95, 0);
    cyl.userData = { id: "cylinders", layer: "main" };
    g.add(cyl);

    // Piston (offset for cutaway interest)
    const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.35, 24), matPiston);
    piston.position.set(x, 1.25 + (i % 2) * 0.15, 0);
    piston.userData = { id: "pistons", layer: "inner" };
    g.add(piston);

    // Connecting rod
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.0, 12), matSteel);
    rod.position.set(x, 0.45, 0);
    rod.userData = { id: "connecting-rods", layer: "inner" };
    g.add(rod);

    // Spark plug
    const plug = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.45, 10), matRed);
    plug.position.set(x, 2.15, 0.25);
    plug.userData = { id: "spark-plugs", layer: "outer" };
    g.add(plug);

    // Simple valves (two per cylinder)
    for (let v = 0; v < 2; v++) {
      const valve = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8), matSteel);
      valve.position.set(x + (v - 0.5) * 0.22, 1.95, -0.15);
      valve.userData = { id: "valves", layer: "inner" };
      g.add(valve);
    }
  }

  // Crankshaft with simple throws
  const crank = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 4.4, 20), matSteel);
  crank.rotation.z = Math.PI / 2;
  crank.position.set(0, -0.55, 0);
  crank.userData = { id: "crankshaft", layer: "inner" };
  g.add(crank);

  // Camshaft
  const cam = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.0, 16), matAlum);
  cam.rotation.z = Math.PI / 2;
  cam.position.set(0, 2.05, -0.35);
  cam.userData = { id: "camshaft", layer: "inner" };
  g.add(cam);

  // Valve cover (outer, removable)
  const cover = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.35, 1.9), matAlum);
  cover.position.y = 2.45;
  cover.userData = { id: "valve-cover", layer: "outer" };
  g.add(cover);

  // Intake manifold
  const intake = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.35, 0.4), matIntake);
  intake.position.set(0, 1.7, 0.95);
  intake.userData = { id: "intake-manifold", layer: "outer" };
  g.add(intake);

  // Exhaust manifold
  const exhaust = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.3, 0.35), matExhaust);
  exhaust.position.set(0, 1.65, -0.95);
  exhaust.userData = { id: "exhaust-manifold", layer: "outer" };
  g.add(exhaust);

  // Oil pan
  const pan = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.45, 1.5), matDark);
  pan.position.y = -1.15;
  pan.userData = { id: "oil-pan", layer: "outer" };
  g.add(pan);

  scene.add(g);
  return g;
}
