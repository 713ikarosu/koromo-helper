// ローカルストレージサービス（Web環境とネイティブ環境対応）
export class StorageService {
  static async setItem(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      if (typeof window !== "undefined" && window.localStorage) {
        // Web環境
        window.localStorage.setItem(key, jsonValue);
      } else {
        // React Native環境（AsyncStorageが必要な場合）
      }
    } catch (error) {
      console.error("Storage save error:", error);
    }
  }

  static async getItem(key) {
    try {
      let jsonValue = null;
      if (typeof window !== "undefined" && window.localStorage) {
        // Web環境
        jsonValue = window.localStorage.getItem(key);
      } else {
        // React Native環境（AsyncStorageが必要な場合）
        return null;
      }

      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error("Storage load error:", error);
      return null;
    }
  }

  static async removeItem(key) {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        // Web環境
        window.localStorage.removeItem(key);
      } else {
        // React Native環境（AsyncStorageが必要な場合）
      }
    } catch (error) {
      console.error("Storage remove error:", error);
    }
  }

  static async clear() {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        // Web環境
        window.localStorage.clear();
      } else {
        // React Native環境（AsyncStorageが必要な場合）
      }
    } catch (error) {
      console.error("Storage clear error:", error);
    }
  }
}

// ユーザープロファイルサービス
export class UserService {
  static STORAGE_KEYS = {
    USER_PROFILE: "userProfile",
    USER_PREFERENCES: "userPreferences",
    OUTFIT_HISTORY: "outfitHistory",
  };

  static async saveUserProfile(userProfile) {
    await StorageService.setItem(this.STORAGE_KEYS.USER_PROFILE, userProfile);
  }

  static async getUserProfile() {
    return await StorageService.getItem(this.STORAGE_KEYS.USER_PROFILE);
  }

  static async saveUserPreferences(preferences) {
    await StorageService.setItem(
      this.STORAGE_KEYS.USER_PREFERENCES,
      preferences
    );
  }

  static async getUserPreferences() {
    return await StorageService.getItem(this.STORAGE_KEYS.USER_PREFERENCES);
  }

  static async saveOutfitHistory(outfit) {
    try {
      const history =
        (await StorageService.getItem(this.STORAGE_KEYS.OUTFIT_HISTORY)) || [];
      const newHistory = [outfit, ...history].slice(0, 50); // 最新50件まで保持
      await StorageService.setItem(
        this.STORAGE_KEYS.OUTFIT_HISTORY,
        newHistory
      );
    } catch (error) {
      console.error("Error saving outfit history:", error);
    }
  }

  static async getOutfitHistory() {
    return (
      (await StorageService.getItem(this.STORAGE_KEYS.OUTFIT_HISTORY)) || []
    );
  }

  static async clearAllUserData() {
    await StorageService.removeItem(this.STORAGE_KEYS.USER_PROFILE);
    await StorageService.removeItem(this.STORAGE_KEYS.USER_PREFERENCES);
    await StorageService.removeItem(this.STORAGE_KEYS.OUTFIT_HISTORY);
  }
}
