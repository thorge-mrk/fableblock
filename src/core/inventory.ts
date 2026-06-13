/**
 * Pure inventory-slot arithmetic shared by the React UI (player inventory)
 * and the logic worker (chests, furnaces, hoppers). All functions treat
 * `(ItemStack | null)[]` arrays immutably-by-slot: they mutate the array
 * in place but never alias stacks between slots.
 */
import { ItemStack, itemDef } from './items';

export type Slots = (ItemStack | null)[];

export function cloneStack(s: ItemStack | null): ItemStack | null {
  return s ? { ...s } : null;
}

export function stacksEqualType(a: ItemStack | null, b: ItemStack | null): boolean {
  if (!a || !b) return false;
  if (a.id !== b.id) return false;
  // Damaged tools never merge.
  if (a.dur !== undefined || b.dur !== undefined) return false;
  return true;
}

/**
 * Insert `stack` into `slots`, merging with existing stacks first then
 * filling empty slots. Returns the remainder (null if fully inserted).
 * `range` restricts insertion to [start, end).
 */
export function insertStack(slots: Slots, stack: ItemStack, start = 0, end = slots.length): ItemStack | null {
  const max = itemDef(stack.id).maxStack;
  let remaining = stack.count;
  if (max > 1) {
    for (let i = start; i < end && remaining > 0; i++) {
      const s = slots[i];
      if (s && stacksEqualType(s, stack) && s.count < max) {
        const take = Math.min(max - s.count, remaining);
        s.count += take;
        remaining -= take;
      }
    }
  }
  for (let i = start; i < end && remaining > 0; i++) {
    if (!slots[i]) {
      const put = Math.min(max, remaining);
      const ns: ItemStack = { id: stack.id, count: put };
      if (stack.dur !== undefined) ns.dur = stack.dur;
      slots[i] = ns;
      remaining -= put;
    }
  }
  if (remaining <= 0) return null;
  const rest: ItemStack = { id: stack.id, count: remaining };
  if (stack.dur !== undefined) rest.dur = stack.dur;
  return rest;
}

/** Count total items of `id` in the slot range. */
export function countItem(slots: Slots, id: number): number {
  let n = 0;
  for (const s of slots) if (s && s.id === id) n += s.count;
  return n;
}

/** Remove up to `count` items of `id`. Returns the number actually removed. */
export function removeItem(slots: Slots, id: number, count: number): number {
  let left = count;
  for (let i = 0; i < slots.length && left > 0; i++) {
    const s = slots[i];
    if (s && s.id === id) {
      const take = Math.min(s.count, left);
      s.count -= take;
      left -= take;
      if (s.count <= 0) slots[i] = null;
    }
  }
  return count - left;
}

/** Remove exactly one item from a specific slot. */
export function decrementSlot(slots: Slots, i: number): void {
  const s = slots[i];
  if (!s) return;
  s.count--;
  if (s.count <= 0) slots[i] = null;
}

/**
 * Cursor/slot click state machine used by every container UI.
 * button: 0 = left (swap / merge all), 2 = right (place one / split half).
 * Returns the new cursor stack.
 */
export function clickSlot(slots: Slots, i: number, cursor: ItemStack | null, button: 0 | 2): ItemStack | null {
  const slot = slots[i];
  if (!cursor) {
    if (!slot) return null;
    if (button === 0) {
      slots[i] = null;
      return slot;
    }
    // Right-click: pick up half (rounded up).
    const take = Math.ceil(slot.count / 2);
    const picked: ItemStack = { id: slot.id, count: take };
    if (slot.dur !== undefined) picked.dur = slot.dur;
    slot.count -= take;
    if (slot.count <= 0) slots[i] = null;
    return picked;
  }
  const max = itemDef(cursor.id).maxStack;
  if (!slot) {
    if (button === 0) {
      slots[i] = cursor;
      return null;
    }
    const ns: ItemStack = { id: cursor.id, count: 1 };
    if (cursor.dur !== undefined) ns.dur = cursor.dur;
    slots[i] = ns;
    cursor.count--;
    return cursor.count > 0 ? cursor : null;
  }
  if (stacksEqualType(slot, cursor) && slot.count < max) {
    const want = button === 0 ? cursor.count : 1;
    const take = Math.min(max - slot.count, want);
    slot.count += take;
    cursor.count -= take;
    return cursor.count > 0 ? cursor : null;
  }
  // Different items (or full target): swap on left click only.
  if (button === 0) {
    slots[i] = cursor;
    return slot;
  }
  return cursor;
}
