'use client';

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Environment, Html } from '@react-three/drei';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';

/**
 * Cinematic Romantic Heart Lock Page
 * - Tap the heart to unlock
 * - When unlocked, input the pass-hint
 * - On correct hint: cinematic portal + heart particles + redirect
 */
export default function HeartLockCinematic() {
  const router = useRouter();
  const [tapCount, setTapCount] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [showHintInput, setShowHintInput] = useState(false);
  const [showPortal, setShowPortal] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const correctHint = 'lovecode'; // change to your secret

  // Smooth loading animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Add CSS animations safely on client-side
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(50px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fadeInScale {
        from {
          opacity: 0;
          transform: translateX(-50%) scale(0.8);
        }
        to {
          opacity: 1;
          transform: translateX(-50%) scale(1);
        }
      }

      @keyframes pulse {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
      }

      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-20px);
        }
        60% {
          transform: translateY(-10px);
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes shake {
        0%, 100% {
          transform: translateX(0);
        }
        25% {
          transform: translateX(-5px);
        }
        75% {
          transform: translateX(5px);
        }
      }

      /* Enhanced input focus effects */
      input:focus {
        border-color: #ff6fa3 !important;
        box-shadow: 0 0 0 3px rgba(255, 111, 163, 0.2) !important;
        transform: translateY(-2px);
      }

      /* Button hover effects */
      button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(255, 111, 163, 0.4) !important;
      }

      button:active {
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      // Cleanup on unmount
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const onHeartTap = () => {
    if (unlocked) return;
    setTapCount((c) => {
      const n = c + 1;
      if (n >= 12) {
        setUnlocked(true);
        // show hint input after small delay for dramatic timing
        setTimeout(() => setShowHintInput(true), 700);
      }
      return n;
    });
  };

  const handleCorrectHint = (cb: () => void) => {
    // start cinematic: particle burst, portal + message then redirect
    setShowMessage(true);
    setShowPortal(true);
    // give portal some time to play then redirect
    setTimeout(() => {
      cb();
    }, 1800);
  };

  if (isLoading) {
    return (
      <div style={loadingContainer}>
        <div style={loadingHeart}>💖</div>
        <div style={loadingText}>Memuat Cinta Ku...</div>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.9} />
        <pointLight position={[0, 0, 5]} intensity={0.3} color="#ff6fa3" />

        <Suspense fallback={null}>
          <Float rotationIntensity={0.8} floatIntensity={0.8} speed={1.5}>
            <RotatingHeart onTap={onHeartTap} unlocked={unlocked} tapCount={tapCount} />
          </Float>

          {/* heart particles - inactive until unlocked */}
          <HeartParticles active={showPortal || unlocked} burst={showPortal} />

          {/* portal effect plays when showPortal === true */}
          {showPortal && <PortalEffect />}

          {/* Background floating hearts */}
          <FloatingHearts />
        </Suspense>

        <Stars radius={100} depth={60} count={3000} factor={6} fade speed={0.5} />
        <Environment preset="sunset" />
      </Canvas>

      {/* Overlays: HUD, hint input, cinematic message */}
      <div style={hudWrap}>
        {!unlocked && (
          <div style={{...hudText, animation: 'fadeInUp 0.6s ease-out'}}>
            Tap ❤️ {12 - tapCount}x lagi untuk membuka gembok
          </div>
        )}
        {unlocked && !showHintInput && (
          <div style={{...hudText, animation: 'pulse 2s infinite'}}>
            Kunci terbuka... siap menerima hint ✨
          </div>
        )}

        {showHintInput && (
          <div style={{ animation: 'slideInUp 0.8s ease-out' }}>
            <HintInput
              correctHint={correctHint}
              onSuccess={() => handleCorrectHint(() => router.push('/dashboard'))}
            />
          </div>
        )}

        {showMessage && (
          <div style={{...cinematicMessage, animation: 'fadeInScale 1s ease-out'}}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>✨ Janji Terkunci Telah Dibuka ✨</div>
            <div style={{ opacity: 0.9 }}>Semua jalan menuju dashboard cinta — selamat.</div>
          </div>
        )}
      </div>

      {/* Background gradient overlay */}
      <div style={gradientOverlay} />

      {/* optional audio (commented) - uncomment and add src to use */}
      {/*
      <audio autoPlay loop src="/your-music.mp3" />
      */}
    </div>
  );
}

