import React, { useState } from "react";
import { Shield, Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import { handleApiResponse } from "../utils/api";

interface AuthScreenProps {
  onAuthSuccess: (token: string, profile: any, refNotification?: string) => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const isLogin = true;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Validation and Error states
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    setError(null);

    // Common Email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Le format de l'adresse e-mail est invalide.");
      return false;
    }

    if (!password) {
      setError("Veuillez saisir votre mot de passe.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    const url = "/api/auth/login";
    const body = { email, password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await handleApiResponse(response);

      // Successful Auth
      onAuthSuccess(data.token, data.profile, data.refNotification);
    } catch (err: any) {
      setError(err.message || "Impossible de se connecter au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2E220C] flex flex-col justify-center items-center px-4 py-12 selection:bg-[#E2C27A] selection:text-white">
      {/* Premium Elegant Card Container */}
      <div className="max-w-md w-full bg-[#3D2E14] rounded-[32px] border border-[#E2C27A]/20 shadow-2xl p-8 md:p-10 relative overflow-hidden animate-scale-up">
        <div className="absolute right-0 top-0 w-32 h-32 bg-[#E2C27A]/5 rounded-full blur-2xl"></div>
        
        {/* Brand Header */}
        <div className="text-center space-y-3 mb-8 relative z-10">
          <div className="flex justify-center">
            <img 
              src="/src/assets/images/wealthcraft_logo_1783528544573.jpg" 
              alt="WealthCraft Logo" 
              className="w-16 h-16 rounded-[20px] border border-[#E2C27A]/30 shadow-lg object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="font-bold text-2xl tracking-tight font-georgia text-[#F5F3EE]">
              Wealth<span className="text-[#E2C27A]">Craft</span>
            </h1>
            <p className="text-[10px] text-[#B8B2A8] tracking-widest font-bold uppercase -mt-0.5 font-georgia">
              Cercle d'Investissement d'Élite
            </p>
          </div>
          <p className="text-xs text-[#B8B2A8] max-w-xs mx-auto pt-1">
            {isLogin 
              ? "Heureux de vous revoir ! Connectez-vous à votre espace d'investissement sécurisé." 
              : "Créez votre compte d'élite en quelques secondes et commencez à récolter de l'or."
            }
          </p>
        </div>

        {/* Dynamic Form Alert Box */}
        {error && (
          <div className="p-4 mb-6 rounded-2xl bg-rose-50 border border-rose-100 text-rose-800 text-xs font-semibold flex items-start gap-2.5 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
            <div>
              <p className="font-extrabold uppercase text-[9px] tracking-wider text-rose-700">Erreur rencontrée</p>
              <p className="mt-0.5 text-rose-950 font-medium">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Address field */}
          <div className="space-y-1">
            <label className="text-[9px] uppercase font-bold tracking-wider text-[#B8B2A8]">Adresse E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E2C27A]/60" />
              <input
                type="email"
                placeholder="Ex: jean.dupont@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E2C27A]/20 bg-[#2E220C] text-xs font-semibold text-[#F5F3EE] focus:outline-none focus:border-[#E2C27A]"
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1">
            <label className="text-[9px] uppercase font-bold tracking-wider text-[#B8B2A8]">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E2C27A]/60" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E2C27A]/20 bg-[#2E220C] text-xs font-semibold text-[#F5F3EE] focus:outline-none focus:border-[#E2C27A]"
                required
              />
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-[#C8A25D] via-[#E2C27A] to-[#C8A25D] text-[#F5F3EE] font-black text-xs uppercase tracking-wider py-4 rounded-xl shadow-lg hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 glow-btn cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="animate-spin w-4.5 h-4.5 border-2 border-[#F5F3EE] border-t-transparent rounded-full"></span>
            ) : (
              <>
                <LogIn className="w-4 h-4" /> Se Connecter
              </>
            )}
          </button>
        </form>

        {/* Security assurance */}
        <div className="flex items-center justify-center gap-1.5 mt-8 pt-6 border-t border-[#E2C27A]/10 text-[10px] text-gray-400">
          <Shield className="w-3.5 h-3.5 text-[#E2C27A]/80" />
          <span>Régulé & Crypté de Bout en Bout</span>
        </div>
      </div>
    </div>
  );
}
