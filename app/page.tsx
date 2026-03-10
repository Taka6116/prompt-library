"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Header from "@/components/Header";
import TabBar from "@/components/TabBar";
import PromptCard from "@/components/PromptCard";
import AddPromptModal from "@/components/AddPromptModal";
import AddCategoryModal from "@/components/AddCategoryModal";
import LoginModal from "@/components/LoginModal";
import type { CategoryId, PromptItem, Category } from "@/data/types";
import { DEFAULT_CATEGORIES } from "@/data/types";
import { DEFAULT_PROMPTS } from "@/data/defaultPrompts";
import { Plus, LogOut } from "lucide-react";

const STORAGE_KEY_PROMPTS = "prompt-collection-user-prompts";
const STORAGE_KEY_CATEGORIES = "prompt-collection-categories";
const STORAGE_KEY_AUTH = "prompt-collection-auth";

function isValidPromptItem(x: unknown): x is PromptItem {
  return (
    typeof x === "object" &&
    x !== null &&
    "id" in x &&
    typeof (x as PromptItem).id === "string" &&
    "title" in x &&
    typeof (x as PromptItem).title === "string"
  );
}

function loadUserPrompts(): Record<CategoryId, PromptItem[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROMPTS);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};
    const result: Record<string, PromptItem[]> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (Array.isArray(value)) {
        result[key] = value.filter(isValidPromptItem) as PromptItem[];
      }
    }
    return result as Record<CategoryId, PromptItem[]>;
  } catch {
    return {};
  }
}

