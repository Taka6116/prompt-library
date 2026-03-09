import type { CategoryId } from "./types";

export interface DefaultPromptDef {
  id: string;
  title: string;
  description: string;
  prompt: string;
  expectedOutput: string;
  category: CategoryId;
}

export const DEFAULT_PROMPTS: DefaultPromptDef[] = [
  {
    id: "default-analysis-1",
    category: "analysis",
    title: "データの傾向分析",
    description: "数値データの傾向を整理し、示唆を引き出すプロンプトです。",
    prompt: `以下のデータを分析し、傾向と示唆をまとめてください。

【データ】
（ここにデータを貼り付けてください）

【出力形式】
1. 概要
2. 主な傾向（3〜5点）
3. 示唆・アクション提案`,
    expectedOutput: "構造化された分析レポート（概要・傾向・示唆）",
  },
  {
    id: "default-slide-1",
    category: "slide",
    title: "プレゼン骨子作成",
    description: "伝えたいメッセージからスライドの構成案を生成します。",
    prompt: `以下のテーマでプレゼン資料の骨子を作成してください。

【テーマ】
（テーマを記入）

【条件】
- スライド枚数：10枚前後
- 各スライドのタイトルと要点（1〜3箇条）を記載
- 序論・本論・結論の流れを意識`,
    expectedOutput: "スライドごとのタイトルと要点の一覧",
  },
  {
    id: "default-persona-1",
    category: "persona",
    title: "ペルソナ設計",
    description: "ターゲット像を具体的なペルソナとして定義します。",
    prompt: `以下の製品・サービス向けにペルソナを1名作成してください。

【製品・サービス】
（概要を記入）

【含める項目】
- 名前・年齢・職業
- 生活スタイル・価値観
- 課題・ニーズ
- 情報収集の傾向
- この製品に求めること`,
    expectedOutput: "1名分の詳細なペルソナ記述",
  },
  {
    id: "default-summary-1",
    category: "summary",
    title: "長文要約",
    description: "長いテキストを指定文字数で要約します。",
    prompt: `以下の文章を要約してください。

【条件】
- 要約後の文字数：約（〇〇）文字
- 重要な事実・数字は残す
- 結論を先に述べる

【本文】
（ここにテキストを貼り付け）`,
    expectedOutput: "指定文字数内の要約文",
  },
  {
    id: "default-problem-1",
    category: "problem",
    title: "壁打ち・問題整理",
    description: "漠然とした課題を整理し、次のアクションを明確にします。",
    prompt: `今抱えている課題について、壁打ちしてください。

【現状】
（課題や状況を自由に書いてください）

【期待する出力】
1. 課題の整理（何が本当の問題か）
2. 選択肢の列挙
3. 次の一歩の提案`,
    expectedOutput: "整理された課題・選択肢・次のアクション",
  },
  {
    id: "default-programming-1",
    category: "programming",
    title: "コード解説",
    description: "コードの動作と意図を解説してもらうプロンプトです。",
    prompt: `以下のコードの動作と意図を解説してください。

【コード】
\`\`\`
（ここにコードを貼り付け）
\`\`\`

【解説してほしい点】
- 全体の処理の流れ
- 重要な変数・関数の役割
- 注意点・改善の余地があれば`,
    expectedOutput: "処理の流れ・役割・注意点の解説",
  },
  {
    id: "default-output-example-1",
    category: "output_example",
    title: "記事の構成アウトプット",
    description: "プロンプトを入力した際に出力される、理想的なブログ記事構成の例です。",
    prompt: `【タイトル】
読者を惹きつける魅力的なブログ記事の書き方

【導入】
- 読者の悩みへの共感
- 記事を読むメリット
- 結論の提示

【見出し1: なぜ構成が重要なのか？】
- 構成がないと起こる問題
- 構成があることのメリット3選

【見出し2: 構成作成の5ステップ】
1. ターゲットの明確化
2. キーワード選定
3. リサーチと情報収集
4. 見出しの作成
5. 肉付け

【まとめ】
- 全体の振り返り
- 次のアクション（CTA）`,
    expectedOutput: "上記のような構造化されたブログ記事の構成案",
  },
];
