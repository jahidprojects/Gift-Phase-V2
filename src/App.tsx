import React, { useState, useEffect, useMemo, useRef, memo, Component } from 'react';
import WebApp from '@twa-dev/sdk';
import { TonConnectButton, useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
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
  getDocFromServer
} from 'firebase/firestore';
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
  UserPlus,
  Bolt,
  Medal,
  Gift,
  Wallet,
  Copy,
  Share2,
  History,
  ArrowDownCircle,
  ArrowUpCircle,
  Plus,
  Globe,
  Twitter,
  Youtube,
  Send,
  Heart
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
    top100: 'Top 100 Players by TON Volume',
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
    top100: 'Топ 100 игроков по объему TON',
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
    tonBalance: 'موجودی TON',
    inviteFriends: 'دوستان خود را دعوت کنید و ۱۰٪ از هزینه‌های آن‌ها را دریافت کنید',
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
    top100: '۱۰۰ بازیکن برتر بر اساس حجم TON',
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
    top100: 'Top 100 Spieler nach TON-Volumen',
    wins: 'Siege',
    comingSoon: 'Shop kommt bald'
  }
};

const GUEST_DATA = [];

const DAILY_TASKS = [
  { id: 'd1', title: 'Follow our Twitter', reward: '50,000', icon: <Twitter size={20} />, btn: 'Follow' },
  { id: 'd2', title: 'Subscribe YouTube', reward: '50,000', icon: <Youtube size={20} />, btn: 'Subscribe' },
  { id: 'd3', title: 'Visit Website', reward: '25,000', icon: <Globe size={20} />, btn: 'Visit' },
  { id: 'd4', title: 'Join Social Group', reward: '50,000', icon: <Send size={20} />, btn: 'Join' },
  { id: 'd5', title: 'Join News Channel', reward: '50,000', icon: <Send size={20} />, btn: 'Join' },
];

const ACHIEVEMENTS = [
  { id: 'a1', title: 'Play 50 PvP Games', goal: 50, current: 50, reward: '100,000', btn: 'Claim' },
  { id: 'a2', title: 'Invite 50 Friends', goal: 50, current: 5, reward: '500,000', btn: 'Claim' },
  { id: 'a3', title: 'Win 50 Games', goal: 50, current: 8, reward: '200,000', btn: 'Claim' },
  { id: 'a4', title: 'Deposit 1 TON', goal: 1, current: 1, reward: '100,000', btn: 'Claim' },
  { id: 'a5', title: 'Deposit 5 TON', goal: 5, current: 0, reward: '500,000', btn: 'Claim' },
  { id: 'a6', title: 'Play 100 Games', goal: 100, current: 12, reward: '250,000', btn: 'Claim' },
  { id: 'a7', title: 'Win 100 Games', goal: 100, current: 8, reward: '500,000', btn: 'Claim' },
];

const PARTNER_TASKS = [
  { id: 'p1', title: 'Follow Biz Tycoon', reward: '50,000', type: 'channel', btn: 'Join' },
  { id: 'p2', title: 'Start Biz Tycoon', reward: '50,000', type: 'start', btn: 'Start' },
  { id: 'p3', title: 'Play Biz Tycoon', reward: '75,000', type: 'game', btn: 'Play' },
  { id: 'p4', title: 'Complete Level 3', reward: '100,000', type: 'game', btn: 'Complete' },
];

const LEADERBOARD_DATA = [];

const ACTIVITIES = [
  { type: 'bid', val: '10.00 ∇', date: '2 mins ago', icon: <Bolt size={16} /> },
  { type: 'invite', val: '@monk joined', date: '1 hour ago', icon: <UserPlus size={16} /> },
  { type: 'deposit', val: '+50.0 TON', date: 'Yesterday', icon: <ArrowDownCircle size={16} /> },
  { type: 'withdraw', val: '-20.0 TON', date: '2 days ago', icon: <ArrowUpCircle size={16} /> },
];

