'use client';

import Link from 'next/link'
import { EducationIcon, ProjectIcon, BlogIcon } from '@/components/icons/HomeIcons'
import { FaInstagram, FaYoutube, FaLinkedin, FaGithub } from 'react-icons/fa'
import { SiUpwork } from 'react-icons/si'
import InteractiveRods from '@/components/InteractiveRods'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Bölümü */}
        <section className="text-center mb-16">
          <div className="mb-12">
            <InteractiveRods />
          </div>
          <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Hoş Geldiniz
          </h1>
          <p className="text-xl mb-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Eğitimci yaklaşımım ve yenilikçi içeriklerle, öğrenmeyi eğlenceli hale getiriyorum. Bilgi ve ilham dolu bu yolculuğa siz de katılın!
          </p>
        </section>

        {/* Kartlar */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Eğitim Kartı */}
          <Link href="/egitim" className="block group">
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 group-hover:border-blue-500 transition-all group-hover:shadow-lg group-hover:shadow-blue-500/10">
              <div className="text-blue-500 mb-4">
                <EducationIcon />
              </div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Eğitim</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Web tasarım, programlama ve robotik alanlarında eğitimler veriyorum.
              </p>
            </div>
          </Link>

          {/* Projeler Kartı */}
          <Link href="/projeler" className="block group">
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 group-hover:border-purple-500 transition-all group-hover:shadow-lg group-hover:shadow-purple-500/10">
              <div className="text-purple-500 mb-4">
                <ProjectIcon />
              </div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Projeler</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Açık kaynak ve eğitim teknolojileri alanında projeler geliştiriyorum.
              </p>
            </div>
          </Link>

          {/* Blog Kartı */}
          <Link href="/blog" className="block group">
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 group-hover:border-green-500 transition-all group-hover:shadow-lg group-hover:shadow-green-500/10">
              <div className="text-green-500 mb-4">
                <BlogIcon />
              </div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Blog</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Teknoloji ve eğitim alanındaki deneyimlerimi blog yazılarında paylaşıyorum.
              </p>
            </div>
          </Link>
        </div>

        {/* Sosyal Medya Bölümü */}
        <section className="mb-16 bg-white dark:bg-gray-800/30 p-8 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">Sosyal Medya</h2>
          <div className="flex justify-center items-center space-x-8">
            <a
              href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-pink-500 transition-colors"
            >
              <FaInstagram className="w-8 h-8" />
            </a>
            <a
              href={process.env.NEXT_PUBLIC_YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-red-500 transition-colors"
            >
              <FaYoutube className="w-8 h-8" />
            </a>
            <a
              href={process.env.NEXT_PUBLIC_LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-500 transition-colors"
            >
              <FaLinkedin className="w-8 h-8" />
            </a>
            <a
              href={process.env.NEXT_PUBLIC_GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaGithub className="w-8 h-8" />
            </a>
            <a
              href={process.env.NEXT_PUBLIC_UPWORK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-[#6fda44] transition-colors"
            >
              <SiUpwork className="w-8 h-8" />
            </a>
          </div>
        </section>
      </div>
    </main>
  )
} 