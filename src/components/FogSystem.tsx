import React, { useEffect, useState } from "react";
import { motion, useMotionValue } from "motion/react";


const SicklePropeller = ({ 
  duration = 2.2, 
  reverse = false, 
  isPaused = false,
  modeColor = "#22d3ee" 
}: { 
  duration?: number; 
  reverse?: boolean; 
  isPaused?: boolean;
  modeColor?: string;
}) => {
  return (
    <div 
      className="w-full h-full" 
      style={{ 
        animationName: reverse ? "custom-spin-ccw" : "custom-spin-cw",
        animationDuration: `${duration || 2.2}s`,
        animationTimingFunction: "linear",
        animationIterationCount: "infinite",
        animationPlayState: isPaused ? "paused" : "running"
      }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)]">
        <defs>
          <linearGradient id="sickle-blade-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#cbd5e1" />
            <stop offset="60%" stopColor="#64748b" />
            <stop offset="85%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          
          <linearGradient id="hub-copper-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="50%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#7c2d12" />
          </linearGradient>

          <pattern id="honeycomb-bg" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="scale(0.8)">
            <path d="M 5 0 L 10 3 L 10 8 L 5 11 L 0 8 L 0 3 Z" fill="none" stroke="#27272a" strokeWidth="0.8" />
          </pattern>
          
          <filter id="sickle-ambient-shadow" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="1" dy="2.5" stdDeviation="1.5" floodColor="#000" floodOpacity="0.85" />
          </filter>
        </defs>
        
        {/* Honeycomb high-tech mesh in the background */}
        <circle cx="50" cy="50" r="48" fill="url(#honeycomb-bg)" opacity="0.35" />
        
        {/* Animated glowing indicators outer ring */}
        {!isPaused && (
          <circle 
            cx="50" 
            cy="50" 
            r="46" 
            fill="none" 
            stroke={modeColor} 
            strokeWidth="1.2" 
            strokeDasharray="12 8 4 8" 
            className="opacity-70" 
            style={{ 
              transformOrigin: '50% 50%',
              animation: `custom-spin-cw ${duration * 4}s linear infinite` 
            }} 
          />
        )}

        {/* 9 highly aerodynamically curved scimitar/sickle blades, matching the user first picture */}
        <g filter="url(#sickle-ambient-shadow)">
          {Array.from({ length: 9 }).map((_, idx) => {
            const rotation = idx * (360 / 9);
            return (
              <g key={idx} transform={`rotate(${rotation} 50 50)`}>
                {/* Main metallic blade */}
                <path
                  d="M 50 38 
                     C 48 24, 38 9, 52 2 
                     C 66 -4, 82 8, 64 26 
                     C 57 32, 53 36, 50 38 Z"
                  fill="url(#sickle-blade-grad)"
                />
                {/* Premium light reflection stripe along the edge */}
                <path
                  d="M 50 38 
                     C 48 24, 38 9, 52 2"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="0.8"
                  opacity="0.5"
                />
              </g>
            );
          })}
        </g>

        {/* Brushless engine stator housing with copper coils inside */}
        <circle cx="50" cy="50" r="14" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
        
        {/* Motor stator copper coils */}
        {Array.from({ length: 8 }).map((_, idx) => (
          <line 
            key={idx} 
            x1="50" 
            y1="50" 
            x2={50 + 13 * Math.cos((idx * 45 * Math.PI) / 180)} 
            y2={50 + 13 * Math.sin((idx * 45 * Math.PI) / 180)} 
            stroke="url(#hub-copper-grad)" 
            strokeWidth="2.5" 
            opacity="0.85" 
          />
        ))}
        
        {/* Center cap cover with subtle metallic reflection */}
        <circle cx="50" cy="50" r="8" fill="url(#sickle-blade-grad)" stroke="#09090b" strokeWidth="0.8" />
        <circle cx="50" cy="50" r="4" fill="#09090b" />
        <circle cx="51" cy="49" r="1.2" fill="#ffffff" opacity="0.6" />
      </svg>
    </div>
  );
};

