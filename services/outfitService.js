// 高度なコーディネート提案サービス
export class OutfitService {
  static clothingDatabase = {
    casual: {
      cold: {
        tops: [
          "厚手のニット",
          "パーカー",
          "フリース",
          "ダウンベスト",
          "セーター",
        ],
        bottoms: ["ジーンズ", "チノパンツ", "スウェットパンツ", "カーゴパンツ"],
        shoes: ["スニーカー", "ブーツ", "ハイカットスニーカー"],
        accessories: ["ニット帽", "マフラー", "グローブ", "バックパック"],
      },
      warm: {
        tops: [
          "Tシャツ",
          "半袖シャツ",
          "ポロシャツ",
          "タンクトップ",
          "薄手のカーディガン",
        ],
        bottoms: ["ショートパンツ", "薄手のジーンズ", "リネンパンツ"],
        shoes: ["スニーカー", "サンダル", "キャンバスシューズ"],
        accessories: ["キャップ", "サングラス", "トートバッグ", "腕時計"],
      },
      mild: {
        tops: [
          "長袖Tシャツ",
          "薄手のニット",
          "カーディガン",
          "デニムジャケット",
        ],
        bottoms: ["ジーンズ", "チノパンツ", "ストレートパンツ"],
        shoes: ["スニーカー", "ローファー", "デザートブーツ"],
        accessories: ["腕時計", "ショルダーバッグ", "薄手のストール"],
      },
    },
    smart: {
      cold: {
        tops: ["ウールコート", "ジャケット", "カシミアセーター", "ブレザー"],
        bottoms: ["スラックス", "ウールパンツ", "テーラードパンツ"],
        shoes: ["革靴", "ブーツ", "ローファー"],
        accessories: ["レザーバッグ", "ウールマフラー", "革グローブ"],
      },
      warm: {
        tops: ["ドレスシャツ", "ポロシャツ", "リネンシャツ", "薄手のブレザー"],
        bottoms: ["スラックス", "チノパンツ", "リネンパンツ"],
        shoes: ["革靴", "ローファー", "デッキシューズ"],
        accessories: ["レザーバッグ", "腕時計", "サングラス"],
      },
      mild: {
        tops: ["シャツ", "薄手のセーター", "カーディガン", "ジャケット"],
        bottoms: ["スラックス", "チノパンツ", "ストレートパンツ"],
        shoes: ["革靴", "ローファー", "スニーカー"],
        accessories: ["ビジネスバッグ", "腕時計", "ベルト"],
      },
    },
    street: {
      cold: {
        tops: [
          "オーバーサイズパーカー",
          "ボンバージャケット",
          "グラフィックTシャツ（重ね着）",
        ],
        bottoms: ["スキニージーンズ", "カーゴパンツ", "ジョガーパンツ"],
        shoes: ["ハイカットスニーカー", "ストリートブーツ", "エアジョーダン"],
        accessories: ["バケットハット", "チェーンネックレス", "ウエストバッグ"],
      },
      warm: {
        tops: ["グラフィックTシャツ", "バスケットシャツ", "オープンシャツ"],
        bottoms: ["ショートパンツ", "ハーフパンツ", "スキニージーンズ"],
        shoes: ["スニーカー", "ハイカットスニーカー", "サンダル"],
        accessories: ["キャップ", "チェーンネックレス", "ボディバッグ"],
      },
      mild: {
        tops: ["パーカー", "スウェット", "ロンT", "ジップアップ"],
        bottoms: ["スキニージーンズ", "ジョガーパンツ", "カーゴパンツ"],
        shoes: ["スニーカー", "ハイカットスニーカー", "ストリートブーツ"],
        accessories: ["キャップ", "バックパック", "アクセサリー"],
      },
    },
  };

  static colorPalettes = {
    casual: ["ネイビー", "ホワイト", "ベージュ", "グレー", "オリーブ"],
    smart: ["ブラック", "ネイビー", "グレー", "ホワイト", "ブラウン"],
    street: ["ブラック", "ホワイト", "レッド", "イエロー", "グリーン"],
  };

