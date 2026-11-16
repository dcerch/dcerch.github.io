// =====================================================================
//  main.js — the Navigator engine.
// =====================================================================
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { GTAOPass } from "three/addons/postprocessing/GTAOPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { buildWorld } from "./world.js";
import { furnish } from "./furnish.js";
import { buildKidSpace } from "./kidspace.js";
import { setAnisotropy } from "./assets.js";
import { makeScreens } from "./screens.js";
import { createARG } from "./arg.js";
import { sfx, isMuted, setMuted } from "./audio.js";
import * as UI from "./ui.js";
import { ROOMS, APPS, TRINKETS } from "./data.js";

const $ = s => document.querySelector(s);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const EMBEDDED = window.parent !== window;

// ---------------------------------------------------------------- renderer
const canvas = $("#scene");
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
} catch (e) {
  document.body.classList.add("no-webgl");
  $("#bootStatus").textContent = "Your browser can't draw 3D right now — opening the house directory instead.";
  throw e;
}
const lowPower = matchMedia("(pointer: coarse)").matches || (navigator.hardwareConcurrency || 8) <= 4;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
setAnisotropy(Math.min(8, renderer.capabilities.getMaxAnisotropy()));

const scene = new THREE.Scene();
window.__navReady = true;
scene.fog = new THREE.Fog(0xcfe0ee, 45, 110);
const camera = new THREE.PerspectiveCamera(60, 1, 0.03, 300);

// image-based lighting: soft, glossy "pre-rendered" reflections on every surface
const pmrem = new THREE.PMREMGenerator(renderer);
const defaultEnv = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environment = defaultEnv;
scene.environmentIntensity = 0.45;
scene.add(new THREE.HemisphereLight(0xfff1dc, 0x5a3a24, 0.45));
const sun = new THREE.DirectionalLight(0xfff0d6, 1.7);
sun.position.set(14, 22, 12); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -18, right: 18, top: 18, bottom: -18, near: 1, far: 60 });
sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.02;
sun.target.position.set(0, 0, -4); scene.add(sun, sun.target);
scene.add(new THREE.AmbientLight(0xffe8d0, 0.12));

const world = buildWorld(scene);
const { hotspots, refs } = world;
const kid = buildKidSpace(scene, { hot: world.hot, updaters: world.updaters, refs });
const furnished = furnish(refs);
const screens = makeScreens(refs);
const later = ms => new Promise(r => setTimeout(r, ms));
furnished.living.then(() => later(250)).then(() => bakeProbe("living"));
furnished.all.then(() => later(400)).then(() => { ["kitchen", "den", "rec", "kidspace"].forEach(bakeProbe); quality.grace = performance.now() + 5000; });
window.__nav = { scene, refs, camera, THREE, hotspots }; // handy for poking around in devtools

// assign each hotspot to a room by its position
function roomAt(x, z) { return z < -30 ? "kidspace" : x > 6 ? "kitchen" : x < -6 ? "den" : z < -6 ? "rec" : "living"; }
scene.updateMatrixWorld(true);
const tmpV = new THREE.Vector3(), tmpBox = new THREE.Box3();
hotspots.forEach(o => { o.getWorldPosition(tmpV); o.userData.hot.room = roomAt(tmpV.x, tmpV.z); });

// ---------------------------------------------------------------- camera rig
const cam = { pos: new THREE.Vector3(0, 2.2, 17), yaw: 0, pitch: -0.05, fov: 60 };
let mode = "boot";          // boot | room | focus | drawer | map | travel
let room = "living";
let tweening = null;

