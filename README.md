# 🎁 Gift Phase V2

**Gift Phase V2** is a premium, high-performance Telegram Mini App (TMA) ecosystem designed for engagement, competition, and rewards. Built with a polished 3D aesthetic, it combines physics-based gaming with a robust task-and-reward economy.

---

## 🚀 Key Features

### 🎮 Game Arena (Hegmo Arena)
A carrom-style physics-based arena game where players compete in real-time. Featuring smooth animations, 3D styling, and high-stakes bidding.

### 📋 Advanced Task Center
A multi-category task system designed to keep users engaged:
- **Daily Tasks:** Repeatable tasks with configurable reset timers (Hours).
- **Adsgram Integration:** "WACH ADS GET DUCK" — Watch video ads to earn instant DUCK rewards with a custom second-based reset timer.
- **Achievement Tasks:** Long-term goals based on user activity (referrals, games played, wins).
- **Partner Tasks:** Collaboration tasks to grow the ecosystem.
- **Dynamic Sorting:** Incomplete tasks stay at the top; completed tasks move to the bottom with 15% opacity.

### 👥 Referral System (Invite & Earn)
Grow the community with a multi-tier referral system. Users earn a percentage of their friends' rewards, fostering organic growth.

### 🛒 Shop & Economy
A dual-currency economy featuring **DUCK** and **TON**:
- **DUCK:** The primary utility token earned through tasks and games.
- **TON:** Integrated via TON Connect for high-value transactions and VIP status.
- **Shop:** Purchase exclusive items, frames, and boosts to enhance the experience.

### 🏆 Competitive Leaderboard
Real-time rankings showing the top players in the ecosystem. Compete for the top spot and earn prestige within the community.

---

## 🛠️ Tech Stack

- **Frontend:** React 18+, Vite, Tailwind CSS (v4)
- **Animations:** Framer Motion (motion/react)
- **Icons:** Lucide React
- **Database & Auth:** Firebase (Firestore, Authentication)
- **Blockchain:** TON Connect SDK
- **Monetization:** Adsgram Integration
- **Platform:** Telegram Web Apps (TWA) SDK

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- A Firebase Project

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd gift-phase-v2
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your credentials (see `.env.example`).

4. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## 🔐 Security & Economy

Gift Phase V2 implements strict security measures to protect the ecosystem:
- **Server-Side Increments:** All balance updates (DUCK/TON) are handled via Firestore `increment()` to prevent client-side manipulation.
- **Timestamp Verification:** Task resets and cooldowns are calculated using server-side timestamps.
- **Custom Modals:** All critical actions (Bidding, Purchasing, Reseting) use a custom 3D Modal system instead of native browser dialogs for a secure and consistent UI.

---

## 📜 License

This project is licensed under the MIT License.
