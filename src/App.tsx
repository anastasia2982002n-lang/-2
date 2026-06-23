/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Coins, 
  ArrowRight, 
  HelpCircle, 
  MessageSquare, 
  Layers, 
  CheckCircle, 
  ChevronRight, 
  X, 
  TrendingUp, 
  Plus, 
  UserPlus,
  Home,
  Info,
  Wind,
  Snowflake,
  Droplets,
  Phone
} from 'lucide-react';

import { StakingPool, UserStake, ActivityLog } from './types';
import SmartVaultSimulator from './components/SmartVaultSimulator';
import EcosystemExplorer from './components/EcosystemExplorer';
import EconomicsBreakdown from './components/EconomicsBreakdown';
import DeveloperPortal from './components/DeveloperPortal';
import GovernanceSection from './components/GovernanceSection';
import BookDemoModal from './components/BookDemoModal';
import DocReader from './components/DocReader';
import VentilationReveal from './components/VentilationReveal';
import FogSystem from './components/FogSystem';

// Pools configuration (statically defined to maintain stable reference)
const pools: StakingPool[] = [
  {
    id: 'pool-rivr',
    name: 'RIVR Flow Pool',
    token: 'RIVR',
    apy: 18.2,
    description: 'The native compounding yield stack. Deposits directly reinforce RIVR stream velocity and supply buybacks.',
    tvl: '$24,500,000',
    minStake: 100,
    multiplier: '1.5x Boost',
    iconType: 'rivr'
  },
  {
    id: 'pool-stable',
    name: 'Estuary Stable Pool',
    token: 'USDC',
    apy: 8.7,
    description: 'Zero-slippage risk containment vault. Earn secure streams paid out block-by-block in stable tokens.',
    tvl: '$20,100,000',
    minStake: 50,
    multiplier: '1.1x Base',
    iconType: 'stable'
  },
  {
    id: 'pool-nft',
    name: 'Oceanic NFT Vault',
    token: 'NFTS',
    apy: 24.5,
    description: 'Fractionalize your elite collectibles or profile artwork to earn immediate liquidity back.',
    tvl: '$8,200,000',
    minStake: 1,
    multiplier: '2.4x Alpha',
    iconType: 'nft'
  }
];

