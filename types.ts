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
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  content: string; // Added for detail view
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