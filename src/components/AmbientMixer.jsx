import React, { useState, useEffect, useRef } from 'react';

// Using Web Audio API to synthesize relaxing noise!
const noiseGenerators = {
  rain: (audioCtx) => {
    // Pink noise generation for rain effect
    const bufferSize = audioCtx.sampleRate * 2; 
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = buffer.getChannelData(0);
    
    let b0=0, b1=0, b2=0, b3=0, b4=0, b5=0, b6=0;
    for (let i = 0; i < bufferSize; i++) {
       let white = Math.random() * 2 - 1;
       b0 = 0.99886 * b0 + white * 0.0555179;
       b1 = 0.99332 * b1 + white * 0.0750759;
       b2 = 0.96900 * b2 + white * 0.1538520;
       b3 = 0.86650 * b3 + white * 0.3104856;
       b4 = 0.55000 * b4 + white * 0.5329522;
       b5 = -0.7616 * b5 - white * 0.0168980;
       output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
       output[i] *= 0.11; 
       b6 = white * 0.115926;
    }
    
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    
    // Lowpass filter to make pink noise sound like rain
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000; 
    
    source.connect(filter);
    return { source, tail: filter };
  },
  rumble: (audioCtx) => {
    // Brown noise for cafe/distant thunder rumble
    const bufferSize = audioCtx.sampleRate * 2;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
        let white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; 
    }
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400; // Deep rumble
    
    source.connect(filter);
    return { source, tail: filter };
  }
};

const AmbientMixer = () => {
  const [volumes, setVolumes] = useState({ rain: 0, rumble: 0 });
  const audioCtxRef = useRef(null);
  const nodesRef = useRef({ rain: null, rumble: null });

  useEffect(() => {
    const handlePlayTime = (type, val) => {
      // Initialize only if a user moves a slider
      if (!audioCtxRef.current && (volumes.rain > 0 || volumes.rumble > 0)) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      
      if (val > 0) {
        if (!nodesRef.current[type]) {
            const { source, tail } = noiseGenerators[type](ctx);
            const gainNode = ctx.createGain();
            tail.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            source.start();
            nodesRef.current[type] = { source, gainNode };
        }
        // Apply square relation for non-linear perceived volume mapping
        nodesRef.current[type].gainNode.gain.setValueAtTime(val * val, ctx.currentTime);
      } else {
        if (nodesRef.current[type]) {
            nodesRef.current[type].source.stop();
            nodesRef.current[type].gainNode.disconnect();
            nodesRef.current[type] = null;
        }
      }
    };
    
    handlePlayTime('rain', volumes.rain);
    handlePlayTime('rumble', volumes.rumble);
  }, [volumes]);

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl flex flex-col w-full max-w-sm">
      <h3 className="text-white/80 font-medium mb-4 tracking-wider uppercase text-sm drop-shadow-md">Ambient Noises</h3>
      
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-white/90 font-medium text-sm">
            <span>Rainfall</span>
            <span>{Math.round(volumes.rain * 100)}%</span>
          </div>
          <input 
             type="range" min="0" max="1" step="0.01" value={volumes.rain}
             onChange={(e) => setVolumes(prev => ({...prev, rain: parseFloat(e.target.value)}))}
             className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer hover:bg-white/30 accent-blue-400 transition-colors" 
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-white/90 font-medium text-sm">
            <span>Distant Rumble</span>
            <span>{Math.round(volumes.rumble * 100)}%</span>
          </div>
          <input 
             type="range" min="0" max="1" step="0.01" value={volumes.rumble}
             onChange={(e) => setVolumes(prev => ({...prev, rumble: parseFloat(e.target.value)}))}
             className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer hover:bg-white/30 accent-stone-400 transition-colors" 
          />
        </div>
      </div>
    </div>
  );
};

export default AmbientMixer;
