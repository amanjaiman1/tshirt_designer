import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Shirt } from "./Shirt";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/**
 * Drives continuous frames ONLY while idle-rotating (DESIGN.md §6 + ARCHITECTURE
 * §7). With frameloop="demand" the canvas is otherwise static; drei's
 * OrbitControls still invalidate on user interaction. Auto-rotation pauses when
 * the tab is hidden.
 */
function FrameDriver({ enabled }: { enabled: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let hidden = document.hidden;
    const onVis = () => {
      hidden = document.hidden;
      if (!hidden) loop();
    };
    const loop = () => {
      if (hidden) return;
      invalidate();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [enabled, invalidate]);
  return null;
}

interface SceneProps {
  color: string;
  className?: string;
}

/**
 * The 3D stage: studio lighting, soft contact shadow, orbit controls, capped DPR
 * and a demand frameloop. Auto-rotate engages only when the canvas is on screen
 * and the user hasn't requested reduced motion.
 */
export function Scene({ color, className }: SceneProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.05,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const autoRotate = inView && !reduced;

  return (
    <div ref={wrapRef} className={className}>
      <Canvas
        frameloop="demand"
        dpr={[1, 2]}
        shadows
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
        camera={{ position: [0, 0.15, 3.6], fov: 34 }}
      >
        <FrameDriver enabled={autoRotate} />

        {/* Studio three-point lighting (DESIGN.md §7) — no network HDR. */}
        <ambientLight intensity={0.55} />
        <directionalLight
          position={[3.5, 5, 3]}
          intensity={2.1}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0002}
        />
        <directionalLight position={[-4, 2.5, -3]} intensity={0.9} color="#9f8cff" />
        <directionalLight position={[0, 1, -4]} intensity={0.6} color="#ffffff" />

        <Suspense fallback={null}>
          <Shirt color={color} autoRotate={autoRotate} />
          <ContactShadows
            position={[0, -1.3, 0]}
            opacity={0.35}
            scale={9}
            blur={2.6}
            far={4}
            resolution={512}
            color="#0E0E0F"
          />
        </Suspense>

        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 2 - 0.55}
          maxPolarAngle={Math.PI / 2 + 0.35}
          rotateSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}

export default Scene;
