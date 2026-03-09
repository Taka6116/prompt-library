export type CategoryId = string;

export interface PromptItem {
  id: string;
  title: string;
  description: string;
  prompt: string;
  expectedOutput: string;
  imageUrl?: string;
  url?: string;
  isUserAdded?: boolean;
}

export interface Category {
  id: string;
  label: string;
  isUserAdded?: boolean;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "analysis", label: "分析" },
  { id: "slide", label: "スライド骨子" },
  { id: "persona", label: "ペルソナ" },
  { id: "summary", label: "要約・抽出" },
  { id: "problem", label: "問題解決・壁打ち" },
  { id: "programming", label: "プログラミング" },
  { id: "output_example", label: "アウトプット例" },
  { id: "article", label: "記事" },
];

export const CATEGORY_IDS: CategoryId[] = DEFAULT_CATEGORIES.map(c => c.id);

export const CATEGORY_LABELS: Record<CategoryId, string> = 
  Object.fromEntries(DEFAULT_CATEGORIES.map(c => [c.id, c.label]));
