"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoginModalProps {
  onLoginSuccess: () => void;
}

const VALID_EMAILS = ["takasi6116@yahoo.co.jp", "goto_takashi@cellmuller.com"];
const VALID_PW = "Dodger$01858";

export default function LoginModal({ onLoginSuccess }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (VALID_EMAILS.includes(email) && password === VALID_PW) {
      setError(false);
      onLoginSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop (クリックで閉じないようにする) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-[#0F1115]/90 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
          className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        >
          <div className="border-b border-border/60 bg-background/30 px-6 py-5 text-center">
            <h2 className="font-display text-xl font-semibold tracking-wide text-textMain">
              Prompt<span className="text-accent italic ml-1">Library</span>
            </h2>
            <p className="mt-1 text-sm text-textSub">ログインして続行してください</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-500 text-center">
                メールアドレスまたはパスワードが間違っています。
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-textSub">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@example.com"
                className="w-full rounded-lg border border-border bg-surfaceHover px-3.5 py-2.5 text-sm text-textMain placeholder-textSub/50 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                required
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-textSub">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-border bg-surfaceHover px-3.5 py-2.5 text-sm text-textMain placeholder-textSub/50 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent/90 hover:scale-[1.02] focus-visible:outline-none disabled:opacity-50 disabled:hover:scale-100"
                disabled={!email || !password}
              >
                ログイン
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
