'use client';

import React, { useState, useEffect } from 'react';
import { Game } from '@/types/game';

export default function GamesAdminPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const emptyGame: Game = {
    id: '',
    title: '',
    description: '',
    imageUrl: '',
    technologies: [],
    category: 'hyper-casual',
    releaseDate: new Date().toISOString().split('T')[0],
    rating: 0,
    screenshots: [],
    downloads: '0',
    tags: [],
    createdAt: new Date(),
    isPublished: false,
    version: '1.0.0',
    developer: {
      name: 'BT Öğretmeni'
    },
    status: 'draft'
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/admin/games');
      if (response.ok) {
        const data = await response.json();
        setGames(data);
      }
    } catch (error) {
      console.error('Oyunlar yüklenirken hata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGame) return;

    try {
      const response = await fetch('/api/admin/games', {
        method: editingGame.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingGame),
      });

      if (response.ok) {
        fetchGames();
        setEditingGame(null);
      }
    } catch (error) {
      console.error('Oyun kaydedilirken hata:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu oyunu silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/admin/games?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchGames();
      }
    } catch (error) {
      console.error('Oyun silinirken hata:', error);
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Yükleniyor...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Oyun Yönetimi
        </h1>
        <button
          onClick={() => setEditingGame(emptyGame)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700
            transition-colors duration-200"
        >
          Yeni Oyun Ekle
        </button>
      </div>

      {editingGame && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              {editingGame.id ? 'Oyunu Düzenle' : 'Yeni Oyun Ekle'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Başlık
                </label>
                <input
                  id="title"
                  type="text"
                  value={editingGame.title}
                  onChange={(e) => setEditingGame({...editingGame, title: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                    focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
                    dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  required
                  aria-label="Oyun başlığı"
                  placeholder="Oyun başlığını girin"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Açıklama
                </label>
                <textarea
                  id="description"
                  value={editingGame.description}
                  onChange={(e) => setEditingGame({...editingGame, description: e.target.value})}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                    focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
                    dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  required
                  aria-label="Oyun açıklaması"
                  placeholder="Oyun açıklamasını girin"
                />
              </div>

              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Görsel URL
                </label>
                <div className="mt-1 flex items-center gap-4">
                  <input
                    id="imageUrl"
                    type="text"
                    value={editingGame.imageUrl}
                    onChange={(e) => setEditingGame({...editingGame, imageUrl: e.target.value})}
                    className="block w-full rounded-md border-gray-300 shadow-sm
                      focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
                      dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    placeholder="Oyun görselinin URL'sini girin"
                  />
                  <div className="flex-shrink-0">
                    <label className="block">
                      <span className="sr-only">Görsel Yükle</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const formData = new FormData();
                            formData.append('file', file);
                            
                            try {
                              const response = await fetch('/api/admin/upload', {
                                method: 'POST',
                                body: formData,
                              });
                              
                              if (response.ok) {
                                const { url } = await response.json();
                                setEditingGame({...editingGame, imageUrl: url});
                              }
                            } catch (error) {
                              console.error('Görsel yükleme hatası:', error);
                            }
                          }
                        }}
                        className="hidden"
                      />
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-gray-300
                          dark:border-gray-600 rounded-md shadow-sm text-sm font-medium
                          text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700
                          hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none
                          focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Görsel Yükle
                      </button>
                    </label>
                  </div>
                </div>
                {editingGame.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={editingGame.imageUrl}
                      alt="Önizleme"
                      className="h-32 w-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="screenshots" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ekran Görüntüleri
                </label>
                <div className="mt-1">
                  <div className="flex flex-wrap gap-4 mb-4">
                    {editingGame.screenshots?.map((screenshot, index) => (
                      <div key={index} className="relative group">
                        <div className="relative w-32 h-56 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                          <img
                            src={screenshot}
                            alt={`Ekran görüntüsü ${index + 1}`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newScreenshots = [...(editingGame.screenshots || [])];
                            newScreenshots.splice(index, 1);
                            setEditingGame({...editingGame, screenshots: newScreenshots});
                          }}
                          className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white
                            opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Ekran görüntüsünü sil"
                          aria-label={`${index + 1}. ekran görüntüsünü sil`}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  <label className="block">
                    <span className="sr-only">Ekran Görüntüsü Yükle</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || []);
                        const uploadedUrls = [];
                        
                        for (const file of files) {
                          const formData = new FormData();
                          formData.append('file', file);
                          
                          try {
                            const response = await fetch('/api/admin/upload', {
                              method: 'POST',
                              body: formData,
                            });
                            
                            if (response.ok) {
                              const { url } = await response.json();
                              uploadedUrls.push(url);
                            }
                          } catch (error) {
                            console.error('Görsel yükleme hatası:', error);
                          }
                        }
                        
                        if (uploadedUrls.length > 0) {
                          setEditingGame({
                            ...editingGame,
                            screenshots: [...(editingGame.screenshots || []), ...uploadedUrls]
                          });
                        }
                      }}
                      className="hidden"
                      id="screenshots-input"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('screenshots-input')?.click()}
                      className="inline-flex items-center px-4 py-2 border border-gray-300
                        dark:border-gray-600 rounded-md shadow-sm text-sm font-medium
                        text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700
                        hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none
                        focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      title="Ekran görüntüsü yükle"
                      aria-label="Ekran görüntüsü yükle"
                    >
                      Ekran Görüntüsü Ekle
                    </button>
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="technologies" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Teknolojiler (virgülle ayırın)
                </label>
                <input
                  id="technologies"
                  type="text"
                  value={editingGame.technologies.join(', ')}
                  onChange={(e) => setEditingGame({
                    ...editingGame,
                    technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                    focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
                    dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  required
                  aria-label="Kullanılan teknolojiler"
                  placeholder="Teknolojileri virgülle ayırarak girin"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Kategori
                </label>
                <select
                  id="category"
                  value={editingGame.category}
                  onChange={(e) => setEditingGame({
                    ...editingGame,
                    category: e.target.value as Game['category']
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                    focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
                    dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  required
                  aria-label="Oyun kategorisi"
                >
                  <option value="hyper-casual">Hyper Casual</option>
                  <option value="casual">Casual</option>
                  <option value="educational">Eğitsel</option>
                </select>
              </div>

              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Puan
                </label>
                <input
                  id="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={editingGame.rating || 0}
                  onChange={(e) => setEditingGame({
                    ...editingGame,
                    rating: parseFloat(e.target.value) || 0
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                    focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
                    dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  placeholder="0.0 - 5.0 arası bir değer girin"
                />
              </div>

              <div>
                <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Yayın Tarihi
                </label>
                <input
                  id="releaseDate"
                  type="date"
                  value={editingGame.releaseDate || ''}
                  onChange={(e) => setEditingGame({
                    ...editingGame,
                    releaseDate: e.target.value
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                    focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
                    dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                />
              </div>

              <div>
                <label htmlFor="playStoreUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Google Play Store Bağlantısı
                </label>
                <input
                  id="playStoreUrl"
                  type="url"
                  value={editingGame.playStoreUrl || ''}
                  onChange={(e) => setEditingGame({...editingGame, playStoreUrl: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                    focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
                    dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  placeholder="https://play.google.com/store/apps/details?id=..."
                />
              </div>

              <div>
                <label htmlFor="appStoreUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  App Store Bağlantısı
                </label>
                <input
                  id="appStoreUrl"
                  type="url"
                  value={editingGame.appStoreUrl || ''}
                  onChange={(e) => setEditingGame({...editingGame, appStoreUrl: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                    focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
                    dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  placeholder="https://apps.apple.com/app/id..."
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingGame(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700
                    dark:text-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50
                    dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md
                    hover:bg-indigo-700 transition-colors duration-200"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6
              flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <img
                src={game.imageUrl}
                alt={game.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {game.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {game.category}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setEditingGame(game)}
                className="px-3 py-1 text-sm text-indigo-600 dark:text-indigo-400
                  hover:text-indigo-500 dark:hover:text-indigo-300"
              >
                Düzenle
              </button>
              <button
                onClick={() => handleDelete(game.id)}
                className="px-3 py-1 text-sm text-red-600 dark:text-red-400
                  hover:text-red-500 dark:hover:text-red-300"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 