import React, { memo, useMemo } from 'react';
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


export default SparkleBackground;
