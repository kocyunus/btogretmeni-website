'use client';

import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import { Card } from '@/components/ui/Card';
import { FaClock, FaCalendar, FaTags } from 'react-icons/fa';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post._id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow duration-200">
        {/* Kapak Resmi */}
        <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/10 rounded-t-lg">
          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover rounded-t-lg"
            />
          )}
          {post.isDraft && (
            <div className="absolute top-4 left-4">
              <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
                Taslak
              </span>
            </div>
          )}
        </div>

        {/* İçerik */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-3 line-clamp-2">{post.title}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
            {post.description}
          </p>

          {/* Meta Bilgiler */}
          <div className="mt-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <FaCalendar className="w-4 h-4" />
              <span>
                {new Date(post.publishedAt).toLocaleDateString('tr-TR')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="w-4 h-4" />
              <span>{post.readingTime} dakika okuma</span>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <FaTags className="w-4 h-4" />
                <div className="flex flex-wrap gap-1">
                  {post.tags.map((tag) => (
                    <span
                      key={`${post._id}-${tag}`}
                      className="inline-block bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
} 