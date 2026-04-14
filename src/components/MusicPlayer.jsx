import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const MusicPlayer = ({ audioRef, isPlaying, togglePlay, volume, handleVolumeChange, prevTrack, nextTrack, currentTrack }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl flex flex-col items-center max-w-lg w-full mx-auto relative z-10 mt-30">
      <div className="w-full text-center mb-6">
        <h2 className="text-2xl font-mono tracking-tight text-white/90 drop-shadow-md">{currentTrack.title}</h2>
        <p className="text-sm text-white/60 font-medium tracking-widest uppercase mt-1">{currentTrack.artist}</p>
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-center gap-8 mb-8 w-full">
        <button onClick={prevTrack} className="text-white/60 hover:text-white transition-colors hover:scale-110 active:scale-95">
          <SkipBack size={28} />
        </button>
        
        <button 
          onClick={togglePlay}
          className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600/30 to-blue-500/30 hover:from-purple-500/40 hover:to-blue-400/40 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] hover:scale-105 active:scale-95"
        >
          {isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-1" />}
        </button>

        <button onClick={nextTrack} className="text-white/60 hover:text-white transition-colors hover:scale-110 active:scale-95">
          <SkipForward size={28} />
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-4 w-full px-6">
        <button onClick={() => handleVolumeChange(volume === 0 ? 0.5 : 0)} className="text-white/70 hover:text-white transition-colors">
          {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <input 
          type="range" 
          min="0" max="1" step="0.01" 
          value={volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer hover:bg-white/30 accent-purple-400 transition-colors"
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
