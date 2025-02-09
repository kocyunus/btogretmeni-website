import { useGameStore } from '@/store/gameStore';

export default function TutorialOverlay() {
  const { currentLevel } = useGameStore();

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50
                    flex items-center justify-center p-4">
      <div className="bg-gray-900 p-6 rounded-xl border-2 border-amber-500
                    shadow-[0_0_50px_rgba(245,158,11,0.3)]
                    max-w-md w-full">
        <h2 className="text-2xl font-bold text-amber-500 mb-4">
          🎮 Seviye {currentLevel} - Öğretici
        </h2>
        
        <div className="space-y-4 text-gray-300">
          {currentLevel === 1 && (
            <>
              <p>
                Hoş geldin! Bu oyunda karakteri hedefe ulaştırmak için komutları kullanacaksın.
              </p>
              <p>
                Sağdaki komut panelinden istediğin komutu seçerek karakteri yönlendirebilirsin:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><code className="text-amber-400">ileri()</code> - Karakteri bir adım ileri götürür</li>
                <li><code className="text-amber-400">sağaDön()</code> - Karakteri 90 derece sağa döndürür</li>
                <li><code className="text-amber-400">solaDön()</code> - Karakteri 90 derece sola döndürür</li>
                <li><code className="text-amber-400">kır()</code> - Önündeki kırılabilir engeli yok eder</li>
              </ul>
            </>
          )}

          {currentLevel === 2 && (
            <>
              <p>
                Harika! Şimdi biraz daha zorlu bir görev var.
              </p>
              <p>
                Bu seviyede kırılabilir duvarları göreceksin. Bunları <code className="text-amber-400">kır()</code> komutu ile yok edebilirsin.
              </p>
              <p>
                Unutma, her seviyede sınırlı sayıda komut kullanabilirsin!
              </p>
            </>
          )}

          {currentLevel === 3 && (
            <>
              <p>
                Tebrikler! Artık daha karmaşık labirentlerle karşılaşacaksın.
              </p>
              <p>
                İpucu: Komutları sürükleyip bırakarak sıralamayı değiştirebilirsin.
              </p>
            </>
          )}
        </div>

        <button
          onClick={() => useGameStore.setState({ isTutorialActive: false })}
          className="mt-6 w-full bg-amber-600 hover:bg-amber-500 
                   text-white font-medium py-2 px-4 rounded-lg 
                   transition-colors"
        >
          Anladım, Başla! 🚀
        </button>
      </div>
    </div>
  );
} 