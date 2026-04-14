import React from 'react';
import { Send, Heart } from 'lucide-react';
// --- LOADING SCREEN ---
export const LoadingScreen = ({ onPlay, onShare, onLike, isLiked, progress, isStarted }: { onPlay: () => void, onShare: () => void, onLike: () => void, isLiked: boolean, progress: number, isStarted: boolean }) => {
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

