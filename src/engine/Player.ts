/**
 * Main-thread player controller: per-frame swept-AABB movement (client-side
 * prediction at render rate while mobs run at 20 TPS in Thread B), sneak
 * ledge guard, fluid swimming with push vectors, fall-damage tracking.
 */
import { World } from '../core/world';
import { moveEntity, boxIntersectsSolid } from '../core/aabb';
import { blockDef, isFluid, isLava, isWater, fluidLevel, fluidHeight } from '../core/blocks';
import {
  PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_SNEAK_HEIGHT, PLAYER_EYE, PLAYER_SNEAK_EYE,
  PLAYER_WALK_SPEED, PLAYER_SPRINT_SPEED, PLAYER_SNEAK_SPEED, PLAYER_JUMP_SPEED,
  GRAVITY, TERMINAL_VELOCITY, STEP_HEIGHT, FLUID_PUSH, WATER_DRAG, PLAYER_SWIM_SPEED,
  FALL_DAMAGE_THRESHOLD,
} from '../core/config';
import { InputState } from './Input';

export class PlayerController {
  x = 0;
  y = 80;
  z = 0;
  vx = 0;
  vy = 0;
  vz = 0;
  yaw = 0;
  pitch = 0;
  onGround = false;
  sneaking = false;
  sprinting = false;
  inWater = false;
  inLava = false;
  headInFluid = false;
  /** Riding a boat (client-side vehicle: buoyant, drifty steering). */
  inBoat = false;
  /** Creative flight (double-tap jump toggles; landing while descending ends it). */
  flying = false;
  /** Highest y reached since leaving ground (fall damage). */
  private fallPeak = 0;
  /** Smoothed eye height for crouch transitions. */
  private eyeSmooth = PLAYER_EYE;

  onFallDamage: ((blocks: number) => void) | null = null;

  get height(): number {
    return this.sneaking ? PLAYER_SNEAK_HEIGHT : PLAYER_HEIGHT;
  }

  eyeHeight(): number {
    return this.eyeSmooth;
  }

  teleport(x: number, y: number, z: number): void {
    this.x = x;
    this.y = y;
    this.z = z;
    this.vx = this.vy = this.vz = 0;
    this.fallPeak = y;
  }

  /** Look direction unit vector. */
  lookDir(): [number, number, number] {
    const cp = Math.cos(this.pitch);
    return [-Math.sin(this.yaw) * cp, Math.sin(this.pitch), -Math.cos(this.yaw) * cp];
  }

