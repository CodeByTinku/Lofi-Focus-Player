import React, { useState, useEffect, useRef } from 'react';
import Background from './components/Background';
import MusicPlayer from './components/MusicPlayer';
import FocusTimer from './components/FocusTimer';
import AmbientMixer from './components/AmbientMixer';
import Visualizer from './components/Visualizer';

const TRACKS = [
  {
    title: "Midnight Walk",
    artist: "Lofi Vibes",
    src: "/track1.mp3"
  },
  {
    title: "Quiet Morning",
    artist: "Chillhop",
    src: "/track2.mp3"
  },
  {
    title: "Study Sessions",
    artist: "Beats Generator",
    src: "/track4.mp3"
  },
  {
    title: "Fresh Mood",
    artist: "Beats Generator",
    src: "/track3.mp3"
  },
  {
    title: "Jazzy Love",
    artist: "Beats Generator",
    src: "/track5.mp3"
  },
];

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [trackIndex, setTrackIndex] = useState(0);
  const audioRef = useRef(null);

  // Handle Play/Pause when isPlaying state changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed: ", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Handle source reloading when the track changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load(); // Force the browser to load the new src
      if (isPlaying) {
         // wait for it to load marginally, play can be invoked immediately afterwards
         audioRef.current.play().catch(e => console.error("Playback failed: ", e));
      }
    }
  }, [trackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const prevTrack = () => {
    setTrackIndex((prev) => (prev === 0 ? TRACKS.length - 1 : prev - 1));
    // If we want it to automatically start playing the prev track
    setIsPlaying(true); 
  };

  const nextTrack = () => {
    setTrackIndex((prev) => (prev === TRACKS.length - 1 ? 0 : prev + 1));
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-sans text-neutral-100 flex flex-col justify-center items-center py-6 px-4 gap-6">
      <Background />
      
      <audio 
        ref={audioRef} 
        onEnded={nextTrack}
        crossOrigin="anonymous"
        src={TRACKS[trackIndex].src}
      ></audio>

      {/* Main Container */}
      <div className="z-10 w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-6 items-center md:items-end justify-center h-full">
        
        {/* Left Side: Productivity Tools */}
        <div className="flex flex-col gap-6 w-full md:w-1/3">
          <FocusTimer />
          <AmbientMixer />
        </div>

        {/* Right Side: Player & Visualizer */}
        <div className="flex flex-col gap-4 w-full md:w-2/3 h-full justify-between items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            
          {/* Aesthetic Title */}
          <div className="flex flex-col items-center justify-center py-4 w-full h-1/3">
             <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-indigo-100 drop-shadow-sm text-center tracking-tight leading-tight">
               Stay Focused. <br /> Stay Relaxed.
             </h1>
          </div>

          <div className="flex-grow w-full relative z-10 flex flex-col items-center justify-end pb-4">
             {/* The Visualizer Bars */}
             <div className="w-full absolute top-[-90px] left-0 right-0 pointer-events-none opacity-80 mix-blend-screen scale-y-110">
               <Visualizer audioRef={audioRef} isPlaying={isPlaying} />
             </div>
             
             {/* The Player controls rendered on top of visualizer */}
             <MusicPlayer 
               audioRef={audioRef}
               isPlaying={isPlaying} 
               togglePlay={togglePlay}
               volume={volume}
               handleVolumeChange={setVolume}
               currentTrack={TRACKS[trackIndex]}
               nextTrack={nextTrack}
               prevTrack={prevTrack}
             />
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;

