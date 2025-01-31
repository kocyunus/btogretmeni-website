import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function getBackgroundPattern(tag: string): string {
  const patterns: { [key: string]: string } = {
    'Eğitim': 'bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600',
    'Oyun Tabanlı Öğrenme': 'bg-gradient-to-br from-purple-500 via-pink-500 to-red-500',
    'Pedagoji': 'bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600',
    'Teknoloji': 'bg-gradient-to-br from-orange-400 via-red-500 to-rose-600',
    'Kodlama': 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600',
    'Scratch': 'bg-gradient-to-br from-amber-400 via-orange-500 to-red-600',
    'Çocuk Gelişimi': 'bg-gradient-to-br from-pink-400 via-rose-500 to-red-600',
    'default': 'bg-gradient-to-br from-slate-500 via-gray-600 to-neutral-700'
  };
  
  return patterns[tag] || patterns['default'];
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Boşlukları tire ile değiştir
    .replace(/[^\w\-]+/g, '') // Alfanumerik olmayan karakterleri kaldır
    .replace(/\-\-+/g, '-') // Birden fazla tireyi tek tire yap
    .replace(/^-+/, '') // Baştaki tireleri kaldır
    .replace(/-+$/, ''); // Sondaki tireleri kaldır
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

export function readingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function generateMetaDescription(content: string): string {
  // HTML etiketlerini kaldır
  const plainText = content.replace(/<[^>]*>/g, '');
  // Markdown bağlantılarını kaldır
  const withoutLinks = plainText.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  // İlk 160 karakteri al
  return truncate(withoutLinks, 160);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
} 