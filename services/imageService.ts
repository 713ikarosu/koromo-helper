// 画像マッピングサービス - Unsplash画像を使用

// 画像データベースの型定義
type TemperatureCategory = "cold" | "mild" | "warm";
type Gender = "male" | "female" | "other";
type StyleType = "casual" | "smart" | "street" | "mode" | "minimal" | "vintage";

interface ImageInfo {
  url: string;
  description?: string;
  dominantColors?: string[];
  features?: string[];
}

interface ImageDatabase {
  [style: string]: {
    [gender: string]: {
      [tempCategory: string]: (string | ImageInfo)[];
    };
  };
}

interface DefaultImages {
  male: string;
  female: string;
  other: string;
}

export class ImageService {
  // Unsplashから厳選したファッション全身画像URL（高品質、商用利用可）
  private static readonly imageDatabase: ImageDatabase = {
    casual: {
      male: {
        cold: [
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=400&h=600&fit=crop&crop=center",
        ],
        mild: [
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=400&h=600&fit=crop&crop=center",
        ],
        warm: [
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1603252109303-2751441b4157?w=400&h=600&fit=crop&crop=center",
        ],
      },
      female: {
        cold: [
          "https://images.unsplash.com/photo-1594736797933-d0eced5dbd55?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&h=600&fit=crop&crop=center",
        ],
        mild: [
          "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=600&fit=crop&crop=center",
        ],
        warm: [
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop&crop=center",
        ],
      },
    },
    smart: {
      male: {
        cold: [
          "https://images.unsplash.com/photo-1507119212780-2b33727d2ad5?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&h=600&fit=crop&crop=center",
        ],
        mild: [
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1559563458-527698bf5295?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1537511446984-935f663eb1f4?w=400&h=600&fit=crop&crop=center",
        ],
        warm: [
          "https://images.unsplash.com/photo-1541271696563-3be2f555fc4e?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=600&fit=crop&crop=center",
        ],
      },
      female: {
        cold: [
          "https://images.unsplash.com/photo-1594736797933-d0eced5dbd55?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=400&h=600&fit=crop&crop=center",
        ],
        mild: [
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1593476087123-36d1de271f08?w=400&h=600&fit=crop&crop=center",
        ],
        warm: [
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=600&fit=crop&crop=center",
        ],
      },
    },
    street: {
      male: {
        cold: [
          "https://images.unsplash.com/photo-1574180045827-681f8a1a9622?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1604830664190-d7e6137ba6bc?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=600&fit=crop&crop=center",
        ],
        mild: [
          "https://images.unsplash.com/photo-1548142813-c348350df52b?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=400&h=600&fit=crop&crop=center",
        ],
        warm: [
          "https://images.unsplash.com/photo-1567013127542-490d757e51cd?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1603252109303-2751441b4157?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=center",
        ],
      },
      female: {
        cold: [
          "https://images.unsplash.com/photo-1607278715207-858aa08d8b56?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1595777216528-85e6974c7e56?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1601455763557-db1bea8a9a5a?w=400&h=600&fit=crop&crop=center",
        ],
        mild: [
          "https://images.unsplash.com/photo-1533973427897-737b112ee0b9?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1596783077077-9bb74c7c1399?w=400&h=600&fit=crop&crop=center",
        ],
        warm: [
          "https://images.unsplash.com/photo-1592334873319-6d419f0fdd58?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop&crop=center",
        ],
      },
    },
    mode: {
      male: {
        cold: [
          "https://images.unsplash.com/photo-1507119212780-2b33727d2ad5?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1616804000710-8a9d4146b7b8?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=600&fit=crop&crop=center",
        ],
        mild: [
          "https://images.unsplash.com/photo-1541271696563-3be2f555fc4e?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1559563458-527698bf5295?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1537511446984-935f663eb1f4?w=400&h=600&fit=crop&crop=center",
        ],
        warm: [
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=600&fit=crop&crop=center",
        ],
      },
      female: {
        cold: [
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1594736797933-d0eced5dbd55?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=400&h=600&fit=crop&crop=center",
        ],
        mild: [
          "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1593476087123-36d1de271f08?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=600&fit=crop&crop=center",
        ],
        warm: [
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop&crop=center",
        ],
      },
    },
    minimal: {
      male: {
        cold: [
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=400&h=600&fit=crop&crop=center",
        ],
        mild: [
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=400&h=600&fit=crop&crop=center",
        ],
        warm: [
          "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1603252109303-2751441b4157?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=600&fit=crop&crop=center",
        ],
      },
      female: {
        cold: [
          "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=600&fit=crop&crop=center",
        ],
        mild: [
          "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=600&fit=crop&crop=center",
        ],
        warm: [
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=600&fit=crop&crop=center",
        ],
      },
    },
    vintage: {
      male: {
        cold: [
          "https://images.unsplash.com/photo-1507119212780-2b33727d2ad5?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=400&h=600&fit=crop&crop=center",
        ],
        mild: [
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1559563458-527698bf5295?w=400&h=600&fit=crop&crop=center",
        ],
        warm: [
          "https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=600&fit=crop&crop=center",
        ],
      },
      female: {
        cold: [
          "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&h=600&fit=crop&crop=center",
        ],
        mild: [
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=600&fit=crop&crop=center",
        ],
        warm: [
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=600&fit=crop&crop=center",
        ],
      },
    },
  };

