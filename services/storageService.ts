// ローカルストレージサービス（Web環境とネイティブ環境対応）
import { Outfit, UserProfile } from './aiService';

// ユーザー設定の型定義
export interface UserPreferences {
  selectedStyle: string;
  gender?: "male" | "female" | "other";
  age?: number;
  [key: string]: any;
}

// ストレージキーの定数定義
export const STORAGE_KEYS = {
  USER_PROFILE: "userProfile",
  USER_PREFERENCES: "userPreferences",
  OUTFIT_HISTORY: "outfitHistory",
} as const;

export class StorageService {
  static async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      if (typeof window !== "undefined" && window.localStorage) {
        // Web環境
        window.localStorage.setItem(key, jsonValue);
      } else {
        // React Native環境（AsyncStorageが必要な場合）
        // TODO: AsyncStorage実装時に追加
      }
    } catch (error) {
      console.error("Storage save error:", error);
    }
  }

  static async getItem<T>(key: string): Promise<T | null> {
    try {
      let jsonValue: string | null = null;
      if (typeof window !== "undefined" && window.localStorage) {
        // Web環境
        jsonValue = window.localStorage.getItem(key);
      } else {
        // React Native環境（AsyncStorageが必要な場合）
        return null;
      }

      return jsonValue != null ? JSON.parse(jsonValue) as T : null;
    } catch (error) {
      console.error("Storage load error:", error);
      return null;
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        // Web環境
        window.localStorage.removeItem(key);
      } else {
        // React Native環境（AsyncStorageが必要な場合）
        // TODO: AsyncStorage実装時に追加
      }
    } catch (error) {
      console.error("Storage remove error:", error);
    }
  }

  static async clear(): Promise<void> {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        // Web環境
        window.localStorage.clear();
      } else {
        // React Native環境（AsyncStorageが必要な場合）
        // TODO: AsyncStorage実装時に追加
      }
    } catch (error) {
      console.error("Storage clear error:", error);
    }
  }
}

// ユーザープロファイルサービス
export class UserService {
  static readonly STORAGE_KEYS = STORAGE_KEYS;

  static async saveUserProfile(userProfile: UserProfile): Promise<void> {
    await StorageService.setItem(this.STORAGE_KEYS.USER_PROFILE, userProfile);
  }

  static async getUserProfile(): Promise<UserProfile | null> {
    return await StorageService.getItem<UserProfile>(this.STORAGE_KEYS.USER_PROFILE);
  }

  static async saveUserPreferences(preferences: UserPreferences): Promise<void> {
    await StorageService.setItem(
      this.STORAGE_KEYS.USER_PREFERENCES,
      preferences
    );
  }

  static async getUserPreferences(): Promise<UserPreferences | null> {
    return await StorageService.getItem<UserPreferences>(this.STORAGE_KEYS.USER_PREFERENCES);
  }

  static async saveOutfitHistory(outfit: Outfit): Promise<void> {
    try {
      const history = 
        (await StorageService.getItem<Outfit[]>(this.STORAGE_KEYS.OUTFIT_HISTORY)) || [];
      const newHistory = [outfit, ...history].slice(0, 50); // 最新50件まで保持
      await StorageService.setItem(
        this.STORAGE_KEYS.OUTFIT_HISTORY,
        newHistory
      );
    } catch (error) {
      console.error("Error saving outfit history:", error);
    }
  }

  static async getOutfitHistory(): Promise<Outfit[]> {
    return (
      (await StorageService.getItem<Outfit[]>(this.STORAGE_KEYS.OUTFIT_HISTORY)) || []
    );
  }

  static async clearAllUserData(): Promise<void> {
    await StorageService.removeItem(this.STORAGE_KEYS.USER_PROFILE);
    await StorageService.removeItem(this.STORAGE_KEYS.USER_PREFERENCES);
    await StorageService.removeItem(this.STORAGE_KEYS.OUTFIT_HISTORY);
  }
}