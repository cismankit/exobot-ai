"use client";

/**
 * The Exobod head — a stylized phone-in-frame body rendered with R3F.
 *
 * It VISUALIZES pose; it never decides it. `pan`/`tilt` come verbatim from
 * ReflexCore acks over the console socket. On `clampPulse` the neck ring
 * flashes amber (the constitution asserting itself); on `estop` the whole
 * body goes rigid and red until the (physical) button resets it.
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, RoundedBox } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const SIGNAL = new THREE.Color("#3df5a0");
const DANGER = new THREE.Color("#ff5a47");
const DARK = new THREE.Color("#16191f");

interface HeadProps {
  pan: number; // degrees, -80..80
  tilt: number; // degrees, -30..45
  estop: boolean;
  clampPulse: number;
  thinking: boolean;
  /** 0..1 — hero scroll scrub: phone flies in and docks into the frame */
  scrub?: number;
}

function ExobodHead({ pan, tilt, estop, clampPulse, thinking, scrub }: HeadProps) {
  const neck = useRef<THREE.Group>(null);
  const skull = useRef<THREE.Group>(null);
  const phone = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const eyeL = useRef<THREE.Mesh>(null);
  const eyeR = useRef<THREE.Mesh>(null);
  const flash = useRef(0);
  const lastPulse = useRef(clampPulse);

  useEffect(() => {
    if (clampPulse !== lastPulse.current) {
      lastPulse.current = clampPulse;
      flash.current = 1;
    }
  }, [clampPulse]);

  useFrame((state, dt) => {
    const lerp = estop ? 1 : 1 - Math.exp(-6 * dt); // estop: snap rigid
    if (neck.current) {
      neck.current.rotation.y = THREE.MathUtils.lerp(
        neck.current.rotation.y,
        THREE.MathUtils.degToRad(-pan), // screen-left = body's left
        lerp,
      );
    }
    if (skull.current) {
      skull.current.rotation.x = THREE.MathUtils.lerp(
        skull.current.rotation.x,
        THREE.MathUtils.degToRad(-tilt),
        lerp,
      );
      // idle breath — dead still under estop
      const t = state.clock.elapsedTime;
      skull.current.position.y = estop ? 1.05 : 1.05 + Math.sin(t * 1.4) * 0.015;
    }
    // scroll scrub: the phone approaches and docks
    if (phone.current) {
      const s = scrub ?? 1;
      const docked = THREE.MathUtils.smoothstep(s, 0.15, 0.65);
      phone.current.position.z = THREE.MathUtils.lerp(4.2, 0.34, docked);
      phone.current.position.y = THREE.MathUtils.lerp(2.4, 0, docked);
      phone.current.rotation.x = THREE.MathUtils.lerp(-0.9, 0, docked);
    }
    // ring: signal by default, amber flash on clamp, hard red on estop
    if (ring.current) {
      const m = ring.current.material as THREE.MeshStandardMaterial;
      flash.current = Math.max(0, flash.current - dt * 1.8);
      const target = estop
        ? DANGER
        : flash.current > 0
          ? DANGER
          : SIGNAL;
      m.emissive.lerp(target, 0.25);
      m.emissiveIntensity = estop
        ? 2.2
        : 0.8 + flash.current * 2.5 + (thinking ? Math.sin(state.clock.elapsedTime * 8) * 0.3 + 0.3 : 0);
    }
    for (const eye of [eyeL.current, eyeR.current]) {
      if (eye) {
        const m = eye.material as THREE.MeshStandardMaterial;
        m.emissive.lerp(estop ? DANGER : SIGNAL, 0.2);
        m.emissiveIntensity = estop ? 1.6 : 1.2;
      }
    }
  });

  const frameMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: DARK,
        metalness: 0.85,
        roughness: 0.35,
      }),
    [],
  );

  return (
    <group position={[0, -0.9, 0]}>
      {/* base */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.85, 1.05, 0.28, 48]} />
        <primitive object={frameMat} attach="material" />
      </mesh>
      {/* neck — pan joint */}
      <group ref={neck}>
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.16, 0.22, 0.6, 24]} />
          <primitive object={frameMat} attach="material" />
        </mesh>
        {/* status ring at the pan joint */}
        <mesh ref={ring} position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.5, 0.035, 16, 64]} />
          <meshStandardMaterial
            color="#0a0b0d"
            emissive="#3df5a0"
            emissiveIntensity={0.8}
            metalness={0.5}
            roughness={0.4}
          />
        </mesh>
        {/* skull — tilt joint */}
        <group ref={skull} position={[0, 1.05, 0]}>
          <RoundedBox args={[1.5, 1.05, 0.72]} radius={0.16} smoothness={4}>
            <primitive object={frameMat} attach="material" />
          </RoundedBox>
          {/* the phone: the brain, docked as the face */}
          <group ref={phone} position={[0, 0, 0.34]}>
            <RoundedBox args={[1.16, 0.78, 0.06]} radius={0.05} smoothness={4}>
              <meshStandardMaterial
                color="#05070a"
                metalness={0.6}
                roughness={0.2}
              />
            </RoundedBox>
            {/* eyes on the screen */}
            <mesh ref={eyeL} position={[-0.28, 0.06, 0.035]}>
              <circleGeometry args={[0.11, 32]} />
              <meshStandardMaterial
                color="#0a0b0d"
                emissive="#3df5a0"
                emissiveIntensity={1.2}
              />
            </mesh>
            <mesh ref={eyeR} position={[0.28, 0.06, 0.035]}>
              <circleGeometry args={[0.11, 32]} />
              <meshStandardMaterial
                color="#0a0b0d"
                emissive="#3df5a0"
                emissiveIntensity={1.2}
              />
            </mesh>
          </group>
          {/* ears / servo housings */}
          <mesh position={[-0.82, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.14, 24]} />
            <primitive object={frameMat} attach="material" />
          </mesh>
          <mesh position={[0.82, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.14, 24]} />
            <primitive object={frameMat} attach="material" />
          </mesh>
        </group>
      </group>
      <ContactShadows
        position={[0, -0.14, 0]}
        opacity={0.55}
        blur={2.4}
        scale={6}
        color="#000000"
      />
    </group>
  );
}

export function HeadScene(props: HeadProps & { className?: string }) {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  return (
    <div className={props.className} aria-hidden>
      <Canvas
        camera={{ position: [0, 0.6, 4.4], fov: 38 }}
        dpr={[1, 1.75]}
        frameloop={reduced ? "demand" : "always"}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 5]} intensity={1.1} />
        <directionalLight position={[-4, 2, -3]} intensity={0.35} color="#3df5a0" />
        <ExobodHead {...props} scrub={reduced ? 1 : props.scrub} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
