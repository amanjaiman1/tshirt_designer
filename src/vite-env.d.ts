/// <reference types="vite/client" />

// GLB/GLTF imports (used by drei's useGLTF via URL strings; declared for safety).
declare module "*.glb" {
  const src: string;
  export default src;
}
declare module "*.gltf" {
  const src: string;
  export default src;
}