  // デフォルト画像（フォールバック用）- 全身ファッション写真
  private static readonly defaultImages: DefaultImages = {
    male: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=center",
    female: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop&crop=center",
    other: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=center",
  };

  /**
   * スタイル、性別、天気条件に基づいて適切な画像URLを取得
   * @param style - ファッションスタイル (casual, smart, street等)
   * @param gender - 性別 (male, female, other)
   * @param temperature - 気温
   * @param previousImages - 過去に使用した画像URL（重複回避用）
   * @param itemFeatures - AI提案アイテムの特徴（より正確な画像選択用）
   * @returns 画像URL
   */
  static getOutfitImage(
    style: string,
    gender: Gender,
    temperature: number,
    previousImages: string[] = [],
    itemFeatures?: Array<{category: string, name: string, color: string}>
  ): string {
    try {
      // 気温に基づく季節カテゴリー
      let tempCategory: TemperatureCategory;
      if (temperature < 15) tempCategory = "cold";
      else if (temperature > 25) tempCategory = "warm";
      else tempCategory = "mild";

      // 性別の正規化
      const normalizedGender: "male" | "female" =
        gender === "male" || gender === "female" ? gender : "male";

      // スタイルの正規化（存在しない場合はcasualにフォールバック）
      const normalizedStyle = this.imageDatabase[style] ? style : "casual";

      // 該当する画像配列を取得
      const imageArray =
        this.imageDatabase[normalizedStyle]?.[normalizedGender]?.[tempCategory];

      if (!imageArray || imageArray.length === 0) {
        // フォールバック: デフォルト画像を返す
        return this.defaultImages[normalizedGender];
      }

      // 過去に使用していない画像を優先選択
      const availableImages = imageArray.filter(
        (img) => !previousImages.includes(img)
      );
      const imagesToChooseFrom =
        availableImages.length > 0 ? availableImages : imageArray;

      // ランダムに選択
      const randomIndex = Math.floor(Math.random() * imagesToChooseFrom.length);
      const selectedImage = imagesToChooseFrom[randomIndex];
      
      // 選択された画像のログ出力（デバッグ用）
      console.log(`Selected image for ${normalizedStyle}/${normalizedGender}/${tempCategory}:`, selectedImage);
      
      return selectedImage || this.defaultImages[normalizedGender];
    } catch (error) {
      console.error("Image selection error:", error);
      // エラー時はデフォルト画像を返す
      const fallbackGender = gender === "male" || gender === "female" ? gender : "other";
      return this.defaultImages[fallbackGender];
    }
  }

  /**
   * 画像のプリロード（パフォーマンス向上）
   * @param imageUrl - プリロードする画像URL
   */
  static preloadImage(imageUrl: string): void {
    if (typeof window !== "undefined") {
      const img = new Image();
      img.src = imageUrl;
    }
  }

  /**
   * 複数の画像をプリロード
   * @param imageUrls - プリロードする画像URL配列
   */
  static preloadImages(imageUrls: string[]): void {
    imageUrls.forEach((url) => this.preloadImage(url));
  }

  /**
   * 特定条件の画像をすべて取得（プリロード用）
   * @param style - ファッションスタイル
   * @param gender - 性別
   * @returns 画像URL配列
   */
  static getImagesByCondition(style: string, gender: Gender): string[] {
    const normalizedGender: "male" | "female" =
      gender === "male" || gender === "female" ? gender : "male";
    const normalizedStyle = this.imageDatabase[style] ? style : "casual";

    const styleData = this.imageDatabase[normalizedStyle]?.[normalizedGender];
    if (!styleData) return [];

    return [
      ...(styleData.cold || []),
      ...(styleData.mild || []),
      ...(styleData.warm || []),
    ];
  }
}
