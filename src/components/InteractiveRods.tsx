'use client';

import { useEffect, useRef, useState } from 'react';

export default function InteractiveRods() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 150, y: 70 });
  const [isHovering, setIsHovering] = useState(false);
  const [currentAngles, setCurrentAngles] = useState<number[]>([]);
  const animationFrameRef = useRef<number>();
  const isMovingRef = useRef(false);
  const moveTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // İlk açıları sıfır olarak ayarla
    setCurrentAngles(new Array(30).fill(0));
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });

    isMovingRef.current = true;

    if (moveTimeoutRef.current) {
      clearTimeout(moveTimeoutRef.current);
    }

    moveTimeoutRef.current = setTimeout(() => {
      isMovingRef.current = false;
      // Fare durduğunda son bir kez güncelle
      setCurrentAngles(prev => [...prev]);
    }, 50);
  };

  const colors = [
    ['from-[#FF6B6B] to-[#FF8787]', 'from-[#4ECDC4] to-[#45B7D1]', 'from-[#45B7D1] to-[#96CEB4]'],
    ['from-[#96CEB4] to-[#FFEEAD]', 'from-[#D4A5A5] to-[#9B59B6]', 'from-[#9B59B6] to-[#3498DB]'],
    ['from-[#3498DB] to-[#2980B9]', 'from-[#2980B9] to-[#1ABC9C]', 'from-[#1ABC9C] to-[#16A085]']
  ];

  const generateRods = (count: number, row: number) => {
    const containerWidth = 300;
    const containerHeight = 140;

    const columnHeights = Array.from({ length: count }, () => 
      Math.floor(Math.random() * (45 - 25) + 25)
    );

    return Array.from({ length: count }).map((_, index) => {
      const height = columnHeights[index];
      const width = 12;
      const gap = 8;
      const totalWidth = count * (width + gap);
      const startX = (containerWidth - totalWidth) / 2;
      const x = startX + index * (width + gap);
      const y = row * 45;

      const getTargetRotation = () => {
        if (!isHovering) return 0;
        
        const rodCenterX = x + width / 2;
        const rodCenterY = y + height / 2;
        
        const deltaX = mousePosition.x - rodCenterX;
        const deltaY = mousePosition.y - rodCenterY;
        
        let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        return angle - 90;
      };

      const globalIndex = row * count + index;
      const targetAngle = getTargetRotation();
      const currentAngle = currentAngles[globalIndex] || 0;
      
      let newAngle = currentAngle;
      
      if (isHovering) {
        if (isMovingRef.current) {
          newAngle = currentAngle + (targetAngle - currentAngle) * 0.2;
        } else {
          newAngle = targetAngle;
        }
      } else {
        newAngle = currentAngle + (0 - currentAngle) * 0.2;
      }

      currentAngles[globalIndex] = newAngle;

      const isNearZero = Math.abs(newAngle) < 0.01;

      return (
        <div
          key={`row${row}-${index}`}
          className={`absolute bg-gradient-to-b ${colors[row][index % 3]} rounded-full`}
          style={{
            width: `${width}px`,
            height: `${height}px`,
            left: `${x}px`,
            top: `${y}px`,
            transform: `rotate(${newAngle}deg)`,
            transformOrigin: 'center center',
            willChange: 'transform',
            animation: !isHovering && isNearZero
              ? `normalPulse${index % 5} 30s infinite ease-in-out ${index * 300}ms`
              : 'none'
          }}
        />
      );
    });
  };

  // Animasyon döngüsü
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const animate = () => {
      if (isMovingRef.current || !isHovering) {
        setCurrentAngles(prev => [...prev]);
      }
      timeoutId = setTimeout(animate, 50); // 50ms gecikme ile daha akıcı
    };

    timeoutId = setTimeout(animate, 50);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isHovering]);

  return (
    <div
      ref={containerRef}
      className="relative w-[300px] h-[140px] mx-auto"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {generateRods(10, 0)}
      {generateRods(10, 1)}
      {generateRods(10, 2)}
      <style jsx>{`
        @keyframes normalPulse0 { 
          0% { transform: scaleY(1); }
          10% { transform: scaleY(1); }
          20% { transform: scaleY(1.04); }
          30% { transform: scaleY(1.04); }
          40% { transform: scaleY(1.08); }
          60% { transform: scaleY(1.08); }
          70% { transform: scaleY(1.04); }
          80% { transform: scaleY(1.04); }
          90% { transform: scaleY(1); }
          100% { transform: scaleY(1); }
        }
        @keyframes normalPulse1 { 
          0% { transform: scaleY(1); }
          10% { transform: scaleY(1); }
          20% { transform: scaleY(1.03); }
          30% { transform: scaleY(1.03); }
          40% { transform: scaleY(1.06); }
          60% { transform: scaleY(1.06); }
          70% { transform: scaleY(1.03); }
          80% { transform: scaleY(1.03); }
          90% { transform: scaleY(1); }
          100% { transform: scaleY(1); }
        }
        @keyframes normalPulse2 { 
          0% { transform: scaleY(1); }
          10% { transform: scaleY(1); }
          20% { transform: scaleY(1.05); }
          30% { transform: scaleY(1.05); }
          40% { transform: scaleY(1.09); }
          60% { transform: scaleY(1.09); }
          70% { transform: scaleY(1.05); }
          80% { transform: scaleY(1.05); }
          90% { transform: scaleY(1); }
          100% { transform: scaleY(1); }
        }
        @keyframes normalPulse3 { 
          0% { transform: scaleY(1); }
          10% { transform: scaleY(1); }
          20% { transform: scaleY(1.03); }
          30% { transform: scaleY(1.03); }
          40% { transform: scaleY(1.05); }
          60% { transform: scaleY(1.05); }
          70% { transform: scaleY(1.03); }
          80% { transform: scaleY(1.03); }
          90% { transform: scaleY(1); }
          100% { transform: scaleY(1); }
        }
        @keyframes normalPulse4 { 
          0% { transform: scaleY(1); }
          10% { transform: scaleY(1); }
          20% { transform: scaleY(1.04); }
          30% { transform: scaleY(1.04); }
          40% { transform: scaleY(1.07); }
          60% { transform: scaleY(1.07); }
          70% { transform: scaleY(1.04); }
          80% { transform: scaleY(1.04); }
          90% { transform: scaleY(1); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
} 