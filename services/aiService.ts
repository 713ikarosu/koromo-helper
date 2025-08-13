// Gemini APIを使用したAIコーディネート提案サービス
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ImageService } from "./imageService";

// 型定義
export interface UserProfile {
  gender: "male" | "female" | "other";
  age: number;
}

export interface WeatherData {
  temperature: number;
  weather: string;
  location: string;
  humidity?: number;
  windSpeed?: number;
  isDefault?: boolean;
}

export interface OutfitItem {
  category: string;
  name: string;
  color: string;
  material: string;
  details: string[];
}

export interface Outfit {
  items: OutfitItem[];
  description: string;
  stylePoint: string;
  weatherNote: string;
  style: string;
  weather: string;
  temperature: number;
  imageUrl: string;
  source: "AI" | "Fallback";
  timestamp: string;
}

interface AISuggestionResponse {
  items: OutfitItem[];
  description?: string;
  stylePoint?: string;
  weatherNote?: string;
}

export class AIService {
  static getAPIKey(): string | undefined {
    return process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  }

  static getModel() {
    const apiKey = this.getAPIKey();
    if (!apiKey) {
      throw new Error("Gemini API KEY が設定されていません");
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  static async generateOutfitSuggestion(
    userProfile: UserProfile,
    weather: WeatherData,
    style: string,
    previousOutfits: Outfit[] = []
  ): Promise<Outfit> {
    try {
      const { gender, age } = userProfile;
      const { temperature, weather: weatherCondition, location } = weather;

      // 過去の提案を避けるための情報
      const previousItems = previousOutfits
        .slice(0, 5) // 最新5件の履歴を考慮
        .flatMap((outfit) => outfit.items || [])
        .map(item => `${item.name} (${item.color})`)
        .join(", ");

      const prompt = `
あなたは日本のファッションコーディネートの専門家です。以下の条件に基づいて、非常に具体的で詳細なコーディネート提案をしてください。

【ユーザー情報】
- 性別: ${gender === "male" ? "男性" : gender === "female" ? "女性" : "その他"}
- 年齢: ${age}歳
- 好みのスタイル: ${style}

【天気・環境情報】
- 現在地: ${location}
- 気温: ${temperature}°C
- 天気: ${weatherCondition}

【過去の提案（重複を避けてください）】
${previousItems || "なし"}

【重要な要求事項】
1. アイテムは非常に具体的に記述してください（袖丈、形状、素材、色、デザイン詳細を含む）
2. 指定されたスタイル（${style}）に合った服装を提案してください
3. 天気と気温に適した服装にしてください
4. 年齢と性別に適したアイテムを選んでください
5. 過去の提案と重複しないよう、新しい組み合わせを提案してください
6. 日本で一般的に入手可能なアイテムを選んでください

【アイテム記述の具体例】
❌ 悪い例: "ブラウス", "Tシャツ", "パンツ"
✅ 良い例: "白の長袖コットンブラウス（胸元にフリル付き）", "グレーの半袖Vネックカットソー（リブ素材）", "ネイビーのストレートテーパードパンツ（ウール混紡）"

【出力形式】
以下のJSON形式で回答してください。各アイテムは構造化されたオブジェクトで記述してください：
{
  "items": [
    {
      "category": "トップス",
      "name": "オックスフォードシャツ",
      "color": "ライトブルー",
      "material": "綿100%",
      "details": ["ボタンダウンカラー", "レギュラーフィット", "胸ポケット付き", "袖丈は肘上5cm"]
    },
    {
      "category": "ボトムス", 
      "name": "チノパンツ",
      "color": "ベージュ",
      "material": "コットン混紡",
      "details": ["ストレートシルエット", "アンクル丈", "サイドポケット付き"]
    },
    {
      "category": "シューズ",
      "name": "ローファー",
      "color": "ブラウン",
      "material": "本革",
      "details": ["タッセル付き", "ヒールなし", "クッション性インソール"]
    }
  ],
  "description": "コーディネートの詳細説明（150文字以内）",
  "stylePoint": "スタイリングのポイント（100文字以内）",
  "weatherNote": "天気に対する配慮（80文字以内）"
}

注意：JSONのみを返してください。他の文章は含めないでください。アイテム名は必ず具体的に記述してください。
      `;

      const model = this.getModel();
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // JSONの抽出とパース
      let cleanedText = text.trim();

      // ```json ブロックがある場合は削除
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText
          .replace(/```json\s*/, "")
          .replace(/```\s*$/, "");
      } else if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.replace(/```\s*/, "").replace(/```\s*$/, "");
      }

      let aiSuggestion: AISuggestionResponse;
      try {
        aiSuggestion = JSON.parse(cleanedText) as AISuggestionResponse;
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.error("Raw text:", text);
        throw new Error("AI応答のパースに失敗しました");
      }

      // 応答の検証
      if (!aiSuggestion.items || !Array.isArray(aiSuggestion.items)) {
        throw new Error("無効なAI応答形式");
      }

      // 過去の画像URLを抽出（重複回避用）
      const previousImageUrls = previousOutfits
        .slice(0, 3) // 最新3件の画像を考慮
        .map((outfit) => outfit.imageUrl)
        .filter(Boolean);

      // 適切な画像を選択
      const imageUrl = ImageService.getOutfitImage(
        style,
        userProfile.gender,
        temperature,
        previousImageUrls
      );

      // 結果の整形
      return {
        items: aiSuggestion.items,
        description:
          aiSuggestion.description || "AIが提案したコーディネートです。",
        stylePoint: aiSuggestion.stylePoint || "",
        weatherNote: aiSuggestion.weatherNote || "",
        style: style,
        weather: weatherCondition,
        temperature: temperature,
        imageUrl: imageUrl,
        source: "AI",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("AI Service error:", error);
      
      // API KEY関連のエラーの場合は詳細ログ
      if (error instanceof Error && error.message && error.message.includes('API key')) {
        const apiKey = this.getAPIKey();
        console.error("⚠️ Gemini API KEY に問題があります:");
        console.error("- 現在のKEY:", apiKey ? apiKey.substring(0, 10) + "..." : "未設定");
        console.error("- 新しいKEYを取得してください: https://makersuite.google.com/app/apikey");
      }

      // フォールバック: エラー時はベーシックな提案を返す
      return this.getFallbackSuggestion(userProfile, weather, style);
    }
  }

  static getFallbackSuggestion(userProfile: UserProfile, weather: WeatherData, style: string): Outfit {
    const { temperature, weather: weatherCondition } = weather;
    const { gender } = userProfile;

    // より詳細なフォールバック提案
    let items: OutfitItem[] = [];
    let description = "";

    if (temperature < 15) {
      // 寒い日の提案
      if (gender === "female") {
        items = [
          {
            category: "トップス",
            name: "長袖ウールニット",
            color: "グレー",
            material: "ウール100%",
            details: ["ラウンドネック", "リブ編み", "レギュラーフィット"]
          },
          {
            category: "ボトムス",
            name: "ストレッチスキニーパンツ",
            color: "黒",
            material: "ポリエステル混紡",
            details: ["テーパードシルエット", "ストレッチ素材", "アンクル丈"]
          },
          {
            category: "シューズ",
            name: "ロングブーツ",
            color: "茶色",
            material: "本革",
            details: ["ヒール3cm", "サイドジップ", "ふくらはぎ丈"]
          },
          {
            category: "アクセサリー",
            name: "カシミア混マフラー",
            color: "ベージュ",
            material: "カシミア混",
            details: ["フリンジ付き", "120cm", "無地"]
          }
        ];
      } else {
        items = [
          {
            category: "トップス",
            name: "長袖ウールセーター",
            color: "ネイビー",
            material: "ウール100%",
            details: ["クルーネック", "ケーブル編み", "レギュラーフィット"]
          },
          {
            category: "ボトムス",
            name: "コットンチノパンツ",
            color: "ベージュ",
            material: "コットン混紡",
            details: ["ストレート", "テーパード", "サイドポケット付き"]
          },
          {
            category: "シューズ",
            name: "本革ブーツ",
            color: "黒",
            material: "本革",
            details: ["レースアップ", "厚底", "ワークブーツタイプ"]
          },
          {
            category: "アクセサリー",
            name: "ウール混マフラー",
            color: "グレー",
            material: "ウール混",
            details: ["無地", "フリンジなし", "110cm"]
          }
        ];
      }
      description = "寒い日に暖かく過ごせる上品なコーディネートです。";
    } else if (temperature > 25) {
      // 暑い日の提案
      if (gender === "female") {
        items = [
          {
            category: "トップス",
            name: "半袖リネンブラウス",
            color: "白",
            material: "リネン100%",
            details: ["Vネック", "フロントボタン", "袖丈は肘上"]
          },
          {
            category: "ボトムス",
            name: "フレアスカート",
            color: "ベージュ",
            material: "コットン混",
            details: ["膝丈", "ハイウエスト", "Aライン"]
          },
          {
            category: "シューズ",
            name: "ストラップサンダル",
            color: "ゴールド",
            material: "本革",
            details: ["ヒール5cm", "アンクルストラップ", "オープントゥ"]
          },
          {
            category: "アクセサリー",
            name: "麦わら帽子",
            color: "ベージュ",
            material: "ストロー",
            details: ["つば広", "リボン付き", "UVカット"]
          }
        ];
      } else {
        items = [
          {
            category: "トップス",
            name: "半袖コットンTシャツ",
            color: "ライトブルー",
            material: "コットン100%",
            details: ["クルーネック", "無地", "レギュラーフィット"]
          },
          {
            category: "ボトムス",
            name: "コットンハーフパンツ",
            color: "ネイビー",
            material: "コットン100%",
            details: ["膝上丈", "ポケット付き", "ドローストリング"]
          },
          {
            category: "シューズ",
            name: "キャンバススニーカー",
            color: "白",
            material: "キャンバス",
            details: ["ローカット", "レースアップ", "ラバーソール"]
          },
          {
            category: "アクセサリー",
            name: "コットンキャップ",
            color: "ネイビー",
            material: "コットン",
            details: ["調整可能ベルト付き", "つば付き", "ベンチレーション"]
          }
        ];
      }
      description = "暑い日に涼しく過ごせる軽やかなコーディネートです。";
    } else {
      // 中間の気温
      if (gender === "female") {
        items = [
          {
            category: "トップス",
            name: "長袖コットンカーディガン",
            color: "ピンク",
            material: "コットン100%",
            details: ["ボタンアップ", "リブ襟", "ポケット付き"]
          },
          {
            category: "ボトムス",
            name: "ストレッチパンツ",
            color: "黒",
            material: "ポリエステル混",
            details: ["スリム", "アンクル丈", "ストレッチ素材"]
          },
          {
            category: "シューズ",
            name: "レザースニーカー",
            color: "白",
            material: "レザー",
            details: ["ローカット", "サイドジップ", "クッション性"]
          },
          {
            category: "アクセサリー",
            name: "合皮ハンドバッグ",
            color: "ブラウン",
            material: "合成皮革",
            details: ["ショルダーストラップ付き", "内ポケット", "中型サイズ"]
          }
        ];
      } else {
        items = [
          {
            category: "トップス",
            name: "長袖コットンシャツ",
            color: "白",
            material: "コットン100%",
            details: ["ボタンダウン襟", "チェック柄", "レギュラーフィット"]
          },
          {
            category: "ボトムス",
            name: "ストレッチデニム",
            color: "インディゴ",
            material: "コットン混",
            details: ["スリムストレート", "5ポケット", "ストレッチ"]
          },
          {
            category: "シューズ",
            name: "本革スニーカー",
            color: "ブラウン",
            material: "本革",
            details: ["ローカット", "レースアップ", "ラバーソール"]
          },
          {
            category: "アクセサリー",
            name: "ステンレス腕時計",
            color: "シルバー",
            material: "ステンレススチール",
            details: ["メッシュベルト", "アナログ", "防水機能"]
          }
        ];
      }
      description = "過ごしやすい気温に適したベーシックなコーディネートです。";
    }

    // フォールバック用の画像も選択
    const imageUrl = ImageService.getOutfitImage(
      style,
      userProfile.gender,
      temperature
    );

    return {
      items,
      description,
      stylePoint: `${style}スタイルに適した組み合わせです。`,
      weatherNote: `${temperature}°C、${weatherCondition}の日におすすめです。`,
      style,
      weather: weatherCondition,
      temperature,
      imageUrl: imageUrl,
      source: "Fallback",
      timestamp: new Date().toISOString(),
    };
  }
}