const PROMO_BANNERS = [
  { id: 1, title: 'WIN BIG IN ARENA', desc: 'Predict the puck & win TON daily!', grad: 'from-[#0891B2] to-[#2563EB]', icon: <Gamepad2 size={32} /> },
  { id: 2, title: 'INVITE & EARN 10%', desc: 'Get rewards for every friend spending.', grad: 'from-[#E11D48] to-[#C026D3]', icon: <UserPlus size={32} /> },
  { id: 3, title: 'PUCK AIRDROP', desc: 'Complete all tasks for 1M PUCK bonus.', grad: 'from-[#7C3AED] to-[#4F46E5]', icon: <Gift size={32} /> },
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
const LoadingScreen = ({ onPlay, onShare, progress, isStarted }: { onPlay: () => void, onShare: () => void, progress: number, isStarted: boolean }) => {
  return (
    <div className="fixed inset-0 z-[300] bg-[#60A5FA] flex flex-col items-center justify-center p-6 font-sans overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
      
      <div className="w-full max-w-xs bg-[#4F86C6]/80 backdrop-blur-md rounded-[40px] p-8 flex flex-col items-center shadow-2xl border border-white/20 relative z-10">
        <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-yellow-300 rounded-3xl mb-6 flex items-center justify-center shadow-lg overflow-hidden border-2 border-white/30">
           <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop" className="w-full h-full object-cover" alt="Gift Phase V2" referrerPolicy="no-referrer" />
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
          <button className="w-14 h-14 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center text-white transition-all border-t border-white/20 shadow-lg active:translate-y-[1px]">
            <Heart size={20} />
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
              <span className="text-white font-black text-lg uppercase tracking-widest drop-shadow-md relative z-10">
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
                <img src={t.avatar} className="w-full h-full rounded-full border-[1.5px] border-black/10 shadow-lg" alt="" referrerPolicy="no-referrer" />
              </div>
            </foreignObject>
          </g>
        </g>
      ))}
    </svg>
  );
});

