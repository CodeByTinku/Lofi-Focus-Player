import React, { useState, useEffect } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';

const FocusTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play a sound or show notification when focus is done
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl flex flex-col items-center">
      <h3 className="text-white/80 font-medium mb-4 tracking-wider uppercase text-sm">Focus Timer</h3>
      
      <div className="text-6xl font-mono text-white font-light tracking-widest mb-6">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      <div className="flex gap-4">
        <button 
          onClick={toggleTimer}
          className="px-6 py-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur text-white transition-all text-sm font-medium flex items-center gap-2 border border-white/20"
        >
          {isActive ? <><Pause size={16}/> Pause</> : <><Play size={16}/> Start</>}
        </button>
        <button 
          onClick={resetTimer}
          className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
        >
          <RefreshCw size={20} />
        </button>
      </div>
    </div>
  );
};

export default FocusTimer;
