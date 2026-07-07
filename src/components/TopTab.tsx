import React from 'react';
import { 
  Trophy, 
  Award, 
  TrendingUp, 
  Building, 
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Zap,
  Target
} from 'lucide-react';
import { UserProfile } from '../types';

interface TopTabProps {
  profile: UserProfile;
}

// Simulated Elite Leaderboard Members
const LEADERBOARD_MEMBERS = [
  { rank: 1, name: "Jean-Marc de Rothschild", city: "Genève, Suisse", totalWealth: 4850000, tier: "Royal Custodian", yieldRate: "12.8% p.a." },
  { rank: 2, name: "Sébastien Lambert", city: "Paris, France", totalWealth: 2150000, tier: "Platine Élite", yieldRate: "11.4% p.a." },
  { rank: 3, name: "Alexandra von Hapsburg", city: "Vienne, Autriche", totalWealth: 1890000, tier: "Platine Élite", yieldRate: "11.9% p.a." },
  { rank: 4, name: "Theophraste K.", city: "Monaco", totalWealth: 920000, tier: "Ambassadeur", yieldRate: "10.5% p.a." },
  { rank: 5, name: "Sophie Beaumont", city: "Bruxelles, Belgique", totalWealth: 740000, tier: "Ambassadeur", yieldRate: "9.8% p.a." },
  { rank: 6, name: "Marc-Antoine Pierre", city: "Lyon, France", totalWealth: 510000, tier: "Premium", yieldRate: "9.6% p.a." }
];

// Top assets performance
const TOP_PROJECTS = [
  { name: "Palais Bulles d'Or", category: "Immobilier de prestige", yield: "14.2% historique", backers: 42, status: "Clôturé" },
  { name: "Yacht Azurean Majesty", category: "Copropriété de luxe", yield: "11.8% historique", backers: 19, status: "Clôturé" },
  { name: "Domaine Romanée-Conti 2018", category: "Vins de collection", yield: "16.5% historique", backers: 84, status: "Clôturé" }
];

export default function TopTab({ profile }: TopTabProps) {
  const userTotalWealth = profile.balance + profile.investedBalance;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#C9A86A] bg-[#C9A86A]/10 px-3 py-1 rounded-full border border-[#C9A86A]/20 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Club Privé WealthCraft
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-[#1F1F1F] font-manrope tracking-tight">Le Cercle d'Or</h2>
        <p className="text-xs text-[#666666] mt-1 max-w-xl">
          Découvrez les classements des plus grands investisseurs de notre plateforme d'élite et les performances historiques de nos meilleurs actifs de co-investissement.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Leaderboard (2 cols on large screen) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 md:p-8 rounded-[24px] border border-[#C9A86A]/15">
            <div className="flex justify-between items-center border-b border-[#C9A86A]/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#C9A86A]" />
                <h3 className="font-extrabold text-base text-[#1F1F1F] font-manrope">Classement des Investisseurs</h3>
              </div>
              <span className="text-[10px] uppercase font-bold text-gray-500">Mis à jour en temps réel</span>
            </div>

            {/* List of members */}
            <div className="space-y-3.5">
              {LEADERBOARD_MEMBERS.map((member) => (
                <div 
                  key={member.rank}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-2xl bg-[#FFFDF8] border border-[#C9A86A]/10 hover:border-[#C9A86A]/30 transition-all gap-3"
                >
                  <div className="flex items-center gap-4">
                    {/* Rank Badge */}
                    <div className={`w-9 h-9 rounded-xl font-black font-manrope text-xs flex items-center justify-center shrink-0 ${
                      member.rank === 1 ? 'bg-amber-400 text-[#1F1F1F]' :
                      member.rank === 2 ? 'bg-slate-300 text-[#1F1F1F]' :
                      member.rank === 3 ? 'bg-amber-700 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      #{member.rank}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-[#1F1F1F]">{member.name}</span>
                        <span className="text-[8px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-[#C9A86A]/10 text-[#C9A86A]">
                          {member.tier}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">{member.city}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
                    <div className="text-left sm:text-right">
                      <p className="text-[9px] uppercase tracking-wider text-gray-400">Patrimoine</p>
                      <p className="text-xs font-black text-[#1F1F1F]">
                        {member.totalWealth.toLocaleString('fr-FR')} F CFA
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] uppercase tracking-wider text-gray-400">Rendement Moyen</p>
                      <p className="text-xs font-extrabold text-emerald-600">{member.yieldRate}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* User's position inside the Leaderboard (Simulated rank #14) */}
              <div 
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 rounded-[20px] bg-gradient-to-r from-[#1F1F1F] to-[#2A2A2A] text-white border-2 border-[#C9A86A]/50 shadow-lg gap-3"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-[#C9A86A] text-[#1F1F1F] font-black font-manrope text-xs flex items-center justify-center shrink-0 animate-pulse">
                    #14
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-[#FFFDF8]">{profile.name} (Vous)</span>
                      <span className="text-[8px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-[#C9A86A] text-[#1F1F1F]">
                        {profile.tier}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">Votre rang au niveau européen</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 border-t border-white/10 pt-2 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <p className="text-[9px] uppercase tracking-wider text-gray-400">Patrimoine WealthCraft</p>
                    <p className="text-xs font-black text-[#C9A86A]">
                      {userTotalWealth.toLocaleString('fr-FR')} F CFA
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-wider text-gray-400">Rendement Prévu</p>
                    <p className="text-xs font-extrabold text-emerald-400">11.2% p.a.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Top Performance projects */}
        <div className="space-y-6">
          {/* Top Projects Card */}
          <div className="glass-card p-6 rounded-[24px] border border-[#C9A86A]/15 space-y-5">
            <div className="flex items-center gap-2 border-b border-[#C9A86A]/10 pb-3">
              <TrendingUp className="w-4.5 h-4.5 text-[#C9A86A]" />
              <h4 className="font-extrabold text-sm text-[#1F1F1F] font-manrope">Actifs d'Exception</h4>
            </div>

            <p className="text-[11px] text-[#666666] leading-relaxed">
              Voici le palmarès de nos transactions de co-investissement fermées ayant généré les plus fortes valeurs ajoutées.
            </p>

            <div className="space-y-3">
              {TOP_PROJECTS.map((proj, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#FFFDF8] border border-[#C9A86A]/5 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-black text-[#1F1F1F]">{proj.name}</p>
                      <p className="text-[9px] text-[#666666] mt-0.5">{proj.category}</p>
                    </div>
                    <span className="text-[8px] uppercase tracking-wider font-bold bg-emerald-50 text-emerald-800 border border-emerald-100 px-1.5 py-0.5 rounded">
                      {proj.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] pt-1 border-t border-[#C9A86A]/5">
                    <span className="text-[#666666]">Co-investisseurs:</span>
                    <span className="font-bold text-gray-800">{proj.backers}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-[#666666]">Rendement :</span>
                    <span className="font-extrabold text-emerald-600">{proj.yield}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Member Privileges Card */}
          <div className="glass-card p-6 rounded-[24px] bg-[#1F1F1F] text-white space-y-4 border border-[#C9A86A]/30">
            <h4 className="text-xs font-black text-[#E6C687] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Garantie Club d'Élite
            </h4>
            <p className="text-[10px] text-gray-300 leading-relaxed">
              Les membres de l'élite WealthCraft bénéficient d'un accès anticipé de 48 heures sur tous les futurs lancements de projets d'actifs réels de luxe.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-[#C9A86A] font-extrabold cursor-pointer hover:underline">
              <span>Lire le règlement général du club</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
