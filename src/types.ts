export interface InvestmentAsset {
  id: string;
  name: string;
  category: 'immobilier' | 'metaux' | 'actions' | 'crypto' | 'standard' | 'premium';
  categoryLabel: string;
  annualReturn: number; // in percentage, e.g. 12.5
  minInvestment: number;
  riskLevel: 'Faible' | 'Modéré' | 'Élevé';
  description: string;
  longDescription: string;
  iconName: string;
  performanceHistory: { date: string; value: number }[];
  dailyReturn?: number; // Optional daily return amount
  durationDays?: number; // Optional duration in days
  imageUrl?: string;
}

export interface RewardTask {
  id: string;
  title: string;
  description: string;
  rewardAmount: number;
  category: 'security' | 'investment' | 'social' | 'daily';
  status: 'available' | 'completed' | 'claimed';
  actionLabel: string;
}

export interface ReferredUser {
  id: string;
  name: string;
  email: string;
  dateJoined: string;
  status: 'Enregistré' | 'Actif (1er Investissement)';
  rewardEarned: number;
}

export type TransactionType = 'deposit' | 'withdrawal' | 'investment' | 'reward' | 'referral';
export type TransactionStatus = 'pending' | 'success' | 'failed';

export interface Transaction {
  id: string;
  type: TransactionType;
  typeLabel: string;
  amount: number;
  date: string;
  status: TransactionStatus;
  description: string;
  method?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  balance: number;
  investedBalance: number;
  referralCode: string;
  totalReferralEarnings: number;
  totalRewardsClaimed: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Diamond' | string;
  investmentHistory: { [assetId: string]: number }; // assetId -> amount
  fullName?: string;
  spinsLeft?: number;
  usedPromoCodes?: string[];
  tasks?: RewardTask[];
  transactions?: Transaction[];
  referrals?: ReferredUser[];
}
