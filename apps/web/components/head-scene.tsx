"use client";

/**
 * The Exobod exoskeleton — a full articulated body for the phone,
 * rendered with R3F: the phone docks as the face + CPU, the frame gives
 * it arms, a waist, and a stance.
 *
 * It VISUALIZES the body's real state; it never decides it. Pan/tilt,
 * gestures (wave/point/nod/shake), drive and estop all come verbatim
 * from ReflexCore acks over the console socket. On `clampPulse` the
 * status ring flashes amber (the constitution asserting itself); on
 * `estop` the whole body goes rigid and red until the physical button
 * releases it.
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, RoundedBox } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const SIGNAL = new THREE.Color("#3df5a0");
const DANGER = new THREE.Color("#ff5a47");

interface BodyProps {
  pan: number; // degrees, -80..80 — waist yaw
  tilt: number; // degrees, -30..45 — phone-dock pitch
  estop: boolean;
  clampPulse: number;
  thinking: boolean;
  /** executed gesture acks from the body — retriggers on n */
  gesture?: { name: string; n: number };
  /** drive the body accepted (already clamped): slow yaw + lean */
  drive?: { vx: number; wz: number };
  /** 0..1 — hero scroll scrub: the phone flies in and docks as the face */
  scrub?: number;
}

const GESTURE_DURATION: Record<string, number> = {
  wave: 2.0,
  point: 1.8,
  nod: 1.2,
  shake: 1.2,
};

