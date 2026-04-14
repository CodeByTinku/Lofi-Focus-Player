import React, { useEffect, useRef, useState } from 'react';

const Visualizer = ({ audioRef, isPlaying }) => {
  const canvasRef = useRef(null);
  const [analyser, setAnalyser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only initialize when user actually clicks play to avoid AudioContext warnings
    if (!audioRef.current || !isPlaying || isInitialized) return;

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaElementSource(audioRef.current);
      const newAnalyser = audioContext.createAnalyser();
      
      newAnalyser.fftSize = 128; // gives 64 frequency bars
      newAnalyser.smoothingTimeConstant = 0.8;
      
      source.connect(newAnalyser);
      newAnalyser.connect(audioContext.destination);
      
      setAnalyser(newAnalyser);
      setIsInitialized(true);
    } catch (e) {
      console.warn("AudioContext already created or failed:", e);
    }
  }, [audioRef, isPlaying, isInitialized]);

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    let animationId;

    const renderFrame = () => {
      // Loop this animation frame
      animationId = requestAnimationFrame(renderFrame);
      
      if (isPlaying) {
          analyser.getByteFrequencyData(dataArray);
      } else {
          // If paused, slowly bring bars down
          for (let i = 0; i < dataArray.length; i++) {
              dataArray[i] = Math.max(0, dataArray[i] - 5);
          }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width;
      const height = canvas.height;
      
      const barWidth = (width / bufferLength) * 1.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * height;

        // Create gradient for the bars
        const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
        gradient.addColorStop(0, 'rgba(168, 85, 247, 0.4)'); // purple-500
        gradient.addColorStop(1, 'rgba(216, 180, 254, 0.9)'); // purple-300

        ctx.fillStyle = gradient;
        
        // Draw bars with rounded tops by overlapping arcs vs rects
        const y = height - barHeight;
        const radius = Math.min(barWidth / 2, barHeight / 2);
        
        if (barHeight > 0) {
            ctx.beginPath();
            ctx.roundRect(x, y, barWidth - 2, barHeight, [radius, radius, 0, 0]);
            ctx.fill();
        }

        x += barWidth;
      }
    };

    renderFrame();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [analyser, isPlaying]);

  return (
    <div className="w-full h-32 flex items-center justify-center">
      <canvas 
        ref={canvasRef} 
        width={800}
        height={200}
        className="w-full h-full max-w-2xl px-8"
      />
    </div>
  );
};

export default Visualizer;