  static async generateOutfit(
    style,
    temperature,
    weather,
    userProfile = {},
    previousOutfits = []
  ) {
    const { gender = "other", age = 25 } = userProfile;
    console.log("Generating outfit:", {
      style,
      temperature,
      weather,
      gender,
      age,
    });

    // 生成中の演出
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // 気温に基づく季節カテゴリー
      let tempCategory;
      if (temperature < 15) tempCategory = "cold";
      else if (temperature > 25) tempCategory = "warm";
      else tempCategory = "mild";

      // スタイルとアイテムデータベース
      const styleData =
        this.clothingDatabase[style] || this.clothingDatabase.casual;
      const tempData = styleData[tempCategory];

      if (!tempData) {
        throw new Error("No data for this style/temperature combination");
      }

      // 年齢層を判定
      const getAgeCategory = (age) => {
        if (age < 20) return "teens";
        else if (age < 30) return "twenties";
        else if (age < 40) return "thirties";
        else return "forties";
      };

      // 性別と年齢に基づいてアイテムを調整
      const adjustItemsForDemographics = (items, category, gender, age) => {
        const ageCategory = getAgeCategory(age);
        let adjustedItems = [...items];

        // 性別による調整
        if (gender === "female") {
          if (category === "bottoms") {
            adjustedItems = adjustedItems.concat(["スカート", "ワンピース"]);
            if (ageCategory === "teens")
              adjustedItems = adjustedItems.concat([
                "ショートスカート",
                "プリーツスカート",
              ]);
            if (ageCategory === "twenties" || ageCategory === "thirties")
              adjustedItems = adjustedItems.concat([
                "Aラインスカート",
                "タイトスカート",
              ]);
          }
          if (category === "shoes") {
            adjustedItems = adjustedItems.concat(["パンプス", "ブーツ"]);
            if (ageCategory === "teens")
              adjustedItems = adjustedItems.concat([
                "可愛いスニーカー",
                "ショートブーツ",
              ]);
          }
          if (category === "accessories") {
            adjustedItems = adjustedItems.concat([
              "ピアス",
              "ネックレス",
              "ハンドバッグ",
            ]);
          }
        } else if (gender === "male") {
          if (
            category === "shoes" &&
            (ageCategory === "thirties" || ageCategory === "forties")
          ) {
            adjustedItems = adjustedItems.concat(["革靴", "ローファー"]);
          }
          if (category === "accessories" && ageCategory === "teens") {
            adjustedItems = adjustedItems.concat(["キャップ", "リュック"]);
          }
        }

        // 年齢による調整
        if (ageCategory === "teens") {
          if (category === "tops")
            adjustedItems = adjustedItems.concat([
              "グラフィックTシャツ",
              "可愛いニット",
            ]);
          if (category === "accessories")
            adjustedItems = adjustedItems.concat(["リュック", "スマホケース"]);
        } else if (ageCategory === "thirties" || ageCategory === "forties") {
          if (category === "tops")
            adjustedItems = adjustedItems.concat(["上品なニット", "シャツ"]);
          if (category === "accessories")
            adjustedItems = adjustedItems.concat(["腕時計", "レザーバッグ"]);
        }

        return adjustedItems;
      };

      // ランダム選択（以前の提案と被らないように）
      const getRandomItem = (items, avoid = []) => {
        const available = items.filter((item) => !avoid.includes(item));
        return available.length > 0
          ? available[Math.floor(Math.random() * available.length)]
          : items[Math.floor(Math.random() * items.length)];
      };

      // 過去の提案からアイテムを抽出して重複を避ける
      const usedItems = previousOutfits.flatMap((outfit) => outfit.items || []);

      // 性別・年齢を考慮したアイテム選択
      const adjustedTops = adjustItemsForDemographics(
        tempData.tops,
        "tops",
        gender,
        age
      );
      const adjustedBottoms = adjustItemsForDemographics(
        tempData.bottoms,
        "bottoms",
        gender,
        age
      );
      const adjustedShoes = adjustItemsForDemographics(
        tempData.shoes,
        "shoes",
        gender,
        age
      );
      const adjustedAccessories = adjustItemsForDemographics(
        tempData.accessories,
        "accessories",
        gender,
        age
      );

      const selectedItems = [
        getRandomItem(adjustedTops, usedItems),
        getRandomItem(adjustedBottoms, usedItems),
        getRandomItem(adjustedShoes, usedItems),
        getRandomItem(adjustedAccessories, usedItems),
      ];

      // 天気に応じたアイテム追加
      if (weather === "雨") {
        selectedItems.push("レインコート", "折りたたみ傘");
      } else if (weather === "曇り" && temperature < 20) {
        selectedItems.push("薄手のジャケット");
      } else if (temperature > 30) {
        selectedItems.push("日焼け止め");
      }

      // 色の選択
      const colors = this.colorPalettes[style] || this.colorPalettes.casual;
      const mainColor = colors[Math.floor(Math.random() * colors.length)];

      // アイテムに色を適用
      const coloredItems = selectedItems.map((item, index) => {
        if (index === 0) {
          // トップスに色を適用
          return `${mainColor}の${item}`;
        }
        return item;
      });

      // スタイル説明の生成
      const styleDescriptions = {
        casual: "リラックスした日常的なスタイルで、動きやすさと快適さを重視",
        smart: "上品で洗練されたスタイルで、きれいめな印象を演出",
        street: "トレンド感のあるストリートスタイルで個性を表現",
        mode: "ファッション性の高いモードスタイルで洗練された印象",
        minimal: "シンプルで無駄のないミニマルスタイル",
        vintage: "レトロでクラシックなヴィンテージスタイル",
      };

      // コーディネート説明の生成
      let description = `${temperature}°C、${weather}の日におすすめの${styleDescriptions[style] || styleDescriptions.casual}です。`;

      if (weather === "雨") {
        description += " 雨の日でも快適に過ごせるよう、防水性を考慮しました。";
      } else if (temperature < 10) {
        description +=
          " 寒い日でも暖かく過ごせるよう、保温性を重視しています。";
      } else if (temperature > 30) {
        description +=
          " 暑い日でも涼しく過ごせるよう、通気性と軽やかさを重視しました。";
      } else {
        description += " 快適に過ごせるバランスの良いコーディネートです。";
      }

      return {
        items: coloredItems,
        description,
        style: style,
        weather: weather,
        temperature: temperature,
        mainColor: mainColor,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Outfit generation error:", error);

      // フォールバック提案
      return {
        items: ["白いTシャツ", "ブルージーンズ", "スニーカー", "腕時計"],
        description:
          "シンプルで清潔感のあるベーシックなカジュアルスタイル。どんなシーンでも使いやすいコーディネートです。",
        style: "casual",
        weather: weather,
        temperature: temperature,
        mainColor: "ホワイト",
        timestamp: new Date().toISOString(),
      };
    }
  }
}
