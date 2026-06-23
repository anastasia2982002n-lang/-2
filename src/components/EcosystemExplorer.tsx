import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Settings, Sparkles, Play, Pause, ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck, Clock, FileText, HardDrive } from 'lucide-react';

import stepInspectionImg from '../assets/images/step_inspection_1782125635108.jpg';
import stepBlueprintImg from '../assets/images/step_blueprint_1782125651556.jpg';
import stepEquipmentImg from '../assets/images/step_equipment_1782125667950.jpg';

interface EcosystemExplorerProps {
  userWallet: { rivr: number; usdc: number; nfts: number };
  setUserWallet: React.Dispatch<React.SetStateAction<{ rivr: number; usdc: number; nfts: number }>>;
  addNotification: (message: string, type?: 'success' | 'info') => void;
}

export default function EcosystemExplorer({ userWallet, setUserWallet, addNotification }: EcosystemExplorerProps) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const steps = [
    {
      title: "Выезд и осмотр",
      subtitle: "Первичный технический аудит объекта",
      desc: "Наш ведущий инженер приезжает на ваш объект для детального замера параметров помещений, оценки существующих вентиляционных шахт, замера уровня углекислого газа CO₂ и определения мест будущего размещения оборудования.",
      icon: Eye,
      image: stepInspectionImg,
      color: "from-amber-500 to-orange-500",
      accentColor: "text-amber-400",
      bgColor: "bg-amber-500/10 border-amber-500/20",
      duration: "1 день",
      document: "Техническое задание и замерный лист",
      checkpoints: [
        "Оценка естественной тяги и вентиляционных каналов",
        "Инженерные замеры высот потолков и проемов",
        "Определение возможных путей прокладки воздуховодов",
        "Согласование предварительного бюджета микроклимата"
      ]
    },
    {
      title: "Проект и решение",
      subtitle: "Разработка рабочей документации",
      desc: "Проектировщики компании создают воздушный баланс помещений по нормам СНиП, рассчитывают производительность установок, сечения воздуховодов и уровень шума. Мы подготавливаем детальные чертежи в 3D для бесконфликтной интеграции с дизайн-проектом.",
      icon: Settings,
      image: stepBlueprintImg,
      color: "from-cyan-500 to-blue-500",
      accentColor: "text-cyan-400",
      bgColor: "bg-cyan-500/10 border-cyan-500/20",
      duration: "3-5 дней",
      document: "Рабочий проект вентиляции и кондиционирования",
      checkpoints: [
        "Расчёт кратности воздухообмена по каждой комнате",
        "Трассировка воздуховодов и размещение диффузоров",
        "Оптимизация трасс под зашивку потолков",
        "Спецификация премиального бесшумного оборудования"
      ]
    },
    {
      title: "Поставка и монтаж",
      subtitle: "Монтаж оборудования под ключ",
      desc: "Доставляем сертифицированное климатическое оборудование на объект. Профессиональная бригада осуществляет аккуратную сборку воздуховодов, установку шумоглушителей, монтаж приточных установок, пусконаладочные работы и балансировку системы.",
      icon: Sparkles,
      image: stepEquipmentImg,
      color: "from-emerald-500 to-teal-500",
      accentColor: "text-emerald-400",
      bgColor: "bg-emerald-500/10 border-emerald-500/20",
      duration: "2-7 дней",
      document: "Акт индивидуального испытания и гарантийный талон",
      checkpoints: [
        "Сборка воздуховодных систем с герметизацией стыков",
        "Монтаж виброизолированных приточно-вытяжных машин",
        "Интеграция датчиков автоматики безопасности",
        "Запуск, калибровка анемометром и сдача в эксплуатацию"
      ]
    }
  ];

  // Auto-play steps logic
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  const currentStep = steps[activeStep];
  const StepIcon = currentStep.icon;

  const handleNext = () => {
    setIsPlaying(false);
    setActiveStep((prev) => (prev + 1) % steps.length);
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setActiveStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  return (
    <div className="space-y-6 text-white py-2" id="reverted-ecosystem-stages">
      {/* Main stage details inside a clean single-view block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left column: specs and checkpoints */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Step indicators */}
            <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10 shrink-0 w-max mb-2">
              {steps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveStep(idx);
                    setIsPlaying(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition ${
                    activeStep === idx
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono border ${currentStep.bgColor}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              <span>{currentStep.subtitle}</span>
            </div>

            <h4 className="text-xl sm:text-2xl font-medium tracking-tight text-white">
              {activeStep + 1}. {currentStep.title}
            </h4>

            <p className="text-xs sm:text-[13.5px] text-slate-350 leading-relaxed font-light">
              {currentStep.desc}
            </p>

            {/* Checkpoints list */}
            <div className="space-y-2.5 pt-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold tracking-wider block">
                Основные работы на этапе:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentStep.checkpoints.map((checkpoint, cIdx) => (
                  <div key={cIdx} className="flex items-start gap-2 text-xs text-slate-300 font-light">
                    <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${currentStep.accentColor}`} />
                    <span className="leading-relaxed">{checkpoint}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Metadata items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl">
              <Clock className={`h-5 w-5 ${currentStep.accentColor}`} />
              <div>
                <span className="block text-[8px] font-mono uppercase text-slate-400">Сроки проведения</span>
                <span className="text-xs font-medium text-white">{currentStep.duration}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-2xl">
              <FileText className={`h-5 w-5 ${currentStep.accentColor}`} />
              <div>
                <span className="block text-[8px] font-mono uppercase text-slate-400">Итоговый документ</span>
                <span className="text-xs font-medium text-white">{currentStep.document}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Image preview & Slider controls */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          
          {/* Main Visual Box */}
          <div className="relative min-h-[220px] lg:min-h-[280px] bg-neutral-950 rounded-2.5xl border border-white/10 overflow-hidden shadow-2xl flex flex-col justify-between p-4">
            
            {/* Background image preview with spring transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={currentStep.image}
                  alt={currentStep.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-35 filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Upper label bar */}
            <div className="relative flex justify-between items-center w-full text-[9px] font-mono text-white/50 bg-black/60 px-2.5 py-1.5 rounded-lg border border-white/5 backdrop-blur-md">
              <span className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse bg-blue-400`} />
                <span>ЭТАП {activeStep + 1} ИЗ {steps.length}</span>
              </span>
              <span>RIVR ИНЖЕНЕРИЯ</span>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Bottom Slider & Play Control Panel overlay */}
            <div className="relative flex justify-between items-center bg-black/75 p-2 rounded-xl border border-white/5 backdrop-blur-md">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition active:scale-95 cursor-pointer border border-white/5"
                  title={isPlaying ? "Приостановить автопрокрутку" : "Запустить автопрокрутку"}
                >
                  {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                </button>
                <span className="text-[10px] font-mono text-white/40">
                  {isPlaying ? "Автопрокрутка..." : "Пауза"}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrev}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition active:scale-95 cursor-pointer border border-white/5"
                  title="Назад"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition active:scale-95 cursor-pointer border border-white/5"
                  title="Вперед"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Quick Notice block */}
          <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl flex gap-3 text-xs">
            <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-slate-350 leading-relaxed font-light text-[11px]">
              Безупречная точность согласования каждого этапа гарантирует сдачу всей вентиляционной системы строго в оговоренные сроки с сохранением фиксированной сметы.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