function Exoskeleton({
  pan,
  tilt,
  estop,
  clampPulse,
  thinking,
  gesture,
  drive,
  scrub,
}: BodyProps) {
  const root = useRef<THREE.Group>(null);
  const waist = useRef<THREE.Group>(null);
  const dock = useRef<THREE.Group>(null);
  const phone = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const forearmR = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const eyeL = useRef<THREE.Mesh>(null);
  const eyeR = useRef<THREE.Mesh>(null);
  const mouth = useRef<THREE.Mesh>(null);

  const flash = useRef(0);
  const lastPulse = useRef(clampPulse);
  const gestureAnim = useRef<{ name: string; start: number } | null>(null);
  const lastGestureN = useRef(gesture?.n ?? 0);

  useEffect(() => {
    if (clampPulse !== lastPulse.current) {
      lastPulse.current = clampPulse;
      flash.current = 1;
    }
  }, [clampPulse]);

  useEffect(() => {
    if (gesture && gesture.n !== lastGestureN.current && gesture.name) {
      lastGestureN.current = gesture.n;
      gestureAnim.current = { name: gesture.name, start: -1 }; // stamped in frame
    }
  }, [gesture]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const lerp = estop ? 1 : 1 - Math.exp(-6 * dt); // estop: snap rigid

    // waist yaw ← pan (screen-left = body's left), dock pitch ← tilt
    if (waist.current) {
      waist.current.rotation.y = THREE.MathUtils.lerp(
        waist.current.rotation.y,
        THREE.MathUtils.degToRad(-pan),
        lerp,
      );
    }

    // gesture clock
    let g = gestureAnim.current;
    if (g) {
      if (g.start < 0) g.start = t;
      const dur = GESTURE_DURATION[g.name] ?? 1.5;
      if (t - g.start > dur || estop) {
        gestureAnim.current = null;
        g = null;
      }
    }
    const gt = g ? t - g.start : 0;

    if (dock.current) {
      let pitch = THREE.MathUtils.degToRad(-tilt);
      let yaw = 0;
      if (g?.name === "nod") pitch += Math.sin(gt * 9) * 0.18;
      if (g?.name === "shake") yaw = Math.sin(gt * 9) * 0.25;
      dock.current.rotation.x = THREE.MathUtils.lerp(
        dock.current.rotation.x,
        pitch,
        estop ? 1 : 1 - Math.exp(-8 * dt),
      );
      dock.current.rotation.y = yaw;
    }

    // arms: rest pose with idle sway; wave/point on the right arm
    const rest = 0.12 + (estop ? 0 : Math.sin(t * 1.3) * 0.02);
    if (armL.current) {
      armL.current.rotation.z = THREE.MathUtils.lerp(
        armL.current.rotation.z,
        -rest,
        lerp,
      );
      armL.current.rotation.x = THREE.MathUtils.lerp(
        armL.current.rotation.x,
        0,
        lerp,
      );
    }
    if (armR.current && forearmR.current) {
      let z = rest;
      let x = 0;
      let elbow = -0.25;
      if (g?.name === "wave") {
        const env = Math.sin(Math.min((gt / 0.35) * (Math.PI / 2), Math.PI / 2));
        z = rest + env * 2.35; // arm up-outward
        elbow = -0.5 + Math.sin(gt * 10) * 0.45 * env; // the wave itself
      } else if (g?.name === "point") {
        const env = Math.sin(Math.min((gt / 0.3) * (Math.PI / 2), Math.PI / 2));
        x = -env * 1.35; // arm forward
        elbow = -0.1;
      }
      armR.current.rotation.z = THREE.MathUtils.lerp(armR.current.rotation.z, z, estop ? 1 : 1 - Math.exp(-9 * dt));
      armR.current.rotation.x = THREE.MathUtils.lerp(armR.current.rotation.x, x, estop ? 1 : 1 - Math.exp(-9 * dt));
      forearmR.current.rotation.z = THREE.MathUtils.lerp(forearmR.current.rotation.z, elbow, estop ? 1 : 1 - Math.exp(-10 * dt));
    }

    // drive: the accepted (clamped) command leans + slowly yaws the stance
    if (root.current) {
      const vx = estop ? 0 : (drive?.vx ?? 0);
      const wz = estop ? 0 : (drive?.wz ?? 0);
      root.current.rotation.y += wz * dt * 0.4;
      root.current.rotation.x = THREE.MathUtils.lerp(
        root.current.rotation.x,
        -vx * 0.35,
        lerp,
      );
      // idle breath — dead still under estop
      root.current.position.y = estop
        ? -1.55
        : -1.55 + Math.sin(t * 1.4) * 0.012;
    }

    // hero scrub: the phone approaches and docks as the face
    if (phone.current) {
      const s = scrub ?? 1;
      const docked = THREE.MathUtils.smoothstep(s, 0.15, 0.65);
      phone.current.position.z = THREE.MathUtils.lerp(3.8, 0.36, docked);
      phone.current.position.y = THREE.MathUtils.lerp(2.2, 0.78, docked);
      phone.current.rotation.x = THREE.MathUtils.lerp(-0.8, 0, docked);
    }

    // status ring: signal by default, amber flash on clamp, hard red on estop
    if (ring.current) {
      const m = ring.current.material as THREE.MeshStandardMaterial;
      flash.current = Math.max(0, flash.current - dt * 1.8);
      m.emissive.lerp(estop || flash.current > 0 ? DANGER : SIGNAL, 0.25);
      m.emissiveIntensity = estop
        ? 2.4
        : 0.9 +
          flash.current * 2.5 +
          (thinking ? Math.sin(t * 8) * 0.3 + 0.3 : 0);
    }
    for (const part of [eyeL.current, eyeR.current, mouth.current]) {
      if (part) {
        const m = part.material as THREE.MeshStandardMaterial;
        m.emissive.lerp(estop ? DANGER : SIGNAL, 0.2);
        m.emissiveIntensity = estop ? 1.8 : 1.3;
      }
    }
  });

  const frameMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#16191f"),
        metalness: 0.85,
        roughness: 0.35,
      }),
    [],
  );
  const jointMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#0c0e11"),
        metalness: 0.7,
        roughness: 0.45,
      }),
    [],
  );

  return (
    <group ref={root} position={[0, -1.55, 0]}>
      {/* ---- stance: legs + feet ---- */}
      {[-0.42, 0.42].map((x) => (
        <group key={x} position={[x, 1.05, 0]}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.17, 20, 20]} />
            <primitive object={jointMat} attach="material" />
          </mesh>
          {/* thigh, slight bend */}
          <mesh position={[0, -0.32, 0.03]} rotation={[0.12, 0, 0]}>
            <boxGeometry args={[0.26, 0.55, 0.3]} />
            <primitive object={frameMat} attach="material" />
          </mesh>
          <mesh position={[0, -0.62, 0.06]}>
            <sphereGeometry args={[0.14, 20, 20]} />
            <primitive object={jointMat} attach="material" />
          </mesh>
          {/* shin */}
          <mesh position={[0, -0.88, 0.02]} rotation={[-0.1, 0, 0]}>
            <boxGeometry args={[0.22, 0.55, 0.26]} />
            <primitive object={frameMat} attach="material" />
          </mesh>
          {/* foot */}
          <mesh position={[0, -1.18, 0.1]}>
            <boxGeometry args={[0.3, 0.12, 0.58]} />
            <primitive object={jointMat} attach="material" />
          </mesh>
        </group>
      ))}

      {/* pelvis + status ring (the constitution's telltale) */}
      <mesh position={[0, 1.18, 0]}>
        <boxGeometry args={[0.95, 0.32, 0.55]} />
        <primitive object={jointMat} attach="material" />
      </mesh>
      <mesh ref={ring} position={[0, 1.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.62, 0.035, 16, 64]} />
        <meshStandardMaterial
          color="#0a0b0d"
          emissive="#3df5a0"
          emissiveIntensity={0.9}
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>

      {/* ---- upper body: yaw = pan ---- */}
      <group ref={waist} position={[0, 1.42, 0]}>
        {/* torso chassis with dock opening */}
        <RoundedBox args={[1.35, 1.25, 0.6]} radius={0.12} smoothness={4} position={[0, 0.62, -0.06]}>
          <primitive object={frameMat} attach="material" />
        </RoundedBox>
        {/* shoulder pods */}
        {[-0.82, 0.82].map((x) => (
          <mesh key={x} position={[x, 1.05, -0.02]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.24, 24]} />
            <primitive object={jointMat} attach="material" />
          </mesh>
        ))}

        {/* the phone: brain + face, docked on a tilt gimbal */}
        <group ref={dock} position={[0, 1.05, 0]}>
          <group ref={phone} position={[0, 0.78, 0.36]}>
            {/* dock cradle rails */}
            <mesh position={[0, -0.55, -0.06]}>
              <boxGeometry args={[1.14, 0.5, 0.16]} />
              <primitive object={jointMat} attach="material" />
            </mesh>
            {/* phone slab, portrait — face above the torso line */}
            <RoundedBox args={[1.02, 1.85, 0.08]} radius={0.07} smoothness={4}>
              <meshStandardMaterial color="#05070a" metalness={0.6} roughness={0.2} />
            </RoundedBox>
            {/* screen face */}
            <mesh ref={eyeL} position={[-0.24, 0.42, 0.045]}>
              <circleGeometry args={[0.12, 32]} />
              <meshStandardMaterial color="#0a0b0d" emissive="#3df5a0" emissiveIntensity={1.3} />
            </mesh>
            <mesh ref={eyeR} position={[0.24, 0.42, 0.045]}>
              <circleGeometry args={[0.12, 32]} />
              <meshStandardMaterial color="#0a0b0d" emissive="#3df5a0" emissiveIntensity={1.3} />
            </mesh>
            <mesh ref={mouth} position={[0, 0.08, 0.045]}>
              <planeGeometry args={[0.3, 0.045]} />
              <meshStandardMaterial color="#0a0b0d" emissive="#3df5a0" emissiveIntensity={1.3} />
            </mesh>
          </group>
        </group>

        {/* ---- arms (z = out from shoulder; forearm hinges at elbow) ---- */}
        <group ref={armL} position={[-0.95, 1.05, -0.02]}>
          <mesh position={[-0.08, -0.32, 0]} rotation={[0, 0, 0.1]}>
            <boxGeometry args={[0.22, 0.6, 0.24]} />
            <primitive object={frameMat} attach="material" />
          </mesh>
          <mesh position={[-0.12, -0.62, 0]}>
            <sphereGeometry args={[0.12, 20, 20]} />
            <primitive object={jointMat} attach="material" />
          </mesh>
          <group position={[-0.12, -0.62, 0]} rotation={[0, 0, -0.25]}>
            <mesh position={[0, -0.3, 0]}>
              <boxGeometry args={[0.18, 0.52, 0.2]} />
              <primitive object={frameMat} attach="material" />
            </mesh>
            <mesh position={[0, -0.62, 0]}>
              <boxGeometry args={[0.16, 0.18, 0.22]} />
              <primitive object={jointMat} attach="material" />
            </mesh>
          </group>
        </group>

        <group ref={armR} position={[0.95, 1.05, -0.02]}>
          <mesh position={[0.08, -0.32, 0]} rotation={[0, 0, -0.1]}>
            <boxGeometry args={[0.22, 0.6, 0.24]} />
            <primitive object={frameMat} attach="material" />
          </mesh>
          <mesh position={[0.12, -0.62, 0]}>
            <sphereGeometry args={[0.12, 20, 20]} />
            <primitive object={jointMat} attach="material" />
          </mesh>
          <group ref={forearmR} position={[0.12, -0.62, 0]} rotation={[0, 0, -0.25]}>
            <mesh position={[0, -0.3, 0]}>
              <boxGeometry args={[0.18, 0.52, 0.2]} />
              <primitive object={frameMat} attach="material" />
            </mesh>
            <mesh position={[0, -0.62, 0]}>
              <boxGeometry args={[0.16, 0.18, 0.22]} />
              <primitive object={jointMat} attach="material" />
            </mesh>
          </group>
        </group>
      </group>

      <ContactShadows
        position={[0, -0.14, 0]}
        opacity={0.55}
        blur={2.4}
        scale={7}
        color="#000000"
      />
    </group>
  );
}

export function HeadScene(props: BodyProps & { className?: string }) {
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
        camera={{ position: [0, 0.5, 8.4], fov: 35 }}
        dpr={[1, 1.75]}
        frameloop={reduced ? "demand" : "always"}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 5, 5]} intensity={1.15} />
        <directionalLight position={[-4, 2, -3]} intensity={0.35} color="#3df5a0" />
        <Exoskeleton {...props} scrub={reduced ? 1 : props.scrub} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
