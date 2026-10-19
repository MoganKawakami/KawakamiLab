# KAWAKAMI Lab.

同人サークルの紹介・作品展示と、日替わりの育成ウマ娘占い。Next.js 15 / React 19 / TypeScript。

## 開発・確認

```sh
npm ci
npm run dev
```

開発サーバーは http://localhost:3000 。Node.js 22 LTSを推奨。

```sh
npm run check  # CSV/JSON整合性、型、Lint、占いロジックの回帰テスト
npm run build
npm start
```

## 構成

- `app/page.tsx`、`components/Site.tsx`：トップ。760px以下は`components/lab/`、761px以上は`components/pc/`。
- `lib/data.ts`：作品、プロフィール、イベント、SNS。PC・スマホ共通。
- `components/lab/PageViewer.tsx`：作品詳細の上に開く試し読み。
- `app/styles/desktop.css`：PC、`mobile-base.css`：共有モバイル基礎、`mobile.css`：画面幅による適用。
- `app/globals.css`：画面切り替え、試し読み。`crystal.css`：共通の水晶球。
- `app/fortune/`：占い・共有結果・OG画像。トップとはグローバルCSSが異なるため、ページ間は通常のリンクで移動。
- `lib/fortune-data.ts`：抽選、共有コードの復元。`fortune-store.ts`：ブラウザ保存。
- `public/images/`：配信用画像。`Images/`：Git対象外の元画像。画像加工の自動スクリプトは未整備。
- `サークル用サイト-handoff.zip`：元デザイン資料。実行時には使用しない。

## データ更新と共有URL互換性

`character.csv`の`name` / `name_en`、`scenario.csv`と`item.csv`の`name`、運勢名CSVの`comment`を読み込む。`No.`と`category`は抽選に使わない。

```sh
npm run data:generate
npm run data:check
```

dev/build開始前にも生成する。開発中にCSVを編集したら再生成する（CSVの自動監視はない）。ルートのその他のCSVも運勢コメントとして処理するため、無関係なCSVは置かない。

共有コードは`YYYYMMDD-rank-item-uma-scenario-message`。数字は配列の添字。**既存の行の削除・変更・並べ替え・途中挿入を避け、末尾へ追加する。** 生成時に既存JSONとの前方一致を検査し、互換性を壊す更新を拒否する。生成JSONを手で書き換えて検査を回避しない。英語名の修正は可能。

古いコメント番号なしのコードと、現在は抽選しない「吉」も維持する。`F_RANKS`の既存順序も変更しない。訂正で既存候補の意味を変える必要がある場合は、先にデータのバージョン管理と旧コード復元の移行設計を行う。

作品の追加時は注目作品の参照とヒーローの年・仕様表示、統計も確認する。イベントは古い順、頒布実績は売り子参加を含まない固定値。

## 占いの保存

端末のローカル日付で1日1回、育成ウマ娘のみ5回まで再抽選する。同日中は同じ候補を繰り返さない。localStorageキー`lab-fortune:v1`と保存形式を維持する。

日付変更、復帰、別タブの保存変更を反映し、日付をまたいだ未完了抽選は取り消す。ブラウザ保存不可の場合はメモリ内で継続する。複数タブの変更は同期するが、localStorageにはトランザクションがないため、別タブの厳密に同時の書き込みをサーバーのようには排他制御しない。回数制限はアカウント単位の保証ではない。

## 公開設定

Vercel以外では環境変数`SITE_URL=https://公開ドメイン`を設定する。Vercelでは`VERCEL_PROJECT_PRODUCTION_URL`を使用でき、`SITE_URL`が優先される。どちらも未指定なら開発用`http://localhost:3000`を使う。

画面のWebフォントと共有OG画像のフォント取得はGoogle Fontsに依存する。OG画像は有効なコードについて長期キャッシュするため、既存候補を変更しない。ネットワーク障害時のOG生成失敗は監視対象。

## リリース前の手動確認

- PC/スマホで作品を開く、試し読み、矢印・スワイプ、Escape、Tabでの移動と閉じた後のフォーカス復帰。
- 320px〜760pxで再抽選ボタンが「育成ウマ娘」「再抽選」の2行になること。
- 初回抽選、再読み込み、5回再抽選、別タブ同期、午前0時をまたぐ操作。
- 有効な共有URL、不正URL、OG画像、日本語の長いシナリオ名。
- ナビゲーション、問い合わせ先（既存Xアカウント）、公開URLのメタデータ。
