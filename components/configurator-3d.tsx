"use client";

import { getConfiguratorCatalog } from "@/lib/catalog/products";
import type { BodyArchetypeSlug } from "@/lib/catalog/types";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import type { MeshStandardMaterialParameters } from "three";

const catalog = getConfiguratorCatalog();

export type Configurator3DProps = {
  bodyArchetypeId: string;
  finishId: string;
  accessoryId: string;
  phoneModelId?: string;
};

function resolveBodySlug(bodyArchetypeId: string): BodyArchetypeSlug {
  const body = catalog.bodyArchetypes.find((b) => b.id === bodyArchetypeId);
  return (body?.slug ?? "walker") as BodyArchetypeSlug;
}

function resolveFinishColor(finishId: string): string {
  const finish = catalog.finishes.find((f) => f.id === finishId);
  return finish?.colorHex ?? "#FF7A1A";
}

function resolveAccentColor(finishId: string): string {
  if (finishId === "finish-stealth-black") return "#333333";
  if (finishId === "finish-white-studio") return "#E8E8E0";
  return "#FF7A1A";
}

function WalkerBody({
  shellColor,
  accentColor,
  accessoryId,
}: {
  shellColor: string;
  accentColor: string;
  accessoryId: string;
}) {
  const shellMaterial = useMemo<MeshStandardMaterialParameters>(
    () => ({
      color: shellColor,
      metalness: 0.35,
      roughness: 0.55,
    }),
    [shellColor],
  );

  const metalMaterial = useMemo<MeshStandardMaterialParameters>(
    () => ({
      color: accentColor,
      metalness: 0.7,
      roughness: 0.3,
    }),
    [accentColor],
  );

  const phoneMaterial = useMemo<MeshStandardMaterialParameters>(
    () => ({
      color: "#0a0f14",
      metalness: 0.2,
      roughness: 0.4,
      emissive: "#FF7A1A",
      emissiveIntensity: 0.15,
    }),
    [],
  );

  const hintMaterial = useMemo<MeshStandardMaterialParameters>(
    () => ({
      color: "#FF7A1A",
      emissive: "#FF7A1A",
      emissiveIntensity: 0.6,
      metalness: 0.1,
      roughness: 0.5,
    }),
    [],
  );

  return (
    <group position={[0, -0.4, 0]}>
      {/* Pelvis / hip block */}
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.18, 0.28]} />
        <meshStandardMaterial {...metalMaterial} />
      </mesh>

      {/* Torso shell */}
      <mesh position={[0, 1.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.62, 0.72, 0.32]} />
        <meshStandardMaterial {...shellMaterial} />
      </mesh>

      {/* Shoulder bar */}
      <mesh position={[0, 1.38, 0]} castShadow>
        <boxGeometry args={[0.78, 0.1, 0.22]} />
        <meshStandardMaterial {...metalMaterial} />
      </mesh>

      {/* Phone core mount */}
      <mesh position={[0, 1.62, 0.02]} castShadow>
        <boxGeometry args={[0.28, 0.48, 0.06]} />
        <meshStandardMaterial {...phoneMaterial} />
      </mesh>
      <mesh position={[0, 1.62, 0.06]}>
        <boxGeometry args={[0.22, 0.38, 0.02]} />
        <meshStandardMaterial color="#FF7A1A" emissive="#FF7A1A" emissiveIntensity={0.35} />
      </mesh>

      {/* Left arm */}
      <group position={[-0.42, 1.25, 0]}>
        <mesh rotation={[0, 0, 0.35]} castShadow>
          <boxGeometry args={[0.1, 0.55, 0.1]} />
          <meshStandardMaterial {...shellMaterial} />
        </mesh>
        <mesh position={[-0.08, -0.38, 0]} castShadow>
          <boxGeometry args={[0.09, 0.35, 0.09]} />
          <meshStandardMaterial {...shellMaterial} />
        </mesh>
      </group>

      {/* Right arm + accessory mount */}
      <group position={[0.42, 1.25, 0]}>
        <mesh rotation={[0, 0, -0.35]} castShadow>
          <boxGeometry args={[0.1, 0.55, 0.1]} />
          <meshStandardMaterial {...shellMaterial} />
        </mesh>
        <mesh position={[0.08, -0.38, 0]} castShadow>
          <boxGeometry args={[0.09, 0.35, 0.09]} />
          <meshStandardMaterial {...shellMaterial} />
        </mesh>
        <AccessoryHint accessoryId={accessoryId} material={hintMaterial} />
      </group>

      {/* Left leg */}
      <group position={[-0.16, 0.35, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.12, 0.55, 0.12]} />
          <meshStandardMaterial {...shellMaterial} />
        </mesh>
        <mesh position={[0, -0.38, 0.04]} castShadow>
          <boxGeometry args={[0.14, 0.12, 0.22]} />
          <meshStandardMaterial {...metalMaterial} />
        </mesh>
      </group>

      {/* Right leg */}
      <group position={[0.16, 0.35, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.12, 0.55, 0.12]} />
          <meshStandardMaterial {...shellMaterial} />
        </mesh>
        <mesh position={[0, -0.38, 0.04]} castShadow>
          <boxGeometry args={[0.14, 0.12, 0.22]} />
          <meshStandardMaterial {...metalMaterial} />
        </mesh>
      </group>

      {accessoryId === "acc-presentation-stand" ? (
        <mesh position={[0, 0.08, 0.18]} receiveShadow>
          <cylinderGeometry args={[0.35, 0.38, 0.06, 24]} />
          <meshStandardMaterial {...hintMaterial} />
        </mesh>
      ) : null}

      {accessoryId === "acc-sensor-mount" ? (
        <mesh position={[0, 1.88, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.22, 8]} />
          <meshStandardMaterial {...hintMaterial} />
        </mesh>
      ) : null}

      {accessoryId === "acc-light-module" ? (
        <>
          <mesh position={[-0.38, 1.42, 0.12]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshStandardMaterial {...hintMaterial} />
          </mesh>
          <mesh position={[0.38, 1.42, 0.12]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshStandardMaterial {...hintMaterial} />
          </mesh>
        </>
      ) : null}
    </group>
  );
}

