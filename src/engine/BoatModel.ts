/**
 * Client-side rideable boat presentation. A small wooden rowboat built from
 * box parts, positioned at the player while they are in "boat mode" (see
 * PlayerController.inBoat). The oars sweep when the boat is moving.
 */
import * as THREE from 'three';

const PLANK = 0x9c7f4e;
const TRIM = 0x6e5632;
const SEAT = 0x836841;

export class BoatModel {
  readonly group = new THREE.Group();
  private materials: THREE.MeshLambertMaterial[] = [];
  private baseColors: THREE.Color[] = [];
  private oarL: THREE.Group;
  private oarR: THREE.Group;
  private phase = 0;

  constructor() {
    const add = (
      w: number, h: number, d: number, color: number,
      x: number, y: number, z: number,
      parent: THREE.Object3D = this.group,
    ): THREE.Mesh => {
      const mat = new THREE.MeshLambertMaterial({ color });
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      mesh.position.set(x, y, z);
      parent.add(mesh);
      this.materials.push(mat);
      this.baseColors.push(new THREE.Color(color));
      return mesh;
    };

    // Floor + four low walls (length runs along -Z = forward).
    add(1.3, 0.12, 1.7, PLANK, 0, 0.07, 0);
    add(0.14, 0.34, 1.7, TRIM, -0.58, 0.27, 0);
    add(0.14, 0.34, 1.7, TRIM, 0.58, 0.27, 0);
    add(1.3, 0.34, 0.14, TRIM, 0, 0.27, -0.78); // bow
    add(1.3, 0.34, 0.14, TRIM, 0, 0.27, 0.78); // stern
    // Raised bow cap (a little prow wedge).
    add(0.9, 0.22, 0.4, PLANK, 0, 0.42, -0.72);
    // Seat the rider perches on.
    add(1.0, 0.12, 0.5, SEAT, 0, 0.34, 0.1);

    // Oars: pivot groups mounted at the gunwales so they can sweep.
    const mkOar = (sign: number): THREE.Group => {
      const pivot = new THREE.Group();
      pivot.position.set(sign * 0.62, 0.3, 0);
      const shaftMat = new THREE.MeshLambertMaterial({ color: TRIM });
      const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 1.25), shaftMat);
      shaft.position.set(sign * 0.32, 0, 0.1);
      shaft.rotation.z = sign * 0.5;
      pivot.add(shaft);
      const bladeMat = new THREE.MeshLambertMaterial({ color: PLANK });
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.22, 0.4), bladeMat);
      blade.position.set(sign * 0.64, -0.2, 0.62);
      pivot.add(blade);
      this.group.add(pivot);
      this.materials.push(shaftMat, bladeMat);
      this.baseColors.push(new THREE.Color(TRIM), new THREE.Color(PLANK));
      return pivot;
    };
    this.oarL = mkOar(-1);
    this.oarR = mkOar(1);
    this.group.visible = false;
  }

  update(x: number, y: number, z: number, yaw: number, speed: number, brightness: number, dt: number): void {
    this.group.position.set(x, y, z);
    this.group.rotation.y = yaw;
    // Row when moving; idle oars otherwise.
    this.phase += dt * (2 + Math.min(8, speed * 2));
    const stroke = Math.sin(this.phase) * Math.min(1, speed / 2);
    this.oarL.rotation.x = stroke * 0.5;
    this.oarR.rotation.x = -stroke * 0.5;
    const b = Math.max(0.12, brightness);
    for (let i = 0; i < this.materials.length; i++) {
      const c = this.baseColors[i];
      this.materials[i].color.setRGB(c.r * b, c.g * b, c.b * b);
    }
  }

  dispose(): void {
    this.group.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        (o.material as THREE.Material).dispose();
      }
    });
  }
}