  update(dt: number, world: World, inp: InputState): void {
    if (this.inBoat) {
      this.updateBoat(dt, world, inp);
      return;
    }
    if (this.flying) {
      this.updateFlight(dt, world, inp);
      return;
    }
    // --- Sneak state (can always start; can only stand up with headroom) ---
    if (inp.sneak) {
      this.sneaking = true;
    } else if (this.sneaking) {
      const w = PLAYER_WIDTH;
      if (!boxIntersectsSolid(world, this.x - w / 2, this.y, this.z - w / 2, w, PLAYER_HEIGHT, w)) {
        this.sneaking = false;
      }
    }
    this.sprinting = inp.sprint && inp.moveZ > 0.5 && !this.sneaking;

    // --- Fluid sampling over the body ---
    this.sampleFluids(world);

    // --- Desired horizontal velocity from input, rotated by yaw ---
    const speed = this.sneaking
      ? PLAYER_SNEAK_SPEED
      : this.sprinting
        ? PLAYER_SPRINT_SPEED
        : PLAYER_WALK_SPEED;
    const sin = Math.sin(this.yaw);
    const cos = Math.cos(this.yaw);
    // moveZ: forward (+), moveX: strafe right (+).
    let wishX = (-sin * inp.moveZ + cos * inp.moveX) * speed;
    let wishZ = (-cos * inp.moveZ - sin * inp.moveX) * speed;

    const inFluid = this.inWater || this.inLava;
    if (inFluid) {
      wishX *= 0.6;
      wishZ *= 0.6;
    }

    // Horizontal velocity approach (snappier on ground, floatier in air).
    const accel = this.onGround ? 14 : inFluid ? 6 : 4;
    this.vx += (wishX - this.vx) * Math.min(1, accel * dt);
    this.vz += (wishZ - this.vz) * Math.min(1, accel * dt);

    // --- Vertical ---
    if (inFluid) {
      this.vy += GRAVITY * 0.18 * dt;
      this.vy -= this.vy * Math.min(1, WATER_DRAG * dt);
      if (inp.jump) {
        this.vy += 26 * dt;
        if (this.vy > PLAYER_SWIM_SPEED) this.vy = PLAYER_SWIM_SPEED;
      }
      this.fallPeak = this.y;
    } else {
      if (inp.jump && this.onGround && !this.sneaking) {
        this.vy = PLAYER_JUMP_SPEED;
        this.onGround = false;
      }
      this.vy += GRAVITY * dt;
      if (this.vy < TERMINAL_VELOCITY) this.vy = TERMINAL_VELOCITY;
    }

    // Fluid current push vectors (Module 4 spec).
    this.applyFluidPush(world, dt);

    // --- Swept move (substep so a single long frame can never tunnel) ---
    const steps = Math.max(1, Math.ceil((Math.hypot(this.vx, this.vy, this.vz) * dt) / 0.45));
    let onGround = false;
    for (let i = 0; i < steps; i++) {
      const sdt = dt / steps;
      const res = moveEntity(
        world,
        this.x, this.y, this.z,
        PLAYER_WIDTH, this.height,
        this.vx * sdt, this.vy * sdt, this.vz * sdt,
        { stepHeight: this.onGround ? STEP_HEIGHT : 0, sneak: this.sneaking && this.onGround },
      );
      if (res.hitX) this.vx = 0;
      if (res.hitZ) this.vz = 0;
      if (res.hitY) {
        if (this.vy < 0) onGround = true;
        this.vy = 0;
      }
      this.x = res.cx;
      this.y = res.y;
      this.z = res.cz;
      if (res.onGround) onGround = true;
    }

    // --- Fall damage bookkeeping ---
    if (onGround && !this.onGround) {
      const fall = this.fallPeak - this.y;
      if (fall > FALL_DAMAGE_THRESHOLD && !this.inWater && this.onFallDamage) {
        this.onFallDamage(fall - FALL_DAMAGE_THRESHOLD);
      }
      this.fallPeak = this.y;
    }
    if (!onGround && this.y > this.fallPeak) this.fallPeak = this.y;
    if (onGround) this.fallPeak = this.y;
    this.onGround = onGround;

    // --- Eye height smoothing ---
    const targetEye = this.sneaking ? PLAYER_SNEAK_EYE : PLAYER_EYE;
    this.eyeSmooth += (targetEye - this.eyeSmooth) * Math.min(1, 18 * dt);
  }