function applyCam() {
  camera.position.copy(cam.pos);
  camera.rotation.set(cam.pitch, cam.yaw, 0, "YXZ");
  if (camera.fov !== cam.fov) { camera.fov = cam.fov; camera.updateProjectionMatrix(); }
}
const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
function angleLerp(a, b, t) { let d = ((b - a + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI; return a + d * t; }

function flyTo(target, dur = 1.1) {
  if (reduceMotion) dur = 0.01;
  return new Promise(resolve => {
    const from = { pos: cam.pos.clone(), yaw: cam.yaw, pitch: cam.pitch, fov: cam.fov };
    const to = { pos: target.pos.clone ? target.pos.clone() : new THREE.Vector3(...target.pos), yaw: target.yaw ?? from.yaw, pitch: target.pitch ?? from.pitch, fov: target.fov ?? from.fov };
    tweening = { from, to, t: 0, dur, resolve };
  });
}
function lookAngles(from, at) {
  const d = new THREE.Vector3().subVectors(at, from);
  return { yaw: Math.atan2(-d.x, -d.z), pitch: Math.atan2(d.y, Math.hypot(d.x, d.z)) };
}
const baseFov = () => (window.innerWidth / window.innerHeight < 0.8 ? 80 : window.innerWidth / window.innerHeight < 1.2 ? 70 : 60);
function roomView(r) { const v = ROOMS[r].view; return { pos: new THREE.Vector3(...v.pos), yaw: v.yaw, pitch: v.pitch, fov: baseFov() }; }
const isRoom = r => Object.prototype.hasOwnProperty.call(ROOMS, r);
// Close any open window without its "fly back" callback, because the caller is about to move the camera itself.
function dismissWindow() {
  if (UI.isWindowOpen()) UI.closeWindow({ silent: true });
  focusedDef = null;
  if (mode === "focus") mode = "room";
}

async function warpTo(target) {
  const prev = mode; mode = "travel"; UI.tooltip(null); clearHover();
  if (prev === "drawer") closeDrawerQuiet();
  sfx.boing(); const w = $("#warp"); w.hidden = false; w.classList.remove("on"); void w.offsetWidth; w.classList.add("on");
  await new Promise(r => setTimeout(r, reduceMotion ? 10 : 450));
  const v = roomView(target); cam.pos.copy(v.pos); cam.yaw = v.yaw; cam.pitch = v.pitch; cam.fov = v.fov;
  room = target; onRoomChanged();
  await new Promise(r => setTimeout(r, reduceMotion ? 10 : 450));
  w.classList.remove("on"); setTimeout(() => (w.hidden = true), 400);
  mode = "room";
  if (target === "kidspace" && !kid.greeted) { kid.greeted = true; kid.welcome(); }
}
async function travelTo(target) {
  if (!isRoom(target) || mode === "travel" || mode === "boot") return;
  if ((target === "kidspace") !== (room === "kidspace")) return warpTo(target);
  if (target === room && mode === "room") { flyTo(roomView(room), 0.6); return; }
  const prev = mode; mode = "travel"; UI.tooltip(null); clearHover();
  if (prev === "drawer") closeDrawerQuiet();
  sfx.whoosh();
  const pts = [];
  if (room !== "living" && room !== target) pts.push(new THREE.Vector3(...ROOMS[room].door));
  if (target !== "living" && room !== target) pts.push(new THREE.Vector3(...ROOMS[target].door));
  else if (target === "living" && room !== "living") pts.push(new THREE.Vector3(0, 1.65, 1.2));
  let cur = cam.pos.clone();
  for (const p of pts) {
    const a = lookAngles(cur, p);
    await flyTo({ pos: p, yaw: a.yaw, pitch: 0, fov: 62 }, Math.max(0.5, cur.distanceTo(p) / 6));
    cur = p.clone();
  }
  const v = roomView(target);
  await flyTo(v, Math.max(0.6, cur.distanceTo(v.pos) / 5));
  room = target; mode = "room"; onRoomChanged();
}
function onRoomChanged() {
  UI.setRoomTitle(ROOMS[room].name);
  UI.setDefaultStatus(ROOMS[room].blurb);
  document.querySelectorAll("[data-room]").forEach(b => b.classList.toggle("active", b.dataset.room === room));
  document.body.classList.toggle("in-kidspace", room === "kidspace");
  history.replaceState(null, "", "#" + room);
  useRoomProbe(room);
}

// ---------------------------------------------------------------- room culling
// Only draw the rooms you can actually see: the one you're in plus the living room (every door
// opens onto it). From the living room every room is visible through a doorway.
const HOUSE = ["living", "kitchen", "den", "rec"];
function roomGroup(r) { return r === "kidspace" ? refs.kid?.room : refs.g?.[r]; }
function setRoomVis(show) {
  if (!setRoomVis.lifted) {
    // keep every light in the scene root so hiding a room never changes the light count (that would recompile shaders)
    setRoomVis.lifted = true;
    [...HOUSE, "kidspace"].forEach(r => { const g = roomGroup(r); if (!g) return; const ls = []; g.traverse(o => o.isLight && ls.push(o)); ls.forEach(l => { const t = l.target; scene.attach(l); if (t && t.parent !== scene) scene.attach(t); }); });
  }
  [...HOUSE, "kidspace"].forEach(r => { const g = roomGroup(r); if (g) g.visible = show.includes(r); });
}
const frustum = new THREE.Frustum(), projM = new THREE.Matrix4();
const DOORS = { rec: new THREE.Box3(new THREE.Vector3(3.6, 0, -6.2), new THREE.Vector3(5.4, 2.35, -5.8)), den: new THREE.Box3(new THREE.Vector3(-6.2, 0, -1), new THREE.Vector3(-5.8, 2.35, 1)), kitchen: new THREE.Box3(new THREE.Vector3(5.8, 0, -1), new THREE.Vector3(6.2, 2.35, 1)) };
function cullRooms() {
  if (mode === "map" || mode === "boot") return setRoomVis(HOUSE);
  const here = roomAt(cam.pos.x, cam.pos.z);
  if (here === "kidspace") return setRoomVis(["kidspace"]);
  if (here !== "living") return setRoomVis([here, "living"]);
  // from the living room, only draw a neighbour if its doorway is actually on screen
  camera.updateMatrixWorld(); projM.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse); frustum.setFromProjectionMatrix(projM);
  setRoomVis(["living", ...Object.keys(DOORS).filter(r => mode === "travel" || frustum.intersectsBox(DOORS[r]))]);
}

// ---------------------------------------------------------------- reflection probes
// Once a room is furnished, photograph it from the middle into a cube map. Using the room's
// own picture as its environment gives every glossy surface believable reflections and
// soft fill light that matches the walls around it.
const probes = {};
const probeSpots = { living: [0, 1.6, 0.5], kitchen: [10, 1.6, 0], den: [-10, 1.6, 0], rec: [0, 1.6, -10], kidspace: [0, 1.7, -60] };
function bakeProbe(r) {
  const p = probeSpots[r]; if (!p) return;
  const rt = new THREE.WebGLCubeRenderTarget(256, { type: THREE.HalfFloatType });
  const cc = new THREE.CubeCamera(0.05, 60, rt); cc.position.set(...p); scene.add(cc);
  const prevEnv = scene.environment; scene.environment = defaultEnv;
  setRoomVis(r === "kidspace" ? ["kidspace"] : HOUSE);
  cc.update(renderer, scene);
  cullRooms();
  scene.environment = prevEnv; scene.remove(cc);
  if (probes[r]) probes[r].dispose();
  probes[r] = pmrem.fromCubemap(rt.texture).texture; rt.dispose();
  if (room === r) useRoomProbe(r);
}
function useRoomProbe(r) {
  scene.environment = probes[r] || defaultEnv;
  scene.environmentIntensity = probes[r] ? ({ kidspace: 0.7, rec: 0.55 }[r] ?? 0.8) : 0.45;
  // the room you're in gets its ceiling lamp swapped for one shadow-casting twin (a fixed light count
  // means no shader recompiles when you walk between rooms)
  Object.entries(refs.lamps || {}).forEach(([k, l]) => {
    if (l.userData.i0 === undefined) l.userData.i0 = l.intensity;
    l.intensity = k === r ? 0 : l.userData.i0;
    if (k === r) { shadowLamp.color.copy(l.color); shadowLamp.distance = l.distance; shadowLamp.decay = l.decay; shadowLamp.position.copy(l.position); }
  });
  shadowLamp.intensity = refs.lamps?.[r] ? refs.lamps[r].userData.i0 : 0;
}
const shadowLamp = new THREE.PointLight(0xffffff, 0, 10, 1.4);
shadowLamp.castShadow = !lowPower;
shadowLamp.shadow.mapSize.set(1024, 1024); shadowLamp.shadow.bias = -0.002; shadowLamp.shadow.normalBias = 0.03; shadowLamp.shadow.radius = 5; shadowLamp.shadow.camera.near = 0.2;
scene.add(shadowLamp);

function focusPose(def) {
  const o = def.obj;
  tmpBox.setFromObject(o);
  if (tmpBox.isEmpty()) o.getWorldPosition(tmpV); else tmpBox.getCenter(tmpV);
  const center = tmpV.clone();
  const q = new THREE.Quaternion(); o.getWorldQuaternion(q);
  const off = new THREE.Vector3(...def.focus);
  // focus offsets are authored in the prop's local frame, relative to the prop's origin height
  const yOff = off.y; off.y = 0; off.applyQuaternion(q);
  const originY = new THREE.Vector3().setFromMatrixPosition(o.matrixWorld).y;
  const pos = new THREE.Vector3(center.x + off.x, originY + yOff, center.z + off.z);
  const look = lookAngles(pos, center);
  return { pos, yaw: look.yaw, pitch: look.pitch, fov: Math.min(75, baseFov() - 10) };
}
let focusedDef = null;
async function focusOn(def) {
  if (!def.focus) return;
  if (mode === "focus" && focusedDef === def) return;
  mode = "travel";
  await flyTo(focusPose(def), 0.9);
  mode = "focus"; focusedDef = def;
}
function backToView() {
  focusedDef = null;
  if (mode === "drawer") { flyTo(drawerPose(), 0.6); return; }
  if (mode === "map") return;
  mode = "travel";
  flyTo(roomView(room), 0.8).then(() => { mode = "room"; });
}

// ---------------------------------------------------------------- the junk drawer
function drawerPose() {
  const d = refs.drawer.group.parent;
  const center = d.localToWorld(new THREE.Vector3(0, 0.62, 0.62));
  const aspect = window.innerWidth / window.innerHeight, vfov = 52 * Math.PI / 180;
  const hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspect);
  const dist = Math.max(1.05, 0.95 / Math.tan(hfov / 2));
  const dir = new THREE.Vector3(-0.32, 0.95, 0).normalize();
  // on wide screens the drawer list covers the right edge: slide the view so the drawer sits left of it
  if (window.innerWidth > 720) {
    const visibleW = 2 * dist * Math.tan(hfov / 2);
    center.z += (236 / window.innerWidth) * visibleW / 2;
  }
  const pos = center.clone().addScaledVector(dir, dist);
  const a = lookAngles(pos, center);
  return { pos, yaw: a.yaw, pitch: a.pitch, fov: 52 };
}
async function openDrawer() {
  if (room !== "kitchen") await travelTo("kitchen");
  refs.drawer.target = 1; sfx.drawer();
  mode = "travel"; await flyTo(drawerPose(), 0.9); mode = "drawer";
  $("#drawerPanel").hidden = false;
  UI.setDefaultStatus("The junk drawer: 21 little web tools. Click one to try it. (Click outside the drawer or press Esc to close.)");
}
function closeDrawerQuiet() { refs.drawer.target = 0; $("#drawerPanel").hidden = true; }
async function closeDrawer() {
  closeDrawerQuiet(); sfx.drawer();
  mode = "travel"; await flyTo(roomView("kitchen"), 0.8); mode = "room"; onRoomChanged();
}