/** RotatingHeart: lives *inside* Canvas so useFrame is allowed */
function RotatingHeart({ onTap, unlocked, tapCount }: { onTap: () => void; unlocked: boolean; tapCount: number }) {
  const ref = useRef<THREE.Mesh | null>(null);
  const glowRef = useRef<THREE.Mesh | null>(null);
  const tapAnimation = useRef(0);

  useFrame((state, delta) => {
    if (!ref.current) return;
    
    // Smooth tap animation
    if (tapAnimation.current > 0) {
      tapAnimation.current -= delta * 3;
    }

    // idle rotation + gentle pulsate
    ref.current.rotation.y += 0.6 * delta;
    const baseScale = 1 + Math.sin(state.clock.elapsedTime * 2) * (unlocked ? 0.08 : 0.06);
    const tapScale = 1 + tapAnimation.current * 0.3;
    ref.current.scale.setScalar(baseScale * tapScale);

    // Enhanced glow effect
    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.1 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
      glowRef.current.scale.setScalar(1.5 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1);
    }
  });

  const handleTap = () => {
    tapAnimation.current = 1;
    onTap();
  };

  return (
    <group>
      {/* Enhanced glowing sphere */}
      <mesh ref={ref} onClick={handleTap} castShadow receiveShadow>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshStandardMaterial
          color={unlocked ? '#ffbddf' : '#ff4d8b'}
          emissive={unlocked ? '#ff7fb3' : '#ff1a5c'}
          metalness={0.3}
          roughness={0.15}
        />

        {/* Enhanced corona with multiple layers */}
        <mesh scale={[1.5, 1.5, 1.5]}>
          <sphereGeometry args={[1.05, 32, 32]} />
          <meshBasicMaterial transparent opacity={0.12} color="pink" />
        </mesh>
        <mesh scale={[1.8, 1.8, 1.8]}>
          <sphereGeometry args={[1.05, 32, 32]} />
          <meshBasicMaterial transparent opacity={0.06} color="#ff9ccf" />
        </mesh>
      </mesh>

      {/* Enhanced glow effect */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.3, 32, 32]} />
        <meshBasicMaterial transparent opacity={0.1} color="#ff6fa3" />
      </mesh>

      {/* Enhanced decorative shackle with animation */}
      <mesh position={[0, 1.45, 0]} rotation={[Math.PI, 0, 0]}>
        <torusGeometry args={[0.55, 0.08, 16, 100, Math.PI]} />
        <meshStandardMaterial 
          metalness={0.9} 
          roughness={0.1} 
          color={unlocked ? '#ff9ccf' : '#ffe3ea'}
          emissive={unlocked ? '#ff6fa3' : '#000000'}
        />
      </mesh>

      {/* Progress indicator rings */}
      {tapCount > 0 && (
        <ProgressRings progress={tapCount / 12} />
      )}
    </group>
  );
}