  /** Creative flight: gravity-free glide, jump = rise, sneak = sink. */
  private updateFlight(dt: number, world: World, inp: InputState): void {
    this.sneaking = false;
    this.sprinting = inp.sprint;
    this.sampleFluids(world);
    const speed = (inp.sprint ? PLAYER_SPRINT_SPEED : PLAYER_WALK_SPEED) * 1.9;
    const sin = Math.sin(this.yaw);
    const cos = Math.cos(this.yaw);
    const wishX = (-sin * inp.moveZ + cos * inp.moveX) * speed;
    const wishZ = (-cos * inp.moveZ - sin * inp.moveX) * speed;
    this.vx += (wishX - this.vx) * Math.min(1, 9 * dt);
    this.vz += (wishZ - this.vz) * Math.min(1, 9 * dt);
    const wishY = (inp.jump ? 9 : 0) + (inp.sneak ? -9 : 0);
    this.vy += (wishY - this.vy) * Math.min(1, 9 * dt);

    const steps = Math.max(1, Math.ceil((Math.hypot(this.vx, this.vy, this.vz) * dt) / 0.45));
    let onGround = false;
    for (let i = 0; i < steps; i++) {
      const sdt = dt / steps;
      const res = moveEntity(
        world,
        this.x, this.y, this.z,
        PLAYER_WIDTH, this.height,
        this.vx * sdt, this.vy * sdt, this.vz * sdt,
        { stepHeight: 0, sneak: false },
      );
      if (res.hitX) this.vx = 0;
      if (res.hitZ) this.vz = 0;
      if (res.hitY) {
        if (this.vy < 0) onGround = true;
        this.vy = 0;
      }
      this.x = res.cx;
      this.y = res.y;
      this.z = res.cz;
      if (res.onGround) onGround = true;
    }
    // Sinking onto solid ground drops back into normal movement.
    if (onGround && wishY < 0) this.flying = false;
    this.onGround = onGround;
    this.fallPeak = this.y; // flight never charges fall damage
    this.eyeSmooth += (PLAYER_EYE - this.eyeSmooth) * Math.min(1, 18 * dt);
  }

  /** Buoyant, drifty boat movement: floats to the water line, glides on top. */
  private updateBoat(dt: number, world: World, inp: InputState): void {
    this.sneaking = false;
    this.sprinting = false;
    this.sampleFluids(world);

    // Find the water surface directly around the hull for buoyancy.
    const fx = Math.floor(this.x);
    const fz = Math.floor(this.z);
    const fy = Math.floor(this.y + 0.1);
    let surface = -Infinity;
    for (let dy = 1; dy >= -2; dy--) {
      const id = world.getBlockId(fx, fy + dy, fz);
      if (isWater(id)) {
        surface = fy + dy + fluidHeight(id);
        break;
      }
    }
    const onWater = surface > -1e8;

    // Drifty steering: fast on water, sluggish when grounded on land.
    const sin = Math.sin(this.yaw);
    const cos = Math.cos(this.yaw);
    const top = onWater ? 7.0 : 2.0;
    const wishX = (-sin * inp.moveZ + cos * inp.moveX) * top;
    const wishZ = (-cos * inp.moveZ - sin * inp.moveX) * top;
    const accel = onWater ? 2.4 : 5;
    this.vx += (wishX - this.vx) * Math.min(1, accel * dt);
    this.vz += (wishZ - this.vz) * Math.min(1, accel * dt);

    if (onWater) {
      // Spring toward the surface, then damp for a gentle bob.
      const targetY = surface - 0.12;
      this.vy += (targetY - this.y) * 9 * dt;
      this.vy -= this.vy * Math.min(1, 6 * dt);
      this.applyFluidPush(world, dt);
    } else {
      this.vy += GRAVITY * dt;
      if (this.vy < TERMINAL_VELOCITY) this.vy = TERMINAL_VELOCITY;
    }

    // Swept move with no step-up: the boat slides, it never climbs blocks.
    const steps = Math.max(1, Math.ceil((Math.hypot(this.vx, this.vy, this.vz) * dt) / 0.45));
    let onGround = false;
    for (let i = 0; i < steps; i++) {
      const sdt = dt / steps;
      const res = moveEntity(
        world,
        this.x, this.y, this.z,
        PLAYER_WIDTH, this.height,
        this.vx * sdt, this.vy * sdt, this.vz * sdt,
        { stepHeight: 0, sneak: false },
      );
      if (res.hitX) this.vx = 0;
      if (res.hitZ) this.vz = 0;
      if (res.hitY) {
        if (this.vy < 0) onGround = true;
        this.vy = 0;
      }
      this.x = res.cx;
      this.y = res.y;
      this.z = res.cz;
      if (res.onGround) onGround = true;
    }
    this.onGround = onGround;
    this.fallPeak = this.y; // boating never deals fall damage
    this.eyeSmooth += (PLAYER_EYE - this.eyeSmooth) * Math.min(1, 18 * dt);
  }

