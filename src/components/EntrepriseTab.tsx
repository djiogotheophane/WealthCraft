import React from 'react';
import { 
  Building, 
  Target, 
  History, 
  Sparkles, 
  Award, 
  ShieldCheck, 
  Compass, 
  Briefcase, 
  Users,
  TrendingUp,
  MapPin,
  Clock,
  ArrowUpRight
} from 'lucide-react';

export default function EntrepriseTab() {
  return (
    <div className="space-y-10 animate-fade-in">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#E2C27A] bg-[#E2C27A]/10 px-3 py-1 rounded-full border border-[#E2C27A]/20 mb-3">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          La Maison WealthCraft
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-[#F5F3EE] font-manrope tracking-tight">Notre Profil & Notre Histoire</h2>
        <p className="text-xs text-[#B8B2A8] mt-1 max-w-xl">
          La vision d'excellence de la première plateforme de co-investissement décentralisée d'élite.
        </p>
      </div>

      {/* Grid: Corporate Mission & Visual Emblem */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Company Identity and Core Objectives */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card p-6 md:p-8 rounded-[24px] border border-[#E2C27A]/15 bg-[#242321] relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-[#E2C27A]/5 rounded-full blur-3xl"></div>
            
            <div className="flex items-center gap-3 border-b border-[#E2C27A]/10 pb-4 mb-5">
              <div className="p-2 bg-[#E2C27A]/10 rounded-xl">
                <Target className="w-5 h-5 text-[#E2C27A]" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#F5F3EE] font-manrope">Notre Objectif & Mission</h3>
                <p className="text-[10px] text-[#B8B2A8]">Savoir investir. Croître intelligemment. Prospérer durablement.</p>
              </div>
            </div>

            <p className="text-xs text-[#F5F3EE] leading-relaxed mb-4">
              L'objectif fondamental de <strong className="text-[#E2C27A]">WealthCraft</strong> est de démocratiser l'accès aux classes d'actifs les plus exclusives du globe, traditionnellement réservées aux institutions financières et aux fortunes ultra-privées.
            </p>

            <p className="text-xs text-[#B8B2A8] leading-relaxed mb-5">
              À travers notre écosystème de co-investissement fractionné, nous permettons à chaque membre d'acquérir des parts de prestige (immobilier haut de gamme, yachts de luxe, vignobles de collection) à partir de montants flexibles. Nous marions le savoir-faire de la finance privée suisse à la transparence des registres numériques.
            </p>

            {/* Core Values Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-[#1A1917]/50 rounded-xl border border-[#E2C27A]/5 flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-[#19B37A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#F5F3EE]">Sécurité de Rang Bancaire</h4>
                  <p className="text-[10px] text-[#B8B2A8] mt-0.5">Fonds garantis et audités par nos banques dépositaires partenaires de premier ordre.</p>
                </div>
              </div>

              <div className="p-3 bg-[#1A1917]/50 rounded-xl border border-[#E2C27A]/5 flex items-start gap-3">
                <TrendingUp className="w-4 h-4 text-[#E2C27A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#F5F3EE]">Rendement Optimisé</h4>
                  <p className="text-[10px] text-[#B8B2A8] mt-0.5">Sélection rigoureuse des actifs avec un rendement ciblé allant jusqu'à 14.2% p.a.</p>
                </div>
              </div>

              <div className="p-3 bg-[#1A1917]/50 rounded-xl border border-[#E2C27A]/5 flex items-start gap-3">
                <Compass className="w-4 h-4 text-[#E2C27A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#F5F3EE]">Transparence Absolue</h4>
                  <p className="text-[10px] text-[#B8B2A8] mt-0.5">Suivi de performance en temps réel et documentation légale numérisée.</p>
                </div>
              </div>

              <div className="p-3 bg-[#1A1917]/50 rounded-xl border border-[#E2C27A]/5 flex items-start gap-3">
                <Users className="w-4 h-4 text-[#19B37A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#F5F3EE]">Cercle d'Élite Participatif</h4>
                  <p className="text-[10px] text-[#B8B2A8] mt-0.5">Une communauté mondiale d'investisseurs partageant la même quête de prospérité.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Corporate Identity Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 md:p-8 rounded-[24px] border border-[#E2C27A]/15 bg-[#242321] flex flex-col justify-between h-full relative overflow-hidden">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#E2C27A]/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="relative p-1 bg-gradient-to-br from-[#E2C27A] to-[#C8A25D] rounded-[24px]">
                  <img 
                    src="/src/assets/images/wealthcraft_logo_1783528544573.jpg" 
                    alt="WealthCraft Corporate Logo" 
                    className="w-24 h-24 rounded-[22px] object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <div className="text-center space-y-1">
                <h4 className="text-lg font-extrabold text-[#F5F3EE] font-manrope">WealthCraft Technologies</h4>
                <p className="text-xs text-[#E2C27A] font-bold uppercase tracking-widest">Prestige & Innovation</p>
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#B8B2A8] pt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#E2C27A]" />
                  <span>Rue du Rhône 42, 1204 Genève, Suisse</span>
                </div>
              </div>

              <div className="border-t border-[#E2C27A]/10 pt-4 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#B8B2A8]">Date de Création :</span>
                  <span className="font-bold text-[#F5F3EE]">Octobre 2021</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#B8B2A8]">Agréments & Régulation :</span>
                  <span className="font-bold text-[#E2C27A]">FINMA (Suisse) & BCEAO</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#B8B2A8]">Actifs Sous Gestion :</span>
                  <span className="font-bold text-[#19B37A]">12.8 Milliards F CFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#B8B2A8]">Membres d'Élite :</span>
                  <span className="font-bold text-[#F5F3EE]">15 420 Investisseurs</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E2C27A]/10 text-center text-[10px] text-[#B8B2A8] italic">
              "L'art de sculpter la fortune et de préserver le prestige."
            </div>
          </div>
        </div>

      </div>

      {/* Timeline: Our Story */}
      <div className="glass-card p-6 md:p-8 rounded-[24px] border border-[#E2C27A]/15 bg-[#242321] relative">
        <div className="flex items-center gap-3 border-b border-[#E2C27A]/10 pb-4 mb-8">
          <div className="p-2 bg-[#E2C27A]/10 rounded-xl">
            <History className="w-5 h-5 text-[#E2C27A]" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#F5F3EE] font-manrope">Notre Trajectoire & Histoire</h3>
            <p className="text-[10px] text-[#B8B2A8]">Une évolution d'excellence, année par année.</p>
          </div>
        </div>

        {/* Timeline Line */}
        <div className="relative pl-6 md:pl-10 border-l border-[#E2C27A]/20 space-y-8 ml-2">
          
          {/* Year 2026 */}
          <div className="relative">
            <span className="absolute -left-[31px] md:-left-[47px] top-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-[#E2C27A] text-[#1A1917] text-[10px] font-black border-4 border-[#242321]">
              <Sparkles className="w-2.5 h-2.5" />
            </span>
            <div className="space-y-1">
              <span className="inline-block bg-[#E2C27A]/10 text-[#E2C27A] text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">Aujourd'hui</span>
              <h4 className="text-xs font-extrabold text-[#F5F3EE] font-manrope">Expansion Globale & Intégration F CFA</h4>
              <p className="text-[11px] text-[#B8B2A8] leading-relaxed">
                Afin de répondre à la demande croissante d'une clientèle d'investisseurs ouest-africains ambitieux, WealthCraft lance son infrastructure d'investissement de prestige libellée en F CFA. Des milliers de nouveaux membres rejoignent l'élite pour co-investir dans des actifs exclusifs internationaux.
              </p>
            </div>
          </div>

          {/* Year 2024 */}
          <div className="relative">
            <span className="absolute -left-[31px] md:-left-[47px] top-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-[#C8A25D] text-[#1A1917] text-[10px] font-black border-4 border-[#242321]">
              ✓
            </span>
            <div className="space-y-1">
              <span className="text-xs font-black text-[#E2C27A] font-manrope">2024</span>
              <h4 className="text-xs font-extrabold text-[#F5F3EE] font-manrope">Actifs Sous Gestion Records</h4>
              <p className="text-[11px] text-[#B8B2A8] leading-relaxed">
                La plateforme dépasse le jalon de 10 milliards de F CFA équivalents sous gestion active. Le portefeuille s'élargit aux vignobles de grand cru en Bourgogne et aux projets d'hôtellerie boutique haut de gamme à Courchevel.
              </p>
            </div>
          </div>

          {/* Year 2023 */}
          <div className="relative">
            <span className="absolute -left-[31px] md:-left-[47px] top-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-[#C8A25D] text-[#1A1917] text-[10px] font-black border-4 border-[#242321]">
              ✓
            </span>
            <div className="space-y-1">
              <span className="text-xs font-black text-[#E2C27A] font-manrope">2023</span>
              <h4 className="text-xs font-extrabold text-[#F5F3EE] font-manrope">Blockchain & Contrats Intelligents</h4>
              <p className="text-[11px] text-[#B8B2A8] leading-relaxed">
                Mise en place de registres de copropriété hautement sécurisés par contrats intelligents. Chaque investisseur dispose d'un certificat d'achat numérique unique et infalsifiable, marquant un tournant historique pour la transparence des placements d'actifs alternatifs.
              </p>
            </div>
          </div>

          {/* Year 2022 */}
          <div className="relative">
            <span className="absolute -left-[31px] md:-left-[47px] top-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-[#C8A25D] text-[#1A1917] text-[10px] font-black border-4 border-[#242321]">
              ✓
            </span>
            <div className="space-y-1">
              <span className="text-xs font-black text-[#E2C27A] font-manrope">2022</span>
              <h4 className="text-xs font-extrabold text-[#F5F3EE] font-manrope">Premier Projet d'Élite : Monaco Azure</h4>
              <p className="text-[11px] text-[#B8B2A8] leading-relaxed">
                WealthCraft clôture avec succès son tout premier tour de table pour la co-acquisition d'une villa de prestige surplombant la baie de Monaco. Le projet réunit 120 investisseurs privés pionniers et distribue ses premiers rendements trimestriels à hauteur de 12.4% net l'an.
              </p>
            </div>
          </div>

          {/* Year 2021 */}
          <div className="relative">
            <span className="absolute -left-[31px] md:-left-[47px] top-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-[#C8A25D] text-[#1A1917] text-[10px] font-black border-4 border-[#242321]">
              ✓
            </span>
            <div className="space-y-1">
              <span className="text-xs font-black text-[#E2C27A] font-manrope">2021</span>
              <h4 className="text-xs font-extrabold text-[#F5F3EE] font-manrope">Fondation à Genève</h4>
              <p className="text-[11px] text-[#B8B2A8] leading-relaxed">
                La maison WealthCraft est fondée par un collectif de gestionnaires de patrimoine chevronnés, de banquiers privés suisses et d'ingénieurs en cryptographie. Leur ambition : briser les codes exclusifs de l'investissement de prestige et ouvrir le club à la nouvelle génération d'élites numériques.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
