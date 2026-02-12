import { LucideIcon } from 'lucide-react';

export interface TechItem {
  name: string;
  icon: LucideIcon;
}

export interface Course {
  id: number | string;
  title: string;
  description: string;
  image: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: string;
  rating: number;
  students: number;
  instructor: string;
  duration: string;
  tags: string[];
}

export interface Project {
  id: string | number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  price?: string;
  githubLink?: string;
  previewUrl?: string;
  gallery?: string[];
  isStudentFree?: boolean; // New Field
}

export interface StudentRequest {
  id: string;
  userId: string;
  email: string;
  displayName: string;
  idCardUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  content: string; // Added for detail view
  tags?: string[];
  author?: string;
  readTime?: string;
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
}

export interface NavItem {
  label: string;
  href: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  validUntil: string; // ISO date string
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string; // HTML content
  type: 'order_confirmation' | 'welcome' | 'custom';
  updatedAt: any;
}

export interface ProjectRequest {
  id: string;
  projectName: string;
  contactEmail: string;
  budget: string;
  priority: 'standard' | 'rush';
  description: string;
  features: string;
  status: 'pending' | 'contacted' | 'in_progress' | 'completed';
  userId: string;
  createdAt: any;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  createdAt?: any;
}