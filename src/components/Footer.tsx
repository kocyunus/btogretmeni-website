import Link from 'next/link';
import { Navigation } from './ui/styles';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className={Navigation.container}>
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">İletişim</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/iletisim" className={Navigation.link}>
                    İletişim Formu
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:info@btogretmeni.com"
                    className={Navigation.link}
                  >
                    Email
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/btogretmeni"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={Navigation.link}
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com/in/btogretmeni"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={Navigation.link}
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Hızlı Bağlantılar</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog" className={Navigation.link}>
                    Blog Yazıları
                  </Link>
                </li>
                <li>
                  <Link href="/projeler" className={Navigation.link}>
                    Projelerim
                  </Link>
                </li>
                <li>
                  <Link href="/egitim" className={Navigation.link}>
                    Eğitim İçerikleri
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Hakkında</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Bilişim Teknolojileri öğretmeni olarak öğrencilerime ve teknoloji
                meraklılarına rehberlik etmekten mutluluk duyuyorum.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Abone Ol</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Yeni blog yazıları ve güncellemelerden haberdar olmak için abone olun.
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  className="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 
                    transition-colors duration-200"
                >
                  Abone Ol
                </button>
              </form>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} BT Öğretmeni. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 