// ---------------------------------------------------------------- map view (Navigator's house map)
const mapLabels = {};
function buildMapLabels() {
  const host = $("#mapLabels");
  Object.entries(ROOMS).forEach(([k, r]) => {
    if (k === "kidspace") return;
    const b = document.createElement("button"); b.className = "maplabel"; b.textContent = r.name;
    b.addEventListener("click", () => exitMap(k)); host.appendChild(b); mapLabels[k] = b;
  });
}
const roomCenters = { living: [0, 0, 0], kitchen: [10, 0, 0], den: [-10, 0, 0], rec: [0, 0, -10] };
async function enterMap() {
  if (mode === "travel" || mode === "map" || mode === "boot") return;
  dismissWindow(); if (mode === "drawer") closeDrawerQuiet();
  mode = "travel"; sfx.whoosh(); clearHover(); UI.tooltip(null);
  refs.ceilings.forEach(c => (c.visible = false));
  const pos = new THREE.Vector3(6, 24, 20), a = lookAngles(pos, new THREE.Vector3(0, 0, -3));
  await flyTo({ pos, yaw: a.yaw, pitch: a.pitch, fov: 50 }, 1.4);
  mode = "map"; $("#mapLabels").hidden = false;
  UI.setRoomTitle("Map"); UI.setDefaultStatus("The whole house. Hover a room and click to go there.");
}
async function exitMap(target) {
  if (mode !== "map" || !isRoom(target)) return;
  $("#mapLabels").hidden = true; mode = "travel"; sfx.whoosh(); clearMapHover();
  const v = roomView(target);
  await flyTo({ pos: v.pos.clone().add(new THREE.Vector3(0, 6, 0)), yaw: v.yaw, pitch: -1.1, fov: 55 }, 1.2);
  refs.ceilings.forEach(c => (c.visible = true));
  await flyTo(v, 0.8);
  room = target; mode = "room"; onRoomChanged();
}
let mapHover = null;
function clearMapHover() { if (mapHover) { refs.roomFloors[mapHover].material.emissive.setHex(0); mapHover = null; } Object.values(mapLabels).forEach(l => l.classList.remove("hot")); }
function setMapHover(r) {
  if (r === mapHover) return; clearMapHover();
  if (r) { mapHover = r; refs.roomFloors[r].material.emissive.setHex(0x6a4a10); mapLabels[r].classList.add("hot"); UI.setStatus(ROOMS[r].blurb); sfx.hover(); }
  else UI.setStatus();
}

