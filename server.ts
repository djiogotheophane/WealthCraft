import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";

// Define the interface for a persistent database user
interface DBUser {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  referralCode: string;
  referredByCode: string | null;
  balance: number;
  investedBalance: number;
  totalReferralEarnings: number;
  totalRewardsClaimed: number;
  tier: string;
  investmentHistory: Record<string, number>;
  spinsLeft: number;
  transactions: any[];
  referrals: any[];
  tasks: any[];
  usedPromoCodes: string[];
  // Gamified Learning Platform Fields
  learningPoints?: number;
  learningStreak?: number;
  learningLevel?: number;
  learningTime?: number;
  lessonsCompleted?: string[];
  badgesObtained?: string[];
  learningHistory?: any[];
  activeLessonId?: string | null;
  activeLessonStartedAt?: number | null;
  bypassTimeCheck?: boolean;
}

const DB_FILE = path.join(process.cwd(), "db.json");

// Helper function to read/write JSON database
function readDB(): DBUser[] {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data || "[]");
  } catch (error) {
    console.error("Error reading database file:", error);
    return [];
  }
}

function writeDB(users: DBUser[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Error writing database file:", error);
  }
}

// Password hashing helper functions
function hashPassword(password: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return { salt, hash };
}

function verifyPassword(password: string, salt: string, hash: string): boolean {
  const checkHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return hash === checkHash;
}

