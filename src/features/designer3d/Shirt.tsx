import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Warm the cache so the model is ready the moment the 3D chunk loads.
useGLTF.preload("/models/shirt.glb");

interface ShirtProps {
  color: string;
  autoRotate: boolean;
}

/**
 * Loads the garment GLB, normalises its transform (auto-centres + scales to fit
 * any model), clones materials so colour is per-instance, and gently idles.
 * Rotation only advances when `autoRotate` is true (driven by viewport + motion
 * preference in <Scene/>), keeping the demand frameloop honest.
 */
export function Shirt({ color, autoRotate }: ShirtProps) {
  const outer = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/shirt.glb");

  const { object, offset, scale } = useMemo(() => {
    const obj = scene.clone(true);
    obj.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = false;
        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((m) => m.clone());
        } else if (mesh.material) {
          mesh.material = (mesh.material as THREE.Material).clone();
        }
      }
    });

    const box = new THREE.Box3().setFromObject(obj);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const fit = 2.4 / maxDim;
    return {
      object: obj,
      offset: center.multiplyScalar(fit),
      scale: fit,
    };
  }, [scene]);

  useEffect(() => {
    const c = new THREE.Color(color);
    object.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (mesh.isMesh) {
        const apply = (m: THREE.Material) => {
          const std = m as THREE.MeshStandardMaterial;
          if (std.color) std.color.copy(c);
          std.roughness = 0.82;
          std.metalness = 0.0;
          std.needsUpdate = true;
        };
        if (Array.isArray(mesh.material)) mesh.material.forEach(apply);
        else if (mesh.material) apply(mesh.material);
      }
    });
  }, [object, color]);

  useFrame((_, delta) => {
    if (autoRotate && outer.current) {
      outer.current.rotation.y += delta * 0.28;
    }
  });

  return (
    <group ref={outer} dispose={null}>
      <group position={[-offset.x, -offset.y, -offset.z]} scale={scale}>
        <primitive object={object} />
      </group>
    </group>
  );
}