export default function App() {
  // Navigation & Screen states
  const [activeTab, setActiveTab] = useState<'home' | 'ecosystem' | 'economics' | 'developers' | 'governance' | 'simulator' | 'ventilation'>('home');
  const [isBookDemoOpen, setIsBookDemoOpen] = useState<boolean>(false);
  const [isDocReaderOpen, setIsDocReaderOpen] = useState<boolean>(false);
  const [isDiscordModalOpen, setIsDiscordModalOpen] = useState<boolean>(false);
  const [isUslugiOpen, setIsUslugiOpen] = useState<boolean>(false);



  // Simulated Web3 / Wallet balances
  const [userWallet, setUserWallet] = useState({
    rivr: 2500,
    usdc: 1200,
    nfts: 2
  });

  // User stakes state
  const [userStakes, setUserStakes] = useState<UserStake[]>([]);

  // Toast notifications structure
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string; type: 'success' | 'info' }>>([]);

  const addNotification = (message: string, type: 'success' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(7);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  // Dynamic user alert feed
  const [recentStakerLogs, setRecentStakerLogs] = useState<ActivityLog[]>([
    { id: 'al-1', user: '0x9a84...d2', action: 'staked', poolName: 'RIVR Flow Pool', amount: '1,500 RIVR', timeAgo: 'Just now' },
    { id: 'al-2', user: '0x32bf...9e', action: 'created_stream', poolName: 'Oceanic NFT Vault', amount: '1 NFT', timeAgo: '2m ago' },
    { id: 'al-3', user: '0xbc12...af', action: 'claimed', poolName: 'Estuary Stable Pool', amount: '35.4 USDC', timeAgo: '5m ago' }
  ]);

  // Periodic visual feedback - simulate other stakers joining
  useEffect(() => {
    const users = ['0xd921...ca', '0x3ef4...2a', '0x1f29...ee', '0x8b9c...bb'];
    const actions: Array<'staked' | 'claimed' | 'compounded'> = ['staked', 'claimed', 'compounded'];
    const logsPools = ['RIVR Flow Pool', 'Estuary Stable Pool', 'Oceanic NFT Vault'];
    
    const interval = setInterval(() => {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const randomPool = logsPools[Math.floor(Math.random() * logsPools.length)];
      const amount = randomAction === 'staked' 
        ? `${Math.floor(Math.random() * 800 + 100)} RIVR` 
        : `${(Math.random() * 15 + 2).toFixed(2)} USDC`;

      setRecentStakerLogs(prev => [
        {
          id: Math.random().toString(),
          user: randomUser,
          action: randomAction === 'staked' ? 'staked' : randomAction === 'claimed' ? 'claimed' : 'created_stream',
          poolName: randomPool,
          amount,
          timeAgo: 'Just now'
        },
        ...prev.slice(0, 4)
      ]);
    }, 18000);

    return () => clearInterval(interval);
  }, []);

  const handleFaucetClaim = () => {
    setUserWallet(prev => ({
      rivr: prev.rivr + 500,
      usdc: prev.usdc + 250,
      nfts: prev.nfts + 1
    }));
    addNotification('Claimed Faucet Tokens! +500 RIVR, +250 USDC, and +1 Elite NFT added to your wallet context.', 'success');
  };

  const handleDiscordJoinMock = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDiscordModalOpen(false);
    addNotification('Successfully linked Discord ID! Welcome to the RIVR Stream family.', 'success');
  };

  return (
    <div className="
      min-h-screen
      bg-[#05070A]
      text-[#E2E8F0]
      w-full
      font-sans
      select-none
      overflow-x-hidden
      antialiased
      flex
      flex-col
      items-center
      p-0
      md:p-3
      relative
    ">
      
      {/* Absolute floating notifications popup tray (Top-Right) */}
      <div className="fixed top-6 right-6 z-50 space-y-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-4 rounded-2xl shadow-xl flex items-start gap-2.5 border backdrop-blur-md pointer-events-auto ${
                n.type === 'success'
                  ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-100'
                  : 'bg-indigo-950/90 border-indigo-500/30 text-indigo-100'
              }`}
            >
              <CheckCircle className={`h-5 w-5 shrink-0 ${n.type === 'success' ? 'text-emerald-400' : 'text-indigo-400'}`} />
              <div className="text-xs font-medium leading-relaxed">{n.message}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Primary container bounds */}
      <main
        className="
        w-full
        max-w-[1536px]
        bg-black
        rounded-none
        md:rounded-[2.5rem]
        relative
        shadow-2xl
        min-h-[100dvh]
        md:h-[calc(100vh-24px)]
        flex
        flex-col
        overflow-hidden
        "
      >
        
        {/* Fullscreen Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/house-night.jpg"
            alt="House Background"
            className="
              absolute
              inset-0
              w-full
              h-full
              object-cover
              object-center
              opacity-80
              pointer-events-none
              scale-105
            "
            referrerPolicy="no-referrer"
          />

          {/* Затемнение для читаемости интерфейса */}
          <div className="absolute inset-0 bg-black/45 pointer-events-none" />
        </div>

        {/* Content relative wrapper */}
        <div
          className="
          relative
          z-10
          w-full
          h-full
          flex
          flex-col
          justify-between
          px-4
          py-3
          sm:px-6
          md:px-10
          md:py-6
          "
        >
          
          {/* Nav Header */}
          <header className="flex items-center justify-between gap-4 w-full border-b border-white/5 pb-3">
            {/* Logo returning home */}
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2 cursor-pointer group active:scale-95 transition"
            >
              <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
              </div>
              <span className="text-xl font-bold tracking-tighter hero-text-gradient group-hover:opacity-80 transition">
                Главная
              </span>
            </button>

            {/* Menu Links */}
            <nav className="flex items-center gap-2 overflow-x-auto scrollbar-none whitespace-nowrap min-w-0 px-2 py-1 md:gap-6 lg:gap-8">
              {[
                { label: 'Услуги', id: 'ecosystem' },
                { label: 'Этапы', id: 'economics' },
                { label: 'Система', id: 'developers' }
              ].map(item => {
                const isActive = item.id === 'ecosystem' ? isUslugiOpen : activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'ecosystem') {
                        setIsUslugiOpen(!isUslugiOpen);
                      } else {
                        setActiveTab(item.id as any);
                      }
                    }}
                    className={`text-xs md:text-sm font-medium tracking-wide flex items-center gap-1 transition-all cursor-pointer ${
                      isActive 
                        ? 'text-blue-400 font-semibold' 
                        : 'text-white/60 hover:text-white hover:opacity-90'
                    }`}
                  >
                    {item.label}
                    <ChevronRight className={`h-2.5 w-2.5 md:h-3 md:w-3 opacity-30 transform transition ${
                      isActive ? 'rotate-90 opacity-100 text-blue-400' : 'rotate-0'
                    }`} />
                  </button>
                );
              })}
            </nav>

            {/* Utility Actions & Booking */}
            <div className="flex items-center gap-3">
              {/* Phone contact action */}
              <a
                href="tel:+8999999999"
                className="text-xs bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-1.5 cursor-pointer transition shadow-lg active:scale-95 text-nowrap font-medium"
              >
                <Phone className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                <span>+8999999999</span>
              </a>

              <button
                onClick={() => setIsBookDemoOpen(true)}
                className="bg-blue-600/90 hover:bg-blue-600 text-white border border-blue-500/30 px-4 py-2 rounded-2xl flex items-center gap-2 cursor-pointer transition shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-95 text-xs text-nowrap font-medium"
              >
                <div className="h-5 w-5 bg-white/20 rounded-full flex items-center justify-center">
                  <ArrowRight className="h-3 w-3 text-white" />
                </div>
                Заказать
              </button>
            </div>
          </header>

          {/* Core Central Content Container */}
          <div
            className="
            flex-1
            min-h-0
            w-full
            flex
            flex-col
            items-center
            justify-start
            mt-4
            md:my-4
            overflow-y-auto
            pr-1
            scrollbar-none
            "
          >
            <AnimatePresence mode="wait">
              {activeTab === 'home' ? (
                /* Primary Hero Text view exactly as requested */
                <motion.div
                  key="home"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-center max-w-4xl space-y-6 w-full my-auto py-6 md:py-8"
                >
                  {/* Title Display */}
                  <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight hero-text-gradient leading-[1.1] max-w-4xl">
                    Проектирование приточных вентиляций, систем кондиционирования и увлажнения
                  </h1>

                  {/* Excerpt */}
                  <p className="max-w-xl text-[23px] text-slate-400 font-light leading-relaxed">
                    В частных домах, квартирах и апартаментах
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
                    <button
                      onClick={() => setIsBookDemoOpen(true)}
                      className="bg-white text-black font-semibold text-xs py-3.5 px-6 rounded-2xl flex items-center gap-1.5 hover:bg-neutral-200 transition duration-150 active:scale-95 shadow-xl cursor-pointer"
                    >
                      Заказать
                      <ArrowRight className="h-4 w-4 text-black" />
                    </button>
                  </div>

                  {/* Новый информационный блок: Комплексные Системы Микроклимата */}
                  <div className="w-full max-w-4xl mt-14 sm:mt-20 text-left bg-white/5 border border-white/10 rounded-[2rem] p-6 md:p-8 space-y-8 backdrop-blur-sm">
                    <div className="border-b border-white/5 pb-5">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400">Технологии комфорта RIVR</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        Комплексное управление микроклиматом
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-355 mt-1 font-light leading-relaxed max-w-2xl">
                        Три фундаментальные системы жизнеобеспечения дома, объединенные в единый интеллектуальный контур для чистого воздуха, прохлады и здоровой влажности.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Карточка 1: Вентиляция */}
                      <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-500/20 transition-all duration-300">
                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                          <Wind className="h-5 w-5 text-blue-400" />
                        </div>
                        <h3 className="text-sm font-semibold text-white tracking-wide">
                          Приточная вентиляция
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed font-light">
                          Непрерывная подача свежего уличного воздуха с эффективной рекуперацией тепла. Фильтрация HEPA H13 задерживает грязные частицы PM2.5, пыльцу и смог. Уличное оборудование полностью гасит сторонние шумы.
                        </p>
                      </div>

                      {/* Карточка 2: Кондиционирование */}
                      <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/20 transition-all duration-300">
                        <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                          <Snowflake className="h-5 w-5 text-cyan-400" />
                        </div>
                        <h3 className="text-sm font-semibold text-white tracking-wide">
                          Скрытое кондиционирование
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed font-light">
                          Поддержание комфортной прохлады летом и воздушного тепла в межсезонье. Скрытые внутренние блоки канального типа монтируются за потолками, плавно распределяя воздух через элегантные щелевые диффузоры без сквозняков.
                        </p>
                      </div>

                      {/* Карточка 3: Увлажнение */}
                      <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-teal-500/20 transition-all duration-300">
                        <div className="h-10 w-10 rounded-xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
                          <Droplets className="h-5 w-5 text-teal-400" />
                        </div>
                        <h3 className="text-sm font-semibold text-white tracking-wide">
                          Адиабатическое увлажнение
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed font-light">
                          Прямое форсуночное увлажнение сверхчистой стерилизованной водой. Распыление через незаметные сопла Buhler-AHS во всех комнатах удерживает влажность на планке 40-60%, защищая легкие и детали интерьера.
                        </p>
                      </div>
                    </div>

                    {/* Кнопка с переходом на Систему */}
                    <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <p className="text-[10px] font-mono text-slate-500">
                        * Все модули легко масштабируются и управляются со смартфона или единого пульта.
                      </p>
                      <button
                        onClick={() => setActiveTab('developers')}
                        className="w-full sm:w-auto bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 hover:border-blue-400/50 text-xs font-semibold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-md shrink-0"
                      >
                        <span>Настроить конфигурационную систему</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* Interactive dashboards replaces hero texts dynamically */
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="
                    w-full
                    max-w-5xl
                    glass
                    rounded-3xl
                    md:rounded-[2.2rem]
                    p-4
                    md:p-6
                    lg:p-8
                    overflow-y-auto
                    shadow-2xl
                    relative
                    my-auto
                  "
                >
                  {/* Close / Return home button */}
                  <button
                    onClick={() => setActiveTab('home')}
                    className="absolute top-4 right-4 md:top-6 md:right-6 text-white/50 hover:text-white transition cursor-pointer p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 shadow-md hover:scale-105 active:scale-95"
                    title="Назад на главную"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>

                  {/* Dynamic subview injections */}
                  {activeTab === 'simulator' && (
                    <SmartVaultSimulator
                      userWallet={userWallet}
                      setUserWallet={setUserWallet}
                      userStakes={userStakes}
                      setUserStakes={setUserStakes}
                      pools={pools}
                      addNotification={addNotification}
                    />
                  )}

                  {activeTab === 'economics' && <EconomicsBreakdown />}

                  {activeTab === 'developers' && <DeveloperPortal addNotification={addNotification} />}

                  {activeTab === 'governance' && <GovernanceSection addNotification={addNotification} />}

                  {activeTab === 'ventilation' && <VentilationReveal />}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom row row layout (Symmetrical details exactly as requested) */}
          <footer className="hidden lg:flex w-full items-end justify-between pt-3 border-t border-white/5 z-20 pointer-events-none shrink-0 h-12">
            
          </footer>

        </div>
      </main>

      <FogSystem />

      {/* Floating Modal Integrations */}
      <AnimatePresence>
        {isUslugiOpen && (
          <div 
            onClick={() => setIsUslugiOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md text-white overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0b0f17] border border-white/10 rounded-3xl md:rounded-[2.5rem] w-full max-w-5xl overflow-y-auto max-h-[92vh] shadow-2xl relative p-4 md:p-8 space-y-6 scrollbar-none"
            >
              {/* Modal header with close button */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <h3 className="text-lg font-semibold text-white/90">Наши услуги</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUslugiOpen(false)}
                  className="absolute top-4 right-4 md:top-6 md:right-6 text-white/50 hover:text-white transition cursor-pointer p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Ecosystem explorer inside */}
              <div className="pt-2">
                <EcosystemExplorer
                  userWallet={userWallet}
                  setUserWallet={setUserWallet}
                  addNotification={addNotification}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <BookDemoModal
        isOpen={isBookDemoOpen}
        onClose={() => setIsBookDemoOpen(false)}
        addNotification={addNotification}
      />

      <DocReader
        isOpen={isDocReaderOpen}
        onClose={() => setIsDocReaderOpen(false)}
        addNotification={addNotification}
      />

      {/* Discord Connect Interaction overlay */}
      <AnimatePresence>
        {isDiscordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md text-white">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#2f3136] border border-[#5865f2]/20 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative p-6 space-y-4"
            >
              <button
                onClick={() => setIsDiscordModalOpen(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition cursor-pointer p-1 rounded-full hover:bg-white/5"
              >
                <X className="h-4.5 w-4.5" />
              </button>

              {/* Discord brand logo */}
              <div className="flex flex-col items-center text-center space-y-2 mt-2">
                <div className="h-14 w-14 rounded-2xl bg-[#5865f2] flex items-center justify-center text-white text-3xl">
                  <MessageSquare className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Sync With RIVR Discord</h3>
                <p className="text-xs text-white/60 max-w-xs leading-relaxed">
                  Connect your Web3 handle with continuous Discord integrations. Access alpha staking roles, announcements, and direct community guides.
                </p>
              </div>

              <form onSubmit={handleDiscordJoinMock} className="space-y-3.5 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-white/40 uppercase tracking-widest block">Staker Discord Tag</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-[#202225] border border-black/30 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#5865f2] text-white"
                    placeholder="e.g. staker#1234"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-white/40 uppercase tracking-widest block">Wallet Address Check</label>
                  <input
                    type="text"
                    disabled
                    className="w-full bg-black/20 border border-white/5 rounded-xl py-2 px-3 text-xs text-white/40 font-mono"
                    value="0xd921...RIVR_ACTIVE_STAKER"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#5865f2] hover:bg-[#4752c4] text-white text-xs font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer"
                >
                  Connect & Join Discord Server
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