// ---------------------------------------------------------------- picking + hover
const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
let hovered = null;
function visibleChain(o) { while (o) { if (!o.visible) return false; o = o.parent; } return true; }
function activeDef(def) {
  if (def.inDrawer && mode !== "drawer") return false;
  if (def.hidden && !def.obj.visible) return false;
  if (mode === "drawer" && !def.inDrawer && def.id !== "drawer") return false;
  if (!def.door && def.room !== room) return false;
  return true;
}
function pick(x, y) {
  ndc.set((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
  const hits = raycaster.intersectObjects(scene.children, true);
  for (const h of hits) {
    if (!visibleChain(h.object)) continue;
    let o = h.object, found = null;
    while (o) { if (o.userData.hot && activeDef(o.userData.hot)) { found = o; break; } o = o.parent; }
    if (found) return found;
    const m = h.object.material;
    if (m && m.transparent && m.opacity < 0.35) continue; // look through glass
    if (h.object.geometry && h.object.geometry.type === "SphereGeometry" && h.distance > 100) continue; // sky
    return null;
  }
  return null;
}
function highlight(obj, on) {
  const def = obj.userData.hot;
  if (def.onHover) def.onHover(on);
  const walk = o => {
    if (o !== obj && o.userData.hot) return;
    if (o.isMesh && !o.userData.keepMat && o.material && o.material.emissive) {
      const m = o.material;
      if (!m.userData.e0) m.userData.e0 = { c: m.emissive.getHex(), i: m.emissiveIntensity };
      if (on) { m.emissive.setHex(0x7a5418); m.emissiveIntensity = 0.7; } else { m.emissive.setHex(m.userData.e0.c); m.emissiveIntensity = m.userData.e0.i; }
    }
    o.children.forEach(walk);
  };
  walk(obj);
}
function clearHover() { if (hovered) { highlight(hovered, false); hovered = null; } canvas.style.cursor = ""; }
function setHover(obj, x, y) {
  if (obj && mode === "drawer" && obj.userData.hot.id === "drawer") obj = null;
  if (obj !== hovered) {
    clearHover(); hovered = obj;
    if (obj) { highlight(obj, true); sfx.hover(); }
  }
  if (obj) {
    const d = obj.userData.hot; canvas.style.cursor = "pointer";
    UI.tooltip(d.label, x, y); UI.setStatus(d.desc);
  } else { UI.tooltip(null); UI.setStatus(); }
}

// ---------------------------------------------------------------- input (drag to look, click to act)
let down = null, lastMove = null, pinch = null, pickDirty = true;
const pointers = new Map();
canvas.addEventListener("pointerdown", e => {
  sfx.unlock();
  canvas.setPointerCapture(e.pointerId);
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pointers.size === 2) { const [a, b] = [...pointers.values()]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), fov: cam.fov }; down = null; return; }
  down = { x: e.clientX, y: e.clientY, yaw: cam.yaw, pitch: cam.pitch, moved: false };
});
canvas.addEventListener("pointermove", e => {
  if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pinch && pointers.size === 2) {
    const [a, b] = [...pointers.values()], d = Math.hypot(a.x - b.x, a.y - b.y);
    cam.fov = THREE.MathUtils.clamp(pinch.fov * pinch.d / d, 30, 85); return;
  }
  lastMove = { x: e.clientX, y: e.clientY }; pickDirty = true;
  if (down) {
    const dx = e.clientX - down.x, dy = e.clientY - down.y;
    if (Math.abs(dx) + Math.abs(dy) > 6) down.moved = true;
    if (down.moved && (mode === "room" || mode === "focus" || mode === "drawer")) {
      const k = 0.0042 * (cam.fov / 60);
      cam.yaw = down.yaw + dx * k;
      cam.pitch = THREE.MathUtils.clamp(down.pitch + dy * k, -1.35, 0.7);
      UI.tooltip(null);
    }
  }
});
canvas.addEventListener("pointerup", e => {
  pointers.delete(e.pointerId); if (pointers.size < 2) pinch = null;
  if (!down) return;
  const wasClick = !down.moved; down = null;
  if (!wasClick) return;
  if (mode === "map") { const r = mapRoomAt(e.clientX, e.clientY); if (r) exitMap(r); return; }
  if (mode === "travel" || mode === "boot") return;
  const obj = pick(e.clientX, e.clientY);
  if (mode === "drawer") {
    if (!obj) closeDrawer();
    else if (obj.userData.hot.id !== "drawer") activate(obj.userData.hot);
    return;
  }
  if (obj) activate(obj.userData.hot);
  else if (mode === "focus") backToView();
});
const endPointer = e => { pointers.delete(e.pointerId); if (pointers.size < 2) pinch = null; down = null; };
canvas.addEventListener("pointercancel", endPointer);
canvas.addEventListener("lostpointercapture", e => { if (pointers.has(e.pointerId)) endPointer(e); });
canvas.addEventListener("pointerleave", () => { if (!down) { clearHover(); UI.tooltip(null); UI.setStatus(); } });
canvas.addEventListener("wheel", e => { e.preventDefault(); cam.fov = THREE.MathUtils.clamp(cam.fov + e.deltaY * 0.03, 30, 85); }, { passive: false });

