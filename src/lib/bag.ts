"use client";

import { useSyncExternalStore } from "react";

/*
 * Client-side shopping bag, persisted to localStorage. A placeholder until a
 * server-side cart exists; it never leaves the browser.
 */

export type BagItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  color: string;
  size: string;
  image: string;
  quantity: number;
};

const STORAGE_KEY = "atelier-bag";
const EMPTY: BagItem[] = [];

let items: BagItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) items = JSON.parse(stored) as BagItem[];
  } catch {
    items = EMPTY;
  }
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage unavailable (private mode, quota); keep the in-memory bag.
  }
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  load();
  return items;
}

function getServerSnapshot() {
  return EMPTY;
}

export function addToBag(item: Omit<BagItem, "quantity">) {
  load();
  const key = (i: BagItem) => `${i.productId}|${i.color}|${i.size}`;
  const match = items.find((i) => key(i) === key({ ...item, quantity: 1 }));
  items = match
    ? items.map((i) => (i === match ? { ...i, quantity: i.quantity + 1 } : i))
    : [...items, { ...item, quantity: 1 }];
  persist();
  listeners.forEach((listener) => listener());
}

export function useBag() {
  const bag = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const count = bag.reduce((sum, item) => sum + item.quantity, 0);
  return { items: bag, count };
}
