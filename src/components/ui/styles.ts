// Temel Bileşenler (Atomlar)
export const Button = {
  base: "inline-flex items-center justify-center px-4 py-2 border rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors",
  primary: "bg-indigo-600 text-white hover:bg-indigo-700 border-transparent focus:ring-indigo-500",
  secondary: "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 focus:ring-indigo-500",
  danger: "bg-red-600 text-white hover:bg-red-700 border-transparent focus:ring-red-500",
  disabled: "opacity-50 cursor-not-allowed"
};

export const Input = {
  base: "block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500",
  error: "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500",
  disabled: "bg-gray-100 cursor-not-allowed"
};

// Bileşik Bileşenler (Moleküller)
export const Card = {
  container: "bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden",
  header: "px-6 py-4 border-b border-gray-200 dark:border-gray-700",
  body: "p-6",
  footer: "px-6 py-4 border-t border-gray-200 dark:border-gray-700"
};

export const Form = {
  group: "space-y-2",
  label: "block text-sm font-medium text-gray-700 dark:text-gray-300",
  error: "mt-1 text-sm text-red-600 dark:text-red-400",
  hint: "mt-1 text-sm text-gray-500 dark:text-gray-400"
};

// Karmaşık Bileşenler (Organizmalar)
export const BlogPost = {
  article: "max-w-3xl mx-auto",
  header: "mb-8",
  title: "text-4xl font-bold mb-4",
  metadata: "flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400",
  content: "prose dark:prose-invert max-w-none",
  tags: "flex items-center gap-2 mt-4",
  tag: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200"
};

export const Navigation = {
  header: "fixed top-0 left-0 right-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700",
  container: "container mx-auto px-4",
  nav: "flex items-center justify-between h-16",
  logo: "text-2xl font-bold text-gray-900 dark:text-white",
  menu: "flex items-center space-x-4",
  link: "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
};

// Layout Bileşenleri
export const Layout = {
  page: "min-h-screen bg-gray-50 dark:bg-gray-900",
  container: "container mx-auto px-4 py-8",
  section: "mb-12",
  grid: "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
};

// Yükleme ve Hata Durumları
export const Loading = {
  container: "animate-pulse space-y-4",
  item: "h-4 bg-gray-200 dark:bg-gray-700 rounded",
  avatar: "rounded-full bg-gray-200 dark:bg-gray-700"
};

export const Error = {
  container: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4",
  text: "text-red-600 dark:text-red-400",
  link: "inline-flex items-center mt-4 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
};

// Animasyonlar
export const Animation = {
  fadeIn: "animate-fade-in",
  slideIn: "animate-slide-in",
  pulse: "animate-pulse"
}; 