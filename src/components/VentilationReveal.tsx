import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useMotionTemplate } from "motion/react";


export default function VentilationReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const progressValue = useMotionValue(0);

  useEffect(() => {
    progressValue.set(progress / 100);
  }, [progress, progressValue]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setProgress(prev =>
        Math.max(
          0,
          Math.min(100, prev + e.deltaY * 0.05)
        )
      );
    };

    element.addEventListener("wheel", handleWheel, {
      passive: false
    });

    return () => {
      element.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Основная прозрачность дыма
  const fogOpacity = useTransform(
    progressValue,
    [0, 0.85],
    [1, 0]
  );

  // Появление вентиляции
  const ventilationOpacity = useTransform(
    progressValue,
    [0, 0.25],
    [0, 1]
  );

  // Воздуховоды и воздушные импульсы
  const airflowX = useTransform(
    progressValue,
    [0.2, 0.8],
    [-400, 400]
  );

  const airflowReverse = useTransform(
    progressValue,
    [0.2, 0.8],
    [300, -300]
  );

  // Вентиляция плавно опускается сверху на первых 20%
  const ventilationY = useTransform(
    progressValue,
    [0, 0.2],
    [-300, 0]
  );

  // Премиальные эффекты активации системы (70-100%)
  const ventilationBrightness = useTransform(
    progressValue,
    [0.7, 1],
    [1, 1.35]
  );

  const ventilationContrast = useTransform(
    progressValue,
    [0.7, 1],
    [1, 1.25]
  );

  const ventilationGlow = useTransform(
    progressValue,
    [0.7, 1],
    [0, 1]
  );

  const ventilationScale = useTransform(
    progressValue,
    [0.7, 1],
    [1, 1.03]
  );

  const smokeParticles = React.useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: 15 + Math.random() * 70,
      size: 60 + Math.random() * 140,
      delay: Math.random() * 50,
    }));
  }, []);

  return (
    <div ref={ref} className="relative w-full rounded-3xl overflow-hidden border border-white/10 bg-[#05070A]/95 p-1 select-none">
      <section className="relative h-[40vh] sm:h-[55vh] md:h-[65vh] lg:h-[75vh] overflow-hidden rounded-2xl">
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-black">

          {/* Основное стабильное изображение дома */}
          <img
            src="/images/house-night.jpg"
            alt="Base house structure"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* 40 Текстурированных слоев премиального дыма */}
          <motion.div
            style={{ opacity: fogOpacity }}
            className="absolute inset-0 pointer-events-none overflow-hidden z-10"
          >
            {smokeParticles.map((p) => (
              <SmokeParticle key={p.id} p={p} progressValue={progressValue} />
            ))}
          </motion.div>

          {/* Вентиляционная система с поддержкой прозрачности через mix-blend-screen */}
          <motion.img
            src="/images/duct-system.png"
            alt="Duct Ventilation system"
            style={{
              opacity: ventilationOpacity,
              y: ventilationY,
              scale: ventilationScale,
              filter: useMotionTemplate`brightness(${ventilationBrightness}) contrast(${ventilationContrast})`
            }}
            className="absolute top-[-20px] left-1/2 -translate-x-1/2 w-[75%] max-w-[900px] pointer-events-none z-20 mix-blend-screen"
          />

          {/* Свечение воздуховода */}
          <motion.div
            style={{
              opacity: ventilationGlow
            }}
            className="absolute top-[40px] left-1/2 -translate-x-1/2 w-[70%] h-[180px] bg-cyan-400/20 blur-[80px] pointer-events-none z-15"
          />

          {/* Световые воздуховоды во время работы */}
          <motion.div
            style={{
              opacity: ventilationOpacity,
              x: airflowX
            }}
            className="absolute top-[16%] left-0 w-[180px] h-[5px] bg-cyan-400 rounded-full blur-[2px] shadow-[0_0_15px_rgba(34,211,238,0.7)] z-10 pointer-events-none"
          />
          <motion.div
            style={{
              opacity: ventilationOpacity,
              x: airflowReverse
            }}
            className="absolute top-[19%] right-0 w-[150px] h-[4px] bg-teal-400 rounded-full blur-[2px] shadow-[0_0_12px_rgba(45,212,191,0.6)] z-10 pointer-events-none"
          />

          {/* Эффект всасывания в центре */}
          <motion.div
            style={{
              scale: useTransform(progressValue, [0, 1], [0, 1]),
              opacity: useTransform(progressValue, [0, 1], [0, 0.6]),
            }}
            className="absolute top-[70px] left-1/2 -translate-x-1/2 w-[220px] h-[220px] rounded-full border border-cyan-400/40 blur-md z-30 pointer-events-none"
          />

        </div>
      </section>
    </div>
  );
}

// Вспомогательный компонент для соблюдения правил React Hooks
function SmokeParticle({ p, progressValue }: { key?: any; p: any; progressValue: any }) {
  const x = useTransform(progressValue, [0, 1], [0, (50 - p.left) * 8]);
  const y = useTransform(progressValue, [0, 1], [0, -p.top * 4]);
  const scale = useTransform(progressValue, [0, 1], [1, 0]);
  const opacity = useTransform(progressValue, [0, 1], [0.9, 0]);

  return (
    <motion.div
      style={{
        left: `${p.left}%`,
        top: `${p.top}%`,
        x,
        y,
        scale,
        opacity,
      }}
      className="absolute"
    >
      <div
        style={{
          width: p.size,
          height: p.size,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.35) 40%, rgba(255,255,255,0) 80%)",
          filter: "blur(35px)",
        }}
      />
    </motion.div>
  );
}
