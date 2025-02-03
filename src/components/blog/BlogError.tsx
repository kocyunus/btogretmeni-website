interface Props {
  message?: string;
}

export default function BlogError({ message = 'Bir hata oluştu' }: Props) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
          Hata
        </h2>
        <p className="text-red-600 dark:text-red-300">
          {message}
        </p>
      </div>
    </div>
  );
} 