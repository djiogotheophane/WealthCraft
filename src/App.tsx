import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Coins, 
  TrendingUp, 
  Cpu, 
  Wallet, 
  Gift, 
  Users, 
  Award, 
  Clock, 
  Plus, 
  DollarSign, 
  CheckCircle2, 
  X, 
  Menu, 
  ChevronRight, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownLeft, 
  List,
  Shield,
  LogOut,
  Bell,
  HelpCircle,
  PiggyBank
} from 'lucide-react';

import { 
  InvestmentAsset, 
  RewardTask, 
  ReferredUser, 
  Transaction, 
  UserProfile 
} from './types';

import { 
  INITIAL_ASSETS, 
  INITIAL_TASKS, 
  INITIAL_REFERRALS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_PROFILE 
} from './mockData';

import DashboardTab from './components/DashboardTab';
import InvestmentTab from './components/InvestmentTab';
import ReferralTab from './components/ReferralTab';
import WithdrawTab from './components/WithdrawTab';
import TopTab from './components/TopTab';
import EntrepriseTab from './components/EntrepriseTab';
import AuthScreen from './components/AuthScreen';
import { handleApiResponse } from './utils/api';

export default function App() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('wealthcraft_token'));
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [referrals, setReferrals] = useState<ReferredUser[]>([]);
  const [tasks, setTasks] = useState<RewardTask[]>([]);
  const [usedPromoCodes, setUsedPromoCodes] = useState<string[]>([]);
  const [spinsLeft, setSpinsLeft] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(true);

  // UI state managers
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState<boolean>(false);
  
  // Deposit simulator input
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [depositMethod, setDepositMethod] = useState<string>('Carte de Débit/Crédit Premium (Instant)');
  const [depositStatus, setDepositStatus] = useState<string | null>(null);

  // Toast notifications state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Helper trigger Toast
  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Synchronize authentication and profile state on startup / token change
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await handleApiResponse(response);
        setProfile(data.profile);
        setTransactions(data.profile.transactions || []);
        setReferrals(data.profile.referrals || []);
        setTasks(data.profile.tasks || []);
        setUsedPromoCodes(data.profile.usedPromoCodes || []);
        setSpinsLeft(data.profile.spinsLeft ?? 5);
      } catch (err) {
        console.error("Error fetching profile:", err);
        // Token is expired, invalid, or server offline
        localStorage.removeItem('wealthcraft_token');
        setToken(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [token]);

  const handleAuthSuccess = (newToken: string, newProfile: any, refNotification?: string) => {
    localStorage.setItem('wealthcraft_token', newToken);
    setProfile(newProfile);
    setTransactions(newProfile.transactions || []);
    setReferrals(newProfile.referrals || []);
    setTasks(newProfile.tasks || []);
    setUsedPromoCodes(newProfile.usedPromoCodes || []);
    setSpinsLeft(newProfile.spinsLeft ?? 5);
    setToken(newToken);

    if (refNotification) {
      triggerToast(refNotification, 'success');
    }
    triggerToast(`Bienvenue, ${newProfile.fullName} ! Connexion d'élite établie.`, 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem('wealthcraft_token');
    setToken(null);
    setProfile(null);
    triggerToast("Déconnexion réussie. À bientôt dans le cercle d'élite.", "info");
  };

  // --- Core Action: Investing ---
  const handleInvest = async (assetId: string, amount: number) => {
    const asset = INITIAL_ASSETS.find(a => a.id === assetId);
    if (!asset) return { success: false, error: "Actif non trouvé" };

    if (!profile || profile.balance < amount) {
      return { success: false, error: "Fonds insuffisants dans votre solde." };
    }

    try {
      const response = await fetch('/api/profile/invest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ assetId, amount })
      });

      const data = await handleApiResponse(response);

      setProfile(data.profile);
      setTransactions(data.profile.transactions || []);
      setTasks(data.profile.tasks || []);
      setSpinsLeft(data.profile.spinsLeft ?? 5);

      if (data.earnedSpins) {
        triggerToast("Félicitations ! Votre investissement vous a rapporté 5 tours supplémentaires de la Roue de la Fortune d'Élite !", "info");
      }
      triggerToast(`Investissement de ${amount.toLocaleString('fr-FR')} F CFA validé dans ${asset.name} !`, 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // --- Core Action: Claiming reward tasks ---
  const handleClaimTask = async (taskId: string) => {
    try {
      const response = await fetch('/api/profile/claim-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ taskId })
      });

      const data = await handleApiResponse(response);

      setProfile(data.profile);
      setTransactions(data.profile.transactions || []);
      setTasks(data.profile.tasks || []);

      const task = tasks.find(t => t.id === taskId);
      const claimedAmount = task ? task.rewardAmount : 0;
      triggerToast(`Récompense de ${claimedAmount.toLocaleString('fr-FR')} F CFA ajoutée à votre solde !`, 'success');
      return { success: true };
    } catch (err: any) {
      triggerToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  // --- Core Action: Redeeming a Promo Code ---
  const handleEnterPromoCode = async (code: string) => {
    try {
      const response = await fetch('/api/profile/apply-promo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code })
      });

      const data = await handleApiResponse(response);

      setProfile(data.profile);
      setTransactions(data.profile.transactions || []);
      setUsedPromoCodes(data.profile.usedPromoCodes || []);

      triggerToast(`Félicitations ! Code ${code.toUpperCase()} validé (+${data.amount.toLocaleString('fr-FR')} F CFA)`, 'success');
      return { success: true, amount: data.amount };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // --- Core Action: Invite a new friend (simulated, or real via URL copy) ---
  const handleInviteFriend = (name: string, email: string) => {
    const link = `${window.location.origin}/register?ref=${profile?.referralCode}`;
    navigator.clipboard.writeText(link);
    triggerToast(`Lien de parrainage copié ! Partagez-le avec ${name} (+700 F pour chaque inscription)`, 'success');
  };

  // --- Core Action: Simulate active investment from a referred friend ---
  const handleSimulateFirstInvestment = async (refId: string) => {
    try {
      const response = await fetch('/api/profile/simulate-friend-invest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ refId })
      });

      const data = await handleApiResponse(response);

      setProfile(data.profile);
      setTransactions(data.profile.transactions || []);
      setReferrals(data.profile.referrals || []);

      const friend = referrals.find(r => r.id === refId);
      triggerToast(`Votre filleul(e) ${friend ? friend.name : ''} vient d'investir. Vous gagnez 2 500 F CFA !`, 'success');
    } catch (err: any) {
      triggerToast(err.message, 'error');
    }
  };

  // --- Core Action: Withdrawals ---
  const handleWithdraw = async (amount: number, method: string, details: string) => {
    if (!profile || profile.balance < amount) {
      return { success: false, error: "Fonds insuffisants" };
    }

    try {
      const response = await fetch('/api/profile/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount, method, accountNumber: details })
      });

      const data = await handleApiResponse(response);

      setProfile(data.profile);
      setTransactions(data.profile.transactions || []);

      triggerToast(`Retrait de ${amount.toLocaleString('fr-FR')} F CFA initié par ${method}.`, 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // --- Core Action: Simulated Fund Deposit ---
  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);

    if (isNaN(amount) || amount <= 0) {
      setDepositStatus("Veuillez saisir un montant de dépôt supérieur à 0 F CFA.");
      return;
    }

    try {
      const response = await fetch('/api/profile/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount, method: depositMethod })
      });

      const data = await handleApiResponse(response);

      setProfile(data.profile);
      setTransactions(data.profile.transactions || []);

      triggerToast(`Votre compte a été crédité de +${amount.toLocaleString('fr-FR')} F CFA par ${depositMethod} !`, 'success');
      
      // Complete KYC automatically on first deposit as convenience
      try {
        const kycResponse = await fetch('/api/profile/verify-kyc', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        await handleApiResponse(kycResponse);
      } catch (e) {
        // Silent catch for secondary trigger
      }

      // Reset deposit form
      setDepositAmount('');
      setIsDepositModalOpen(false);
      setDepositStatus(null);
    } catch (err: any) {
      setDepositStatus(err.message);
    }
  };

  // --- Core Action: Wheel of Fortune ---
  const handleWinWheelPrize = async (amount: number, label: string) => {
    try {
      const response = await fetch('/api/profile/win-wheel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount, label })
      });

      const data = await handleApiResponse(response);

      setProfile(data.profile);
      setTransactions(data.profile.transactions || []);
      setSpinsLeft(data.profile.spinsLeft ?? 5);

      if (amount > 0) {
        triggerToast(`Félicitations ! Vous avez gagné ${label} ! (+${amount.toLocaleString('fr-FR')} F CFA ajoutés au solde)`, 'success');
      } else if (label.toLowerCase() === 'recommencer') {
        triggerToast("Tour gratuit ! Vous pouvez rejouer immédiatement.", "info");
      } else {
        triggerToast("Dommage, vous avez perdu ! Tentez votre chance à nouveau.", "error");
      }
    } catch (err: any) {
      triggerToast(err.message, 'error');
    }
  };

  // Safe navigation function
  const navigateToTab = (tabName: string) => {
    setActiveTab(tabName);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2E220C] flex flex-col justify-center items-center font-sans">
        <div className="animate-spin w-10 h-10 border-4 border-[#E2C27A] border-t-transparent rounded-full mb-4"></div>
        <p className="text-xs font-bold text-[#F5F3EE] uppercase tracking-wider">Connexion d'élite en cours...</p>
      </div>
    );
  }

  if (!profile) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#2E220C] text-[#F5F3EE] flex flex-col font-sans selection:bg-[#E2C27A] selection:text-white">
      {/* --- Premium Header / Navigation Bar --- */}
      <header className="sticky top-0 z-40 bg-[#3D2E14]/80 backdrop-blur-md border-b border-[#E2C27A]/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Elegant Minimalist Logo */}
            <div 
              onClick={() => navigateToTab('dashboard')} 
              className="flex items-center gap-3 cursor-pointer group"
            >
              <img 
                src="/src/assets/images/wealthcraft_logo_1783528544573.jpg" 
                alt="WealthCraft Logo" 
                className="w-11 h-11 rounded-[14px] border border-[#E2C27A]/30 shadow-md group-hover:scale-105 transition-all object-cover"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="font-bold text-lg tracking-tight font-georgia block text-[#F5F3EE]">
                  Wealth<span className="text-[#E2C27A]">Craft</span>
                </span>
                <span className="text-[9px] text-[#B8B2A8] tracking-widest font-bold uppercase block -mt-1 font-georgia">
                  Premium Wealth
                </span>
              </div>
            </div>

            {/* Universal Navigation Menu Button (Three Bars) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#3D2E14] border-2 border-[#E2C27A]/20 hover:border-[#E2C27A]/50 text-[#F5F3EE] rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-sm active:scale-95"
              >
                {isMobileMenuOpen ? <X className="w-4.5 h-4.5 text-[#E2C27A]" /> : <Menu className="w-4.5 h-4.5 text-[#E2C27A]" />}
                <span>Onglets</span>
              </button>
            </div>

            {/* Right Header Controls (Balances & Profile) */}
            <div className="flex items-center gap-3">
              {/* Account Quick Cash Display */}
              <div className="hidden sm:flex bg-[#3D2E14] border border-[#E2C27A]/20 px-4 py-2 rounded-2xl items-center gap-2.5">
                <Wallet className="w-4.5 h-4.5 text-[#E2C27A]" />
                <div className="text-left">
                  <p className="text-[9px] uppercase tracking-wider text-[#B8B2A8] font-semibold">Disponible</p>
                  <p className="text-xs font-extrabold text-[#F5F3EE]">{profile.balance.toLocaleString('fr-FR')} F CFA</p>
                </div>
                <button 
                  onClick={() => setIsDepositModalOpen(true)}
                  className="ml-2 bg-gradient-to-r from-[#C8A25D] to-[#E2C27A] text-[#F5F3EE] p-1.5 rounded-lg hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
                  title="Faire un dépôt d'essai"
                >
                  <Plus className="w-3.5 h-3.5 font-bold" />
                </button>
              </div>

              {/* Deposit Plus icon on very small screen */}
              <button 
                onClick={() => setIsDepositModalOpen(true)}
                className="sm:hidden bg-gradient-to-r from-[#C8A25D] to-[#E2C27A] text-[#F5F3EE] p-2.5 rounded-xl shadow hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                title="Dépôt"
              >
                <Plus className="w-4 h-4 font-bold" />
              </button>

              {/* Profile Badge */}
              <div className="hidden sm:flex items-center gap-2 bg-[#2E220C] text-white py-1.5 pl-3 pr-2 rounded-2xl border border-white/10">
                <span className="text-xs font-bold">{(profile.fullName || profile.name || 'Premium').split(' ')[0]}</span>
                <span className="bg-[#E2C27A] text-[#F5F3EE] text-[9px] font-black px-1.5 py-0.5 rounded-lg uppercase">
                  {profile.tier}
                </span>
              </div>
              <button 
                onClick={handleLogout}
                className="hidden sm:flex items-center justify-center p-2.5 bg-red-50 text-red-600 border border-red-100/50 hover:bg-red-100 hover:text-red-700 rounded-xl transition-all shadow-sm cursor-pointer active:scale-95"
                title="Se déconnecter"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Universal Navigation Dropdown (opens with the 3 bars) */}
        {isMobileMenuOpen && (
          <div className="border-t border-[#E2C27A]/10 bg-[#3D2E14] shadow-2xl animate-slide-down relative z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between mb-5 border-b border-[#E2C27A]/10 pb-3">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-[#E2C27A]">Sélectionner un onglet</p>
                  <p className="text-xs text-[#B8B2A8] mt-0.5">Accédez instantanément aux différents services premium de WealthCraft.</p>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-black p-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Grid of Navigation Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: 'dashboard', label: 'Tableau de Bord', desc: 'Vue d\'ensemble de votre patrimoine d\'élite, plus-values et performances.', icon: <Wallet className="w-5 h-5" /> },
                  { id: 'gagner', label: 'Gagner', desc: 'Placements de co-investment haut rendement.', icon: <Building className="w-5 h-5" /> },
                  { id: 'top', label: 'Top', desc: 'Le Cercle d\'Or — Classement d\'élite des investisseurs et performances.', icon: <Award className="w-5 h-5" /> },
                  { id: 'inviter', label: 'Inviter', desc: 'Partagez votre lien de parrainage de prestige pour recevoir des primes.', icon: <Users className="w-5 h-5" /> },
                  { id: 'retrait', label: 'Retrait', desc: 'Transférez vos gains disponibles en toute sécurité vers vos comptes.', icon: <ArrowUpRight className="w-5 h-5" /> },
                  { id: 'entreprise', label: 'Notre Profil & Histoire', desc: 'Découvrez l\'histoire de la maison WealthCraft, notre objectif et notre vision.', icon: <Building className="w-5 h-5" /> }
                ].map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigateToTab(item.id)}
                      className={`text-left p-5 rounded-[20px] border transition-all flex gap-4 cursor-pointer relative group ${
                        isActive 
                          ? 'bg-[#E2C27A]/10 border-[#E2C27A] shadow-md' 
                          : 'bg-[#242321] hover:bg-white border-[#E2C27A]/5 hover:border-[#E2C27A]/20'
                      }`}
                    >
                      <div className={`p-3 rounded-xl shrink-0 transition-all ${
                        isActive ? 'bg-[#E2C27A] text-white' : 'bg-[#E2C27A]/10 text-[#E2C27A] group-hover:bg-[#E2C27A]/20 group-hover:scale-105'
                      }`}>
                        {item.icon}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-extrabold font-manrope ${isActive ? 'text-[#E2C27A]' : 'text-[#F5F3EE]'}`}>
                            {item.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#B8B2A8] leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 pt-5 border-t border-[#E2C27A]/10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#19B37A] rounded-full animate-pulse"></span>
                  <span className="text-[10px] uppercase font-bold text-[#B8B2A8]">Session Sécurisée d'Élite</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm border border-red-200/40 active:scale-95"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Se déconnecter</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* --- Main Contents Space --- */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        
        {/* Render Selected Interactive Tab */}
        {activeTab === 'dashboard' && (
          <DashboardTab 
            profile={profile} 
            transactions={transactions} 
            onNavigate={navigateToTab} 
            onOpenDeposit={() => setIsDepositModalOpen(true)}
            onWinWheelPrize={handleWinWheelPrize}
            spinsLeft={spinsLeft}
            setSpinsLeft={setSpinsLeft}
          />
        )}

        {activeTab === 'gagner' && (
          <InvestmentTab 
            assets={INITIAL_ASSETS} 
            profile={profile} 
            onInvest={handleInvest}
            onOpenDeposit={() => setIsDepositModalOpen(true)}
          />
        )}

        {activeTab === 'top' && (
          <TopTab profile={profile} />
        )}

        {activeTab === 'inviter' && (
          <ReferralTab 
            referrals={referrals} 
            profile={profile} 
            onInviteFriend={handleInviteFriend} 
            onSimulateFirstInvestment={handleSimulateFirstInvestment}
          />
        )}

        {activeTab === 'entreprise' && (
          <EntrepriseTab />
        )}

        {activeTab === 'retrait' && (
          <div className="space-y-8 animate-fade-in">
            <WithdrawTab 
              profile={profile} 
              transactions={transactions} 
              onWithdraw={handleWithdraw}
            />

            {/* Complete audit ledger of transactions at the bottom of Withdrawal section */}
            <div className="glass-card p-6 md:p-8 rounded-[24px] space-y-6 border border-[#E2C27A]/10 bg-[#3D2E14]">
              <div className="flex justify-between items-center border-b border-[#E2C27A]/10 pb-4">
                <div>
                  <h2 className="text-base font-bold text-[#F5F3EE] font-georgia">Grand Livre des Transactions</h2>
                  <p className="text-[10px] text-[#B8B2A8] mt-1">L'ensemble de vos flux financiers audités et horodatés.</p>
                </div>
                <span className="text-[9px] uppercase font-bold text-[#E2C27A] bg-[#E2C27A]/10 px-3 py-1 rounded-full border border-[#E2C27A]/20">
                  Compte Sécurisé
                </span>
              </div>

              {transactions.length === 0 ? (
                <p className="text-xs text-center py-12 text-[#B8B2A8]">Aucune transaction enregistrée.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#E2C27A]/10 text-[9px] uppercase text-[#B8B2A8] font-semibold">
                        <th className="py-2 px-2">Transaction ID</th>
                        <th className="py-2 px-2">Type</th>
                        <th className="py-2 px-2">Date & Heure</th>
                        <th className="py-2 px-2">Description</th>
                        <th className="py-2 px-2 text-right">Montant</th>
                        <th className="py-2 px-2 text-center">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2C27A]/5">
                      {transactions.map((tx) => {
                        const isPositive = tx.type === 'deposit' || tx.type === 'reward' || tx.type === 'referral';
                        return (
                          <tr key={tx.id} className="text-xs hover:bg-[#2E220C]/50 transition-all">
                            <td className="py-3 px-2 font-mono font-bold text-[#B8B2A8]">{tx.id}</td>
                            <td className="py-3 px-2">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                tx.type === 'deposit' ? 'bg-[#19B37A]/10 text-[#19B37A]' :
                                tx.type === 'withdrawal' ? 'bg-amber-500/10 text-amber-400' :
                                tx.type === 'investment' ? 'bg-blue-500/10 text-blue-400' : 'bg-[#E2C27A]/10 text-[#E2C27A]'
                              }`}>
                                {tx.typeLabel}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-[#B8B2A8] font-medium">{tx.date}</td>
                            <td className="py-3 px-2 text-[#F5F3EE] font-semibold">{tx.description}</td>
                            <td className={`py-3 px-2 text-right font-black text-xs ${isPositive ? 'text-[#19B37A]' : 'text-[#F5F3EE]'}`}>
                              {isPositive ? '+' : '-'} {tx.amount.toLocaleString('fr-FR')} F CFA
                            </td>
                            <td className="py-3 px-2 text-center">
                              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#19B37A]/10 text-[#19B37A] border border-[#19B37A]/20">
                                {tx.status === 'success' ? 'Validé' : tx.status === 'pending' ? 'En attente' : 'Échoué'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* --- Elegant Trust Badges & Disclaimers Footer --- */}
      <footer className="bg-[#3D2E14] border-t border-[#E2C27A]/10 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-[#E2C27A]/10">
            {/* Column 1: Short summary */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#2E220C] flex items-center justify-center border border-[#E2C27A]/30">
                  <span className="font-bold text-[#C8A25D] text-xs font-georgia">W</span>
                </div>
                <span className="font-bold text-sm tracking-tight font-georgia">
                  Wealth<span className="text-[#E2C27A]">Craft</span>
                </span>
              </div>
              <p className="text-xs text-[#B8B2A8] leading-relaxed">
                Première plateforme décentralisée de co-investissement d'élite. Gagnez de l'or, investissez sur le prestige immobilier et retirez instantanément.
              </p>
            </div>

            {/* Column 2: Legal entities disclaimers */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#F5F3EE] uppercase tracking-wider">Sécurité & Régulation</h4>
              <p className="text-[10px] text-[#B8B2A8] leading-relaxed">
                WealthCraft est un intermédiaire en investissement agréé. Les fonds sont garantis à hauteur de 65 000 000 F CFA par notre banque partenaire dépositaire régulée par la BCEAO et l'UMOA.
              </p>
            </div>

            {/* Column 3: Quick contacts */}
            <div className="space-y-2 text-xs">
              <h4 className="text-xs font-bold text-[#F5F3EE] uppercase tracking-wider">Partenaire Officiel</h4>
              <div className="flex items-center gap-2 text-[#B8B2A8]">
                <Shield className="w-4 h-4 text-[#E2C27A]" />
                <span>Audit de Sécurité de niveau bancaire certifié</span>
              </div>
              <p className="text-[10px] text-gray-400">© 2026 WealthCraft Technologies Inc. Tous droits réservés.</p>
            </div>
          </div>

          <div className="pt-6 text-center text-[10px] text-[#B8B2A8] leading-relaxed max-w-4xl mx-auto space-y-1">
            <p>
              *Avertissement sur les risques: L'investissement dans des classes d'actifs alternatifs comporte un risque de perte en capital. Les rendements passés ne garantissent pas les rendements futurs. Diversifiez vos placements et n'investissez que l'argent dont vous n'avez pas un besoin immédiat.
            </p>
          </div>
        </div>
      </footer>

      {/* --- Deposit Simulator Dialog/Modal (Revolut-styled) --- */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#3D2E14] max-w-md w-full rounded-[28px] border border-[#E2C27A]/30 p-6 shadow-2xl relative overflow-hidden animate-scale-up">
            <div className="absolute right-0 top-0 w-24 h-24 bg-[#E2C27A]/5 rounded-full blur-xl"></div>
            
            <div className="flex justify-between items-center border-b border-[#E2C27A]/10 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-[#E2C27A]" />
                <h3 className="font-bold text-base text-[#F5F3EE] font-georgia">Approvisionner mon compte</h3>
              </div>
              <button 
                onClick={() => { setIsDepositModalOpen(false); setDepositStatus(null); }}
                className="text-gray-400 hover:text-black p-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#B8B2A8] leading-relaxed mb-4">
              Simulez un dépôt de fonds sur votre compte d'élite WealthCraft. Choisissez la passerelle de paiement et le montant souhaité.
            </p>

            <form onSubmit={handleDepositSubmit} className="space-y-4">
              {/* Deposit Method Select */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#B8B2A8]">Moyen de Paiement</label>
                <select
                  value={depositMethod}
                  onChange={(e) => setDepositMethod(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E2C27A]/20 bg-[#2E220C] text-xs font-semibold text-[#F5F3EE] focus:outline-none focus:border-[#E2C27A] cursor-pointer"
                >
                  <option value="Carte Bancaire Premium">Carte de Débit/Crédit Premium (Instant)</option>
                  <option value="Virement Bancaire SEPA">Virement Bancaire SEPA (Fonds simulés instantanément)</option>
                  <option value="Apple Pay / Google Pay">Apple Pay / Google Pay (Intégration instantanée)</option>
                  <option value="Mobile Money (Orange/MTN)">Mobile Money local (Orange, MTN, Wave)</option>
                </select>
              </div>

              {/* Deposit Amount Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-[#B8B2A8]">Montant du dépôt (F CFA)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">F</span>
                  <input 
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="Saisissez un montant (Ex: 5000)"
                    min="100"
                    max="10000000"
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-[#E2C27A]/20 bg-[#2E220C] text-xs font-bold text-[#F5F3EE] focus:outline-none focus:border-[#E2C27A]"
                    required
                  />
                </div>
                <div className="flex gap-2 pt-1.5">
                  {['1500', '5000', '10000', '50000'].map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setDepositAmount(preset)}
                      className="px-3 py-1 bg-[#E2C27A]/10 text-[#E2C27A] border border-[#E2C27A]/15 rounded-lg text-[10px] font-bold hover:bg-[#E2C27A] hover:text-black transition-colors cursor-pointer"
                    >
                      +{parseInt(preset).toLocaleString('fr-FR')} F
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#C8A25D] to-[#E2C27A] text-[#F5F3EE] font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 glow-btn cursor-pointer"
              >
                Confirmer l'approvisionnement
              </button>
            </form>

            {depositStatus && (
              <div className="p-3 bg-amber-50 text-amber-800 border border-amber-100 rounded-xl text-xs mt-3">
                {depositStatus}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- Slide-in Toast Notifications --- */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#3D2E14] border-l-4 border-l-[#E2C27A] rounded-xl shadow-2xl p-4 border border-[#E2C27A]/20 flex items-start gap-3 animate-slide-left">
          <div className="p-1.5 bg-[#E2C27A]/10 text-[#E2C27A] rounded-lg">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-[#19B37A]" />
            ) : toast.type === 'error' ? (
              <X className="w-5 h-5 text-rose-600" />
            ) : (
              <Sparkles className="w-5 h-5 text-[#E2C27A]" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-[#F5F3EE]">WealthCraft Notification</p>
            <p className="text-[11px] text-[#B8B2A8] mt-0.5 leading-relaxed">{toast.message}</p>
          </div>
          <button 
            onClick={() => setToast(null)}
            className="text-gray-400 hover:text-black cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
