import React, { useState } from 'react';
import { 
  Wallet, 
  CreditCard, 
  Smartphone, 
  Coins, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  QrCode, 
  Info, 
  Banknote,
  ArrowRight
} from 'lucide-react';
import { Transaction, UserProfile } from '../types';

interface WithdrawTabProps {
  profile: UserProfile;
  transactions: Transaction[];
  onWithdraw: (amount: number, method: string, details: string) => Promise<{ success: boolean; error?: string }> | any;
}

export default function WithdrawTab({ profile, transactions, onWithdraw }: WithdrawTabProps) {
  const [selectedMethod, setSelectedMethod] = useState<'bank' | 'paypal' | 'crypto' | 'mobile'>('bank');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  
  // Payment Method details
  const [iban, setIban] = useState('');
  const [accountHolder, setAccountHolder] = useState(profile.fullName || profile.name || '');
  const [paypalEmail, setPaypalEmail] = useState(profile.email);
  const [cryptoAddress, setCryptoAddress] = useState('');
  const [cryptoNetwork, setCryptoNetwork] = useState('USDT (TRC20)');
  const [mobileNumber, setMobileNumber] = useState('');
  const [mobileOperator, setMobileOperator] = useState('Orange Money');

  // Transaction states
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionReceipt, setTransactionReceipt] = useState<{
    id: string;
    amount: number;
    methodLabel: string;
    date: string;
    recipient: string;
  } | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const getMethodLabel = () => {
    switch (selectedMethod) {
      case 'bank': return 'Virement SEPA';
      case 'paypal': return 'PayPal Direct';
      case 'crypto': return `Retrait Crypto (${cryptoNetwork})`;
      case 'mobile': return `Mobile Money (${mobileOperator})`;
    }
  };

  const getMethodDetails = () => {
    switch (selectedMethod) {
      case 'bank': return `IBAN: ${iban}`;
      case 'paypal': return `Email: ${paypalEmail}`;
      case 'crypto': return `Adresse: ${cryptoAddress}`;
      case 'mobile': return `N°: ${mobileNumber}`;
    }
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorStatus(null);
    setTransactionReceipt(null);

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setErrorStatus("Veuillez entrer un montant valide supérieur à 0 F CFA.");
      return;
    }

    if (amount < 1000) {
      setErrorStatus("Le montant minimum de retrait est de 1 000 F CFA.");
      return;
    }

    if (amount > profile.balance) {
      setErrorStatus(`Fonds insuffisants. Votre solde disponible est de ${profile.balance.toLocaleString('fr-FR')} F CFA.`);
      return;
    }

    // Specific Method Validation
    if (selectedMethod === 'bank' && !iban.trim()) {
      setErrorStatus("Veuillez saisir votre IBAN complet.");
      return;
    }
    if (selectedMethod === 'paypal' && !paypalEmail.trim()) {
      setErrorStatus("Veuillez entrer une adresse e-mail PayPal valide.");
      return;
    }
    if (selectedMethod === 'crypto' && !cryptoAddress.trim()) {
      setErrorStatus("Veuillez saisir l'adresse de destination de votre portefeuille crypto.");
      return;
    }
    if (selectedMethod === 'mobile' && !mobileNumber.trim()) {
      setErrorStatus("Veuillez saisir votre numéro de téléphone mobile money.");
      return;
    }

    // Trigger loading spinner to simulate bank processing or blockchain confirmation
    setIsProcessing(true);
    setTimeout(async () => {
      const details = getMethodDetails();
      const methodLabel = getMethodLabel();
      
      const result = await onWithdraw(amount, methodLabel, details);
      setIsProcessing(false);

      if (result.success) {
        setTransactionReceipt({
          id: `REC-${Math.floor(Math.random() * 900000) + 100000}`,
          amount,
          methodLabel,
          date: new Date().toLocaleString('fr-FR'),
          recipient: details
        });
        setWithdrawAmount('');
        // Reset method fields
        setIban('');
        setCryptoAddress('');
        setMobileNumber('');
      } else {
        setErrorStatus(result.error || "Une erreur inconnue est survenue lors du transfert.");
      }
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Withdraw header */}
      <div>
        <h2 className="text-2xl font-bold text-[#F5F3EE] font-manrope">Retrait d'Argent Sécurisé</h2>
        <p className="text-xs text-[#B8B2A8] mt-1">Transférez vos gains et vos fonds disponibles vers vos comptes externes en un clic.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Method select and Form (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Method Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => { setSelectedMethod('bank'); setErrorStatus(null); setTransactionReceipt(null); }}
              className={`p-4 rounded-[20px] border flex flex-col items-center text-center gap-2 transition-all cursor-pointer ${
                selectedMethod === 'bank'
                  ? 'bg-[#1A1917] text-white border-[#F5F3EE] shadow-sm'
                  : 'bg-[#242321] text-[#B8B2A8] border-[#E2C27A]/20 hover:border-[#E2C27A]/40'
              }`}
            >
              <CreditCard className="w-5 h-5 text-[#E2C27A]" />
              <span className="text-xs font-bold font-manrope">Virement SEPA</span>
            </button>

            <button
              onClick={() => { setSelectedMethod('paypal'); setErrorStatus(null); setTransactionReceipt(null); }}
              className={`p-4 rounded-[20px] border flex flex-col items-center text-center gap-2 transition-all cursor-pointer ${
                selectedMethod === 'paypal'
                  ? 'bg-[#1A1917] text-white border-[#F5F3EE] shadow-sm'
                  : 'bg-[#242321] text-[#B8B2A8] border-[#E2C27A]/20 hover:border-[#E2C27A]/40'
              }`}
            >
              <Wallet className="w-5 h-5 text-[#E2C27A]" />
              <span className="text-xs font-bold font-manrope">PayPal</span>
            </button>

            <button
              onClick={() => { setSelectedMethod('crypto'); setErrorStatus(null); setTransactionReceipt(null); }}
              className={`p-4 rounded-[20px] border flex flex-col items-center text-center gap-2 transition-all cursor-pointer ${
                selectedMethod === 'crypto'
                  ? 'bg-[#1A1917] text-white border-[#F5F3EE] shadow-sm'
                  : 'bg-[#242321] text-[#B8B2A8] border-[#E2C27A]/20 hover:border-[#E2C27A]/40'
              }`}
            >
              <Coins className="w-5 h-5 text-[#E2C27A]" />
              <span className="text-xs font-bold font-manrope">Cryptomonnaie</span>
            </button>

            <button
              onClick={() => { setSelectedMethod('mobile'); setErrorStatus(null); setTransactionReceipt(null); }}
              className={`p-4 rounded-[20px] border flex flex-col items-center text-center gap-2 transition-all cursor-pointer ${
                selectedMethod === 'mobile'
                  ? 'bg-[#1A1917] text-white border-[#F5F3EE] shadow-sm'
                  : 'bg-[#242321] text-[#B8B2A8] border-[#E2C27A]/20 hover:border-[#E2C27A]/40'
              }`}
            >
              <Smartphone className="w-5 h-5 text-[#E2C27A]" />
              <span className="text-xs font-bold font-manrope">Mobile Money</span>
            </button>
          </div>

          {/* Form Content inside Premium Card */}
          <div className="glass-card p-6 md:p-8 rounded-[24px] border border-[#E2C27A]/20 relative">
            <h3 className="text-base font-bold text-[#F5F3EE] mb-6 font-manrope border-b border-[#E2C27A]/10 pb-3">
              Détails du Retrait — {getMethodLabel()}
            </h3>

            {isProcessing ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-4 animate-pulse">
                <div className="w-12 h-12 border-4 border-[#E2C27A] border-t-transparent rounded-full animate-spin"></div>
                <div className="text-center">
                  <p className="text-sm font-bold text-[#F5F3EE]">Traitement sécurisé en cours...</p>
                  <p className="text-[11px] text-[#B8B2A8] mt-1">Interrogation des passerelles de sécurité financières WealthCraft.</p>
                </div>
              </div>
            ) : transactionReceipt ? (
              /* Success Receipt View */
              <div className="space-y-6 animate-fade-in">
                <div className="text-center py-4">
                  <div className="w-14 h-14 bg-[#19B37A]/10 text-[#19B37A] rounded-full flex items-center justify-center mx-auto border border-[#19B37A]/20 mb-3">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-black text-[#F5F3EE] font-manrope">Transfert Initié avec Succès !</h4>
                  <p className="text-xs text-[#B8B2A8] mt-1">Votre argent a été envoyé et arrivera très rapidement.</p>
                </div>

                <div className="bg-[#242321] border border-[#E2C27A]/15 rounded-2xl p-5 space-y-3.5 text-xs text-[#F5F3EE]">
                  <div className="flex justify-between items-center pb-2 border-b border-[#E2C27A]/10">
                    <span className="text-[#B8B2A8]">N° de transaction :</span>
                    <span className="font-mono font-bold text-[#E2C27A]">{transactionReceipt.id}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-[#E2C27A]/10">
                    <span className="text-[#B8B2A8]">Montant transféré :</span>
                    <span className="font-extrabold text-[#19B37A] text-sm">{transactionReceipt.amount.toLocaleString('fr-FR')} F CFA</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-[#E2C27A]/10">
                    <span className="text-[#B8B2A8]">Méthode de retrait :</span>
                    <span className="font-bold">{transactionReceipt.methodLabel}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-[#E2C27A]/10">
                    <span className="text-[#B8B2A8]">Destinataire :</span>
                    <span className="font-mono font-semibold max-w-[180px] truncate text-right">{transactionReceipt.recipient}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#B8B2A8]">Date & Heure :</span>
                    <span className="text-[#B8B2A8]">{transactionReceipt.date}</span>
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <button 
                    onClick={() => setTransactionReceipt(null)}
                    className="bg-[#E2C27A] text-[#1A1917] hover:bg-[#C8A25D] text-xs font-bold px-5 py-3 rounded-xl transition-colors cursor-pointer"
                  >
                    Faire un autre retrait
                  </button>
                </div>
              </div>
            ) : (
              /* Core withdrawal Form */
              <form onSubmit={handleWithdrawSubmit} className="space-y-6">
                
                {/* Global cash indicators */}
                <div className="p-4 rounded-xl bg-[#242321] border border-[#E2C27A]/15 flex items-center justify-between text-xs">
                  <div>
                    <p className="text-[#B8B2A8]">Votre Solde Disponible Actuel :</p>
                    <p className="text-xl font-extrabold text-[#F5F3EE] font-manrope mt-1">
                      {profile.balance.toLocaleString('fr-FR')} F CFA
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-[#19B37A] bg-[#19B37A]/10 px-2 py-0.5 rounded-full border border-[#19B37A]/20 font-semibold inline-block">
                      Frais de retrait : 0 F (Gratuit)
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1.5">Temps estimé : Instantané</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Amount Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-[#B8B2A8]">Montant du retrait (F CFA)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">F</span>
                      <input 
                        type="number" 
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="Ex: 5000" 
                        min="1000"
                        max={profile.balance}
                        className="w-full pl-8 pr-16 py-3 rounded-xl border border-[#E2C27A]/20 bg-white text-xs font-bold text-[#F5F3EE] focus:outline-none focus:border-[#E2C27A]"
                        required
                      />
                      <button 
                        type="button"
                        onClick={() => setWithdrawAmount(profile.balance.toString())}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#E2C27A] bg-[#E2C27A]/10 hover:bg-[#E2C27A] hover:text-black px-2 py-1 rounded"
                      >
                        MAX
                      </button>
                    </div>
                    <span className="text-[10px] text-gray-400">Montant minimum : 1 000 F CFA</span>
                  </div>
                  
                  {/* Method specifics input */}
                  {selectedMethod === 'bank' && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-[#B8B2A8]">Titulaire du compte</label>
                      <input 
                        type="text" 
                        value={accountHolder}
                        onChange={(e) => setAccountHolder(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#E2C27A]/20 bg-white text-xs font-semibold text-[#F5F3EE] focus:outline-none focus:border-[#E2C27A]"
                        required
                      />
                    </div>
                  )}

                  {selectedMethod === 'paypal' && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-[#B8B2A8]">Email de compte PayPal</label>
                      <input 
                        type="email" 
                        value={paypalEmail}
                        onChange={(e) => setPaypalEmail(e.target.value)}
                        placeholder="Ex: paypal@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-[#E2C27A]/20 bg-white text-xs font-semibold text-[#F5F3EE] focus:outline-none focus:border-[#E2C27A]"
                        required
                      />
                    </div>
                  )}

                  {selectedMethod === 'crypto' && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-[#B8B2A8]">Réseau de Retrait</label>
                      <select 
                        value={cryptoNetwork}
                        onChange={(e) => setCryptoNetwork(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#E2C27A]/20 bg-white text-xs font-semibold text-[#F5F3EE] focus:outline-none focus:border-[#E2C27A] cursor-pointer"
                      >
                        <option value="USDT (TRC20)">USDT (TRC20) — Frais minimal</option>
                        <option value="USDT (ERC20)">USDT (ERC20) — Standard</option>
                        <option value="Bitcoin (BTC)">Bitcoin (BTC) — Natif</option>
                        <option value="Solana (SOL)">Solana (SOL) — Rapide</option>
                      </select>
                    </div>
                  )}

                  {selectedMethod === 'mobile' && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-[#B8B2A8]">Opérateur mobile money</label>
                      <select 
                        value={mobileOperator}
                        onChange={(e) => setMobileOperator(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[#E2C27A]/20 bg-white text-xs font-semibold text-[#F5F3EE] focus:outline-none focus:border-[#E2C27A] cursor-pointer"
                      >
                        <option value="Orange Money">Orange Money</option>
                        <option value="MTN Mobile Money">MTN Mobile Money</option>
                        <option value="Wave">Wave</option>
                        <option value="Moov Money">Moov Money</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Second row input for remaining fields */}
                {selectedMethod === 'bank' && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-[#B8B2A8]">Numéro IBAN du compte</label>
                    <input 
                      type="text" 
                      placeholder="FR76 3000 6000 0123 4567 8901 234"
                      value={iban}
                      onChange={(e) => setIban(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#E2C27A]/20 bg-white text-xs font-mono font-semibold text-[#F5F3EE] focus:outline-none focus:border-[#E2C27A]"
                      required
                    />
                  </div>
                )}

                {selectedMethod === 'crypto' && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-[#B8B2A8]">Adresse de portefeuille de destination ({cryptoNetwork.split(' ')[0]})</label>
                    <input 
                      type="text" 
                      placeholder="Ex: T9yD14Nj9y7xABvS2aNswC..." 
                      value={cryptoAddress}
                      onChange={(e) => setCryptoAddress(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#E2C27A]/20 bg-white text-xs font-mono font-semibold text-[#F5F3EE] focus:outline-none focus:border-[#E2C27A]"
                      required
                    />
                  </div>
                )}

                {selectedMethod === 'mobile' && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-[#B8B2A8]">Numéro de téléphone mobile money</label>
                    <input 
                      type="tel" 
                      placeholder="Ex: +225 07 00 00 00 00" 
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#E2C27A]/20 bg-white text-xs font-mono font-semibold text-[#F5F3EE] focus:outline-none focus:border-[#E2C27A]"
                      required
                    />
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#C8A25D] to-[#E2C27A] text-[#F5F3EE] font-bold text-xs py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 glow-btn cursor-pointer"
                >
                  Valider et recevoir mon argent <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            {/* Error notifications */}
            {errorStatus && (
              <div className="p-4 rounded-xl text-xs bg-amber-50 text-amber-800 border border-amber-100 flex gap-2.5 mt-4">
                <AlertCircle className="w-4.5 h-4.5 text-amber-600 shrink-0" />
                <p>{errorStatus}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Security trust card & history of cashouts (1 col) */}
        <div className="space-y-6">
          {/* Security details card */}
          <div className="glass-card p-6 rounded-[24px] space-y-4">
            <h4 className="text-xs font-bold text-[#F5F3EE] uppercase tracking-wider flex items-center gap-1.5">
              <Banknote className="w-4.5 h-4.5 text-[#E2C27A]" /> Retraits Sécurisés
            </h4>
            <div className="space-y-3 text-xs text-[#B8B2A8] leading-relaxed">
              <p>
                WealthCraft utilise des contrats d'intermédiation financière hautement surveillés et des protocoles de chiffrement <strong className="text-[#F5F3EE]">AES-256</strong> conformes aux régulations de l'ACPR et de la Banque de France.
              </p>
              <div className="p-3 bg-[#242321] rounded-xl border border-[#E2C27A]/15 text-[11px] space-y-2">
                <div className="flex items-center gap-2 text-[#E2C27A] font-bold">
                  <Info className="w-4 h-4" /> Temps moyen constaté
                </div>
                <ul className="list-disc pl-4 space-y-0.5 text-gray-500 font-medium">
                  <li>SEPA Virement : 12-24 heures</li>
                  <li>PayPal : Instantané (&lt; 5 minutes)</li>
                  <li>Crypto (USDT/SOL) : Instantané</li>
                  <li>Mobile money : Instantané (&lt; 2 minutes)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quick list of past withdrawals */}
          <div className="glass-card p-6 rounded-[24px]">
            <h4 className="text-xs font-bold text-[#F5F3EE] uppercase tracking-wider mb-4">Historique des Retraits</h4>
            
            {transactions.filter(t => t.type === 'withdrawal').length === 0 ? (
              <p className="text-xs text-[#B8B2A8] italic text-center py-6">Aucun retrait effectué pour le moment.</p>
            ) : (
              <div className="space-y-3">
                {transactions.filter(t => t.type === 'withdrawal').slice(0, 4).map((tx) => (
                  <div key={tx.id} className="flex justify-between items-center p-2.5 rounded-xl bg-[#242321] border border-[#E2C27A]/5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#F5F3EE]">{tx.method || 'Transfert'}</p>
                        <p className="text-[9px] text-[#B8B2A8]">{tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-[#F5F3EE]">{tx.amount.toLocaleString('fr-FR')} F CFA</p>
                      <span className="text-[8px] bg-[#19B37A]/10 text-[#19B37A] px-1 py-0.2 rounded font-medium">
                        Validé
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
