'use client';

import { useEffect, useRef } from 'react';

const InteractiveRods = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rods = Array(8).fill(0);
  const colors = [
    '#FF6B6B', // Kırmızı
    '#4ECDC4', // Turkuaz
    '#45B7D1', // Mavi
    '#96CEB4', // Yeşil
    '#FFEEAD', // Sarı
    '#D4A5A5', // Pembe
    '#9B59B6', // Mor
    '#3498DB'  // Mavi
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Başlangıç animasyonu
    const rods = container.getElementsByClassName('rod');
    Array.from(rods).forEach((rod, index) => {
      const htmlRod = rod as HTMLElement;
      htmlRod.style.opacity = '0';
      htmlRod.style.transform = 'scaleX(0)';
      
      setTimeout(() => {
        htmlRod.style.opacity = '1';
        htmlRod.style.transform = 'scaleX(1)';
      }, index * 100);
    });

    // Otomatik sallanma animasyonu
    const autoAnimate = () => {
      Array.from(rods).forEach((rod, index) => {
        const htmlRod = rod as HTMLElement;
        const delay = index * 100;
        const amplitude = 2; // Sallanma genişliği
        
        setTimeout(() => {
          htmlRod.style.transform = `scaleX(${1 + Math.sin(Date.now() * 0.002 + index) * 0.1})`;
        }, delay);
      });
      
      requestAnimationFrame(autoAnimate);
    };
    
    const animationFrame = requestAnimationFrame(autoAnimate);

    const handleMouseMove = (e: MouseEvent) => {
      const rods = container.getElementsByClassName('rod');
      const containerRect = container.getBoundingClientRect();
      const mouseX = e.clientX - containerRect.left;
      const mouseY = e.clientY - containerRect.top;

      Array.from(rods).forEach((rod, index) => {
        const rect = rod.getBoundingClientRect();
        const rodCenterX = rect.left - containerRect.left + rect.width / 2;
        const rodCenterY = rect.top - containerRect.top + rect.height / 2;

        const distance = Math.sqrt(
          Math.pow(mouseX - rodCenterX, 2) + Math.pow(mouseY - rodCenterY, 2)
        );

        const maxDistance = 100;
        const scale = Math.max(1, 1.5 - distance / maxDistance);
        const brightness = Math.max(1, 2 - distance / maxDistance);

        const htmlRod = rod as HTMLElement;
        htmlRod.style.transform = `scaleX(${scale})`;
        htmlRod.style.filter = `brightness(${brightness})`;
      });
    };

    const handleMouseLeave = () => {
      const rods = container.getElementsByClassName('rod');
      Array.from(rods).forEach((rod) => {
        const htmlRod = rod as HTMLElement;
        htmlRod.style.transform = 'scaleX(1)';
        htmlRod.style.filter = 'brightness(1)';
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-full max-w-xl mx-auto h-16 flex flex-col justify-center items-center gap-2"
    >
      {rods.map((_, index) => (
        <div
          key={index}
          className="rod w-full h-1.5 rounded-full transition-all duration-300 ease-out origin-center"
          style={{
            backgroundColor: colors[index],
            boxShadow: `0 0 10px ${colors[index]}`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
};

export default InteractiveRods; 