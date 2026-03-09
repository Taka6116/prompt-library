"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Pencil, Trash2, ExternalLink } from "lucide-react";
import type { CategoryId, PromptItem } from "@/data/types";
import EditPromptModal from "./EditPromptModal";

const COPIED_DURATION_MS = 1500;

interface PromptCardProps {
  item: PromptItem;
  categoryId: CategoryId;
  onEdit: (id: string, updates: Partial<PromptItem>, categoryId?: CategoryId) => void;
  onDelete: (id: string) => void;
}

export default function PromptCard({
  item,
  categoryId,
  onEdit,
  onDelete,
}: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const [localTitle, setLocalTitle] = useState(item.title);
  const [localPrompt, setLocalPrompt] = useState(item.prompt);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalTitle(item.title);
  }, [item.title]);

  useEffect(() => {
    setLocalPrompt(item.prompt);
  }, [item.prompt]);

  useEffect(() => {
    // We remove the auto-resize height logic so it respects the min-height/max-height and uses normal scrollbar
  }, [localPrompt]);

  const handleTitleBlur = () => {
    if (localTitle.trim() && localTitle.trim() !== item.title) {
      onEdit(item.id, { title: localTitle.trim() }, categoryId);
    } else {
      setLocalTitle(item.title);
    }
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalPrompt(e.target.value);
  };

  const handlePromptBlur = () => {
    if (localPrompt.trim() && localPrompt.trim() !== item.prompt) {
      onEdit(item.id, { prompt: localPrompt.trim() }, categoryId);
    } else {
      setLocalPrompt(item.prompt);
    }
  };

  const handleCopy = useCallback(async () => {
    try {
      const textToCopy = categoryId === "article" && item.url ? item.url : localPrompt;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), COPIED_DURATION_MS);
    } catch {
      // fallback for older browsers
      setCopied(true);
      setTimeout(() => setCopied(false), COPIED_DURATION_MS);
    }
  }, [categoryId, item.url, localPrompt]);

  const handleEditSubmit = useCallback(
    (updates: Partial<PromptItem>) => {
      onEdit(item.id, updates, categoryId);
      setEditOpen(false);
    },
    [item.id, categoryId, onEdit]
  );

  return (
    <>
      <article
        className="group animate-fade-in flex flex-col h-full w-full rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/5"
        data-prompt-id={item.id}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <input
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            onBlur={handleTitleBlur}
            className="font-sans text-base font-semibold text-textMain tracking-tight bg-transparent border border-transparent hover:border-border/60 focus:border-accent/50 focus:bg-surfaceHover focus:outline-none w-full px-2 py-1 -ml-2 rounded-md transition-all min-w-0"
            aria-label="プロンプトのタイトル"
          />
          <div className="flex shrink-0 gap-1.5 opacity-80 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-accent/20 bg-accent/10 px-2.5 py-1.5 text-xs font-medium text-accent transition-all hover:scale-105 hover:bg-accent hover:text-white focus-visible:outline-none"
              aria-label={categoryId === "article" ? "URLをコピー" : "プロンプトをコピー"}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" aria-hidden />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" aria-hidden />
                  <span>Copy</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-textSub transition-all hover:scale-105 hover:border-textSub/50 hover:text-textMain focus-visible:outline-none"
              aria-label="プロンプトを編集"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden />
              <span>Edit</span>
            </button>
            {item.isUserAdded && (
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-textSub transition-all hover:scale-105 hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/10 focus-visible:outline-none"
                aria-label="プロンプトを削除"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden />
              </button>
            )}
          </div>
        </div>

        {item.description && (
          <p className="mb-4 text-sm text-textSub leading-relaxed">
            {item.description}
          </p>
        )}

        {categoryId === "article" && item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link block mb-5 overflow-hidden rounded-lg border border-border/80 bg-surface transition-all hover:border-accent/40 hover:shadow-md"
          >
            {item.imageUrl && (
              <div className="w-full h-40 bg-surfaceHover overflow-hidden border-b border-border/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/link:scale-105"
                />
              </div>
            )}
            <div className="p-4 relative">
              <ExternalLink className="absolute top-4 right-4 h-4 w-4 text-textSub opacity-0 transition-all group-hover/link:opacity-100 group-hover/link:text-accent" />
              <p className="text-sm font-medium text-textMain line-clamp-1 mb-1 group-hover/link:text-accent transition-colors pr-6">
                {item.title}
              </p>
              <p className="text-xs text-textSub line-clamp-2 mb-2">
                {item.description}
              </p>
              <p className="text-xs font-mono text-textSub/70 truncate">
                {item.url}
              </p>
            </div>
          </a>
        ) : (
          <div className="relative mb-5 flex-1 group/prompt">
            <textarea
              ref={textareaRef}
              value={localPrompt}
              onChange={handlePromptChange}
              onBlur={handlePromptBlur}
              className="block w-full resize-y rounded-lg bg-code border border-border/50 p-4 font-mono text-sm text-[#4F5968] transition-all duration-300 hover:border-accent/30 hover:bg-surfaceHover focus:bg-surface focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none min-h-[90px] max-h-[400px]"
              aria-label="プロンプト本文"
              rows={3}
            />
          </div>
        )}

        {categoryId !== "article" && (item.expectedOutput || item.imageUrl) && (
          <div className="mt-auto border-l-2 border-accent/40 bg-accent/5 pl-4 py-3 pr-3 rounded-r-lg">
            {item.expectedOutput && (
              <p className="text-sm text-textSub leading-relaxed mb-3 last:mb-0">
                {item.expectedOutput}
              </p>
            )}
            {item.imageUrl && (
              <div className="mt-2 rounded-md overflow-hidden border border-border bg-white p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt="Output example"
                  className="w-full h-auto object-contain max-h-48 rounded"
                />
              </div>
            )}
          </div>
        )}
      </article>

      <EditPromptModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        item={item}
        categoryId={categoryId}
        onSubmit={handleEditSubmit}
      />

      <AnimatePresence>
        {deleteConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-[#1D253B]/50 backdrop-blur-sm"
              onClick={() => setDeleteConfirmOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
              className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card shadow-2xl p-6 text-center"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                <Trash2 className="h-6 w-6 text-red-500" />
              </div>
              <h2 className="mb-2 text-lg font-semibold text-textMain tracking-tight">
                本当に削除しますか？
              </h2>
              <p className="mb-6 text-sm text-textSub">
                「{item.title}」を削除します。<br />この操作は元に戻せません。
              </p>
              <div className="flex gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="flex-1 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-textSub transition-colors hover:bg-surfaceHover hover:text-textMain focus-visible:outline-none"
                >
                  いいえ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDelete(item.id);
                    setDeleteConfirmOpen(false);
                  }}
                  className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-600 hover:scale-[1.02] focus-visible:outline-none"
                >
                  はい
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
