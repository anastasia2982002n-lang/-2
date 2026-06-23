import React from 'react';
import { Search, Compass, Cpu, Calculator, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function EconomicsBreakdown() {
  const steps = [
    {
      number: '01',
      title: 'Осмотр помещения',
      description: 'Инженер на месте изучит все особенности вашего помещения.',
      icon: Search,
      badgeText: 'Выезд инженера',
      bgGlow: 'from-blue-600/10 to-transparent',
      borderColor: 'group-hover:border-blue-500/40',
      textColor: 'text-blue-400',
      bgCircle: 'bg-blue-500/10'
    },
    {
      number: '02',
      title: 'Создаем проект',
      description: 'Проектируем установку системы по плану вашего помещения.',
      icon: Compass,
      badgeText: 'Чертежи и схемы',
      bgGlow: 'from-cyan-600/10 to-transparent',
      borderColor: 'group-hover:border-cyan-500/40',
      textColor: 'text-cyan-400',
      bgCircle: 'bg-cyan-500/10'
    },
    {
      number: '03',
      title: 'Подбор системы',
      description: 'Подбираем состав системы в соответствии с назначением помещений, площадью, нагрузкой, оборудованием, уровнем шума, влажностью и требуемой эксплуатацией.',
      icon: Cpu,
      badgeText: 'Расчет параметров',
      bgGlow: 'from-sky-600/10 to-transparent',
      borderColor: 'group-hover:border-sky-500/40',
      textColor: 'text-sky-400',
      bgCircle: 'bg-sky-500/10'
    },
    {
      number: '04',
      title: 'Расчет сметы',
      description: 'Рассчитаем смету на основе технического решения.',
      icon: Calculator,
      badgeText: 'Коммерческое предложение',
      bgGlow: 'from-indigo-600/10 to-transparent',
      borderColor: 'group-hover:border-indigo-500/40',
      textColor: 'text-indigo-400',
      bgCircle: 'bg-indigo-500/10'
    }
  ];

  return (
    <div className="space-y-10 text-white py-2" id="work-stages-container">
      {/* Header section with clean descriptive styling */}
      <div className="space-y-3 max-w-2xl">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium tracking-wide">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse inline-block" />
          Пошаговый процесс
        </div>
        <h3 className="text-2xl sm:text-3xl font-medium tracking-tight hero-text-gradient font-sans">
          Этапы работы над вашим объектом
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
          Мы берем на себя весь цикл разработки — от первичного инженерного осмотра до финального расчета сметы и подбора оборудования.
        </p>
      </div>

      {/* Grid of elegantly interactive steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="work-stages-grid">
        {steps.map((st, idx) => {
          const IconComponent = st.icon;
          return (
            <div
              key={st.number}
              id={`step-card-${st.number}`}
              className="group relative bg-[#0b101c]/40 border border-white/5 rounded-3xl p-6 lg:p-8 flex flex-col justify-between overflow-hidden hover:bg-[#0b101c]/70 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              {/* Radial backdrop light on hover */}
              <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${st.bgGlow} filter blur-3xl rounded-full opacity-30 group-hover:opacity-75 transition-all duration-500 pointer-events-none`} />
              
              {/* Top Row: Number and Icon */}
              <div className="flex items-start justify-between relative z-10">
                <div className="space-y-1">
                  <span className={`text-4xl font-mono font-bold ${st.textColor} opacity-90 tracking-tighter block`}>
                    {st.number}
                  </span>
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                    {st.badgeText}
                  </span>
                </div>
                <div className={`p-3.5 rounded-2xl ${st.bgCircle} ${st.textColor} border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="h-5 w-5" />
                </div>
              </div>

              {/* Middle Row: Content */}
              <div className="mt-6 md:mt-8 space-y-2 relative z-10">
                <h4 className="text-lg font-medium text-white/95 group-hover:text-white transition-colors">
                  {st.title}
                </h4>
                <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed font-light">
                  {st.description}
                </p>
              </div>

              {/* Subtle accent border line at the bottom */}
              <div className={`absolute bottom-0 left-0 w-0 h-[3px] bg-gradient-to-r from-blue-500 to-cyan-400 group-hover:w-full transition-all duration-300`} />
            </div>
          );
        })}
      </div>

      {/* Symmetrical helpful suggestion widget at bottom */}
      <div className="bg-white/5 border border-white/10 rounded-2.5xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2">
        <div className="flex items-start gap-3">
          <div className="bg-emerald-500/10 text-emerald-400 p-2.5 rounded-xl border border-emerald-500/20 shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <h5 className="text-xs sm:text-sm font-semibold text-white/95">Смета фиксируется в договоре</h5>
            <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-light">
              После согласования окончательной сметы на 4-м этапе стоимость не меняется в процессе проведения всех монтажных работ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
