import React, { useState } from 'react';
import { Landmark, Vote, Check, ShieldCheck, Flame, Plus, X, HeartHandshake } from 'lucide-react';
import { Proposal } from '../types';

export default function GovernanceSection({ addNotification }: { addNotification: (message: string, type?: 'success' | 'info') => void }) {
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: 'VIP-12',
      title: 'Expand Staking Vault Capacity & Deploy Contracts to Base Chain L2',
      category: 'protocol',
      description: 'Expand fluid liquidity mechanisms to Base network, allowing low-cap users to trigger stakes with less than $0.05 average gas cost. Includes smart vault and bridging system integrations.',
      votesFor: 245000,
      votesAgainst: 12400,
      status: 'active',
      creator: '0x92a3...19f',
      endsInDays: 4
    },
    {
      id: 'VIP-11',
      title: 'Integrate Pudgy Penguins and Milady NFTs as Staking Collateral',
      category: 'vaults',
      description: 'Permit users to deposit Pudgy Penguins & Miladys into Oceanic Staking Vault structures. Increases protocol total value locked (TVL) estimates, attracting premium yielders.',
      votesFor: 189000,
      votesAgainst: 92400,
      status: 'active',
      creator: '0xbc18...eef',
      endsInDays: 7
    },
    {
      id: 'VIP-10',
      title: 'Adopt Deflationary Fee-Burn Model on Synthetic Asset Minting',
      category: 'treasury',
      description: 'Direct 100% of synthetic asset transaction minting fees towards immediate market token combustion (RIVR burning) instead of treasury splits. Heavily boosts RIVR supply deficiency.',
      votesFor: 382400,
      votesAgainst: 2400,
      status: 'passed',
      creator: '0x1f92...bd4',
      endsInDays: 0
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'protocol' | 'vaults' | 'treasury'>('protocol');
  const [newDescription, setNewDescription] = useState<string>('');

  const handleCastVote = (proposalId: string, direction: 'for' | 'against') => {
    setProposals(prev =>
      prev.map(p => {
        if (p.id !== proposalId) return p;
        if (p.userVote) {
          addNotification('You have already cast your vote on this proposal!', 'info');
          return p;
        }

        const voteIncrement = 1500; // simulated governance voting weight
        const updated = {
          ...p,
          userVote: direction,
          votesFor: direction === 'for' ? p.votesFor + voteIncrement : p.votesFor,
          votesAgainst: direction === 'against' ? p.votesAgainst + voteIncrement : p.votesAgainst
        };

        addNotification(`Vote successfully registered! Contributed ${voteIncrement} RIVR voting power ${direction.toUpperCase()} this VIP.`, 'success');
        return updated;
      })
    );
  };

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) {
      addNotification('Please fill out all required fields.', 'info');
      return;
    }

    const nextIdNum = proposals.length + 10;
    const nextId = `VIP-${nextIdNum}`;

    const newProp: Proposal = {
      id: nextId,
      title: newTitle,
      category: newCategory,
      description: newDescription,
      votesFor: 1500, // starting with user's vote
      votesAgainst: 0,
      status: 'active',
      creator: '0xUser...62b',
      endsInDays: 14,
      userVote: 'for'
    };

    setProposals([newProp, ...proposals]);
    addNotification(`Congratulations! Proposal ${nextId} has been successfully registered to the RIVR DAO slate.`, 'success');

    // Reset forms
    setNewTitle('');
    setNewDescription('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6 text-white w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-medium tracking-tight text-white/90">DAO Governance Protocol</h3>
          <p className="text-sm text-white/50 mt-1">
            Propose, deliberate, and decide parameter modifications across smart vaults and tokenomics rules.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition text-xs shadow-md shadow-blue-900/10 cursor-pointer self-start"
        >
          <Plus className="h-4 w-4" />
          Propose VIP Amendment
        </button>
      </div>

      {/* Grid of proposals */}
      <div className="space-y-4">
        {proposals.map(prop => {
          const totalVotes = prop.votesFor + prop.votesAgainst;
          const pctFor = totalVotes > 0 ? (prop.votesFor / totalVotes) * 100 : 0;
          const pctAgainst = totalVotes > 0 ? (prop.votesAgainst / totalVotes) * 100 : 0;
          
          return (
            <div
              key={prop.id}
              className="bg-black/40 border border-white/5 rounded-3xl p-5 md:p-6 space-y-4 hover:border-white/10 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold px-2 py-0.5 rounded-md">
                    {prop.id}
                  </span>
                  <span className="text-white/40 font-mono">By {prop.creator}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider text-[9px] ${
                    prop.status === 'active' 
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                      : prop.status === 'passed'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-400/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {prop.status}
                  </span>
                  {prop.endsInDays > 0 ? (
                    <span className="text-[10px] text-white/40">{prop.endsInDays} days left</span>
                  ) : (
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> Passed & Executed
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-semibold text-white/95 leading-snug">{prop.title}</h4>
                <p className="text-xs text-white/60 leading-relaxed pt-1">{prop.description}</p>
              </div>

              {/* Progress bars & statistics */}
              <div className="bg-black/20 p-4.5 rounded-2xl border border-white/5 space-y-3.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <div className="text-blue-300">
                    <span className="font-semibold text-white/80">FOR:</span> {prop.votesFor.toLocaleString()} RIVR ({pctFor.toFixed(1)}%)
                  </div>
                  <div className="text-red-300">
                    <span className="font-semibold text-white/80">AGAINST:</span> {prop.votesAgainst.toLocaleString()} RIVR ({pctAgainst.toFixed(1)}%)
                  </div>
                </div>

                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden flex">
                  <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${pctFor}%` }} />
                  <div className="bg-red-400 h-full transition-all duration-500" style={{ width: `${pctAgainst}%` }} />
                </div>

                {prop.status === 'active' && (
                  <div className="flex items-center justify-between pt-2.5 border-t border-white/5">
                    <span className="text-[10px] text-white/40 font-mono">Cast your stake power:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCastVote(prop.id, 'for')}
                        disabled={!!prop.userVote}
                        className={`text-[10px] font-semibold py-1.5 px-3 rounded-xl flex items-center gap-1 cursor-pointer transition ${
                          prop.userVote === 'for'
                            ? 'bg-blue-500 text-white font-bold'
                            : prop.userVote === 'against'
                            ? 'bg-white/5 text-white/20 cursor-not-allowed'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        <Check className="h-3 w-3" /> VOTE FOR
                      </button>
                      <button
                        onClick={() => handleCastVote(prop.id, 'against')}
                        disabled={!!prop.userVote}
                        className={`text-[10px] font-semibold py-1.5 px-3 rounded-xl flex items-center gap-1 cursor-pointer transition ${
                          prop.userVote === 'against'
                            ? 'bg-red-400 text-white font-bold'
                            : prop.userVote === 'for'
                            ? 'bg-white/5 text-white/20 cursor-not-allowed'
                            : 'bg-white/10 hover:bg-white/10 text-white hover:text-red-200'
                        }`}
                      >
                        <X className="h-3 w-3" /> VOTE AGAINST
                      </button>
                    </div>
                  </div>
                )}

                {prop.userVote && (
                  <div className="text-[10px] text-right text-emerald-400 font-mono font-medium pt-1">
                    ✓ You voted {prop.userVote.toUpperCase()} this VIP.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic proposal creator modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0e1628] border border-white/10 rounded-3xl max-w-lg w-full p-6 space-y-4 relative shadow-2xl">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 text-blue-400">
              <Landmark className="h-5 w-5" />
              <h4 className="text-lg font-semibold text-white">Draft Governance VIP</h4>
            </div>

            <form onSubmit={handleCreateProposal} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/50 block">VIP Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Expand USDC Collateral Liquidity Weight"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/50 block">Target Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="protocol">Protocol Expansion & Multi-chain</option>
                  <option value="vaults">Smart Vaults Parameters</option>
                  <option value="treasury">Treasury Buybacks & Burns</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-white/50 block">Proposal Excerpt / Description</label>
                <textarea
                  required
                  rows={4}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
                  placeholder="Provide deep details on the target parameter change and how it benefits staked RIVR token velocities..."
                />
              </div>

              <div className="text-[10px] text-white/40 leading-normal flex items-start gap-1.5 bg-white/5 p-3 rounded-2xl border border-white/5 mt-2">
                <HeartHandshake className="h-4.5 w-4.5 text-blue-400 shrink-0" />
                <span>
                  <strong>Staking Multiplier Required:</strong> Registering proposals consumes 1,500 mock RIVR gas weight, which serves as your initial supporting VIP-for power.
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="text-xs font-semibold px-4 py-2.5 rounded-xl text-white/60 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2.5 px-5 rounded-xl transition shadow-lg shadow-blue-900/10 cursor-pointer"
                >
                  Publish DAO Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
