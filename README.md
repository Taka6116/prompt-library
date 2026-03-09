# プロンプト集（ワンクリックでコピー）

カテゴリ別にプロンプトを管理し、ワンクリックでクリップボードにコピーできる Next.js の Web アプリです。

## 機能

- **6 つのカテゴリ**: 分析・スライド骨子・ペルソナ・要約・抽出・問題解決・壁打ち・プログラミング
- **タブ切り替え**: カテゴリごとにプロンプト一覧を表示
- **プロンプトの追加**: タイトル・解説・本文・期待するアウトプットを入力して保存
- **コピー**: 各カードの「コピーする」でプロンプト本文をクリップボードにコピー（Copied! ✓ でフィードバック）
- **編集・削除**: ユーザー追加分は編集・削除可能。デフォルトプロンプトの編集は「マイプロンプト」として新規保存
- **永続化**: ユーザー追加プロンプトは localStorage に保存され、リロード後も保持

## セットアップ

```bash
npm install --legacy-peer-deps
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## ビルド

```bash
npm run build
npm start
```

## 技術スタック

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- lucide-react（アイコン）

## プロジェクト構成

- `app/` - レイアウト・ページ・グローバルスタイル
- `components/` - Header, TabBar, PromptCard, AddPromptModal, EditPromptModal
- `data/` - 型定義・デフォルトプロンプト
