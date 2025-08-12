// 画像マッピングサービス - Unsplash画像を使用
export class ImageService {
  // Unsplashから厳選したファッション全身画像URL（高品質、商用利用可）
  static imageDatabase = {
    casual: {
      male: {
        cold: [
          "https://images.unsplash.com/photo-1574180045827-681f8a1a9622?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1603252109303-2751441b4157?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1604830664190-d7e6137ba6bc?w=600&h=800&fit=crop",
        ],
        mild: [
          "https://images.unsplash.com/photo-1548142813-c348350df52b?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=600&h=800&fit=crop",
        ],
        warm: [
          "https://images.unsplash.com/photo-1567013127542-490d757e51cd?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=600&h=800&fit=crop",
        ],
      },
      female: {
        cold: [
          "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1607278715207-858aa08d8b56?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1595777216528-85e6974c7e56?w=600&h=800&fit=crop",
        ],
        mild: [
          "https://images.unsplash.com/photo-1601455763557-db1bea8a9a5a?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1533973427897-737b112ee0b9?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&h=800&fit=crop",
        ],
        warm: [
          "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1592334873319-6d419f0fdd58?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1596783077077-9bb74c7c1399?w=600&h=800&fit=crop",
        ],
      },
    },
    smart: {
      male: {
        cold: [
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1537511446984-935f663eb1f4?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1592334873319-6d419f0fdd58?w=600&h=800&fit=crop",
        ],
        mild: [
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=800&fit=crop",
        ],
        warm: [
          "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&h=800&fit=crop",
        ],
      },
      female: {
        cold: [
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1541823709867-1b206113eafd?w=600&h=800&fit=crop",
        ],
        mild: [
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=600&h=800&fit=crop",
        ],
        warm: [
          "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1593476087123-36d1de271f08?w=600&h=800&fit=crop",
        ],
      },
    },
    street: {
      male: {
        cold: [
          "https://images.unsplash.com/photo-1574180045827-681f8a1a9622?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1603252109303-2751441b4157?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1604830664190-d7e6137ba6bc?w=600&h=800&fit=crop",
        ],
        mild: [
          "https://images.unsplash.com/photo-1548142813-c348350df52b?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=600&h=800&fit=crop",
        ],
        warm: [
          "https://images.unsplash.com/photo-1567013127542-490d757e51cd?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=600&h=800&fit=crop",
        ],
      },
      female: {
        cold: [
          "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1607278715207-858aa08d8b56?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1595777216528-85e6974c7e56?w=600&h=800&fit=crop",
        ],
        mild: [
          "https://images.unsplash.com/photo-1601455763557-db1bea8a9a5a?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1533973427897-737b112ee0b9?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&h=800&fit=crop",
        ],
        warm: [
          "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1592334873319-6d419f0fdd58?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1596783077077-9bb74c7c1399?w=600&h=800&fit=crop",
        ],
      },
    },
  };

  // デフォルト画像（フォールバック用）- 全身ファッション写真
  static defaultImages = {
    male: "https://images.unsplash.com/photo-1574180045827-681f8a1a9622?w=600&h=800&fit=crop",
    female:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&h=800&fit=crop",
    other:
      "https://images.unsplash.com/photo-1574180045827-681f8a1a9622?w=600&h=800&fit=crop",
  };

  /**
   * スタイル、性別、天気条件に基づいて適切な画像URLを取得
   * @param {string} style - ファッションスタイル (casual, smart, street等)
   * @param {string} gender - 性別 (male, female, other)
   * @param {number} temperature - 気温
   * @param {Array} previousImages - 過去に使用した画像URL（重複回避用）
   * @returns {string} 画像URL
   */
  static getOutfitImage(style, gender, temperature, previousImages = []) {
    try {
      // 気温に基づく季節カテゴリー
      let tempCategory;
      if (temperature < 15) tempCategory = "cold";
      else if (temperature > 25) tempCategory = "warm";
      else tempCategory = "mild";

      // 性別の正規化
      const normalizedGender =
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
      return imagesToChooseFrom[randomIndex];
    } catch (error) {
      console.error("Image selection error:", error);
      // エラー時はデフォルト画像を返す
      return this.defaultImages[gender] || this.defaultImages.other;
    }
  }

  /**
   * 画像のプリロード（パフォーマンス向上）
   * @param {string} imageUrl - プリロードする画像URL
   */
  static preloadImage(imageUrl) {
    if (typeof window !== "undefined") {
      const img = new Image();
      img.src = imageUrl;
    }
  }

  /**
   * 複数の画像をプリロード
   * @param {Array} imageUrls - プリロードする画像URL配列
   */
  static preloadImages(imageUrls) {
    imageUrls.forEach((url) => this.preloadImage(url));
  }

  /**
   * 特定条件の画像をすべて取得（プリロード用）
   * @param {string} style - ファッションスタイル
   * @param {string} gender - 性別
   * @returns {Array} 画像URL配列
   */
  static getImagesByCondition(style, gender) {
    const normalizedGender =
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
