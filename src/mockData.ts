import { InvestmentAsset, RewardTask, ReferredUser, Transaction, UserProfile } from './types';

export const INITIAL_ASSETS: InvestmentAsset[] = [
  {
    id: 'lvl-standard-1',
    name: 'Niveau Standard 1',
    category: 'standard',
    categoryLabel: 'Niveau d\'investissement 1',
    annualReturn: 0,
    minInvestment: 1500,
    riskLevel: 'Faible',
    description: 'Investissement de 1 500 F CFA pendant 7 jours.',
    longDescription: 'Ce premier niveau vous permet de démarrer avec un capital modeste de 1 500 F CFA sur une durée de 7 jours.',
    iconName: 'Building',
    performanceHistory: [
      { date: 'Jour 1', value: 0 },
      { date: 'Jour 3', value: 0 },
      { date: 'Jour 5', value: 0 },
      { date: 'Jour 7', value: 0 }
    ],
    dailyReturn: 0,
    durationDays: 7,
    imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'lvl-standard-2',
    name: 'Niveau Standard 2',
    category: 'standard',
    categoryLabel: 'Niveau d\'investissement 2',
    annualReturn: 0,
    minInvestment: 4000,
    riskLevel: 'Faible',
    description: 'Investissement de 4 000 F CFA pendant 8 jours.',
    longDescription: 'Le deuxième niveau vous permet d\'investir un montant de 4 000 F CFA sur une période de 8 jours.',
    iconName: 'Building',
    performanceHistory: [
      { date: 'Jour 1', value: 0 },
      { date: 'Jour 4', value: 0 },
      { date: 'Jour 8', value: 0 }
    ],
    dailyReturn: 0,
    durationDays: 8,
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'lvl-standard-3',
    name: 'Niveau Standard 3',
    category: 'standard',
    categoryLabel: 'Niveau d\'investissement 3',
    annualReturn: 0,
    minInvestment: 5000,
    riskLevel: 'Modéré',
    description: 'Investissement de 5 000 F CFA pendant 6 jours.',
    longDescription: 'Le troisième niveau vous permet d\'effectuer un placement de 5 000 F CFA sur une période de 6 jours.',
    iconName: 'Building',
    performanceHistory: [
      { date: 'Jour 1', value: 0 },
      { date: 'Jour 3', value: 0 },
      { date: 'Jour 6', value: 0 }
    ],
    dailyReturn: 0,
    durationDays: 6,
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'lvl-standard-4',
    name: 'Niveau Standard 4',
    category: 'standard',
    categoryLabel: 'Niveau d\'investissement 4',
    annualReturn: 0,
    minInvestment: 7000,
    riskLevel: 'Modéré',
    description: 'Investissement de 7 000 F CFA pendant 5 jours.',
    longDescription: 'Le quatrième niveau vous permet d\'investir 7 000 F CFA de manière flexible sur 5 jours.',
    iconName: 'Building',
    performanceHistory: [
      { date: 'Jour 1', value: 0 },
      { date: 'Jour 3', value: 0 },
      { date: 'Jour 5', value: 0 }
    ],
    dailyReturn: 0,
    durationDays: 5,
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'lvl-standard-5',
    name: 'Niveau Standard 5',
    category: 'standard',
    categoryLabel: 'Niveau d\'investissement 5',
    annualReturn: 0,
    minInvestment: 10000,
    riskLevel: 'Modéré',
    description: 'Investissement de 10 000 F CFA pendant 5 jours.',
    longDescription: 'Le cinquième niveau complète l\'offre standard avec un placement de 10 000 F CFA sur une durée de 5 jours.',
    iconName: 'Building',
    performanceHistory: [
      { date: 'Jour 1', value: 0 },
      { date: 'Jour 3', value: 0 },
      { date: 'Jour 5', value: 0 }
    ],
    dailyReturn: 0,
    durationDays: 5,
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'lvl-premium-1',
    name: 'Premium Niveau 1',
    category: 'premium',
    categoryLabel: 'Option Premium',
    annualReturn: 0,
    minInvestment: 15000,
    riskLevel: 'Élevé',
    description: 'Investissement de 15 000 F CFA pendant 10 jours.',
    longDescription: 'Première option premium exclusive : placez 15 000 F CFA sur une période de co-investissement d\'élite de 10 jours.',
    iconName: 'Building',
    performanceHistory: [
      { date: 'Jour 1', value: 0 },
      { date: 'Jour 5', value: 0 },
      { date: 'Jour 10', value: 0 }
    ],
    dailyReturn: 0,
    durationDays: 10,
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'lvl-premium-2',
    name: 'Premium Niveau 2',
    category: 'premium',
    categoryLabel: 'Option Premium',
    annualReturn: 0,
    minInvestment: 25000,
    riskLevel: 'Élevé',
    description: 'Investissement de 25 000 F CFA pendant 10 jours.',
    longDescription: 'Deuxième option premium exclusive : effectuez un placement de 25 000 F CFA sur 10 jours.',
    iconName: 'Building',
    performanceHistory: [
      { date: 'Jour 1', value: 0 },
      { date: 'Jour 5', value: 0 },
      { date: 'Jour 10', value: 0 }
    ],
    dailyReturn: 0,
    durationDays: 10,
    imageUrl: 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'lvl-premium-3',
    name: 'Premium Niveau 3',
    category: 'premium',
    categoryLabel: 'Option Premium',
    annualReturn: 0,
    minInvestment: 45000,
    riskLevel: 'Élevé',
    description: 'Investissement de 45 000 F CFA pendant 10 jours.',
    longDescription: 'L\'opportunité d\'investissement d\'élite ultime : placez 45 000 F CFA de manière sécurisée pendant 10 jours.',
    iconName: 'Building',
    performanceHistory: [
      { date: 'Jour 1', value: 0 },
      { date: 'Jour 5', value: 0 },
      { date: 'Jour 10', value: 0 }
    ],
    dailyReturn: 0,
    durationDays: 10,
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80'
  }
];

