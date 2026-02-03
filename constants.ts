import {
  Code2,
  Database,
  Globe,
  Cpu,
  Layers,
  Smartphone,
  Terminal,
  Layout,
  Server,
  Cloud
} from 'lucide-react';
import { TechItem, Course, Project, BlogPost, NavItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
];

export const TECH_STACK: TechItem[] = [
  { name: 'React', icon: Code2 },
  { name: 'Node.js', icon: Server },
  { name: 'MongoDB', icon: Database },
  { name: 'Next.js', icon: Layout },
  { name: 'Tailwind', icon: Globe },
  { name: 'TypeScript', icon: Terminal },
  { name: 'Python', icon: Layers },
  { name: 'AWS', icon: Cloud },
];
