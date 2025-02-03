import 'dotenv/config';
import { connectDB } from '@/lib/db';
import Project from '@/models/Project';
import slugify from 'slugify';
import type { ProjectImage } from '@/types/project';

async function updateProjects() {
  try {
    console.log('Veritabanına bağlanılıyor...');
    await connectDB();
    console.log('Veritabanı bağlantısı başarılı');

    // Tüm projeleri al
    const projects = await Project.find({});
    console.log(`${projects.length} adet proje bulundu`);

    // Her projeyi güncelle
    for (const project of projects) {
      // Slug oluştur
      if (!project.slug && project.title) {
        project.slug = slugify(project.title, {
          lower: true,
          strict: true,
          locale: 'tr'
        });
      }

      // Tarihleri düzenle
      if (!project.createdAt) {
        project.createdAt = new Date();
      }
      if (!project.updatedAt) {
        project.updatedAt = new Date();
      }

      // Status alanını kontrol et
      if (!project.status || !['planned', 'in-progress', 'completed'].includes(project.status)) {
        project.status = 'planned';
      }

      // Arrays'leri düzenle
      project.technologies = Array.isArray(project.technologies) ? project.technologies : [];
      project.features = Array.isArray(project.features) ? project.features : [];
      project.images = Array.isArray(project.images) ? 
        project.images.map((img: string | ProjectImage) => 
          typeof img === 'string' ? img : img.url
        ) : [];

      // Boş alanları varsayılan değerlerle doldur ve açıklamayı kısalt
      project.description = project.description ? project.description.slice(0, 500) : '';
      project.category = project.category || 'Diger';
      project.isPublished = typeof project.isPublished === 'boolean' ? project.isPublished : false;

      // Projeyi kaydet
      await project.save();
      console.log(`Proje güncellendi: ${project.title}`);
    }

    console.log('Tüm projeler başarıyla güncellendi');
    process.exit(0);
  } catch (error) {
    console.error('Projeler güncellenirken hata:', error);
    process.exit(1);
  }
}

updateProjects(); 