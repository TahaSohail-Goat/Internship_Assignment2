import * as THREE from "three";

/**
 * Builds a stylized over-ear headphone product mesh.
 * Procedural geometry (no external model file) — premium materials
 * carry the visual weight per apple.md's "product speaks" philosophy.
 */
export function createProduct() {
  const group = new THREE.Group();

  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x1d1d1f, // matches --color-ink
    metalness: 0.65,
    roughness: 0.25,
    clearcoat: 0.6,
    clearcoatRoughness: 0.2,
  });

  // Headband — half torus arching over the top
  const headband = new THREE.Mesh(
    new THREE.TorusGeometry(1.15, 0.05, 32, 64, Math.PI),
    bodyMaterial
  );
  headband.rotation.z = Math.PI;
  headband.position.y = 0.3;
  headband.castShadow = true;
  group.add(headband);

  // Ear cups
  const cupGeometry = new THREE.CylinderGeometry(0.42, 0.42, 0.28, 48);

  const leftCup = new THREE.Mesh(cupGeometry, bodyMaterial.clone());
  leftCup.rotation.z = Math.PI / 2;
  leftCup.position.set(-1.15, 0.3, 0);
  leftCup.castShadow = true;
  group.add(leftCup);

  const rightCup = leftCup.clone();
  rightCup.position.x = 1.15;
  group.add(rightCup);

  // Accent rings — Action Blue, the system's single interactive color
  const accentMaterial = new THREE.MeshStandardMaterial({
    color: 0x0066cc, // --color-primary
    metalness: 0.4,
    roughness: 0.3,
  });
  const ringGeometry = new THREE.TorusGeometry(0.44, 0.015, 16, 64);

  const leftRing = new THREE.Mesh(ringGeometry, accentMaterial);
  leftRing.rotation.y = Math.PI / 2;
  leftRing.position.set(-1.3, 0.3, 0);
  group.add(leftRing);

  const rightRing = leftRing.clone();
  rightRing.position.x = 1.3;
  group.add(rightRing);

  group.position.y = -0.1;
  return group;
}