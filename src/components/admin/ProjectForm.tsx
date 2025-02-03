'use client';

import { useState } from 'react';
import { Project, ProjectCategory } from '@/types/project';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ImagePlus, X } from 'lucide-react';
import Image from 'next/image';
import slugify from 'slugify';

const CATEGORIES: ProjectCategory[] = ['MobilOyun', 'WebSite', 'PlayableAds', 'RobotikEgitim', 'Diger'];

interface ProjectFormData {
  title: string;
  description: string;
  category: ProjectCategory;
  technologies: string[];
  features: string[];
  images: string[];
  isPublished: boolean;
  summary?: string;
  status?: string;
  demoUrl?: string;
  githubUrl?: string;
  downloadUrl?: string;
}

interface ProjectFormProps {
  project?: Project;
  onSuccess?: () => void;
  onSubmit?: (projectData: ProjectFormData) => Promise<void>;
}

export default function ProjectForm({ project, onSuccess, onSubmit }: ProjectFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>(
    project ? {
      title: project.title || '',
      description: project.description || '',
      category: project.category || 'Diger',
      technologies: project.technologies || [],
      features: project.features || [],
      images: project.images || [],
      isPublished: project.isPublished || false,
      summary: project.summary || '',
      status: project.status || 'planned',
      demoUrl: project.demoUrl || '',
      githubUrl: project.githubUrl || '',
      downloadUrl: project.downloadUrl || ''
    } : {
      title: '',
      description: '',
      category: 'Diger',
      technologies: [],
      features: [],
      images: [],
      isPublished: false,
      summary: '',
      status: 'planned',
      demoUrl: '',
      githubUrl: '',
      downloadUrl: ''
    }
  );

  const [newTechnology, setNewTechnology] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        const response = await fetch('/api/projeler', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            slug: slugify(formData.title, { lower: true, strict: true, locale: 'tr' })
          }),
        });

        const data = await response.json();

        if (data.success) {
          toast({
            title: 'Başarılı',
            description: 'Proje başarıyla eklendi.'
          });
          // Form verilerini sıfırla
          setFormData({
            title: '',
            description: '',
            category: 'Diger',
            technologies: [],
            features: [],
            images: [],
            isPublished: false,
            summary: '',
            status: 'planned',
            demoUrl: '',
            githubUrl: '',
            downloadUrl: ''
          });

          if (onSuccess) {
            onSuccess();
          }
        } else {
          throw new Error(data.error || 'Bir hata oluştu');
        }
      }
    } catch (err) {
      console.error('Form gönderilirken hata:', err);
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      console.log('Görüntüler yükleniyor...');
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      console.log('Yükleme yanıtı:', data);

      if (data.success) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...data.urls]
        }));
        toast({
          title: 'Başarılı',
          description: 'Görüntüler başarıyla yüklendi.'
        });
      } else {
        throw new Error(data.error || 'Görüntüler yüklenemedi');
      }
    } catch (error) {
      console.error('Görüntü yükleme hatası:', error);
      toast({
        title: 'Hata',
        description: error instanceof Error ? error.message : 'Görüntüler yüklenirken bir hata oluştu.',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addTechnology = () => {
    if (newTechnology.trim()) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()]
      }));
      setNewTechnology('');
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-200 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Başlık
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Özet (En fazla 150 karakter)
          </label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary || ''}
            onChange={handleInputChange}
            maxLength={150}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white sm:text-sm"
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {formData.summary ? `${formData.summary.length}/150 karakter` : '0/150 karakter'}
          </p>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Açıklama
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={5}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Durum
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white sm:text-sm"
          >
            <option value="planned">Planlanıyor</option>
            <option value="in-progress">Devam Ediyor</option>
            <option value="completed">Tamamlandı</option>
          </select>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Bağlantılar</h3>
          
          <div>
            <label htmlFor="demoUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Demo URL
            </label>
            <input
              type="url"
              id="demoUrl"
              name="demoUrl"
              value={formData.demoUrl || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              GitHub URL
            </label>
            <input
              type="url"
              id="githubUrl"
              name="githubUrl"
              value={formData.githubUrl || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="downloadUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              İndirme Bağlantısı
            </label>
            <input
              type="url"
              id="downloadUrl"
              name="downloadUrl"
              value={formData.downloadUrl || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Kategori</label>
        <select
          name="category"
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as ProjectCategory }))}
          className="w-full p-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800"
        >
          {CATEGORIES.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Teknolojiler</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newTechnology}
            onChange={e => setNewTechnology(e.target.value)}
            className="flex-1 p-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800"
            placeholder="Yeni teknoloji ekle"
          />
          <Button type="button" onClick={addTechnology}>Ekle</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.technologies.map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm flex items-center gap-2"
            >
              {tech}
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    technologies: prev.technologies.filter((_, i) => i !== index)
                  }));
                }}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Özellikler</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newFeature}
            onChange={e => setNewFeature(e.target.value)}
            className="flex-1 p-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800"
            placeholder="Yeni özellik ekle"
          />
          <Button type="button" onClick={addFeature}>Ekle</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.features.map((feature, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm flex items-center gap-2"
            >
              {feature}
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    features: prev.features.filter((_, i) => i !== index)
                  }));
                }}
                className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Görüntüler</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {formData.images.map((image, index) => (
            <div key={index} className="relative group">
              <Image
                src={image}
                alt={`Proje görüntüsü ${index + 1}`}
                width={200}
                height={150}
                className="rounded-lg object-cover w-full h-[150px]"
                style={{ width: 'auto', height: '150px' }}
                priority={true}
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-destructive rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} className="text-white" />
              </button>
            </div>
          ))}
          <label className="border-2 border-dashed rounded-lg flex items-center justify-center h-[150px] cursor-pointer hover:border-primary transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
            <div className="text-center">
              <ImagePlus className="mx-auto mb-2" />
              <span className="text-sm">{uploading ? 'Yükleniyor...' : 'Görüntü Ekle'}</span>
            </div>
          </label>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPublished"
          checked={formData.isPublished}
          onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
          className="rounded border-gray-300 dark:border-gray-700"
        />
        <label htmlFor="isPublished" className="text-sm font-medium">Yayında</label>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Kaydediliyor...' : 'Oluştur'}
      </Button>
    </form>
  );
} 