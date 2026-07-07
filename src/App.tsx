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

export default function App() {
  // --- Persistent State Configuration ---
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('wealthcraft_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('wealthcraft_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [referrals, setReferrals] = useState<ReferredUser[]>(() => {
    const saved = localStorage.getItem('wealthcraft_referrals');
    return saved ? JSON.parse(saved) : INITIAL_REFERRALS;
  });

  const [tasks, setTasks] = useState<RewardTask[]>(() => {
    const saved = localStorage.getItem('wealthcraft_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [usedPromoCodes, setUsedPromoCodes] = useState<string[]>(() => {
    const saved = localStorage.getItem('wealthcraft_used_promos');
    return saved ? JSON.parse(saved) : [];
  });

  // UI state managers
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState<boolean>(false);
  
  // Deposit simulator input
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [depositMethod, setDepositMethod] = useState<string>('Carte Bancaire');
  const [depositStatus, setDepositStatus] = useState<string | null>(null);

  // Toast notifications state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Save state back to localStorage on change
  useEffect(() => {
    localStorage.setItem('wealthcraft_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('wealthcraft_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('wealthcraft_referrals', JSON.stringify(referrals));
  }, [referrals]);

  useEffect(() => {
    localStorage.setItem('wealthcraft_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('wealthcraft_used_promos', JSON.stringify(usedPromoCodes));
  }, [usedPromoCodes]);

  // Helper trigger Toast
  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // --- Core Action: Investing ---
  const handleInvest = (assetId: string, amount: number) => {
    const asset = INITIAL_ASSETS.find(a => a.id === assetId);
    if (!asset) return { success: false, error: "Actif non trouvé" };

    if (profile.balance < amount) {
      return { success: false, error: "Fonds insuffisants dans votre solde." };
    }

    // Deduct available, add to invested
    setProfile(prev => {
      const updatedHistory = { ...prev.investmentHistory };
      updatedHistory[assetId] = (updatedHistory[assetId] || 0) + amount;

      return {
        ...prev,
        balance: prev.balance - amount,
        investedBalance: prev.investedBalance + amount,
        investmentHistory: updatedHistory
      };
    });

    // Write transaction ledger
    const newTx: Transaction = {
      id: `TX-INV-${Math.floor(Math.random() * 90000) + 10000}`,
      type: 'investment',
      typeLabel: 'Placement',
      amount,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'success',
      description: `Investissement - ${asset.name}`
    };

    setTransactions(prev => [newTx, ...prev]);

    // Check if First Investment task is completed!
    if (amount >= 1500) {
      setTasks(prevTasks => {
        return prevTasks.map(t => {
          if (t.id === 'first-investment' && t.status === 'available') {
            triggerToast("Félicitations ! Vous avez accompli la quête 'Premier Pas de Géant'. Réclamez vos 2 000 F CFA dans l'onglet Récompenses !", "info");
            return { ...t, status: 'completed' as const };
          }
          return t;
        });
      });
    }

    triggerToast(`Investissement de ${amount.toLocaleString('fr-FR')} F CFA validé dans ${asset.name} !`, 'success');
    return { success: true };
  };

  // --- Core Action: Claiming reward tasks ---
  const handleClaimTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return { success: false, error: "Quête non trouvée" };

    // Credit user's balance
    setProfile(prev => ({
      ...prev,
      balance: prev.balance + task.rewardAmount,
      totalRewardsClaimed: prev.totalRewardsClaimed + task.rewardAmount
    }));

    // Update task status to claimed
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'claimed' as const } : t));

    // Append to transactions ledger
    const newTx: Transaction = {
      id: `TX-REW-${Math.floor(Math.random() * 90000) + 10000}`,
      type: 'reward',
      typeLabel: 'Récompense',
      amount: task.rewardAmount,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'success',
      description: `Bonus obtenu : ${task.title}`
    };

    setTransactions(prev => [newTx, ...prev]);
    triggerToast(`Récompense de ${task.rewardAmount.toLocaleString('fr-FR')} F CFA ajoutée à votre solde !`, 'success');
    return { success: true };
  };

  // --- Core Action: Redeeming a Promo Code ---
  const handleEnterPromoCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    
    if (usedPromoCodes.includes(cleanCode)) {
      return { success: false, error: "Ce code promotionnel a déjà été utilisé sur votre compte." };
    }

    let bonusAmount = 0;
    if (cleanCode === 'GOLDEN2026') {
      bonusAmount = 5000;
    } else if (cleanCode === 'ELITE100') {
      bonusAmount = 10000;
    } else if (cleanCode === 'WEALTHY') {
      bonusAmount = 25000;
    } else {
      return { success: false, error: "Code promotionnel invalide." };
    }

    setUsedPromoCodes(prev => [...prev, cleanCode]);

    setProfile(prev => ({
      ...prev,
      balance: prev.balance + bonusAmount,
      totalRewardsClaimed: prev.totalRewardsClaimed + bonusAmount
    }));

    const newTx: Transaction = {
      id: `TX-PRM-${Math.floor(Math.random() * 90000) + 10000}`,
      type: 'reward',
      typeLabel: 'Code Promotionnel',
      amount: bonusAmount,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'success',
      description: `Code privilège ${cleanCode} activé`
    };

    setTransactions(prev => [newTx, ...prev]);
    triggerToast(`Félicitations ! Code ${cleanCode} validé (+${bonusAmount.toLocaleString('fr-FR')} F CFA)`, 'success');
    return { success: true, amount: bonusAmount };
  };

  // --- Core Action: Invite a new friend (simulated) ---
  const handleInviteFriend = (name: string, email: string) => {
    const newFriend: ReferredUser = {
      id: `ref-${Date.now()}`,
      name,
      email,
      dateJoined: new Date().toISOString().slice(0, 10),
      status: 'Enregistré',
      rewardEarned: 0
    };

    setReferrals(prev => [...prev, newFriend]);

    const newTx: Transaction = {
      id: `TX-INV-${Math.floor(Math.random() * 90000) + 10000}`,
      type: 'referral',
      typeLabel: 'Parrainage',
      amount: 0,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'pending',
      description: `Invitation envoyée à ${name}`
    };

    setTransactions(prev => [newTx, ...prev]);
    triggerToast(`Invitation envoyée avec succès à ${name} !`, 'success');
  };

  // --- Core Action: Simulate active investment from a referred friend ---
  const handleSimulateFirstInvestment = (refId: string) => {
    const friend = referrals.find(r => r.id === refId);
    if (!friend || friend.status.includes('Actif')) return;

    // Award 2500 F CFA to current user, mark friend as active
    setProfile(prev => ({
      ...prev,
      balance: prev.balance + 2500,
      totalReferralEarnings: prev.totalReferralEarnings + 2500
    }));

    setReferrals(prev => prev.map(r => {
      if (r.id === refId) {
        return {
          ...r,
          status: 'Actif (1er Investissement)',
          rewardEarned: 2500
        };
      }
      return r;
    }));

    // Post reward transaction
    const newTx: Transaction = {
      id: `TX-REF-${Math.floor(Math.random() * 90000) + 10000}`,
      type: 'referral',
      typeLabel: 'Parrainage',
      amount: 2500,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'success',
      description: `Bonus parrainage d'or - ${friend.name}`
    };

    setTransactions(prev => [newTx, ...prev]);
    triggerToast(`Votre filleul(e) ${friend.name} vient d'investir. Vous gagnez 2 500 F CFA !`, 'success');
  };

  // --- Core Action: Withdrawals ---
  const handleWithdraw = (amount: number, method: string, details: string) => {
    if (profile.balance < amount) {
      return { success: false, error: "Fonds insuffisants" };
    }

    setProfile(prev => ({
      ...prev,
      balance: prev.balance - amount
    }));

    const newTx: Transaction = {
      id: `TX-WTH-${Math.floor(Math.random() * 90000) + 10000}`,
      type: 'withdrawal',
      typeLabel: 'Retrait d\'argent',
      amount,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'success',
      description: `Retrait vers ${details}`,
      method
    };

    setTransactions(prev => [newTx, ...prev]);
    triggerToast(`Retrait de ${amount.toLocaleString('fr-FR')} F CFA initié par ${method}.`, 'success');
    return { success: true };
  };

  // --- Core Action: Simulated Fund Deposit ---
  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);

    if (isNaN(amount) || amount <= 0) {
      setDepositStatus("Veuillez saisir un montant de dépôt supérieur à 0 F CFA.");
      return;
    }

    setProfile(prev => ({
      ...prev,
      balance: prev.balance + amount
    }));

    const newTx: Transaction = {
      id: `TX-DEP-${Math.floor(Math.random() * 90000) + 10000}`,
      type: 'deposit',
      typeLabel: 'Dépôt',
      amount,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'success',
      description: `Dépôt approvisionné par ${depositMethod}`,
      method: depositMethod
    };

    setTransactions(prev => [newTx, ...prev]);
    
    // Check if identity quest should be completed since we verified their gateway
    setTasks(prevTasks => {
      return prevTasks.map(t => {
        if (t.id === 'kyc-verify' && t.status === 'available') {
          triggerToast("Sécurisation KYC validée avec succès ! Réclamez vos 1 000 F CFA !", "info");
          return { ...t, status: 'completed' as const };
        }
        return t;
      });
    });

    triggerToast(`Votre compte a été crédité de +${amount.toLocaleString('fr-FR')} F CFA par ${depositMethod} !`, 'success');
    
    // Reset deposit form
    setDepositAmount('');
    setIsDepositModalOpen(false);
    setDepositStatus(null);
  };

  // --- Core Action: Wheel of Fortune ---
  const handleWinWheelPrize = (amount: number, label: string) => {
    if (amount > 0) {
      setProfile(prev => ({
        ...prev,
        balance: prev.balance + amount
      }));

      const newTx: Transaction = {
        id: `TX-WHL-${Math.floor(Math.random() * 90000) + 10000}`,
        type: 'reward',
        typeLabel: 'Roue de la Fortune',
        amount,
        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
        status: 'success',
        description: `Gagné à la Roue de la Fortune : ${label}`
      };

      setTransactions(prev => [newTx, ...prev]);
      triggerToast(`Félicitations ! Vous avez gagné ${label} ! (+${amount.toLocaleString('fr-FR')} F CFA ajoutés au solde)`, 'success');
    } else if (label.toLowerCase() === 'recommencer') {
      triggerToast("Tour gratuit ! Vous pouvez rejouer immédiatement.", "info");
    } else {
      triggerToast("Dommage, vous avez perdu ! Tentez votre chance à nouveau.", "error");
    }
  };

  // Safe navigation function
  const navigateToTab = (tabName: string) => {
    setActiveTab(tabName);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8F3EA] text-[#1F1F1F] flex flex-col font-sans selection:bg-[#C9A86A] selection:text-white">
      {/* --- Premium Header / Navigation Bar --- */}
      <header className="sticky top-0 z-40 bg-[#FFFDF8]/80 backdrop-blur-md border-b border-[#C9A86A]/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Elegant Minimalist Logo */}
            <div 
              onClick={() => navigateToTab('dashboard')} 
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#1F1F1F] via-[#2D2D2D] to-[#1F1F1F] flex items-center justify-center border border-[#C9A86A]/30 shadow-md group-hover:scale-105 transition-all">
                <span className="font-extrabold text-[#E6C687] text-base font-manrope tracking-wider">W</span>
                <span className="font-bold text-[#FFFDF8] text-sm font-manrope absolute bottom-1 right-2">C</span>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#C9A86A]/10 to-transparent animate-pulse rounded-[14px]"></div>
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight font-manrope block text-[#1F1F1F]">
                  Wealth<span className="text-[#C9A86A]">Craft</span>
                </span>
                <span className="text-[9px] text-[#666666] tracking-widest font-bold uppercase block -mt-1">
                  Premium Wealth
                </span>
              </div>
            </div>

            {/* Universal Navigation Menu Button (Three Bars) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#FFFDF8] border-2 border-[#C9A86A]/20 hover:border-[#C9A86A]/50 text-[#1F1F1F] rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-sm active:scale-95"
              >
                {isMobileMenuOpen ? <X className="w-4.5 h-4.5 text-[#C9A86A]" /> : <Menu className="w-4.5 h-4.5 text-[#C9A86A]" />}
                <span>Onglets</span>
              </button>
            </div>

            {/* Right Header Controls (Balances & Profile) */}
            <div className="flex items-center gap-3">
              {/* Account Quick Cash Display */}
              <div className="hidden sm:flex bg-[#FFFDF8] border border-[#C9A86A]/20 px-4 py-2 rounded-2xl items-center gap-2.5">
                <Wallet className="w-4.5 h-4.5 text-[#C9A86A]" />
                <div className="text-left">
                  <p className="text-[9px] uppercase tracking-wider text-[#666666] font-semibold">Disponible</p>
                  <p className="text-xs font-extrabold text-[#1F1F1F]">{profile.balance.toLocaleString('fr-FR')} F CFA</p>
                </div>
                <button 
                  onClick={() => setIsDepositModalOpen(true)}
                  className="ml-2 bg-gradient-to-r from-[#E6C687] to-[#C9A86A] text-[#1F1F1F] p-1.5 rounded-lg hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
                  title="Faire un dépôt d'essai"
                >
                  <Plus className="w-3.5 h-3.5 font-bold" />
                </button>
              </div>

              {/* Deposit Plus icon on very small screen */}
              <button 
                onClick={() => setIsDepositModalOpen(true)}
                className="sm:hidden bg-gradient-to-r from-[#E6C687] to-[#C9A86A] text-[#1F1F1F] p-2.5 rounded-xl shadow hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                title="Dépôt"
              >
                <Plus className="w-4 h-4 font-bold" />
              </button>

              {/* Profile Badge */}
              <div className="hidden sm:flex items-center gap-2 bg-[#1F1F1F] text-white py-1.5 pl-3 pr-2 rounded-2xl border border-white/10">
                <span className="text-xs font-bold">{profile.name.split(' ')[0]}</span>
                <span className="bg-[#C9A86A] text-[#1F1F1F] text-[9px] font-black px-1.5 py-0.5 rounded-lg uppercase">
                  {profile.tier}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Universal Navigation Dropdown (opens with the 3 bars) */}
        {isMobileMenuOpen && (
          <div className="border-t border-[#C9A86A]/10 bg-[#FFFDF8] shadow-2xl animate-slide-down relative z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between mb-5 border-b border-[#C9A86A]/10 pb-3">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-[#C9A86A]">Sélectionner un onglet</p>
                  <p className="text-xs text-[#666666] mt-0.5">Accédez instantanément aux différents services premium de WealthCraft.</p>
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
                  { id: 'gagner', label: 'Gagner', desc: 'Placements de co-investissement et quêtes de capitalisation d\'or.', icon: <Building className="w-5 h-5" />, hasBadge: tasks.some(t => t.status === 'completed' || t.status === 'available') },
                  { id: 'top', label: 'Top', desc: 'Le Cercle d\'Or — Classement d\'élite des investisseurs et performances.', icon: <Award className="w-5 h-5" /> },
                  { id: 'inviter', label: 'Inviter', desc: 'Partagez votre lien de parrainage de prestige pour recevoir des primes.', icon: <Users className="w-5 h-5" /> },
                  { id: 'retrait', label: 'Retrait', desc: 'Transférez vos gains disponibles en toute sécurité vers vos comptes.', icon: <ArrowUpRight className="w-5 h-5" /> }
                ].map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigateToTab(item.id)}
                      className={`text-left p-5 rounded-[20px] border transition-all flex gap-4 cursor-pointer relative group ${
                        isActive 
                          ? 'bg-[#C9A86A]/10 border-[#C9A86A] shadow-md' 
                          : 'bg-[#FFFDF8] hover:bg-white border-[#C9A86A]/5 hover:border-[#C9A86A]/20'
                      }`}
                    >
                      <div className={`p-3 rounded-xl shrink-0 transition-all ${
                        isActive ? 'bg-[#C9A86A] text-white' : 'bg-[#C9A86A]/10 text-[#C9A86A] group-hover:bg-[#C9A86A]/20 group-hover:scale-105'
                      }`}>
                        {item.icon}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-extrabold font-manrope ${isActive ? 'text-[#C9A86A]' : 'text-gray-900'}`}>
                            {item.label}
                          </span>
                          {item.hasBadge && (
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#666666] leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
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
          />
        )}

        {activeTab === 'gagner' && (
          <InvestmentTab 
            assets={INITIAL_ASSETS} 
            profile={profile} 
            onInvest={handleInvest}
            onOpenDeposit={() => setIsDepositModalOpen(true)}
            tasks={tasks}
            onClaimTask={handleClaimTask}
            onEnterPromoCode={handleEnterPromoCode}
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

        {activeTab === 'retrait' && (
          <div className="space-y-8 animate-fade-in">
            <WithdrawTab 
              profile={profile} 
              transactions={transactions} 
              onWithdraw={handleWithdraw}
            />

            {/* Complete audit ledger of transactions at the bottom of Withdrawal section */}
            <div className="glass-card p-6 md:p-8 rounded-[24px] space-y-6 border border-[#C9A86A]/10 bg-[#FFFDF8]">
              <div className="flex justify-between items-center border-b border-[#C9A86A]/10 pb-4">
                <div>
                  <h2 className="text-base font-bold text-[#1F1F1F] font-manrope">Grand Livre des Transactions</h2>
                  <p className="text-[10px] text-[#666666] mt-1">L'ensemble de vos flux financiers audités et horodatés.</p>
                </div>
                <span className="text-[9px] uppercase font-bold text-[#C9A86A] bg-[#C9A86A]/10 px-3 py-1 rounded-full border border-[#C9A86A]/20">
                  Compte Sécurisé
                </span>
              </div>

              {transactions.length === 0 ? (
                <p className="text-xs text-center py-12 text-[#666666]">Aucune transaction enregistrée.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#C9A86A]/10 text-[9px] uppercase text-[#666666] font-semibold">
                        <th className="py-2 px-2">Transaction ID</th>
                        <th className="py-2 px-2">Type</th>
                        <th className="py-2 px-2">Date & Heure</th>
                        <th className="py-2 px-2">Description</th>
                        <th className="py-2 px-2 text-right">Montant</th>
                        <th className="py-2 px-2 text-center">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#C9A86A]/5">
                      {transactions.map((tx) => {
                        const isPositive = tx.type === 'deposit' || tx.type === 'reward' || tx.type === 'referral';
                        return (
                          <tr key={tx.id} className="text-xs hover:bg-[#FFFDF8] transition-all">
                            <td className="py-3 px-2 font-mono font-bold text-gray-500">{tx.id}</td>
                            <td className="py-3 px-2">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                tx.type === 'deposit' ? 'bg-emerald-50 text-emerald-700' :
                                tx.type === 'withdrawal' ? 'bg-amber-50 text-amber-700' :
                                tx.type === 'investment' ? 'bg-[#1F1F1F]/5 text-[#1F1F1F]' : 'bg-[#C9A86A]/10 text-[#C9A86A]'
                              }`}>
                                {tx.typeLabel}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-[#666666] font-medium">{tx.date}</td>
                            <td className="py-3 px-2 text-gray-800 font-semibold">{tx.description}</td>
                            <td className={`py-3 px-2 text-right font-black text-xs ${isPositive ? 'text-emerald-600' : 'text-[#1F1F1F]'}`}>
                              {isPositive ? '+' : '-'} {tx.amount.toLocaleString('fr-FR')} F CFA
                            </td>
                            <td className="py-3 px-2 text-center">
                              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100">
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
      <footer className="bg-[#FFFDF8] border-t border-[#C9A86A]/10 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-[#C9A86A]/10">
            {/* Column 1: Short summary */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#1F1F1F] flex items-center justify-center border border-[#C9A86A]/30">
                  <span className="font-black text-[#E6C687] text-xs font-manrope">W</span>
                </div>
                <span className="font-extrabold text-sm tracking-tight font-manrope">
                  Wealth<span className="text-[#C9A86A]">Craft</span>
                </span>
              </div>
              <p className="text-xs text-[#666666] leading-relaxed">
                Première plateforme décentralisée de co-investissement d'élite. Gagnez de l'or, investissez sur le prestige immobilier et retirez instantanément.
              </p>
            </div>

            {/* Column 2: Legal entities disclaimers */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#1F1F1F] uppercase tracking-wider">Sécurité & Régulation</h4>
              <p className="text-[10px] text-[#666666] leading-relaxed">
                WealthCraft est un intermédiaire en investissement agréé. Les fonds sont garantis à hauteur de 65 000 000 F CFA par notre banque partenaire dépositaire régulée par la BCEAO et l'UMOA.
              </p>
            </div>

            {/* Column 3: Quick contacts */}
            <div className="space-y-2 text-xs">
              <h4 className="text-xs font-bold text-[#1F1F1F] uppercase tracking-wider">Partenaire Officiel</h4>
              <div className="flex items-center gap-2 text-[#666666]">
                <Shield className="w-4 h-4 text-[#C9A86A]" />
                <span>Audit de Sécurité de niveau bancaire certifié</span>
              </div>
              <p className="text-[10px] text-gray-400">© 2026 WealthCraft Technologies Inc. Tous droits réservés.</p>
            </div>
          </div>

          <div className="pt-6 text-center text-[10px] text-[#666666] leading-relaxed max-w-4xl mx-auto space-y-1">
            <p>
              *Avertissement sur les risques: L'investissement dans des classes d'actifs alternatifs comporte un risque de perte en capital. Les rendements passés ne garantissent pas les rendements futurs. Diversifiez vos placements et n'investissez que l'argent dont vous n'avez pas un besoin immédiat.
            </p>
          </div>
        </div>
      </footer>

      {/* --- Deposit Simulator Dialog/Modal (Revolut-styled) --- */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FFFDF8] max-w-md w-full rounded-[28px] border border-[#C9A86A]/30 p-6 shadow-2xl relative overflow-hidden animate-scale-up">
            <div className="absolute right-0 top-0 w-24 h-24 bg-[#C9A86A]/5 rounded-full blur-xl"></div>
            
            <div className="flex justify-between items-center border-b border-[#C9A86A]/10 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-[#C9A86A]" />
                <h3 className="font-extrabold text-base text-[#1F1F1F] font-manrope">Approvisionner mon compte</h3>
              </div>
              <button 
                onClick={() => { setIsDepositModalOpen(false); setDepositStatus(null); }}
                className="text-gray-400 hover:text-black p-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#666666] leading-relaxed mb-4">
              Simulez un dépôt de fonds sur votre compte d'élite WealthCraft. Choisissez la passerelle de paiement et le montant souhaité.
            </p>

            <form onSubmit={handleDepositSubmit} className="space-y-4">
              {/* Deposit Method Select */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#666666]">Moyen de Paiement</label>
                <select
                  value={depositMethod}
                  onChange={(e) => setDepositMethod(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#C9A86A]/20 bg-white text-xs font-semibold text-[#1F1F1F] focus:outline-none focus:border-[#C9A86A] cursor-pointer"
                >
                  <option value="Carte Bancaire Premium">Carte de Débit/Crédit Premium (Instant)</option>
                  <option value="Virement Bancaire SEPA">Virement Bancaire SEPA (Fonds simulés instantanément)</option>
                  <option value="Apple Pay / Google Pay">Apple Pay / Google Pay (Intégration instantanée)</option>
                  <option value="Mobile Money (Orange/MTN)">Mobile Money local (Orange, MTN, Wave)</option>
                </select>
              </div>

              {/* Deposit Amount Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-[#666666]">Montant du dépôt (F CFA)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">F</span>
                  <input 
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="Saisissez un montant (Ex: 5000)"
                    min="100"
                    max="10000000"
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-[#C9A86A]/20 bg-white text-xs font-bold text-[#1F1F1F] focus:outline-none focus:border-[#C9A86A]"
                    required
                  />
                </div>
                <div className="flex gap-2 pt-1.5">
                  {['1500', '5000', '10000', '50000'].map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setDepositAmount(preset)}
                      className="px-3 py-1 bg-[#C9A86A]/10 text-[#C9A86A] border border-[#C9A86A]/15 rounded-lg text-[10px] font-bold hover:bg-[#C9A86A] hover:text-black transition-colors cursor-pointer"
                    >
                      +{parseInt(preset).toLocaleString('fr-FR')} F
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#E6C687] to-[#C9A86A] text-[#1F1F1F] font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 glow-btn cursor-pointer"
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
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#FFFDF8] border-l-4 border-l-[#C9A86A] rounded-xl shadow-2xl p-4 border border-[#C9A86A]/20 flex items-start gap-3 animate-slide-left">
          <div className="p-1.5 bg-[#C9A86A]/10 text-[#C9A86A] rounded-lg">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : toast.type === 'error' ? (
              <X className="w-5 h-5 text-rose-600" />
            ) : (
              <Sparkles className="w-5 h-5 text-[#C9A86A]" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-[#1F1F1F]">WealthCraft Notification</p>
            <p className="text-[11px] text-[#666666] mt-0.5 leading-relaxed">{toast.message}</p>
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
