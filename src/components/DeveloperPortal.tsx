import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wind, 
  Snowflake, 
  Droplets, 
  Sliders, 
  Sparkles, 
  Thermometer, 
  Activity, 
  Compass, 
  CheckCircle2, 
  Cpu, 
  Gauge, 
  TrendingDown, 
  Coins 
} from 'lucide-react';

export default function DeveloperPortal({ addNotification }: { addNotification: (message: string, type?: 'success' | 'info') => void }) {
  const [activeSystem, setActiveSystem] = useState<'ventilation' | 'conditioning' | 'humidification'>('ventilation');
  
  // Interactive simulator states
  const [ventPower, setVentPower] = useState<number>(350); // Air flow rate in m3/h
  const [acTemp, setAcTemp] = useState<number>(22); // AC temperature
  const [humLevel, setHumLevel] = useState<number>(45); // Humidity percentage
  const [isAnionActive, setIsAnionActive] = useState<boolean>(true);
  const [isSilentMode, setIsSilentMode] = useState<boolean>(false);

  // Computed metrics based on simulator values
  const computedCo2 = Math.max(380, Math.round(1000 - (ventPower - 100) * 1.1));
  const computedNoise = isSilentMode 
    ? Math.round(18 + (activeSystem === 'ventilation' ? ventPower * 0.015 : activeSystem === 'conditioning' ? acTemp * 0.1 : humLevel * 0.1))
    : Math.round(23 + (activeSystem === 'ventilation' ? ventPower * 0.025 : activeSystem === 'conditioning' ? (30-acTemp) * 0.4 : humLevel * 0.15));
  
  const handleSystemAction = (systemName: string) => {
    addNotification(`Заявка на расчет конфигурации: "${systemName}" принята! Наш инженер свяжется с вами для согласования проекта.`, 'success');
  };

  const systemsData = {
    ventilation: {
      title: 'Приточная вентиляция',
      subtitle: 'Система очистки и подачи свежего кислорода',
      badge: 'СВЕЖИЙ ВОЗДУХ 24/7',
      desc: 'Обеспечивает непрерывное нагнетание свежего уличного воздуха с эффективной фильтрацией от пыльцы Allergen-Free и пыли PM2.5. Интегрированный рекуператор утилизирует тепло уходящего воздуха, экономя до 80% затрат на отопление.',
      image: '/images/duct-system.png',
      fallbackImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      accentColor: 'from-blue-500 to-cyan-400',
      textAccent: 'text-blue-400',
      bgLight: 'bg-blue-500/10 border-blue-500/20',
      specs: [
        { label: 'Расход воздуха', value: `${ventPower} м³/час`, desc: 'Регулируется плавно' },
        { label: 'Уровень CO₂', value: `${computedCo2} ppm`, desc: 'Норма < 600 ppm' },
        { label: 'КПД рекуперации', value: 'До 85%', desc: 'Керамический теплообменник' },
        { label: 'Фильтрация', value: 'HEPA H13 + Угольный', desc: 'Удержание 99.97% частиц' }
      ],
      features: [
        'Многоступенчатый пылевой и запаховый фильтр класса медицинских стандартов',
        'Интеллектуальные ЕС-вентиляторы с минимальным энергопотреблением',
        'Гибкие шумоглушители глушат любые аэродинамические шумы во всех комнатах',
        'Автоматический подогрев притока в зимний период с датчиком антизамерзания'
      ]
    },
    conditioning: {
      title: 'Кондиционирование',
      subtitle: 'Скрытые сплит-системы круглогодичного климат-контроля',
      badge: 'КОМФОРТНАЯ ПРОХЛАДА',
      desc: 'Инверторные канальные и мульти-сплит системы Dantex и Mitsubishi. Монтируются скрытно за потолком, подавая охлажденный или прогретый воздух через стильные щелевые диффузоры без сквозняков.',
      image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80',
      fallbackImage: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=800&q=80',
      accentColor: 'from-cyan-500 to-sky-400',
      textAccent: 'text-cyan-400',
      bgLight: 'bg-cyan-500/10 border-cyan-500/20',
      specs: [
        { label: 'Заданная температура', value: `${acTemp} °C`, desc: '±0.1°С ультратонкий контроль' },
        { label: 'Класс энергоэффективности', value: 'A+++ / SEER 8.5', desc: 'Двойной роторный DC компрессор' },
        { label: 'Режимы работы', value: acTemp <= 21 ? 'Охлаждение' : 'Обогрев', desc: 'Авто-коррекция потока' },
        { label: 'Тип фреона', value: 'Экологичный R32', desc: 'Безопасен для экологии' }
      ],
      features: [
        'Установка внутренних блоков скрытого типа за фальш-потолком коридоров или гардеробных',
        'Плавная работа инвертора полностью компенсирует колебания тепловой нагрузки',
        'Эффективный обогрев помещения при уличной температуре до -25°С снаружи',
        'Интеграция с общей системой автоматизации "Умный Дом" (Modbus/KNX)'
      ]
    },
    humidification: {
      title: 'Системы увлажнения',
      subtitle: 'Прямое форсуночное увлажнение ультрачистой водой',
      badge: 'ПРАВИЛЬНЫЙ МИКРОКЛИМАТ',
      desc: 'Автоматические адиабатические системы увлажнения воздуха Buhler-AHS. Прямое распыление глубоко очищенной воды через незаметные форсунки поддерживает здоровый уровень относительной влажности для дыхания и сохранности паркета.',
      image: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=800&q=80',
      fallbackImage: 'https://images.unsplash.com/photo-1527685216219-c7ffd79b97ee?auto=format&fit=crop&w=800&q=80',
      accentColor: 'from-teal-500 to-emerald-400',
      textAccent: 'text-emerald-400',
      bgLight: 'bg-emerald-500/10 border-emerald-500/20',
      specs: [
        { label: 'Влажность в комнатах', value: `${humLevel}% RH`, desc: 'Норма 40% - 60%' },
        { label: 'Степень очистки воды', value: '99.99%', desc: 'Двойной обратный осмос + УФ' },
        { label: 'Расход воды', value: `${(humLevel * 0.08).toFixed(1)} л/час`, desc: 'Экономичное дозирование' },
        { label: 'Зонирование влажности', value: 'Мультизональное', desc: 'Индивидуально для каждой комнаты' }
      ],
      features: [
        'Использование высоконапорных трубок из тефлона и миниатюрных сопел из нержавеющей стали',
        'Абсолютно стерильный пар: вода очищается на молекулярном уровне, исключая белый налет',
        'Защита натурального паркета, картин, мебели из массива дерева от усыхания и трещин',
        'Существенное снижение летающей пыли, вирусов и аллергенов за счет связывания частиц'
      ]
    }
  };

  const currentSys = systemsData[activeSystem];

  return (
    <div className="w-full text-white space-y-6" id="system-configurations-explorer">
      {/* Upper selector navigation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono tracking-wider uppercase text-blue-400 flex items-center gap-1.5">
            <Cpu className="h-3 w-3 animate-pulse" />
            Инженерная архитектура климата
          </span>
          <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-white font-sans">
            Параметры и Силовые Компоненты Систем
          </h3>
          <p className="text-xs text-slate-400 font-light max-w-xl">
            Изучите техническое устройство систем жизнедеятельности дома. Воспользуйтесь симулятором справа, чтобы увидеть показатели в реальном времени.
          </p>
        </div>

        {/* Choice selector buttons */}
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 shrink-0 gap-1.5 self-start md:self-end">
          <button
            onClick={() => setActiveSystem('ventilation')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-300 ${
              activeSystem === 'ventilation'
                ? 'bg-blue-600 text-white shadow-md border border-blue-400/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Wind className="h-4 w-4" />
            <span>Вентиляция</span>
          </button>
          <button
            onClick={() => setActiveSystem('conditioning')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-300 ${
              activeSystem === 'conditioning'
                ? 'bg-cyan-600 text-white shadow-md border border-cyan-400/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Snowflake className="h-4 w-4" />
            <span>Кондиционирование</span>
          </button>
          <button
            onClick={() => setActiveSystem('humidification')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-300 ${
              activeSystem === 'humidification'
                ? 'bg-teal-600 text-white shadow-md border border-teal-400/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Droplets className="h-4 w-4" />
            <span>Увлажнение</span>
          </button>
        </div>
      </div>

      {/* Grid Layout of Active System details and interactive simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left column: Technical specifications and highlights */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase border ${currentSys.bgLight}`}>
              <span className={`w-1.5 h-1.5 rounded-full bg-current ${activeSystem === 'ventilation' ? 'animate-pulse' : ''}`} />
              <span className={`font-semibold ${currentSys.textAccent}`}>{currentSys.badge}</span>
            </div>

            <h4 className="text-xl sm:text-2xl font-medium tracking-tight text-white mb-2 leading-tight">
              {currentSys.title}
            </h4>

            <p className="text-xs sm:text-[13.5px] text-slate-350 leading-relaxed font-light">
              {currentSys.desc}
            </p>

            {/* Core Characteristics grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {currentSys.specs.map((spec, sIdx) => (
                <div key={sIdx} className="bg-white/5 border border-white/5 p-3.5 rounded-2xl flex flex-col justify-between space-y-1">
                  <span className="text-[9px] font-mono uppercase text-slate-450 tracking-wider font-semibold">{spec.label}</span>
                  <span className={`text-base sm:text-lg font-bold tracking-tight ${currentSys.textAccent}`}>{spec.value}</span>
                  <span className="text-[10px] text-slate-400 font-light">{spec.desc}</span>
                </div>
              ))}
            </div>

            {/* bullet list items */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-mono uppercase text-slate-450 font-semibold tracking-wider block">
                Конструктивные особенности решения:
              </span>
              <ul className="space-y-2">
                {currentSys.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300 font-light">
                    <span className={`h-4.5 w-4.5 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5 border border-blue-500/20 ${currentSys.textAccent}`}>
                      <CheckCircle2 className="h-3 w-3" />
                    </span>
                    <span className="leading-relaxed">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Call to action panel */}
          <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-[11px] text-slate-400 font-light">
              <Sparkles className="h-4.5 w-4.5 text-yellow-500 animate-pulse" />
              <span>Проектирование систем в соответствии с ГОСТ и СНиП</span>
            </div>
            <button
              onClick={() => handleSystemAction(currentSys.title)}
              className={`w-full sm:w-auto bg-gradient-to-r ${currentSys.accentColor} text-neutral-950 font-semibold text-xs py-3.5 px-6 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-lg active:scale-95`}
            >
              <span>Подобрать спецификацию</span>
              <Compass className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right column: Interactive Simulation Sandbox Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          
          {/* Simulation Display Frame */}
          <div className="relative min-h-[300px] lg:min-h-[340px] bg-neutral-980 border border-white/10 rounded-[2.5rem] overflow-hidden p-5 flex flex-col justify-between shadow-dark-xl">
            
            {/* Ambient image backdrop representing technical schematics */}
            <div className="absolute inset-0 z-0">
              <img
                src={currentSys.image}
                alt={currentSys.title}
                onError={(e) => {
                  // Fallback if local image cannot be found
                  e.currentTarget.src = currentSys.fallbackImage;
                }}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-15 filter saturate-[15%] contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/85 to-neutral-950/20" />
            </div>

            {/* Dynamic Real-time telemetry banner */}
            <div className="relative z-10 flex justify-between items-center text-[9px] font-mono bg-black/60 px-3 py-1.5 rounded-lg border border-white/5 backdrop-blur-md text-white/60">
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full bg-emerald-500 ${isSilentMode ? 'opacity-80' : 'animate-ping'}`} />
                <span>ОБОРУДОВАНИЕ: АКТИВНО</span>
              </span>
              <span>ИНТЕГРАЦИОННЫЙ КЛИМАТ-ПАКЕТ</span>
            </div>

            {/* Centered Graphic Simulation Showcase */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-6 space-y-4">
              
              {/* Ventilation Simulation */}
              {activeSystem === 'ventilation' && (
                <div className="w-full flex flex-col items-center space-y-5 text-center">
                  <div className="relative">
                    <div className="absolute -inset-3 rounded-full border border-dashed border-blue-500/20 animate-spin [animation-duration:15s]" />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ 
                        duration: Math.max(0.4, 4 - (ventPower / 150)), 
                        repeat: Infinity, 
                        ease: 'linear' 
                      }}
                      className="w-16 h-16 bg-blue-500/10 border border-blue-500/35 rounded-full flex items-center justify-center text-blue-400"
                    >
                      <Wind className="h-9 w-9" />
                    </motion.div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xl font-mono font-bold text-blue-300">
                      {ventPower} <span className="text-xs text-slate-400">м³/час</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5 justify-center">
                      <span>Скорость воздухообмена:</span>
                      <span className="text-emerald-400 font-medium">Безупречная</span>
                    </div>
                  </div>

                  {/* Controller slider */}
                  <div className="w-full bg-black/50 p-3 rounded-2xl border border-white/5 space-y-1.5 backdrop-blur-md">
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span>Комнатный приток воздуха:</span>
                      <span className="font-mono font-bold text-blue-400">{ventPower} м³/ч</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="650"
                      step="25"
                      value={ventPower}
                      onChange={(e) => setVentPower(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-[8px] font-mono text-white/30">
                      <span>Минимум (100)</span>
                      <span>Для семьи (350)</span>
                      <span>Турбо (650)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Conditioning Temperature simulation */}
              {activeSystem === 'conditioning' && (
                <div className="w-full flex flex-col items-center space-y-5 text-center">
                  {/* Digital cooling widget */}
                  <div className="relative flex flex-col items-center justify-center bg-cyan-950/30 w-24 h-24 rounded-full border border-cyan-500/25 shadow-xl backdrop-blur-sm">
                    <Thermometer className="h-5 w-5 text-cyan-400 animate-pulse" />
                    <span className="text-2xl font-mono font-bold text-cyan-300 mt-1">{acTemp}°C</span>
                    <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">ЦЕЛЬ</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 block font-light">Внутренний блок инвертора:</span>
                    <span className="text-xs font-semibold text-slate-300">
                      {acTemp <= 20 ? 'Режим быстрого охлаждения❄️' : acTemp >= 25 ? 'Режим эко-обогрева водяным контуром🔥' : 'Автоматическое климатическое удержание комфорта🏡'}
                    </span>
                  </div>

                  {/* Range Thermostat control */}
                  <div className="w-full bg-black/50 p-3 rounded-2xl border border-white/5 space-y-1.5 backdrop-blur-md">
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span>Настройка климат-контроля:</span>
                      <span className="font-mono font-bold text-cyan-300">{acTemp}°C</span>
                    </div>
                    <input
                      type="range"
                      min="16"
                      max="28"
                      value={acTemp}
                      onChange={(e) => setAcTemp(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                    <div className="flex justify-between text-[8px] font-mono text-white/30">
                      <span>Охлаждение (16°C)</span>
                      <span>Идеал (21-23°C)</span>
                      <span>Обогрев (28°C)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Humidification mist simulation */}
              {activeSystem === 'humidification' && (
                <div className="w-full flex flex-col items-center space-y-5 text-center">
                  
                  {/* Floating mist loops visualizer */}
                  <div className="h-16 w-full flex items-end justify-center gap-2 relative">
                    {[1, 2, 3, 4, 5, 6, 7].map((itm) => (
                      <motion.div
                        key={itm}
                        animate={{
                          y: [0, -35 - (itm * 4) % 15, 0],
                          opacity: [0, 0.8, 0],
                          scale: [1, 1.1 + (itm * 0.1), 0.7]
                        }}
                        transition={{
                          duration: 1.2 + (itm * 0.2) % 1.4,
                          repeat: Infinity,
                          delay: itm * 0.2,
                          ease: 'easeInOut'
                        }}
                        className="h-2 w-2 rounded-full bg-teal-400/30 filter blur-[1px]"
                      />
                    ))}
                    <div className="absolute top-2 text-xl font-mono text-teal-300 font-bold bg-teal-950/40 border border-teal-500/20 px-3 py-1 rounded-xl backdrop-blur-md">
                      {humLevel}% <span className="text-xs text-slate-400">RH</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 block font-mono uppercase">Пьезо-форсунка Buhler</span>
                    <span className="text-xs font-semibold text-teal-200">
                      Поддержание здоровой слизистой и защита от вирусов
                    </span>
                  </div>

                  {/* Humidity adjust slider */}
                  <div className="w-full bg-black/50 p-3 rounded-2xl border border-white/5 space-y-1.5 backdrop-blur-md">
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span>Настройка датчика влажности:</span>
                      <span className="font-mono font-bold text-teal-300">{humLevel}% RH</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="70"
                      value={humLevel}
                      onChange={(e) => setHumLevel(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-teal-400"
                    />
                    <div className="flex justify-between text-[8px] font-mono text-white/30">
                      <span>Сухость (30%)</span>
                      <span>Комфорт (45-55%)</span>
                      <span>Тропики (70%)</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Telemetry quick indicators bar */}
            <div className="relative z-10 grid grid-cols-2 gap-4 bg-black/70 p-3 rounded-2xl border border-white/5 backdrop-blur-md">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono text-slate-400">АКУСТИЧЕСКИЙ ШУМ:</span>
                <span className="text-[11px] font-mono text-white font-semibold">{computedNoise} dBa</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono text-slate-400">АВТОМАТИКА:</span>
                <button 
                  onClick={() => {
                    setIsSilentMode(!isSilentMode);
                    addNotification(isSilentMode ? 'Включен штатный форсированный режим вентиляции.' : 'Активирован бесшумный ночной пресет климата (до 19 дБа).', 'info');
                  }}
                  className={`text-[9.5px] px-2 py-0.5 rounded border transition font-mono ${
                    isSilentMode 
                      ? 'bg-emerald-500/25 border-emerald-400/40 text-emerald-300' 
                      : 'bg-white/5 border-white/10 text-slate-350 hover:text-white'
                  }`}
                >
                  {isSilentMode ? 'БЕСШУМНЫЙ' : 'НОРМА'}
                </button>
              </div>
            </div>

          </div>

          {/* Quick Informational Notice block under context */}
          <div className="bg-white/5 border border-white/10 p-3.5 rounded-2.5xl flex gap-3 text-xs items-start">
            <Gauge className={`h-5 w-5 ${currentSys.textAccent} shrink-0 mt-0.5`} />
            <div className="space-y-0.5">
              <h5 className="text-[11.5px] font-bold text-white leading-none">Объединенный мультиклиматический центр</h5>
              <p className="text-[10.5px] text-slate-400 font-light leading-relaxed">
                Все три климатические системы сводятся в единый щит автоматики с контроллерами Carel или Siemens для синхронизации притока, холода и влажности под ваш проект.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
