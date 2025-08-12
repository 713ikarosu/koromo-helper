# 🎨 Koromo Helper（コロモヘルパー）

**AI ファッションコーディネート提案アプリ**

Koromo Helper は、天気情報とユーザーの好みに基づいてパーソナライズされたコーディネート提案を行う、Expo で構築された React Native アプリです。あなたのスタイル、性別、年齢、そして地域の天気に合わせた AI ファッションアドバイスを提供します。

## ✨ 主な機能

- 🤖 **AI パワード提案**: Google の Gemini AI を使用したパーソナライズされたコーディネート提案
- 🌤️ **天気連携**: 現在の天気に基づいたコーディネート提案
- 👔 **スタイル設定**: 複数のファッションスタイルに対応（カジュアル、きれいめ、ストリート、モード、ミニマル、ヴィンテージ）
- 🎯 **ユーザープロファイル**: 性別、年齢、スタイル設定に基づくパーソナライズ提案
- 📱 **クロスプラットフォーム**: iOS、Android、Web で動作
- 🇯🇵 **日本語インターフェース**: 完全日本語対応のユーザーインターフェース

## 🚀 クイックスタート

### 前提条件

- Node.js 18+
- npm または yarn
- Expo CLI (`npm install -g @expo/cli`)

### インストール

1. **リポジトリをクローン**

   ```bash
   git clone https://github.com/your-username/koromo-helper.git
   cd koromo-helper
   ```

2. **依存関係をインストール**

   ```bash
   npm install
   ```

3. **開発サーバーを起動**

   ```bash
   npm start
   # または
   npx expo start
   ```

4. **お好みのプラットフォームで実行**

   ```bash
   # iOS シミュレーター
   npm run ios

   # Android エミュレーター
   npm run android

   # Web ブラウザ
   npm run web
   ```

## 🛠️ 開発

### 利用可能なスクリプト

| コマンド                | 説明                                 |
| ----------------------- | ------------------------------------ |
| `npm start`             | Expo 開発サーバーを起動             |
| `npm run ios`           | iOS シミュレーターで実行             |
| `npm run android`       | Android エミュレーターで実行         |
| `npm run web`           | Web ブラウザで実行                   |
| `npm run lint`          | ESLint でコード品質チェック          |
| `npm run type-check`    | TypeScript 型チェック               |
| `npm run format`        | Prettier でコードフォーマット        |
| `npm run format:check`  | コードフォーマットチェック           |
| `npm run reset-project` | プロジェクトを初期状態にリセット     |

### コード品質

変更をコミットする前に、以下を実行してコード品質を確保してください：

```bash
# 型チェック
npm run type-check

# コードフォーマットチェック
npm run format:check

# リンティング
npm run lint

# コード自動フォーマット（必要に応じて）
npm run format
```

### 開発時の推奨フロー

1. 適切な TypeScript 型定義を含む変更を実装
2. 品質チェックを実行: `npm run type-check && npm run lint && npm run format:check`
3. 複数プラットフォーム（iOS/Android/Web）でテスト

## 🏗️ プロジェクト構造

```
koromo-helper/
├── app/                    # アプリ画面（ファイルベースルーティング）
│   ├── _layout.tsx        # ルートナビゲーションレイアウト
│   ├── index.tsx          # ウェルカム/ランディング画面
│   ├── login.tsx          # ログイン画面
│   ├── register.tsx       # ユーザー登録画面
│   ├── preferences.tsx    # ユーザー設定画面
│   └── home.tsx           # メインダッシュボード
├── components/            # 再利用可能UIコンポーネント
│   ├── ThemedText.tsx     # テーマ対応テキストコンポーネント
│   ├── ThemedView.tsx     # テーマ対応ビューコンポーネント
│   └── Collapsible.tsx    # 折りたたみコンポーネント
├── constants/             # アプリ定数
│   └── Colors.ts          # カラースキーム定義
├── hooks/                 # カスタムReactフック
│   ├── useColorScheme.ts  # テーマ検出フック
│   └── useThemeColor.ts   # テーマカラーフック
├── services/              # ビジネスロジック & API サービス
│   ├── aiService.js       # AI/Gemini 連携
│   ├── weatherService.js  # 天気API連携
│   ├── storageService.js  # AsyncStorage ラッパー
│   └── outfitService.js   # コーディネート提案ロジック
└── assets/               # 静的アセット（画像、フォント）
```

## 🎨 技術スタック

### コアフレームワーク

- **[Expo](https://expo.dev/)** v52 - React Native 開発プラットフォーム
- **[React Native](https://reactnative.dev/)** v0.79 - モバイルアプリフレームワーク
- **[TypeScript](https://www.typescriptlang.org/)** - 型安全性

### UI & スタイリング

- **[Tamagui](https://tamagui.dev/)** - ユニバーサル UI システム
- **カスタムコンポーネント** - クロスプラットフォーム Web/Native コンポーネント

### 状態管理

- **[Jotai](https://jotai.org/)** - プリミティブで柔軟な状態管理
- **[AsyncStorage](https://react-native-async-storage.github.io/)** - ローカルデータ永続化

### ナビゲーション

- **[Expo Router](https://docs.expo.dev/router/introduction/)** - ファイルベースルーティング

### AI & API

- **[Google Gemini AI](https://ai.google.dev/)** - コーディネート提案エンジン
- **Weather API** - リアルタイム天気データ

### 開発ツール

- **[ESLint](https://eslint.org/)** - コードリンティング
- **[Prettier](https://prettier.io/)** - コードフォーマット
- **[Playwright](https://playwright.dev/)** - E2E テスト

## 🌐 プラットフォーム対応

| プラットフォーム | ステータス      | 注記                 |
| ---------------- | --------------- | -------------------- |
| **iOS**          | ✅ 完全対応     | iOS 13+              |
| **Android**      | ✅ 完全対応     | Android 6+ (API 23+) |
| **Web**          | ✅ 完全対応     | モダンブラウザ       |

## 🔧 設定

### 環境設定

環境変数用の `.env.local` ファイルを作成してください：

```env
# Google Gemini AI API キー
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# 天気 API キー（外部サービス使用時）
EXPO_PUBLIC_WEATHER_API_KEY=your_weather_api_key_here
```

### Tamagui 設定

アプリはユニバーサルスタイリングに Tamagui を使用しています。設定ファイル：

- `tamagui.config.ts` - メイン Tamagui 設定
- `tamagui-web.css` - Web 専用スタイル

---

Expo と React Native を使用して構築されました
この README はclaude code で生成されました
