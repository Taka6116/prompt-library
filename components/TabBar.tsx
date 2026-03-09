"use client";

import { motion } from "framer-motion";
import type { CategoryId, Category } from "@/data/types";
import { Plus } from "lucide-react";

interface TabBarProps {
  categories: Category[];
  activeCategory: CategoryId;
  onCategoryChange: (category: CategoryId) => void;
  onAddCategoryClick: () => void;
}

export default function TabBar({ categories, activeCategory, onCategoryChange, onAddCategoryClick }: TabBarProps) {
  return (
    <div className="border-b border-border/60 bg-background/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <nav
          className="flex gap-2 overflow-x-auto scrollbar-thin py-3 items-center"
          aria-label="カテゴリタブ"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onCategoryChange(cat.id)}
                className={`relative shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none ${
                  isActive ? "text-accent" : "text-textSub hover:text-textMain hover:bg-surfaceHover/50"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 rounded-lg bg-accent/10"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={onAddCategoryClick}
            className="shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-textSub hover:text-textMain hover:bg-surfaceHover/50 transition-colors focus-visible:outline-none border border-dashed border-border/60 ml-2"
            aria-label="新しいタブを追加"
          >
            <Plus className="h-4 w-4" />
            タブを追加
          </button>
        </nav>
      </div>
    </div>
  );
}
