// 画像サービスのテスト
import { ImageService } from "../services/imageService";

console.log("🖼️ ImageService テスト開始");

try {
  // 基本的な画像URL取得テスト
  const testCases = [
    { style: "casual" as const, gender: "male" as const, temperature: 10 },
    { style: "casual" as const, gender: "female" as const, temperature: 20 },
    { style: "smart" as const, gender: "male" as const, temperature: 25 },
    { style: "street" as const, gender: "female" as const, temperature: 30 },
    { style: "mode" as const, gender: "male" as const, temperature: 15 },
    { style: "minimal" as const, gender: "female" as const, temperature: 18 },
    { style: "vintage" as const, gender: "male" as const, temperature: 22 },
  ];

  console.log("\n📸 各スタイルの画像URL取得テスト:");
  testCases.forEach((testCase, index) => {
    try {
      const imageUrl = ImageService.getOutfitImage(
        testCase.style,
        testCase.gender,
        testCase.temperature
      );
      
      console.log(`${index + 1}. ${testCase.style} (${testCase.gender}, ${testCase.temperature}°C)`);
      console.log(`   URL: ${imageUrl}`);
      console.log(`   ✅ 正常取得`);
    } catch (error: any) {
      console.log(`${index + 1}. ${testCase.style} (${testCase.gender}, ${testCase.temperature}°C)`);
      console.log(`   ❌ エラー: ${error.message}`);
    }
    console.log("");
  });

  // 不正なパラメータのテスト
  console.log("🧪 エラーハンドリングテスト:");
  try {
    const fallbackUrl = ImageService.getOutfitImage("invalid-style" as any, "invalid-gender" as any, -100);
    console.log(`   フォールバック URL: ${fallbackUrl}`);
    console.log(`   ✅ フォールバック正常動作`);
  } catch (error: any) {
    console.log(`   ❌ フォールバックエラー: ${error.message}`);
  }

  console.log("\n✅ ImageService テスト完了");
  
} catch (error: any) {
  console.error("❌ テスト実行エラー:", error);
}