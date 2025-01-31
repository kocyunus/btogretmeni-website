'use client';

import React from 'react';

export default function HakkimdaPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          Hakkımda
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              Merhaba! Ben bir Bilişim Teknolojileri Öğretmeniyim. Öğrencilerime teknolojiyi 
              sevdirmeyi ve onları geleceğin dijital dünyasına hazırlamayı amaçlıyorum.
            </p>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              Öğretmenlik kariyerim boyunca, öğrencilerimin kodlama, robotik ve dijital 
              içerik üretimi gibi alanlarda kendilerini geliştirmelerine yardımcı oluyorum. 
              Son zamanlarda yapay zeka ve oyun geliştirme konularına da odaklanıyorum.
            </p>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              Boş zamanlarımda freelance platformlarda (Upwork, Fiverr) robotik, oyun 
              geliştirme ve yazılım projelerine odaklanıyorum. Ayrıca, yapay zeka tabanlı 
              araçlar kullanarak kısa animasyonlar ve eğitici içerikler üretmek gibi yaratıcı 
              çalışmalara yönelmiş durumdayım.
            </p>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              Kişisel web sitemde projelerimden, eğitim kaynaklarından ve teknolojiye dair 
              ipuçlarından haberdar olabilir, yolculuğuma eşlik edebilirsiniz.
            </p>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Eğitim ve teknolojiyle büyümeye inanan biri olarak, her geçen gün yeni bir şey 
              öğreniyor ve öğretmeye devam ediyorum.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 