const App = () => {
  const [activeTab, setActiveTab] = useState('arena');
  const [players, setPlayers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [status, setStatus] = useState('waiting'); 
  const [winner, setWinner] = useState(null);
  const [persistentWinner, setPersistentWinner] = useState(null);
  const [myBalance, setMyBalance] = useState(0);
  const [puckBalance, setPuckBalance] = useState(0);
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
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);
  const [isGameLoaded, setIsGameLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoadingStarted, setIsLoadingStarted] = useState(false);
  const [hasPlayedBefore, setHasPlayedBefore] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('giftphase_played') === 'true';
    }
    return false;
  });

  const [tonConnectUI] = useTonConnectUI();
  const userAddress = useTonAddress();

  // Firebase Auth & Profile Sync with Telegram Identity
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const tgUser = WebApp.initDataUnsafe?.user;
        const referrerId = WebApp.initDataUnsafe?.start_param;
        
        setUser(firebaseUser);
        const userRef = doc(db, 'users', firebaseUser.uid);
        try {
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setMyBalance(userData.balance || 0);
            setPuckBalance(userData.puckBalance || 0);
            setCompletedTaskIds(userData.completedTasks || []);
            
            // Sync TG name if changed
            if (tgUser && userData.username !== `@${tgUser.username || tgUser.first_name}`) {
              updateDoc(userRef, {
                username: `@${tgUser.username || tgUser.first_name}`,
                avatar: tgUser.photo_url || userData.avatar
              });
            }
          } else {
            // Create initial profile with 10 TON Bonus
            const initialData = {
              uid: firebaseUser.uid,
              tgId: tgUser?.id || null,
              username: tgUser ? `@${tgUser.username || tgUser.first_name}` : `User_${firebaseUser.uid.slice(0, 5)}`,
              avatar: tgUser?.photo_url || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop',
              balance: 10.0,
              puckBalance: 100000,
              wins: 0,
              volume: 0,
              completedTasks: [],
              referrer: referrerId || null,
              createdAt: serverTimestamp()
            };
            await setDoc(userRef, initialData);
            setMyBalance(10.0);
            
            // If referred, we could add logic here to reward the referrer
            if (referrerId) {
              const refDoc = doc(db, 'users', referrerId);
              updateDoc(refDoc, {
                balance: increment(1.0), // 1 TON bonus for referrer
                referralCount: increment(1)
              }).catch(() => {}); // Ignore if referrer doesn't exist
            }
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
        }
      } else {
        signInAnonymously(auth).catch(console.error);
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Sync Leaderboard
  useEffect(() => {
    if (!isAuthReady) return;
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

  // Sync Game State
  useEffect(() => {
    if (!isAuthReady) return;
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
    localStorage.setItem('hegmo_balance', myBalance.toString());
  }, [myBalance]);

  useEffect(() => {
    localStorage.setItem('hegmo_tasks', JSON.stringify(completedTaskIds));
  }, [completedTaskIds]);

  useEffect(() => {
    localStorage.setItem('hegmo_wallet_connected', isWalletConnected.toString());
  }, [isWalletConnected]);

  useEffect(() => {
    localStorage.setItem('hegmo_lang', langIdx.toString());
  }, [langIdx]);

  const promoRef = useRef(null);

  const [lastWinner, setLastWinner] = useState({ 
    username: '@elena_win', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop', 
    winChance: '14.2', amount: '7.74', color: PLAYER_PALETTE[2].main, accentColor: PLAYER_PALETTE[2].accent 
  });
  const [topWinner, setTopWinner] = useState({ 
    username: '@alex_pro', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop', 
    winChance: '5.4', amount: '13k', color: PLAYER_PALETTE[0].main, accentColor: PLAYER_PALETTE[0].accent 
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
      return { 
        ...player, 
        points: pts.map(pt => `${pt.x},${pt.y}`).join(' '), 
        avatarPos: { x: center.x + (bPt.x - center.x) * 0.72, y: center.y + (bPt.y - center.y) * 0.72 },
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
        
        // Update Top/Recent Winners UI
        setLastWinner({
          username: resWinner.username,
          avatar: resWinner.avatar,
          winChance: ((resWinner.bet / totalPot) * 100).toFixed(1),
          amount: winAmount.toFixed(2),
          color: resWinner.color,
          accentColor: resWinner.accentColor
        });

        setTopWinner(prev => {
          const currentVal = winAmount;
          const prevVal = parseFloat(prev.amount.replace(/[^\d.]/g, '')) || 0;
          if (currentVal > prevVal) {
            return {
              username: resWinner.username,
              avatar: resWinner.avatar,
              winChance: ((resWinner.bet / totalPot) * 100).toFixed(1),
              amount: winAmount.toFixed(2),
              color: resWinner.color,
              accentColor: resWinner.accentColor
            };
          }
          return prev;
        });
        
        // Sync to Firestore
        if (user) {
          try {
            updateDoc(doc(db, 'games', 'current'), {
              status: 'winner',
              winner: resWinner
            });
            // Update winner's stats if it's the current user
            if (resWinner.isMe) {
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
    
    if (isMe) {
      WebApp.HapticFeedback.impactOccurred('medium');
    }

    const finalAmt = isMe && amt > myBalance ? myBalance : amt;
    
    const tgUser = WebApp.initDataUnsafe?.user;
    const n = isMe ? (tgUser ? `@${tgUser.username || tgUser.first_name}` : 'User') : bot.name;
    const a = isMe ? (tgUser?.photo_url || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop') : bot.avatar;
    
    if (isMe) {
      setMyBalance(prev => Math.max(0, prev - finalAmt));
      if (user) {
        try {
          await updateDoc(doc(db, 'users', user.uid), {
            balance: increment(-finalAmt),
            volume: increment(finalAmt)
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
      } else if (currentPlayers.length < 15) {
        const pal = PLAYER_PALETTE[currentPlayers.length % PLAYER_PALETTE.length];
        const newPlayer = { username: n, avatar: a, bet: finalAmt, color: pal.main, lightColor: pal.light, accentColor: pal.accent, isMe, id: Date.now() + Math.random() };
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

  const handleTaskClick = async (taskId) => {
    if (!taskId || completedTaskIds.includes(taskId) || !user) return;
    const task = [...DAILY_TASKS, ...ACHIEVEMENTS, ...PARTNER_TASKS].find(t => t.id === taskId);
    if (task) {
      const reward = parseFloat(task.reward.replace(/,/g, ''));
      setCompletedTaskIds(prev => [...prev, taskId]);
      setPuckBalance(prev => prev + reward);
      
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          completedTasks: arrayUnion(taskId),
          puckBalance: increment(reward)
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
      }
    }
  };

  const handleDeposit = async () => {
    const amount = parseFloat(prompt("Enter TON amount to deposit:", "10") || "0");
    if (!isNaN(amount) && amount > 0 && user) {
      setMyBalance(prev => prev + amount);
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          balance: increment(amount)
        });
        alert(`Successfully deposited ${amount} TON!`);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
      }
    }
  };

  const handleWithdrawal = async () => {
    const amount = parseFloat(prompt("Enter TON amount to withdraw:", "10") || "0");
    if (!isNaN(amount) && amount > 0 && user) {
      if (amount <= myBalance) {
        setMyBalance(prev => prev - amount);
        try {
          await updateDoc(doc(db, 'users', user.uid), {
            balance: increment(-amount)
          });
          alert(`Successfully withdrawn ${amount} TON!`);
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
        }
      } else {
        alert("Insufficient balance!");
      }
    }
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`t.me/GiftPhaseBot?start=${user?.uid || '6686954447'}`);
    alert("Referral link copied to clipboard!");
  };

  const handleShare = () => {
    const shareUrl = `t.me/GiftPhaseBot?start=${user?.uid || '6686954447'}`;
    if (typeof window !== 'undefined' && WebApp.initData) {
      WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('Join me in Gift Phase V2 and win TON!')}`);
    } else if (navigator.share) {
      navigator.share({
        title: 'Gift Phase V2',
        text: 'Join me in Gift Phase V2 and win TON!',
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
          localStorage.setItem('giftphase_played', 'true');
          setHasPlayedBefore(true);
        }, 500);
      } else {
        setLoadingProgress(currentProgress);
      }
    }, 100); // 100ms * 50 steps = 5 seconds
  };

  const premium3DStyle = `bg-gradient-to-b from-white/15 to-white/5 border-t border-white/20 shadow-[0_5px_0_rgba(0,0,0,0.4)] active:translate-y-[2px] active:shadow-[0_2px_0_rgba(0,0,0,0.4)] transition-all duration-75`;
  const white3DStyle = `bg-white border-t border-white/50 shadow-[0_5px_0_rgba(0,0,0,0.4)] active:translate-y-[2px] active:shadow-[0_2px_0_rgba(0,0,0,0.4)] transition-all duration-75 text-black font-black`;

  const formatCurrency = (val) => {
    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
    if (val >= 1000) return (val / 1000).toFixed(0) + 'k';
    return val.toString();
  };

  const renderArena = () => {
    const isBidDisabled = (status !== 'waiting') || (timeLeft === 1 && players.length >= 2);

    return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar pb-40 relative font-sans overscroll-contain z-10 pt-12">
      <div className="flex justify-between items-center p-4 pt-6 gap-3 shrink-0">
        <div className={`px-3 py-2.5 rounded-full flex-1 flex items-center justify-center gap-1.5 min-w-0 font-sans ${premium3DStyle}`}><span className="text-[14px]">🪙</span><span className="text-[14px] font-black uppercase">{formatCurrency(puckBalance)} PUCK</span></div>
        <div className="bg-black/40 px-3 py-2 rounded-full border border-white/5 flex items-center gap-2 shrink-0 font-sans"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]"></div><span className="text-[11px] font-bold text-gray-300">117 online</span></div>
        <div className={`px-3 py-2.5 rounded-full flex-1 flex items-center justify-center gap-1 min-w-0 font-sans ${premium3DStyle}`}><span className="text-[14px]">💎</span><span className="text-[14px] font-black uppercase">{myBalance.toFixed(0)} TON</span></div>
      </div>
      <div className="px-4 grid grid-cols-2 gap-3 mb-5 mt-2 shrink-0">
        <div className={`rounded-2xl p-2.5 flex items-center justify-between border-t border-white/20 shadow-[0_5px_0_rgba(0,0,0,0.4)]`} style={{ background: `linear-gradient(to bottom, ${topWinner.accentColor}, ${topWinner.color})` }}><div className="flex items-center gap-2 min-w-0"><img src={topWinner.avatar} className="w-6 h-6 rounded-full border border-white/10" referrerPolicy="no-referrer" /><div className="flex flex-col min-w-0"><span className="text-[7px] text-white/60 font-black uppercase">{t.topWin}</span><span className="text-[9px] font-bold text-white truncate">{topWinner.username}</span></div></div><div className="flex flex-col items-end shrink-0 ml-1"><span className="text-[9px] font-black text-white">{topWinner.amount} ∇</span><span className="text-[7px] font-bold text-white/50">{topWinner.winChance}%</span></div></div>
        <div className={`rounded-2xl p-2.5 flex items-center justify-between border-t border-white/20 shadow-[0_5px_0_rgba(0,0,0,0.4)]`} style={{ background: `linear-gradient(to bottom, ${lastWinner.accentColor}, ${lastWinner.color})` }}><div className="flex items-center gap-2 min-w-0"><img src={lastWinner.avatar} className="w-6 h-6 rounded-full border border-white/10" referrerPolicy="no-referrer" /><div className="flex flex-col min-w-0"><span className="text-[7px] text-white/60 font-black uppercase">{t.lastWin}</span><span className="text-[9px] font-bold text-white truncate">{lastWinner.username}</span></div></div><div className="flex flex-col items-end shrink-0 ml-1"><span className="text-[9px] font-black text-white">{lastWinner.amount} ∇</span><span className="text-[7px] font-bold text-white/50">{lastWinner.winChance}%</span></div></div>
      </div>
      <div className="px-4 flex justify-between items-end mb-3 px-1 font-sans shrink-0"><div><span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{t.totalPool}</span><div className="text-cyan-400 font-black text-2xl tracking-tighter">{totalPot.toFixed(2)} ∇</div></div><div className="text-right"><span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{t.startingIn}</span><div className="font-mono text-2xl font-black">00:{timeLeft.toString().padStart(2, '0')}</div></div></div>
      <div className="mx-4 relative group shrink-0"><div className="relative aspect-square rounded-[44px] overflow-hidden border-[6px] border-[#1a1a1a] bg-[#111] shadow-2xl mb-6">{players.length === 0 ? <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-black uppercase text-center px-10 italic">{t.waiting}</div> : (<div className={`absolute inset-0 transition-transform duration-[450ms] ease-out ${isZoomed ? 'scale-[2.8]' : 'scale-100'}`} style={{ transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%` }}><StaticBoard territories={territories} winner={winner} /></div>)}<div className={`absolute z-[60] w-14 h-14 transition-opacity duration-300 pointer-events-none flex flex-col items-center justify-center ${status === 'drawing' || status === 'winner' ? 'opacity-100' : 'opacity-0'}`} style={{ left: `${selectorPos.x}%`, top: `${selectorPos.y}%`, transform: 'translate(-50%, -50%)' }}>{status === 'drawing' && hoverInfo.name && (<div key={hoverInfo.name} className={`absolute bg-black/95 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 flex items-center gap-2.5 shadow-2xl animate-in slide-in-from-bottom-1 fade-in duration-150 transition-all ${selectorPos.y < 25 ? 'top-14 translate-y-2' : '-top-14 -translate-y-2'}`}><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hoverInfo.color }}></div><span className="text-[6.5px] font-black uppercase tracking-widest text-white">{hoverInfo.name}</span></div>)}{isAiming && <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transform: `rotate(${selectorAngle}deg)` }}><ArrowUp size={34} className="text-white drop-shadow-[0_0_15px_white] -translate-y-9 animate-pulse" /></div>}<div className="w-full h-full bg-white/20 backdrop-blur-[3.5px] rounded-full border-[3.5px] border-white shadow-[0_0_30px_rgba(255,255,255,0.45)] relative flex items-center justify-center overflow-hidden"><div className="absolute w-full h-[1px] bg-white/40"></div><div className="absolute h-full w-[1px] bg-white/40"></div><div className="relative z-10 w-4 h-4 flex items-center justify-center"><div className="absolute w-4 h-[2.5px] bg-white shadow-[0_0_8px_white] text-transparent">.</div><div className="absolute h-4 w-[2.5px] bg-white shadow-[0_0_8px_white] text-transparent">.</div></div></div></div></div></div>
      <div className="px-4 w-full flex items-center gap-3 mb-8 mt-2 shrink-0"><button disabled={isBidDisabled} onClick={() => addBid(20, true)} className={`${premium3DStyle} w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${isBidDisabled ? 'opacity-50 grayscale' : ''}`}><Pencil size={24} className="text-white" /></button>{[1, 5, 10].map(v => <button key={v} disabled={isBidDisabled} onClick={() => addBid(v, true)} className={`${premium3DStyle} flex-1 h-14 rounded-[24px] font-black text-lg ${isBidDisabled ? 'opacity-50 grayscale' : ''}`}>{v} <span className="opacity-40 text-xs">∇</span></button>)}<button disabled={isBidDisabled} onClick={() => addBid(myBalance, true)} className={`flex-1 h-14 rounded-[24px] font-black text-[13px] bg-gradient-to-b from-[#2563EB] to-[#1E40AF] border-t border-white/30 shadow-[0_5px_0_rgba(0,0,0,0.4)] active:translate-y-[1px] uppercase transition-all ${isBidDisabled ? 'opacity-50 grayscale' : ''}`}>All-in</button></div>

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
        <div className="space-y-3">
          {players.map((p, i) => (
            <div key={i} className="p-3.5 rounded-[24px] flex items-center justify-between border-t border-white/20 shadow-[0_5px_0_rgba(0,0,0,0.4)] active:translate-y-[1px] transition-all" style={{ background: `linear-gradient(to right, ${p.accentColor}, ${p.color})` }}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={p.avatar} className="w-10 h-10 rounded-full border-[1.5px] border-white/20 shadow-md" alt="" referrerPolicy="no-referrer" />
                  {p.isMe && <div className="absolute -top-1 -right-1 bg-white text-black text-[7px] font-black px-1 rounded-full border border-black/10">YOU</div>}
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] font-black text-white uppercase tracking-tight">{p.username}</span>
                  <span className="text-[8px] font-bold text-white/50 uppercase tracking-widest">Arena Participant</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1">
                  <span className="text-[14px] font-black text-white tracking-tighter">{p.bet.toFixed(2)}</span>
                  <span className="text-[10px] font-black text-white/60 uppercase">∇</span>
                </div>
                <span className="text-[8px] font-bold text-white/40 uppercase">TON</span>
              </div>
            </div>
          ))}
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
    let tasksToShow = [];
    let themeGrad = 'from-[#0891B2] to-[#2563EB]';
    if (taskCategory === 'daily') tasksToShow = DAILY_TASKS;
    else if (taskCategory === 'achievements') { tasksToShow = ACHIEVEMENTS; themeGrad = 'from-[#7C3AED] to-[#4F46E5]'; }
    else { tasksToShow = PARTNER_TASKS; themeGrad = 'from-[#E11D48] to-[#C026D3]'; }

    return (
      <div className="flex-1 bg-[#0d0d0d] flex flex-col overflow-y-auto no-scrollbar pb-40 relative font-sans overscroll-contain z-10 pt-12">
        <div className="absolute top-0 left-0 right-0 h-[450px] bg-gradient-to-b from-[#2563EB]/25 via-[#1E40AF]/5 to-transparent pointer-events-none"></div>
        <div className="w-full px-4 pt-10 shrink-0 relative z-20"><div ref={promoRef} className="w-full h-44 overflow-x-auto snap-x snap-mandatory no-scrollbar flex gap-4 scroll-smooth">{PROMO_BANNERS.map((promo) => (<div key={promo.id} className={`min-w-full h-full rounded-[36px] bg-gradient-to-br ${promo.grad} snap-center flex items-center p-8 border-t border-white/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden relative`}><div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[length:15px_15px]"></div><div className="flex-1 flex flex-col gap-2 relative z-10"><h3 className="text-2xl font-black text-white uppercase italic">{promo.title}</h3><p className="text-white/70 font-bold text-xs uppercase">{promo.desc}</p><button className="mt-2 bg-white/20 px-4 py-1.5 rounded-full border border-white/20 text-[10px] font-black uppercase text-white">Learn More</button></div><div className="text-white/20 relative z-10">{promo.icon}</div></div>))}</div><div className="flex justify-center gap-1.5 mt-4">{PROMO_BANNERS.map((_, i) => (<div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${promoIndex === i ? 'bg-cyan-400 w-4 shadow-[0_0_8px_#22d3ee]' : 'bg-white/10'}`} />))}</div></div>
        <div className="p-6 pt-6 pb-4 relative z-10 shrink-0 text-center"><h1 className="text-3xl font-black text-white uppercase mb-1">{t.taskCenter}</h1><p className="text-white/40 text-xs font-bold uppercase tracking-widest">{t.completeTasks}</p></div>
        <div className="flex gap-2 px-4 mb-6 relative z-10 shrink-0">{['daily', 'achievements', 'partners'].map((cat) => { const active = taskCategory === cat; let catBtnGrad = 'bg-[#111] text-white/40 border-t border-white/5 shadow-[0_5px_0_rgba(0,0,0,0.4)]'; if (active) { if (cat === 'daily') catBtnGrad = 'bg-gradient-to-b from-[#0891B2] to-[#2563EB] text-white border-t border-white/20 shadow-[0_5px_0_rgba(30,64,175,1)]'; if (cat === 'achievements') catBtnGrad = 'bg-gradient-to-b from-[#7C3AED] to-[#4F46E5] text-white border-t border-white/20 shadow-[0_5px_0_rgba(67,56,202,1)]'; if (cat === 'partners') catBtnGrad = 'bg-gradient-to-b from-[#E11D48] to-[#C026D3] text-white border-t border-white/20 shadow-[0_5px_0_rgba(157,23,77,1)]'; } return (<button key={cat} onClick={() => setTaskCategory(cat)} className={`flex-1 py-3.5 rounded-2xl text-[10px] font-black uppercase transition-all ${catBtnGrad} ${!active ? 'active:translate-y-1 active:shadow-none' : ''}`}>{cat === 'partners' ? t.partners : t[cat]}</button>); })}</div>
        <div className="p-4 space-y-3 relative z-10">{tasksToShow.map((task) => { const isDone = (completedTaskIds || []).includes(task.id); const canClaim = taskCategory === 'achievements' ? (task.current >= task.goal) : true; let displayIcon = task.icon || <Bolt size={20} />; if (taskCategory === 'achievements') displayIcon = <Gamepad2 size={20} />; if (taskCategory === 'partners') displayIcon = task.type === 'channel' ? <Send size={20} className="rotate-[-20deg]" /> : <Gamepad2 size={20} />; return (<div key={task.id} className={`p-4 rounded-[28px] bg-gradient-to-b ${themeGrad} border-t border-white/20 shadow-[0_5px_0_rgba(0,0,0,0.4)] flex items-center justify-between transition-all ${isDone ? 'opacity-30' : 'opacity-100'}`}><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-2xl bg-black/20 flex items-center justify-center text-white">{displayIcon}</div><div className="flex flex-col"><span className="text-white font-black text-[13px] uppercase truncate max-w-[140px]">{task.title}</span><div className="flex items-center gap-1 text-[11px] font-bold text-white/70"><Zap size={10} fill="currentColor" /><span>{task.reward} PUCK</span></div></div></div><button onClick={() => handleTaskClick(task.id)} disabled={isDone || (taskCategory === 'achievements' && !canClaim)} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all border-t ${isDone ? 'bg-transparent text-white/20 border-white/5' : (taskCategory === 'achievements' && !canClaim) ? 'bg-black/10 text-white/10 border-white/5 opacity-50' : `bg-white text-black border-white/50 shadow-[0_4px_0_rgba(0,0,0,0.3)] active:translate-y-[2px] active:shadow-none`}`}>{task.btn}</button></div>); })}</div>
      </div>
    );
  };

  const renderRank = () => (
    <div className="flex-1 bg-[#0d0d0d] flex flex-col overflow-y-auto no-scrollbar pb-40 relative z-10 px-4 pt-12">
      <div className="flex flex-col items-center p-6 pt-10 pb-4 relative z-10 text-center">
        <div className="mb-2 relative">
          <div className="absolute inset-0 bg-cyan-400/20 blur-2xl animate-pulse rounded-full"></div>
          <Trophy className="text-cyan-400 relative z-10 animate-bounce" size={48} strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-black text-white uppercase mb-1">{t.leaderboard}</h1>
        <p className="text-white/40 text-sm font-bold uppercase tracking-wide">{t.top100}</p>
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
                style={{ background: isRankedWithGradient ? `linear-gradient(to right, ${player.color.accent}, ${player.color.main})` : '#111' }}
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
                    <span className="text-[14px] font-black text-white tracking-tighter">{player.volume}</span>
                    <span className="text-[10px] font-black text-white/60 uppercase">∇</span>
                  </div>
                  <span className="text-[8px] font-bold text-white/40 uppercase">TON</span>
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
    const avatar = tgUser?.photo_url || user?.photoURL || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop";

    return (
      <div className="flex-1 bg-[#0d0d0d] flex flex-col overflow-y-auto no-scrollbar pb-40 relative px-4 z-10 pt-12">
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
            <div className="flex items-center gap-6 py-10 shrink-0 relative z-10">
              <div className="relative">
                <div className="w-24 h-24 rounded-[28px] overflow-hidden border-[3px] border-white/10 shadow-2xl">
                  <img src={avatar} className="w-full h-full object-cover bg-[#1a1a1a]" referrerPolicy="no-referrer" />
                </div>
                <button className="absolute -bottom-2 -right-2 bg-[#2563EB] p-2 rounded-xl border-t border-white/30 shadow-lg text-white">
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
                  <TonConnectButton />
                </div>
                {userAddress && (
                  <>
                    <span className="text-white/50 text-[11px] font-black uppercase tracking-widest mb-1">{t.tonBalance}</span>
                    <div className="flex items-center gap-2 mb-8">
                      <span className="text-4xl font-black text-white leading-none">{myBalance.toFixed(2)}</span>
                      <div className="w-8 h-8 rounded-full bg-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                        <span className="text-[14px]">💎</span>
                      </div>
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
          progress={loadingProgress} 
          isStarted={isLoadingStarted} 
        />
      )}
      <style>{`
        body { font-family: 'Outfit', sans-serif; overflow: hidden; height: 100vh; width: 100%; position: fixed; background: #0d0d0d; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes rise { from { transform: translateY(0); } to { transform: translateY(-110vh); } }
        @keyframes sparkle { 0%, 100% { opacity: 0; transform: scale(0.5); } 50% { opacity: 1; transform: scale(1.4); } }
        @keyframes springUp { 0% { transform: translateY(100%) scale(0.95); opacity: 0; } 70% { transform: translateY(-5%) scale(1.02); opacity: 1; } 100% { transform: translateY(0) scale(1); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-spring-up { animation: springUp 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .preserve-3d { transform-style: preserve-3d; }
        .animate-in { animation-duration: 500ms; animation-fill-mode: both; }
        .fade-in { animation-name: fadeIn; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
      <SparkleBackground />
      <div className="flex-1 flex flex-col h-full overflow-hidden touch-pan-y relative z-10">
        {isGameLoaded && activeTab === 'arena' && renderArena()}
        {isGameLoaded && activeTab === 'tasks' && renderTaskCenter()}
        {isGameLoaded && activeTab === 'profile' && renderProfile()}
        {isGameLoaded && activeTab === 'rank' && renderRank()}
        {isGameLoaded && activeTab === 'market' && <div className="flex-1 flex items-center justify-center text-[#444] font-black uppercase tracking-widest relative z-10">{t.comingSoon}</div>}
      </div>
      {isGameLoaded && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-black/85 backdrop-blur-3xl border-t border-white/5 z-[100] pb-9 flex justify-around items-center font-sans h-24">
          <div onClick={() => setActiveTab('market')} className={`flex flex-col items-center justify-end h-full gap-1.5 cursor-pointer transition-all ${activeTab === 'market' ? 'text-[#3498db] scale-110' : 'text-[#5d666d]'}`}><Store size={26} /><span className="text-[11px] font-bold uppercase font-sans">{t.shop}</span></div>
          <div onClick={() => setActiveTab('arena')} className={`flex flex-col items-center justify-end h-full gap-1.5 cursor-pointer transition-all ${activeTab === 'arena' ? 'text-[#2563EB] scale-110' : 'text-[#5d666d]'}`}><Gamepad2 size={26} /><span className="text-[11px] font-bold uppercase font-sans">{t.arena}</span></div>
          <div onClick={() => setActiveTab('tasks')} className={`flex flex-col items-center justify-end h-full gap-1.5 cursor-pointer transition-all ${activeTab === 'tasks' ? 'text-[#2563EB] scale-110' : 'text-[#5d666d]'}`}><ClipboardList size={26} /><span className="text-[11px] font-bold uppercase font-sans">{t.tasks}</span></div>
          <div onClick={() => setActiveTab('rank')} className={`flex flex-col items-center justify-end h-full gap-1.5 cursor-pointer transition-all ${activeTab === 'rank' ? 'text-[#2563EB] scale-110' : 'text-[#5d666d]'}`}><Trophy size={26} /><span className="text-[11px] font-bold uppercase font-sans">{t.rank}</span></div>
          <div onClick={() => setActiveTab('profile')} className={`flex flex-col items-center justify-end h-full gap-1.5 cursor-pointer transition-all ${activeTab === 'profile' ? 'text-[#2563EB] scale-110' : 'text-[#5d666d]'}`}>
            <div className={`w-[38px] h-[38px] rounded-full overflow-hidden border-[2px] transition-all shadow-sm aspect-square flex items-center justify-center ${activeTab === 'profile' ? 'border-[#2563EB] grayscale-0' : 'border-white/10 grayscale opacity-50'}`}>
              <img src={user?.photoURL || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop"} alt="Me" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <span className="text-[11px] font-bold uppercase font-sans">{t.profile}</span>
          </div>
        </div>
      )}
      {activeTab === 'arena' && status === 'winner' && persistentWinner && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center animate-in fade-in duration-500">
           <div className="absolute inset-0 backdrop-blur-2xl transition-all duration-1000" style={{ background: `radial-gradient(circle at center, rgba(37, 99, 235, 0.4), rgba(79, 70, 229, 0.3), rgba(0, 0, 0, 0.6))` }} onClick={() => resetGame()}></div>
           <div className="relative w-full max-w-md bg-[#111] rounded-t-[44px] border-t border-white/15 shadow-[0_-20px_80px_rgba(0,0,0,1)] flex flex-col items-center p-6 pt-12 pb-10 overflow-hidden max-h-[85vh] animate-spring-up">
              <div className="absolute top-8 right-8 z-10"><button onClick={() => resetGame()} className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center relative active:scale-90 transition-transform"><svg className="absolute inset-0 w-full h-full -rotate-90"><circle cx="24" cy="24" r="22" stroke="white" strokeWidth="3" fill="none" strokeOpacity="0.1" /><circle cx="24" cy="24" r="22" stroke="white" strokeWidth="3" fill="none" strokeDasharray={138.2} strokeDashoffset={138.2 - (popupTimeLeft / 5) * 138.2} className="transition-all duration-50" /></svg><X size={20} className="text-white relative z-10" /></button></div>
              <div className="text-center mb-4 mt-2"><h2 className="text-3xl font-black text-white uppercase">{persistentWinner?.username || 'Player'} won</h2></div>
              <div className="relative h-44 w-full flex items-center justify-center mb-4"><div className="absolute w-40 h-40 bg-gradient-radial from-[#2563EB]/40 via-[#4F46E5]/20 to-transparent blur-3xl animate-pulse"></div><div className="relative animate-bounce"><div className="relative"><Trophy size={90} className="text-yellow-400 drop-shadow-[0_0_40px_rgba(250,204,21,0.8)]" /><div className="absolute -top-6 -right-6 animate-spin-slow"><Star size={40} fill="#FACC15" className="text-yellow-400" /></div></div></div></div>
              <div className="flex items-center gap-3 mb-4 w-full justify-center"><div className="bg-[#1a1a1a] px-10 py-5 rounded-[28px] border border-white/5 shadow-inner flex flex-col items-center min-w-[200px]"><span className="text-3xl font-black text-white">{persistentWinner?.totalPrize?.toFixed(2) || '0.00'} TON</span><span className="text-[10px] text-white/30 uppercase font-bold mt-1">Total Prize</span></div><div className="bg-[#2563EB] px-6 py-5 rounded-[24px] border-t border-white/30 shadow-xl flex flex-col items-center"><span className="text-lg font-black text-white italic">{(persistentWinner?.totalPrize && persistentWinner?.bet) ? (persistentWinner.totalPrize / persistentWinner.bet).toFixed(2) : '1.00'}x</span><span className="text-[10px] text-white/50 uppercase font-bold mt-1">ROI</span></div></div>
              <div className="grid grid-cols-2 gap-4 w-full px-2"><div className="p-5 rounded-[32px] border-t border-white/15 shadow-xl flex flex-col items-center gap-2" style={{ background: `linear-gradient(to bottom, ${PLAYER_PALETTE[2].accent}, ${PLAYER_PALETTE[2].main})` }}><Trophy size={28} className="text-white/60" /><span className="text-sm font-black text-white">{(persistentWinner?.bet || 0).toFixed(2)} ∇</span><span className="text-[9px] text-white/50 uppercase font-bold">Winner's Bid</span></div><div className="p-5 rounded-[32px] border-t border-white/15 shadow-xl flex flex-col items-center gap-2" style={{ background: `linear-gradient(to bottom, #A5C9FF, #2563EB)` }}><Zap size={28} className="text-white/60" /><span className="text-sm font-black text-white">{(persistentWinner?.bet && persistentWinner?.totalPrize) ? ((persistentWinner.bet/persistentWinner.totalPrize)*100).toFixed(1) : '0.0'}%</span><span className="text-[9px] text-white/50 uppercase font-bold">Win Chance</span></div></div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
