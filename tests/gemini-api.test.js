// Gemini API のテスト用スクリプト
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// 環境変数を読み込み
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../.env.local") });

import { AIService } from "../services/aiService.js";

// テスト用のモックデータ
const testUserProfile = {
  gender: "female",
  age: 25,
};

const testWeather = {
  temperature: 20,
  weather: "晴れ",
  location: "東京",
};

const testStyle = "casual";

// API KEY の存在確認
function checkAPIKey() {
  console.log("🔍 API KEY チェック中...");
  
  // Node.js環境では直接 process.env をチェック
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  
  console.log("利用可能な環境変数:");
  Object.keys(process.env).filter(key => key.includes('GEMINI')).forEach(key => {
    console.log(`  ${key}: ${process.env[key] ? '設定済み' : '未設定'}`);
  });
  
  if (!apiKey) {
    console.error("❌ Gemini API KEY が設定されていません！");
    console.log("環境変数 EXPO_PUBLIC_GEMINI_API_KEY を確認してください");
    console.log("現在のAIService.API_KEY:", AIService.API_KEY);
    return false;
  }
  
  console.log("✅ API KEY が設定されています");
  console.log(`Key: ${apiKey.substring(0, 10)}...`);
  return true;
}

// シンプルなGemini API接続テスト
async function testBasicConnection() {
  console.log("\n📡 基本的な API 接続テスト中...");
  
  try {
    const model = AIService.model;
    
    // シンプルなプロンプトでテスト
    const result = await model.generateContent("こんにちは、今日の天気はどうですか？");
    const response = await result.response;
    const text = response.text();
    
    console.log("✅ API 接続成功！");
    console.log("📝 応答例:", text.substring(0, 100) + "...");
    return true;
  } catch (error) {
    console.error("❌ API 接続失敗:", error.message);
    return false;
  }
}

// コーディネート提案のフルテスト
async function testOutfitSuggestion() {
  console.log("\n👔 コーディネート提案テスト中...");
  
  try {
    const startTime = Date.now();
    
    const suggestion = await AIService.generateOutfitSuggestion(
      testUserProfile,
      testWeather,
      testStyle
    );
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`✅ コーディネート提案成功！ (${duration}ms)`);
    console.log("📋 提案内容:");
    console.log("  - アイテム数:", suggestion.items?.length || 0);
    console.log("  - 説明:", suggestion.description?.substring(0, 50) + "...");
    console.log("  - スタイルポイント:", suggestion.stylePoint?.substring(0, 50) + "...");
    console.log("  - 天気ノート:", suggestion.weatherNote?.substring(0, 50) + "...");
    console.log("  - 画像URL:", suggestion.imageUrl ? "✅ あり" : "❌ なし");
    console.log("  - ソース:", suggestion.source);
    
    // 詳細なアイテム表示
    if (suggestion.items && suggestion.items.length > 0) {
      console.log("\n🎯 提案アイテム:");
      suggestion.items.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item}`);
      });
    }
    
    return true;
  } catch (error) {
    console.error("❌ コーディネート提案失敗:", error.message);
    console.error("エラー詳細:", error);
    return false;
  }
}

// フォールバック機能のテスト
async function testFallback() {
  console.log("\n🔄 フォールバック機能テスト中...");
  
  try {
    const fallbackSuggestion = AIService.getFallbackSuggestion(
      testUserProfile,
      testWeather,
      testStyle
    );
    
    console.log("✅ フォールバック提案成功！");
    console.log("📋 フォールバック内容:");
    console.log("  - アイテム数:", fallbackSuggestion.items?.length || 0);
    console.log("  - 説明:", fallbackSuggestion.description);
    console.log("  - ソース:", fallbackSuggestion.source);
    
    return true;
  } catch (error) {
    console.error("❌ フォールバック機能失敗:", error.message);
    return false;
  }
}

// メインテスト実行
async function runAllTests() {
  console.log("🧪 Gemini API テスト開始\n");
  console.log("=".repeat(50));
  
  const results = {
    apiKey: false,
    basicConnection: false,
    outfitSuggestion: false,
    fallback: false,
  };
  
  // 1. API KEY チェック
  results.apiKey = checkAPIKey();
  
  if (!results.apiKey) {
    console.log("\n❌ API KEY が設定されていないため、テストを中止します");
    return;
  }
  
  // 2. 基本接続テスト
  results.basicConnection = await testBasicConnection();
  
  // 3. コーディネート提案テスト
  results.outfitSuggestion = await testOutfitSuggestion();
  
  // 4. フォールバックテスト
  results.fallback = await testFallback();
  
  // 結果サマリー
  console.log("\n" + "=".repeat(50));
  console.log("📊 テスト結果サマリー:");
  console.log(`  API KEY設定: ${results.apiKey ? "✅" : "❌"}`);
  console.log(`  基本接続: ${results.basicConnection ? "✅" : "❌"}`);
  console.log(`  コーディネート提案: ${results.outfitSuggestion ? "✅" : "❌"}`);
  console.log(`  フォールバック機能: ${results.fallback ? "✅" : "❌"}`);
  
  const successCount = Object.values(results).filter(Boolean).length;
  const totalCount = Object.keys(results).length;
  
  console.log(`\n🎯 成功率: ${successCount}/${totalCount} (${Math.round(successCount/totalCount*100)}%)`);
  
  if (successCount === totalCount) {
    console.log("🎉 全てのテストが成功しました！");
  } else {
    console.log("⚠️  一部のテストが失敗しています。上記のエラーを確認してください。");
  }
}

// Node.js環境での実行
if (typeof window === "undefined") {
  runAllTests().catch(console.error);
}

export { runAllTests, testBasicConnection, testOutfitSuggestion };