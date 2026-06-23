import React, { useState } from 'react';
import { Calendar, Clock, Sparkles, CheckCircle, Mail, User, Phone, ChevronRight, X } from 'lucide-react';

interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  addNotification: (message: string, type?: 'success' | 'info') => void;
}

export default function BookDemoModal({ isOpen, onClose, addNotification }: BookDemoModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [topic, setTopic] = useState<string>('design');
  const [selectedDate, setSelectedDate] = useState<string>('23 июня 2026');
  const [selectedTime, setSelectedTime] = useState<string>('14:00');
  const [fullname, setFullname] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  if (!isOpen) return null;

  const topics = [
    { id: 'design', title: 'Проектирование вентиляции', desc: 'Разработка индивидуального проекта приточно-вытяжной вентиляции под ключ.' },
    { id: 'selection', title: 'Подбор оборудования', desc: 'Расчет мощности, уровня шума, фильтрации и подбор оптимального оборудования.' },
    { id: 'install', title: 'Монтаж и запуск', desc: 'Профессиональная установка системы вентиляции и кондиционирования.' }
  ];

  const dates = [
    { day: 'ВТ', date: '23 июня 2026' },
    { day: 'СР', date: '24 июня 2026' },
    { day: 'ЧТ', date: '25 июня 2026' }
  ];

  const times = ['10:00', '11:30', '14:00', '16:00'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullname.trim() || !phone.trim()) {
      addNotification('Пожалуйста, введите имя и телефон для оформления заявки.', 'info');
      return;
    }

    setStep(2);
    addNotification('Заявка успешно оформлена!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md text-white">
      <div className="bg-[#0e1628] border border-white/10 rounded-4xl w-full max-w-xl overflow-hidden relative shadow-2xl transition duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/50 hover:text-white transition cursor-pointer z-10 p-1 hover:bg-white/5 rounded-full"
        >
          <X className="h-5 w-5" />
        </button>

        {step === 1 ? (
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-widest block">Оставить заявку</span>
              <p className="text-xs text-white/50 leading-relaxed">
                Заполните форму, и наши инженеры выполнят предварительный расчет вентиляции с кондиционированием и увлажнением для вашего помещения.
              </p>
            </div>

            {/* Step 1 Form Fields */}
            <div className="space-y-4 pt-1">
              {/* Topics block */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider block">1. Выберите услугу</label>
                <div className="space-y-2">
                  {topics.map(t => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setTopic(t.id)}
                      className={`w-full text-left p-3 rounded-2xl border transition ${
                        topic === t.id
                          ? 'bg-cyan-500/10 border-cyan-500/50 text-white'
                          : 'bg-black/30 border-white/5 text-white/70 hover:border-white/10 hover:bg-black/40'
                      }`}
                    >
                      <div className="text-xs font-semibold">{t.title}</div>
                      <div className="text-[10px] text-white/40 mt-0.5 leading-relaxed">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Dates pick */}
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider block">2. Удобная дата для звонка</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {dates.map(d => (
                      <button
                        type="button"
                        key={d.date}
                        onClick={() => setSelectedDate(d.date)}
                        className={`py-2 rounded-xl border text-center transition ${
                          selectedDate === d.date
                            ? 'bg-cyan-500/20 border-cyan-500 text-white'
                            : 'bg-black/20 border-white/5 text-white/60 hover:text-white'
                        }`}
                      >
                        <div className="text-[10px] font-bold text-cyan-400 font-mono uppercase">{d.day}</div>
                        <div className="text-[9px] text-white/40 font-mono mt-0.5">{d.date.split(' ')[0]} {d.date.split(' ')[1].slice(0, 3)}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Times Pick */}
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider block">3. Удобное время</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {times.map(t => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setSelectedTime(t)}
                        className={`py-2 px-1 rounded-xl border text-center text-[10px] font-mono font-medium transition ${
                          selectedTime === t
                            ? 'bg-cyan-500/20 border-cyan-500 text-white'
                            : 'bg-black/20 border-white/5 text-white/60 hover:text-white'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact meta */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider block">Ваше имя</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
                    <input
                      type="text"
                      required
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded-xl py-2 px-3 pl-9 text-xs focus:outline-none focus:border-cyan-500 text-white"
                      placeholder="Александр"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider block">Телефон</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded-xl py-2 px-3 pl-9 text-xs focus:outline-none focus:border-cyan-500 text-white"
                      placeholder="+7 (999) 000-00-00"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-white/40 uppercase tracking-wider block">Email (опционально)</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded-xl py-2 px-3 pl-9 text-xs focus:outline-none focus:border-cyan-500 text-white"
                      placeholder="mail@example.com"
                    />
                  </div>
                </div>
              </div>

            </div>

            <button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-6 rounded-2xl flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-900/20 active:scale-98 transition duration-150 cursor-pointer text-xs mt-3.5"
            >
              Отправить заявку
              <ChevronRight className="h-4 w-4" />
            </button>
          </form>
        ) : (
          /* Step 2: High Fidelity success display */
          <div className="p-8 md:p-10 text-center space-y-6 flex flex-col items-center justify-center">
            <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle className="h-8 w-8" />
            </div>

            <div className="space-y-2 max-w-sm">
              <h3 className="text-xl font-bold tracking-tight text-white/95">Заявка принята!</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Спасибо, <strong>{fullname}</strong>. Мы свяжемся с вами в указанное время (<span className="text-cyan-400 font-mono">{selectedDate}, {selectedTime}</span>) по номеру <strong className="text-cyan-300 font-mono">{phone}</strong> для обсуждения всех деталей и подготовки сметы.
              </p>
            </div>

            {/* Scheduled card summary */}
            <div className="bg-black/40 p-4 rounded-2xl border border-white/5 w-full text-xs font-mono space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-white/40">Выбранная услуга</span>
                <span className="text-white/80 shrink-0 font-sans font-medium">
                  {topics.find(t => t.id === topic)?.title || 'По услуге'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Дата звонка</span>
                <span className="text-white/80 font-semibold">{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Время звонка</span>
                <span className="text-cyan-400 font-semibold">{selectedTime}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setFullname('');
                setPhone('');
                setEmail('');
                onClose();
              }}
              className="bg-white/10 hover:bg-white/15 text-white text-xs font-semibold py-2 px-5 rounded-xl transition cursor-pointer"
            >
              Закрыть окно
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