/** Progress indicator rings around the heart */
function ProgressRings({ progress }: { progress: number }) {
  const ref = useRef<THREE.Mesh | null>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z += 0.01;
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1.8, 1.9, 64]} />
      <meshBasicMaterial 
        transparent 
        opacity={0.3} 
        color="#ff6fa3"
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/** Enhanced HeartParticles with better effects */
function HeartParticles({ active, burst }: { active: boolean; burst: boolean }) {
  const count = 250;
  const meshRef = useRef<THREE.InstancedMesh | null>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Enhanced per-instance state
  const velocities = useMemo(() => 
    new Array(count).fill(0).map(() => ({ 
      x: (Math.random() - 0.5) * 0.08, 
      y: 0.01 + Math.random() * 0.06, 
      z: (Math.random() - 0.5) * 0.08,
      rotation: (Math.random() - 0.5) * 0.1
    })), [count]
  );
  
  const positions = useMemo(() => 
    new Array(count).fill(0).map(() => ({ 
      x: (Math.random() - 0.5) * 8, 
      y: -2 - Math.random() * 3, 
      z: (Math.random() - 0.5) * 8 
    })), []
  );

  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      const p = positions[i];
      dummy.position.set(p.x, p.y, p.z);
      const s = 0.2 + Math.random() * 0.8;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    for (let i = 0; i < count; i++) {
      meshRef.current.getMatrixAt(i, dummy.matrix);
      dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);

      if (burst) {
        // Enhanced burst effect
        dummy.position.y += velocities[i].y * 8;
        dummy.position.x += velocities[i].x * 3;
        dummy.position.z += velocities[i].z * 3;
        dummy.rotation.y += velocities[i].rotation;
        dummy.scale.setScalar(dummy.scale.x * 1.05);
        dummy.scale.x *= 0.97;
      } else if (active) {
        // Enhanced floating with rotation
        dummy.position.y += velocities[i].y * 0.4;
        dummy.position.x += Math.sin((i + state.clock.elapsedTime * 0.0008) * 0.5) * 0.002;
        dummy.rotation.y += velocities[i].rotation * 0.5;
      } else {
        dummy.position.y = -15 - Math.abs(dummy.position.x);
      }

      // Reset if too high
      if (dummy.position.y > 10) {
        dummy.position.y = -3 - Math.random() * 3;
        dummy.position.x = (Math.random() - 0.5) * 8;
        dummy.position.z = (Math.random() - 0.5) * 8;
      }

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined as any, undefined as any, count]}>
      <boxGeometry args={[0.4, 0.4, 0.08]} />
      <meshStandardMaterial 
        transparent 
        opacity={0.9} 
        color={'#ff8ab6'} 
        emissive={'#ff5c92'} 
        metalness={0.3} 
        roughness={0.2}
      />
    </instancedMesh>
  );
}

/** Floating background hearts */
function FloatingHearts() {
  const hearts = useMemo(() => 
    Array.from({ length: 15 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      ] as [number, number, number],
      scale: 0.1 + Math.random() * 0.2,
      speed: 0.5 + Math.random() * 1
    })), []
  );

  return (
    <group>
      {hearts.map((heart, i) => (
        <FloatingHeart key={i} {...heart} />
      ))}
    </group>
  );
}

function FloatingHeart({ position, scale, speed }: { position: [number, number, number]; scale: number; speed: number }) {
  const ref = useRef<THREE.Mesh | null>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y += Math.sin(state.clock.elapsedTime * speed) * 0.001;
    ref.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={ref} position={position} scale={[scale, scale, scale]}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial transparent opacity={0.1} color="#ff6fa3" />
    </mesh>
  );
}

/** Enhanced PortalEffect with more dramatic visuals */
function PortalEffect() {
  const ref = useRef<THREE.Mesh | null>(null);
  const glowRef = useRef<THREE.Mesh | null>(null);
  const ringRef = useRef<THREE.Mesh | null>(null);
  const start = useRef<number | null>(null);

  useFrame((state) => {
    if (!start.current) start.current = state.clock.elapsedTime;
    const t = state.clock.elapsedTime - start.current;
    
    if (ref.current) {
      const s = 1 + Math.min(t * 5, 8);
      ref.current.scale.setScalar(s);
      ref.current.rotation.z += 0.03;
    }
    
    if (glowRef.current) {
      const glowMaterial = glowRef.current.material as THREE.MeshBasicMaterial;
      glowMaterial.opacity = Math.max(0, 0.8 - t * 0.5);
      glowRef.current.scale.setScalar(1 + t * 4);
    }
    
    if (ringRef.current) {
      ringRef.current.rotation.z -= 0.02;
      const ringMaterial = ringRef.current.material as THREE.MeshBasicMaterial;
      ringMaterial.opacity = Math.max(0, 0.6 - t * 0.4);
    }
  });

  return (
    <group>
      <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.15, 32, 120]} />
        <meshStandardMaterial 
          color={'#ff9ccf'} 
          emissive={'#ff6fa3'} 
          metalness={0.9} 
          roughness={0.05} 
          transparent 
          opacity={0.95} 
        />
      </mesh>

      <mesh ref={glowRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial transparent opacity={0.8} color={'#ff7fb3'} />
      </mesh>

      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 3, 64]} />
        <meshBasicMaterial 
          transparent 
          opacity={0.6} 
          color={'#ffd1e8'} 
          side={THREE.DoubleSide} 
        />
      </mesh>
    </group>
  );
}