function mapRoomAt(x, y) {
  ndc.set((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
  const hit = raycaster.intersectObjects(Object.values(refs.roomFloors), false)[0];
  if (!hit) return null;
  return Object.keys(refs.roomFloors).find(k => refs.roomFloors[k] === hit.object);
}

window.addEventListener("keydown", e => {
  if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
  if (mode === "boot") return;
  if (e.key === "Escape") {
    if (UI.isWindowOpen()) UI.closeWindow();
    else if (mode === "drawer") closeDrawer();
    else if (mode === "map") exitMap(room);
    else if (mode === "focus") backToView();
    return;
  }
  if (UI.isWindowOpen()) return;
  if (["1", "2", "3", "4", "5"].includes(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
    const r = ["living", "kitchen", "den", "rec", "kidspace"][+e.key - 1];
    if (mode === "map") exitMap(r); else { if (mode === "focus") mode = "room"; travelTo(r); } return;
  }
  const step = 0.12;
  if (e.key === "ArrowLeft") cam.yaw += step;
  else if (e.key === "ArrowRight") cam.yaw -= step;
  else if (e.key === "ArrowUp") cam.pitch = Math.min(0.7, cam.pitch + step);
  else if (e.key === "ArrowDown") cam.pitch = Math.max(-1.35, cam.pitch - step);
});

// ---------------------------------------------------------------- actions
async function activate(def) {
  sfx.click(); UI.tooltip(null);
  const a = def.action;
  clearHover();
  switch (a.type) {
    case "room": return travelTo(a.room);
    case "drawer": return mode === "drawer" ? closeDrawer() : openDrawer();
    case "toolbox":
      return UI.openWindow({ title: a.title + " — toolbox/" + a.id, url: "toolbox.html?embed=1#" + a.id, icon: "🧰", onClose: backToView });
    case "app":
      await focusOn(def);
      return UI.openWindow({ ...UI.panels.app(a.app), onClose: backToView });
    case "url":
      await focusOn(def);
      return UI.openWindow({ title: a.title, url: a.url, icon: "🕹️", onClose: backToView });
    case "pc":
      await focusOn(def);
      return UI.openWindow({ title: "Classic Terminal — dominic@home", url: "terminal.html", icon: "🖥️", onClose: backToView });
    case "slogan": {
      await focusOn(def);
      const s = screens.newSlogan(); UI.toast("“" + s + "”"); sfx.coin();
      return;
    }
    case "cat":
      a.i === 1 ? sfx.purr() : sfx.meow(); UI.toast(def.label + ": " + def.desc, 2200); return;
    case "symbols": {
      await focusOn(def);
      const n = screens.symbolClick(); sfx.coin();
      if (n >= 10) {
        arg.symbolsDone();
      } else UI.setStatus(n + " / 10");
      return;
    }
    case "khajiit": {
      await focusOn(def);
      arg.metMerchant();
      const body = UI.openWindow({ ...UI.panels.khajiit(), onClose: backToView });
      body.querySelector("#kjWares").addEventListener("click", () => { sfx.coin(); UI.openWindow({ title: "Wares: Elder Scrolls Blades guide", url: "toolbox.html?embed=1#elderscrolls", icon: "💰", onClose: backToView }); });
      return;
    }
    case "custom": return a.fn();
    case "panel":
      if (def.id === "tv" && screens.state.tvMode === "clue") {
        await focusOn(def); sfx.static();
        return UI.openWindow({ title: "Channel 3 — ▓▒░ signal interrupted ░▒▓", icon: "📺", onClose: backToView,
          html: `<div class="tvclue"><p>${UI.esc(screens.state.tvMsg)}</p></div>` });
      }
      return openPanel(a.panel, def);
  }
}

async function openPanel(name, def) {
  if (def) await focusOn(def);
  let p;
  if (name === "family") p = UI.panels.family(UI.portraitDataURL(refs.portraitCanvas));
  else if (name === "directory") p = UI.panels.directory(hotspots);
  else p = UI.panels[name]();
  const body = UI.openWindow({ ...p, onClose: def ? backToView : null });
  if (name === "leviathan") arg.readBook();
  if (name === "phone") wirePhone(body);
  if (name === "directory") wireDirectory(body);
  body.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => { dismissWindow(); travelTo(b.dataset.go); }));
}

function wireDirectory(body) {
  body.querySelectorAll("[data-hot]").forEach(b => b.addEventListener("click", async () => {
    const obj = hotspots.find(h => h.userData.hot.id === b.dataset.hot); if (!obj) return;
    const def = obj.userData.hot;
    dismissWindow();
    if (def.inDrawer) { await openDrawer(); return activate(def); }
    if (def.room !== room || mode === "map") { if (mode === "map") await exitMap(def.room); else await travelTo(def.room); }
    activate(def);
  }));
}

function wirePhone(body) {
  const disp = body.querySelector("#phDisplay");
  let digits = "";
  const show = () => { disp.textContent = digits || "Dial a number…"; };
  body.querySelectorAll(".pkey").forEach(k => k.addEventListener("click", () => {
    digits += k.dataset.k; sfx.dial(Math.max(1, (+k.dataset.k || 10))); show();
  }));
  body.querySelector("#phClear").addEventListener("click", () => { digits = ""; show(); sfx.click(); });
  body.querySelector("#phCall").addEventListener("click", () => {
    if (!digits) return;
    sfx.ring();
    setTimeout(() => {
      if (arg.dialed(digits)) { disp.textContent = "…click. Somewhere in the house, a television turns on."; }
      else if (digits.replace(/\D/g, "") === "8675309") disp.textContent = "Jenny? …Jenny? (She doesn't live here anymore.)";
      else if (digits === "0") disp.textContent = "Operator: “This house only answers to curiosity.”";
      else disp.textContent = "The number you have dialed is not in service. Please hang up and try again.";
      digits = "";
    }, 1700);
  });
}

kid.activate = (action, obj) => activate({ action, label: "", obj, focus: null });

// ---------------------------------------------------------------- ARG hooks
const arg = createARG({
  onSpoken() {
    screens.tvClue("You decide to click the symbols.");
    sfx.static(); flicker();
    UI.toast("📺 Somewhere in the house, a television switches itself on…");
    setTimeout(() => screens.tvNormal(), 60000);
  },
  onStep(step) {
    updateJournalBadge();
    if (step === 1) UI.toast("📓 Something went into your journal.");
    if (step === 3) { flicker(); revealKhajiit(); UI.toast("✨ The symbols blaze green. Something rustles by the living-room fireplace…", 5000); sfx.secret(); }
    if (step === 4) { sfx.secret(); UI.toast("🏆 You solved the Curiosity Protocol!", 4500); }
  },
  onReset() { refs.khajiit.visible = false; refs.khajiit.userData.hot.revealed = false; screens.symbolsReset(); screens.tvNormal(); updateJournalBadge(); }
});
function revealKhajiit() { refs.khajiit.visible = true; refs.khajiit.userData.hot.revealed = true; }
if (arg.step >= 3) revealKhajiit();

let flickerUntil = 0;
function flicker() { flickerUntil = performance.now() + 1200; }

function updateJournalBadge() {
  const b = $("#journalBtn"); b.dataset.count = arg.step >= 4 ? "★" : String(arg.journal().length);
}
function openJournal() {
  const items = arg.journal();
  UI.openWindow({
    title: "Journal", icon: "📓",
    html: `<div class="journal"><p class="hint">Curious things you've noticed. (${Math.min(arg.step, 4)} of 4 solved)</p>
      <ol>${items.map(j => `<li>${UI.esc(j.text)}</li>`).join("")}</ol>
      ${arg.step >= 4 ? `<p class="btns"><button class="nbtn" id="argReset">Forget everything & start over</button></p>` : ""}</div>`
  });
  const r = $("#argReset"); if (r) r.addEventListener("click", () => { arg.reset(); UI.closeWindow(); UI.toast("The house forgets. Everything is… ordinary again."); });
}

// ---------------------------------------------------------------- chrome wiring
document.querySelectorAll("[data-exit]").forEach(a => a.addEventListener("click", e => {
  if (EMBEDDED) { e.preventDefault(); window.parent.postMessage({ type: "win95:close" }, location.origin); }
}));
UI.initChrome();
buildMapLabels();
document.querySelectorAll("[data-room]").forEach(b => b.addEventListener("click", () => { sfx.click(); dismissWindow(); if (mode === "map") exitMap(b.dataset.room); else travelTo(b.dataset.room); }));
$("#mapBtn").addEventListener("click", () => { sfx.click(); mode === "map" ? exitMap(room) : enterMap(); });
$("#journalBtn").addEventListener("click", () => { sfx.click(); openJournal(); });
$("#helpBtn").addEventListener("click", () => { sfx.click(); openPanel("help"); });
$("#infoBtn").addEventListener("click", () => { sfx.click(); openPanel("help"); });
$("#menuBtn").addEventListener("click", () => { sfx.click(); openPanel("directory"); });
const soundBtn = $("#soundBtn");
const syncSound = () => { soundBtn.textContent = isMuted() ? "🔇" : "🔊"; soundBtn.setAttribute("aria-label", isMuted() ? "Unmute sound" : "Mute sound"); };
soundBtn.addEventListener("click", () => { setMuted(!isMuted()); syncSound(); sfx.click(); }); syncSound();
$("#drawerList").innerHTML = UI.panels.drawerList();
$("#drawerList").addEventListener("click", e => {
  const b = e.target.closest("[data-tk]"); if (!b) return;
  const t = TRINKETS.find(x => x.id === b.dataset.tk);
  activate({ action: { type: "toolbox", id: t.id, title: t.name } });
});
$("#drawerClose").addEventListener("click", () => closeDrawer());
updateJournalBadge();

// ---------------------------------------------------------------- resize + loop
// MSAA on the composer's target keeps edges smooth (the canvas's own antialias doesn't apply to post-processing)
const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, { samples: lowPower ? 0 : 4, type: THREE.HalfFloatType }));
composer.addPass(new RenderPass(scene, camera));
// ground-truth ambient occlusion: soft contact shading in corners, under furniture and between props
const gtao = lowPower ? null : new GTAOPass(scene, camera, 1, 1);
if (gtao) {
  gtao.updateGtaoMaterial({ radius: 0.45, distanceExponent: 1.6, thickness: 1.2, scale: 1.15, samples: 8, distanceFallOff: 1, screenSpaceRadius: false });
  gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 8 });
  gtao.blendIntensity = 0.9;
  composer.addPass(gtao);
}
const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.3, 0.5, 1.1);
composer.addPass(bloom);
composer.addPass(new OutputPass());
function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h, false); composer.setPixelRatio(renderer.getPixelRatio()); composer.setSize(w, h);
  if (gtao) gtao.setSize(Math.round(w * renderer.getPixelRatio() * 0.5), Math.round(h * renderer.getPixelRatio() * 0.5));
  camera.aspect = w / h; camera.updateProjectionMatrix();
}
window.addEventListener("resize", resize); resize();
Object.assign(window.__nav, { renderer, composer, gtao, bloom, shadowLamp });

