'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setStatus(null);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          subject: 'Web Sitesinden Gelen Mesaj',
          to: 'kocyns1@gmail.com'
        }),
      });

      if (!response.ok) throw new Error('Gönderim başarısız');
      
      setStatus('success');
      setMessage('');
    } catch (error: unknown) {
      setStatus('error');
      console.error('Mesaj gönderme hatası:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label 
          htmlFor="message" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Mesajınız
        </label>
        <textarea
          id="message"
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-4 py-2 text-gray-900 dark:text-gray-100 border rounded-lg 
            focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700
            placeholder-gray-400 dark:placeholder-gray-500"
          placeholder="Mesajınızı buraya yazın..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSending}
        className={`w-full py-3 px-4 rounded-lg text-white font-medium
          transition-colors duration-200
          ${isSending 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'
          }`}
      >
        {isSending ? 'Gönderiliyor...' : 'Mesaj Gönder'}
      </button>

      {status === 'success' && (
        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300">
          Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağım.
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300">
          Mesaj gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
        </div>
      )}
    </form>
  );
} 