export default function FogSystem() {
  const mouseX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 500);
  const mouseY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 400);

  const [hasInteracted, setHasInteracted] = useState(false);
  const [cleared, setCleared] = useState(0);
  const [fanMode, setFanMode] = useState<'boost' | 'eco' | 'silent' | 'off'>('boost');

  const modeConfig = {
    boost: { duration: 0.7, rpm: 3500, label: "ФОРСАЖ / BOOST", color: "#22d3ee", textColor: "text-cyan-400", ledClass: "bg-cyan-400 shadow-[0_0_12px_#22d3ee]" },
    eco: { duration: 1.8, rpm: 1800, label: "ЭКО / ECO", color: "#34d399", textColor: "text-emerald-400", ledClass: "bg-emerald-400 shadow-[0_0_12px_#34d399]" },
    silent: { duration: 3.5, rpm: 850, label: "БЕСШУМНЫЙ / SILENT", color: "#fbbf24", textColor: "text-amber-400", ledClass: "bg-amber-400 shadow-[0_0_12px_#fbbf24]" },
    off: { duration: 0, rpm: 0, label: "ОСТАНОВЛЕНО / OFF", color: "#f43f5e", textColor: "text-rose-500", ledClass: "bg-rose-500 shadow-[0_0_12px_#f43f5e]" }
  };

  const [winSize, setWinSize] = useState({ 
    width: typeof window !== "undefined" ? window.innerWidth : 1200, 
    height: typeof window !== "undefined" ? window.innerHeight : 800 
  });

  useEffect(() => {
    const onResize = () => {
      setWinSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!hasInteracted) setHasInteracted(true);
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Движение курсора постепенно очищает туман
      setCleared((prev) => Math.min(prev + 2.4, 100));
    };

    const handleTouch = (e: TouchEvent) => {
      if (!hasInteracted) setHasInteracted(true);
      if (e.touches && e.touches[0]) {
        mouseX.set(e.touches[0].clientX);
        mouseY.set(e.touches[0].clientY);
        setCleared((prev) => Math.min(prev + 3.5, 100));
      }
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleTouch, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleTouch);
    };
  }, [hasInteracted, mouseX, mouseY]);

  // Стабильные данные для фотореалистичных клубов дыма по всему экрану
  const smokeClouds = React.useMemo(() => {
    return Array.from({ length: 42 }, (_, i) => {
      const side = i % 2 === 0 ? "left" : "right";
      const startX = -15 + (i * 12) % 130; // Выход за границы для бесшовности
      const startY = -15 + (i * 18) % 130; 
      const size = 380 + (i * 47) % 360; // Большой размер для кучевого объема
      const blurLevel = 15 + (i * 7) % 18; // Дополнительное размытие
      const rotationSpeed = 24 + (i * 9) % 36; 
      const pulseSpeed = 6 + (i * 2) % 7; 

      // Выбираем тип классических белых/светлых облаков как на фото
      const cloudType = i % 3 === 0 ? "white" : i % 3 === 1 ? "gray" : "mist";

      return {
        id: i,
        side,
        startX: `${startX}%`,
        startY: `${startY}%`,
        size,
        blurLevel,
        rotationSpeed,
        pulseSpeed,
        cloudType,
        opacity: cloudType === "white" 
          ? 0.75 + (i % 3) * 0.05 
          : cloudType === "gray" 
          ? 0.82 + (i % 3) * 0.04 
          : 0.65 + (i % 3) * 0.05,
      };
    });
  }, []);

  const getGradientClasses = (type: string) => {
    switch (type) {
      case "white":
        return "from-white/95 via-zinc-100/80 to-transparent shadow-[0_0_100px_rgba(255,255,255,0.45)]";
      case "gray":
        return "from-zinc-200/90 via-zinc-300/70 to-transparent shadow-[0_0_90px_rgba(228,228,231,0.4)]";
      case "mist":
      default:
        return "from-zinc-50/85 via-zinc-100/50 to-transparent shadow-[0_0_120px_rgba(255,255,255,0.3)]";
    }
  };

  return (
    <>
      {/* Специфический SVG-фильтр фрактального шума для наложения текстуры кучевого дыма */}
      <svg className="fixed w-0 h-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="smoke-texture" x="-30%" y="-30%" width="160%" height="160%">
            {/* Генерация естественного фрактального шума */}
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.011" 
              numOctaves="4" 
              result="noise" 
            />
            {/* Искривление контура кругов по карте шума для создания эффекта рваного дыма */}
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="noise" 
              scale="95" 
              xChannelSelector="R" 
              yChannelSelector="G" 
              result="displaced" 
            />
            {/* Размытие для плавности волокон */}
            <feGaussianBlur in="displaced" stdDeviation="12" />
          </filter>
        </defs>
      </svg>

      {/* Стили для чистой CSS-анимации бесконечного вращения и пульсации клубов дыма */}
      <style>{`
        @keyframes smoke-float-1 {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
          100% { transform: translateY(0px) rotate(360deg); }
        }
        @keyframes smoke-float-2 {
          0% { transform: translateY(0px) rotate(360deg); }
          50% { transform: translateY(30px) rotate(180deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes smoke-pulse {
          0%, 100% { opacity: 0.95; }
          50% { opacity: 0.76; }
        }
        @keyframes custom-spin-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes custom-spin-ccw {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .smoke-cloud-alt1 {
          animation: smoke-float-1 25s infinite linear, smoke-pulse 6s ease-in-out infinite;
        }
        .smoke-cloud-alt2 {
          animation: smoke-float-2 32s infinite linear, smoke-pulse 8s ease-in-out infinite;
        }
        .smoke-applying-filter {
          filter: url(#smoke-texture);
        }
      `}</style>

      {/* РЕАЛИСТИЧНЫЙ ЛЕВЫЙ ИНДУСТРИАЛЬНЫЙ ВОЗДУХОВОД И ДИФФУЗОР (ПО ФОТО) */}
      <motion.div
        initial={{ x: -500, opacity: 0 }}
        animate={{
          x: cleared > 2 ? 0 : -520,
          opacity: cleared > 96 ? 0 : 1
        }}
        transition={{ type: "spring", stiffness: 45, damping: 15 }}
        className="fixed left-[-20px] top-[30%] z-[10000] drop-shadow-[0_25px_45px_rgba(0,0,0,0.8)] pointer-events-none select-none scale-[0.55] md:scale-[0.75] origin-left"
      >
        <div className="relative flex items-center" style={{ perspective: "1000px", transformStyle: "preserve-3d" }}>
          {/* Вертикальный основной ствол (вертикальный спиральный воздуховод из фото) */}
          <div className="absolute left-[-20px] top-[-160px] w-24 h-96 bg-gradient-to-r from-zinc-600 via-zinc-200 to-zinc-700 border-x border-zinc-500 overflow-hidden shadow-[inset_0_8px_20px_rgba(255,255,255,0.4)] opacity-95">
            {/* Спирально-навивные ребра с тенью и бликом */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-50">
              {[...Array(14)].map((_, idx) => (
                <div 
                  key={idx} 
                  className="w-full h-2.5 bg-gradient-to-b from-black/40 via-white/30 to-black/50 transform -skew-y-[12deg] border-b border-zinc-650 shadow-[0_1px_1px_rgba(255,255,255,0.1)]"
                  style={{ marginTop: `${idx * 24}px` }}
                />
              ))}
            </div>
            {/* Отражение света вертикальное */}
            <div className="absolute left-[20%] top-0 bottom-0 w-3 bg-gradient-to-r from-white/50 to-transparent blur-[1.5px]" />
          </div>

          {/* Т-образный соединительный хомут / тройник ответвления */}
          <div className="absolute left-[-22px] top-[-30px] w-[92px] h-20 bg-gradient-to-b from-zinc-500 via-zinc-200 to-zinc-650 border border-zinc-400 rounded-sm shadow-md z-10 flex items-center justify-between px-1">
            <div className="w-[4px] h-[90%] bg-zinc-850 rounded opacity-75" />
            <div className="flex flex-col gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 border border-white/50 shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)]" />
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 border border-white/50 shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)]" />
            </div>
            <div className="w-[4px] h-[90%] bg-zinc-850 rounded opacity-75" />
          </div>

          {/* Горизонтальный спирально-навивной оцинкованный воздуховод (из фото) */}
          <div className="relative w-64 h-20 ml-12 bg-gradient-to-b from-zinc-650 via-zinc-200 to-zinc-700 border-y border-zinc-500 overflow-hidden flex shadow-[inset_0_6px_14px_rgba(255,255,255,0.55),0_12px_28px_rgba(0,0,0,0.6)] z-0">
            {/* Спиральные полосы оцинковки */}
            <div className="absolute inset-0 flex justify-between pointer-events-none opacity-50">
              {[...Array(11)].map((_, idx) => (
                <div 
                  key={idx} 
                  className="w-3.5 h-full bg-gradient-to-r from-black/40 via-white/30 to-black/50 transform -skew-x-[22deg] border-r border-black/35"
                  style={{ marginLeft: `${idx * 26}px` }}
                />
              ))}
            </div>
            {/* Ослепительные блики и продольные тени */}
            <div className="absolute inset-x-0 top-[12%] h-2 bg-gradient-to-b from-white/60 to-transparent blur-[1px]" />
            <div className="absolute inset-x-0 bottom-[22%] h-2 bg-gradient-to-t from-black/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-zinc-850" />
          </div>

          {/* Левое интерактивное табло телеметрии */}
          <div className="absolute left-[85px] top-[45px] pointer-events-auto flex flex-col gap-0.5 p-2 bg-zinc-950/90 backdrop-blur-md rounded-lg border border-white/10 shadow-2xl min-w-[210px] select-none transition-all duration-300 hover:border-zinc-500/30">
            <div className="flex items-center gap-1.5 w-full justify-between">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">Канал А: Приток</span>
              <div className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${modeConfig[fanMode].ledClass}`} />
                <span className={`text-[9px] font-mono font-bold ${modeConfig[fanMode].textColor}`}>{modeConfig[fanMode].label}</span>
              </div>
            </div>
            <div className="text-[18px] font-mono font-light text-white tracking-tight leading-none mt-1">
              {modeConfig[fanMode].rpm} <span className="text-[9px] text-zinc-500 uppercase font-bold">RPM</span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-1">
              <div 
                className="h-full transition-all duration-500" 
                style={{ 
                  width: fanMode === 'boost' ? '100%' : fanMode === 'eco' ? '55%' : fanMode === 'silent' ? '25%' : '0%',
                  backgroundColor: modeConfig[fanMode].color 
                }} 
              />
            </div>
            <span className="text-[8px] text-zinc-500 mt-1 cursor-pointer hover:text-white transition duration-200">
              🖱️ Клик по вентилятору для смены режима
            </span>
          </div>

          {/* ВЕНТИЛЯТОР С ЛОПАСТЯМИ, ПОДКЛЮЧЕННЫЙ НАПРЯМУЮ К ТРУБЕ (БЕЗ ТЯЖЕЛОЙ ОСНОВЫ) */}
          <div 
            onClick={() => {
              setFanMode((prev) => {
                if (prev === 'boost') return 'eco';
                if (prev === 'eco') return 'silent';
                if (prev === 'silent') return 'off';
                return 'boost';
              });
            }}
            className="absolute right-[-18px] top-1/2 w-24 h-24 rounded-full bg-zinc-950 flex items-center justify-center overflow-hidden ring-4 shadow-[10px_10px_25px_rgba(0,0,0,0.6)] z-20 pointer-events-auto cursor-pointer transition-all duration-500"
            style={{
              transform: "translateY(-50%) rotateY(42deg)",
              transformStyle: "preserve-3d",
              borderColor: modeConfig[fanMode].color,
              boxShadow: `0 10px 25px rgba(0,0,0,0.6), 0 0 15px ${modeConfig[fanMode].color}40`
            }}
          >
            {/* Dynamic Ambient backglow */}
            <div 
              className="absolute inset-[2px] rounded-full blur-[8px] opacity-25 transition-all duration-500"
              style={{ backgroundColor: modeConfig[fanMode].color }}
            />
            {/* Крутящиеся лопасти серповидной формы, расположенные прямо внутри и полностью видимые */}
            <div className="absolute inset-1 z-0">
              <SicklePropeller 
                duration={modeConfig[fanMode].duration} 
                isPaused={fanMode === 'off'} 
                modeColor={modeConfig[fanMode].color} 
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* РЕАЛИСТИЧНЫЙ ПРАВЫЙ ИНДУСТРИАЛЬНЫЙ ВОЗДУХОВОД И ДИФФУЗОР (ПО ФОТО) */}
      <motion.div
        initial={{ x: 500, opacity: 0 }}
        animate={{
          x: cleared > 2 ? 0 : 520,
          opacity: cleared > 96 ? 0 : 1
        }}
        transition={{ type: "spring", stiffness: 45, damping: 15 }}
        className="fixed right-[-20px] top-[30%] z-[10000] drop-shadow-[0_25px_45px_rgba(0,0,0,0.8)] pointer-events-none select-none scale-[0.55] md:scale-[0.75] origin-right"
      >
        <div className="relative flex items-center flex-row-reverse" style={{ perspective: "1000px", transformStyle: "preserve-3d" }}>
          {/* Вертикальный ствол справа */}
          <div className="absolute right-[-20px] top-[-160px] w-24 h-96 bg-gradient-to-r from-zinc-650 via-zinc-200 to-zinc-700 border-x border-zinc-500 overflow-hidden shadow-[inset_0_8px_20px_rgba(255,255,255,0.4)] opacity-95">
            {/* Спирально-навивные ребра с тенью и бликом */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-50">
              {[...Array(14)].map((_, idx) => (
                <div 
                  key={idx} 
                  className="w-full h-2.5 bg-gradient-to-b from-black/40 via-white/30 to-black/50 transform skew-y-[12deg] border-b border-zinc-650 shadow-[0_1px_1px_rgba(255,255,255,0.1)]"
                  style={{ marginTop: `${idx * 24}px` }}
                />
              ))}
            </div>
            {/* Отражение света вертикальное */}
            <div className="absolute right-[20%] top-0 bottom-0 w-3 bg-gradient-to-l from-white/50 to-transparent blur-[1.5px]" />
          </div>

          {/* Хомут крепления тройника справа */}
          <div className="absolute right-[-22px] top-[-30px] w-[92px] h-20 bg-gradient-to-b from-zinc-500 via-zinc-200 to-zinc-650 border border-zinc-400 rounded-sm shadow-md z-10 flex items-center justify-between px-1">
            <div className="w-[4px] h-[90%] bg-zinc-850 rounded opacity-75" />
            <div className="flex flex-col gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 border border-white/50 shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)]" />
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 border border-white/50 shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)]" />
            </div>
            <div className="w-[4px] h-[90%] bg-zinc-850 rounded opacity-75" />
          </div>

          {/* Горизонтальный воздуховод */}
          <div className="relative w-64 h-20 mr-12 bg-gradient-to-b from-zinc-650 via-zinc-200 to-zinc-700 border-y border-zinc-500 overflow-hidden flex shadow-[inset_0_6px_14px_rgba(255,255,255,0.55),0_12px_28px_rgba(0,0,0,0.6)] z-0">
            {/* Спиральные полосы оцинковки */}
            <div className="absolute inset-0 flex justify-between pointer-events-none opacity-50">
              {[...Array(11)].map((_, idx) => (
                <div 
                  key={idx} 
                  className="w-3.5 h-full bg-gradient-to-r from-black/40 via-white/30 to-black/50 transform skew-x-[22deg] border-r border-black/35"
                  style={{ marginLeft: `${idx * 26}px` }}
                />
              ))}
            </div>
            {/* Ослепительные блики и продольные тени */}
            <div className="absolute inset-x-0 top-[12%] h-2 bg-gradient-to-b from-white/60 to-transparent blur-[1px]" />
            <div className="absolute inset-x-0 bottom-[22%] h-2 bg-gradient-to-t from-black/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-zinc-850" />
          </div>

          {/* Правое интерактивное табло телеметрии */}
          <div className="absolute right-[85px] top-[45px] pointer-events-auto flex flex-col gap-0.5 p-2 bg-zinc-950/90 backdrop-blur-md rounded-lg border border-white/10 shadow-2xl min-w-[210px] select-none transition-all duration-300 hover:border-zinc-500/30">
            <div className="flex items-center gap-1.5 w-full justify-between">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">Канал Б: Вытяжка</span>
              <div className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${modeConfig[fanMode].ledClass}`} />
                <span className={`text-[9px] font-mono font-bold ${modeConfig[fanMode].textColor}`}>{modeConfig[fanMode].label}</span>
              </div>
            </div>
            <div className="text-[18px] font-mono font-light text-white tracking-tight leading-none mt-1">
              {modeConfig[fanMode].rpm} <span className="text-[9px] text-zinc-500 uppercase font-bold">RPM</span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-1">
              <div 
                className="h-full transition-all duration-500" 
                style={{ 
                  width: fanMode === 'boost' ? '100%' : fanMode === 'eco' ? '55%' : fanMode === 'silent' ? '25%' : '0%',
                  backgroundColor: modeConfig[fanMode].color 
                }} 
              />
            </div>
            <span className="text-[8px] text-zinc-500 mt-1 cursor-pointer hover:text-white transition duration-200">
              🖱️ Клик по вытяжке для смены режима
            </span>
          </div>

          {/* ВЕНТИЛЯТОР С ЛОПАСТЯМИ, ПОДКЛЮЧЕННЫЙ НАПРЯМУЮ К ТРУБЕ (СПРАВА, БЕЗ ТЯЖЕЛОЙ ОСНОВЫ) */}
          <div 
            onClick={() => {
              setFanMode((prev) => {
                if (prev === 'boost') return 'eco';
                if (prev === 'eco') return 'silent';
                if (prev === 'silent') return 'off';
                return 'boost';
              });
            }}
            className="absolute left-[-18px] top-1/2 w-24 h-24 rounded-full bg-zinc-950 flex items-center justify-center overflow-hidden ring-4 shadow-[10px_10px_25px_rgba(0,0,0,0.6)] z-20 pointer-events-auto cursor-pointer transition-all duration-500"
            style={{
              transform: "translateY(-50%) rotateY(-42deg)",
              transformStyle: "preserve-3d",
              borderColor: modeConfig[fanMode].color,
              boxShadow: `0 10px 25px rgba(0,0,0,0.6), 0 0 15px ${modeConfig[fanMode].color}40`
            }}
          >
            {/* Dynamic Ambient backglow */}
            <div 
              className="absolute inset-[2px] rounded-full blur-[8px] opacity-25 transition-all duration-500"
              style={{ backgroundColor: modeConfig[fanMode].color }}
            />
            {/* Крутящиеся лопасти серповидной формы с реверсивным вращением полностью открытые */}
            <div className="absolute inset-1 z-0">
              <SicklePropeller 
                duration={modeConfig[fanMode].duration} 
                reverse={true} 
                isPaused={fanMode === 'off'} 
                modeColor={modeConfig[fanMode].color} 
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Интерактивные пролетающие всасываемые пылинки во время движения к вентиляторам */}
      {hasInteracted && cleared < 95 && (
        <div className="absolute inset-0 z-25 pointer-events-none overflow-hidden animate-pulse">
          {Array.from({ length: 18 }).map((_, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div
                key={i}
                className="absolute w-1.5 md:w-2.5 h-1.5 md:h-2.5 rounded-full bg-zinc-200/40 blur-[1px] transition-all duration-[1.5s] ease-[ease-out]"
                style={{
                  left: isLeft ? "5%" : "95%",
                  top: "35%",
                  opacity: 0
                }}
              />
            );
          })}
        </div>
      )}

      {/* КЛУБЫ ДЫМА С SVG-ТЕКСТУРОЙ ФРАКТАЛЬНОГО ШУМА, КАК НА КАРТИНКЕ */}
      <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
        {smokeClouds.map((cloud) => {
          const isLeft = cloud.side === "left";
          
          const startPercentX = parseFloat(cloud.startX);
          const startPercentY = parseFloat(cloud.startY);

          const startPxX = (startPercentX / 100) * winSize.width;
          const startPxY = (startPercentY / 100) * winSize.height;

          const targetPxX = isLeft ? 224 : winSize.width - 224;
          const targetPxY = 0.38 * winSize.height;

          const deltaX = targetPxX - startPxX;
          const deltaY = targetPxY - startPxY;
          const targetScale = 0.04; 

          return (
            <motion.div
              key={cloud.id}
              initial={{
                x: 0,
                y: 0,
                scale: 1,
                opacity: cloud.opacity
              }}
              animate={{
                // Межпиксельное втягивание точно в цель по мере накопления cleared с использованием чистых чисел
                x: cleared > 0 ? (cleared / 100) * deltaX : 0,
                y: cleared > 0 ? (cleared / 100) * deltaY : 0,
                scale: cleared > 0 ? 1 - (cleared / 100) * (1 - targetScale) : 1,
                opacity: cleared > 0 ? Math.max(0, cloud.opacity * (1 - (cleared / 100) * 1.15)) : cloud.opacity,
              }}
              transition={{
                // Эффектное и молниеносное упругое всасывание
                x: { type: "spring", stiffness: 150, damping: 20, mass: 0.6 },
                y: { type: "spring", stiffness: 150, damping: 20, mass: 0.6 },
                scale: { type: "spring", stiffness: 120, damping: 22 },
                opacity: { type: "tween", duration: 0.6, ease: "easeOut" },
              }}
              className="absolute smoke-applying-filter"
              style={{
                left: cloud.startX,
                top: cloud.startY,
                width: `${cloud.size}px`,
                height: `${cloud.size}px`,
              }}
            >
              {/* Внутренний контейнер с чистым CSS для непрекращающегося вращения и парения */}
              <div 
                className={`w-full h-full rounded-full bg-gradient-to-br ${getGradientClasses(cloud.cloudType)} ${
                  cloud.pulseSpeed % 2 === 0 ? "smoke-cloud-alt1" : "smoke-cloud-alt2"
                }`}
                style={{
                  filter: `blur(${cloud.blurLevel}px)`,
                  animationDuration: `${cloud.rotationSpeed * 1.5}s, ${cloud.pulseSpeed * 2}s`
                }}
              />
            </motion.div>
          );
        })}

        {/* Дополнительный светлый бэкграунд-слой пелены для идеального заполнения без зазоров */}
        <motion.div
          animate={{
            opacity: Math.max(0, 0.90 - cleared / 100)
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-b from-white/10 via-zinc-100/5 to-transparent"
        />
      </div>

      {/* Текст "Двигайте курсором" с мягким дымчатым свечением */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: hasInteracted ? 0 : 1, scale: hasInteracted ? 0.95 : 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="fixed inset-0 z-[11000] flex items-center justify-center pointer-events-none select-none px-6 text-center"
      >
        <div className="relative">
          {/* Свечение за текстом */}
          <div className="absolute inset-0 bg-white/40 blur-3xl scale-150 rounded-full" />
          <span className="relative text-zinc-800 text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.25em] uppercase drop-shadow-[0_2px_12px_rgba(255,255,255,1)] animate-pulse">
            Двигайте курсором
          </span>
        </div>
      </motion.div>
    </>
  );
}
