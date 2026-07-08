import React, { useState, useEffect } from "react";
import { Shield, Mail, Lock, User, UserPlus, LogIn, CheckCircle2, AlertCircle } from "lucide-react";

interface AuthScreenProps {
  onAuthSuccess: (token: string, profile: any, refNotification?: string) => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  // Validation and Error states
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Auto-capture referral code from URL query parameter ?ref=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      setReferralCode(ref.trim().toUpperCase());
    }
  }, []);

  const validateForm = (): boolean => {
    setError(null);

    // Common Email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Le format de l'adresse e-mail est invalide.");
      return false;
    }

    if (!isLogin) {
      // Register validation
      if (!fullName.trim()) {
        setError("Veuillez saisir votre nom complet.");
        return false;
      }
      if (password.length < 5) {
        setError("Le mot de passe doit contenir au moins 5 caractères.");
        return false;
      }
      if (password !== confirmPassword) {
        setError("Les mots de passe ne correspondent pas.");
        return false;
      }
      if (!agreeTerms) {
        setError("Vous devez accepter les conditions d'utilisation.");
        return false;
      }
    } else {
      // Login validation
      if (!password) {
        setError("Veuillez saisir votre mot de passe.");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    const url = isLogin ? "/api/auth/login" : "/api/auth/register";
    const body = isLogin 
      ? { email, password }
      : { 
          fullName, 
          email, 
          password, 
          confirmPassword, 
          referralCodeUsed: referralCode || null, 
          agreeTerms 
        };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue lors de l'authentification.");
      }

      // Successful Auth
      onAuthSuccess(data.token, data.profile, data.refNotification);
    } catch (err: any) {
      setError(err.message || "Impossible de se connecter au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1917] flex flex-col justify-center items-center px-4 py-12 selection:bg-[#E2C27A] selection:text-white">
      {/* Premium Elegant Card Container */}
      <div className="max-w-md w-full bg-[#242321] rounded-[32px] border border-[#E2C27A]/20 shadow-2xl p-8 md:p-10 relative overflow-hidden animate-scale-up">
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
            <h1 className="font-black text-2xl tracking-tight font-manrope text-[#F5F3EE]">
              Wealth<span className="text-[#E2C27A]">Craft</span>
            </h1>
            <p className="text-[10px] text-[#B8B2A8] tracking-widest font-bold uppercase -mt-0.5">
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
          
          {/* Full Name field (Register only) */}
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold tracking-wider text-[#B8B2A8]">Nom Complet</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E2C27A]/60" />
                <input
                  type="text"
                  placeholder="Ex: Jean Dupont"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E2C27A]/20 bg-[#242321] text-xs font-semibold text-[#F5F3EE] focus:outline-none focus:border-[#E2C27A]"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

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
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E2C27A]/20 bg-[#242321] text-xs font-semibold text-[#F5F3EE] focus:outline-none focus:border-[#E2C27A]"
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[9px] uppercase font-bold tracking-wider text-[#B8B2A8]">Mot de passe</label>
              {!isLogin && (
                <span className="text-[9px] text-gray-400">Min. 5 caractères</span>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E2C27A]/60" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E2C27A]/20 bg-[#242321] text-xs font-semibold text-[#F5F3EE] focus:outline-none focus:border-[#E2C27A]"
                required
              />
            </div>
          </div>

          {/* Password Confirmation field (Register only) */}
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold tracking-wider text-[#B8B2A8]">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E2C27A]/60" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E2C27A]/20 bg-[#242321] text-xs font-semibold text-[#F5F3EE] focus:outline-none focus:border-[#E2C27A]"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          {/* Referral Code (optional) field (Register only) */}
          {!isLogin && (
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[9px] uppercase font-bold tracking-wider text-[#B8B2A8]">Code de Parrainage (Optionnel)</label>
                {referralCode && (
                  <span className="text-[9px] font-bold text-[#19B37A] flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Appliqué
                  </span>
                )}
              </div>
              <div className="relative">
                <UserPlus className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E2C27A]/60" />
                <input
                  type="text"
                  placeholder="Saisissez un code (Ex: XFVEP8)"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E2C27A]/20 bg-[#242321] text-xs font-semibold text-[#F5F3EE] focus:outline-none focus:border-[#E2C27A]"
                />
              </div>
            </div>
          )}

          {/* Agree Terms check (Register only) */}
          {!isLogin && (
            <div className="flex items-start gap-2.5 pt-1">
              <input
                id="agree-terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-gray-300 text-[#E2C27A] focus:ring-[#E2C27A] cursor-pointer"
                required
              />
              <label htmlFor="agree-terms" className="text-[11px] text-[#B8B2A8] leading-snug cursor-pointer select-none">
                J'accepte les <span className="font-bold text-[#F5F3EE] underline">Conditions Générales d'Utilisation</span> et la politique de confidentialité de WealthCraft.
              </label>
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-[#C8A25D] via-[#E2C27A] to-[#C8A25D] text-[#F5F3EE] font-black text-xs uppercase tracking-wider py-4 rounded-xl shadow-lg hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 glow-btn cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="animate-spin w-4.5 h-4.5 border-2 border-[#F5F3EE] border-t-transparent rounded-full"></span>
            ) : isLogin ? (
              <>
                <LogIn className="w-4 h-4" /> Se Connecter
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" /> Créer mon Compte
              </>
            )}
          </button>
        </form>

        {/* Footer Toggle Switch */}
        <div className="mt-8 pt-6 border-t border-[#E2C27A]/10 text-center">
          <p className="text-xs text-[#B8B2A8]">
            {isLogin 
              ? "Nouveau membre du cercle ?" 
              : "Vous avez déjà un compte d'élite ?"
            }
          </p>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="mt-2 text-xs font-black uppercase text-[#E2C27A] hover:text-[#F5F3EE] transition-colors cursor-pointer tracking-wider"
          >
            {isLogin ? "S'inscrire Maintenant" : "Se Connecter à l'Espace Privé"}
          </button>
        </div>

        {/* Security assurance */}
        <div className="flex items-center justify-center gap-1.5 mt-6 text-[10px] text-gray-400">
          <Shield className="w-3.5 h-3.5 text-[#E2C27A]/80" />
          <span>Régulé & Crypté de Bout en Bout</span>
        </div>
      </div>
    </div>
  );
}
