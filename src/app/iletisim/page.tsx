'use client';

import React from 'react';
import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">İletişime Geçin</h1>
          <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
            Eğitim teknolojileri, programlama eğitimi veya işbirliği fırsatları hakkında görüşmek
            isterseniz, benimle iletişime geçmekten çekinmeyin.
          </p>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">İletişim Bilgileri</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p className="flex items-center">
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                kocyns1@gmail.com
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Mesaj Gönder</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
} 