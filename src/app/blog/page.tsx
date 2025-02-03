import { getBlogPosts } from '@/lib/blog';
import BlogCard from '@/components/blog/BlogCard';
import type { BlogPost } from '@/types/blog';

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post: BlogPost) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
