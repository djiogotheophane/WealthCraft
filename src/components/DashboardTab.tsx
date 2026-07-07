import React, { useState } from 'react';
import { 
  TrendingUp, 
  Wallet, 
  Coins, 
  Gift, 
  Award, 
  Plus, 
  RotateCw, 
  Trophy, 
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';
import { UserProfile, Transaction } from '../types';

interface DashboardTabProps {
  profile: UserProfile;
  transactions: Transaction[];
  onNavigate: (tab: string) => void;
  onOpenDeposit: () => void;
  onWinWheelPrize: (amount: number, label: string) => void;
}

const SECTORS = [
  { label: "500 F", value: 500, type: "cash", color: "#C9A86A", textColor: "#FFFDF8" },
  { label: "1 500 F", value: 1500, type: "cash", color: "#1F1F1F", textColor: "#E6C687" },
  { label: "2 000 F", value: 2000, type: "cash", color: "#FFFDF8", textColor: "#1F1F1F" },
  { label: "700 F", value: 700, type: "cash", color: "#A05A2C", textColor: "#FFFDF8" },
  { label: "15 000 F", value: 15000, type: "cash", color: "#D4AF37", textColor: "#1F1F1F" },
  { label: "Recommencer", value: 0, type: "retry", color: "#F59E0B", textColor: "#FFFDF8" },
  { label: "Perdu", value: 0, type: "lose", color: "#4B5563", textColor: "#FFFDF8" }
];

export default function DashboardTab({ profile, onNavigate, onOpenDeposit, onWinWheelPrize }: DashboardTabProps) {
  const totalWealth = profile.balance + profile.investedBalance;

  // Wheel States
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<{ label: string; amount: number; type: string } | null>(null);
  const [spinHistory, setSpinHistory] = useState<string[]>([]);

  // Simple formatter for Currency
  const formatEUR = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0 }).format(value) + ' F CFA';
  };

  const handleSpinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSpinResult(null);

    // Pick a completely random sector from the 7 possibilities
    const randomIndex = Math.floor(Math.random() * 7);
    const sectorAngle = 360 / 7;
    
    // We want the wheel pointer (at 0 degrees / top) to align with the chosen sector
    // Sector center is at (randomIndex + 0.5) * sectorAngle
    const targetSectorCenter = (randomIndex + 0.5) * sectorAngle;
    const targetOffset = 360 - targetSectorCenter;
    
    const currentAngleInCycle = rotation % 360;
    const additionalRotation = 1800 + (targetOffset - currentAngleInCycle);
    
    // Smooth spin forward (at least 5 full rotations)
    const finalRotation = rotation + (additionalRotation >= 1800 ? additionalRotation : additionalRotation + 360);
    
    setRotation(finalRotation);

    // After 4 seconds of spinning, trigger the callback and show results
    setTimeout(() => {
      setIsSpinning(false);
      const wonSector = SECTORS[randomIndex];
      setSpinResult({
        label: wonSector.label,
        amount: wonSector.value,
        type: wonSector.type
      });

      // Credit user's balance and post transaction ledger in parent state
      onWinWheelPrize(wonSector.value, wonSector.label);

      // Append to local session history
      setSpinHistory(prev => [wonSector.label, ...prev].slice(0, 5));
    }, 4000);
  };

  // SVG parameters for drawing sectors
  const cx = 150;
  const cy = 150;
  const R = 135;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1F1F1F] via-[#2A2A2A] to-[#1F1F1F] text-white p-6 md:p-8 rounded-[24px] shadow-lg border border-[#C9A86A]/20">
        <div className="absolute right-0 top-0 -mt-6 -mr-6 w-32 h-32 bg-[#C9A86A]/10 rounded-full blur-2xl"></div>
        <div className="absolute left-1/3 bottom-0 w-24 h-24 bg-[#E6C687]/5 rounded-full blur-xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#C9A86A]/20 text-[#E6C687] text-xs font-semibold px-3 py-1 rounded-full border border-[#C9A86A]/30 mb-3">
              <Award className="w-3.5 h-3.5" />
              Statut Elite • Membre {profile.tier}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#FFFDF8] font-manrope">
              Bonjour, {profile.name}
            </h2>
            <p className="text-[#666666] text-sm mt-1 text-gray-300">
              Votre patrimoine se valorise au rythme de vos ambitions.
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onOpenDeposit}
              className="bg-gradient-to-r from-[#E6C687] to-[#C9A86A] text-[#1F1F1F] font-semibold text-sm px-5 py-3 rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 glow-btn cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Déposer des fonds
            </button>
            <button 
              onClick={() => onNavigate('gagner')}
              className="bg-[#FFFDF8]/10 text-white hover:bg-[#FFFDF8]/20 font-medium text-sm px-5 py-3 rounded-xl border border-white/10 transition-all cursor-pointer"
            >
              Investir
            </button>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Stat 1: Total Wealth */}
        <div className="glass-card hover:shadow-md transition-all p-6 rounded-[24px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">
            <TrendingUp className="w-16 h-16 text-[#C9A86A]" />
          </div>
          <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider">Patrimoine Total</p>
          <p className="text-2xl md:text-3xl font-extrabold text-[#1F1F1F] font-manrope mt-2">
            {formatEUR(totalWealth)}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-emerald-600 text-xs font-semibold">
            <span className="bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">+8.4% ce mois</span>
          </div>
        </div>

        {/* Stat 2: Active Investments */}
        <div className="glass-card hover:shadow-md transition-all p-6 rounded-[24px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">
            <Coins className="w-16 h-16 text-[#C9A86A]" />
          </div>
          <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider">Fonds Investis</p>
          <p className="text-2xl md:text-3xl font-extrabold text-[#1F1F1F] font-manrope mt-2">
            {formatEUR(profile.investedBalance)}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-[#C9A86A] text-xs font-semibold">
            <span onClick={() => onNavigate('gagner')} className="cursor-pointer hover:underline flex items-center gap-1">
              Gérer le portefeuille <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Stat 3: Available Balance */}
        <div className="glass-card hover:shadow-md transition-all p-6 rounded-[24px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">
            <Wallet className="w-16 h-16 text-[#C9A86A]" />
          </div>
          <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider">Solde Disponible</p>
          <p className="text-2xl md:text-3xl font-extrabold text-[#1F1F1F] font-manrope mt-2">
            {formatEUR(profile.balance)}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-gray-500 text-xs font-semibold">
            <span onClick={() => onNavigate('retrait')} className="cursor-pointer text-[#C9A86A] hover:underline flex items-center gap-1">
              Retirer ou transférer <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Stat 4: Referral & Rewards Earnings */}
        <div className="glass-card hover:shadow-md transition-all p-6 rounded-[24px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">
            <Gift className="w-16 h-16 text-[#C9A86A]" />
          </div>
          <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider">Gains Parrainage</p>
          <p className="text-2xl md:text-3xl font-extrabold text-[#1F1F1F] font-manrope mt-2">
            {formatEUR(profile.totalReferralEarnings)}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-[#C9A86A] text-xs font-semibold">
            <span onClick={() => onNavigate('inviter')} className="cursor-pointer hover:underline flex items-center gap-1">
              Voir vos filleuls <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* Main Wheel of Fortune Section (Replacing Portfolio Chart and Recent Transactions) */}
      <div className="glass-card p-6 md:p-8 rounded-[24px] border border-[#C9A86A]/20 relative overflow-hidden">
        {/* Subtle decorative background lights */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A86A]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#E6C687]/5 rounded-full blur-3xl"></div>

        <div className="max-w-3xl mx-auto flex flex-col items-center text-center space-y-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#C9A86A] bg-[#C9A86A]/10 px-3 py-1 rounded-full border border-[#C9A86A]/20 mb-3 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              Lancement Exclusif WealthCraft
            </div>
            <h3 className="text-2xl font-black text-[#1F1F1F] font-manrope tracking-tight">Roue de la Fortune d'Élite</h3>
            <p className="text-xs text-[#666666] mt-1 max-w-md mx-auto">
              Tentez votre chance sur notre roue premium pour remporter des primes exceptionnelles ajoutées directement à votre capital d'investissement.
            </p>
          </div>

          {/* Interactive Wheel Graphic Container */}
          <div className="relative w-[320px] h-[320px] flex items-center justify-center select-none my-4">
            {/* Outer Glowing Golden Rim with decorative dots */}
            <div className="absolute inset-0 rounded-full border-4 border-[#C9A86A] shadow-xl bg-gradient-to-b from-[#FFFDF8] to-[#F3EDE0] flex items-center justify-center">
              <div className="absolute inset-2 rounded-full border border-[#C9A86A]/40"></div>
              
              {/* Outer rim decorative marker dots */}
              {[...Array(14)].map((_, idx) => {
                const angle = (idx * 360) / 14;
                const r = 146;
                const x = 150 + r * Math.cos((angle * Math.PI) / 180);
                const y = 150 + r * Math.sin((angle * Math.PI) / 180);
                return (
                  <div 
                    key={idx} 
                    style={{ left: `${x}px`, top: `${y}px` }}
                    className={`absolute w-1.5 h-1.5 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-inner ${
                      isSpinning && idx % 2 === Math.floor(Date.now() / 200) % 2 
                        ? 'bg-[#E6C687] scale-125' 
                        : 'bg-amber-400'
                    }`}
                  ></div>
                );
              })}
            </div>

            {/* Pointer / Arrow Indicator at the very top */}
            <div className="absolute -top-1.5 z-30 filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.15)] pointer-events-none">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" className="transform rotate-180">
                <path d="M15 25L5 8H25L15 25Z" fill="#C9A86A" stroke="#1F1F1F" strokeWidth="2" strokeLinejoin="miter" />
              </svg>
            </div>

            {/* Rotating SVG Wheel Canvas */}
            <div 
              style={{ 
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'transform 4.2s cubic-bezier(0.15, 0.85, 0.15, 1)' : 'none'
              }}
              className="w-[280px] h-[280px] rounded-full overflow-hidden shadow-2xl relative z-10"
            >
              <svg width="280" height="280" viewBox="0 0 300 300" className="w-full h-full">
                <g>
                  {SECTORS.map((sector, i) => {
                    const sectorAngle = 360 / 7;
                    const startAngle = i * sectorAngle;
                    const endAngle = (i + 1) * sectorAngle;
                    
                    const radStart = ((startAngle - 90) * Math.PI) / 180;
                    const radEnd = ((endAngle - 90) * Math.PI) / 180;
                    
                    const x1 = cx + R * Math.cos(radStart);
                    const y1 = cy + R * Math.sin(radStart);
                    const x2 = cx + R * Math.cos(radEnd);
                    const y2 = cy + R * Math.sin(radEnd);
                    
                    // Arc path
                    const pathStr = `M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2} Z`;
                    
                    // Position for text label along the sector's bisector
                    const midAngle = startAngle + sectorAngle / 2;
                    const radMid = ((midAngle - 90) * Math.PI) / 180;
                    const rText = R * 0.58;
                    const xt = cx + rText * Math.cos(radMid);
                    const yt = cy + rText * Math.sin(radMid);
                    
                    return (
                      <g key={i}>
                        {/* Sector Shape */}
                        <path 
                          d={pathStr} 
                          fill={sector.color} 
                          stroke="#C9A86A" 
                          strokeWidth="1.5"
                        />
                        {/* Sector Text Label */}
                        <text 
                          x={xt} 
                          y={yt} 
                          fill={sector.textColor} 
                          fontSize="11" 
                          fontWeight="900" 
                          textAnchor="middle" 
                          dominantBaseline="middle"
                          transform={`rotate(${midAngle}, ${xt}, ${yt})`}
                          className="font-manrope select-none tracking-tight"
                        >
                          {sector.label}
                        </text>
                      </g>
                    );
                  })}
                </g>
                
                {/* Outer concentric divider line */}
                <circle cx={cx} cy={cy} r={R} fill="none" stroke="#C9A86A" strokeWidth="2" />
              </svg>
            </div>

            {/* Inner Golden Center Hub */}
            <div className="absolute z-20 w-11 h-11 rounded-full bg-[#1F1F1F] border-2 border-[#C9A86A] flex items-center justify-center shadow-lg pointer-events-none">
              <span className="text-[10px] font-black text-[#E6C687] tracking-wider font-manrope">WC</span>
              <div className="absolute inset-0 rounded-full border border-white/10 animate-ping opacity-25"></div>
            </div>
          </div>

          {/* Action Trigger Block */}
          <div className="w-full max-w-sm space-y-4 pt-2">
            <button 
              onClick={handleSpinWheel}
              disabled={isSpinning}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                isSpinning 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-[#E6C687] via-[#C9A86A] to-[#E6C687] hover:brightness-105 hover:shadow-xl text-[#1F1F1F] glow-btn'
              }`}
            >
              <RotateCw className={`w-4.5 h-4.5 ${isSpinning ? 'animate-spin' : ''}`} />
              {isSpinning ? "Spécification de l'or..." : "Tourner la roue"}
            </button>

            {/* Dynamic Spin Result Notice */}
            {spinResult && (
              <div className="p-4 rounded-xl border animate-fade-in bg-[#FFFDF8]">
                {spinResult.type === 'cash' && (
                  <div className="flex flex-col items-center space-y-1">
                    <Trophy className="w-7 h-7 text-[#C9A86A] animate-bounce" />
                    <p className="text-xs text-[#666666] font-semibold">Félicitations !</p>
                    <p className="text-sm font-black text-emerald-600 font-manrope">
                      Vous avez gagné {spinResult.label} !
                    </p>
                    <p className="text-[10px] text-gray-500">
                      Un montant équivalent de {formatEUR(spinResult.amount)} a été ajouté à votre solde disponible.
                    </p>
                  </div>
                )}
                {spinResult.type === 'retry' && (
                  <div className="flex flex-col items-center space-y-1 text-amber-600">
                    <RotateCw className="w-6 h-6 animate-spin" />
                    <p className="text-xs font-semibold">Relance gratuite !</p>
                    <p className="text-sm font-black font-manrope">Vous obtenez un tour supplémentaire.</p>
                  </div>
                )}
                {spinResult.type === 'lose' && (
                  <div className="flex flex-col items-center space-y-1 text-gray-500">
                    <Info className="w-6 h-6 text-gray-400" />
                    <p className="text-xs font-semibold">Pas de chance cette fois</p>
                    <p className="text-sm font-bold font-manrope">Perdu ! Retentez votre chance !</p>
                  </div>
                )}
              </div>
            )}

            {/* Quick Session History */}
            {spinHistory.length > 0 && (
              <div className="text-center pt-2">
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#666666]">Derniers résultats</p>
                <div className="flex justify-center gap-1.5 mt-2 overflow-x-auto py-1">
                  {spinHistory.map((hist, index) => (
                    <span 
                      key={index} 
                      className={`text-[9px] px-2 py-0.5 rounded font-black border uppercase tracking-wider shrink-0 ${
                        hist.includes('Perdu') 
                          ? 'bg-gray-100 border-gray-200 text-gray-500' 
                          : hist.includes('Recommencer') 
                            ? 'bg-amber-50 border-amber-200 text-amber-700' 
                            : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                      }`}
                    >
                      {hist}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
