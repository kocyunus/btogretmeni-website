import { useEffect, useState, useRef } from 'react';

export default function AnimatedBars() {
  const [heights, setHeights] = useState<number[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const initialHeights = [
      [15, 20, 18],
      [18, 23, 20],
      [20, 25, 22],
      [22, 27, 24],
      [19, 24, 21],
      [17, 22, 19],
      [21, 26, 23],
      [16, 21, 18]
    ].flat();

    setHeights(initialHeights);

    const interval = setInterval(() => {
      const newHeights = initialHeights.map(h => h + (Math.random() * 4 - 2));
      setHeights(newHeights);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  const calculateBarTransform = (groupIndex: number, barIndex: number) => {
    if (!isHovering || !containerRef.current) return '';

    const barWidth = 8; // Çubuk genişliği
    const spacing = 8; // Çubuklar arası boşluk
    const barCenterX = (groupIndex * (barWidth + spacing)) + (barWidth / 2);
    const containerHeight = 80; // Container yüksekliği
    const barCenterY = containerHeight / 2;

    const deltaX = mousePosition.x - barCenterX;
    const deltaY = mousePosition.y - barCenterY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    const interactionRadius = 100; // Etkileşim mesafesini artırdık
    
    if (distance < interactionRadius) {
      const angle = Math.atan2(deltaY, deltaX);
      const intensity = 1 - (distance / interactionRadius);
      const maxRotation = 45; // Maksimum dönüş açısını artırdık
      const maxScale = 1.3; // Maksimum büyüme oranı
      
      return `rotate(${angle * (180 / Math.PI)}deg) scale(${1 + (intensity * 0.3)})`;
    }

    return '';
  };

  return (
    <div 
      ref={containerRef}
      className="relative flex justify-center items-center h-20 px-4 py-2 cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {[0, 1, 2, 3, 4, 5, 6, 7].map((groupIndex) => (
        <div 
          key={groupIndex} 
          className="flex flex-col space-y-1 mx-1"
        >
          {[0, 1, 2].map((barIndex) => {
            const barHeight = heights[groupIndex * 3 + barIndex] || 20;
            const transform = calculateBarTransform(groupIndex, barIndex);

            return (
              <div
                key={`${groupIndex}-${barIndex}`}
                className="w-2 rounded-full transition-all duration-200"
                style={{
                  height: `${barHeight}px`,
                  backgroundColor: getBarColor(groupIndex, barIndex),
                  opacity: 1 - barIndex * 0.15,
                  transform: transform || `scaleY(${1 + Math.sin(Date.now() / 1000 + groupIndex) * 0.1})`,
                  transformOrigin: 'center center',
                  willChange: 'transform',
                  transition: 'all 0.2s ease-out'
                }}
              />
            );
          })}
        </div>
      ))}

      <style jsx>{`
        @keyframes barPulse {
          0% { transform: scaleY(1); }
          50% { transform: scaleY(1.15); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}

function getBarColor(groupIndex: number, barIndex: number): string {
  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFBE0B',
    '#FF006E',
    '#8338EC',
    '#3A86FF'
  ];
  
  const alpha = 0.8 - (barIndex * 0.2);
  const baseColor = colors[groupIndex % colors.length];
  
  const r = parseInt(baseColor.slice(1, 3), 16);
  const g = parseInt(baseColor.slice(3, 5), 16);
  const b = parseInt(baseColor.slice(5, 7), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Global stil tanımlaması
const styles = `
@keyframes barPulse {
  0% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(1.15);
  }
  100% {
    transform: scaleY(1);
  }
}

.animated-bar {
  transition: transform 0.2s ease-out;
}
`;

// Stilleri head'e ekle
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
} 