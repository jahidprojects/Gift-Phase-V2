import React, { useState, useEffect, useMemo, useRef, memo, Component } from 'react';
import WebApp from '@twa-dev/sdk';
import { useTonConnect } from './hooks/useTonConnect';
import { auth, db } from './firebase';
import { 
  onAuthStateChanged, 
  signInAnonymously,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  updateDoc, 
  collection, 
  query, 
  orderBy, 
  limit,
  serverTimestamp,
  increment,
  arrayUnion,
  getDocFromServer,
  writeBatch,
  getDocs
} from 'firebase/firestore';

// Validate Connection to Firestore
const testConnection = async () => {
  try {
    await getDocFromServer(doc(db, '_connection_test', 'status'));
    console.log("Firebase Connection: Success (giftphasenew)");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Firebase Connection Error: Please check if Firestore is enabled in giftphasenew.");
    }
  }
};
testConnection();
import { 
  Trophy, 
  Zap, 
  Pencil, 
  ArrowUp, 
  Store, 
  Gamepad2, 
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MoreVertical,
  X,
  Star,
  Settings,
  User,
  UserPlus,
  Bolt,
  Medal,
  Gift,
  Wallet,
  Save,
  Copy,
  Share2,
  History,
  Link,
  ShieldAlert,
  ArrowDownCircle,
  ArrowUpCircle,
  Plus,
  Globe,
  Twitter,
  Youtube,
  Send,
  Heart,
  Users,
  Search,
  CheckSquare,
  BarChart2,
  Coins,
  MessageSquare,
  Trash2,
  ExternalLink
} from 'lucide-react';

/**
 * GIFT PHASE V2 - STABLE VERSION
 * Includes: Carrom-Style Physics, Correct Nav Alignment, 
 * Redesigned Task Center, Persistent Winner Popup, 
 * and White 3D Profile Buttons.
 */

// Configuration Constants
const PLAYER_PALETTE = [
  { main: '#E11D48', light: '#FF8BA0', accent: '#FFBDC9' }, 
  { main: '#C026D3', light: '#F7A7FF', accent: '#FBD1FF' }, 
  { main: '#7C3AED', light: '#D2BDFF', accent: '#E9DFFF' }, 
  { main: '#2563EB', light: '#A5C9FF', accent: '#D1E3FF' }, 
  { main: '#0891B2', light: '#86EFFF', accent: '#C2F7FF' }, 
  { main: '#059669', light: '#8BF5CC', accent: '#C4FCE8' }, 
  { main: '#65A30D', light: '#D9FF9E', accent: '#EDFFD1' }, 
  { main: '#D97706', light: '#FFE08A', accent: '#FFF0C2' }, 
  { main: '#EA580C', light: '#FFC89E', accent: '#FFE4D1' }, 
  { main: '#4F46E5', light: '#BCC3FF', accent: '#DEE1FF' },
];

const DuckIcon = ({ size = 16, className = "" }) => (
  <div 
    style={{ 
      width: size, 
      height: size, 
      minWidth: size, 
      minHeight: size,
      backgroundImage: 'url(https://i.ibb.co/KxLhYKxW/Picsart-26-04-09-21-58-38-017.png)',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    }} 
    className={`inline-flex shrink-0 transition-transform duration-200 hover:scale-110 ${className}`}
  />
);

const TonIcon = ({ size = 16, className = "" }) => (
  <div 
    style={{ 
      width: size, 
      height: size, 
      minWidth: size, 
      minHeight: size,
      backgroundImage: 'url(https://i.ibb.co/YBJbBvgw/Picsart-26-04-09-22-01-10-341.png)',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    }} 
    className={`inline-flex shrink-0 transition-transform duration-200 hover:scale-110 ${className}`}
  />
);

const PROFILE_FRAMES = [
  { id: 'none', name: 'Default', price: 0, color: 'transparent' },
];