function loadCustomCategories(): Category[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function buildDefaultItems(): Record<CategoryId, PromptItem[]> {
  const byCategory: Record<CategoryId, PromptItem[]> = {};
  DEFAULT_CATEGORIES.forEach(c => {
    byCategory[c.id] = [];
  });
  DEFAULT_PROMPTS.forEach((p) => {
    if (!byCategory[p.category]) byCategory[p.category] = [];
    byCategory[p.category].push({
      id: p.id,
      title: p.title,
      description: p.description,
      prompt: p.prompt,
      expectedOutput: p.expectedOutput,
      isUserAdded: false,
    });
  });
  return byCategory;
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("analysis");
  const [defaultItems] = useState<Record<CategoryId, PromptItem[]>>(buildDefaultItems);
  const [userItems, setUserItems] = useState<Record<CategoryId, PromptItem[]>>({});
  const userItemsRef = useRef<Record<CategoryId, PromptItem[]>>({});

  const [customCategories, setCustomCategories] = useState<Category[]>([]);
  
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  const categories = useMemo(() => {
    return [...DEFAULT_CATEGORIES, ...customCategories];
  }, [customCategories]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const loaded = loadUserPrompts();
    setUserItems(loaded);
    userItemsRef.current = loaded;
    setCustomCategories(loadCustomCategories());
    setIsAuthenticated(localStorage.getItem(STORAGE_KEY_AUTH) === "true");
  }, [mounted]);

  useEffect(() => {
    userItemsRef.current = userItems;
  }, [userItems]);

  useEffect(() => {
    if (!mounted) return;
    const saveOnUnload = () => {
      try {
        const current = userItemsRef.current;
        if (typeof window !== "undefined" && Object.keys(current).length >= 0) {
          localStorage.setItem(STORAGE_KEY_PROMPTS, JSON.stringify(current));
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener("beforeunload", saveOnUnload);
    const visibilityHandler = () => {
      if (document.visibilityState === "hidden") saveOnUnload();
    };
    document.addEventListener("visibilitychange", visibilityHandler);
    return () => {
      window.removeEventListener("beforeunload", saveOnUnload);
      document.removeEventListener("visibilitychange", visibilityHandler);
    };
  }, [mounted]);

  const handleLoginSuccess = useCallback(() => {
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEY_AUTH, "true");
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEY_AUTH);
  }, []);

  const saveUserPrompts = useCallback(
    (next: Record<CategoryId, PromptItem[]>) => {
      setUserItems(next);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_PROMPTS, JSON.stringify(next));
      }
    },
    []
  );

  const handleAddCategory = useCallback((label: string) => {
    const newId = `custom-${Date.now()}`;
    const newCategory: Category = { id: newId, label, isUserAdded: true };
    const nextCats = [...customCategories, newCategory];
    setCustomCategories(nextCats);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(nextCats));
    }
    setActiveCategory(newId);
  }, [customCategories]);

  const addPrompt = useCallback(
    (
      category: CategoryId,
      data: Omit<PromptItem, "id" | "isUserAdded">
    ) => {
      const id = `user-${category}-${Date.now()}`;
      const newItem: PromptItem = {
        ...data,
        id,
        isUserAdded: true,
      };
      const next = { ...userItems };
      next[category] = [newItem, ...(next[category] || [])];
      saveUserPrompts(next);
    },
    [userItems, saveUserPrompts]
  );

  const editPrompt = useCallback(
    (id: string, updates: Partial<PromptItem>, categoryId?: CategoryId) => {
      const next = { ...userItems };
      for (const cat of categories) {
        const list = next[cat.id] || [];
        const idx = list.findIndex((p) => p.id === id);
        if (idx >= 0) {
          next[cat.id] = list.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          );
          saveUserPrompts(next);
          return;
        }
      }
      // デフォルトプロンプトの編集 → 編集内容で新しいユーザー用プロンプトとして追加
      const cat = categoryId ?? activeCategory;
      const newId = `user-${cat}-${Date.now()}`;
      const newItem: PromptItem = {
        id: newId,
        title: (updates.title ?? "").trim(),
        description: updates.description ?? "",
        prompt: updates.prompt ?? "",
        expectedOutput: updates.expectedOutput ?? "",
        imageUrl: updates.imageUrl,
        url: updates.url,
        isUserAdded: true,
      };
      next[cat] = [newItem, ...(next[cat] || [])];
      saveUserPrompts(next);
    },
    [userItems, activeCategory, categories, saveUserPrompts]
  );

  const deletePrompt = useCallback(
    (id: string) => {
      const next = { ...userItems };
      for (const cat of categories) {
        if (next[cat.id]) {
          next[cat.id] = next[cat.id].filter((p) => p.id !== id);
        }
      }
      saveUserPrompts(next);
    },
    [userItems, categories, saveUserPrompts]
  );

  const itemsForCategory = (cat: CategoryId): PromptItem[] => {
    const defaults = defaultItems[cat] || [];
    const users = userItems[cat] || [];
    return [...users, ...defaults];
  };

  const currentItems = itemsForCategory(activeCategory);
  const activeCategoryLabel = categories.find(c => c.id === activeCategory)?.label || "";

  return (
    <div className="min-h-screen bg-[#F4F5F8]">
      <Header />
      <TabBar
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onAddCategoryClick={() => setAddCategoryModalOpen(true)}
      />

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-textMain">
              {activeCategoryLabel}
            </h2>
            <p className="mt-1.5 text-sm text-textSub">
              このカテゴリのプロンプト一覧。ワンクリックでコピーして使用できます。
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent/90 hover:scale-[1.02] hover:shadow-lg hover:shadow-accent/20 focus-visible:outline-none shrink-0"
          >
            <Plus className="h-4 w-4" />
            {activeCategory === "output_example" ? "アウトプット追加" : activeCategory === "article" ? "記事を追加" : "プロンプトを追加"}
          </button>
        </div>

        <section
          key={activeCategory}
          className="animate-fade-in transition-all duration-300"
          aria-labelledby="category-heading"
        >
          <h2 id="category-heading" className="sr-only">
            {activeCategoryLabel}
          </h2>

          {currentItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/30 py-24 text-center">
              <div className="mb-4 rounded-full bg-surfaceHover p-3">
                <Plus className="h-6 w-6 text-textSub" />
              </div>
              <p className="text-textMain font-medium mb-1">
                {activeCategory === "output_example" ? "アウトプットがありません" : activeCategory === "article" ? "記事がありません" : "プロンプトがありません"}
              </p>
              <p className="text-sm text-textSub mb-6 max-w-sm">
                {activeCategory === "output_example"
                  ? "まだこのカテゴリにはアウトプット例が追加されていません。新しいアウトプット例を追加して、チームで共有しましょう。"
                  : activeCategory === "article"
                  ? "まだこのカテゴリには記事が追加されていません。URLを追加して、記事をストックしましょう。"
                  : "まだこのカテゴリにはプロンプトが追加されていません。新しいプロンプトを作成して、作業を効率化しましょう。"}
              </p>
              <button
                type="button"
                onClick={() => setAddModalOpen(true)}
                className="rounded-lg bg-surfaceHover border border-border px-5 py-2.5 text-sm font-medium text-textMain transition-all hover:bg-border focus-visible:outline-none"
              >
                {activeCategory === "output_example" ? "アウトプットを追加する" : activeCategory === "article" ? "記事を追加する" : "プロンプトを追加する"}
              </button>
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 list-none p-0 m-0">
              {currentItems.map((item) => (
                <li key={item.id} className="list-none flex h-full">
                  <PromptCard
                    item={item}
                    categoryId={activeCategory}
                    onEdit={editPrompt}
                    onDelete={deletePrompt}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <AddPromptModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        categories={categories}
        initialCategory={activeCategory}
        onAdd={addPrompt}
      />
      
      <AddCategoryModal
        isOpen={addCategoryModalOpen}
        onClose={() => setAddCategoryModalOpen(false)}
        onAdd={handleAddCategory}
      />

      {!isAuthenticated && <LoginModal onLoginSuccess={handleLoginSuccess} />}
    </div>
  );
}
