import BlogEditForm from '@/components/blog/BlogEditForm';

interface Props {
  params: {
    slug: string;
  };
}

export default function EditBlogPage({ params }: Props) {
  return (
    <div className="container mx-auto px-4 py-8">
      <BlogEditForm slug={params.slug} />
    </div>
  );
} 