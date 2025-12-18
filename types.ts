
export type Category = 'شخصی' | 'کاری' | 'ایده' | 'مهم' | 'سایر';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: Category;
  createdAt: number;
  updatedAt: number;
  isPinned: boolean;
  aiSummary?: string;
}

export interface CategoryTheme {
  name: Category;
  color: string;
  bg: string;
}
