import React, { useState } from 'react';
import { 
  Users, 
  Copy, 
  Check, 
  Gift, 
  Share2, 
  Send, 
  Sparkles, 
  TrendingUp, 
  AlertCircle 
} from 'lucide-react';
import { ReferredUser, UserProfile } from '../types';

interface ReferralTabProps {
  referrals: ReferredUser[];
  profile: UserProfile;
  onInviteFriend: (name: string, email: string) => void;
  onSimulateFirstInvestment: (refId: string) => void;
}

export default function ReferralTab({ referrals, profile, onInviteFriend, onSimulateFirstInvestment }: ReferralTabProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [friendName, setFriendName] = useState('');
  const [friendEmail, setFriendEmail] = useState('');
  const [inviteStatus, setInviteStatus] = useState<string | null>(null);

  const referralLink = `${window.location.origin}/join?ref=${profile.referralCode}`;

  const copyToClipboard = (text: string, isCode: boolean) => {
    navigator.clipboard.writeText(text);
    if (isCode) {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendName.trim() || !friendEmail.trim()) {
      setInviteStatus("Erreur: Veuillez remplir tous les champs.");
      return;
    }

    onInviteFriend(friendName.trim(), friendEmail.trim());
    setInviteStatus(`Félicitations ! ${friendName} a été ajouté(e) à votre liste de parrainage.`);
    setFriendName('');
    setFriendEmail('');
    setTimeout(() => {
      setInviteStatus(null);
    }, 4000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Referral Banner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Banner (2 cols) */}
        <div className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-[#F5F3EE] to-[#2B2B2B] text-white p-6 md:p-8 rounded-[24px] shadow-md border border-[#E2C27A]/20 flex flex-col justify-between">
          
          <div className="space-y-3 z-10">
            <div className="inline-flex items-center gap-1.5 bg-[#E2C27A]/20 text-[#C8A25D] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-[#E2C27A]/30">
              <Sparkles className="w-3.5 h-3.5" />
              Offre Premium Parrainage
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#242321] font-manrope">
              Invitez des amis. <br />Gagnez de l'or ensemble.
            </h2>
            <p className="text-gray-300 text-xs max-w-lg leading-relaxed">
              Pour chaque ami qui s'inscrit et réalise son premier placement sur WealthCraft, vous gagnez tous les deux <strong className="text-[#C8A25D]">2 500 F CFA de bonus</strong> immédiatement disponibles au retrait.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 z-10">
            {/* Copy code input */}
            <div className="bg-[#242321]/5 border border-white/15 p-3 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-[9px] uppercase text-gray-400 font-semibold">Votre code de parrainage</p>
                <p className="text-sm font-bold text-[#C8A25D] mt-0.5 tracking-wider font-mono">{profile.referralCode}</p>
              </div>
              <button 
                onClick={() => copyToClipboard(profile.referralCode, true)}
                className="p-2.5 bg-white/10 hover:bg-[#E2C27A] hover:text-black transition-all rounded-lg text-white cursor-pointer"
              >
                {copiedCode ? <Check className="w-4 h-4 text-[#19B37A]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Copy link input */}
            <div className="bg-[#242321]/5 border border-white/15 p-3 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-[9px] uppercase text-gray-400 font-semibold">Lien personnalisé</p>
                <p className="text-[11px] font-bold text-gray-300 mt-0.5 truncate max-w-[130px]">{referralLink}</p>
              </div>
              <button 
                onClick={() => copyToClipboard(referralLink, false)}
                className="p-2.5 bg-white/10 hover:bg-[#E2C27A] hover:text-black transition-all rounded-lg text-white cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-[#19B37A]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Stats card (1 col) */}
        <div className="glass-card p-6 rounded-[24px] flex flex-col justify-between border border-[#E2C27A]/20">
          <div>
            <h3 className="text-sm font-bold text-[#F5F3EE] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Users className="w-4.5 h-4.5 text-[#E2C27A]" /> Vos Statistiques
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-[#E2C27A]/10">
                <span className="text-xs text-[#B8B2A8]">Filleuls inscrits</span>
                <span className="text-sm font-bold text-[#F5F3EE]">{referrals.length}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[#E2C27A]/10">
                <span className="text-xs text-[#B8B2A8]">Filleuls actifs</span>
                <span className="text-sm font-bold text-[#E2C27A]">
                  {referrals.filter(r => r.status.includes('Actif')).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#B8B2A8]">Gains totaux</span>
                <span className="text-base font-extrabold text-[#19B37A]">
                  {profile.totalReferralEarnings.toLocaleString('fr-FR')} F CFA
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#242321] p-3 rounded-xl border border-[#E2C27A]/15 mt-4 text-[11px] text-[#B8B2A8] leading-relaxed">
            <TrendingUp className="w-4 h-4 text-[#E2C27A] inline mr-1" />
            Votre taux de conversion de parrainage est excellent. Invitez plus d'amis pour débloquer le tier <strong className="text-[#E2C27A]">Diamond</strong>.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Referrals tracking table (2 cols) */}
        <div className="lg:col-span-2 glass-card p-6 rounded-[24px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[#F5F3EE] font-manrope">Suivi de vos Filleuls</h3>
            <span className="text-xs font-semibold text-[#E2C27A] bg-[#E2C27A]/10 px-2.5 py-1 rounded-full border border-[#E2C27A]/15">
              Éligibilité instantanée
            </span>
          </div>

          {referrals.length === 0 ? (
            <div className="text-center py-12 text-[#B8B2A8] text-xs">
              Aucun filleul pour le moment. Utilisez les outils d'invitation ci-contre.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E2C27A]/10 text-[10px] uppercase text-[#B8B2A8] font-semibold">
                    <th className="py-3 px-2">Membre</th>
                    <th className="py-3 px-2">Date d'inscription</th>
                    <th className="py-3 px-2">Statut de bonus</th>
                    <th className="py-3 px-2 text-right">Vos Gains</th>
                    <th className="py-3 px-2 text-center">Investissement du Filleul</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2C27A]/5">
                  {referrals.map((ref) => {
                    const isActive = ref.status.includes('Actif');
                    return (
                      <tr key={ref.id} className="text-xs hover:bg-[#242321]/80 transition-all">
                        <td className="py-3 px-2">
                          <p className="font-bold text-[#F5F3EE]">{ref.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{ref.email}</p>
                        </td>
                        <td className="py-3 px-2 text-[#B8B2A8] font-medium">{ref.dateJoined}</td>
                        <td className="py-3 px-2">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            isActive 
                              ? 'bg-[#19B37A]/10 text-[#19B37A] border border-[#19B37A]/20' 
                              : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-600' : 'bg-amber-500'}`}></span>
                            {ref.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right font-extrabold text-[#F5F3EE]">
                          {ref.rewardEarned > 0 ? `+${ref.rewardEarned.toLocaleString('fr-FR')} F` : '0 F'}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {!isActive ? (
                            <button
                              onClick={() => onSimulateFirstInvestment(ref.id)}
                              className="bg-[#1A1917] hover:bg-[#E2C27A] text-white hover:text-white text-[10px] font-bold py-1 px-3 rounded-lg transition-colors cursor-pointer"
                              title="Faire réaliser le premier investissement au filleul, vous accordant le bonus"
                            >
                              Activer 1er Investissement
                            </button>
                          ) : (
                            <span className="text-[10px] text-gray-400 italic">Bonus obtenu</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Side: Invite simulation form (1 col) */}
        <div className="glass-card p-6 rounded-[24px] border border-[#E2C27A]/20 space-y-6">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-[#E2C27A]" />
            <h4 className="text-sm font-bold text-[#F5F3EE] uppercase tracking-wider font-manrope">Inviter un Ami</h4>
          </div>
          <p className="text-xs text-[#B8B2A8] leading-relaxed">
            Saisissez le nom et l'adresse e-mail de votre ami(e). Un e-mail d'invitation de luxe contenant votre code de parrainage unique lui sera simulé immédiatement.
          </p>

          <form onSubmit={handleInviteSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-[#B8B2A8]">Nom Complet</label>
              <input 
                type="text" 
                placeholder="Ex: Sophie Martin" 
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E2C27A]/20 bg-white text-xs font-semibold text-[#F5F3EE] focus:outline-none focus:border-[#E2C27A]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-[#B8B2A8]">Adresse E-mail</label>
              <input 
                type="email" 
                placeholder="Ex: sophie.martin@example.com" 
                value={friendEmail}
                onChange={(e) => setFriendEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E2C27A]/20 bg-white text-xs font-semibold text-[#F5F3EE] focus:outline-none focus:border-[#E2C27A]"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-[#C8A25D] to-[#E2C27A] text-[#F5F3EE] font-bold text-xs py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 glow-btn cursor-pointer animate-pulse-subtle"
            >
              Envoyer l'invitation d'or
            </button>
          </form>

          {inviteStatus && (
            <div className={`p-3.5 rounded-xl text-xs flex gap-2 border ${
              inviteStatus.startsWith('Erreur') 
                ? 'bg-amber-50 text-amber-800 border-amber-100' 
                : 'bg-[#19B37A]/10 text-[#19B37A] border-[#19B37A]/20'
            }`}>
              {inviteStatus.startsWith('Erreur') ? (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <Check className="w-4 h-4 text-[#19B37A] shrink-0 mt-0.5" />
              )}
              <p className="leading-relaxed">{inviteStatus}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
