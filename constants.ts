
import { CategoryTheme } from './types';

export const CATEGORIES: CategoryTheme[] = [
  { name: 'شخصی', color: '#3b82f6', bg: 'bg-blue-100 text-blue-700' },
  { name: 'کاری', color: '#10b981', bg: 'bg-emerald-100 text-emerald-700' },
  { name: 'ایده', color: '#f59e0b', bg: 'bg-amber-100 text-amber-700' },
  { name: 'مهم', color: '#ef4444', bg: 'bg-red-100 text-red-700' },
  { name: 'سایر', color: '#64748b', bg: 'bg-slate-100 text-slate-700' },
];

export const STORAGE_KEY = 'smart_notes_data';
