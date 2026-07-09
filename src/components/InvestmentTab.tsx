import React, { useState } from 'react';
import { 
  Calculator, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  ArrowRight,
  Sparkles,
  Award,
  Zap
} from 'lucide-react';
import { InvestmentAsset, UserProfile } from '../types';

interface InvestmentTabProps {
  assets: InvestmentAsset[];
  profile: UserProfile;
  onInvest: (assetId: string, amount: number) => Promise<{ success: boolean; error?: string }> | any;
  onOpenDeposit: () => void;
}

export default function InvestmentTab({ 
  assets, 
  profile, 
  onInvest, 
  onOpenDeposit
}: InvestmentTabProps) {
  // Invest Mode State
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'standard' | 'premium'>('all');
  const [selectedAsset, setSelectedAsset] = useState<InvestmentAsset | null>(null);
  
  // Simulator State
  const [packQuantity, setPackQuantity] = useState<number>(1);
  const [investInputAmount, setInvestInputAmount] = useState<string>('');
  const [investStatus, setInvestStatus] = useState<{ success: boolean; message: string } | null>(null);

  const filteredAssets = selectedCategory === 'all' 
    ? assets 
    : assets.filter(asset => asset.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'standard': return <Zap className="w-5 h-5 text-[#E2C27A]" />;
      case 'premium': return <Award className="w-5 h-5 text-[#E2C27A]" />;
      default: return <Sparkles className="w-5 h-5 text-[#E2C27A]" />;
    }
  };

  const handleSimulate = (asset: InvestmentAsset) => {
    setSelectedAsset(asset);
    setPackQuantity(1);
    setInvestInputAmount(asset.minInvestment.toString());
    setInvestStatus(null);
  };

  const handleInvestSubmit = async (e: React.FormEvent) => {
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

    const result = await onInvest(selectedAsset.id, amount);
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

  const categoriesList = [
    { id: 'all', label: 'Tous les Plans' },
    { id: 'standard', label: 'Plans Standards' },
    { id: 'premium', label: 'Option Premium' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Section Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-[#E2C27A]/10 pb-5 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#F5F3EE] font-georgia tracking-tight">Espace Gagner</h2>
          <p className="text-xs text-[#B8B2A8] mt-1 font-georgia font-bold italic">Générez de hauts rendements via nos investissements d'élite.</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Categories Pill Navigation */}
        <div className="flex flex-wrap gap-2 pt-1">
          {categoriesList.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all border ${
                selectedCategory === cat.id 
                  ? 'bg-[#2E220C] text-white border-[#F5F3EE]' 
                  : 'bg-[#3D2E14] text-[#B8B2A8] border-[#E2C27A]/20 hover:border-[#E2C27A]/50'
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
                    className="glass-card hover:translate-y-[-4px] transition-all duration-300 rounded-[24px] flex flex-col justify-between border border-[#E2C27A]/10 shadow-sm relative overflow-hidden group"
                  >
                    {asset.imageUrl && (
                      <div className="w-full h-36 overflow-hidden relative">
                        <img 
                          src={asset.imageUrl} 
                          alt={asset.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#2E220C] via-transparent to-transparent opacity-85" />
                        <div className="absolute top-3 left-3 p-2 bg-[#2E220C]/80 backdrop-blur-md rounded-xl border border-[#E2C27A]/20">
                          {getCategoryIcon(asset.category)}
                        </div>
                      </div>
                    )}

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        {!asset.imageUrl && (
                          <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-[#E2C27A]/10 rounded-2xl">
                              {getCategoryIcon(asset.category)}
                            </div>
                          </div>
                        )}

                        <h3 className="font-bold text-base text-[#F5F3EE] group-hover:text-[#E2C27A] transition-colors font-georgia">
                          {asset.name}
                        </h3>
                        <p className="text-xs text-[#B8B2A8] mt-2 line-clamp-2">
                          {asset.description}
                        </p>

                        <div className="grid grid-cols-3 gap-2 my-4 bg-[#3D2E14] p-3 rounded-xl border border-[#E2C27A]/10">
                          <div>
                            <p className="text-[9px] text-[#B8B2A8] uppercase tracking-wider font-semibold">Gain / Jour</p>
                            <p className="text-xs font-extrabold text-[#E2C27A]">{asset.dailyReturn?.toLocaleString('fr-FR')} F</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-[#B8B2A8] uppercase tracking-wider font-semibold">Durée</p>
                            <p className="text-xs font-extrabold text-[#F5F3EE]">{asset.durationDays} Jours</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-[#B8B2A8] uppercase tracking-wider font-semibold">Prix</p>
                            <p className="text-xs font-extrabold text-[#F5F3EE]">{asset.minInvestment.toLocaleString('fr-FR')} F</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        {userActiveInvest > 0 && (
                          <div className="mb-4 flex items-center gap-2 bg-[#E2C27A]/10 p-2 rounded-xl border border-[#E2C27A]/20">
                            <CheckCircle2 className="w-4 h-4 text-[#E2C27A]" />
                            <div className="text-[11px]">
                              <span className="text-[#B8B2A8]">Votre placement :</span> <strong className="text-[#F5F3EE]">{userActiveInvest.toLocaleString('fr-FR')} F CFA</strong>
                            </div>
                          </div>
                        )}

                        <button
                          onClick={() => handleSimulate(asset)}
                          className="w-full bg-[#E2C27A] text-[#2E220C] hover:bg-[#C8A25D] font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-all glow-btn cursor-pointer"
                        >
                          Investir maintenant
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Simulation Sidebar */}
          <div>
            {selectedAsset ? (
              <div className="glass-card p-6 rounded-[24px] border border-[#E2C27A]/30 space-y-6 sticky top-4 animate-fade-in">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-[#E2C27A] uppercase tracking-wider font-georgia">Configuration de Placement</span>
                    <h3 className="text-lg font-bold text-[#F5F3EE] font-georgia">{selectedAsset.name}</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedAsset(null)}
                    className="text-xs font-semibold text-gray-400 hover:text-black hover:bg-gray-100 p-1 px-2 rounded-lg cursor-pointer"
                  >
                    Fermer
                  </button>
                </div>

                {selectedAsset.imageUrl && (
                  <div className="w-full h-32 overflow-hidden rounded-2xl relative">
                    <img 
                      src={selectedAsset.imageUrl} 
                      alt={selectedAsset.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2E220C]/60 to-transparent" />
                  </div>
                )}

                <div className="p-4 rounded-xl bg-[#2E220C] border border-[#E2C27A]/15 space-y-2 text-xs">
                  <p className="text-[#B8B2A8] leading-relaxed italic">{selectedAsset.longDescription}</p>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E2C27A]/10 font-semibold">
                    <div>Gain par jour : <span className="text-[#E2C27A] font-extrabold">{selectedAsset.dailyReturn?.toLocaleString('fr-FR')} F CFA</span></div>
                    <div>Durée totale : <span className="text-[#F5F3EE] font-bold">{selectedAsset.durationDays} Jours</span></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-[#B8B2A8]">Nombre de packs</span>
                      <span className="text-[#F5F3EE] font-bold">{packQuantity} pack{packQuantity > 1 ? 's' : ''}</span>
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
                      className="w-full accent-[#E2C27A] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
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
                      <div className="p-4 rounded-xl bg-[#2E220C] text-white space-y-2.5 relative overflow-hidden">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-400">Rendements du Placement</span>
                          <span className="text-[10px] font-bold text-[#C8A25D] flex items-center gap-1">
                            <Calculator className="w-3.5 h-3.5" /> Estimation
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div>
                            <p className="text-[9px] text-gray-400 uppercase tracking-wider">Investissement</p>
                            <p className="text-sm font-bold text-white">{cost.toLocaleString('fr-FR')} F CFA</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-gray-400 uppercase tracking-wider">Gain Journalier</p>
                            <p className="text-sm font-extrabold text-[#C8A25D]">{daily.toLocaleString('fr-FR')} F CFA/j</p>
                          </div>
                        </div>

                        <div className="flex justify-between text-[11px] text-gray-300 pt-2.5 border-t border-white/10">
                          <span>Durée totale :</span>
                          <span className="font-bold text-white">{days} jours</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-gray-300">
                          <span>Retour total (Brut) :</span>
                          <span className="font-extrabold text-[#C8A25D]">{totalReturn.toLocaleString('fr-FR')} F CFA</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-200 pt-1.5 border-t border-dashed border-white/10">
                          <span>Bénéfice Net :</span>
                          <span className="font-black text-[#19B37A]">+{netGains.toLocaleString('fr-FR')} F CFA</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <form onSubmit={handleInvestSubmit} className="space-y-3 pt-2 border-t border-[#E2C27A]/15">
                  <div className="flex justify-between text-xs font-bold text-[#F5F3EE]">
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
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-[#E2C27A]/20 bg-[#2E220C] text-xs font-bold text-[#F5F3EE] focus:outline-none focus:border-[#E2C27A]"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#C8A25D] to-[#E2C27A] text-[#F5F3EE] font-bold text-xs py-3.5 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 glow-btn cursor-pointer"
                  >
                    Confirmer mon investissement
                  </button>
                </form>

                {investStatus && (
                  <div className={`p-3.5 rounded-xl text-xs flex items-start gap-2 border ${
                    investStatus.success 
                      ? 'bg-[#19B37A]/10 text-[#19B37A] border-[#19B37A]/20' 
                      : 'bg-amber-50 text-amber-800 border-amber-100'
                  }`}>
                    {investStatus.success ? (
                      <CheckCircle2 className="w-4 h-4 text-[#19B37A] shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-semibold">{investStatus.success ? "Opération réussie" : "Attention"}</p>
                      <p className="mt-0.5 leading-relaxed">{investStatus.message}</p>
                      {!investStatus.success && investStatus.message.includes('insuffisants') && (
                        <button 
                          onClick={onOpenDeposit}
                          className="text-xs font-bold text-[#E2C27A] hover:underline block mt-2 text-left cursor-pointer"
                        >
                          Approvisionner mon compte maintenant &rarr;
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="glass-card p-6 rounded-[24px] border border-dashed border-[#E2C27A]/30 text-center py-12 space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-[#E2C27A]/10 flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-[#E2C27A]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#F5F3EE] text-sm uppercase tracking-wider">Configuration de Placement</h3>
                  <p className="text-xs text-[#B8B2A8] max-w-xs mx-auto mt-1">
                    Sélectionnez l'un de nos plans de placement ci-contre pour estimer vos profits futurs et configurer votre investissement.
                  </p>
                </div>
                <div className="bg-[#3D2E14] p-3 rounded-xl border border-[#E2C27A]/10 text-left space-y-2 max-w-xs mx-auto">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-[#E2C27A] uppercase tracking-wider">
                    <Info className="w-3.5 h-3.5" /> Astuce de gestion
                  </div>
                  <p className="text-[11px] text-[#B8B2A8] leading-relaxed">
                    Diversifiez votre épargne en répartissant vos investissements sur nos plans Standards et Premium pour maximiser vos gains journaliers sécurisés.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