/** Enhanced HintInput with better styling */
function HintInput({ correctHint, onSuccess }: { correctHint: string; onSuccess: () => void }) {
  const [value, setValue] = useState('');
  const [err, setErr] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Simulate processing delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (value.trim().toLowerCase() === correctHint.toLowerCase()) {
      onSuccess();
    } else {
      setErr('Hint salah. Coba lagi.');
      setTimeout(() => setErr(''), 1400);
    }
    
    setIsSubmitting(false);
  };

  return (
    <div style={hintWrap}>
      <form onSubmit={submit} style={hintForm}>
        <div style={{ fontSize: 16, color: '#4b0b2d', fontWeight: 700, marginBottom: 8 }}>
          Masukkan pass-hint untuk melanjutkan ✨
        </div>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="hint rahasia..."
          style={hintInput}
          disabled={isSubmitting}
        />
        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <button 
            type="submit" 
            style={{...hintBtn, opacity: isSubmitting ? 0.7 : 1}}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Memproses...' : 'Lanjut'}
          </button>
          <button 
            type="button" 
            style={hintGhost} 
            onClick={() => setValue('')}
            disabled={isSubmitting}
          >
            Reset
          </button>
        </div>
        {err && <div style={{ color: '#b72136', marginTop: 8, animation: 'shake 0.5s ease-in-out' }}>{err}</div>}
      </form>
    </div>
  );
}


// --- Enhanced Styles with Animations ---
const loadingContainer: React.CSSProperties = {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #ff6fa3, #ff8ab6, #ff9ccf)',
  color: 'white',
};

const loadingHeart: React.CSSProperties = {
  fontSize: '4rem',
  animation: 'bounce 1s infinite',
  marginBottom: '1rem',
};

const loadingText: React.CSSProperties = {
  fontSize: '1.2rem',
  fontWeight: 600,
  animation: 'fadeIn 1s ease-in-out',
};

const gradientOverlay: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'radial-gradient(circle at center, transparent 0%, rgba(255, 111, 163, 0.1) 100%)',
  pointerEvents: 'none',
};

const hudWrap: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-end',
  paddingBottom: 48,
};

const hudText: React.CSSProperties = {
  color: '#2b052b',
  background: 'linear-gradient(90deg, rgba(255,255,255,0.8), rgba(255,255,255,0.4))',
  padding: '12px 18px',
  borderRadius: 25,
  fontWeight: 700,
  pointerEvents: 'auto',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.2)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
};

const hintWrap: React.CSSProperties = {
  pointerEvents: 'auto',
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  marginTop: 12,
};

const hintForm: React.CSSProperties = {
  background: 'rgba(255, 245, 250, 0.95)',
  padding: 20,
  borderRadius: 16,
  boxShadow: '0 20px 40px rgba(6, 6, 12, 0.15)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.3)',
};

const hintInput: React.CSSProperties = {
  padding: '12px 16px',
  borderRadius: 12,
  border: '2px solid rgba(255, 111, 163, 0.3)',
  width: 300,
  fontSize: '16px',
  background: 'rgba(255,255,255,0.8)',
  transition: 'all 0.3s ease',
  outline: 'none',
};

const hintBtn: React.CSSProperties = {
  background: 'linear-gradient(135deg, #ff6fa3, #ff8ab6)',
  color: 'white',
  padding: '12px 20px',
  borderRadius: 12,
  border: 'none',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '14px',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(255, 111, 163, 0.3)',
};

const hintGhost: React.CSSProperties = {
  background: 'transparent',
  border: '2px solid rgba(255, 111, 163, 0.3)',
  padding: '12px 20px',
  borderRadius: 12,
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: '14px',
  color: '#ff6fa3',
  transition: 'all 0.3s ease',
};

const cinematicMessage: React.CSSProperties = {
  position: 'absolute',
  bottom: 120,
  left: '50%',
  transform: 'translateX(-50%)',
  pointerEvents: 'none',
  color: '#3a052a',
  textAlign: 'center',
  padding: '16px 24px',
  borderRadius: 16,
  background: 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))',
  boxShadow: '0 20px 50px rgba(5,5,10,0.25)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.3)',
};

// CSS animations will be handled by useEffect to avoid SSR issues
