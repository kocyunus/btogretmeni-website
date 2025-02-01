'use client';

import Link from 'next/link'
import { EducationIcon, ProjectIcon, BlogIcon, EmailIcon } from '@/components/icons/HomeIcons'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Bölümü */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-white">
            Hoş Geldiniz
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            Bilişim teknolojileri ve yazılım geliştirme alanındaki deneyimlerimi paylaşıyorum.
          </p>
        </section>

        {/* Kartlar */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Eğitim Kartı */}
          <Link href="/egitim" className="block group">
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 group-hover:border-blue-500 transition-all group-hover:shadow-lg group-hover:shadow-blue-500/10">
              <div className="text-blue-500 mb-4">
                <EducationIcon />
              </div>
              <h2 className="text-2xl font-semibold mb-4 text-white">Eğitim</h2>
              <p className="text-gray-400">
                Web tasarım, programlama ve robotik alanlarında eğitimler veriyorum.
              </p>
            </div>
          </Link>

          {/* Projeler Kartı */}
          <Link href="/projeler" className="block group">
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 group-hover:border-purple-500 transition-all group-hover:shadow-lg group-hover:shadow-purple-500/10">
              <div className="text-purple-500 mb-4">
                <ProjectIcon />
              </div>
              <h2 className="text-2xl font-semibold mb-4 text-white">Projeler</h2>
              <p className="text-gray-400">
                Açık kaynak ve eğitim teknolojileri alanında projeler geliştiriyorum.
              </p>
            </div>
          </Link>

          {/* Blog Kartı */}
          <Link href="/blog" className="block group">
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 group-hover:border-green-500 transition-all group-hover:shadow-lg group-hover:shadow-green-500/10">
              <div className="text-green-500 mb-4">
                <BlogIcon />
              </div>
              <h2 className="text-2xl font-semibold mb-4 text-white">Blog</h2>
              <p className="text-gray-400">
                Teknoloji ve eğitim alanındaki deneyimlerimi blog yazılarında paylaşıyorum.
              </p>
            </div>
          </Link>
        </div>

        {/* Hakkımda Bölümü */}
        <section className="mb-16 bg-gray-800/30 p-8 rounded-xl border border-gray-700">
          <h2 className="text-3xl font-bold mb-8 text-white">Hakkımda</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-200">İletişim Bilgileri</h3>
              <div className="space-y-4">
                <a href="mailto:info@example.com" className="flex items-center text-gray-300 hover:text-blue-400 transition-colors">
                  <EmailIcon />
                  <span className="ml-2">info@example.com</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
} 