// Generate a random unique uppercase alphanumeric code of length 6
function generateReferralCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const INITIAL_TASKS = [
  {
    id: "daily-checkin",
    title: "Bonus Quotidien",
    description: "Connectez-vous aujourd'hui et réclamez votre bonus d'or.",
    rewardAmount: 250,
    category: "daily",
    status: "available",
    actionLabel: "Réclamer 250 F CFA"
  },
  {
    id: "kyc-verify",
    title: "Vérification d'Identité (KYC)",
    description: "Sécurisez votre compte en validant votre pièce d'identité.",
    rewardAmount: 1000,
    category: "security",
    status: "available",
    actionLabel: "Vérifier l'identité"
  },
  {
    id: "first-investment",
    title: "Premier Pas de Géant",
    description: "Réalisez votre premier investissement de 1 500 F CFA ou plus.",
    rewardAmount: 2000,
    category: "investment",
    status: "available",
    actionLabel: "Investir"
  },
  {
    id: "social-share",
    title: "Partage d'Élite",
    description: "Partagez WealthCraft sur vos réseaux sociaux pour faire grandir la communauté.",
    rewardAmount: 500,
    category: "social",
    status: "available",
    actionLabel: "Partager"
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse body & prevent XSS/injection at basic API level
  app.use(express.json());

  // Simple in-memory token session mapping for secure iframe handling
  // Tokens are stored in browser localStorage. We map tokens to userIds.
  const tokenToUserIdMap = new Map<string, string>();

  // Helper middleware to authenticate users
  const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(410).json({ error: "Non autorisé. Veuillez vous connecter." });
    }

    const userId = tokenToUserIdMap.get(token) || token; // Fallback to token if it is the userId itself
    const users = readDB();
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return res.status(401).json({ error: "Session invalide ou expirée." });
    }

    req.body.user = user;
    next();
  };

  // --- API Routes ---

  // 1. Auth: Registration
  app.post("/api/auth/register", (req, res) => {
    const { fullName, email, password, confirmPassword, referralCodeUsed, agreeTerms } = req.body;

    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "Tous les champs requis doivent être remplis." });
    }

    if (password.length < 5) {
      return res.status(400).json({ error: "Le mot de passe doit contenir au moins 5 caractères." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Les mots de passe ne correspondent pas." });
    }

    if (!agreeTerms) {
      return res.status(400).json({ error: "Vous devez accepter les conditions d'utilisation." });
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Format d'adresse e-mail invalide." });
    }

    const users = readDB();
    const emailLower = email.toLowerCase().trim();
    const emailExists = users.some((u) => u.email.toLowerCase() === emailLower);

    if (emailExists) {
      return res.status(400).json({ error: "Cette adresse e-mail est déjà utilisée pour un compte." });
    }

    // Create unique ID & Referral code
    const userId = `USR-${Math.floor(Math.random() * 900000) + 100000}`;
    
    let personalReferralCode = generateReferralCode();
    while (users.some((u) => u.referralCode === personalReferralCode)) {
      personalReferralCode = generateReferralCode();
    }

    const { salt, hash } = hashPassword(password);

    // Initial fresh slate as requested
    const newUser: DBUser = {
      id: userId,
      fullName: fullName.trim(),
      email: emailLower,
      passwordHash: hash,
      passwordSalt: salt,
      referralCode: personalReferralCode,
      referredByCode: null,
      balance: 0,
      investedBalance: 0,
      totalReferralEarnings: 0,
      totalRewardsClaimed: 0,
      tier: "Bronze",
      investmentHistory: {},
      spinsLeft: 5,
      transactions: [],
      referrals: [],
      tasks: JSON.parse(JSON.stringify(INITIAL_TASKS)),
      usedPromoCodes: [],
    };

    // Apply Referral rewards if code is provided and exists
    let refereeNotification = "";
    if (referralCodeUsed) {
      const cleanRefCode = referralCodeUsed.trim().toUpperCase();
      const referrerIndex = users.findIndex((u) => u.referralCode === cleanRefCode);

      if (referrerIndex !== -1) {
        const referrer = users[referrerIndex];
        
        // Setup referral relationship
        newUser.referredByCode = referrer.referralCode;
        newUser.balance = 700; // Bonus of 700 FCFA immediately

        const currentDateStr = new Date().toISOString().slice(0, 16).replace("T", " ");

        // Add 700 FCFA signup transaction for new user
        newUser.transactions.push({
          id: `TX-REG-${Math.floor(Math.random() * 90000) + 10000}`,
          type: "reward",
          typeLabel: "Bonus Inscription",
          amount: 700,
          date: currentDateStr,
          status: "success",
          description: `Cadeau de bienvenue d'inscription (Parrainé par ${referrer.fullName})`
        });

        // Credit the referrer with 700 FCFA bonus as well
        referrer.balance += 700;
        referrer.totalReferralEarnings += 700;
        
        // Add transaction ledger to referrer
        referrer.transactions.push({
          id: `TX-REF-${Math.floor(Math.random() * 90000) + 10000}`,
          type: "referral",
          typeLabel: "Parrainage",
          amount: 700,
          date: currentDateStr,
          status: "success",
          description: `Bonus de parrainage - ${newUser.fullName} s'est inscrit`
        });

        // Add referred member detail list
        referrer.referrals.push({
          id: newUser.id,
          name: newUser.fullName,
          email: newUser.email,
          dateJoined: new Date().toISOString().slice(0, 10),
          status: "Actif (Bonus reçu)",
          rewardEarned: 700
        });

        users[referrerIndex] = referrer;
        refereeNotification = `Parrainé par ${referrer.fullName} : +700 F CFA reçus !`;
      } else {
        return res.status(400).json({ error: "Le code de parrainage fourni n'existe pas." });
      }
    }

    users.push(newUser);
    writeDB(users);

    // Create session token
    const sessionToken = crypto.randomBytes(32).toString("hex");
    tokenToUserIdMap.set(sessionToken, newUser.id);

    // Return profile without password hashes
    const { passwordHash, passwordSalt, ...safeProfile } = newUser;

    res.status(200).json({
      success: true,
      token: sessionToken,
      profile: safeProfile,
      refNotification: refereeNotification
    });
  });

  // 2. Auth: Login
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "E-mail et mot de passe requis." });
    }

    const users = readDB();
    const emailLower = email.toLowerCase().trim();
    const user = users.find((u) => u.email.toLowerCase() === emailLower);

    if (!user) {
      return res.status(400).json({ error: "Identifiants incorrects. Veuillez réessayer." });
    }

    const isMatch = verifyPassword(password, user.passwordSalt, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: "Identifiants incorrects. Veuillez réessayer." });
    }

    const sessionToken = crypto.randomBytes(32).toString("hex");
    tokenToUserIdMap.set(sessionToken, user.id);

    const { passwordHash, passwordSalt, ...safeProfile } = user;

    res.status(200).json({
      success: true,
      token: sessionToken,
      profile: safeProfile
    });
  });

  // 3. Auth: Current User Status
  app.get("/api/auth/me", authenticateToken, (req, res) => {
    const { passwordHash, passwordSalt, ...safeProfile } = req.body.user;
    res.status(200).json({ success: true, profile: safeProfile });
  });

  // 4. Action: Make an Investment
  app.post("/api/profile/invest", authenticateToken, (req, res) => {
    const { assetId, amount } = req.body;
    const user = req.body.user as DBUser;

    if (!assetId || !amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Données d'investissement invalides." });
    }

    if (user.balance < amount) {
      return res.status(400).json({ error: "Solde insuffisant pour cet investissement." });
    }

    const users = readDB();
    const userIdx = users.findIndex((u) => u.id === user.id);

    if (userIdx === -1) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    // Deduct and add to invested
    users[userIdx].balance -= amount;
    users[userIdx].investedBalance += amount;

    // Save investment history counters
    if (!users[userIdx].investmentHistory) {
      users[userIdx].investmentHistory = {};
    }
    users[userIdx].investmentHistory[assetId] = (users[userIdx].investmentHistory[assetId] || 0) + amount;

    // Check & update First Investment Reward Task
    if (amount >= 1500) {
      users[userIdx].tasks = users[userIdx].tasks.map((t) => {
        if (t.id === "first-investment" && t.status === "available") {
          return { ...t, status: "completed" };
        }
        return t;
      });
    }

    // Earn 5 extra spins of the wheel for any investment of 500 F CFA or more
    let earnedSpins = false;
    if (amount >= 500) {
      users[userIdx].spinsLeft += 5;
      earnedSpins = true;
    }

    // Dynamic Tier Upgrades
    const totalInvestments = users[userIdx].investedBalance;
    if (totalInvestments >= 50000) {
      users[userIdx].tier = "Platinum";
    } else if (totalInvestments >= 15000) {
      users[userIdx].tier = "Gold";
    } else if (totalInvestments >= 5000) {
      users[userIdx].tier = "Silver";
    }

    const currentDateStr = new Date().toISOString().slice(0, 16).replace("T", " ");

    // Add transaction ledger
    users[userIdx].transactions.unshift({
      id: `TX-INV-${Math.floor(Math.random() * 90000) + 10000}`,
      type: "investment",
      typeLabel: "Placement",
      amount: amount,
      date: currentDateStr,
      status: "success",
      description: `Investissement validé dans ${assetId.includes("premium") ? "Premium" : "Standard"} Niveau`
    });

    writeDB(users);

    const { passwordHash, passwordSalt, ...safeProfile } = users[userIdx];
    res.status(200).json({
      success: true,
      profile: safeProfile,
      earnedSpins
    });
  });

  // 5. Action: Deposit Funds
  app.post("/api/profile/deposit", authenticateToken, (req, res) => {
    const { amount, method } = req.body;
    const user = req.body.user as DBUser;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Montant de dépôt invalide." });
    }

    const users = readDB();
    const userIdx = users.findIndex((u) => u.id === user.id);

    if (userIdx === -1) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    users[userIdx].balance += amount;

    const currentDateStr = new Date().toISOString().slice(0, 16).replace("T", " ");

    // Add transaction ledger
    users[userIdx].transactions.unshift({
      id: `TX-DEP-${Math.floor(Math.random() * 90000) + 10000}`,
      type: "deposit",
      typeLabel: "Dépôt",
      amount: amount,
      date: currentDateStr,
      status: "success",
      description: `Dépôt crédité avec succès via ${method}`,
      method: method
    });

    writeDB(users);

    const { passwordHash, passwordSalt, ...safeProfile } = users[userIdx];
    res.status(200).json({
      success: true,
      profile: safeProfile
    });
  });

  // 6. Action: Withdraw Funds
  app.post("/api/profile/withdraw", authenticateToken, (req, res) => {
    const { amount, method, accountNumber } = req.body;
    const user = req.body.user as DBUser;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Montant de retrait invalide." });
    }

    if (user.balance < amount) {
      return res.status(400).json({ error: "Fonds insuffisants dans votre solde." });
    }

    const users = readDB();
    const userIdx = users.findIndex((u) => u.id === user.id);

    if (userIdx === -1) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    users[userIdx].balance -= amount;

    const currentDateStr = new Date().toISOString().slice(0, 16).replace("T", " ");

    // Add transaction ledger
    users[userIdx].transactions.unshift({
      id: `TX-WTH-${Math.floor(Math.random() * 90000) + 10000}`,
      type: "withdrawal",
      typeLabel: "Retrait d'argent",
      amount: amount,
      date: currentDateStr,
      status: "success",
      description: `Retrait vers compte ${method} (${accountNumber})`,
      method: method
    });

    writeDB(users);

    const { passwordHash, passwordSalt, ...safeProfile } = users[userIdx];
    res.status(200).json({
      success: true,
      profile: safeProfile
    });
  });

  // 7. Action: Spin Wheel Win
  app.post("/api/profile/win-wheel", authenticateToken, (req, res) => {
    const { amount, label } = req.body;
    const user = req.body.user as DBUser;

    if (user.spinsLeft <= 0) {
      return res.status(400).json({ error: "Vous n'avez plus de tours disponibles !" });
    }

    const users = readDB();
    const userIdx = users.findIndex((u) => u.id === user.id);

    if (userIdx === -1) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    // Decrement spin
    users[userIdx].spinsLeft = Math.max(0, users[userIdx].spinsLeft - 1);

    // Credit amount if it is positive (more than 0 and not 'Perdu' or 'Recommencer')
    if (amount > 0) {
      users[userIdx].balance += amount;

      const currentDateStr = new Date().toISOString().slice(0, 16).replace("T", " ");

      users[userIdx].transactions.unshift({
        id: `TX-WHL-${Math.floor(Math.random() * 90000) + 10000}`,
        type: "reward",
        typeLabel: "Roue d'Élite",
        amount: amount,
        date: currentDateStr,
        status: "success",
        description: `Gain Roue de la Fortune : +${label}`
      });
    }

    writeDB(users);

    const { passwordHash, passwordSalt, ...safeProfile } = users[userIdx];
    res.status(200).json({
      success: true,
      profile: safeProfile
    });
  });

  // 8. Action: Claim Quest Rewards
  app.post("/api/profile/claim-task", authenticateToken, (req, res) => {
    const { taskId } = req.body;
    const user = req.body.user as DBUser;

    const users = readDB();
    const userIdx = users.findIndex((u) => u.id === user.id);

    if (userIdx === -1) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    const taskIdx = users[userIdx].tasks.findIndex((t) => t.id === taskId);
    if (taskIdx === -1) {
      return res.status(400).json({ error: "Quête non trouvée." });
    }

    const task = users[userIdx].tasks[taskIdx];

    if (task.status !== "completed") {
      // Allow instant completing for demo purposes for tasks other than first-investment if requested
      // But let's check: if standard status is completed we claim.
      // We can also allow them to solve the action here.
      return res.status(400).json({ error: "Cette quête n'est pas encore accomplie." });
    }

    users[userIdx].balance += task.rewardAmount;
    users[userIdx].totalRewardsClaimed += task.rewardAmount;
    users[userIdx].tasks[taskIdx].status = "claimed";

    const currentDateStr = new Date().toISOString().slice(0, 16).replace("T", " ");

    users[userIdx].transactions.unshift({
      id: `TX-TSK-${Math.floor(Math.random() * 90000) + 10000}`,
      type: "reward",
      typeLabel: "Récompense",
      amount: task.rewardAmount,
      date: currentDateStr,
      status: "success",
      description: `Gain de quête réclamé : ${task.title}`
    });

    writeDB(users);

    const { passwordHash, passwordSalt, ...safeProfile } = users[userIdx];
    res.status(200).json({
      success: true,
      profile: safeProfile
    });
  });

  // 9. Action: Submit KYC / Complete specific tasks immediately for UX convenience
  app.post("/api/profile/verify-kyc", authenticateToken, (req, res) => {
    const user = req.body.user as DBUser;
    const users = readDB();
    const userIdx = users.findIndex((u) => u.id === user.id);

    if (userIdx === -1) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    // Mark KYC completed
    users[userIdx].tasks = users[userIdx].tasks.map((t) => {
      if (t.id === "kyc-verify" && t.status === "available") {
        return { ...t, status: "completed" };
      }
      return t;
    });

    writeDB(users);

    const { passwordHash, passwordSalt, ...safeProfile } = users[userIdx];
    res.status(200).json({
      success: true,
      profile: safeProfile
    });
  });

  // 10. Action: Trigger social share quête
  app.post("/api/profile/social-share", authenticateToken, (req, res) => {
    const user = req.body.user as DBUser;
    const users = readDB();
    const userIdx = users.findIndex((u) => u.id === user.id);

    if (userIdx === -1) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    // Mark Social Share completed
    users[userIdx].tasks = users[userIdx].tasks.map((t) => {
      if (t.id === "social-share" && t.status === "available") {
        return { ...t, status: "completed" };
      }
      return t;
    });

    writeDB(users);

    const { passwordHash, passwordSalt, ...safeProfile } = users[userIdx];
    res.status(200).json({
      success: true,
      profile: safeProfile
    });
  });

  // 11. Action: Trigger daily check-in quête
  app.post("/api/profile/daily-checkin", authenticateToken, (req, res) => {
    const user = req.body.user as DBUser;
    const users = readDB();
    const userIdx = users.findIndex((u) => u.id === user.id);

    if (userIdx === -1) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    // Mark checkin completed
    users[userIdx].tasks = users[userIdx].tasks.map((t) => {
      if (t.id === "daily-checkin" && t.status === "available") {
        return { ...t, status: "completed" };
      }
      return t;
    });

    writeDB(users);

    const { passwordHash, passwordSalt, ...safeProfile } = users[userIdx];
    res.status(200).json({
      success: true,
      profile: safeProfile
    });
  });

  // 12. Action: Apply Promo Code
  app.post("/api/profile/apply-promo", authenticateToken, (req, res) => {
    const { code } = req.body;
    const user = req.body.user as DBUser;

    if (!code) {
      return res.status(400).json({ error: "Code promotionnel requis." });
    }

    const cleanCode = code.trim().toUpperCase();

    if (user.usedPromoCodes.includes(cleanCode)) {
      return res.status(400).json({ error: "Vous avez déjà utilisé ce code promotionnel !" });
    }

    let bonusAmount = 0;
    if (cleanCode === "GOLDEN2026") {
      bonusAmount = 5000;
    } else if (cleanCode === "ELITE100") {
      bonusAmount = 10000;
    } else if (cleanCode === "WEALTHY") {
      bonusAmount = 25000;
    } else {
      return res.status(400).json({ error: "Code promotionnel invalide." });
    }

    const users = readDB();
    const userIdx = users.findIndex((u) => u.id === user.id);

    if (userIdx === -1) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    users[userIdx].balance += bonusAmount;
    users[userIdx].usedPromoCodes.push(cleanCode);

    const currentDateStr = new Date().toISOString().slice(0, 16).replace("T", " ");

    users[userIdx].transactions.unshift({
      id: `TX-PRO-${Math.floor(Math.random() * 90000) + 10000}`,
      type: "reward",
      typeLabel: "Promotion",
      amount: bonusAmount,
      date: currentDateStr,
      status: "success",
      description: `Code promo validé : ${cleanCode}`
    });

    writeDB(users);

    const { passwordHash, passwordSalt, ...safeProfile } = users[userIdx];
    res.status(200).json({
      success: true,
      profile: safeProfile,
      amount: bonusAmount
    });
  });

  // 13. Action: Dev / Demo Utility - Simulate a Friend Investment (to satisfy demonstration of referrals activation)
  app.post("/api/profile/simulate-friend-invest", authenticateToken, (req, res) => {
    const { refId } = req.body;
    const user = req.body.user as DBUser;

    const users = readDB();
    const userIdx = users.findIndex((u) => u.id === user.id);

    if (userIdx === -1) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    const referralIdx = users[userIdx].referrals.findIndex((r) => r.id === refId);
    if (referralIdx === -1) {
      return res.status(404).json({ error: "Filleul non trouvé." });
    }

    const referral = users[userIdx].referrals[referralIdx];
    if (referral.status.includes("Actif (1er Investissement)")) {
      return res.status(400).json({ error: "Ce filleul a déjà activé son bonus d'investissement." });
    }

    // Award bonus for first investment of referral
    const bonusAmount = 2500;
    users[userIdx].balance += bonusAmount;
    users[userIdx].totalReferralEarnings += bonusAmount;
    
    // Update referral status
    users[userIdx].referrals[referralIdx].status = "Actif (1er Investissement)";
    users[userIdx].referrals[referralIdx].rewardEarned += bonusAmount;

    const currentDateStr = new Date().toISOString().slice(0, 16).replace("T", " ");

    users[userIdx].transactions.unshift({
      id: `TX-REF-INV-${Math.floor(Math.random() * 90000) + 10000}`,
      type: "referral",
      typeLabel: "Parrainage d'Or",
      amount: bonusAmount,
      date: currentDateStr,
      status: "success",
      description: `Bonus premier investissement de votre filleul(e) ${referral.name}`
    });

    writeDB(users);

    const { passwordHash, passwordSalt, ...safeProfile } = users[userIdx];
    res.status(200).json({
      success: true,
      profile: safeProfile
    });
  });

  // --- GAMIFIED LEARNING PLATFORM API ---

  // Helper to calculate and assign badges based on courses completed count and topic completions
  const updateLearningBadgesAndLevels = (user: DBUser) => {
    const lessonsCompleted = user.lessonsCompleted || [];
    const badgesObtained = user.badgesObtained || [];
    const learningPoints = user.learningPoints || 0;

    // Badges checks:
    // 🥉 Premier cours terminé
    if (lessonsCompleted.length >= 1 && !badgesObtained.includes("badge_first_lesson")) {
      badgesObtained.push("badge_first_lesson");
    }
    // 🥈 10 cours terminés
    if (lessonsCompleted.length >= 10 && !badgesObtained.includes("badge_10_lessons")) {
      badgesObtained.push("badge_10_lessons");
    }
    // 🥇 50 cours terminés
    if (lessonsCompleted.length >= 50 && !badgesObtained.includes("badge_50_lessons")) {
      badgesObtained.push("badge_50_lessons");
    }

    // Expert Crypto, Expert Finance, Expert Immobilier are gained upon completing respective final quizzes
    // Streaks 30 days
    if ((user.learningStreak || 1) >= 30 && !badgesObtained.includes("badge_streak_30")) {
      badgesObtained.push("badge_streak_30");
    }

    user.badgesObtained = badgesObtained;

    // Level formula: Level = Floor(Points / 100) + 1, capped at 100
    const calculatedLevel = Math.min(100, Math.floor(learningPoints / 100) + 1);
    user.learningLevel = calculatedLevel;
  };

  // 1. Get Courses List
  app.get("/api/learning/courses", (req, res) => {
    try {
      const coursesFile = path.join(process.cwd(), "courses.json");
      if (fs.existsSync(coursesFile)) {
        const data = fs.readFileSync(coursesFile, "utf-8");
        return res.status(200).json(JSON.parse(data));
      }
      return res.status(404).json({ error: "Fichier de cours introuvable." });
    } catch (err) {
      console.error("Error reading courses:", err);
      return res.status(500).json({ error: "Erreur lors de la lecture des cours." });
    }
  });

  // 2. Get Learning Profile Status
  app.get("/api/learning/status", authenticateToken, (req, res) => {
    const user = req.body.user as DBUser;
    
    // Initialize properties safely
    user.learningPoints = user.learningPoints ?? 0;
    user.learningStreak = user.learningStreak ?? 1;
    user.learningLevel = user.learningLevel ?? 1;
    user.learningTime = user.learningTime ?? 0;
    user.lessonsCompleted = user.lessonsCompleted ?? [];
    user.badgesObtained = user.badgesObtained ?? [];
    user.learningHistory = user.learningHistory ?? [];
    user.activeLessonId = user.activeLessonId ?? null;
    user.activeLessonStartedAt = user.activeLessonStartedAt ?? null;
    user.bypassTimeCheck = user.bypassTimeCheck ?? false;

    updateLearningBadgesAndLevels(user);

    res.status(200).json({
      success: true,
      learning: {
        points: user.learningPoints,
        streak: user.learningStreak,
        level: user.learningLevel,
        timeSpent: user.learningTime,
        lessonsCompleted: user.lessonsCompleted,
        badgesObtained: user.badgesObtained,
        history: user.learningHistory,
        activeLessonId: user.activeLessonId,
        activeLessonStartedAt: user.activeLessonStartedAt,
        bypassTimeCheck: user.bypassTimeCheck
      }
    });
  });

  // 3. Start Lesson Timer
  app.post("/api/learning/start-lesson", authenticateToken, (req, res) => {
    const { lessonId } = req.body;
    const user = req.body.user as DBUser;

    if (!lessonId) {
      return res.status(400).json({ error: "L'identifiant de la leçon est requis." });
    }

    const users = readDB();
    const userIdx = users.findIndex((u) => u.id === user.id);
    if (userIdx === -1) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    users[userIdx].activeLessonId = lessonId;
    users[userIdx].activeLessonStartedAt = Date.now();

    writeDB(users);
    res.status(200).json({ 
      success: true, 
      activeLessonId: lessonId, 
      startedAt: users[userIdx].activeLessonStartedAt 
    });
  });

  // 4. Complete Lesson & Quiz
  app.post("/api/learning/complete-lesson", authenticateToken, (req, res) => {
    const { lessonId, score } = req.body;
    const user = req.body.user as DBUser;

    if (!lessonId) {
      return res.status(400).json({ error: "L'identifiant de la leçon est requis." });
    }

    const users = readDB();
    const userIdx = users.findIndex((u) => u.id === user.id);
    if (userIdx === -1) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    const currentUser = users[userIdx];
    
    // Initialize learning fields
    currentUser.learningPoints = currentUser.learningPoints ?? 0;
    currentUser.learningStreak = currentUser.learningStreak ?? 1;
    currentUser.learningLevel = currentUser.learningLevel ?? 1;
    currentUser.learningTime = currentUser.learningTime ?? 0;
    currentUser.lessonsCompleted = currentUser.lessonsCompleted ?? [];
    currentUser.badgesObtained = currentUser.badgesObtained ?? [];
    currentUser.learningHistory = currentUser.learningHistory ?? [];
    currentUser.bypassTimeCheck = currentUser.bypassTimeCheck ?? false;

    // Security check: Check lesson started state and elapsed time
    // Require 5 minutes (300 seconds), unless bypassTimeCheck is active for easy developer testing
    const startTime = currentUser.activeLessonStartedAt;
    const activeId = currentUser.activeLessonId;

    if (!currentUser.bypassTimeCheck) {
      if (!startTime || activeId !== lessonId) {
        return res.status(400).json({ 
          error: "Veuillez d'abord démarrer la leçon de manière réglementaire. La lecture et l'apprentissage actif sont obligatoires." 
        });
      }

      const elapsedSeconds = (Date.now() - startTime) / 1000;
      const minSecondsRequired = 5 * 60; // 5 minutes standard requirement
      if (elapsedSeconds < minSecondsRequired) {
        const remainingSeconds = Math.ceil(minSecondsRequired - elapsedSeconds);
        const minutesLeft = Math.floor(remainingSeconds / 60);
        const secondsLeft = remainingSeconds % 60;
        return res.status(403).json({ 
          error: `Temps d'apprentissage insuffisant. Pour éviter la fraude, vous devez étudier le contenu pendant au moins 5 minutes. Temps restant : ${minutesLeft}m ${secondsLeft}s.`,
          remainingSeconds
        });
      }
    }

    // Check score threshold (Quiz score must be >= 70%)
    const passed = score >= 70;
    if (!passed) {
      return res.status(400).json({ 
        error: `Votre score au quiz (${score}%) est inférieur au seuil requis de 70%. Veuillez réviser le cours et recommencer.` 
      });
    }

    // Verify if lesson was already completed to prevent double-claiming
    const isAlreadyCompleted = currentUser.lessonsCompleted.includes(lessonId);
    let pointsAwarded = 0;

    if (!isAlreadyCompleted) {
      pointsAwarded = 20;
      currentUser.learningPoints += pointsAwarded;
      currentUser.lessonsCompleted.push(lessonId);
      
      // Increment total study time (+5 minutes)
      currentUser.learningTime += 5;

      // Add learning event transaction history
      const currentDateStr = new Date().toISOString().slice(0, 16).replace("T", " ");
      currentUser.learningHistory.unshift({
        id: `LERN-TX-${Math.floor(Math.random() * 90000) + 10000}`,
        type: "lesson_completed",
        label: "Leçon Validée",
        points: pointsAwarded,
        lessonId: lessonId,
        date: currentDateStr,
        description: `Réussite du cours et quiz final. +20 Points`
      });

      // Update badges and level
      updateLearningBadgesAndLevels(currentUser);
    }

    // Reset active lesson timer states
    currentUser.activeLessonId = null;
    currentUser.activeLessonStartedAt = null;

    writeDB(users);

    const { passwordHash, passwordSalt, ...safeProfile } = currentUser;
    res.status(200).json({
      success: true,
      profile: safeProfile,
      pointsAwarded,
      isAlreadyCompleted,
      learning: {
        points: currentUser.learningPoints,
        streak: currentUser.learningStreak,
        level: currentUser.learningLevel,
        timeSpent: currentUser.learningTime,
        lessonsCompleted: currentUser.lessonsCompleted,
        badgesObtained: currentUser.badgesObtained,
        history: currentUser.learningHistory,
        bypassTimeCheck: currentUser.bypassTimeCheck
      }
    });
  });

  // 5. Complete Final Course Quiz & Grant Certificate
  app.post("/api/learning/complete-final-quiz", authenticateToken, (req, res) => {
    const { courseId, score, badgeId, badgeLabel } = req.body;
    const user = req.body.user as DBUser;

    if (!courseId || score === undefined) {
      return res.status(400).json({ error: "L'identifiant du cours et le score sont requis." });
    }

    if (score < 70) {
      return res.status(400).json({ error: "Score insuffisant. 70% de réussite requis pour la certification." });
    }

    const users = readDB();
    const userIdx = users.findIndex((u) => u.id === user.id);
    if (userIdx === -1) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    const currentUser = users[userIdx];
    currentUser.learningPoints = currentUser.learningPoints ?? 0;
    currentUser.lessonsCompleted = currentUser.lessonsCompleted ?? [];
    currentUser.badgesObtained = currentUser.badgesObtained ?? [];
    currentUser.learningHistory = currentUser.learningHistory ?? [];

    const alreadyCertified = currentUser.badgesObtained.includes(badgeId);
    let pointsAwarded = 0;

    if (!alreadyCertified) {
      pointsAwarded = 100; // Final certifications give 100 points bonus!
      currentUser.learningPoints += pointsAwarded;
      currentUser.badgesObtained.push(badgeId);

      const currentDateStr = new Date().toISOString().slice(0, 16).replace("T", " ");
      currentUser.learningHistory.unshift({
        id: `LERN-TX-${Math.floor(Math.random() * 90000) + 10000}`,
        type: "certification",
        label: "Certification d'Élite",
        points: pointsAwarded,
        courseId: courseId,
        date: currentDateStr,
        description: `Obtention de la certification ${badgeLabel}. +100 Points`
      });

      updateLearningBadgesAndLevels(currentUser);
    }

    writeDB(users);

    const { passwordHash, passwordSalt, ...safeProfile } = currentUser;
    res.status(200).json({
      success: true,
      profile: safeProfile,
      pointsAwarded,
      alreadyCertified,
      learning: {
        points: currentUser.learningPoints,
        streak: currentUser.learningStreak,
        level: currentUser.learningLevel,
        timeSpent: currentUser.learningTime,
        lessonsCompleted: currentUser.lessonsCompleted,
        badgesObtained: currentUser.badgesObtained,
        history: currentUser.learningHistory,
        bypassTimeCheck: currentUser.bypassTimeCheck
      }
    });
  });

  // 6. Convert Points to F CFA
  app.post("/api/learning/convert", authenticateToken, (req, res) => {
    const { pointsToConvert } = req.body;
    const user = req.body.user as DBUser;

    if (!pointsToConvert || isNaN(pointsToConvert) || pointsToConvert < 500) {
      return res.status(400).json({ error: "Le montant minimum de conversion est de 500 Points." });
    }

    const users = readDB();
    const userIdx = users.findIndex((u) => u.id === user.id);
    if (userIdx === -1) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    const currentUser = users[userIdx];
    currentUser.learningPoints = currentUser.learningPoints ?? 0;

    if (currentUser.learningPoints < pointsToConvert) {
      return res.status(400).json({ error: `Solde de points insuffisant. Vous disposez de ${currentUser.learningPoints} points.` });
    }

    // Convert: 1 Point = 30 FCFA
    const fCFAAmount = pointsToConvert * 30;

    // Deduct points
    currentUser.learningPoints -= pointsToConvert;
    // Credit main wallet balance
    currentUser.balance += fCFAAmount;

    const currentDateStr = new Date().toISOString().slice(0, 16).replace("T", " ");

    // Add financial ledger transaction
    currentUser.transactions.unshift({
      id: `TX-LERN-CONV-${Math.floor(Math.random() * 90000) + 10000}`,
      type: "reward",
      typeLabel: "Conversion Points",
      amount: fCFAAmount,
      date: currentDateStr,
      status: "success",
      description: `Conversion de ${pointsToConvert} Points Académie en F CFA.`
    });

    // Add to learning history
    currentUser.learningHistory = currentUser.learningHistory ?? [];
    currentUser.learningHistory.unshift({
      id: `LERN-TX-${Math.floor(Math.random() * 90000) + 10000}`,
      type: "conversion",
      label: "Conversion de Points",
      points: -pointsToConvert,
      fCFA: fCFAAmount,
      date: currentDateStr,
      description: `Retrait et conversion de ${pointsToConvert} pts en ${fCFAAmount} F CFA.`
    });

    writeDB(users);

    const { passwordHash, passwordSalt, ...safeProfile } = currentUser;
    res.status(200).json({
      success: true,
      profile: safeProfile,
      convertedAmount: fCFAAmount,
      learning: {
        points: currentUser.learningPoints,
        streak: currentUser.learningStreak,
        level: currentUser.learningLevel,
        timeSpent: currentUser.learningTime,
        lessonsCompleted: currentUser.lessonsCompleted,
        badgesObtained: currentUser.badgesObtained,
        history: currentUser.learningHistory,
        bypassTimeCheck: currentUser.bypassTimeCheck
      }
    });
  });

  // 7. Admin Endpoint: Fetch all statistics
  app.get("/api/learning/admin/stats", authenticateToken, (req, res) => {
    const users = readDB();
    
    // Aggregate data
    const totalUsers = users.length;
    let totalPointsAwarded = 0;
    let totalPointsConverted = 0;
    let totalLessonsCompletedCount = 0;
    const usersLeaderboard: any[] = [];

    users.forEach((u) => {
      const pts = u.learningPoints || 0;
      const history = u.learningHistory || [];
      const completed = u.lessonsCompleted || [];
      
      let converted = 0;
      history.forEach((h: any) => {
        if (h.type === 'conversion') {
          converted += Math.abs(h.points);
        }
      });

      totalPointsAwarded += (pts + converted);
      totalPointsConverted += converted;
      totalLessonsCompletedCount += completed.length;

      usersLeaderboard.push({
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        points: pts,
        lessonsCount: completed.length,
        level: u.learningLevel || 1,
        streak: u.learningStreak || 1,
        timeSpent: u.learningTime || 0
      });
    });

    // Sort leaderboard
    usersLeaderboard.sort((a, b) => b.points - a.points);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalPointsAwarded,
        totalPointsConverted,
        totalLessonsCompletedCount,
        leaderboard: usersLeaderboard
      }
    });
  });

  // 8. Admin Endpoint: Modify lessons / Add courses
  app.post("/api/learning/admin/update-courses", authenticateToken, (req, res) => {
    const { courses } = req.body;
    if (!courses || !Array.isArray(courses)) {
      return res.status(400).json({ error: "Données de cours invalides." });
    }

    try {
      const coursesFile = path.join(process.cwd(), "courses.json");
      fs.writeFileSync(coursesFile, JSON.stringify(courses, null, 2));
      res.status(200).json({ success: true, message: "Les cours ont été mis à jour avec succès !" });
    } catch (err) {
      console.error("Error writing courses:", err);
      res.status(500).json({ error: "Erreur lors de l'enregistrement des cours." });
    }
  });

  // 9. Admin Endpoint: Toggle bypass timer
  app.post("/api/learning/admin/toggle-bypass", authenticateToken, (req, res) => {
    const user = req.body.user as DBUser;
    const users = readDB();
    const userIdx = users.findIndex((u) => u.id === user.id);
    if (userIdx === -1) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    const currentSetting = users[userIdx].bypassTimeCheck ?? false;
    users[userIdx].bypassTimeCheck = !currentSetting;

    writeDB(users);
    res.status(200).json({ 
      success: true, 
      bypassTimeCheck: users[userIdx].bypassTimeCheck,
      message: users[userIdx].bypassTimeCheck 
        ? "Mode Démo activé : Temps minimum de 5 minutes désactivé pour faciliter vos tests !" 
        : "Mode Réel activé : Temps minimum réglementaire de 5 minutes rétabli."
    });
  });

  // 10. Action: Trigger daily connection reward (for learning tab checkin)
  app.post("/api/learning/claim-daily-connect", authenticateToken, (req, res) => {
    const user = req.body.user as DBUser;
    const users = readDB();
    const userIdx = users.findIndex((u) => u.id === user.id);
    if (userIdx === -1) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    const currentUser = users[userIdx];
    currentUser.learningPoints = currentUser.learningPoints ?? 0;
    currentUser.learningStreak = currentUser.learningStreak ?? 1;
    currentUser.learningHistory = currentUser.learningHistory ?? [];

    const bonusPoints = 15;
    currentUser.learningPoints += bonusPoints;
    currentUser.learningStreak += 1;

    const currentDateStr = new Date().toISOString().slice(0, 16).replace("T", " ");
    currentUser.learningHistory.unshift({
      id: `LERN-TX-${Math.floor(Math.random() * 90000) + 10000}`,
      type: "daily_reward",
      label: "Récompense de Connexion",
      points: bonusPoints,
      date: currentDateStr,
      description: `Présence quotidienne validée ! Série : ${currentUser.learningStreak} jours.`
    });

    updateLearningBadgesAndLevels(currentUser);

    writeDB(users);

    const { passwordHash, passwordSalt, ...safeProfile } = currentUser;
    res.status(200).json({
      success: true,
      profile: safeProfile,
      pointsAwarded: bonusPoints,
      learning: {
        points: currentUser.learningPoints,
        streak: currentUser.learningStreak,
        level: currentUser.learningLevel,
        timeSpent: currentUser.learningTime,
        lessonsCompleted: currentUser.lessonsCompleted,
        badgesObtained: currentUser.badgesObtained,
        history: currentUser.learningHistory,
        bypassTimeCheck: currentUser.bypassTimeCheck
      }
    });
  });

  // Initialize DB on server start
  readDB();

  // Vite development server / production bundler setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
