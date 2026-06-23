import React, { useState } from 'react';
import { BookOpen, ChevronRight, CornerDownRight, Landmark, Zap, Shield, HelpCircle, X, Code } from 'lucide-react';
import { DocSection } from '../types';

interface DocReaderProps {
  isOpen: boolean;
  onClose: () => void;
  addNotification: (message: string, type?: 'success' | 'info') => void;
}

export default function DocReader({ isOpen, onClose, addNotification }: DocReaderProps) {
  const [selectedSectionId, setSelectedSectionId] = useState<string>('intro');

  const documentationSections: DocSection[] = [
    {
      id: 'intro',
      category: 'Smart Contracts',
      title: 'Dynamic Liquidity streams & Smart Vaults',
      content: 'Traditional staking structures lock tokens in rigid vaults where capital sits completely dormant and unreachable. RIVR solves this bottleneck through non-custodial Smart Vaults. By combining real-time liquidity streams with derivative minted tokens (rTokens), stakeholders remain 100% liquid. Interest compounds continuously block-by-block and can be triggered, swapped, or bridged without unstaking penalties.',
    },
    {
      id: 'integration',
      category: 'Web3 SDK Reference',
      title: 'Integrating sub-second streams with JS/TS',
      content: 'Web3 developers can initialize RIVR smart streams using simple Client libraries. By importing @rivr/sdk, nodes listen directly to block ticks on Ethereum or Layer 2 networks. Compounding awards flow as constant float calculations, which makes real-time subscription models, payroll, or recurring DAO payments effortless.',
      codeSnippet: `import { RivrStream } from '@rivr/sdk';

// Subscribe to smart-contract reward emitters
RivrStream.subscribe({
  stakerAddress: '0xd9b8...c1',
  poolFilter: 'RIVR_STAKING_CORE',
  tickRateMs: 500
}).on('delta', (payout) => {
  console.log('Stream tick payload:', payout.deltaClaimable);
});`
    },
    {
      id: 'security',
      category: 'Audit & Safety',
      title: 'Autonomous Relayer Security and Multi-Sigs',
      content: 'RIVR Smart Vault contracts are completely decentralized and have been double-audited by leading Web3 security agencies (Certik & Halborn). Relayer bridges use localized Zero-Knowledge (ZK) state proofs to verify cross-chain balance validations. This is immune to standard multi-signature bridge exploits, maintaining safety for institutional treasury stakeholders.'
    },
    {
      id: 'mechanics',
      category: 'Economics Parameters',
      title: 'Auto-Compounding APY Algorithms & burns',
      content: 'The dynamic APR scales programmatically according to Total Value Locked. Protocol transactions routing through integrated lending pools prompt a minor 0.15% fee split in RIVR tokens. 60% of this fee goes directly to stakers, 25% to market buybacks, and 15% is automatically sent to the 0x000...000 burn contract, establishing an ever-shrinking supply structure.'
    }
  ];

  const currentSection = documentationSections.find(s => s.id === selectedSectionId) || documentationSections[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md text-white">
      <div className="bg-[#0e1628] border border-white/10 rounded-4xl w-full max-w-4xl h-[85vh] overflow-hidden flex flex-col relative shadow-2xl">
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/5 bg-white/5 shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-400" />
            <div>
              <h3 className="text-base font-bold text-white leading-normal">RIVR Protocol Wiki</h3>
              <p className="text-[10px] text-white/40">Technical specification booklets & integration guidelines</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition p-1 hover:bg-white/5 rounded-full cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Inner layout (Sidebar + main content) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          
          {/* Sidebar index */}
          <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-white/5 bg-[#0a101d] overflow-y-auto p-4 space-y-3 shrink-0">
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-2">Articles Slate</span>
            <div className="space-y-1.5">
              {documentationSections.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSectionId(s.id)}
                  className={`w-full text-left p-3 rounded-2xl block border transition ${
                    selectedSectionId === s.id
                      ? 'bg-blue-600/10 border-blue-500/30 text-white font-medium'
                      : 'bg-transparent border-transparent text-white/50 hover:text-white/80 hover:bg-white/30'
                  }`}
                >
                  <span className="text-[9px] uppercase tracking-wider text-blue-400 font-mono font-semibold block mb-0.5">
                    {s.category}
                  </span>
                  <span className="text-xs">{s.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main article reader content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-black/20">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400 font-mono">
                  {currentSection.category}
                </span>
              </div>
              <h4 className="text-xl font-bold tracking-tight text-white/95">{currentSection.title}</h4>
            </div>

            <p className="text-sm text-white/70 leading-relaxed font-sans">{currentSection.content}</p>

            {currentSection.codeSnippet && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-white/40 text-xs">
                  <Code className="h-4 w-4" />
                  <span>SDK Quickstart Snippet</span>
                </div>
                <div className="bg-black/60 rounded-2xl border border-white/10 p-4 font-mono text-xs overflow-x-auto text-blue-200">
                  <pre>
                    <code>{currentSection.codeSnippet}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* Quick reference guide */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-white/5 text-[11px]">
              <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-1">
                <span className="text-white/40 block font-semibold uppercase">Smart Contracts</span>
                <span className="text-white/80 font-mono">v2.4.0-release</span>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-1">
                <span className="text-white/40 block font-semibold uppercase">Gas Strategy</span>
                <span className="text-emerald-400 font-mono">99.2% Optimized</span>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-1">
                <span className="text-white/40 block font-semibold uppercase">Multi-Chain</span>
                <span className="text-white/80 font-mono">Arbitrum, Base, OP</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer info splits */}
        <div className="px-6 py-3 bg-[#0a101d] border-t border-white/5 shrink-0 flex items-center justify-between text-[10px] text-white/30">
          <span>RIVR Foundation © 2026</span>
          <button
            onClick={() => {
              addNotification('Downloading technical whitepaper PDF (mock)...', 'info');
            }}
            className="hover:text-white/80 underline font-semibold cursor-pointer"
          >
            Direct Whitepaper PDF (.zip)
          </button>
        </div>

      </div>
    </div>
  );
}