export const INITIAL_TASKS: RewardTask[] = [
  {
    id: 'daily-checkin',
    title: 'Bonus Quotidien',
    description: 'Connectez-vous aujourd\'hui et réclamez votre bonus d\'or.',
    rewardAmount: 250,
    category: 'daily',
    status: 'available',
    actionLabel: 'Réclamer 250 F CFA'
  },
  {
    id: 'kyc-verify',
    title: 'Vérification d\'Identité (KYC)',
    description: 'Sécurisez votre compte en validant votre pièce d\'identité.',
    rewardAmount: 1000,
    category: 'security',
    status: 'available',
    actionLabel: 'Vérifier l\'identité'
  },
  {
    id: 'first-investment',
    title: 'Premier Pas de Géant',
    description: 'Réalisez votre premier investissement de 1 500 F CFA ou plus.',
    rewardAmount: 2000,
    category: 'investment',
    status: 'available',
    actionLabel: 'Investir'
  },
  {
    id: 'social-share',
    title: 'Partage d\'Élite',
    description: 'Partagez WealthCraft sur vos réseaux sociaux pour faire grandir la communauté.',
    rewardAmount: 500,
    category: 'social',
    status: 'available',
    actionLabel: 'Partager'
  }
];

export const INITIAL_REFERRALS: ReferredUser[] = [
  {
    id: 'ref-1',
    name: 'Chloé Bernard',
    email: 'chloe.b@outlook.com',
    dateJoined: '2026-06-15',
    status: 'Actif (1er Investissement)',
    rewardEarned: 2500
  },
  {
    id: 'ref-2',
    name: 'Thomas Dubois',
    email: 't.dubois@gmail.com',
    dateJoined: '2026-06-28',
    status: 'Actif (1er Investissement)',
    rewardEarned: 2500
  },
  {
    id: 'ref-3',
    name: 'Mélanie Moreau',
    email: 'melanie.moreau@live.fr',
    dateJoined: '2026-07-02',
    status: 'Enregistré',
    rewardEarned: 0
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    type: 'deposit',
    typeLabel: 'Dépôt',
    amount: 100000,
    date: '2026-06-10 10:30',
    status: 'success',
    description: 'Dépôt par Mobile Money',
    method: 'Mobile Money'
  },
  {
    id: 'tx-2',
    type: 'investment',
    typeLabel: 'Investissement',
    amount: 12000,
    date: '2026-06-11 14:15',
    status: 'success',
    description: 'Placement - Niveau Standard 2 & Niveau Standard 4'
  },
  {
    id: 'tx-3',
    type: 'referral',
    typeLabel: 'Parrainage',
    amount: 2500,
    date: '2026-06-16 09:00',
    status: 'success',
    description: 'Bonus parrainage - Chloé Bernard'
  },
  {
    id: 'tx-4',
    type: 'investment',
    typeLabel: 'Investissement',
    amount: 7000,
    date: '2026-06-20 16:45',
    status: 'success',
    description: 'Placement - Niveau Standard 4'
  },
  {
    id: 'tx-5',
    type: 'withdrawal',
    typeLabel: 'Retrait d\'argent',
    amount: 5000,
    date: '2026-07-01 11:12',
    status: 'success',
    description: 'Retrait vers compte Mobile Money',
    method: 'Mobile Money'
  }
];

export const INITIAL_PROFILE: UserProfile = {
  name: 'Alexandre Laurent',
  email: 'alex@wealthcraft.com',
  balance: 78500, // Available to invest/withdraw
  investedBalance: 19000, // Sum of current active investments
  referralCode: 'WEALTH-789X',
  totalReferralEarnings: 2500,
  totalRewardsClaimed: 0,
  tier: 'Gold',
  investmentHistory: {
    'lvl-standard-3': 5000,
    'lvl-standard-4': 14000
  }
};

export const PORTFOLIO_TREND_DATA = [
  { date: 'Jan', 'Portefeuille': 8000, 'Épargne': 4000, 'Rendements': 120 },
  { date: 'Fév', 'Portefeuille': 8400, 'Épargne': 4200, 'Rendements': 250 },
  { date: 'Mar', 'Portefeuille': 9100, 'Épargne': 4500, 'Rendements': 480 },
  { date: 'Avr', 'Portefeuille': 10500, 'Épargne': 5000, 'Rendements': 690 },
  { date: 'Mai', 'Portefeuille': 11200, 'Épargne': 5200, 'Rendements': 920 },
  { date: 'Juin', 'Portefeuille': 12500, 'Épargne': 5500, 'Rendements': 1250 },
];
