'use client';

import { Container } from '@/components/ui/Container';
import { BlogList } from '@/components/admin/BlogList';
import { BlogForm } from '@/components/admin/BlogForm';
import { useState } from 'react';
import { BlogPost } from '@/types/blog';

export default function AdminBlogPage() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedPost(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedPost(null);
  };

  return (
    <Container>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Yönetimi</h1>
        <button
          onClick={handleCreate}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
        >
          Yeni Blog Yazısı
        </button>
      </div>

      <BlogList onEdit={handleEdit} />

      {isFormOpen && (
        <BlogForm
          post={selectedPost}
          onClose={handleFormClose}
          isOpen={isFormOpen}
        />
      )}
    </Container>
  );
} 