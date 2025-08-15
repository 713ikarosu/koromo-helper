// Google GenerativeAI SDK デバッグテスト
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 環境変数を読み込み
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../.env.local") });

async function debugSDK(): Promise<void> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  
  console.log("🔧 Google GenerativeAI SDK デバッグ");
  console.log("========================================");
  
  console.log("🔑 API KEY状況:");
  console.log(`- 値: ${apiKey ? apiKey.substring(0, 10) + "..." : "未設定"}`);
  console.log(`- 長さ: ${apiKey ? apiKey.length : 0}`);
  
  if (!apiKey) {
    console.log("❌ API KEY が設定されていません");
    return;
  }
  
  try {
    // 1. SDK初期化テスト
    console.log("\n1️⃣ SDK初期化テスト:");
    const genAI = new GoogleGenerativeAI(apiKey);
    console.log("✅ GoogleGenerativeAI インスタンス作成成功");
    
    // 2. モデル取得テスト
    console.log("\n2️⃣ モデル取得テスト:");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("✅ モデル取得成功");
    
    // 3. 最小限のコンテンツ生成テスト
    console.log("\n3️⃣ 最小限のコンテンツ生成テスト:");
    const result = await model.generateContent("こんにちは");
    console.log("✅ generateContent メソッド呼び出し成功");
    
    const response = await result.response;
    console.log("✅ レスポンス取得成功");
    
    const text = response.text();
    console.log("✅ テキスト抽出成功");
    console.log(`📝 応答: ${text.substring(0, 100)}...`);
    
    // 4. AIServiceと同じ条件でのテスト
    console.log("\n4️⃣ AIServiceと同じ条件でのテスト:");
    
    const complexPrompt = `
あなたは日本のファッションコーディネートの専門家です。以下の条件に基づいて、非常に具体的で詳細なコーディネート提案をしてください。

【ユーザー情報】
- 性別: 女性
- 年齢: 25歳
- 好みのスタイル: casual

【天気・環境情報】
- 現在地: 東京
- 気温: 20°C
- 天気: 晴れ

【出力形式】
以下のJSON形式で回答してください：
{
  "items": ["トップス", "ボトムス", "シューズ"],
  "description": "コーディネートの説明",
  "stylePoint": "スタイリングのポイント",
  "weatherNote": "天気に対する配慮"
}

注意：JSONのみを返してください。他の文章は含めないでください。
    `;
    
    const complexResult = await model.generateContent(complexPrompt);
    const complexResponse = await complexResult.response;
    const complexText = complexResponse.text();
    
    console.log("✅ 複雑なプロンプトでの生成成功");
    console.log(`📝 複雑な応答: ${complexText.substring(0, 200)}...`);
    
    // JSON解析テスト
    try {
      let cleanedText = complexText.trim();
      
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText
          .replace(/```json\s*/, "")
          .replace(/```\s*$/, "");
      } else if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.replace(/```\s*/, "").replace(/```\s*$/, "");
      }
      
      const parsed = JSON.parse(cleanedText);
      console.log("✅ JSON解析成功");
      console.log("📦 解析結果:", JSON.stringify(parsed, null, 2));
      
    } catch (parseError) {
      console.log("⚠️ JSON解析失敗:", (parseError as Error).message);
      console.log("Raw text:", complexText);
    }
    
  } catch (error) {
    console.error("❌ SDK テストエラー:", error);
    const err = error as any;
    console.error("エラー詳細:", {
      name: err.name,
      message: err.message,
      status: err.status,
      statusText: err.statusText,
      errorDetails: err.errorDetails
    });
  }
}

debugSDK().catch(console.error);