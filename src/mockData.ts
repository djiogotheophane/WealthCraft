import { InvestmentAsset, RewardTask, ReferredUser, Transaction, UserProfile } from './types';

export const INITIAL_ASSETS: InvestmentAsset[] = [
  {
    id: 'lvl-standard-1',
    name: 'Niveau Standard 1',
    category: 'standard',
    categoryLabel: 'Niveau d\'investissement 1',
    annualReturn: 273,
    minInvestment: 1500,
    riskLevel: 'Faible',
    description: 'Investissement de 1 500 F CFA pour un gain de 800 F par jour pendant 7 jours.',
    longDescription: 'Ce premier niveau vous permet de demarrer avec un capital modeste et d\'obtenir un rendement quotidien de 800 F CFA sur une duree de 7 jours, pour un gain total de 5 600 F CFA.',
    iconName: 'Building',
    performanceHistory: [
      { date: 'Jour 1', value: 800 },
      { date: 'Jour 3', value: 2400 },
      { date: 'Jour 5', value: 4000 },
      { date: 'Jour 7', value: 5600 }
    ],
    dailyReturn: 800,
    durationDays: 7,
    imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'lvl-standard-2',
    name: 'Niveau Standard 2',
    category: 'standard',
    categoryLabel: 'Niveau d\'investissement 2',
    annualReturn: 200,
    minInvestment: 4000,
    riskLevel: 'Faible',
    description: 'Investissement de 4 000 F CFA pour un gain de 1 500 F par jour pendant 8 jours.',
    longDescription: 'Le deuxieme niveau augmente votre rendement quotidien a 1 500 F CFA sur une periode de 8 jours, ce qui genere un retour total de 12 000 F CFA pour votre capital.',
    iconName: 'Building',
    performanceHistory: [
      { date: 'Jour 1', value: 1500 },
      { date: 'Jour 4', value: 6000 },
      { date: 'Jour 8', value: 12000 }
    ],
    dailyReturn: 1500,
    durationDays: 8,
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'lvl-standard-3',
    name: 'Niveau Standard 3',
    category: 'standard',
    categoryLabel: 'Niveau d\'investissement 3',
    annualReturn: 140,
    minInvestment: 5000,
    riskLevel: 'Modéré',
    description: 'Investissement de 5 000 F CFA pour un bonus de 2 000 F par jour pendant 6 jours.',
    longDescription: 'Le troisieme niveau vous fait beneficier d\'un gain quotidien accelere de 2 000 F CFA pendant 6 jours, vous garantissant un capital final de 12 000 F CFA.',
    iconName: 'Building',
    performanceHistory: [
      { date: 'Jour 1', value: 2000 },
      { date: 'Jour 3', value: 6000 },
      { date: 'Jour 6', value: 12000 }
    ],
    dailyReturn: 2000,
    durationDays: 6,
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'lvl-standard-4',
    name: 'Niveau Standard 4',
    category: 'standard',
    categoryLabel: 'Niveau d\'investissement 4',
    annualReturn: 114,
    minInvestment: 7000,
    riskLevel: 'Modéré',
    description: 'Investissement de 7 000 F CFA pour un gain de 3 000 F par jour pendant 5 jours.',
    longDescription: 'Le quatrieme niveau vous permet de capitaliser rapidement en seulement 5 jours avec un retour quotidien de 3 000 F CFA, pour un gain total de 15 000 F CFA.',
    iconName: 'Building',
    performanceHistory: [
      { date: 'Jour 1', value: 3000 },
      { date: 'Jour 3', value: 9000 },
      { date: 'Jour 5', value: 15000 }
    ],
    dailyReturn: 3000,
    durationDays: 5,
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'lvl-standard-5',
    name: 'Niveau Standard 5',
    category: 'standard',
    categoryLabel: 'Niveau d\'investissement 5',
    annualReturn: 125,
    minInvestment: 10000,
    riskLevel: 'Modéré',
    description: 'Investissement de 10 000 F CFA pour un gain de 4 500 F par jour pendant 5 jours.',
    longDescription: 'Le cinquieme niveau complete l\'offre standard avec un placement de 10 000 F CFA pour un gain exceptionnel de 4 500 F CFA par jour pendant 5 jours, totalisant 22 500 F CFA.',
    iconName: 'Building',
    performanceHistory: [
      { date: 'Jour 1', value: 4500 },
      { date: 'Jour 3', value: 13500 },
      { date: 'Jour 5', value: 22500 }
    ],
    dailyReturn: 4500,
    durationDays: 5,
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'lvl-premium-1',
    name: 'Premium Niveau 1',
    category: 'premium',
    categoryLabel: 'Option Premium',
    annualReturn: 266,
    minInvestment: 15000,
    riskLevel: 'Élevé',
    description: 'Investissement de 15 000 F CFA pour un gain de 5 500 F par jour pendant 10 jours.',
    longDescription: 'Premiere option premium exclusive : placez 15 000 F CFA et obtenez un gain quotidien de 5 500 F CFA pendant 10 jours, soit un total de 55 000 F CFA generes.',
    iconName: 'Building',
    performanceHistory: [
      { date: 'Jour 1', value: 5500 },
      { date: 'Jour 5', value: 27500 },
      { date: 'Jour 10', value: 55000 }
    ],
    dailyReturn: 5500,
    durationDays: 10,
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'lvl-premium-2',
    name: 'Premium Niveau 2',
    category: 'premium',
    categoryLabel: 'Option Premium',
    annualReturn: 200,
    minInvestment: 25000,
    riskLevel: 'Élevé',
    description: 'Investissement de 25 000 F CFA pour un gain de 7 500 F par jour pendant 10 jours.',
    longDescription: 'Deuxieme option premium exclusive : placez 25 000 F CFA pour un gain de 7 500 F CFA par jour pendant 10 jours, accumulant un capital final de 75 000 F CFA.',
    iconName: 'Building',
    performanceHistory: [
      { date: 'Jour 1', value: 7500 },
      { date: 'Jour 5', value: 37500 },
      { date: 'Jour 10', value: 75000 }
    ],
    dailyReturn: 7500,
    durationDays: 10,
    imageUrl: 'https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'lvl-premium-3',
    name: 'Premium Niveau 3',
    category: 'premium',
    categoryLabel: 'Option Premium',
    annualReturn: 133,
    minInvestment: 45000,
    riskLevel: 'Élevé',
    description: 'Investissement de 45 000 F CFA pour un gain de 10 500 F par jour pendant 10 jours.',
    longDescription: 'L\'opportunite d\'investissement ultime : placez 45 000 F CFA et recoltez 10 500 F CFA chaque jour pendant 10 jours, pour un capital total de 105 000 F CFA.',
    iconName: 'Building',
    performanceHistory: [
      { date: 'Jour 1', value: 10500 },
      { date: 'Jour 5', value: 52500 },
      { date: 'Jour 10', value: 105000 }
    ],
    dailyReturn: 10500,
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