const clock = new THREE.Clock();
// adaptive quality: if the frame rate sags, shed the most expensive extras one at a time (never adds back)
const quality = { level: 0, frames: 0, since: performance.now(), grace: Infinity }; // armed once everything has loaded
window.__nav.quality = quality;
function governQuality() {
  quality.frames++;
  const now = performance.now(), span = now - quality.since;
  if (span < 2000) return;
  const fps = quality.frames * 1000 / span; quality.frames = 0; quality.since = now;
  if (document.hidden || now < quality.grace || mode === "boot" || mode === "travel" || fps >= 32) return;
  quality.level++; quality.grace = now + 2500;
  if (quality.level === 1 && gtao) gtao.enabled = false;
  else if (quality.level === 2 && shadowLamp.castShadow) { shadowLamp.castShadow = false; scene.traverse(o => o.material && [].concat(o.material).forEach(m => (m.needsUpdate = true))); }
  else if (quality.level === 3) { renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75) * 0.75); resize(); }
}
const baseExposure = renderer.toneMappingExposure;
function frame() {
  const dt = Math.min(0.05, clock.getDelta()), t = clock.elapsedTime;
  if (tweening) {
    const tw = tweening; tw.t += dt / tw.dur; const k = ease(Math.min(1, tw.t));
    cam.pos.lerpVectors(tw.from.pos, tw.to.pos, k);
    cam.yaw = angleLerp(tw.from.yaw, tw.to.yaw, k);
    cam.pitch = tw.from.pitch + (tw.to.pitch - tw.from.pitch) * k;
    cam.fov = tw.from.fov + (tw.to.fov - tw.from.fov) * k;
    if (tw.t >= 1) { tweening = null; tw.resolve(); }
  }
  world.updaters.forEach(u => u(t, dt));
  screens.tick(t);
  if (performance.now() < flickerUntil) renderer.toneMappingExposure = baseExposure * (Math.random() < 0.35 ? 0.35 : 1);
  else renderer.toneMappingExposure = baseExposure;
  if (lastMove && !down && (pickDirty || tweening || mode === "drawer") && (mode === "room" || mode === "focus" || mode === "drawer") && !UI.isWindowOpen()) { pickDirty = false; setHover(pick(lastMove.x, lastMove.y), lastMove.x, lastMove.y); }
  if (mode === "map") {
    if (lastMove) setMapHover(mapRoomAt(lastMove.x, lastMove.y));
    Object.entries(roomCenters).forEach(([k, c]) => {
      const v = new THREE.Vector3(c[0], 3.6, c[2]).project(camera);
      mapLabels[k].style.transform = `translate(-50%,-50%) translate(${(v.x * 0.5 + 0.5) * window.innerWidth}px, ${(-v.y * 0.5 + 0.5) * window.innerHeight}px)`;
    });
  }
  applyCam();
  cullRooms();
  bloom.strength = room === "kidspace" ? 0.8 : 0.28; bloom.threshold = room === "kidspace" ? 0.97 : 1.15;
  kid.updateBubble(camera, room === "kidspace" && mode !== "travel" && mode !== "map" && !UI.isWindowOpen());
  composer.render();
  governQuality();
  requestAnimationFrame(frame);
}
applyCam();
requestAnimationFrame(frame);

