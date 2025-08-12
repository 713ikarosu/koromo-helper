// Gemini APIを使用したAIコーディネート提案サービス
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ImageService } from "./imageService.js";

export class AIService {
  static getAPIKey() {
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
    userProfile,
    weather,
    style,
    previousOutfits = []
  ) {
    try {
      const { gender, age } = userProfile;
      const { temperature, weather: weatherCondition, location } = weather;

      // 過去の提案を避けるための情報
      const previousItems = previousOutfits
        .slice(0, 5) // 最新5件の履歴を考慮
        .flatMap((outfit) => outfit.items || [])
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

      let aiSuggestion;
      try {
        aiSuggestion = JSON.parse(cleanedText);
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
      if (error.message && error.message.includes('API key')) {
        const apiKey = this.getAPIKey();
        console.error("⚠️ Gemini API KEY に問題があります:");
        console.error("- 現在のKEY:", apiKey ? apiKey.substring(0, 10) + "..." : "未設定");
        console.error("- 新しいKEYを取得してください: https://makersuite.google.com/app/apikey");
      }

      // フォールバック: エラー時はベーシックな提案を返す
      return this.getFallbackSuggestion(userProfile, weather, style);
    }
  }

  static getFallbackSuggestion(userProfile, weather, style) {
    const { temperature, weather: weatherCondition } = weather;
    const { gender, age } = userProfile;

    // より詳細なフォールバック提案
    let items = [];
    let description = "";

    if (temperature < 15) {
      // 寒い日の提案
      if (gender === "female") {
        items = [
          "グレーの長袖ウールニット（ラウンドネック、リブ編み）",
          "黒のストレッチスキニーパンツ（テーパードシルエット）",
          "茶色のロングブーツ（本革、ヒール3cm）",
          "ベージュのカシミア混マフラー（フリンジ付き）",
          "ネイビーのウールコート（ダブルボタン、ミディ丈）",
        ];
      } else {
        items = [
          "ネイビーの長袖ウールセーター（クルーネック、ケーブル編み）",
          "ベージュのコットンチノパンツ（ストレート、テーパード）",
          "黒の本革ブーツ（レースアップ、厚底）",
          "グレーのウール混マフラー（無地、フリンジなし）",
          "黒のウールジャケット（シングルボタン、テーラード）",
        ];
      }
      description = "寒い日に暖かく過ごせる上品なコーディネートです。";
    } else if (temperature > 25) {
      // 暑い日の提案
      if (gender === "female") {
        items = [
          "白の半袖リネンブラウス（Vネック、フロントボタン）",
          "ベージュのフレアスカート（膝丈、コットン混）",
          "ゴールドのストラップサンダル（ヒール5cm、本革）",
          "麦わら帽子（つば広、リボン付き）",
        ];
      } else {
        items = [
          "ライトブルーの半袖コットンTシャツ（クルーネック、無地）",
          "ネイビーのコットンハーフパンツ（膝上丈、ポケット付き）",
          "白のキャンバススニーカー（ローカット、レースアップ）",
          "ネイビーのコットンキャップ（調整可能ベルト付き）",
        ];
      }
      description = "暑い日に涼しく過ごせる軽やかなコーディネートです。";
    } else {
      // 中間の気温
      if (gender === "female") {
        items = [
          "ピンクの長袖コットンカーディガン（ボタンアップ、リブ襟）",
          "黒のストレッチパンツ（スリム、アンクル丈）",
          "白のレザースニーカー（ローカット、サイドジップ）",
          "ブラウンの合皮ハンドバッグ（ショルダーストラップ付き）",
        ];
      } else {
        items = [
          "白の長袖コットンシャツ（ボタンダウン襟、チェック柄）",
          "インディゴのストレッチデニム（スリムストレート）",
          "ブラウンの本革スニーカー（ローカット、レースアップ）",
          "シルバーのステンレス腕時計（メッシュベルト、アナログ）",
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
