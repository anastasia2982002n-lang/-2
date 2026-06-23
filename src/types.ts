export interface StakingPool {
  id: string;
  name: string;
  token: string;
  apy: number;
  description: string;
  tvl: string;
  minStake: number;
  multiplier: string;
  iconType: 'rivr' | 'nft' | 'stable';
}

export interface UserStake {
  id: string;
  poolId: string;
  amount: number;
  timestamp: number; // when stake started/last claimed
  accumulated: number; // accumulated yield
}

export interface Proposal {
  id: string;
  title: string;
  category: 'protocol' | 'vaults' | 'treasury' | 'branding';
  description: string;
  votesFor: number;
  votesAgainst: number;
  status: 'active' | 'passed' | 'defeated';
  creator: string;
  endsInDays: number;
  userVote?: 'for' | 'against';
}

export interface ActivityLog {
  id: string;
  user: string;
  action: 'staked' | 'claimed' | 'compounded' | 'created_stream';
  poolName: string;
  amount: string;
  timeAgo: string;
}

export interface DocSection {
  id: string;
  title: string;
  category: string;
  content: string;
  codeSnippet?: string;
}
