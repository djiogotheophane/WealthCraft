import React, { useState } from 'react';
import { 
  Building, 
  Coins, 
  TrendingUp, 
  Cpu, 
  Calculator, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  ArrowRight,
  Sparkles,
  Award,
  Check,
  Gift,
  Share2,
  Shield,
  Zap,
  Tag
} from 'lucide-react';
import { InvestmentAsset, UserProfile, RewardTask } from '../types';

interface InvestmentTabProps {
  assets: InvestmentAsset[];
  profile: UserProfile;
  onInvest: (assetId: string, amount: number) => { success: boolean; error?: string };
  onOpenDeposit: () => void;
  tasks: RewardTask[];
  onClaimTask: (taskId: string) => { success: boolean; error?: string };
  onEnterPromoCode: (code: string) => { success: boolean; amount?: number; error?: string };
}

export default function InvestmentTab({ 
  assets, 
  profile, 
  onInvest, 
  onOpenDeposit,
  tasks,
  onClaimTask,
  onEnterPromoCode
}: InvestmentTabProps) {
  // Gagner Sub-Tab Mode
  const [mode, setMode] = useState<'invest' | 'quests'>('invest');

  // Invest Mode State
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'standard' | 'premium'>('all');
  const [selectedAsset, setSelectedAsset] = useState<InvestmentAsset | null>(null);
  
  // Simulator State
  const [packQuantity, setPackQuantity] = useState<number>(1);
  const [investInputAmount, setInvestInputAmount] = useState<string>('');
  const [investStatus, setInvestStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Promo Code State
  const [promoInput, setPromoInput] = useState('');
  const [promoStatus, setPromoStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [claimedTaskId, setClaimedTaskId] = useState<string | null>(null);

  const filteredAssets = selectedCategory === 'all' 
    ? assets 
    : assets.filter(asset => asset.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'standard': return <Zap className="w-5 h-5 text-[#C9A86A]" />;
      case 'premium': return <Award className="w-5 h-5 text-[#C9A86A]" />;
      default: return <Sparkles className="w-5 h-5 text-[#C9A86A]" />;
    }
  };

  const getTaskIcon = (category: string) => {
    switch (category) {
      case 'security': return <Shield className="w-5 h-5 text-[#C9A86A]" />;
      case 'investment': return <TrendingUp className="w-5 h-5 text-[#C9A86A]" />;
      case 'social': return <Share2 className="w-5 h-5 text-[#C9A86A]" />;
      case 'daily': return <Sparkles className="w-5 h-5 text-[#C9A86A]" />;
      default: return <Gift className="w-5 h-5 text-[#C9A86A]" />;
    }
  };

  const handleSimulate = (asset: InvestmentAsset) => {
    setSelectedAsset(asset);
    setPackQuantity(1);
    setInvestInputAmount(asset.minInvestment.toString());
    setInvestStatus(null);
  };

  const handleInvestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;

    const amount = parseFloat(investInputAmount);
    if (isNaN(amount) || amount <= 0) {
      setInvestStatus({ success: false, message: "Veuillez entrer un montant valide." });
      return;
    }

    if (amount < selectedAsset.minInvestment) {
      setInvestStatus({ 
        success: false, 
        message: `Le montant minimum d'investissement pour cet actif est de ${selectedAsset.minInvestment.toLocaleString('fr-FR')} F CFA.` 
      });
      return;
    }

    if (amount > profile.balance) {
      setInvestStatus({ 
        success: false, 
        message: `Fonds insuffisants. Il vous manque ${(amount - profile.balance).toLocaleString('fr-FR')} F CFA.` 
      });
      return;
    }

    const result = onInvest(selectedAsset.id, amount);
    if (result.success) {
      setInvestStatus({ 
        success: true, 
        message: `Félicitations ! Vous avez investi ${amount.toLocaleString('fr-FR')} F CFA dans "${selectedAsset.name}".` 
      });
      setInvestInputAmount('');
    } else {
      setInvestStatus({ success: false, message: result.error || "Une erreur est survenue." });
    }
  };

  const handleClaim = (taskId: string) => {
    setClaimedTaskId(taskId);
    onClaimTask(taskId);
    setTimeout(() => {
      setClaimedTaskId(null);
    }, 1500);
  };

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const result = onEnterPromoCode(promoInput.toUpperCase());
    if (result.success) {
      setPromoStatus({
        success: true,
        message: `Code validé ! Bonus de ${result.amount?.toLocaleString('fr-FR')} F CFA ajouté sur votre solde.`
      });
      setPromoInput('');
    } else {
      setPromoStatus({
        success: false,
        message: result.error || "Code privilège invalide ou déjà utilisé."
      });
    }
  };

  const categoriesList = [
    { id: 'all', label: 'Tous les Plans' },
    { id: 'standard', label: 'Plans Standards' },
    { id: 'premium', label: 'Option Premium' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Section Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-[#C9A86A]/10 pb-5 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-[#1F1F1F] font-manrope tracking-tight">Espace Gagner</h2>
          <p className="text-xs text-[#666666] mt-1">Générez de hauts rendements via nos investissements d'élite ou réclamez vos primes d'or.</p>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex bg-[#FFFDF8] border border-[#C9A86A]/20 p-1 rounded-2xl max-w-sm shrink-0">
          <button
            onClick={() => setMode('invest')}
            className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              mode === 'invest'
                ? 'bg-[#1F1F1F] text-white shadow'
                : 'text-[#666666] hover:text-black hover:bg-gray-50'
            }`}
          >
            Investissements
          </button>
          <button
            onClick={() => setMode('quests')}
            className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              mode === 'quests'
                ? 'bg-[#1F1F1F] text-white shadow'
                : 'text-[#666666] hover:text-black hover:bg-gray-50'
            }`}
          >
            Quêtes & Codes
          </button>
        </div>
      </div>

      {/* --- MODE 1: INVESTMENTS --- */}
      {mode === 'invest' && (
        <div className="space-y-8">
          {/* Categories Pill Navigation */}
          <div className="flex flex-wrap gap-2 pt-1">
            {categoriesList.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all border ${
                  selectedCategory === cat.id 
                    ? 'bg-[#1F1F1F] text-white border-[#1F1F1F]' 
                    : 'bg-[#FFFDF8] text-[#666666] border-[#C9A86A]/20 hover:border-[#C9A86A]/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Assets List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredAssets.map(asset => {
                  const userActiveInvest = profile.investmentHistory[asset.id] || 0;
                  return (
                    <div 
                      key={asset.id} 
                      className="glass-card hover:translate-y-[-4px] transition-all duration-300 p-6 rounded-[24px] flex flex-col justify-between border border-[#C9A86A]/10 shadow-sm relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#C9A86A]/5 rounded-full blur-xl group-hover:bg-[#C9A86A]/10 transition-all"></div>
                      
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-[#C9A86A]/10 rounded-2xl">
                            {getCategoryIcon(asset.category)}
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            asset.riskLevel === 'Faible' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : asset.riskLevel === 'Modéré'
                              ? 'bg-amber-50 text-amber-700 border border-amber-100'
                              : 'bg-rose-50 text-rose-700 border border-rose-100'
                          }`}>
                            Risque {asset.riskLevel}
                          </span>
                        </div>

                        <h3 className="font-bold text-base text-[#1F1F1F] group-hover:text-[#C9A86A] transition-colors font-manrope">
                          {asset.name}
                        </h3>
                        <p className="text-xs text-[#666666] mt-2 line-clamp-2">
                          {asset.description}
                        </p>

                        <div className="grid grid-cols-3 gap-2 my-4 bg-[#FFFDF8] p-3 rounded-xl border border-[#C9A86A]/10">
                          <div>
                            <p className="text-[9px] text-[#666666] uppercase tracking-wider font-semibold">Gain / Jour</p>
                            <p className="text-xs font-extrabold text-[#C9A86A]">{asset.dailyReturn?.toLocaleString('fr-FR')} F</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-[#666666] uppercase tracking-wider font-semibold">Durée</p>
                            <p className="text-xs font-extrabold text-[#1F1F1F]">{asset.durationDays} Jours</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-[#666666] uppercase tracking-wider font-semibold">Prix</p>
                            <p className="text-xs font-extrabold text-[#1F1F1F]">{asset.minInvestment.toLocaleString('fr-FR')} F</p>
                          </div>
                        </div>
                      </div>

                      {userActiveInvest > 0 && (
                        <div className="mb-4 flex items-center gap-2 bg-[#C9A86A]/10 p-2 rounded-xl border border-[#C9A86A]/20">
                          <CheckCircle2 className="w-4 h-4 text-[#C9A86A]" />
                          <div className="text-[11px]">
                            <span className="text-[#666666]">Votre placement :</span> <strong className="text-[#1F1F1F]">{userActiveInvest.toLocaleString('fr-FR')} F CFA</strong>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => handleSimulate(asset)}
                        className="w-full bg-[#1F1F1F] text-white hover:bg-[#C9A86A] font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-all glow-btn cursor-pointer"
                      >
                        Simuler & Investir
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Simulation Sidebar */}
            <div>
              {selectedAsset ? (
                <div className="glass-card p-6 rounded-[24px] border border-[#C9A86A]/30 space-y-6 sticky top-4 animate-fade-in">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-[#C9A86A] uppercase tracking-wider">Simulateur de Placement</span>
                      <h3 className="text-lg font-bold text-[#1F1F1F] font-manrope">{selectedAsset.name}</h3>
                    </div>
                    <button 
                      onClick={() => setSelectedAsset(null)}
                      className="text-xs font-semibold text-gray-400 hover:text-black hover:bg-gray-100 p-1 px-2 rounded-lg cursor-pointer"
                    >
                      Fermer
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FFFDF8] border border-[#C9A86A]/15 space-y-2 text-xs">
                    <p className="text-[#666666] leading-relaxed italic">{selectedAsset.longDescription}</p>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#C9A86A]/10 font-semibold">
                      <div>Gain par jour : <span className="text-[#C9A86A] font-extrabold">{selectedAsset.dailyReturn?.toLocaleString('fr-FR')} F CFA</span></div>
                      <div>Durée totale : <span className="text-[#1F1F1F] font-bold">{selectedAsset.durationDays} Jours</span></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-[#666666]">Nombre de packs</span>
                        <span className="text-[#1F1F1F] font-bold">{packQuantity} pack{packQuantity > 1 ? 's' : ''}</span>
                      </div>
                      <input 
                        type="range" 
                        min={1} 
                        max={10} 
                        step={1}
                        value={packQuantity}
                        onChange={(e) => {
                          const qty = Number(e.target.value);
                          setPackQuantity(qty);
                          setInvestInputAmount((qty * selectedAsset.minInvestment).toString());
                        }}
                        className="w-full accent-[#C9A86A] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                        <span>1 pack ({selectedAsset.minInvestment.toLocaleString('fr-FR')} F)</span>
                        <span>10 packs ({(10 * selectedAsset.minInvestment).toLocaleString('fr-FR')} F)</span>
                      </div>
                    </div>

                    {(() => {
                      const cost = selectedAsset.minInvestment * packQuantity;
                      const daily = (selectedAsset.dailyReturn || 0) * packQuantity;
                      const days = selectedAsset.durationDays || 1;
                      const totalReturn = daily * days;
                      const netGains = totalReturn - cost;
                      return (
                        <div className="p-4 rounded-xl bg-[#1F1F1F] text-white space-y-2.5 relative overflow-hidden">
                          <div className="absolute right-0 bottom-0 w-24 h-24 bg-[#C9A86A]/10 rounded-full blur-xl"></div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400">Rendements du Placement</span>
                            <span className="text-[10px] font-bold text-[#E6C687] flex items-center gap-1">
                              <Calculator className="w-3.5 h-3.5" /> Projection
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <div>
                              <p className="text-[9px] text-gray-400 uppercase tracking-wider">Investissement</p>
                              <p className="text-sm font-bold text-white">{cost.toLocaleString('fr-FR')} F CFA</p>
                            </div>
                            <div>
                              <p className="text-[9px] text-gray-400 uppercase tracking-wider">Gain Journalier</p>
                              <p className="text-sm font-extrabold text-[#E6C687]">{daily.toLocaleString('fr-FR')} F CFA/j</p>
                            </div>
                          </div>

                          <div className="flex justify-between text-[11px] text-gray-300 pt-2.5 border-t border-white/10">
                            <span>Durée totale :</span>
                            <span className="font-bold text-white">{days} jours</span>
                          </div>
                          <div className="flex justify-between text-[11px] text-gray-300">
                            <span>Retour total (Brut) :</span>
                            <span className="font-extrabold text-[#E6C687]">{totalReturn.toLocaleString('fr-FR')} F CFA</span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-200 pt-1.5 border-t border-dashed border-white/10">
                            <span>Bénéfice Net :</span>
                            <span className="font-black text-emerald-400">+{netGains.toLocaleString('fr-FR')} F CFA</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <form onSubmit={handleInvestSubmit} className="space-y-3 pt-2 border-t border-[#C9A86A]/15">
                    <div className="flex justify-between text-xs font-bold text-[#1F1F1F]">
                      <span>Solde disponible :</span>
                      <span>{profile.balance.toLocaleString('fr-FR')} F CFA</span>
                    </div>
                    
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">F</span>
                      <input 
                        type="number"
                        value={investInputAmount}
                        onChange={(e) => setInvestInputAmount(e.target.value)}
                        placeholder={`Montant d'investissement (min: ${selectedAsset.minInvestment})`}
                        className="w-full pl-8 pr-4 py-3 rounded-xl border border-[#C9A86A]/20 bg-white text-xs font-bold text-[#1F1F1F] focus:outline-none focus:border-[#C9A86A]"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#E6C687] to-[#C9A86A] text-[#1F1F1F] font-bold text-xs py-3.5 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 glow-btn cursor-pointer"
                    >
                      Confirmer mon investissement
                    </button>
                  </form>

                  {investStatus && (
                    <div className={`p-3.5 rounded-xl text-xs flex items-start gap-2 border ${
                      investStatus.success 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                        : 'bg-amber-50 text-amber-800 border-amber-100'
                    }`}>
                      {investStatus.success ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-semibold">{investStatus.success ? "Opération réussie" : "Attention"}</p>
                        <p className="mt-0.5 leading-relaxed">{investStatus.message}</p>
                        {!investStatus.success && investStatus.message.includes('insuffisants') && (
                          <button 
                            onClick={onOpenDeposit}
                            className="text-xs font-bold text-[#C9A86A] hover:underline block mt-2 text-left cursor-pointer"
                          >
                            Approvisionner mon compte maintenant &rarr;
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="glass-card p-6 rounded-[24px] border border-dashed border-[#C9A86A]/30 text-center py-12 space-y-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-[#C9A86A]/10 flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-[#C9A86A]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1F1F1F] text-sm uppercase tracking-wider">Simulateur Intelligent</h3>
                    <p className="text-xs text-[#666666] max-w-xs mx-auto mt-1">
                      Sélectionnez l'un de nos plans de placement ci-contre pour estimer vos profits futurs et configurer votre investissement.
                    </p>
                  </div>
                  <div className="bg-[#FFFDF8] p-3 rounded-xl border border-[#C9A86A]/10 text-left space-y-2 max-w-xs mx-auto">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-[#C9A86A] uppercase tracking-wider">
                      <Info className="w-3.5 h-3.5" /> Astuce de gestion
                    </div>
                    <p className="text-[11px] text-[#666666] leading-relaxed">
                      Diversifiez votre épargne en répartissant vos investissements sur nos plans Standards et Premium pour maximiser vos gains journaliers sécurisés.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MODE 2: REWARDS / QUESTS --- */}
      {mode === 'quests' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quests Lists */}
          <div className="lg:col-span-2 space-y-5">
            <h3 className="text-lg font-bold text-[#1F1F1F] font-manrope flex items-center gap-2">
              <Award className="w-5 h-5 text-[#C9A86A]" />
              Quêtes de Capitalisation
            </h3>

            <div className="space-y-4">
              {tasks.map((task) => {
                const isClaimed = task.status === 'claimed';
                return (
                  <div 
                    key={task.id} 
                    className={`glass-card p-5 rounded-[24px] border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isClaimed 
                        ? 'opacity-65 border-[#C9A86A]/5 bg-gray-50/20' 
                        : 'hover:border-[#C9A86A]/30 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex gap-4 items-start">
                      <div className={`p-3.5 rounded-xl ${
                        isClaimed ? 'bg-gray-100 text-gray-400' : 'bg-[#C9A86A]/10 text-[#C9A86A]'
                      }`}>
                        {getTaskIcon(task.category)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-sm font-bold font-manrope ${isClaimed ? 'text-gray-400 line-through' : 'text-[#1F1F1F]'}`}>
                            {task.title}
                          </h4>
                          {!isClaimed && (
                            <span className="text-[9px] bg-[#C9A86A]/15 text-[#C9A86A] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-[#C9A86A]/20">
                              +{task.rewardAmount.toLocaleString('fr-FR')} F
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#666666] leading-relaxed max-w-md">
                          {task.description}
                        </p>
                      </div>
                    </div>
 
                    <div className="flex items-center">
                      {isClaimed ? (
                        <div className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                           <Check className="w-4 h-4" /> Réclamé
                        </div>
                      ) : (
                        <button
                          onClick={() => handleClaim(task.id)}
                          disabled={claimedTaskId !== null || (task.status !== 'completed' && task.status !== 'available')}
                          className={`w-full md:w-auto font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm shrink-0 flex items-center justify-center gap-1.5 cursor-pointer ${
                            task.status === 'completed' || task.status === 'available'
                              ? 'bg-gradient-to-r from-[#E6C687] to-[#C9A86A] text-[#1F1F1F] hover:scale-105 active:scale-95'
                              : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                          }`}
                        >
                          {claimedTaskId === task.id ? (
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 bg-[#1F1F1F] rounded-full animate-ping"></span> Réclamation...
                            </span>
                          ) : (
                            <>
                              {task.status === 'completed' || task.status === 'available' ? task.actionLabel : 'Verrouillé'}
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
 
          {/* Golden Code Input Form */}
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-[24px] space-y-4 border border-[#C9A86A]/20 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-20 h-20 bg-[#C9A86A]/5 rounded-full blur-xl"></div>
              
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#C9A86A]" />
                <h4 className="text-sm font-bold text-[#1F1F1F] uppercase tracking-wider">Activer un Code Golden</h4>
              </div>
              <p className="text-xs text-[#666666] leading-relaxed">
                Vous possédez un code de parrainage de luxe ou un bon d'or ? Saisissez-le ici pour approvisionner immédiatement votre compte.
              </p>
 
              <form onSubmit={handlePromoSubmit} className="space-y-3">
                <input 
                  type="text" 
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="EX: GOLDEN2026"
                  className="w-full px-4 py-3 rounded-xl border border-[#C9A86A]/25 bg-white text-xs font-black tracking-widest text-[#1F1F1F] uppercase placeholder-gray-400 focus:outline-none focus:border-[#C9A86A]"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-[#1F1F1F] text-white hover:bg-[#C9A86A] text-xs font-bold py-3 rounded-xl transition-colors cursor-pointer"
                >
                  Activer le privilège d'or
                </button>
              </form>
 
              {promoStatus && (
                <div className={`p-3.5 rounded-xl text-xs flex items-start gap-2 border ${
                  promoStatus.success 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                    : 'bg-amber-50 text-amber-800 border-amber-100'
                }`}>
                  {promoStatus.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <p className="leading-relaxed font-semibold">{promoStatus.message}</p>
                </div>
              )}
            </div>
 
            {/* Quick list of promo codes tip */}
            <div className="glass-card p-5 rounded-2xl bg-[#FFFDF8] border border-[#C9A86A]/10 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#C9A86A] font-extrabold uppercase tracking-wider text-[10px]">
                <Info className="w-4 h-4" /> Codes Démo Actifs
              </div>
              <ul className="space-y-1 text-[#666666] font-medium">
                <li><code className="bg-[#1F1F1F]/5 px-1.5 py-0.5 rounded text-gray-800 font-bold font-mono">GOLDEN2026</code> (+5 000 F CFA)</li>
                <li><code className="bg-[#1F1F1F]/5 px-1.5 py-0.5 rounded text-gray-800 font-bold font-mono">ELITE100</code> (+10 000 F CFA)</li>
                <li><code className="bg-[#1F1F1F]/5 px-1.5 py-0.5 rounded text-gray-800 font-bold font-mono">WEALTHY</code> (+25 000 F CFA)</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