  private sampleFluids(world: World): void {
    this.inWater = false;
    this.inLava = false;
    const minX = Math.floor(this.x - PLAYER_WIDTH / 2);
    const maxX = Math.floor(this.x + PLAYER_WIDTH / 2);
    const minZ = Math.floor(this.z - PLAYER_WIDTH / 2);
    const maxZ = Math.floor(this.z + PLAYER_WIDTH / 2);
    const minY = Math.floor(this.y);
    const maxY = Math.floor(this.y + this.height * 0.7);
    for (let by = minY; by <= maxY; by++) {
      for (let bz = minZ; bz <= maxZ; bz++) {
        for (let bx = minX; bx <= maxX; bx++) {
          const id = world.getBlockId(bx, by, bz);
          if (!isWater(id) && !isLava(id)) continue;
          // Count the cell only if the body reaches into the fluid volume. A
          // surface cell's top sits at fluidHeight (~0.875), so feet resting in
          // the 0.875..1.0 slop must NOT read as submerged — that flip-flop
          // caused surface jitter and cancelled fall damage above the water.
          const above = world.getBlockId(bx, by + 1, bz);
          const top = by + (isFluid(above) ? 1 : fluidHeight(id));
          if (this.y >= top) continue;
          if (isWater(id)) this.inWater = true;
          else this.inLava = true;
        }
      }
    }
    // Head-in-fluid gates on the actual surface height too, so the underwater
    // overlay / breath doesn't switch on while the eyes just breach the surface.
    const eyeY = this.y + this.eyeSmooth;
    const ay = Math.floor(eyeY);
    const eyeId = world.getBlockId(Math.floor(this.x), ay, Math.floor(this.z));
    const eyeAbove = world.getBlockId(Math.floor(this.x), ay + 1, Math.floor(this.z));
    this.headInFluid = isFluid(eyeId) && (isFluid(eyeAbove) || eyeY - ay < fluidHeight(eyeId));
  }

  /** Flowing fluids accelerate entities toward their downhill gradient. */
  private applyFluidPush(world: World, dt: number): void {
    const bx = Math.floor(this.x);
    const bz = Math.floor(this.z);
    // Sample the cell the body actually sits in. A boat/surface swimmer floats
    // near the top of its cell, so the old fixed feet+0.3 offset overshot into
    // the AIR cell above the surface and no river current was ever felt.
    let by = Math.floor(this.y);
    let id = world.getBlockId(bx, by, bz);
    if (!isFluid(id)) {
      by = Math.floor(this.y + 0.3);
      id = world.getBlockId(bx, by, bz);
    }
    if (!isFluid(id)) return;
    const lv = fluidLevel(id);
    let px = 0;
    let pz = 0;
    const dirs = [
      [1, 0], [-1, 0], [0, 1], [0, -1],
    ];
    for (const [dx, dz] of dirs) {
      const nid = world.getBlockId(bx + dx, by, bz + dz);
      if (isFluid(nid)) {
        const nlv = fluidLevel(nid);
        if (nlv < lv) {
          px += dx * (lv - nlv);
          pz += dz * (lv - nlv);
        } else if (nlv > lv) {
          px -= dx * (nlv - lv) * 0.5;
          pz -= dz * (nlv - lv) * 0.5;
        }
      } else if (!blockDef(nid).solid && lv < 8) {
        // Open edge: flow toward it.
        px += dx * 0.6;
        pz += dz * 0.6;
      }
    }
    const len = Math.hypot(px, pz);
    if (len > 0.01) {
      const f = (FLUID_PUSH * dt) / len;
      this.vx += px * f;
      this.vz += pz * f;
    }
    // Inside a descending column (fluid directly above) drags you downward —
    // detect it by looking UP, since falling water is level 1-7, never a source.
    if (isFluid(world.getBlockId(bx, by + 1, bz))) {
      this.vy -= FLUID_PUSH * 0.4 * dt;
    }
  }
}
