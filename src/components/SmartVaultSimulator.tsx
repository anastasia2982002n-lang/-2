import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Coins, ShieldCheck, Zap, Sparkles, RefreshCw, Layers, Check, Info } from 'lucide-react';
import { StakingPool, UserStake } from '../types';

interface SmartVaultSimulatorProps {
  userWallet: { rivr: number; usdc: number; nfts: number };
  setUserWallet: React.Dispatch<React.SetStateAction<{ rivr: number; usdc: number; nfts: number }>>;
  userStakes: UserStake[];
  setUserStakes: React.Dispatch<React.SetStateAction<UserStake[]>>;
  pools: StakingPool[];
  addNotification: (message: string, type?: 'success' | 'info') => void;
}

export default function SmartVaultSimulator({
  userWallet,
  setUserWallet,
  userStakes,
  setUserStakes,
  pools,
  addNotification
}: SmartVaultSimulatorProps) {
  const [selectedPoolId, setSelectedPoolId] = useState<string>(pools[0].id);
  const [stakeAmount, setStakeAmount] = useState<string>('500');
  const [autoCompound, setAutoCompound] = useState<boolean>(true);
  const [localUnclaimed, setLocalUnclaimed] = useState<number>(0);
  
  const selectedPool = pools.find(p => p.id === selectedPoolId) || pools[0];

  // Keep track of real-time accumulating rewards via a sub-second interval
  useEffect(() => {
    const timer = setInterval(() => {
      setUserStakes(prevStakes => {
        if (prevStakes.length === 0) return prevStakes;
        return prevStakes.map(stake => {
          const pool = pools.find(p => p.id === stake.poolId);
          if (!pool) return stake;
          
          // APY calculated per second: yieldRate = APY / 100 / (365 * 24 * 3600)
          const apyFraction = pool.apy / 100;
          const secondsInYear = 365 * 24 * 3600;
          
          // Compound factor or simple linear real-time yield rate
          // Accelerate slightly for visual feedback in a demo environment
          const visualMultiplier = 15; // Makes mock earnings move fast enough to see
          const yieldRatePerSec = (stake.amount * apyFraction) / secondsInYear * visualMultiplier;
          
          // Add reward accumulation
          const addedReward = yieldRatePerSec * 0.1; // Timer runs every 100ms
          
          return {
            ...stake,
            accumulated: stake.accumulated + addedReward
          };
        });
      });
      
    }, 100);

    return () => clearInterval(timer);
  }, [pools, setUserStakes]);

  // Read total accumulated yield across all stakes
  const totalUnclaimedYield = userStakes.reduce((acc, s) => acc + s.accumulated, 0);

  const handleMax = () => {
    if (selectedPool.iconType === 'rivr') {
      setStakeAmount(userWallet.rivr.toString());
    } else if (selectedPool.iconType === 'stable') {
      setStakeAmount(userWallet.usdc.toString());
    } else {
      setStakeAmount(userWallet.nfts.toString());
    }
  };

  const handleStake = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(stakeAmount);
    
    if (isNaN(amountNum) || amountNum <= 0) {
      addNotification('Please enter a valid amount to stake.', 'info');
      return;
    }

    // Verify balances
    if (selectedPool.iconType === 'rivr' && userWallet.rivr < amountNum) {
      addNotification('Insufficient RIVR token balance.', 'info');
      return;
    }
    if (selectedPool.iconType === 'stable' && userWallet.usdc < amountNum) {
      addNotification('Insufficient USDC balance.', 'info');
      return;
    }
    if (selectedPool.iconType === 'nft' && userWallet.nfts < amountNum) {
      addNotification('Insufficient NFT holding. Buy/mint more NFTs or choose a token vault.', 'info');
      return;
    }

    // Spend from wallet
    if (selectedPool.iconType === 'rivr') {
      setUserWallet(prev => ({ ...prev, rivr: prev.rivr - amountNum }));
    } else if (selectedPool.iconType === 'stable') {
      setUserWallet(prev => ({ ...prev, usdc: prev.usdc - amountNum }));
    } else {
      setUserWallet(prev => ({ ...prev, nfts: prev.nfts - amountNum }));
    }

    // Create stake record
    const existingStakeIdx = userStakes.findIndex(s => s.poolId === selectedPool.id);
    if (existingStakeIdx > -1) {
      setUserStakes(prev => {
        const copy = [...prev];
        copy[existingStakeIdx] = {
          ...copy[existingStakeIdx],
          amount: copy[existingStakeIdx].amount + amountNum,
          timestamp: Date.now()
        };
        return copy;
      });
    } else {
      setUserStakes(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          poolId: selectedPool.id,
          amount: amountNum,
          timestamp: Date.now(),
          accumulated: 0
        }
      ]);
    }

    addNotification(`Successfully locked ${amountNum} ${selectedPool.token} into ${selectedPool.name}!`, 'success');
    setStakeAmount('');
  };

  const handleClaimAll = () => {
    if (totalUnclaimedYield <= 0) {
      addNotification('No accumulated fluid stream rewards to claim yet.', 'info');
      return;
    }

    // Claim awards and put back into wallet as RIVR (or cash equivalents)
    setUserWallet(prev => ({ ...prev, rivr: prev.rivr + totalUnclaimedYield }));
    
    // Reset all accumulations
    setUserStakes(prev => prev.map(s => ({ ...s, accumulated: 0 })));
    addNotification(`Claimed +${totalUnclaimedYield.toFixed(5)} RIVR yield stream directly to your wallet!`, 'success');
  };

  // Help calculate staking statistics
  const currentStakedAmountInPool = userStakes.find(s => s.poolId === selectedPool.id)?.amount || 0;
  const currentAccumulatedInPool = userStakes.find(s => s.poolId === selectedPool.id)?.accumulated || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full text-white">
      {/* Pool Selector & Staking Action (Left Column) */}
      <div className="lg:col-span-7 space-y-6">
        <div>
          <h3 className="text-xl font-medium tracking-tight text-white/90">Select Smart Vault Stream</h3>
          <p className="text-sm text-white/50 mt-1">
            Lock various assets into RIVR yield streams with dynamic liquid compounding rules.
          </p>
        </div>

        {/* Pools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {pools.map(pool => {
            const isActive = selectedPoolId === pool.id;
            const stakedInThis = userStakes.find(s => s.poolId === pool.id)?.amount || 0;
            return (
              <button
                key={pool.id}
                onClick={() => {
                  setSelectedPoolId(pool.id);
                  if (pool.iconType === 'rivr') setStakeAmount('1000');
                  else if (pool.iconType === 'stable') setStakeAmount('500');
                  else setStakeAmount('1');
                }}
                className={`relative overflow-hidden text-left p-4 rounded-3xl border transition duration-300 ${
                  isActive
                    ? 'bg-[#1a2b4c]/60 border-[#3b82f6]/50 shadow-lg shadow-blue-900/10'
                    : 'bg-black/40 border-white/10 hover:border-white/20 hover:bg-black/50'
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 right-0 h-20 w-20 bg-blue-500/10 blur-xl rounded-full" />
                )}
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-2xl bg-white/5 border border-white/10">
                    {pool.iconType === 'rivr' && <Coins className="h-5 w-5 text-blue-400" />}
                    {pool.iconType === 'nft' && <Sparkles className="h-5 w-5 text-purple-400" />}
                    {pool.iconType === 'stable' && <ShieldCheck className="h-5 w-5 text-emerald-400" />}
                  </div>
                  <span className="text-xs font-mono font-medium text-blue-400 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                    {pool.apy}% APY
                  </span>
                </div>

                <div className="mt-4">
                  <div className="text-sm font-medium text-white/90">{pool.name}</div>
                  <div className="text-xs text-white/40 mt-0.5">Stream {pool.token}</div>
                </div>

                {stakedInThis > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-emerald-400">
                    <span className="opacity-80">Staked:</span>
                    <span className="font-mono font-semibold">
                      {stakedInThis} {pool.token}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Pool Details Card */}
        <div className="bg-black/30 border border-white/5 rounded-3xl p-5 space-y-4 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 blur-3xl pointer-events-none rounded-full" />
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping" />
                <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold">Vault Parameters</span>
              </div>
              <h4 className="text-lg font-medium text-white/90 mt-1">{selectedPool.name} details</h4>
            </div>
            <span className="text-xs font-mono text-white/40">TVL: {selectedPool.tvl}</span>
          </div>

          <p className="text-sm text-white/70 leading-relaxed">{selectedPool.description}</p>

          <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
            <div className="bg-white/5 border border-white/5 p-3 rounded-2xl">
              <span className="text-white/40">Multiplication Rate</span>
              <div className="text-sm font-semibold mt-0.5 text-white/90">{selectedPool.multiplier}</div>
            </div>
            <div className="bg-white/5 border border-white/5 p-3 rounded-2xl">
              <span className="text-white/40">Unlock Strategy</span>
              <div className="text-sm font-semibold mt-0.5 text-white/90">Instant Stream (No Lockup!)</div>
            </div>
          </div>
        </div>

        {/* Interactive Staking Form */}
        <form onSubmit={handleStake} className="bg-[#0e1628]/60 border border-white/10 rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white/80">Staking Amount</span>
            <span className="text-xs text-white/40 flex items-center gap-1.5">
              Available: 
              <span className="font-mono text-white/80">
                {selectedPool.iconType === 'rivr' && `${userWallet.rivr} RIVR`}
                {selectedPool.iconType === 'stable' && `${userWallet.usdc} USDC`}
                {selectedPool.iconType === 'nft' && `${userWallet.nfts} NFTs`}
              </span>
            </span>
          </div>

          <div className="relative">
            <input
              type="number"
              min={selectedPool.minStake}
              step={selectedPool.iconType === 'nft' ? '1' : 'any'}
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4.5 px-4 pr-20 text-white font-mono text-lg focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
              placeholder={`Min ${selectedPool.minStake} ${selectedPool.token}`}
            />
            <button
              type="button"
              onClick={handleMax}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition text-white/80 hover:text-white"
            >
              MAX
            </button>
          </div>

          <div className="flex items-center justify-between bg-white/5 p-3 rounded-2xl">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-emerald-400 rotate-45" />
              <div>
                <span className="text-xs font-medium text-white/90">Auto-Compound Stream</span>
                <p className="text-[10px] text-white/40">Automatically re-invests yield streams back into this pool</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAutoCompound(!autoCompound)}
              className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                autoCompound ? 'bg-emerald-500' : 'bg-white/10'
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${
                  autoCompound ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-700/20 active:scale-98 transition duration-150 cursor-pointer"
          >
            <Layers className="h-4 w-4" />
            Stake & Initiate Stream
          </button>
        </form>
      </div>

      {/* Reward Metrics & Visual Cash Streams (Right Column) */}
      <div className="lg:col-span-5 space-y-6">
        {/* Dynamic Liquid Visualizer Card */}
        <div className="bg-[#0b101c]/80 border border-blue-900/30 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between h-full min-h-[460px]">
          {/* Wave fluid animation backdrops */}
          <div className="absolute inset-0 z-0 opacity-15 overflow-hidden pointer-events-none rounded-3xl">
            <svg className="absolute bottom-0 w-full h-[60%] fill-blue-500/40 animate-pulse" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,60 C150,90 350,30 500,60 C650,90 850,30 1000,60 C1150,90 1300,30 1400,60 L1400,120 L0,120 Z" />
            </svg>
            <svg className="absolute bottom-0 w-full h-[55%] fill-blue-400/50 delay-75" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ animationDuration: '6s' }}>
              <path d="M0,50 C200,20 400,80 600,50 C800,20 1000,80 1200,50 L1200,120 L0,120 Z" />
            </svg>
          </div>

          <div className="relative z-10 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-white/50 uppercase tracking-widest font-semibold font-mono">Stream Live</span>
              </div>
              <div className="text-xs text-blue-300 font-mono flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full">
                <Zap className="h-3 w-3 text-yellow-400" />
                Compounding Node Active
              </div>
            </div>

            {/* Total Active Stream Yield counter (Real-time dynamic scale) */}
            <div className="text-center py-6 space-y-1">
              <div className="text-xs text-white/40 uppercase tracking-wider font-semibold font-mono">Cumulative Gained Yield</div>
              <div className="font-mono text-4xl sm:text-5xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-100 to-indigo-300">
                {totalUnclaimedYield.toFixed(8)}
              </div>
              <div className="text-xs text-emerald-400/80 font-mono mt-1">
                +{(userStakes.reduce((total, stake) => {
                  const pool = pools.find(p => p.id === stake.poolId);
                  if (!pool) return total;
                  return total + (stake.amount * (pool.apy / 100) / (365 * 24 * 3600)) * 15;
                }, 0)).toFixed(6)} RIVR / sec
              </div>
            </div>
          </div>

          {/* Liquid streams flowing animation (SVG paths representing streams) */}
          <div className="relative z-10 flex flex-col space-y-3.5 my-6">
            <div className="text-xs font-mono text-white/40 border-b border-white/5 pb-2">Active Fluid Pipes</div>
            {userStakes.length === 0 ? (
              <div className="text-center py-6 text-sm text-white/30 italic">
                No active streams. Stake assets to start earning immediate yield.
              </div>
            ) : (
              <div className="space-y-3 max-h-[140px] overflow-y-auto pr-1">
                {userStakes.map(stake => {
                  const pool = pools.find(p => p.id === stake.poolId);
                  if (!pool) return null;
                  return (
                    <div key={stake.id} className="bg-white/5 rounded-2xl p-3 border border-white/5 flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                        <span className="text-white/80">{pool.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-white/90 font-medium font-mono">
                          +{stake.accumulated.toFixed(6)} RIVR
                        </div>
                        <div className="text-[10px] text-white/30 font-mono">
                          Staked: {stake.amount} {pool.token}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* User balance metrics & Actions */}
          <div className="relative z-10 space-y-4 pt-4 border-t border-white/10">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                <span className="text-[10px] text-white/40 uppercase font-bold font-mono">Staked Value</span>
                <div className="text-sm font-semibold font-mono text-white/90 mt-0.5">
                  {userStakes.reduce((acc, s) => acc + s.amount, 0).toLocaleString()} Pool Assets
                </div>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                <span className="text-[10px] text-white/40 uppercase font-bold font-mono">Total RIVR in Wallet</span>
                <div className="text-sm font-semibold font-mono text-blue-400 mt-0.5">
                  {userWallet.rivr.toFixed(2)} RIVR
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClaimAll}
              disabled={userStakes.length === 0 || totalUnclaimedYield === 0}
              className={`w-full font-semibold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition ${
                userStakes.length === 0 || totalUnclaimedYield === 0
                  ? 'bg-white/5 text-white/30 border border-white/5 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-950/20 active:scale-98'
              }`}
            >
              <Coins className="h-4 w-4" />
              Claim Direct Stream Earnings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