// ---------------------------------------------------------------- boot sequence
const boot = $("#boot");
const startRoom = (location.hash || "").replace("#", "");
function setBoot(stage) { boot.dataset.stage = stage; }
async function bootSequence() {
  const quick = sessionStorage.getItem("nav.booted") === "1" || reduceMotion;
  setBoot("splash"); const bar = $("#bootBar");
  let done = false; Promise.race([furnished.living, wait(8000)]).then(() => (done = true));
  for (let i = 0; i <= 20; i++) {
    bar.style.width = i * 5 + "%";
    await wait(quick ? 5 : 45);
    while (i === 17 && !done) { $("#bootStatus").textContent = "Arranging the furniture…"; await wait(100); }
  }
  $("#bootStatus").textContent = "Ready.";
  setBoot("ready"); $("#enterBtn").focus();
}
function wait(ms) { return new Promise(r => setTimeout(r, ms)); }
$("#enterBtn").addEventListener("click", enterHouse);
$("#skipBtn").addEventListener("click", enterHouse);
async function enterHouse() {
  if (mode !== "boot") return;
  sessionStorage.setItem("nav.booted", "1");
  sfx.unlock(); sfx.startup();
  boot.classList.add("gone"); setTimeout(() => (boot.hidden = true), 700);
  document.body.classList.add("in-house");
  mode = "travel";
  const fd = refs.frontDoor;
  await flyTo({ pos: new THREE.Vector3(0, 1.75, 9.5), yaw: 0, pitch: -0.02, fov: 60 }, 1.6);
  if (fd) { const s = performance.now(); await new Promise(r => { const f = () => { const k = Math.min(1, (performance.now() - s) / 600); fd.rotation.y = Math.PI - k * 1.5; k < 1 ? requestAnimationFrame(f) : r(); }; f(); }); }
  await flyTo({ pos: new THREE.Vector3(0, 1.68, 6.4), yaw: 0, pitch: -0.05, fov: 60 }, 0.9);
  await flyTo(roomView("living"), 0.7);
  if (fd) fd.rotation.y = Math.PI;
  room = "living"; mode = "room"; onRoomChanged();
  if (isRoom(startRoom) && startRoom !== "living") travelTo(startRoom);
  window.addEventListener("hashchange", () => { const r = location.hash.slice(1); if (isRoom(r) && r !== room && mode !== "boot") { dismissWindow(); if (mode === "map") exitMap(r); else travelTo(r); } });
  if (!localStorage.getItem("nav.hinted")) { localStorage.setItem("nav.hinted", "1"); setTimeout(() => UI.toast("Drag to look around · hover to explore · click anything", 5000), 600); }
}
bootSequence();
