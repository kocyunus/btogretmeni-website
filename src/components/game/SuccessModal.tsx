"use client";

import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useGameStore } from '@/store/gameStore';

export default function SuccessModal() {
  const isLevelComplete = useGameStore((state) => state.isLevelComplete);
  const showSuccessModal = useGameStore((state) => state.showSuccessModal);
  const resetLevel = useGameStore((state) => state.resetLevel);
  const goToNextLevel = useGameStore((state) => state.goToNextLevel);
  const currentLevel = useGameStore((state) => state.currentLevel);
  const [showConfetti, setShowConfetti] = useState(false);

  // Maksimum seviye sayısını güncelle
  const MAX_LEVEL = 11;
  const isLastLevel = currentLevel === MAX_LEVEL;

  useEffect(() => {
    if (showSuccessModal) {
      setShowConfetti(true);
      // 5 saniye sonra konfetileri kaldır
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  if (!showSuccessModal) return null;

  return (
    <>
      {/* Konfeti Efekti */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      {/* Başarı Modalı */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50
                    animate-[fadeIn_0.5s_ease-out_forwards]">
        <div className="bg-card p-8 rounded-xl shadow-2xl max-w-md w-full mx-4
                     animate-[scaleIn_0.5s_ease-out_forwards]">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">🎉 Tebrikler! 🎉</h2>
            <p className="text-xl text-muted-foreground mb-6">
              {isLastLevel 
                ? "Tüm seviyeleri başarıyla tamamladın!"
                : `${currentLevel}. seviyeyi başarıyla tamamladın!`}
            </p>

            <div className="flex flex-col gap-3">
              {!isLastLevel && (
                <button
                  onClick={() => {
                    goToNextLevel();
                    setShowConfetti(false);
                  }}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium text-lg transition-colors"
                >
                  Sonraki Seviye
                </button>
              )}

              <button
                onClick={() => {
                  resetLevel();
                  setShowConfetti(false);
                }}
                className="bg-stone-700 hover:bg-stone-600 text-white px-6 py-3 rounded-lg font-medium text-lg transition-colors"
              >
                {isLastLevel ? "Seviyeyi Tekrarla" : "Tekrar Oyna"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
} 