function AccessoryHint({
  accessoryId,
  material,
}: {
  accessoryId: string;
  material: MeshStandardMaterialParameters;
}) {
  if (accessoryId === "acc-tray-hand") {
    return (
      <mesh position={[0.1, -0.58, 0]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.22, 0.02, 0.16]} />
        <meshStandardMaterial {...material} />
      </mesh>
    );
  }
  if (accessoryId === "acc-gripper-hand") {
    return (
      <group position={[0.1, -0.58, 0]}>
        <mesh position={[-0.04, 0, 0]}>
          <boxGeometry args={[0.03, 0.1, 0.03]} />
          <meshStandardMaterial {...material} />
        </mesh>
        <mesh position={[0.04, 0, 0]}>
          <boxGeometry args={[0.03, 0.1, 0.03]} />
          <meshStandardMaterial {...material} />
        </mesh>
      </group>
    );
  }
  if (accessoryId === "acc-camera-rig") {
    return (
      <mesh position={[-0.42, 1.72, 0.14]}>
        <boxGeometry args={[0.12, 0.08, 0.1]} />
        <meshStandardMaterial {...material} />
      </mesh>
    );
  }
  return null;
}

function RoverPlaceholder({ shellColor }: { shellColor: string }) {
  return (
    <group position={[0, 0, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.25, 0.6]} />
        <meshStandardMaterial color={shellColor} metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[-0.32, -0.12, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.06, 16]} />
        <meshStandardMaterial color="#333" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0.32, -0.12, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.06, 16]} />
        <meshStandardMaterial color="#333" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[0.22, 0.4, 0.06]} />
        <meshStandardMaterial color="#0a0f14" emissive="#FF7A1A" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

function SceneContent({
  bodyArchetypeId,
  finishId,
  accessoryId,
}: Configurator3DProps) {
  const slug = resolveBodySlug(bodyArchetypeId);
  const shellColor = resolveFinishColor(finishId);
  const accentColor = resolveAccentColor(finishId);

  return (
    <>
      <PerspectiveCamera makeDefault position={[2.2, 1.4, 2.4]} fov={42} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 6, 3]} intensity={1.1} castShadow />
      <directionalLight position={[-3, 2, -2]} intensity={0.35} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <circleGeometry args={[2.5, 48]} />
        <meshStandardMaterial color="#0d1117" metalness={0.1} roughness={0.9} />
      </mesh>
      {slug === "walker" ? (
        <WalkerBody shellColor={shellColor} accentColor={accentColor} accessoryId={accessoryId} />
      ) : (
        <RoverPlaceholder shellColor={shellColor} />
      )}
      <OrbitControls
        enablePan={false}
        minDistance={1.5}
        maxDistance={5}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.1}
        target={[0, 0.9, 0]}
      />
    </>
  );
}

export function Configurator3D(props: Configurator3DProps) {
  const body = catalog.bodyArchetypes.find((b) => b.id === props.bodyArchetypeId);
  const finish = catalog.finishes.find((f) => f.id === props.finishId);
  const accessory = catalog.accessories.find((a) => a.id === props.accessoryId);

  return (
    <div className="space-y-2">
      <div
        className="relative h-[min(52vw,340px)] min-h-[280px] overflow-hidden rounded-xl border border-line/60 bg-[#050709]"
        role="img"
        aria-label={`3D preview of ${body?.name ?? "Exobod"} body in ${finish?.name ?? "selected finish"} with ${accessory?.name ?? "accessory"}`}
      >
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center text-xs text-text-muted">
              Loading 3D preview…
            </div>
          }
        >
          <Canvas
            shadows
            gl={{ antialias: true, alpha: false }}
            onCreated={({ gl }) => {
              gl.setClearColor("#050709");
            }}
          >
            <SceneContent {...props} />
          </Canvas>
        </Suspense>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent px-3 py-2">
          <p className="font-mono text-[9px] uppercase tracking-wider text-text-muted">
            {body?.name} · {finish?.name} · {accessory?.name}
          </p>
        </div>
      </div>
      <p className="text-[11px] leading-relaxed text-text-muted">
        Drag to orbit. Orange highlights mark accessory attachment points — indicative geometry, not
        final CAD.
      </p>
    </div>
  );
}
