"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (label: string) => void;
}

export default function AddCategoryModal({
  isOpen,
  onClose,
  onAdd,
}: AddCategoryModalProps) {
  const [label, setLabel] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;
    onAdd(label.trim());
    setLabel("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#1D253B]/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
            className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border/60 bg-background/30 px-6 py-4">
              <h2 className="font-sans text-lg font-semibold text-textMain tracking-tight">
                新しいタブ（カテゴリ）を追加
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-textSub transition-colors hover:bg-surfaceHover hover:text-textMain focus-visible:outline-none"
                aria-label="閉じる"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
              <div>
                <label htmlFor="add-category-label" className="mb-1.5 block text-sm font-medium text-textSub">
                  タブの名前 <span className="text-accent">*</span>
                </label>
                <input
                  id="add-category-label"
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="例：ブログ用、SNS投稿用 など"
                  className="w-full rounded-lg border border-border bg-surfaceHover px-3.5 py-2.5 text-sm text-textMain placeholder-textSub/50 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  required
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-textSub transition-colors hover:bg-surfaceHover hover:text-textMain focus-visible:outline-none"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-accent/90 hover:scale-[1.02] focus-visible:outline-none disabled:opacity-50 disabled:hover:scale-100"
                  disabled={!label.trim()}
                >
                  追加する
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
