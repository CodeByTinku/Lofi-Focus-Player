import React from 'react';

const Background = () => {
  return (
    <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-neutral-900 to-black">
      {/* We can later add a video or a beautiful image here. For now a sleek gradient */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
    </div>
  );
};

export default Background;
