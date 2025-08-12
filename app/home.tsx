import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AIService } from "../services/aiService";
import { UserService } from "../services/storageService";
import { WeatherService } from "../services/weatherService";

interface WeatherData {
  temperature: number;
  weather: string;
  location: string;
  timestamp: string;
  humidity?: number;
  windSpeed?: number;
  isDefault?: boolean;
}

interface OutfitItem {
  name: string;
  category: string;
  color: string;
}

interface Outfit {
  items: OutfitItem[];
  description: string;
  stylePoint: string;
  weatherNote: string;
  style: string;
  weather: string;
  temperature: number;
  imageUrl: string;
  source: string;
  timestamp: string;
}

interface UserPreferences {
  selectedStyle: string;
  gender: string;
  age: number;
  [key: string]: any;
}

// Web用の純粋なHTMLボタンコンポーネント
interface WebButtonProps {
  title: string;
  onPress: () => void;
  style?: any;
  disabled?: boolean;
}

function WebButton({
  title,
  onPress,
  style = {},
  disabled = false,
}: WebButtonProps) {
  if (Platform.OS === "web") {
    return (
      <button
        onClick={onPress}
        disabled={disabled}
        style={{
          backgroundColor: disabled ? "#9ca3af" : "#6366f1",
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "12px 24px",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: disabled ? "not-allowed" : "pointer",
          margin: "8px",
          width: "100%",
          ...style,
        }}
      >
        {title}
      </button>
    );
  }

  // ネイティブ版では通常のPressableコンポーネントを使用
  const { Pressable } = require("react-native");
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          backgroundColor: disabled ? "#9ca3af" : "#6366f1",
          borderRadius: 8,
          paddingVertical: 12,
          paddingHorizontal: 24,
          margin: 8,
        },
        style,
      ]}
    >
      <Text
        style={{
          color: "white",
          fontSize: 16,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [loading, setLoading] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [userPreferences, setUserPreferences] =
    useState<UserPreferences | null>(null);
  const [outfitHistory, setOutfitHistory] = useState<Outfit[]>([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // ユーザー設定とデータを並行で読み込み
      const [preferences, weather, history, profile] = await Promise.all([
        UserService.getUserPreferences(),
        WeatherService.getCurrentWeather(),
        UserService.getOutfitHistory(),
        UserService.getUserProfile(),
      ]);

      setUserPreferences({ ...preferences, ...profile });
      setWeatherData(weather);
      setOutfitHistory(history);
    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      setWeatherLoading(false);
    }
  };

  const generateOutfit = async () => {
    if (!userPreferences || !userPreferences.selectedStyle) {
      router.push("/preferences");
      return;
    }

    if (!weatherData) {
      return;
    }

    setLoading(true);

    try {
      // AIサービスを使用してコーディネート提案を生成
      const newOutfit = await AIService.generateOutfitSuggestion(
        {
          gender: userPreferences.gender || "other",
          age: userPreferences.age || 25,
        },
        weatherData,
        userPreferences.selectedStyle,
        outfitHistory
      );

      setOutfit(newOutfit);

      // 履歴に保存
      await UserService.saveOutfitHistory(newOutfit);
      const updatedHistory = await UserService.getOutfitHistory();
      setOutfitHistory(updatedHistory);
    } catch (error) {
      console.error("Outfit generation error:", error);
    } finally {
      setLoading(false);
    }
  };

  const goToPreferences = () => {
    router.push("/preferences");
  };

  const logout = () => {
    router.push("/");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
    >
      <Text style={styles.title}>AI-Coord ホーム</Text>

      {/* 天気情報 */}
      <View style={styles.weatherCard}>
        <View style={styles.weatherHeader}>
          <Text style={styles.cardTitle}>今日の天気</Text>
          <WebButton
            title="更新"
            onPress={loadInitialData}
            style={{
              backgroundColor: "#10b981",
              fontSize: "12px",
              padding: "6px 12px",
              width: "auto",
            }}
          />
        </View>

        {weatherLoading ? (
          <Text style={styles.loadingText}>天気情報を取得中...</Text>
        ) : weatherData ? (
          <>
            <Text style={styles.temperature}>{weatherData.temperature}°C</Text>
            <Text style={styles.weather}>{weatherData.weather}</Text>
            <Text style={styles.location}>{weatherData.location}</Text>
            {weatherData.isDefault && (
              <Text style={styles.defaultNotice}>
                ※位置情報が取得できないためデフォルト値を表示
              </Text>
            )}
          </>
        ) : (
          <Text style={styles.errorText}>天気情報の取得に失敗しました</Text>
        )}
      </View>

      {/* コーディネート提案 */}
      <View style={styles.outfitCard}>
        <Text style={styles.cardTitle}>今日のコーディネート</Text>

        <WebButton
          title={loading ? "生成中..." : "コーデを提案する"}
          onPress={generateOutfit}
          disabled={loading}
        />

        {!userPreferences?.selectedStyle && (
          <View style={styles.noPreferencesMessage}>
            <Text style={styles.noPreferencesText}>
              コーディネート提案を受けるには、まず好み設定でスタイルを選択してください
            </Text>
          </View>
        )}

        {outfit && (
          <View style={styles.outfitResult}>
            <View style={styles.outfitHeader}>
              <Text style={styles.outfitStyle}>{outfit.style}スタイル</Text>
              {outfit.source && (
                <Text style={styles.sourceText}>
                  {outfit.source === "AI" ? "AI提案" : "基本提案"}
                </Text>
              )}
            </View>

            {/* コーディネート画像 */}
            {outfit.imageUrl && (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: outfit.imageUrl }}
                  style={styles.outfitImage}
                  resizeMode="cover"
                />
              </View>
            )}

            <Text style={styles.outfitDescription}>{outfit.description}</Text>

            {/* AIからのスタイリングポイント */}
            {outfit.stylePoint && (
              <View style={styles.pointContainer}>
                <Text style={styles.pointTitle}>💡 スタイリングポイント</Text>
                <Text style={styles.pointText}>{outfit.stylePoint}</Text>
              </View>
            )}

            {/* AIからの天気に関する配慮 */}
            {outfit.weatherNote && (
              <View style={styles.pointContainer}>
                <Text style={styles.pointTitle}>🌤️ 天気への配慮</Text>
                <Text style={styles.pointText}>{outfit.weatherNote}</Text>
              </View>
            )}

            <View style={styles.itemsContainer}>
              <Text style={styles.itemsTitle}>アイテム:</Text>
              {outfit.items.map((item: OutfitItem, index: number) => (
                <Text key={index} style={styles.item}>
                  • {item.name} ({item.category}, {item.color})
                </Text>
              ))}
            </View>

            <WebButton
              title="別の提案をもらう"
              onPress={generateOutfit}
              style={{ backgroundColor: "#10b981" }}
            />
          </View>
        )}

        {outfitHistory.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.historyTitle}>
              最近の提案履歴 ({outfitHistory.length}件)
            </Text>
            <Text style={styles.historyNote}>
              最新の提案から重複を避けて新しいコーディネートを提案しています
            </Text>
          </View>
        )}
      </View>

      {/* ナビゲーション */}
      <View style={styles.navigation}>
        <WebButton
          title="好み設定"
          onPress={goToPreferences}
          style={{ backgroundColor: "#f59e0b" }}
        />

        <WebButton
          title="ログアウト"
          onPress={logout}
          style={{ backgroundColor: "#ef4444" }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  scrollContainer: {
    padding: 20,
    minHeight: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#1f2937",
  },
  weatherCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  outfitCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1f2937",
  },
  temperature: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#6366f1",
    marginBottom: 4,
  },
  weather: {
    fontSize: 18,
    color: "#6b7280",
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: "#9ca3af",
  },
  outfitResult: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
  },
  outfitStyle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6366f1",
    marginBottom: 8,
  },
  outfitDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
    lineHeight: 20,
  },
  itemsContainer: {
    marginBottom: 16,
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1f2937",
  },
  item: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  weatherHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    textAlign: "center",
    padding: 20,
  },
  defaultNotice: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
  },
  noPreferencesMessage: {
    backgroundColor: "#fef3c7",
    padding: 16,
    borderRadius: 8,
    marginVertical: 12,
  },
  noPreferencesText: {
    fontSize: 14,
    color: "#92400e",
    textAlign: "center",
  },
  outfitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sourceText: {
    fontSize: 12,
    color: "#10b981",
    fontWeight: "bold",
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  pointContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#6366f1",
  },
  pointTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  pointText: {
    fontSize: 13,
    color: "#4b5563",
    lineHeight: 18,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  outfitImage: {
    width: 200,
    height: 300,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  historySection: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 4,
  },
  historyNote: {
    fontSize: 12,
    color: "#6b7280",
  },
});
