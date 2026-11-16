// =====================================================================
//  assets.js — loads the CC0 Poly Haven models (assets/models/<id>/) and
//  textures (assets/textures/<id>/), with caching and simple placement.
// =====================================================================
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const BASE = new URL("../assets/", import.meta.url).href;
const loader = new GLTFLoader();
const texLoader = new THREE.TextureLoader();
const modelCache = new Map();
const texCache = new Map();
let anisotropy = 4;
export function setAnisotropy(a) { anisotropy = a; }

export function loadModel(id) {
  if (!modelCache.has(id)) {
    modelCache.set(id, loader.loadAsync(`${BASE}models/${id}/${id}_1k.gltf`).then(g => {
      g.scene.traverse(o => {
        if (o.isMesh) {
          o.castShadow = true; o.receiveShadow = true;
          const ms = Array.isArray(o.material) ? o.material : [o.material];
          ms.forEach(m => { if (m.map) m.map.anisotropy = anisotropy; m.envMapIntensity = 0.6; });
        }
      });
      return g.scene;
    }));
  }
  return modelCache.get(id);
}

/**
 * Place a model. Options:
 *  pos [x,y,z]; rotY radians; one of height | width | depth | scale (meters);
 *  parent (Object3D); onFloor (default true: bottom of the model sits at pos.y)
 */
export async function place(id, o = {}) {
  const src = await loadModel(id);
  const m = src.clone(true);
  const box = new THREE.Box3().setFromObject(m), size = box.getSize(new THREE.Vector3());
  let s = o.scale || 1;
  if (o.height) s = o.height / size.y; else if (o.width) s = o.width / size.x; else if (o.depth) s = o.depth / size.z;
  m.scale.setScalar(s);
  const center = box.getCenter(new THREE.Vector3()).multiplyScalar(s);
  const g = new THREE.Group();
  m.position.set(-center.x, -(box.min.y * s), -center.z); // pivot = bottom-center
  g.add(m);
  if (o.pos) g.position.set(...o.pos);
  if (o.rotY) g.rotation.y = o.rotY;
  if (o.tint) m.traverse(x => { if (x.isMesh) { x.material = x.material.clone(); x.material.color.multiply(new THREE.Color(o.tint)); } });
  (o.parent || null)?.add(g);
  g.userData.size = size.clone().multiplyScalar(s);
  return g;
}

/** A tiling PBR material from assets/textures/<id>/ (diff, nor, arm). */
export function pbr(id, { repeat = [1, 1], color = 0xffffff, roughness = 1, metalness = 0, normalScale = 1, physical = null } = {}) {
  const load = (f, srgb) => {
    const key = id + f + repeat.join("x");
    if (!texCache.has(key)) {
      const t = texLoader.load(`${BASE}textures/${id}/${f}.jpg`);
      t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); t.anisotropy = anisotropy;
      if (srgb) t.colorSpace = THREE.SRGBColorSpace;
      texCache.set(key, t);
    }
    return texCache.get(key);
  };
  const arm = load("arm", false);
  const params = {
    color, map: load("diff", true), normalMap: load("nor", false), normalScale: new THREE.Vector2(normalScale, normalScale),
    roughnessMap: arm, metalnessMap: arm, aoMap: arm, roughness, metalness
  };
  return physical ? new THREE.MeshPhysicalMaterial({ ...params, ...physical }) : new THREE.MeshStandardMaterial(params);
}

/** Soft fake contact shadow under furniture (cheap and very effective). */
let blobTex = null;
export function contactShadow(parent, w, d, opacity = 0.45, y = 0.006) {
  if (!blobTex) {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const g = c.getContext("2d"), gr = g.createRadialGradient(64, 64, 8, 64, 64, 64);
    gr.addColorStop(0, "rgba(0,0,0,1)"); gr.addColorStop(0.6, "rgba(0,0,0,.45)"); gr.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128); blobTex = new THREE.CanvasTexture(c);
  }
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, opacity, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.position.y = y; m.renderOrder = 1; m.userData.keepMat = true;
  parent.add(m); return m;
}
