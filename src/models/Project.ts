import mongoose, { Schema, Document } from 'mongoose';
import type { ProjectCategory, ProjectStatus } from '@/types/project';

export interface ProjectDocument extends Document {
  title: string;
  description: string;
  summary: string;
  slug: string;
  category: ProjectCategory;
  technologies: string[];
  features: string[];
  images: string[];
  status: ProjectStatus;
  isPublished: boolean;
  startDate?: Date;
  endDate?: Date;
  demoUrl?: string;
  githubUrl?: string;
  downloadUrl?: string;
  playStoreUrl?: string;
  appStoreUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

const ProjectSchema = new Schema<ProjectDocument>({
  title: { 
    type: String, 
    required: true,
    maxlength: 100 
  },
  description: { 
    type: String, 
    required: true, 
    maxlength: 5000
  },
  summary: {
    type: String,
    maxlength: 150
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true 
  },
  category: { 
    type: String, 
    required: true, 
    enum: ['MobilOyun', 'WebSite', 'PlayableAds', 'RobotikEgitim', 'Diger'],
    default: 'Diger'
  },
  technologies: [{ type: String }],
  features: [{ type: String }],
  images: [{ type: String }],
  status: { 
    type: String, 
    required: true,
    enum: ['planned', 'in-progress', 'completed'],
    default: 'planned'
  },
  isPublished: { type: Boolean, default: false },
  startDate: { type: Date },
  endDate: { type: Date },
  demoUrl: { type: String },
  githubUrl: { type: String },
  downloadUrl: { type: String },
  playStoreUrl: { type: String },
  appStoreUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  publishedAt: { type: Date }
}, {
  timestamps: true
});

// Slug'ı küçük harfe çevir
ProjectSchema.pre('save', function(next) {
  if (this.isModified('slug')) {
    this.slug = this.slug.toLowerCase();
  }
  next();
});

export default mongoose.models.Project || mongoose.model<ProjectDocument>('Project', ProjectSchema); 