// API KEYの詳細検証テスト
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// 環境変数を読み込み
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../.env.local") });

async function validateApiKey(): Promise<void> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  
  console.log("🔍 API KEY 詳細検証");
  console.log("================================");
  
  if (!apiKey) {
    console.log("❌ API KEY が設定されていません");
    return;
  }
  
  // 基本情報
  console.log("🔑 API KEY 情報:");
  console.log(`- 長さ: ${apiKey.length} 文字`);
  console.log(`- 開始: ${apiKey.substring(0, 10)}`);
  console.log(`- 終了: ...${apiKey.substring(apiKey.length - 10)}`);
  console.log(`- 形式: ${apiKey.startsWith('AIza') ? '✅ 正しいGemini形式' : '❌ 不正な形式'}`);
  
  // 特殊文字チェック
  const hasSpecialChars = /[^a-zA-Z0-9_-]/.test(apiKey);
  console.log(`- 特殊文字: ${hasSpecialChars ? '❌ 含まれている' : '✅ なし'}`);
  
  // 空白文字チェック
  const hasWhitespace = /\s/.test(apiKey);
  console.log(`- 空白文字: ${hasWhitespace ? '❌ 含まれている' : '✅ なし'}`);
  
  console.log("\n📡 直接API呼び出しテスト:");
  
  try {
    // 1. 最も基本的なテストAPI呼び出し
    const testUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(testUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: "Hello"
              }
            ]
          }
        ]
      })
    });
    
    console.log(`- HTTPステータス: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log("❌ エラー詳細:");
      console.log(errorText);
      
      try {
        const errorJson = JSON.parse(errorText);
        console.log("📄 パースされたエラー:", JSON.stringify(errorJson, null, 2));
      } catch (parseError) {
        console.log("エラーのJSONパースに失敗");
      }
    } else {
      const responseText = await response.text();
      console.log("✅ API呼び出し成功!");
      console.log("📝 応答の一部:", responseText.substring(0, 200) + "...");
    }
    
  } catch (error) {
    console.error("❌ ネットワークエラー:", (error as Error).message);
  }
  
  console.log("\n🌐 Google AI Studio リンク:");
  console.log("https://makersuite.google.com/app/apikey");
  console.log("\n💡 よくある問題:");
  console.log("1. API KEYが無効・期限切れ");
  console.log("2. API KEYに制限がかかっている");
  console.log("3. Google AI Studioでの請求設定未完了");
  console.log("4. APIクォータ上限に達している");
}

validateApiKey().catch(console.error);