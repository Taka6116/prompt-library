"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon } from "lucide-react";
import type { PromptItem } from "@/data/types";

interface EditPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: PromptItem;
  categoryId?: string;
  onSubmit: (updates: Partial<PromptItem>) => void;
}

export default function EditPromptModal({
  isOpen,
  onClose,
  item,
  categoryId,
  onSubmit,
}: EditPromptModalProps) {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [prompt, setPrompt] = useState(item.prompt);
  const [expectedOutput, setExpectedOutput] = useState(item.expectedOutput);
  const [imageUrl, setImageUrl] = useState(item.imageUrl);
  const [url, setUrl] = useState(item.url || "");

  const handleUrlBlur = async () => {
    if (!url.trim() || categoryId !== "article") return;
    try {
      const res = await fetch(`/api/ogp?url=${encodeURIComponent(url.trim())}`);
      if (res.ok) {
        const data = await res.json();
        if (data.title && !title) setTitle(data.title);
        if (data.description && !description) setDescription(data.description);
        if (data.image && !imageUrl) setImageUrl(data.image);
      }
    } catch (error) {
      console.error("Failed to fetch OGP data", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTitle(item.title);
      setDescription(item.description);
      setPrompt(item.prompt);
      setExpectedOutput(item.expectedOutput);
      setImageUrl(item.imageUrl);
      setUrl(item.url || "");
    }
  }, [isOpen, item.title, item.description, item.prompt, item.expectedOutput, item.imageUrl, item.url]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            setImageUrl(event.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || (!prompt.trim() && categoryId !== "article") || (categoryId === "article" && !url.trim())) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      prompt: prompt.trim() || url.trim(),
      expectedOutput: expectedOutput.trim(),
      imageUrl,
      url: categoryId === "article" ? url.trim() : undefined,
    });
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
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border/60 bg-background/30 px-6 py-4">
              <h2 className="font-sans text-lg font-semibold text-textMain tracking-tight">
                {categoryId === "output_example" ? "アウトプット例を編集" : "プロンプトを編集"}
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

            <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5 max-h-[80vh] overflow-y-auto" onPaste={handlePaste}>
              <div>
                <label htmlFor="edit-title" className="mb-1.5 block text-sm font-medium text-textSub">
                  {categoryId === "article" ? "記事のタイトル" : categoryId === "output_example" ? "アウトプットのタイトル" : "プロンプトの目的（タイトル）"} <span className="text-accent">*</span>
                </label>
                <input
                  id="edit-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surfaceHover px-3.5 py-2.5 text-sm text-textMain transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  required
                />
              </div>

              <div>
                <label htmlFor="edit-description" className="mb-1.5 block text-sm font-medium text-textSub">
                  簡単な解説
                </label>
                <input
                  id="edit-description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surfaceHover px-3.5 py-2.5 text-sm text-textMain transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              {categoryId === "article" && (
                <div>
                  <label htmlFor="edit-url" className="mb-1.5 block text-sm font-medium text-textSub">
                    記事のURL <span className="text-accent">*</span>
                  </label>
                  <input
                    id="edit-url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onBlur={handleUrlBlur}
                    className="w-full rounded-lg border border-border bg-surfaceHover px-3.5 py-2.5 text-sm text-textMain transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    required={categoryId === "article"}
                  />
                  <p className="mt-1.5 text-xs text-textSub">
                    URLを入力してフォーカスを外すと、タイトルやサムネイル画像を自動取得します。
                  </p>
                </div>
              )}

              {categoryId !== "article" && (
                <div>
                  <label htmlFor="edit-prompt" className="mb-1.5 block text-sm font-medium text-textSub">
                    {categoryId === "output_example" ? "アウトプット本文" : "プロンプト本文"} <span className="text-accent">*</span>
                  </label>
                  <textarea
                    id="edit-prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={5}
                    className="w-full resize-y rounded-lg border border-border bg-code font-mono text-sm text-textMain transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    required={categoryId !== "article"}
                  />
                </div>
              )}

              <div>
                <label htmlFor="edit-expected" className="mb-1.5 block text-sm font-medium text-textSub">
                  期待できるアウトプットの概要
                </label>
                <input
                  id="edit-expected"
                  type="text"
                  value={expectedOutput}
                  onChange={(e) => setExpectedOutput(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surfaceHover px-3.5 py-2.5 text-sm text-textMain transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent mb-3"
                />

                <div className="rounded-lg border border-dashed border-border/80 bg-surfaceHover/50 p-4 transition-colors hover:bg-surfaceHover">
                  {imageUrl ? (
                    <div className="relative group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrl}
                        alt="Output example"
                        className="w-full max-h-48 object-contain rounded-md border border-border"
                      />
                      <button
                        type="button"
                        onClick={() => setImageUrl(undefined)}
                        className="absolute top-2 right-2 rounded-md bg-black/60 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80"
                        title="画像を削除"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center">
                      <ImageIcon className="mb-2 h-6 w-6 text-textSub/60" />
                      <p className="mb-1 text-sm font-medium text-textSub">
                        アウトプット例の画像（任意）
                      </p>
                      <p className="text-xs text-textSub/70">
                        クリップボードからペースト（Ctrl+V）するか、
                        <label className="text-accent hover:underline cursor-pointer ml-1">
                          ファイルを選択
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      </p>
                    </div>
                  )}
                </div>
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
                  disabled={!title.trim() || !prompt.trim()}
                >
                  更新する
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