const ProfileFrame = ({ frameId, children, className = "w-full h-full", shape = "circle" }) => {
  const frame = PROFILE_FRAMES.find(f => f.id === frameId);
  const radius = shape === 'circle' ? 'rounded-full' : 'rounded-[32px]';
  
  if (!frame || frameId === 'none') return <div className={`${className} ${radius} overflow-hidden`}>{children}</div>;
  
  return (
    <div className={`relative ${className} flex items-center justify-center p-[1px]`}>
      {/* Halo Glow */}
      <div 
        className={`absolute inset-0 ${radius} z-0 ${(frame as any).animate || ''} blur-[4px] opacity-90 overflow-hidden`} 
        style={{ 
          background: (frame as any).gradient || (frame as any).color,
          boxShadow: (frame as any).shadow || `0 0 35px ${(frame as any).color}`,
        }}
      >
        {(frame as any).crypto && (
          <div className="absolute inset-0 pointer-events-none opacity-70">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className="absolute text-[14px] font-black animate-coin-float"
                style={{ 
                  left: `${Math.random() * 100}%`, 
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${4 + Math.random() * 4}s`,
                  color: 'white'
                }}
              >
                {(frame as any).crypto}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Inner Frame Glow */}
      <div className={`absolute inset-[1px] ${radius} z-[1] bg-gradient-to-br from-white/40 to-transparent pointer-events-none opacity-50`}></div>

      <div className={`w-[calc(100%-8px)] h-[calc(100%-8px)] ${radius} overflow-hidden relative z-10 bg-[#050505] ring-1 ring-white/20 shadow-inner`}>
        {children}
      </div>
    </div>
  );
};

const FLAGS = ['🇺🇸', '🇷🇺', '🇮🇷', '🇩🇪'];
const LANGUAGES = ['en', 'ru', 'fa', 'de'];

const TRANSLATIONS = {
  en: {
    arena: 'Arena',
    tasks: 'Tasks',
    rank: 'Rank',
    profile: 'Profile',
    shop: 'Shop',
    totalPool: 'Total Pool',
    startingIn: 'Starting in',
    players: 'Players',
    allIn: 'All-in',
    connectWallet: 'Connect Wallet',
    deposit: 'Deposit',
    withdrawal: 'Withdrawal',
    duckBalance: 'DUCK Balance',
    tonBalance: 'TON Balance',
    inviteFriends: "Invite friends and earn 10% of their spending TON",
    copy: 'Copy',
    share: 'Share',
    recentActivity: 'Recent Activity',
    topWin: 'Top Win',
    lastWin: 'Last Win',
    waiting: 'Waiting for Players...',
    taskCenter: 'Task Center',
    completeTasks: 'Complete tasks and Earn Rewards',
    daily: 'Daily',
    achievements: 'Achievements',
    partners: 'Partner',
    leaderboard: 'Leaderboard',
    top100: 'Top 100 Players by DUCK Volume',
    wins: 'Wins',
    comingSoon: 'Shop coming soon'
  },
  ru: {
    arena: 'Арена',
    tasks: 'Задания',
    rank: 'Ранг',
    profile: 'Профиль',
    shop: 'Магазин',
    totalPool: 'Общий пул',
    startingIn: 'Начало через',
    players: 'Игроки',
    allIn: 'Ва-банк',
    connectWallet: 'Подключить кошелек',
    deposit: 'Депозит',
    withdrawal: 'Вывод',
    duckBalance: 'Баланс DUCK',
    tonBalance: 'Баланс TON',
    inviteFriends: 'Приглашайте друзей и получайте 10% от их трат TON',
    copy: 'Копировать',
    share: 'Поделиться',
    recentActivity: 'Последние действия',
    topWin: 'Топ выигрыш',
    lastWin: 'Посл. выигрыш',
    waiting: 'Ожидание игроков...',
    taskCenter: 'Центр заданий',
    completeTasks: 'Выполняйте задания и получайте награды',
    daily: 'Ежедневно',
    achievements: 'Достижения',
    partners: 'Партнеры',
    leaderboard: 'Лидерборд',
    top100: 'Топ 100 игроков по объему DUCK',
    wins: 'Побед',
    comingSoon: 'Магазин скоро'
  },
  fa: {
    arena: 'میدان',
    tasks: 'وظایف',
    rank: 'رتبه',
    profile: 'پروفایل',
    shop: 'فروشگاه',
    totalPool: 'مجموع استخر',
    startingIn: 'شروع در',
    players: 'بازیکنان',
    allIn: 'همه موجودی',
    connectWallet: 'اتصال کیف پول',
    deposit: 'واریز',
    withdrawal: 'برداشت',
    duckBalance: 'موجودی DUCK',
    tonBalance: 'موجودی TON',
    inviteFriends: 'دوستان خود را دعوت کنید و ۱۰٪ از هزینه‌های TON آن‌ها را دریافت کنید',
    copy: 'کپی',
    share: 'اشتراک‌گذاری',
    recentActivity: 'فعالیت‌های اخیر',
    topWin: 'بیشترین برد',
    lastWin: 'آخرین برد',
    waiting: 'در انتظار بازیکنان...',
    taskCenter: 'مرکز وظایف',
    completeTasks: 'وظایف را انجام دهید و پاداش بگیرید',
    daily: 'روزانه',
    achievements: 'دستاوردها',
    partners: 'همکاران',
    leaderboard: 'جدول امتیازات',
    top100: '۱۰۰ بازیکن برتر بر اساس حجم DUCK',
    wins: 'بردها',
    comingSoon: 'فروشگاه به زودی'
  },
  de: {
    arena: 'Arena',
    tasks: 'Aufgaben',
    rank: 'Rang',
    profile: 'Profil',
    shop: 'Shop',
    totalPool: 'Gesamtpool',
    startingIn: 'Startet in',
    players: 'Spieler',
    allIn: 'All-in',
    connectWallet: 'Wallet verbinden',
    deposit: 'Einzahlung',
    withdrawal: 'Auszahlung',
    duckBalance: 'DUCK Guthaben',
    tonBalance: 'TON Guthaben',
    inviteFriends: 'Freunde einladen und 10% ihrer TON-Ausgaben verdienen',
    copy: 'Kopieren',
    share: 'Teilen',
    recentActivity: 'Letzte Aktivitäten',
    topWin: 'Top Gewinn',
    lastWin: 'Letzter Gewinn',
    waiting: 'Warten auf Spieler...',
    taskCenter: 'Aufgaben-Center',
    completeTasks: 'Aufgaben abschließen und Belohnungen verdienen',
    daily: 'Täglich',
    achievements: 'Erfolge',
    partners: 'Partner',
    leaderboard: 'Bestenliste',
    top100: 'Top 100 Spieler nach DUCK-Volumen',
    wins: 'Siege',
    comingSoon: 'Shop kommt bald'
  }
};

const GUEST_DATA = [];

const DAILY_TASKS = [
  { id: 'd1', title: 'Follow our Twitter', tonReward: 1000, duckReward: 50000, icon: <Twitter size={20} />, btn: 'Follow' },
  { id: 'd2', title: 'Subscribe YouTube', tonReward: 1000, duckReward: 50000, icon: <Youtube size={20} />, btn: 'Subscribe' },
  { id: 'd3', title: 'Visit Website', tonReward: 500, duckReward: 25000, icon: <Globe size={20} />, btn: 'Visit' },
  { id: 'd4', title: 'Join Social Group', tonReward: 1000, duckReward: 50000, icon: <Send size={20} />, btn: 'Join' },
  { id: 'd5', title: 'Join News Channel', tonReward: 1000, duckReward: 50000, icon: <Send size={20} />, btn: 'Join' },
];

const ACHIEVEMENTS = [
  { id: 'a1', title: 'Play 50 PvP Games', goal: 50, current: 50, tonReward: 2000, duckReward: 100000, btn: 'Claim' },
  { id: 'a2', title: 'Invite 50 Friends', goal: 50, current: 5, tonReward: 10000, duckReward: 500000, btn: 'Claim' },
  { id: 'a3', title: 'Win 50 Games', goal: 50, current: 8, tonReward: 4000, duckReward: 200000, btn: 'Claim' },
  { id: 'a4', title: 'Deposit 1 TON', goal: 1, current: 1, tonReward: 2000, duckReward: 100000, btn: 'Claim' },
  { id: 'a5', title: 'Deposit 5 TON', goal: 5, current: 0, tonReward: 10000, duckReward: 500000, btn: 'Claim' },
  { id: 'a6', title: 'Play 100 Games', goal: 100, current: 12, tonReward: 5000, duckReward: 250000, btn: 'Claim' },
  { id: 'a7', title: 'Win 100 Games', goal: 100, current: 8, tonReward: 10000, duckReward: 500000, btn: 'Claim' },
];

const PARTNER_TASKS = [
  { id: 'p1', title: 'Follow Biz Tycoon', tonReward: 1000, duckReward: 50000, type: 'channel', btn: 'Join' },
  { id: 'p2', title: 'Start Biz Tycoon', tonReward: 1000, duckReward: 50000, type: 'start', btn: 'Start' },
  { id: 'p3', title: 'Play Biz Tycoon', tonReward: 1500, duckReward: 75000, type: 'game', btn: 'Play' },
  { id: 'p4', title: 'Complete Level 3', tonReward: 2000, duckReward: 100000, type: 'game', btn: 'Complete' },
];

const LEADERBOARD_DATA = [];

const ACTIVITIES = [
  { type: 'bid', val: <span className="flex items-center gap-1">10.00 <DuckIcon size={14} /></span>, date: '2 mins ago', icon: <Bolt size={16} /> },
  { type: 'invite', val: '@monk joined', date: '1 hour ago', icon: <UserPlus size={16} /> },
  { type: 'deposit', val: '+5.0 TON', date: 'Yesterday', icon: <ArrowDownCircle size={16} /> },
  { type: 'withdraw', val: '-2.0 TON', date: '2 days ago', icon: <ArrowUpCircle size={16} /> },
];

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/identicon/svg?seed=User";

const PROMO_BANNERS = [
  { id: 1, title: 'WIN BIG IN ARENA', desc: 'Predict the puck & win DUCK daily!', grad: 'from-[#0891B2] to-[#2563EB]', icon: <Gamepad2 size={32} />, action: 'arena' },
  { id: 2, title: 'INVITE & EARN 10%', desc: 'Get rewards for every friend spending.', grad: 'from-[#E11D48] to-[#C026D3]', icon: <UserPlus size={32} />, action: 'profile' },
  { id: 3, title: 'DUCK AIRDROP', desc: 'Complete all tasks to get 10 Million DUCK.', grad: 'from-[#7C3AED] to-[#4F46E5]', icon: <Gift size={32} />, action: 'scroll' },
];

// --- ERROR HANDLING ---
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  // We don't throw here to avoid crashing the app since we removed ErrorBoundary
}

// --- SKELETON LOADER ---
const Skeleton = ({ className, ...props }: { className?: string; [key: string]: any }) => (
  <div className={`animate-pulse bg-white/5 rounded-2xl ${className}`} {...props}></div>
);

// --- LOADING SCREEN ---
const LoadingScreen = ({ onPlay, onShare, onLike, isLiked, progress, isStarted }: { onPlay: () => void, onShare: () => void, onLike: () => void, isLiked: boolean, progress: number, isStarted: boolean }) => {
  return (
    <div className="fixed inset-0 z-[300] bg-[#60A5FA] flex flex-col items-center justify-center p-6 font-sans overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
      
      <div className="w-full max-w-xs bg-[#4F86C6]/80 backdrop-blur-md rounded-[40px] p-8 flex flex-col items-center shadow-2xl border border-white/20 relative z-10">
        <div className="w-24 h-24 mb-6 flex items-center justify-center overflow-hidden">
           <img src="https://i.ibb.co/KxLhYKxW/Picsart-26-04-09-21-58-38-017.png" className="w-full h-full object-contain" alt="Gift Phase V2" referrerPolicy="no-referrer" />
        </div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-8 text-center">Gift Phase V2</h1>
        
        <div className="flex gap-3 w-full">
          <button 
            onClick={onShare}
            className="flex-1 bg-white/20 hover:bg-white/30 py-4 rounded-2xl flex items-center justify-center gap-2 text-white font-black uppercase text-sm transition-all border-t border-white/20 shadow-lg active:translate-y-[1px]"
          >
            <Send size={18} className="rotate-[-20deg]" />
            Share
          </button>
          <button 
            onClick={onLike}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border-t shadow-lg active:translate-y-[1px] ${isLiked ? 'bg-red-500/20 border-red-500/30 text-red-500' : 'bg-white/20 hover:bg-white/30 border-white/20 text-white'}`}
          >
            <Heart size={20} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "animate-heart-pop" : ""} />
          </button>
        </div>
      </div>

      <div className="mt-12 w-full max-w-xs relative z-10">
        {!isStarted ? (
          <button 
            onClick={onPlay}
            className="w-full py-6 bg-gradient-to-b from-blue-400 to-blue-600 rounded-[32px] text-white font-black text-2xl uppercase tracking-widest shadow-[0_10px_0_#1E40AF] active:translate-y-[4px] active:shadow-[0_6px_0_#1E40AF] transition-all border-t border-white/30"
          >
            PLAY NOW
          </button>
        ) : (
          <div className="w-full h-20 bg-blue-900/30 rounded-[32px] overflow-hidden p-2 border border-white/10 shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-cyan-300 rounded-[24px] transition-all duration-100 flex items-center justify-center relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[slide_1s_linear_infinite]"></div>
              <span className="text-white font-black text-lg uppercase tracking-widest relative z-10">
                LOADING {Math.round(progress)}%
              </span>
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes slide {
          from { background-position: 0 0; }
          to { background-position: 20px 0; }
        }
      `}</style>
    </div>
  );
};

// --- BACKGROUND SPARKS COMPONENT ---
const SparkleBackground = memo(() => {
  const sparks = useMemo(() => {
    return Array.from({ length: 90 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 2.8 + 1.2,
      duration: Math.random() * 7 + 6,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.6 + 0.4
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {sparks.map(s => (
        <div 
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            bottom: '-20px',
            boxShadow: '0 0 12px 2px rgba(255, 255, 255, 0.5)',
            animation: `rise ${s.duration}s linear infinite, sparkle ${Math.random() * 2 + 1}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
            willChange: 'transform'
          }}
        />
      ))}
    </div>
  );
});

const StaticBoard = memo(({ territories, winner }) => {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full preserve-3d overflow-visible">
      <defs>
        {territories.map((t, i) => {
          const midP = (t.startP + t.endP) / 2;
          const jitter = (Math.sin(i * 133.7) * 15);
          const angle = ((midP + jitter) / 400) * 2 * Math.PI - Math.PI / 2;
          const x1 = 50, y1 = 50;
          const x2 = 50 + Math.cos(angle) * 55, y2 = 50 + Math.sin(angle) * 55;
          return (
            <React.Fragment key={`defs-${i}`}>
              <linearGradient id={`grad-${i}`} x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`} gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={t.color} stopOpacity="1" />
                <stop offset="60%" stopColor={t.lightColor} stopOpacity="0.95" />
                <stop offset="100%" stopColor={t.accentColor} stopOpacity="1" />
              </linearGradient>
              <clipPath id={`clip-${i}`}><polygon points={t.points} /></clipPath>
            </React.Fragment>
          );
        })}
      </defs>
      {territories.map((t, i) => (
        <g key={i}>
          <polygon points={t.points} fill={`url(#grad-${i})`} className="transition-all duration-700 ease-in-out" style={{ opacity: (winner && winner.username !== t.username) ? 0.15 : 1 }} />
          <g clipPath={`url(#clip-${i})`}>
            <foreignObject x={t.avatarPos.x - 7.5} y={t.avatarPos.y - 7.5} width="15" height="15">
              <div className="w-full h-full flex items-center justify-center transition-all duration-700 ease-in-out">
                <img src={t.avatar} className="w-full h-full rounded-full object-cover border-[1px] border-white/20 shadow-xl" alt="" referrerPolicy="no-referrer" />
              </div>
            </foreignObject>
          </g>
        </g>
      ))}
    </svg>
  );
});

const formatCurrency = (val) => {
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
  if (val >= 1000) return (val / 1000).toFixed(1) + 'K';
  return val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

const formatCurrencySimple = (val) => {
  if (val === undefined || val === null) return '0';
  const absoluteVal = Math.max(0, val);
  if (absoluteVal >= 1000000) return (absoluteVal / 1000000).toFixed(1) + 'M';
  if (absoluteVal >= 1000) return (absoluteVal / 1000).toFixed(1) + 'k';
  if (absoluteVal < 100 && absoluteVal > 0 && absoluteVal % 1 !== 0) {
    return absoluteVal.toFixed(2).replace(/\.?0+$/, '');
  }
  return Math.floor(absoluteVal).toLocaleString();
};

// --- UTILS ---
const safeStorage = {
  get: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  },
  set: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
  }
};

const AdminPanel = ({ 
  isAdmin, 
  user, 
  allTasks, 
  setIsAdminPanelOpen, 
  t,
  DuckIcon,
  TonIcon,
  handleResetAllBalances
}: { 
  isAdmin: boolean, 
  user: FirebaseUser | null, 
  allTasks: any[], 
  setIsAdminPanelOpen: (open: boolean) => void,
  t: any,
  DuckIcon: any,
  TonIcon: any,
  handleResetAllBalances: () => void
}) => {
  const [allUsers, setAllUsers] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [allPromoCodes, setAllPromoCodes] = useState([]);
  const [allReferralLinks, setAllReferralLinks] = useState([]);
  const [allWithdrawalOffers, setAllWithdrawalOffers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [adminTab, setAdminTab] = useState('users');
  const [taskFilter, setTaskFilter] = useState('daily');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isAddingPromo, setIsAddingPromo] = useState(false);
  const [isAddingReferral, setIsAddingReferral] = useState(false);
  const [isAddingWithdrawal, setIsAddingWithdrawal] = useState(false);

  useEffect(() => {
    if (!isAdmin || !user) return;
    
    const usersUnsub = onSnapshot(collection(db, 'users'), (snap) => {
      setAllUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    });

    const transUnsub = onSnapshot(query(collection(db, 'transactions'), orderBy('createdAt', 'desc'), limit(50)), (snap) => {
      setAllTransactions(snap.docs.map(d => d.data()));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'transactions');
    });

    const promoUnsub = onSnapshot(collection(db, 'promoCodes'), (snap) => {
      setAllPromoCodes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'promoCodes');
    });

    const referralUnsub = onSnapshot(collection(db, 'referralLinks'), (snap) => {
      setAllReferralLinks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'referralLinks');
    });

    const withdrawalUnsub = onSnapshot(collection(db, 'withdrawalOffers'), (snap) => {
      setAllWithdrawalOffers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'withdrawalOffers');
    });

    const analyticsUnsub = onSnapshot(doc(db, 'analytics', 'global'), (snap) => {
      if (snap.exists()) setAnalytics(snap.data());
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'analytics/global');
    });

    return () => { 
      usersUnsub(); 
      transUnsub(); 
      promoUnsub(); 
      referralUnsub(); 
      withdrawalUnsub(); 
      analyticsUnsub();
    };
  }, [isAdmin, user]);

  const filteredUsers = allUsers.filter(u => 
    u.username?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.uid?.includes(searchQuery) ||
    u.tgId?.toString().includes(searchQuery)
  );

  return (
    <div className="fixed inset-x-0 top-14 bottom-24 z-[500] bg-black/95 backdrop-blur-xl flex flex-col overflow-hidden rounded-t-[32px] border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-400/20 flex items-center justify-center">
            <Settings className="text-cyan-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase italic text-white">Admin Panel</h2>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">System Control Center</p>
          </div>
        </div>
        <button onClick={() => setIsAdminPanelOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto no-scrollbar border-b border-white/10 shrink-0 bg-white/5">
        {[
          { id: 'users', icon: <Users size={20} /> },
          { id: 'tasks', icon: <CheckSquare size={20} /> },
          { id: 'promo', icon: <Gift size={20} /> },
          { id: 'referral', icon: <Link size={20} /> },
          { id: 'analytics', icon: <BarChart2 size={20} /> },
          { id: 'withdrawal', icon: <Coins size={20} /> },
          { id: 'system', icon: <ShieldAlert size={20} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setAdminTab(tab.id)}
            className={`flex items-center justify-center px-4 py-5 border-b-2 transition-all shrink-0 ${
              adminTab === tab.id 
              ? 'border-cyan-400 text-cyan-400 bg-cyan-400/5' 
              : 'border-transparent text-white/40 hover:text-white/60'
            }`}
          >
            {tab.icon}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        {adminTab === 'users' && (
          <div className="space-y-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by username or UID..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-cyan-400/50 transition-all"
                />
              </div>
              <button 
                className="px-8 bg-rose-400 text-black font-black uppercase rounded-full shadow-lg active:translate-y-1 transition-all"
                onClick={() => {/* Search is already filtered by state, but this button matches the UI */}}
              >
                Search
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {filteredUsers.map((u, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedUserForEdit(u)}
                  className="p-4 bg-white/5 rounded-[24px] border border-white/5 flex flex-col gap-4 text-left hover:bg-white/10 transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} className="w-12 h-12 rounded-full border border-white/10" referrerPolicy="no-referrer" />
                      <div className="flex flex-col">
                        <span className="text-base font-black text-white">{u.username}</span>
                        <span className="text-[10px] text-white/30 font-mono">ID: {u.tgId || u.uid} • Rank: {u.wins > 100 ? 'Elite' : u.wins > 50 ? 'Pro' : 'Novice'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-black text-rose-400">{(u.balance || 0).toFixed(4)}</span>
                      <DuckIcon size={14} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Manage User Modal */}
        {selectedUserForEdit && (
          <div className="fixed inset-0 z-[600] bg-black/80 backdrop-blur-sm flex items-end justify-center p-4">
            <div className="w-full max-w-md bg-[#0a0a0a] rounded-[40px] border border-white/10 p-8 space-y-8 animate-in slide-in-from-bottom duration-300">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-white">Manage User</h3>
                <button onClick={() => setSelectedUserForEdit(null)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <X size={20} />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full border-2 border-rose-400/50 p-1">
                  <img src={selectedUserForEdit.avatar} className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-white">{selectedUserForEdit.username}</span>
                  <span className="text-sm font-bold text-white/30">{selectedUserForEdit.tgId || selectedUserForEdit.uid} ({selectedUserForEdit.username})</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Ads Viewed', value: selectedUserForEdit.adsViewed || 0, color: 'text-rose-400' },
                  { label: 'Refers', value: selectedUserForEdit.referralsCount || 0, color: 'text-rose-400' },
                  { label: 'Spins', value: selectedUserForEdit.spinsCount || 0, color: 'text-rose-400' },
                  { label: 'Promos Used', value: selectedUserForEdit.promosUsed || 0, color: 'text-rose-400' },
                  { label: 'Tasks Done', value: selectedUserForEdit.completedTasks?.length || 0, color: 'text-rose-400' },
                  { label: 'Withdrawals', value: selectedUserForEdit.withdrawalsCount || 0, color: 'text-rose-400' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center flex flex-col gap-1">
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest leading-tight">{stat.label}</span>
                    <span className={`text-lg font-black ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Deposit (DUCK)</label>
                  <input 
                    type="number" 
                    value={selectedUserForEdit.totalDeposited || 0}
                    onChange={(e) => setSelectedUserForEdit({ ...selectedUserForEdit, totalDeposited: parseFloat(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm font-black text-white focus:outline-none focus:border-rose-400/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Withdrawal (DUCK)</label>
                  <input 
                    type="number" 
                    value={selectedUserForEdit.totalWithdrawn || 0}
                    onChange={(e) => setSelectedUserForEdit({ ...selectedUserForEdit, totalWithdrawn: parseFloat(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm font-black text-white focus:outline-none focus:border-rose-400/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Referrals</label>
                  <input 
                    type="number" 
                    value={selectedUserForEdit.referralsCount || 0}
                    onChange={(e) => setSelectedUserForEdit({ ...selectedUserForEdit, referralsCount: parseInt(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm font-black text-white focus:outline-none focus:border-rose-400/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Balance (DUCK)</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <DuckIcon size={14} />
                    </div>
                    <input 
                      type="number" 
                      value={selectedUserForEdit.balance}
                      onChange={(e) => setSelectedUserForEdit({ ...selectedUserForEdit, balance: Math.max(0, Math.floor(parseFloat(e.target.value) || 0)) })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-10 pr-4 text-sm font-black text-white focus:outline-none focus:border-rose-400/50"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">TON Balance</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={selectedUserForEdit.tonBalance}
                    onChange={(e) => setSelectedUserForEdit({ ...selectedUserForEdit, tonBalance: Math.max(0, parseFloat(e.target.value) || 0) })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm font-black text-white focus:outline-none focus:border-rose-400/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Tier</label>
                  <div className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm font-black text-white flex items-center justify-center">
                    {selectedUserForEdit.wins > 100 ? 'Elite' : selectedUserForEdit.wins > 50 ? 'Pro' : 'Novice'}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Shop Purchases</label>
                <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 min-h-[60px] flex flex-wrap gap-2">
                  {selectedUserForEdit.shopPurchases?.length > 0 ? (
                    selectedUserForEdit.shopPurchases.map((item, idx) => (
                      <span key={idx} className="px-3 py-1 bg-rose-400/10 text-rose-400 text-[10px] font-black uppercase rounded-lg border border-rose-400/20">
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] font-black text-white/20 uppercase">No purchases yet</span>
                  )}
                </div>
              </div>

              <button 
                onClick={async () => {
                  try {
                    await updateDoc(doc(db, 'users', selectedUserForEdit.uid), {
                      balance: selectedUserForEdit.balance,
                      tonBalance: selectedUserForEdit.tonBalance,
                      totalDeposited: selectedUserForEdit.totalDeposited || 0,
                      totalWithdrawn: selectedUserForEdit.totalWithdrawn || 0,
                      referralsCount: selectedUserForEdit.referralsCount || 0
                    });
                    setSelectedUserForEdit(null);
                    WebApp.HapticFeedback.notificationOccurred('success');
                  } catch (error) {
                    console.error("Error updating user:", error);
                    WebApp.showAlert("Failed to update user.");
                  }
                }}
                className="w-full py-6 bg-rose-400 text-black font-black uppercase rounded-[32px] flex items-center justify-center gap-2 shadow-lg active:translate-y-1 transition-all"
              >
                <Bolt size={20} /> Save Changes
              </button>
            </div>
          </div>
        )}

        {adminTab === 'tasks' && (
          <div className="space-y-8">
            <button 
              onClick={() => {
                setSelectedTaskForEdit({
                  id: `task_${Date.now()}`,
                  title: '',
                  description: '',
                  duckReward: 0,
                  tonReward: 0,
                  type: 'daily',
                  verificationType: 'none',
                  link: '',
                  btn: 'Go',
                  requiredCount: 0,
                  color: '',
                  icon: ''
                });
                setIsAddingTask(true);
              }}
              className="w-full py-5 bg-rose-400 text-black font-black uppercase rounded-[24px] flex items-center justify-center gap-2 shadow-lg active:translate-y-1 transition-all"
            >
              <Plus size={20} /> Add New Task
            </button>

            {[
              { id: 'daily', label: 'Daily Tasks' },
              { id: 'achievement', label: 'Achievement' },
              { id: 'partner', label: 'Partner' }
            ].map(cat => (
              <div key={cat.id} className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-lg font-black text-white uppercase italic tracking-wider">{cat.label}</h3>
                  <span className="text-[10px] font-black text-white/20 uppercase">
                    {allTasks.filter(t => t.type === cat.id && !t.deleted).length} Tasks
                  </span>
                </div>
                <div className="space-y-3">
                  {allTasks.filter(t => t.type === cat.id && !t.deleted).map(task => (
                    <button 
                      key={task.id} 
                      onClick={() => {
                        setSelectedTaskForEdit(task);
                        setIsAddingTask(false);
                      }}
                      className="w-full p-5 bg-white/5 rounded-[24px] border border-white/5 flex items-center justify-between hover:bg-white/10 transition-all text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                          {(() => {
                            const title = (task.title || '').toLowerCase();
                            const link = (task.link || '').toLowerCase();
                            if (title.includes('deposit')) return <Wallet size={24} className="text-rose-400" />;
                            if (link.includes('t.me')) {
                              if (link.includes('bot')) return <Gamepad2 size={24} className="text-rose-400" />;
                              return <Send size={24} className="text-rose-400 rotate-[-20deg]" />;
                            }
                            return <CheckSquare size={24} className="text-rose-400" />;
                          })()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-base font-black text-white">{task.title}</span>
                          <div className="flex items-center gap-3 mt-1">
                            {task.duckReward > 0 && (
                              <div className="flex items-center gap-1 text-[11px] text-rose-400 font-black uppercase tracking-widest bg-rose-400/10 px-2 py-0.5 rounded-lg border border-rose-400/20">
                                {formatCurrency(task.duckReward)} <DuckIcon size={12} />
                              </div>
                            )}
                            {task.tonReward > 0 && (
                              <div className="flex items-center gap-1 text-[11px] text-rose-400 font-black uppercase tracking-widest bg-rose-400/10 px-2 py-0.5 rounded-lg border border-rose-400/20">
                                {formatCurrency(task.tonReward)} <TonIcon size={14} />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-black text-rose-400">{task.completedCount || 0}</div>
                          <div className="text-[8px] text-white/20 uppercase font-black">Claims</div>
                        </div>
                        <ChevronRight size={20} className="text-white/20" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Manage Task Modal */}
        {selectedTaskForEdit && (
          <div className="fixed inset-0 z-[600] bg-black/80 backdrop-blur-sm flex items-end justify-center p-4">
            <div className="w-full max-w-md bg-[#0a0a0a] rounded-[40px] border border-white/10 p-8 space-y-6 animate-in slide-in-from-bottom duration-300 overflow-y-auto max-h-[90vh] no-scrollbar">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-white">{isAddingTask ? 'Add New Task' : 'Manage Task'}</h3>
                <button onClick={() => setSelectedTaskForEdit(null)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Title</label>
                  <input 
                    type="text" 
                    placeholder="Display Title"
                    value={selectedTaskForEdit.title}
                    onChange={(e) => setSelectedTaskForEdit({ ...selectedTaskForEdit, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm font-black text-white focus:outline-none focus:border-rose-400/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Description</label>
                  <textarea 
                    placeholder="Task description..."
                    value={selectedTaskForEdit.description}
                    onChange={(e) => setSelectedTaskForEdit({ ...selectedTaskForEdit, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm font-bold text-white focus:outline-none focus:border-rose-400/50 min-h-[100px] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">DUCK Reward</label>
                    <input 
                      type="number" 
                      value={selectedTaskForEdit.duckReward || 0}
                      onChange={(e) => setSelectedTaskForEdit({ ...selectedTaskForEdit, duckReward: Math.floor(parseFloat(e.target.value) || 0) })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm font-black text-white focus:outline-none focus:border-rose-400/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">TON Reward</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={selectedTaskForEdit.tonReward || 0}
                      onChange={(e) => setSelectedTaskForEdit({ ...selectedTaskForEdit, tonReward: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm font-black text-white focus:outline-none focus:border-rose-400/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Category</label>
                  <select 
                    value={selectedTaskForEdit.type}
                    onChange={(e) => setSelectedTaskForEdit({ ...selectedTaskForEdit, type: e.target.value, verificationType: 'none' })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm font-black text-white focus:outline-none focus:border-rose-400/50 appearance-none"
                  >
                    <option value="daily">Daily Section</option>
                    <option value="achievement">Achievement Section</option>
                    <option value="partner">Partner Section</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Verification Type</label>
                  <select 
                    value={selectedTaskForEdit.verificationType}
                    onChange={(e) => setSelectedTaskForEdit({ ...selectedTaskForEdit, verificationType: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm font-black text-white focus:outline-none focus:border-rose-400/50 appearance-none"
                  >
                    {selectedTaskForEdit.type === 'achievement' ? (
                      <>
                        <option value="none">Select verification type</option>
                        <option value="referral">Invite friends</option>
                        <option value="leaderboard">Leaderboard position</option>
                        <option value="game">Game play required</option>
                        <option value="purchase">Shop Buy required</option>
                        <option value="win">Arena Match Win</option>
                        <option value="played">Arena Match played</option>
                      </>
                    ) : (
                      <>
                        <option value="none">No verification required</option>
                        <option value="channel">Verification with Channel</option>
                        <option value="group">Verification with Group</option>
                        <option value="bot">Telegram MiniApp</option>
                        <option value="ads">Ads Task (Adsgram)</option>
                      </>
                    )}
                  </select>
                </div>

                {selectedTaskForEdit.type === 'achievement' && selectedTaskForEdit.verificationType !== 'none' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">
                      {selectedTaskForEdit.verificationType === 'referral' ? 'Referrals Required' : 
                       selectedTaskForEdit.verificationType === 'purchase' ? 'Shop TON Spend Amount' :
                       'Required Count / Value'}
                    </label>
                    <input 
                      type="number" 
                      value={selectedTaskForEdit.requiredCount || 0}
                      onChange={(e) => setSelectedTaskForEdit({ ...selectedTaskForEdit, requiredCount: parseFloat(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm font-black text-white focus:outline-none focus:border-rose-400/50"
                    />
                  </div>
                )}

                {selectedTaskForEdit.type !== 'achievement' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Link / URL</label>
                    <input 
                      type="text" 
                      placeholder="https://t.me/..."
                      value={selectedTaskForEdit.link}
                      onChange={(e) => setSelectedTaskForEdit({ ...selectedTaskForEdit, link: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm font-bold text-white focus:outline-none focus:border-rose-400/50"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Button Text</label>
                  <input 
                    type="text" 
                    placeholder="Join, Follow, Play, etc."
                    value={selectedTaskForEdit.btn || ''}
                    onChange={(e) => setSelectedTaskForEdit({ ...selectedTaskForEdit, btn: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm font-black text-white focus:outline-none focus:border-rose-400/50"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                {!isAddingTask && (
                  <button 
                    onClick={() => {
                      WebApp.showConfirm("Delete this task?", async (confirmed) => {
                        if (confirmed) {
                          try {
                            await updateDoc(doc(db, 'tasks', selectedTaskForEdit.id), { deleted: true });
                            setSelectedTaskForEdit(null);
                            WebApp.HapticFeedback.notificationOccurred('warning');
                          } catch (e) { console.error(e); }
                        }
                      });
                    }}
                    className="flex-1 py-5 bg-white/5 text-red-400 font-black uppercase rounded-[24px] border border-red-400/20 active:translate-y-1 transition-all"
                  >
                    Delete
                  </button>
                )}
                <button 
                  onClick={async () => {
                    if (!selectedTaskForEdit.title || (!selectedTaskForEdit.duckReward && !selectedTaskForEdit.tonReward)) {
                      WebApp.showAlert("Please fill in Title and at least one reward.");
                      return;
                    }
                    try {
                      const taskData = {
                        ...selectedTaskForEdit,
                        createdAt: selectedTaskForEdit.createdAt || serverTimestamp()
                      };
                      await setDoc(doc(db, 'tasks', selectedTaskForEdit.id), taskData, { merge: true });
                      setSelectedTaskForEdit(null);
                      WebApp.HapticFeedback.notificationOccurred('success');
                    } catch (error) {
                      console.error("Error saving task:", error);
                      WebApp.showAlert("Failed to save task.");
                    }
                  }}
                  className="flex-[2] py-5 bg-rose-400 text-black font-black uppercase rounded-[24px] flex items-center justify-center gap-2 shadow-lg active:translate-y-1 transition-all"
                >
                  <Bolt size={20} /> Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {adminTab === 'analytics' && (
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Total Users', value: allUsers.length, color: 'text-white' },
              { label: 'Total DUCK', value: allUsers.reduce((acc, u) => acc + (u.balance || 0), 0).toFixed(1), color: 'text-cyan-400' },
              { label: 'Total Volume', value: allUsers.reduce((acc, u) => acc + (u.volume || 0), 0).toFixed(0), color: 'text-white' },
              { label: 'Active Today', value: analytics?.activeToday || 0, color: 'text-green-400' },
              { label: 'Joined Today', value: analytics?.joinedToday || 0, color: 'text-blue-400' },
              { label: 'Total Spins', value: analytics?.totalSpins || 0, color: 'text-purple-400' },
            ].map((stat, i) => (
              <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col gap-1">
                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{stat.label}</span>
                <span className={`text-xl font-black ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
          </div>
        )}

        {adminTab === 'promo' && (
          <div className="space-y-6">
            <button 
              onClick={() => {
                const code = prompt("Promo Code:");
                const reward = parseFloat(prompt("Reward (DUCK):") || "0");
                const supply = parseInt(prompt("Supply:") || "0");
                if (code && reward && supply) {
                  setDoc(doc(db, 'promoCodes', code), { code, reward, supply, claimedBy: [], createdAt: serverTimestamp() });
                }
              }}
              className="w-full py-4 bg-purple-500 text-white font-black uppercase rounded-2xl flex items-center justify-center gap-2 shadow-[0_5px_0_#7c3aed] active:translate-y-1 active:shadow-none transition-all"
            >
              <Plus size={20} /> Create Promo Code
            </button>

            <div className="space-y-3">
              {allPromoCodes.map(promo => (
                <div key={promo.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <Gift size={20} className="text-purple-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-white">{promo.code}</span>
                      <span className="text-[10px] text-white/30 uppercase font-black">{promo.reward} DUCK • {promo.claimedBy?.length || 0}/{promo.supply} Claimed</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => { 
                      WebApp.showConfirm("Delete promo?", (confirmed) => {
                        if (confirmed) updateDoc(doc(db, 'promoCodes', promo.id), { deleted: true });
                      });
                    }}
                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {adminTab === 'referral' && (
          <div className="space-y-6">
            <button 
              onClick={() => {
                const name = prompt("Partner Name:");
                if (name) {
                  const id = `ref_${Date.now()}`;
                  setDoc(doc(db, 'referralLinks', id), { id, name, joins: 0, ads: 0, revenue: 0, createdAt: serverTimestamp() });
                }
              }}
              className="w-full py-4 bg-blue-500 text-white font-black uppercase rounded-2xl flex items-center justify-center gap-2 shadow-[0_5px_0_#2563eb] active:translate-y-1 active:shadow-none transition-all"
            >
              <Plus size={20} /> Create Referral Link
            </button>

            <div className="space-y-3">
              {allReferralLinks.map(link => (
                <div key={link.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                        <ExternalLink size={20} className="text-blue-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-white">{link.name}</span>
                        <span className="text-[10px] text-white/30 font-mono">t.me/GiftPhaseBot?start={link.id}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => { 
                        WebApp.showConfirm("Delete link?", (confirmed) => {
                          if (confirmed) updateDoc(doc(db, 'referralLinks', link.id), { deleted: true });
                        });
                      }}
                      className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-black/20 p-2 rounded-xl text-center">
                      <div className="text-[8px] font-black text-white/30 uppercase">Joins</div>
                      <div className="text-xs font-black text-white">{link.joins || 0}</div>
                    </div>
                    <div className="bg-black/20 p-2 rounded-xl text-center">
                      <div className="text-[8px] font-black text-white/30 uppercase">Ads</div>
                      <div className="text-xs font-black text-white">{link.ads || 0}</div>
                    </div>
                    <div className="bg-black/20 p-2 rounded-xl text-center">
                      <div className="text-[8px] font-black text-white/30 uppercase">Rev</div>
                      <div className="text-xs font-black text-green-400">${(link.revenue || 0).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {adminTab === 'withdrawal' && (
          <div className="space-y-6">
            <button 
              onClick={() => {
                const amount = parseFloat(prompt("Withdrawal Amount (DUCK):") || "0");
                const price = parseFloat(prompt("Price (TON):") || "0");
                if (amount && price) {
                  const id = `with_${Date.now()}`;
                  setDoc(doc(db, 'withdrawalOffers', id), { id, amount, price, createdAt: serverTimestamp() });
                }
              }}
              className="w-full py-4 bg-green-500 text-white font-black uppercase rounded-2xl flex items-center justify-center gap-2 shadow-[0_5px_0_#059669] active:translate-y-1 active:shadow-none transition-all"
            >
              <Plus size={20} /> Create Withdrawal Offer
            </button>

            <div className="space-y-3">
              {allWithdrawalOffers.map(offer => (
                <div key={offer.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <Coins size={20} className="text-green-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-white">{offer.amount} DUCK</span>
                      <span className="text-[10px] text-white/30 uppercase font-black">{offer.price} TON</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => { 
                      WebApp.showConfirm("Delete offer?", (confirmed) => {
                        if (confirmed) updateDoc(doc(db, 'withdrawalOffers', offer.id), { deleted: true });
                      });
                    }}
                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {adminTab === 'system' && (
          <div className="space-y-6">
            <div className="p-6 bg-red-500/10 rounded-[32px] border border-red-500/20 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <ShieldAlert className="text-red-500" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase italic">Danger Zone</h3>
                  <p className="text-[10px] font-bold text-white/40 uppercase">Critical System Actions</p>
                </div>
              </div>
              
              <button 
                onClick={handleResetAllBalances}
                className="w-full py-4 bg-red-500 text-white font-black uppercase rounded-2xl flex items-center justify-center gap-2 shadow-[0_5px_0_#b91c1c] active:translate-y-1 active:shadow-none transition-all"
              >
                <Trash2 size={20} /> Reset All User Balances
              </button>
              <p className="text-[10px] text-center text-white/30 uppercase font-bold">This will set all users DUCK and TON balances to 0.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('arena');
  const [players, setPlayers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [status, setStatus] = useState('waiting'); 
  const [winner, setWinner] = useState(null);
  const [persistentWinner, setPersistentWinner] = useState(null);
  const [myBalance, setMyBalance] = useState(0);
  const [tonBalance, setTonBalance] = useState(0);
  const [popupTimeLeft, setPopupTimeLeft] = useState(5);
  const [completedTaskIds, setCompletedTaskIds] = useState([]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [langIdx, setLangIdx] = useState(0);
  const [promoIndex, setPromoIndex] = useState(0);
  const [taskCategory, setTaskCategory] = useState('daily');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [winners, setWinners] = useState([]);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);
  const [rankTab, setRankTab] = useState('players');
  const [isGameLoaded, setIsGameLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(() => safeStorage.get('giftphase_liked') === 'true');
  const [isLoadingStarted, setIsLoadingStarted] = useState(false);
  const [adminClickCount, setAdminClickCount] = useState(0);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [userData, setUserData] = useState<any>(null);
  const [verifyingTaskId, setVerifyingTaskId] = useState(null);
  const [waitTimer, setWaitTimer] = useState(0);
  const [isFrameSelectorOpen, setIsFrameSelectorOpen] = useState(false);
  const [customBid, setCustomBid] = useState<number | null>(null);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [welcomeReward, setWelcomeReward] = useState(0);
  const [referrerName, setReferrerName] = useState('');
  const [isClaimingWelcome, setIsClaimingWelcome] = useState(false);
  const [adTimers, setAdTimers] = useState<Record<string, number>>({});
  const [adReady, setAdReady] = useState<Record<string, boolean>>({});
  const processingTasksRef = useRef<Set<string>>(new Set());
  const [hasPlayedBefore, setHasPlayedBefore] = useState(() => {
    return safeStorage.get('giftphase_played') === 'true';
  });

  const { walletAddress, connected, tonConnectUI } = useTonConnect();

  const userUnsubRef = useRef<(() => void) | null>(null);

  // Firebase Auth & Profile Sync with Telegram Identity
  useEffect(() => {
    const tasksUnsub = onSnapshot(collection(db, 'tasks'), (snap) => {
      setAllTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'tasks');
    });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const tgUser = WebApp.initDataUnsafe?.user;
        const referrerId = WebApp.initDataUnsafe?.start_param;
        
        setUser(firebaseUser);
        const userRef = doc(db, 'users', firebaseUser.uid);
        
        if (userUnsubRef.current) userUnsubRef.current();
        userUnsubRef.current = onSnapshot(userRef, (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setUserData(data);
            setMyBalance(data.balance || 0);
            setTonBalance(data.tonBalance ?? data.puckBalance ?? 0);
            setCompletedTaskIds(data.completedTasks || []);
            
            // Welcome Bonus Logic
            if (!data.welcomeBonusClaimed) {
              const reward = referrerId ? 5000 : 3000;
              setWelcomeReward(reward);
              if (referrerId) {
                getDoc(doc(db, 'users', referrerId)).then(refSnap => {
                  if (refSnap.exists()) {
                    setReferrerName(refSnap.data().username || 'Someone');
                  }
                  setShowWelcomePopup(true);
                }).catch(() => {
                  setShowWelcomePopup(true);
                });
              } else {
                setShowWelcomePopup(true);
              }
            }

            const ADMIN_TG_IDS = [6686954447, 1678112785, 5968063026];
            const isTgAdmin = tgUser && ADMIN_TG_IDS.includes(tgUser.id);
            setIsAdmin(data.role === 'admin' || firebaseUser.email === 'jahidproject8@gmail.com' || isTgAdmin);
            
            // Sync TG ID if missing
            if (tgUser && !data.tgId) {
              updateDoc(userRef, { tgId: tgUser.id });
            }
          }
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
        });

        try {
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            // Sync TG name if changed
            if (tgUser && data.username !== `@${tgUser.username || tgUser.first_name}`) {
              updateDoc(userRef, {
                username: `@${tgUser.username || tgUser.first_name}`,
                avatar: tgUser.photo_url || data.avatar
              });
            }
          } else {
            // Create initial profile with 10 DUCK Bonus
            const initialData = {
              uid: firebaseUser.uid,
              tgId: tgUser?.id || null,
              username: tgUser ? `@${tgUser.username || tgUser.first_name}` : `User_${firebaseUser.uid.slice(0, 5)}`,
              avatar: tgUser?.photo_url || DEFAULT_AVATAR,
              balance: 10.0,
              tonBalance: 1000,
              wins: 0,
              volume: 0,
              completedTasks: [],
              referrer: referrerId || null,
              role: (firebaseUser.email === 'jahidproject8@gmail.com' || (tgUser && [6686954447, 1678112785, 5968063026].includes(tgUser.id))) ? 'admin' : 'user',
              createdAt: serverTimestamp(),
              selectedFrame: 'none',
              unlockedFrames: []
            };
            await setDoc(userRef, initialData);
            setMyBalance(10.0);
            setIsAdmin(initialData.role === 'admin');
            
            // If referred, we could add logic here to reward the referrer
            if (referrerId) {
              const refDoc = doc(db, 'users', referrerId);
              updateDoc(refDoc, {
                balance: increment(1.0), // 1 DUCK bonus for referrer
                referralsCount: increment(1)
              }).catch(() => {}); // Ignore if referrer doesn't exist
            }
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
        }
        setIsAuthReady(true);
      } else {
        signInAnonymously(auth).catch((err) => {
          console.error("Auth Error:", err);
          if (err.code === 'auth/admin-restricted-operation') {
            const msg = "CRITICAL: Anonymous Authentication is disabled or restricted.\n\nTo fix this:\n1. Go to Firebase Console > Authentication > Sign-in method.\n2. Enable 'Anonymous'.\n3. If it's already enabled, check your Google Cloud Console API Key restrictions and ensure 'Identity Toolkit API' is allowed.\n4. Refresh this app.";
            WebApp.showAlert(msg);
          } else {
            WebApp.showAlert("Authentication Error: " + err.message);
          }
          setIsAuthReady(true);
        });
      }
    });
    return () => {
      tasksUnsub();
      unsubscribe();
      if (userUnsubRef.current) userUnsubRef.current();
    };
  }, []);

  // Sync Wallet Address to Firestore
  useEffect(() => {
    if (user && walletAddress) {
      updateDoc(doc(db, 'users', user.uid), {
        walletAddress: walletAddress
      }).catch(err => console.error("Error syncing wallet:", err));
    }
  }, [user, walletAddress]);

  // Sync Leaderboard
  useEffect(() => {
    if (!isAuthReady || !user) return;
    setIsLoadingLeaderboard(true);
    const q = query(collection(db, 'users'), orderBy('volume', 'desc'), limit(100));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      // Filter out any potential bot data if it exists in DB
      const realUsers = data.filter(u => u.uid);
      if (realUsers.length > 0) {
        setLeaderboard(realUsers.map((u, i) => ({
          ...u,
          color: PLAYER_PALETTE[i % PLAYER_PALETTE.length]
        })));
      } else {
        setLeaderboard([]);
      }
      setIsLoadingLeaderboard(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
      setIsLoadingLeaderboard(false);
    });
    return () => unsubscribe();
  }, [isAuthReady]);

  // Sync Global Stats (Top/Last Winners)
  useEffect(() => {
    if (!isAuthReady || !user) return;
    const statsRef = doc(db, 'stats', 'winners');
    const unsubscribe = onSnapshot(statsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.lastWinner) setLastWinner(data.lastWinner);
        if (data.topWinner) setTopWinner(data.topWinner);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'stats/winners');
    });
    return () => unsubscribe();
  }, [isAuthReady]);

  // Sync Recent Winners
  useEffect(() => {
    if (!isAuthReady || !user) return;
    const q = query(collection(db, 'winners'), orderBy('createdAt', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setWinners(snapshot.docs.map(doc => doc.data()) as any[]);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'winners');
    });
    return () => unsubscribe();
  }, [isAuthReady]);

  // Sync Game State
  useEffect(() => {
    if (!isAuthReady || !user) return;
    const gameRef = doc(db, 'games', 'current');
    const unsubscribe = onSnapshot(gameRef, (snapshot) => {
      if (snapshot.exists()) {
        const gameData = snapshot.data();
        setPlayers(gameData.players || []);
        setStatus(gameData.status || 'waiting');
        setWinner(gameData.winner || null);
        if (gameData.status === 'winner' && gameData.winner) {
           setPersistentWinner({...gameData.winner, totalPrize: gameData.totalPot});
        }
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'games/current');
    });
    return () => unsubscribe();
  }, [isAuthReady]);

  // Test Connection
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      WebApp.ready();
      WebApp.expand();
      WebApp.setHeaderColor('#0d0d0d');
      WebApp.setBackgroundColor('#0d0d0d');
      
      if (WebApp.isVersionAtLeast('8.0')) {
        try {
          WebApp.requestFullscreen();
        } catch (e) {
          console.log("Fullscreen request failed", e);
        }
      }
      
      // Auto-start loading if played before
      if (hasPlayedBefore && !isLoadingStarted) {
        startLoading();
      }
    }
  }, [hasPlayedBefore]);

  useEffect(() => {
    safeStorage.set('hegmo_balance', myBalance.toString());
  }, [myBalance]);

  useEffect(() => {
    safeStorage.set('hegmo_tasks', JSON.stringify(completedTaskIds));
  }, [completedTaskIds]);

  useEffect(() => {
    safeStorage.set('hegmo_wallet_connected', isWalletConnected.toString());
  }, [isWalletConnected]);

  useEffect(() => {
    safeStorage.set('hegmo_lang', langIdx.toString());
  }, [langIdx]);

  const promoRef = useRef(null);

  const [lastWinner, setLastWinner] = useState({ 
    username: '...', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Winner1', 
    winChance: '0', amount: '0', color: PLAYER_PALETTE[2].main, accentColor: PLAYER_PALETTE[2].accent 
  });
  const [topWinner, setTopWinner] = useState({ 
    username: '...', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Winner2', 
    winChance: '0', amount: '0', color: PLAYER_PALETTE[0].main, accentColor: PLAYER_PALETTE[0].accent 
  });

  const [selectorPos, setSelectorPos] = useState({ x: 50, y: 50 });
  const [selectorAngle, setSelectorAngle] = useState(0);
  const [isAiming, setIsAiming] = useState(false);
  const [hoverInfo, setHoverInfo] = useState({ name: '', color: '' });
  
  // Physics Ref: Precision Carrom Glide
  const physicsRef = useRef({ 
    x: 50, y: 50, vx: 0, vy: 0, 
    friction: 0.994, 
    bounce: 0.85, 
    active: false, 
    radius: 3.2 
  });
  
  const angleRef = useRef(0);
  const totalPot = useMemo(() => players.reduce((sum, p) => sum + p.bet, 0), [players]);

  useEffect(() => {
    console.log("App Tab Switch:", activeTab);
    if (activeTab === 'tasks') {
      const interval = setInterval(() => {
        setPromoIndex((prev) => (prev + 1) % PROMO_BANNERS.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  useEffect(() => {
    if (promoRef.current && activeTab === 'tasks') {
        const slideWidth = promoRef.current.offsetWidth;
        promoRef.current.scrollTo({
          left: promoIndex * slideWidth,
          behavior: 'smooth'
        });
    }
  }, [promoIndex, activeTab]);

  useEffect(() => {
    console.log("App Initializing Fonts and Meta...");
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    const meta = document.createElement('meta');
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover";
    document.head.appendChild(meta);
    
    return () => {
      document.head.removeChild(link);
      document.head.removeChild(meta);
    };
  }, []);

  const territories = useMemo(() => {
    if (players.length === 0) return [];
    const center = { x: 50, y: 50 };
    let currentP = 0;
    const totalP = 400;
    const getCoord = (p) => {
      p = (p + 400) % 400;
      if (p <= 100) return { x: p, y: 0 };
      if (p <= 200) return { x: 100, y: p - 100 };
      if (p <= 300) return { x: 100 - (p - 200), y: 100 };
      return { x: 0, y: 100 - (p - 300) };
    };
    return players.map((player) => {
      const share = (player.bet / totalPot) * totalP;
      const start = currentP, end = currentP + share;
      let pts = [{ ...center }];
      pts.push(getCoord(start));
      if (start < 100 && end > 100) pts.push({ x: 100, y: 0 });
      if (start < 200 && end > 200) pts.push({ x: 100, y: 100 });
      if (start < 300 && end > 300) pts.push({ x: 0, y: 100 });
      if (start < 400 && end > 400) pts.push({ x: 0, y: 0 });
      pts.push(getCoord(end));
      currentP += share;
      const midP = start + (share / 2), bPt = getCoord(midP);
      
      // First bidder stays in center if only one player
      const avatarPos = players.length === 1 
        ? { x: 50, y: 50 } 
        : { x: center.x + (bPt.x - center.x) * 0.72, y: center.y + (bPt.y - center.y) * 0.72 };

      return { 
        ...player, 
        points: pts.map(pt => `${pt.x},${pt.y}`).join(' '), 
        avatarPos,
        startP: start, endP: end 
      };
    });
  }, [players, totalPot]);

  const findOwnerAt = (px, py) => {
    if (players.length === 0) return null;
    const dx = px - 50, dy = py - 50;
    let p = 0;
    if (Math.abs(dx) >= Math.abs(dy)) {
        if (dx > 0) p = 150 + (dy / Math.abs(dx)) * 50;
        else p = 350 - (dy / Math.abs(dx)) * 50;
    } else {
        if (dy > 0) p = 250 - (dx / Math.abs(dy)) * 50;
        else p = 50 + (dx / Math.abs(dy)) * 50;
    }
    p = (p + 400) % 400;
    return territories.find(t => t.startP < t.endP ? (p >= t.startP && p < t.endP) : (p >= t.startP || p < t.endP));
  };

  // Winner Popup Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'winner' && persistentWinner) {
      setPopupTimeLeft(5);
      timer = setInterval(() => {
        setPopupTimeLeft((prev) => {
          if (prev <= 0.1) {
            clearInterval(timer);
            resetGame();
            return 0;
          }
          return prev - 0.1;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [status, persistentWinner]);

  useEffect(() => {
    if (status === 'waiting' && timeLeft < 15 && timeLeft > 1) {
      // Bot logic removed
    }
  }, [timeLeft, status]);

  useEffect(() => {
    if (status === 'waiting' && players.length >= 2) {
      if (timeLeft === 0) setTimeLeft(15);
      const t = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(t);
            runDrawSequence();
            return 0;
          } return prev - 1;
        });
      }, 1000);
      return () => clearInterval(t);
    } else if (status === 'waiting') {
      setTimeLeft(0);
    }
  }, [status, players.length, timeLeft === 0]);

  const runDrawSequence = () => {
    setStatus('drawing');
    const startPos = { x: 30 + Math.random() * 40, y: 30 + Math.random() * 40 };
    setSelectorPos(startPos); 
    setIsAiming(true); 
    setIsZoomed(false);
    let speed = 40 + Math.random() * 10;
    let start = Date.now();
    const spin = () => {
      const elapsed = Date.now() - start;
      if (elapsed < 1600) { 
        angleRef.current = (angleRef.current + speed) % 360; 
        setSelectorAngle(angleRef.current); 
        requestAnimationFrame(spin); 
      } else if (speed > 0.1) { 
        speed *= 0.95; 
        angleRef.current = (angleRef.current + speed) % 360; 
        setSelectorAngle(angleRef.current); 
        requestAnimationFrame(spin); 
      } else { 
        setTimeout(() => { setIsAiming(false); setTimeout(() => { shootPuck(startPos, angleRef.current); }, 350); }, 800); 
      }
    };
    requestAnimationFrame(spin);
  };

  const shootPuck = (startPos, finalAngle) => {
    const rad = (finalAngle * Math.PI) / 180;
    physicsRef.current = { ...physicsRef.current, x: startPos.x, y: startPos.y, vx: Math.sin(rad) * 8.5, vy: -Math.cos(rad) * 8.5, friction: 0.984, active: true };
    const step = () => {
      if (!physicsRef.current.active) return;
      let { x, y, vx, vy, friction, bounce, radius } = physicsRef.current;
      vx *= friction; vy *= friction;
      x += vx; y += vy;
      const min = radius, max = 100 - radius;
      if (x < min) { x = min; vx *= -bounce; } else if (x > max) { x = max; vx *= -bounce; }
      if (y < min) { y = min; vy *= -bounce; } else if (y > max) { y = max; vy *= -bounce; }
      const v = Math.sqrt(vx * vx + vy * vy);
      if (v < 2.5) { setIsZoomed(true); setZoomOrigin(prev => ({ x: prev.x + (x - prev.x) * 0.08, y: prev.y + (y - prev.y) * 0.08 })); }
      physicsRef.current.x = x; physicsRef.current.y = y;
      physicsRef.current.vx = vx; physicsRef.current.vy = vy;
      setSelectorPos({ x, y });
      const area = findOwnerAt(x, y);
      if (area && area.username !== hoverInfo.name) setHoverInfo({ name: area.username, color: area.color });
      if (v < 0.03) { 
        physicsRef.current.active = false; 
        const resWinner = area || players[0];
        setWinner(resWinner); 
        const winAmount = totalPot;
        setPersistentWinner({...resWinner, totalPrize: winAmount});
        setStatus('winner'); 
        
        // Save winner to DB
        if (resWinner.username) {
          const winnerId = `win_${Date.now()}`;
          setDoc(doc(db, 'winners', winnerId), {
            id: winnerId,
            gameId: `game_${Date.now()}`,
            uid: resWinner.username.startsWith('@') ? resWinner.username : 'unknown',
            username: resWinner.username,
            avatar: resWinner.avatar,
            amount: winAmount,
            winChance: ((resWinner.bet / totalPot) * 100),
            createdAt: serverTimestamp()
          }).catch(console.error);
        }

        // Update Top/Recent Winners UI & DB
        const newLastWinner = {
          username: resWinner.username,
          avatar: resWinner.avatar,
          winChance: ((resWinner.bet / totalPot) * 100).toFixed(1),
          amount: winAmount.toFixed(2),
          color: resWinner.color,
          accentColor: resWinner.accentColor
        };
        setLastWinner(newLastWinner);

        let newTopWinner = topWinner;
        const currentVal = winAmount;
        const prevVal = parseFloat(topWinner.amount.replace(/[^\d.]/g, '')) || 0;
        if (currentVal > prevVal) {
          newTopWinner = {
            username: resWinner.username,
            avatar: resWinner.avatar,
            winChance: ((resWinner.bet / totalPot) * 100).toFixed(1),
            amount: winAmount.toFixed(2),
            color: resWinner.color,
            accentColor: resWinner.accentColor
          };
          setTopWinner(newTopWinner);
        }

        // Sync to Stats DB
        setDoc(doc(db, 'stats', 'winners'), {
          lastWinner: newLastWinner,
          topWinner: newTopWinner
        }, { merge: true }).catch(console.error);

        // Sync to Firestore Game State
        if (user) {
          try {
            updateDoc(doc(db, 'games', 'current'), {
              status: 'winner',
              winner: resWinner
            });
            // Update winner's stats if it's the current user (STRICT UID CHECK)
            if (resWinner.uid === user.uid) {
              updateDoc(doc(db, 'users', user.uid), {
                wins: increment(1),
                balance: increment(totalPot)
              });
              setMyBalance(prev => prev + totalPot);
            }
          } catch (error) {
            handleFirestoreError(error, OperationType.UPDATE, 'games/current');
          }
        }
      } else requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const resetGame = async () => {
    WebApp.HapticFeedback.impactOccurred('light');
    setWinner(null);
    setPersistentWinner(null);
    setIsAiming(false); 
    setIsZoomed(false); 
    setHoverInfo({ name: '', color: '' });
    
    if (user) {
      try {
        const gameRef = doc(db, 'games', 'current');
        await setDoc(gameRef, {
          players: [],
          totalPot: 0,
          status: 'waiting',
          createdAt: serverTimestamp()
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'games/current');
      }
    }
  };

  const t = useMemo(() => TRANSLATIONS[LANGUAGES[langIdx]], [langIdx]);

  const addBid = async (amt, isMe = false, bot = null) => {
    if (status !== 'waiting' || amt <= 0) return;
    
    // Ensure DUCK is always integer
    const cleanAmt = Math.floor(amt);
    if (cleanAmt < 1) return;

    if (isMe && myBalance < cleanAmt) {
      WebApp.showAlert("Insufficient DUCK balance!");
      return;
    }
    
    if (isMe) {
      WebApp.HapticFeedback.impactOccurred('medium');
    }

    const finalAmt = isMe && cleanAmt > myBalance ? Math.floor(myBalance) : cleanAmt;
    if (finalAmt < 1) return;
    
    const tgUser = WebApp.initDataUnsafe?.user;
    const n = isMe ? (tgUser ? `@${tgUser.username || tgUser.first_name}` : 'User') : bot.name;
    const a = isMe ? (tgUser?.photo_url || DEFAULT_AVATAR) : bot.avatar;
    
    if (isMe) {
      setMyBalance(prev => Math.max(0, prev - finalAmt));
      if (user) {
        try {
          await updateDoc(doc(db, 'users', user.uid), {
            balance: increment(-finalAmt),
            volume: increment(finalAmt),
            spinsCount: increment(1)
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
        }
      }
    }

    try {
      const gameRef = doc(db, 'games', 'current');
      const gameSnap = await getDoc(gameRef);
      let currentPlayers = [];
      let currentPot = 0;
      
      if (gameSnap.exists()) {
        const data = gameSnap.data();
        currentPlayers = data.players || [];
        currentPot = data.totalPot || 0;
      }

      const existingIdx = currentPlayers.findIndex(p => p.username === n);
      if (existingIdx > -1) {
        currentPlayers[existingIdx].bet += finalAmt;
        if (isMe) {
          currentPlayers[existingIdx].selectedFrame = userData?.selectedFrame || 'none';
          currentPlayers[existingIdx].uid = user.uid;
          currentPlayers[existingIdx].hasBoughtWithTon = userData?.hasBoughtWithTon || false;
        }
      } else if (currentPlayers.length < 15) {
        const pal = PLAYER_PALETTE[currentPlayers.length % PLAYER_PALETTE.length];
        const newPlayer = { 
          uid: isMe ? user.uid : (bot ? bot.id : `bot_${Date.now()}`),
          username: n, 
          avatar: a, 
          bet: finalAmt, 
          color: pal.main, 
          lightColor: pal.light, 
          accentColor: pal.accent, 
          isMe, 
          id: Date.now() + Math.random(),
          selectedFrame: isMe ? (userData?.selectedFrame || 'none') : 'none',
          hasBoughtWithTon: isMe ? (userData?.hasBoughtWithTon || false) : false
        };
        currentPlayers.push(newPlayer);
      }

      await setDoc(gameRef, {
        players: currentPlayers,
        totalPot: currentPot + finalAmt,
        status: 'waiting',
        createdAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'games/current');
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setAdTimers(prev => {
        const next = { ...prev };
        let changed = false;
        Object.keys(next).forEach(id => {
          if (next[id] > 0) {
            next[id] -= 1;
            changed = true;
            if (next[id] === 0) {
              setAdReady(ready => ({ ...ready, [id]: true }));
            }
          }
        });
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleWatchAd = (taskId) => {
    // Adsgram integration mock
    console.log("Watching ad for task:", taskId);
    
    setAdTimers(prev => ({ ...prev, [taskId]: 10 }));
    setAdReady(prev => ({ ...prev, [taskId]: false }));
    
    WebApp.HapticFeedback.impactOccurred('light');
  };

  const handleTaskClick = async (taskId) => {
    if (!taskId || completedTaskIds.includes(taskId) || !user || processingTasksRef.current.has(taskId)) return;
    
    processingTasksRef.current.add(taskId);
    const task = allTasks.find(t => t.id === taskId) || 
                 DAILY_TASKS.find(t => t.id === taskId) || 
                 ACHIEVEMENTS.find(t => t.id === taskId) || 
                 PARTNER_TASKS.find(t => t.id === taskId);
                 
    if (task) {
      // Support both explicit rewards and legacy reward field
      let duckReward = Math.floor(parseFloat(task.duckReward || "0"));
      let tonReward = parseFloat(task.tonReward || "0");
      
      if (duckReward === 0 && tonReward === 0 && task.reward) {
        if (task.rewardType === 'DUCK') duckReward = Math.floor(parseFloat(task.reward));
        else tonReward = parseFloat(task.reward);
      }
      
      setCompletedTaskIds(prev => [...prev, taskId]);
      
      const updateData: any = {
        completedTasks: arrayUnion(taskId)
      };
      
      if (duckReward > 0) {
        setMyBalance(prev => Math.max(0, prev + duckReward));
        updateData.balance = increment(duckReward);
      }
      
      if (tonReward > 0) {
        setTonBalance(prev => Math.max(0, prev + tonReward));
        updateData.tonBalance = increment(tonReward);
      }
      
      try {
        await updateDoc(doc(db, 'users', user.uid), updateData);
        // Only update task completion count if it's a global task from DB
        if (allTasks.find(t => t.id === taskId)) {
          await updateDoc(doc(db, 'tasks', taskId), {
            completedCount: increment(1)
          });
        }
        WebApp.HapticFeedback.notificationOccurred('success');
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
        // Rollback local state if failed
        setCompletedTaskIds(prev => prev.filter(id => id !== taskId));
        if (duckReward > 0) setMyBalance(prev => Math.max(0, prev - duckReward));
        if (tonReward > 0) setTonBalance(prev => Math.max(0, prev - tonReward));
      } finally {
        processingTasksRef.current.delete(taskId);
      }
    } else {
      processingTasksRef.current.delete(taskId);
    }
  };

  const handleClaimWelcomeBonus = async () => {
    if (!user || !userData || userData.welcomeBonusClaimed || isClaimingWelcome) return;
    
    setIsClaimingWelcome(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      // Double check in Firestore before updating
      const snap = await getDoc(userRef);
      if (snap.exists() && snap.data().welcomeBonusClaimed) {
        setShowWelcomePopup(false);
        setIsClaimingWelcome(false);
        return;
      }

      await updateDoc(userRef, {
        balance: increment(welcomeReward),
        welcomeBonusClaimed: true
      });
      setMyBalance(prev => prev + welcomeReward);
      setShowWelcomePopup(false);
      WebApp.HapticFeedback.notificationOccurred('success');
    } catch (error) {
      console.error("Error claiming welcome bonus:", error);
    } finally {
      setIsClaimingWelcome(false);
    }
  };

  const handleResetAllBalances = async () => {
    if (!isAdmin) return;
    WebApp.showConfirm("Are you sure you want to RESET ALL user balances (DUCK & TON) to 0? This cannot be undone.", async (confirmed) => {
      if (confirmed) {
        try {
          const usersSnap = await getDocs(collection(db, 'users'));
          const batch = writeBatch(db);
          usersSnap.docs.forEach(userDoc => {
            batch.update(userDoc.ref, {
              balance: 0,
              tonBalance: 0,
              puckBalance: 0 // Clean up legacy field too
            });
          });
          await batch.commit();
          WebApp.showAlert("All balances have been reset to 0.");
        } catch (error) {
          console.error("Error resetting balances:", error);
          WebApp.showAlert("Failed to reset balances. Check console for details.");
        }
      }
    });
  };

  const handleAdminTrigger = () => {
    setAdminClickCount(prev => {
      const next = prev + 1;
      if (next >= 5) {
        if (isAdmin) {
          setIsAdminPanelOpen(true);
        } else {
          WebApp.showAlert("Access denied: You do not have administrator privileges.");
        }
        return 0;
      }
      return next;
    });
  };

  const handleDeposit = async () => {
    const amount = parseFloat(prompt("Enter DUCK amount to deposit:", "10") || "0");
    if (!isNaN(amount) && amount > 0 && user) {
      setMyBalance(prev => prev + amount);
      try {
        const transId = `dep_${Date.now()}`;
        await setDoc(doc(db, 'transactions', transId), {
          id: transId,
          uid: user.uid,
          amount: amount,
          type: 'deposit',
          status: 'completed',
          createdAt: serverTimestamp()
        });
        await updateDoc(doc(db, 'users', user.uid), {
          balance: increment(amount),
          totalDeposited: increment(amount)
        });
        WebApp.showAlert(`Successfully deposited ${amount} DUCK!`);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
      }
    }
  };

  const handleWithdrawal = async () => {
    const amount = parseFloat(prompt("Enter DUCK amount to withdraw:", "10") || "0");
    if (!isNaN(amount) && amount > 0 && user) {
      if (amount <= myBalance) {
        setMyBalance(prev => prev - amount);
        try {
          const transId = `with_${Date.now()}`;
          await setDoc(doc(db, 'transactions', transId), {
            id: transId,
            uid: user.uid,
            amount: amount,
            type: 'withdrawal',
            status: 'pending',
            createdAt: serverTimestamp()
          });
          await updateDoc(doc(db, 'users', user.uid), {
            balance: increment(-amount)
          });
          WebApp.showAlert(`Withdrawal request for ${amount} DUCK submitted!`);
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
        }
      } else {
        WebApp.showAlert("Insufficient balance!");
      }
    }
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`t.me/GiftPhaseBot?start=${user?.uid || '6686954447'}`);
    WebApp.showAlert("Referral link copied to clipboard!");
  };

  const handleShare = () => {
    const shareUrl = `t.me/GiftPhaseBot?start=${user?.uid || '6686954447'}`;
    if (typeof window !== 'undefined' && WebApp.initData) {
      WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('Join me in Gift Phase V2 and win DUCK!')}`);
    } else if (navigator.share) {
      navigator.share({
        title: 'Gift Phase V2',
        text: 'Join me in Gift Phase V2 and win DUCK!',
        url: shareUrl,
      }).catch(console.error);
    } else {
      handleCopyReferral();
    }
  };

  const startLoading = () => {
    if (isLoadingStarted) return;
    setIsLoadingStarted(true);
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 2; 
      if (currentProgress >= 100) {
        setLoadingProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setIsGameLoaded(true);
          safeStorage.set('giftphase_played', 'true');
          setHasPlayedBefore(true);
        }, 500);
      } else {
        setLoadingProgress(currentProgress);
      }
    }, 40); // 40ms * 50 steps = 2 seconds
  };

  const handleLike = () => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    safeStorage.set('giftphase_liked', String(newLiked));
    if ((window as any).Telegram?.WebApp?.HapticFeedback) {
      (window as any).Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
  };

  const premium3DStyle = `bg-gradient-to-b from-white/15 to-white/5 border-t border-white/20 shadow-[0_5px_0_rgba(0,0,0,0.4)] active:translate-y-[2px] active:shadow-[0_2px_0_rgba(0,0,0,0.4)] transition-all duration-75`;
  const white3DStyle = `bg-white border-t border-white/50 shadow-[0_5px_0_rgba(0,0,0,0.4)] active:translate-y-[2px] active:shadow-[0_2px_0_rgba(0,0,0,0.4)] transition-all duration-75 text-black font-black`;

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '0';
    const absoluteVal = Math.max(0, val);
    if (absoluteVal >= 1000000) return (absoluteVal / 1000000).toFixed(1) + 'M';
    if (absoluteVal >= 1000) return (absoluteVal / 1000).toFixed(1) + 'k';
    
    // For TON (usually smaller numbers), show up to 2 decimals if they exist
    // For DUCK (usually integers), show as integer
    if (absoluteVal < 100 && absoluteVal > 0 && absoluteVal % 1 !== 0) {
      return absoluteVal.toFixed(2).replace(/\.?0+$/, '');
    }
    return Math.floor(absoluteVal).toLocaleString();
  };

  const formatCurrencySimple = (val) => {
    if (val === undefined || val === null) return '0';
    const absoluteVal = Math.max(0, val);
    if (absoluteVal >= 1000000) return (absoluteVal / 1000000).toFixed(1) + 'M';
    if (absoluteVal >= 1000) return (absoluteVal / 1000).toFixed(1) + 'k';
    if (absoluteVal < 100 && absoluteVal > 0 && absoluteVal % 1 !== 0) {
      return absoluteVal.toFixed(2).replace(/\.?0+$/, '');
    }
    return Math.floor(absoluteVal).toLocaleString();
  };

  const renderArena = () => {
    const isBidDisabled = (status !== 'waiting') || (timeLeft === 1 && players.length >= 2);

    return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar pb-40 relative font-sans overscroll-contain z-10 pt-12 px-4">
      <div className="flex justify-between items-center px-4 pt-8 pb-3 gap-2 shrink-0">
        <div className={`px-4 py-2 rounded-full flex items-center justify-center gap-2 min-w-0 font-sans bg-[#1a1a1a] shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)] border border-white/10`}><TonIcon size={20} /><span className="text-[15px] font-black uppercase akira-font leading-none">{formatCurrency(tonBalance)}<span className="font-black text-lg ml-0.5">+</span></span></div>
        <div className={`px-4 py-2 rounded-full flex items-center justify-center gap-2 min-w-0 font-sans bg-[#1a1a1a] shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)] border border-white/10`}><DuckIcon size={20} /><span className="text-[15px] font-black uppercase akira-font leading-none">{formatCurrency(myBalance)}<span className="font-black text-lg ml-0.5">+</span></span></div>
      </div>
      <div className="px-4 grid grid-cols-2 gap-3 mb-5 mt-1 shrink-0">
        <div className={`rounded-2xl p-2.5 flex items-center justify-between border-t border-white/20 shadow-[0_5px_0_rgba(0,0,0,0.4)]`} style={{ background: `linear-gradient(to bottom, ${topWinner.accentColor}, ${topWinner.color})` }}><div className="flex items-center gap-2 min-w-0"><img src={topWinner.avatar} className="w-6 h-6 rounded-full border border-white/10" referrerPolicy="no-referrer" /><div className="flex flex-col min-w-0"><span className="text-[7px] text-white/60 font-black uppercase">{t.topWin}</span><span className="text-[11px] font-black text-white truncate akira-font">{topWinner.username}</span></div></div><div className="flex flex-col items-end shrink-0 ml-1"><span className="text-[12px] font-black text-white flex items-center gap-0.5 akira-font">{formatCurrency(topWinner.amount)} <DuckIcon size={20} /></span><span className="text-[7px] font-bold text-white/50">{topWinner.winChance}%</span></div></div>
        <div className={`rounded-2xl p-2.5 flex items-center justify-between border-t border-white/20 shadow-[0_5px_0_rgba(0,0,0,0.4)]`} style={{ background: `linear-gradient(to bottom, ${lastWinner.accentColor}, ${lastWinner.color})` }}><div className="flex items-center gap-2 min-w-0"><img src={lastWinner.avatar} className="w-6 h-6 rounded-full border border-white/10" referrerPolicy="no-referrer" /><div className="flex flex-col min-w-0"><span className="text-[7px] text-white/60 font-black uppercase">{t.lastWin}</span><span className="text-[11px] font-black text-white truncate akira-font">{lastWinner.username}</span></div></div><div className="flex flex-col items-end shrink-0 ml-1"><span className="text-[12px] font-black text-white flex items-center gap-0.5 akira-font">{formatCurrency(lastWinner.amount)} <DuckIcon size={20} /></span><span className="text-[7px] font-bold text-white/50">{lastWinner.winChance}%</span></div></div>
      </div>
      <div className="px-4 flex justify-between items-end mb-3 px-1 font-sans shrink-0"><div><span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{t.totalPool}</span><div className="text-cyan-400 font-black text-2xl tracking-tighter flex items-center gap-1 akira-font">{formatCurrency(totalPot)} <DuckIcon size={28} /></div></div><div className="text-right"><span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{t.startingIn}</span><div className="font-mono text-2xl font-black">00:{timeLeft.toString().padStart(2, '0')}</div></div></div>
      <div className="mx-4 relative group shrink-0"><div className="relative aspect-square rounded-[44px] overflow-hidden border-[6px] border-[#1a1a1a] bg-[#111] shadow-2xl mb-6">{players.length === 0 ? <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-black uppercase text-center px-10 italic">{t.waiting}</div> : (<div className={`absolute inset-0 transition-transform duration-[450ms] ease-out ${isZoomed ? 'scale-[2.8]' : 'scale-100'}`} style={{ transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%` }}><StaticBoard territories={territories} winner={winner} /></div>)}<div className={`absolute z-[60] w-14 h-14 transition-opacity duration-300 pointer-events-none flex flex-col items-center justify-center ${status === 'drawing' || status === 'winner' ? 'opacity-100' : 'opacity-0'}`} style={{ left: `${selectorPos.x}%`, top: `${selectorPos.y}%`, transform: 'translate(-50%, -50%)' }}>{status === 'drawing' && hoverInfo.name && (<div key={hoverInfo.name} className={`absolute bg-black/95 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 flex items-center gap-2.5 shadow-2xl animate-in slide-in-from-bottom-1 fade-in duration-150 transition-all ${selectorPos.y < 25 ? 'top-14 translate-y-2' : '-top-14 -translate-y-2'}`}><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hoverInfo.color }}></div><span className="text-[6.5px] font-black uppercase tracking-widest text-white">{hoverInfo.name}</span></div>)}{isAiming && <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transform: `rotate(${selectorAngle}deg)` }}><ArrowUp size={34} className="text-white -translate-y-9 animate-pulse" /></div>}<div className="w-full h-full bg-white/20 backdrop-blur-[3.5px] rounded-full border-[3.5px] border-white shadow-[0_0_30px_rgba(255,255,255,0.45)] relative flex items-center justify-center overflow-hidden"><div className="absolute w-full h-[1px] bg-white/40"></div><div className="absolute h-full w-[1px] bg-white/40"></div><div className="relative z-10 w-4 h-4 flex items-center justify-center"><div className="absolute w-4 h-[2.5px] bg-white shadow-[0_0_8px_white] text-transparent">.</div><div className="absolute h-4 w-[2.5px] bg-white shadow-[0_0_8px_white] text-transparent">.</div></div></div></div></div></div>
      <div className="px-4 w-full flex items-center gap-2 mb-8 mt-2 shrink-0 overflow-x-auto no-scrollbar py-2">
        <button 
          disabled={isBidDisabled} 
          onClick={() => {
            const val = prompt("Enter custom bid amount (must be more than 10,000):");
            if (val) {
              const num = parseInt(val.replace(/,/g, ''));
              if (!isNaN(num) && num > 10000) {
                setCustomBid(num);
              } else {
                WebApp.showAlert("Invalid amount. Must be a number greater than 10,000.");
              }
            }
          }} 
          className={`${premium3DStyle} w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isBidDisabled ? 'opacity-50 grayscale' : ''}`}
        >
          <Pencil size={20} className="text-white" />
        </button>
        {[10000, 50000, 100000, ...(customBid ? [customBid] : [])].map(v => (
          <button 
            key={v} 
            disabled={isBidDisabled} 
            onClick={() => addBid(v, true)} 
            className={`${premium3DStyle} min-w-[90px] flex-1 h-14 rounded-[24px] font-black text-[15px] akira-font flex items-center justify-center gap-1 ${isBidDisabled ? 'opacity-50 grayscale' : ''}`}
          >
            <span className="leading-none">{formatCurrencySimple(v)}</span> <DuckIcon size={20} />
          </button>
        ))}
        <button 
          disabled={isBidDisabled} 
          onClick={() => addBid(myBalance, true)} 
          className={`min-w-[85px] flex-1 h-14 rounded-[24px] font-black text-[15px] bg-gradient-to-b from-[#2563EB] to-[#1E40AF] border-t border-white/30 shadow-[0_5px_0_rgba(0,0,0,0.4)] active:translate-y-[1px] uppercase transition-all akira-font ${isBidDisabled ? 'opacity-50 grayscale' : ''}`}
        >
          <span className="leading-none">All-in</span>
        </button>
      </div>

      {/* Live Player List */}
      <div className="px-4 mb-12 shrink-0">
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{t.players} : {players.length}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          </div>
          <div className="flex -space-x-2">
            {players.slice(0, 5).map((p, i) => (
              <img key={i} src={p.avatar} className="w-5 h-5 rounded-full border border-black shadow-sm" alt="" referrerPolicy="no-referrer" />
            ))}
            {players.length > 5 && <div className="w-5 h-5 rounded-full bg-[#222] border border-black flex items-center justify-center text-[7px] font-black">+{players.length - 5}</div>}
          </div>
        </div>
        <div className="space-y-4">
          {players.map((p, i) => {
            const isMe = p.uid === user?.uid;
            const isRich = p.hasBoughtWithTon;
            
            if (isRich) {
              return (
                <div key={i} className="p-3.5 rounded-[24px] flex items-center justify-between border-t border-yellow-500/50 shadow-[0_5px_0_rgba(234,179,8,0.3)] relative overflow-hidden group transition-all bg-gradient-to-br from-[#1a1a1a] via-[#2a2a1a] to-[#1a1a1a] animate-gold-wave">
                  {/* Waving Shimmer Overlay */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]"></div>
                  </div>
                  
                  {/* Golden Glow */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: `radial-gradient(circle at 20% 50%, #eab308, transparent 85%)` }}></div>
                  
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="relative shrink-0">
                      <img src={p.avatar} className="w-11 h-11 rounded-full border-[1.5px] border-yellow-500/50 object-cover shadow-[0_0_10px_rgba(234,179,8,0.3)]" alt="" referrerPolicy="no-referrer" />
                      {isMe && <div className="absolute -top-1 -right-1 bg-cyan-400 text-black text-[7px] font-black px-1.5 py-0.5 rounded-full border border-black/20 shadow-lg z-20">YOU</div>}
                      <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-yellow-300 to-yellow-600 p-0.5 rounded-md shadow-lg border border-white/20 animate-pulse z-20">
                        <Medal size={8} className="text-white" fill="currentColor" />
                      </div>
                    </div>
                    <div className="flex flex-col max-w-[110px]">
                      <div className="flex items-center gap-1 overflow-hidden">
                        <span className="text-[12px] font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-500 to-yellow-200 uppercase tracking-tight akira-font truncate">
                          {p.username}
                        </span>
                        <span className="shrink-0 text-[7px] font-black bg-yellow-500 text-black px-1 py-0.5 rounded-md border border-yellow-500/30 uppercase tracking-tighter">VIP</span>
                      </div>
                      <span className="text-[8px] font-bold text-yellow-500/50 uppercase tracking-widest truncate">Elite Supporter</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end relative z-10">
                    <div className="flex items-center gap-1">
                      <span className="text-[14px] font-black text-white tracking-tighter">{formatCurrency(p.bet)}</span>
                      <DuckIcon size={12} />
                    </div>
                    <span className="text-[8px] font-black text-yellow-500/30 uppercase">DUCK</span>
                  </div>
                </div>
              );
            }

            // Simple Card for non-VIP players
            return (
              <div key={i} className="p-3.5 rounded-[24px] flex items-center justify-between border-t border-white/20 shadow-[0_5px_0_rgba(0,0,0,0.4)] active:translate-y-[1px] transition-all bg-[#111]">
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img src={p.avatar} className="w-11 h-11 rounded-full border-[1.5px] border-white/20 shadow-md object-cover" referrerPolicy="no-referrer" />
                    {isMe && <div className="absolute -top-1 -right-1 bg-cyan-400 text-black text-[7px] font-black px-1.5 py-0.5 rounded-full border border-black/20 shadow-lg z-20">YOU</div>}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-black text-white uppercase tracking-tight">{p.username}</span>
                    <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">{p.winChance}% {t.winChance}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1">
                    <span className="text-[14px] font-black text-white tracking-tighter">{formatCurrency(p.bet)}</span>
                    <DuckIcon size={12} />
                  </div>
                  <span className="text-[8px] font-bold text-white/40 uppercase">DUCK</span>
                </div>
              </div>
            );
          })}
          {players.length === 0 && (
            <div className="py-10 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[32px]">
              <span className="text-white/10 font-black uppercase text-[10px] tracking-[0.2em]">No Active Bidders</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

  const renderTaskCenter = () => {
    const tasksToShow = allTasks.filter(t => {
      const cat = taskCategory === 'achievements' ? 'achievement' : taskCategory === 'partners' ? 'partner' : 'daily';
      return t.type === cat && !t.deleted;
    });

    const checkAchievementCriteria = (task) => {
      if (!userData) return false;
      const count = task.requiredCount || 0;
      switch (task.verificationType) {
        case 'referral': return (userData.referralsCount || 0) >= count;
        case 'game': return (userData.spinsCount || 0) >= count;
        case 'played': return (userData.spinsCount || 0) >= count;
        case 'win': return (userData.wins || 0) >= count;
        case 'deposit': return (userData.totalDeposited || 0) >= count;
        case 'purchase': return (userData.shopPurchases?.length || 0) >= count;
        case 'leaderboard': {
          const rank = leaderboard.findIndex(p => p.id === user?.uid) + 1;
          return rank > 0 && rank <= count;
        }
        default: return false;
      }
    };

    const getIcon = (iconName) => {
      const icons = { User, Trophy, Zap, Pencil, ArrowUp, Store, Gamepad2, ClipboardList, ChevronLeft, ChevronRight, ChevronDown, MoreVertical, X, Star, Settings, UserPlus, Bolt, Medal, Gift, Wallet, Save, Copy, Share2, History, Link, ArrowDownCircle, ArrowUpCircle, Plus, Globe, Twitter, Youtube, Send, Heart, Users };
      return icons[iconName] || Bolt;
    };

    const handleTaskAction = async (task) => {
      if (completedTaskIds.includes(task.id)) return;

      // Achievement tasks claim automatically if criteria met
      if (task.type === 'achievement') {
        if (checkAchievementCriteria(task)) {
          handleTaskClick(task.id);
        } else {
          WebApp.showAlert(`Requirement not met: ${task.requiredCount} needed.`);
        }
        return;
      }

      // Telegram verification tasks (Channel/Group)
      if (task.verificationType === 'channel' || task.verificationType === 'group') {
        if (!verifyingTaskId) {
          if (task.link) WebApp.openTelegramLink(task.link);
          setVerifyingTaskId(task.id);
          setWaitTimer(5); // 5s wait before "Check" appears
          const interval = setInterval(() => {
            setWaitTimer(prev => {
              if (prev <= 1) {
                clearInterval(interval);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else if (verifyingTaskId === task.id && waitTimer === 0) {
          // Real verification check via backend
          WebApp.HapticFeedback.impactOccurred('medium');
          try {
            const response = await fetch('/api/verify-telegram', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: userData?.tgId, link: task.link })
            });
            const data = await response.json();
            
            if (data.ok && data.isMember) {
              handleTaskClick(task.id);
              setVerifyingTaskId(null);
              WebApp.HapticFeedback.notificationOccurred('success');
            } else {
              WebApp.showAlert(data.error || "Verification failed. Please make sure you have joined the channel/group.");
              setVerifyingTaskId(null);
            }
          } catch (error) {
            console.error("Verification error:", error);
            WebApp.showAlert("Verification service unavailable. Try again later.");
            setVerifyingTaskId(null);
          }
        }
        return;
      }

      // Other tasks (MiniApp/Link) with 5s wait
      if (!verifyingTaskId) {
        if (task.link) WebApp.openLink(task.link);
        setWaitTimer(5);
        setVerifyingTaskId(task.id);
        
        const interval = setInterval(() => {
          setWaitTimer(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else if (verifyingTaskId === task.id && waitTimer === 0) {
        handleTaskClick(task.id);
        setVerifyingTaskId(null);
      }
    };

    return (
      <div className="flex-1 bg-[#0d0d0d] flex flex-col overflow-y-auto no-scrollbar pb-40 relative font-sans overscroll-contain z-10 pt-12 px-4">
        <div className="absolute top-0 left-0 right-0 h-[450px] bg-gradient-to-b from-[#2563EB]/25 via-[#1E40AF]/5 to-transparent pointer-events-none"></div>
        <div className="w-full px-4 pt-8 shrink-0 relative z-20">
          <div ref={promoRef} className="w-full h-44 overflow-x-auto snap-x snap-mandatory no-scrollbar flex gap-4 scroll-smooth">
            {PROMO_BANNERS.map((promo) => (
              <div 
                key={promo.id} 
                onClick={() => {
                  if (promo.action === 'arena') setActiveTab('arena');
                  else if (promo.action === 'profile') setActiveTab('profile');
                  else if (promo.action === 'scroll') {
                    const el = document.getElementById('tasks-list');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`min-w-full h-full rounded-[36px] bg-gradient-to-br ${promo.grad} snap-center flex items-center p-8 border-t border-white/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden relative cursor-pointer active:scale-[0.98] transition-transform`}
              >
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[length:15px_15px]"></div>
                <div className="flex-1 flex flex-col gap-2 relative z-10">
                  <h3 className="text-2xl font-black text-white uppercase italic">{promo.title}</h3>
                  <p className="text-white/70 font-bold text-xs uppercase">{promo.desc}</p>
                  <div className="mt-2 bg-white/20 px-4 py-1.5 rounded-full border border-white/20 text-[10px] font-black uppercase text-white w-fit">
                    {promo.action === 'scroll' ? 'View Tasks' : 'Go Now'}
                  </div>
                </div>
                <div className="text-white/20 relative z-10">{promo.icon}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-1.5 mt-4">
            {PROMO_BANNERS.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${promoIndex === i ? 'bg-cyan-400 w-4 shadow-[0_0_8px_#22d3ee]' : 'bg-white/10'}`} />
            ))}
          </div>
        </div>
        <div className="p-6 pt-6 pb-4 relative z-10 shrink-0 text-center">
          <h1 className="text-3xl font-black text-white uppercase mb-1">{t.taskCenter}</h1>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{t.completeTasks}</p>
        </div>
        <div className="flex gap-2 px-4 mb-6 relative z-10 shrink-0">
          {['daily', 'achievements', 'partners'].map((cat) => {
            const active = taskCategory === cat;
            let catBtnGrad = 'bg-[#111] text-white/40 border-t border-white/5 shadow-[0_5px_0_rgba(0,0,0,0.4)]';
            if (active) {
              if (cat === 'daily') catBtnGrad = 'bg-gradient-to-b from-[#0891B2] to-[#2563EB] text-white border-t border-white/20 shadow-[0_5px_0_rgba(30,64,175,1)]';
              if (cat === 'achievements') catBtnGrad = 'bg-gradient-to-b from-[#7C3AED] to-[#4F46E5] text-white border-t border-white/20 shadow-[0_5px_0_rgba(67,56,202,1)]';
              if (cat === 'partners') catBtnGrad = 'bg-gradient-to-b from-[#E11D48] to-[#C026D3] text-white border-t border-white/20 shadow-[0_5px_0_rgba(157,23,77,1)]';
            }
            return (
              <button 
                key={cat} 
                onClick={() => setTaskCategory(cat)} 
                className={`flex-1 py-3.5 rounded-2xl text-[10px] font-black uppercase transition-all ${catBtnGrad} ${!active ? 'active:translate-y-1 active:shadow-none' : ''}`}
              >
                {cat === 'partners' ? t.partners : t[cat]}
              </button>
            );
          })}
        </div>
        <div id="tasks-list" className="p-4 space-y-3 relative z-10">
          {(() => {
            const adsTasks = tasksToShow.filter(t => t.verificationType === 'ads');
            const lastAdsTaskId = adsTasks.length > 0 ? adsTasks[adsTasks.length - 1].id : null;
            
            return tasksToShow.map((task) => {
              const isDone = (completedTaskIds || []).includes(task.id);
              const isVerifying = verifyingTaskId === task.id;
              const canClaimAchievement = task.type === 'achievement' && checkAchievementCriteria(task);
              const isAdsTask = task.verificationType === 'ads';
              
              const adTimer = adTimers[task.id] || 0;
              const isAdReady = adReady[task.id] || false;

              let themeGrad = 'from-[#0891B2] to-[#2563EB]';
              if (task.type === 'achievement') themeGrad = 'from-[#7C3AED] to-[#4F46E5]';
              if (task.type === 'partner') themeGrad = 'from-[#E11D48] to-[#C026D3]';
              if (isAdsTask) themeGrad = 'from-[#FFD700] via-[#FFA500] to-[#FF8C00]'; // Unique 3D color grading for ads
              
              // Override with custom color if provided
              const customStyle = task.color ? { background: `linear-gradient(to bottom, ${task.color}, ${task.color}dd)` } : {};

              // Dynamic Icon Matching (Prioritized)
              const title = (task.title || '').toLowerCase();
              const link = (task.link || '').toLowerCase();
              
              let displayIcon = <Bolt size={20} />;
              
              if (isAdsTask) {
                displayIcon = <Youtube size={20} />;
              } else if (title.includes('deposit')) {
                displayIcon = <Wallet size={20} />;
              } else if (link.includes('t.me')) {
                if (link.includes('bot')) {
                  displayIcon = <Gamepad2 size={20} />;
                } else {
                  displayIcon = <Send size={20} className="rotate-[-20deg]" />;
                }
              } else if (task.icon) {
                const IconComp = getIcon(task.icon);
                displayIcon = <IconComp size={20} />;
              } else {
                if (task.rewardType === 'DUCK') displayIcon = <Wallet size={20} className="text-white/80" />;
                else if (task.type === 'achievement') displayIcon = <Gamepad2 size={20} />;
              }
              
              return (
                <React.Fragment key={task.id}>
                  <div 
                    className={`p-4 rounded-[28px] bg-gradient-to-b ${themeGrad} border-t border-white/20 shadow-[0_5px_0_rgba(0,0,0,0.4)] flex flex-col transition-all ${isDone ? 'opacity-30' : 'opacity-100'} ${isAdsTask ? 'min-h-[140px] justify-center gap-4' : 'items-center justify-between flex-row'}`}
                    style={customStyle}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-10 h-10 rounded-2xl bg-black/20 flex items-center justify-center text-white shrink-0">{displayIcon}</div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-white font-black text-[13px] uppercase truncate">{task.title}</span>
                        <div className="flex flex-wrap items-center gap-2 text-[13px] font-black text-white akira-font">
                          {task.duckReward > 0 && (
                            <div className="flex items-center gap-1">
                              <DuckIcon size={20} />
                              <span className="leading-none">{formatCurrency(task.duckReward)}</span>
                            </div>
                          )}
                          {task.tonReward > 0 && (
                            <div className="flex items-center gap-1">
                              <TonIcon size={20} />
                              <span className="leading-none">{formatCurrency(task.tonReward)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {isAdsTask ? (
                      <div className="flex gap-3 w-full">
                        <button 
                          onClick={() => handleWatchAd(task.id)}
                          disabled={isDone || adTimer > 0}
                          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all border-t shadow-[0_4px_0_rgba(0,0,0,0.3)] active:translate-y-[2px] active:shadow-none ${
                            isDone || adTimer > 0
                            ? 'bg-black/20 text-white/20 border-white/5 shadow-none translate-y-[2px]' 
                            : 'bg-white text-black border-white/50'
                          }`}
                        >
                          {isDone ? 'Watched' : adTimer > 0 ? `Wait ${adTimer}s` : 'Watch Now'}
                        </button>
                        <button 
                          onClick={() => handleTaskClick(task.id)}
                          disabled={isDone || !isAdReady}
                          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all border-t shadow-[0_4px_0_rgba(0,0,0,0.3)] active:translate-y-[2px] active:shadow-none ${
                            isDone || !isAdReady
                            ? 'bg-black/20 text-white/20 border-white/5 shadow-none translate-y-[2px]' 
                            : 'bg-green-500 text-white border-white/30'
                          }`}
                        >
                          Verify
                        </button>
                      </div>
                    ) : (
                      task.type === 'achievement' ? (
                        <button 
                          onClick={() => handleTaskAction(task)}
                          disabled={isDone || !canClaimAchievement}
                          className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all border-t ${
                            isDone 
                            ? 'bg-transparent text-white/20 border-white/5' 
                            : !canClaimAchievement
                            ? 'bg-black/20 text-white/20 border-white/5'
                            : `bg-white text-black border-white/50 shadow-[0_4px_0_rgba(0,0,0,0.3)] active:translate-y-[2px] active:shadow-none`
                          }`}
                        >
                          {isDone ? t.completed : canClaimAchievement ? 'Claim' : `${task.requiredCount} Needed`}
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleTaskAction(task)}
                          disabled={isDone}
                          className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all border-t ${
                            isDone 
                            ? 'bg-transparent text-white/20 border-white/5' 
                            : isVerifying
                            ? (waitTimer > 0 ? 'bg-black/20 text-white/40 border-white/5' : 'bg-white text-black border-white/50 shadow-[0_4px_0_rgba(0,0,0,0.3)]')
                            : `bg-white text-black border-white/50 shadow-[0_4px_0_rgba(0,0,0,0.3)] active:translate-y-[2px] active:shadow-none`
                          }`}
                        >
                          {isDone ? t.completed : isVerifying ? (waitTimer > 0 ? `Wait ${waitTimer}s` : (task.verificationType === 'channel' || task.verificationType === 'group' ? 'Check' : 'Claim')) : task.btn || 'Go'}
                        </button>
                      )
                    )}
                  </div>
                  {isAdsTask && task.id === lastAdsTaskId && (
                    <div className="py-2 flex items-center gap-4 opacity-30">
                      <div className="h-[1px] flex-1 bg-white/20"></div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap">Free watch to Earn</span>
                      <div className="h-[1px] flex-1 bg-white/20"></div>
                    </div>
                  )}
                </React.Fragment>
              );
            });
          })()}
          {tasksToShow.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 opacity-20">
              <CheckSquare size={64} />
              <span className="text-xs font-black uppercase mt-4">No tasks available</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderRank = () => (
    <div className="flex-1 bg-[#0d0d0d] flex flex-col overflow-y-auto no-scrollbar pb-40 relative z-10 px-6 pt-20">
      <div className="flex flex-col items-center p-6 pt-12 pb-4 relative z-10 text-center">
        <div className="mb-2 relative">
          <div className="absolute inset-0 bg-cyan-400/20 blur-2xl animate-pulse rounded-full"></div>
          <Trophy className="text-cyan-400 relative z-10 animate-bounce" size={48} strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-black text-white uppercase mb-1">{t.leaderboard}</h1>
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-2">Top Players by Volume</p>
      </div>
      <div className="space-y-3 relative z-10">
        {isLoadingLeaderboard ? (
          Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))
        ) : leaderboard.length > 0 ? (
          leaderboard.map((player, idx) => { 
            const isRankedWithGradient = idx < 5; 
            return (
              <div 
                key={player.id} 
                className={`p-3.5 rounded-[24px] flex items-center justify-between border-t border-white/20 shadow-[0_5px_0_rgba(0,0,0,0.4)] active:translate-y-[1px] transition-all`} 
                style={{ background: isRankedWithGradient ? `linear-gradient(to right, ${player.color?.accent || '#2563EB'}, ${player.color?.main || '#1E40AF'})` : '#111' }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <span className="absolute -top-1 -left-1 z-10 w-5 h-5 bg-black/80 rounded-full flex items-center justify-center text-[10px] font-black text-white border border-white/10">{idx + 1}</span>
                    <img src={player.avatar} className="w-11 h-11 rounded-full border-[1.5px] border-white/20 shadow-md object-cover" referrerPolicy="no-referrer" />
                    {idx < 3 && <Medal className="absolute -bottom-1 -right-1 z-10" size={16} fill="#FACC15" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-black text-white uppercase tracking-tight">{player.username}</span>
                    <span className="text-[8px] font-bold text-white/50 uppercase tracking-widest">{player.wins} {t.wins}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1">
                    <span className="text-[18px] font-black text-white tracking-tighter akira-font leading-none">{formatCurrency(player.volume || 0)}</span>
                    <DuckIcon size={22} />
                  </div>
                </div>
              </div>
            ); 
          })
        ) : (
          <div className="py-20 text-center text-white/20 font-black uppercase tracking-widest">No Players Yet</div>
        )}
      </div>
    </div>
  );

  const renderProfile = () => {
    const tgUser = WebApp.initDataUnsafe?.user;
    const displayName = tgUser ? `${tgUser.first_name} ${tgUser.last_name || ''}`.trim() : (user?.displayName || 'Jahid');
    const username = tgUser ? `@${tgUser.username || tgUser.first_name}` : (user?.uid.slice(-10) || '6686954447');
    const avatar = tgUser?.photo_url || user?.photoURL || DEFAULT_AVATAR;

    return (
      <div className="flex-1 bg-[#0d0d0d] flex flex-col overflow-y-auto no-scrollbar pb-40 relative px-6 z-10 pt-12">
        {!isAuthReady ? (
          <div className="space-y-6 py-10">
            <div className="flex items-center gap-6">
              <Skeleton className="w-24 h-24 rounded-[28px]" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-44 w-full rounded-[44px]" />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-6 py-8 shrink-0 relative z-10">
              <div className="relative">
                <div 
                  onClick={handleAdminTrigger} 
                  className={`w-24 h-24 rounded-[28px] overflow-hidden shadow-2xl transition-transform flex items-center justify-center ${isAdmin ? 'active:scale-95 cursor-pointer border-[3px] border-white/20' : 'border border-white/5'}`}
                >
                  <img src={avatar} className="w-full h-full object-cover bg-[#1a1a1a]" referrerPolicy="no-referrer" />
                </div>
                <button onClick={() => setIsFrameSelectorOpen(true)} className="absolute -bottom-2 -right-2 bg-[#2563EB] p-2 rounded-xl border-t border-white/30 shadow-lg text-white active:scale-90 transition-transform">
                  <Settings size={14} fill="currentColor" />
                </button>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-black text-white uppercase">{displayName}</h2>
                  <button onClick={() => setLangIdx((langIdx + 1) % FLAGS.length)} className="text-2xl active:scale-90 transition-transform">{FLAGS[langIdx]}</button>
                </div>
                <span className="text-white/30 font-bold text-sm">{username}</span>
              </div>
            </div>
            <div className="w-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED] p-8 rounded-[44px] border-t border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.6)] mb-6 relative z-10 overflow-hidden min-h-[220px] flex items-center justify-center">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,#ffffff_1px,transparent_1px)] bg-[length:15px_15px]"></div>
              <div className="flex flex-col items-center relative z-10 w-full py-2">
                <div className="mb-6 scale-110">
                  <button 
                    onClick={() => tonConnectUI.openModal()}
                    className={`px-8 py-3 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg active:translate-y-[2px] ${connected ? 'bg-white/10 text-white border border-white/20' : 'bg-white text-black hover:bg-white/90'}`}
                  >
                    {connected ? (
                      <div className="flex items-center gap-2">
                        <Wallet size={18} />
                        {walletAddress?.slice(0, 4)}...{walletAddress?.slice(-4)}
                      </div>
                    ) : (
                      'Connect Wallet'
                    )}
                  </button>
                </div>
                {connected && (
                  <>
                    <span className="text-white/50 text-[11px] font-black uppercase tracking-widest mb-1">{t.duckBalance}</span>
                    <div className="flex items-center gap-3 mb-8">
                      <span className="text-4xl font-black text-white leading-none akira-font">{myBalance.toFixed(0)}</span>
                      <DuckIcon size={48} />
                    </div>
                    <div className="flex gap-4 w-full px-4">
                      <button onClick={handleDeposit} className={`flex-1 py-3.5 rounded-2xl ${white3DStyle}`}>{t.deposit}</button>
                      <button onClick={handleWithdrawal} className={`flex-1 py-3.5 rounded-2xl bg-white/10 font-black text-sm uppercase ${premium3DStyle}`}>{t.withdrawal}</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
        <div className="w-full p-8 rounded-[44px] bg-gradient-to-br from-[#2563EB] to-[#7C3AED] border-t border-white/20 shadow-[0_10px_40px_rgba(37,99,235,0.3)] mb-6 overflow-hidden relative min-h-[340px] flex flex-col justify-between relative z-10"><div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[length:20px_20px]"></div><div className="relative z-10 flex flex-col h-full"><h3 className="text-white font-black text-xl leading-tight uppercase mb-6 text-center">{t.inviteFriends}</h3><div className="bg-black/20 rounded-2xl p-5 mb-8 text-center border border-white/10"><span className="text-white font-bold text-[14px] break-all">t.me/GiftPhaseBot?start={user?.uid || '6686954447'}</span></div><div className="flex gap-4"><button onClick={handleCopyReferral} className={`flex-1 py-4 rounded-2xl bg-white text-black font-black text-sm uppercase shadow-lg active:translate-y-[2px] transition-all flex items-center justify-center gap-2`}><Copy size={16} /> {t.copy}</button><button onClick={handleShare} className={`flex-1 py-4 rounded-2xl bg-white/20 text-white font-black text-sm uppercase shadow-lg active:translate-y-[2px] transition-all flex items-center justify-center gap-2`}><Share2 size={16} /> {t.share}</button></div></div></div>
        <div className="mb-10 relative z-10"><div className="flex items-center gap-2 mb-4 px-2"><History size={20} className="text-white/40" /><h4 className="text-white/40 font-black uppercase text-sm tracking-widest">{t.recentActivity}</h4></div><div className="space-y-3">{ACTIVITIES.map((act, i) => (<div key={i} className={`p-4 rounded-[28px] bg-[#111] border-t border-white/5 shadow-lg flex items-center justify-between`}><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/40">{act.icon}</div><div className="flex flex-col"><span className="text-white font-black text-sm uppercase">{act.val}</span><span className="text-white/20 font-bold text-[10px] uppercase">{act.type} • {act.date}</span></div></div><ChevronRight size={18} className="text-white/10" /></div>))}</div></div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-[#0d0d0d] text-white font-['Outfit',_sans-serif] max-w-md mx-auto relative overflow-hidden">
      {!isGameLoaded && (
        <LoadingScreen 
          onPlay={startLoading} 
          onShare={handleShare} 
          onLike={handleLike}
          isLiked={isLiked}
          progress={loadingProgress} 
          isStarted={isLoadingStarted} 
        />
      )}
      <style>{`
        body { font-family: 'Outfit', sans-serif; overflow: hidden; height: 100vh; width: 100%; position: fixed; background: #0d0d0d; }
        .akira-font { 
          font-family: 'Outfit', sans-serif; 
          font-weight: 900; 
          letter-spacing: 0.05em; 
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes rise { from { transform: translateY(0); } to { transform: translateY(-110vh); } }
        @keyframes sparkle { 0%, 100% { opacity: 0; transform: scale(0.5); } 50% { opacity: 1; transform: scale(1.4); } }
        @keyframes springUp { 0% { transform: translateY(100%) scale(0.95); opacity: 0; } 70% { transform: translateY(-5%) scale(1.02); opacity: 1; } 100% { transform: translateY(0) scale(1); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes heartPop { 0% { transform: scale(1); } 50% { transform: scale(1.4); } 100% { transform: scale(1); } }
        .animate-heart-pop { animation: heartPop 0.4s ease-out; }
        .animate-spring-up { animation: springUp 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .preserve-3d { transform-style: preserve-3d; }
        .animate-in { animation-duration: 500ms; animation-fill-mode: both; }
        .fade-in { animation-name: fadeIn; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes goldWave {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gold-wave {
          background-size: 200% 200%;
          animation: goldWave 6s ease infinite;
        }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes coinFall { 0% { transform: translateY(-100%) rotate(0deg); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(500%) rotate(720deg); opacity: 0; } }
        @keyframes coinFloat { 
          0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); opacity: 0.2; } 
          50% { transform: translate3d(15px, -25px, 0) rotate(180deg); opacity: 0.7; } 
        }
        @keyframes cryptoSlide { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .animate-coin-fall { animation: coinFall linear infinite; }
        .animate-coin-float { animation: coinFloat ease-in-out infinite; }
        .animate-crypto-slide { animation: cryptoSlide 10s linear infinite; }
      `}</style>
      <SparkleBackground />
      {isAdminPanelOpen && <AdminPanel 
        isAdmin={isAdmin} 
        user={user} 
        allTasks={allTasks} 
        setIsAdminPanelOpen={setIsAdminPanelOpen} 
        t={t} 
        DuckIcon={DuckIcon} 
        TonIcon={TonIcon} 
        handleResetAllBalances={handleResetAllBalances}
      />}
      {isFrameSelectorOpen && (
        <div className="fixed inset-0 z-[600] bg-black/80 backdrop-blur-sm flex items-end justify-center p-4">
          <div className="w-full max-w-md bg-[#0a0a0a] rounded-[40px] border border-white/10 p-8 space-y-6 animate-in slide-in-from-bottom duration-300 overflow-y-auto max-h-[85vh] no-scrollbar">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-white uppercase italic">Profile Frames</h3>
              <button onClick={() => setIsFrameSelectorOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {PROFILE_FRAMES.map(frame => {
                const isUnlocked = isAdmin || userData?.unlockedFrames?.includes(frame.id) || frame.id === 'none';
                const isSelected = userData?.selectedFrame === frame.id;
                
                return (
                  <div 
                    key={frame.id} 
                    className={`p-4 rounded-[32px] border transition-all flex flex-col items-center gap-3 relative overflow-hidden ${isSelected ? 'bg-white/10 border-white/30' : 'bg-white/5 border-white/5'}`}
                  >
                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-20 flex items-center justify-center flex-col gap-2">
                        <Bolt size={24} className="text-white/40" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{frame.price} TON</span>
                        <button 
                          onClick={async () => {
                            if (tonBalance < frame.price) {
                              WebApp.showAlert("Insufficient TON balance!");
                              return;
                            }
                            try {
                              const userRef = doc(db, 'users', user.uid);
                              await updateDoc(userRef, {
                                tonBalance: increment(-frame.price),
                                unlockedFrames: arrayUnion(frame.id)
                              });
                              setTonBalance(prev => Math.max(0, prev - frame.price));
                              WebApp.HapticFeedback.notificationOccurred('success');
                            } catch (e) { console.error(e); }
                          }}
                          className="px-4 py-1.5 bg-white text-black text-[9px] font-black uppercase rounded-full"
                        >
                          Unlock
                        </button>
                      </div>
                    )}
                    
                    <div className="w-16 h-16 relative">
                      <ProfileFrame frameId={frame.id} className="w-full h-full">
                        <img src={WebApp.initDataUnsafe?.user?.photo_url || user?.photoURL || DEFAULT_AVATAR} className="w-full h-full object-cover rounded-full" alt="" />
                      </ProfileFrame>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-black text-white uppercase tracking-tight">{frame.name}</span>
                      {isUnlocked && (
                        <button 
                          onClick={async () => {
                            try {
                              const userRef = doc(db, 'users', user.uid);
                              await updateDoc(userRef, { selectedFrame: frame.id });
                              WebApp.HapticFeedback.impactOccurred('medium');
                            } catch (e) { console.error(e); }
                          }}
                          className={`mt-2 px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${isSelected ? 'bg-cyan-400 text-black' : 'bg-white/10 text-white/40'}`}
                        >
                          {isSelected ? 'Selected' : 'Select'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col h-full overflow-hidden touch-pan-y relative z-10">
        {isGameLoaded && activeTab === 'arena' && renderArena()}
        {isGameLoaded && activeTab === 'tasks' && renderTaskCenter()}
        {isGameLoaded && activeTab === 'profile' && renderProfile()}
        {isGameLoaded && activeTab === 'rank' && renderRank()}
        {isGameLoaded && activeTab === 'market' && (
          <div className="flex-1 flex flex-col p-6 relative z-10 overflow-y-auto no-scrollbar pb-40 pt-16">
            <div className="flex flex-col items-center mb-10 pt-8">
              <div className="bg-[#E91E63] px-8 py-2 rounded-lg shadow-[0_4px_0_#AD1457] border-2 border-[#FFD54F] mb-4 transform -skew-x-12">
                <h1 className="text-xl font-black text-white uppercase italic tracking-wider skew-x-12">VIP PACKS</h1>
              </div>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em]">Exclusive Rewards & Frames</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'pack_1', ducks: 100, price: 1, color: '#F3BA2F' },
                { id: 'pack_2', ducks: 205, price: 2, color: '#14F195' },
                { id: 'pack_3', ducks: 310, price: 3, color: '#FFD700' },
                { id: 'pack_4', ducks: 515, price: 5, color: '#627EEA' },
                { id: 'pack_5', ducks: 1000, price: 8.99, color: '#F7931A' },
              ].map(pack => (
                <div key={pack.id} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-b from-white/20 to-transparent rounded-[24px] blur-[1px]"></div>
                  <div className="relative h-full bg-gradient-to-b from-[#1e293b] to-[#0f172a] rounded-[24px] border-2 border-white/10 p-4 flex flex-col items-center shadow-2xl overflow-hidden min-h-[200px]">
                    {/* Radial Burst Background */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)]"></div>
                    
                    <div className="flex flex-col items-center mb-2 relative z-10 w-full">
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">DUCK PACK</span>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full py-4">
                      <div className="relative flex flex-col items-center">
                        <div className="absolute -inset-8 bg-yellow-400/20 blur-2xl rounded-full"></div>
                        <DuckIcon size={48} className="mb-3" />
                        <div className="flex flex-col items-center">
                          <span className="text-2xl font-black text-white tracking-tighter leading-none akira-font">
                            {(pack.ducks * 1000).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full relative z-10">
                      <button 
                        onClick={async () => {
                          if (!user) return;
                          if (tonBalance < pack.price) {
                            WebApp.showAlert("Insufficient TON balance!");
                            return;
                          }
                          
                          try {
                            const userRef = doc(db, 'users', user.uid);
                            await updateDoc(userRef, {
                              tonBalance: increment(-pack.price),
                              balance: increment(pack.ducks * 1000),
                              shopPurchases: arrayUnion(`${(pack.ducks * 1000).toLocaleString()} DUCK PACK`),
                              hasBoughtWithTon: true
                            });
                            setTonBalance(prev => Math.max(0, prev - pack.price));
                            setMyBalance(prev => Math.max(0, prev + (pack.ducks * 1000)));
                            setUserData(prev => prev ? { ...prev, hasBoughtWithTon: true } : prev);
                            
                            WebApp.HapticFeedback.notificationOccurred('success');
                            WebApp.showAlert(`Successfully purchased ${(pack.ducks * 1000).toLocaleString()} DUCK!`);
                          } catch (e) { console.error(e); }
                        }}
                        className={`w-full py-2.5 rounded-2xl flex items-center justify-center gap-2 bg-gradient-to-b from-white to-gray-200 shadow-[0_4px_0_rgba(0,0,0,0.2)] active:translate-y-[2px] active:shadow-none transition-all akira-font`}
                      >
                        <TonIcon size={18} />
                        <span className="text-base font-black text-black uppercase leading-none">{pack.price}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {isGameLoaded && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-black/85 backdrop-blur-3xl border-t border-white/5 z-[100] pb-9 flex justify-around items-center font-sans h-24">
          <div onClick={() => setActiveTab('market')} className={`flex flex-col items-center justify-end h-full gap-1.5 cursor-pointer transition-all ${activeTab === 'market' ? 'text-[#3498db] scale-110' : 'text-[#5d666d]'}`}><Store size={26} /><span className="text-[11px] font-bold uppercase font-sans">{t.shop}</span></div>
          <div onClick={() => setActiveTab('arena')} className={`flex flex-col items-center justify-end h-full gap-1.5 cursor-pointer transition-all ${activeTab === 'arena' ? 'text-[#2563EB] scale-110' : 'text-[#5d666d]'}`}><Gamepad2 size={26} /><span className="text-[11px] font-bold uppercase font-sans">{t.arena}</span></div>
          <div onClick={() => setActiveTab('tasks')} className={`flex flex-col items-center justify-end h-full gap-1.5 cursor-pointer transition-all ${activeTab === 'tasks' ? 'text-[#2563EB] scale-110' : 'text-[#5d666d]'}`}><ClipboardList size={26} /><span className="text-[11px] font-bold uppercase font-sans">{t.tasks}</span></div>
          <div onClick={() => setActiveTab('rank')} className={`flex flex-col items-center justify-end h-full gap-1.5 cursor-pointer transition-all ${activeTab === 'rank' ? 'text-[#2563EB] scale-110' : 'text-[#5d666d]'}`}><Trophy size={26} /><span className="text-[11px] font-bold uppercase font-sans">{t.rank}</span></div>
          <div onClick={() => setActiveTab('profile')} className={`flex flex-col items-center justify-end h-full gap-1.5 cursor-pointer transition-all ${activeTab === 'profile' ? 'text-[#2563EB] scale-110' : 'text-[#5d666d]'}`}>
            <User size={26} />
            <span className="text-[11px] font-bold uppercase font-sans">{t.profile}</span>
          </div>
        </div>
      )}
      {showWelcomePopup && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => {}}></div>
          <div className="relative w-full max-w-xs bg-[#111] rounded-[32px] border border-white/10 shadow-2xl flex flex-col items-center p-8 text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mb-6 border border-white/5">
              <Gift size={40} className="text-cyan-400" />
            </div>
            
            <h2 className="text-xl font-black text-white uppercase mb-3 leading-tight">
              {referrerName ? (
                <>Congratulations!<br /><span className="text-cyan-400 text-sm">You're invited by {referrerName}</span></>
              ) : (
                <>Welcome to GiftPhase</>
              )}
            </h2>
            
            <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-6">
              {referrerName ? "Here's your welcome bonus!" : "Here's your welcome Bonus!"}
            </p>
            
            <div className="bg-white/5 w-full py-4 rounded-2xl border border-white/5 mb-8 flex flex-col items-center">
              <div className="flex items-center gap-2 text-3xl font-black text-white italic">
                {formatCurrency(welcomeReward)} <DuckIcon size={28} />
              </div>
              <span className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-1">DUCK COINS</span>
            </div>
            
            <button 
              onClick={handleClaimWelcomeBonus}
              disabled={isClaimingWelcome}
              className={`w-full py-4 bg-cyan-400 text-black font-black uppercase rounded-2xl shadow-[0_6px_0_#0891b2] active:translate-y-1 active:shadow-none transition-all ${isClaimingWelcome ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isClaimingWelcome ? 'Claiming...' : 'Claim Now'}
            </button>
          </div>
        </div>
      )}
      {activeTab === 'arena' && status === 'winner' && persistentWinner && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center animate-in fade-in duration-500">
           <div className="absolute inset-0 backdrop-blur-2xl transition-all duration-1000" style={{ background: `radial-gradient(circle at center, rgba(37, 99, 235, 0.4), rgba(79, 70, 229, 0.3), rgba(0, 0, 0, 0.6))` }} onClick={() => resetGame()}></div>
           <div className="relative w-full max-w-md bg-[#111] rounded-t-[44px] border-t border-white/15 shadow-[0_-20px_80px_rgba(0,0,0,1)] flex flex-col items-center p-6 pt-12 pb-10 overflow-hidden max-h-[85vh] animate-spring-up">
              <div className="absolute top-8 right-8 z-10"><button onClick={() => resetGame()} className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center relative active:scale-90 transition-transform"><svg className="absolute inset-0 w-full h-full -rotate-90"><circle cx="24" cy="24" r="22" stroke="white" strokeWidth="3" fill="none" strokeOpacity="0.1" /><circle cx="24" cy="24" r="22" stroke="white" strokeWidth="3" fill="none" strokeDasharray={138.2} strokeDashoffset={138.2 - (popupTimeLeft / 5) * 138.2} className="transition-all duration-50" /></svg><X size={20} className="text-white relative z-10" /></button></div>
              <div className="text-center mb-4 mt-2"><h2 className="text-3xl font-black text-white uppercase">{persistentWinner?.username || 'Player'} won</h2></div>
              <div className="relative h-44 w-full flex items-center justify-center mb-4"><div className="absolute w-40 h-40 bg-gradient-radial from-[#2563EB]/40 via-[#4F46E5]/20 to-transparent blur-3xl animate-pulse"></div><div className="relative animate-bounce"><div className="relative"><Trophy size={90} className="text-yellow-400" /><div className="absolute -top-6 -right-6 animate-spin-slow"><Star size={40} fill="#FACC15" className="text-yellow-400" /></div></div></div></div>
              <div className="flex items-center gap-3 mb-4 w-full justify-center"><div className="bg-[#1a1a1a] px-10 py-5 rounded-[28px] border border-white/5 shadow-inner flex flex-col items-center min-w-[200px]"><span className="text-3xl font-black text-white flex items-center gap-2">{formatCurrency(persistentWinner?.totalPrize || 0)} <DuckIcon size={28} /></span><span className="text-[10px] text-white/30 uppercase font-bold mt-1">Total Prize</span></div><div className="bg-[#2563EB] px-6 py-5 rounded-[24px] border-t border-white/30 shadow-xl flex flex-col items-center"><span className="text-lg font-black text-white italic">{(persistentWinner?.totalPrize && persistentWinner?.bet) ? (persistentWinner.totalPrize / persistentWinner.bet).toFixed(2) : '1.00'}x</span><span className="text-[10px] text-white/50 uppercase font-bold mt-1">ROI</span></div></div>
              <div className="grid grid-cols-2 gap-4 w-full px-2"><div className="p-5 rounded-[32px] border-t border-white/15 shadow-xl flex flex-col items-center gap-2" style={{ background: `linear-gradient(to bottom, ${PLAYER_PALETTE[2].accent}, ${PLAYER_PALETTE[2].main})` }}><Trophy size={28} className="text-white/60" /><span className="text-sm font-black text-white flex items-center gap-1">{formatCurrency(persistentWinner?.bet || 0)} <DuckIcon size={18} /></span><span className="text-[9px] text-white/50 uppercase font-bold">Winner's Bid</span></div><div className="p-5 rounded-[32px] border-t border-white/15 shadow-xl flex flex-col items-center gap-2" style={{ background: `linear-gradient(to bottom, #A5C9FF, #2563EB)` }}><Zap size={28} className="text-white/60" /><span className="text-sm font-black text-white">{(persistentWinner?.bet && persistentWinner?.totalPrize) ? ((persistentWinner.bet/persistentWinner.totalPrize)*100).toFixed(1) : '0.0'}%</span><span className="text-[9px] text-white/50 uppercase font-bold">Win Chance</span></div></div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
