import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { UserService } from "../services/storageService";

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
        style as any,
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

// Web用のInputコンポーネント
interface WebInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  style?: any;
}

function WebInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  style = {},
}: WebInputProps) {
  if (Platform.OS === "web") {
    return (
      <input
        type={secureTextEntry ? "password" : "text"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChangeText(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          border: "2px solid #e5e7eb",
          borderRadius: "8px",
          fontSize: "16px",
          marginBottom: "16px",
          ...style,
        }}
      />
    );
  }

  // ネイティブ版では通常のTextInput
  const { TextInput } = require("react-native");
  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      style={[
        {
          borderWidth: 2,
          borderColor: "#e5e7eb",
          borderRadius: 8,
          padding: 12,
          fontSize: 16,
          marginBottom: 16,
        },
        style as any,
      ]}
    />
  );
}

const STYLE_OPTIONS = [
  {
    id: "casual",
    label: "カジュアル",
    description: "リラックスした日常的なスタイル",
  },
  {
    id: "smart",
    label: "きれいめ",
    description: "上品で洗練されたスタイル",
  },
  {
    id: "street",
    label: "ストリート",
    description: "トレンドを取り入れたスタイル",
  },
  {
    id: "mode",
    label: "モード",
    description: "ファッション性の高いスタイル",
  },
  {
    id: "minimal",
    label: "ミニマル",
    description: "シンプルで無駄のないスタイル",
  },
  {
    id: "vintage",
    label: "ヴィンテージ",
    description: "レトロでクラシックなスタイル",
  },
];

export default function PreferencesScreen() {
  const router = useRouter();
  const [selectedStyle, setSelectedStyle] = useState("");
  const [userProfile, setUserProfile] = useState({ gender: "other", age: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserPreferences();
  }, []);

  const loadUserPreferences = async () => {
    try {
      const [preferences, profile] = await Promise.all([
        UserService.getUserPreferences(),
        UserService.getUserProfile(),
      ]);

      if (preferences && preferences.selectedStyle) {
        setSelectedStyle(preferences.selectedStyle);
      }

      if (profile) {
        setUserProfile({
          gender: profile.gender || "other",
          age: profile.age?.toString() || "",
        });
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId);
  };

  const updateProfile = (key: string, value: string) => {
    setUserProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    if (!selectedStyle) {
      alert("スタイルを選択してください");
      return;
    }

    if (!userProfile.age) {
      alert("年齢を入力してください");
      return;
    }

    const ageNum = parseInt(userProfile.age);
    if (isNaN(ageNum) || ageNum < 13 || ageNum > 100) {
      alert("年齢は13歳から100歳の間で入力してください");
      return;
    }

    try {
      // ユーザープロファイルの更新
      const currentProfile = await UserService.getUserProfile();
      const updatedProfile = {
        ...currentProfile,
        gender: userProfile.gender,
        age: ageNum,
        updatedAt: new Date().toISOString(),
      };

      const preferences = {
        selectedStyle: selectedStyle,
        updatedAt: new Date().toISOString(),
      };

      await Promise.all([
        UserService.saveUserProfile(updatedProfile),
        UserService.saveUserPreferences(preferences),
      ]);

      // ホーム画面に戻る
      router.push("/home");
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>設定を読み込み中...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
    >
      <Text style={styles.title}>好み設定</Text>
      <Text style={styles.subtitle}>
        あなたの好きなファッションスタイルを選択してください
      </Text>

      {/* プロフィール設定セクション */}
      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>プロフィール設定</Text>

        <WebInput
          placeholder="年齢"
          value={userProfile.age}
          onChangeText={(value: string) => updateProfile("age", value)}
        />

        <View style={styles.genderSection}>
          <Text style={styles.genderTitle}>性別</Text>
          <View style={styles.genderButtons}>
            {[
              { key: "male", label: "男性" },
              { key: "female", label: "女性" },
              { key: "other", label: "その他" },
            ].map(({ key, label }: { key: string; label: string }) => (
              <WebButton
                key={key}
                title={label}
                onPress={() => updateProfile("gender", key)}
                style={{
                  backgroundColor:
                    userProfile.gender === key ? "#6366f1" : "#e5e7eb",
                  color: userProfile.gender === key ? "white" : "#374151",
                  width: "auto",
                  flex: 1,
                  margin: "4px",
                }}
              />
            ))}
          </View>
        </View>
      </View>

      {/* スタイル選択セクション */}
      <View style={styles.stylesSection}>
        <Text style={styles.sectionTitle}>好みのスタイル</Text>
        <View style={styles.stylesContainer}>
          {STYLE_OPTIONS.map((style) => (
            <View key={style.id} style={styles.styleCard}>
              <WebButton
                title={style.label}
                onPress={() => handleStyleSelect(style.id)}
                style={{
                  backgroundColor:
                    selectedStyle === style.id ? "#6366f1" : "#e5e7eb",
                  color: selectedStyle === style.id ? "white" : "#374151",
                  margin: "4px",
                }}
              />
              <Text style={styles.styleDescription}>{style.description}</Text>
            </View>
          ))}
        </View>

        {selectedStyle && (
          <View style={styles.selectedStyle}>
            <Text style={styles.selectedText}>
              選択中: {STYLE_OPTIONS.find((s) => s.id === selectedStyle)?.label}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <WebButton
          title="設定を保存"
          onPress={handleSave}
          disabled={!selectedStyle}
          style={{
            backgroundColor: selectedStyle ? "#10b981" : "#9ca3af",
            marginBottom: "8px",
          }}
        />

        <WebButton
          title="戻る"
          onPress={handleBack}
          style={{ backgroundColor: "#6b7280" }}
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
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#1f2937",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 24,
  },
  stylesContainer: {
    marginBottom: 24,
  },
  profileSection: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  stylesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  genderSection: {
    marginBottom: 16,
  },
  genderTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  genderButtons: {
    flexDirection: "row",
    gap: 8,
  },
  styleCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  styleDescription: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 8,
  },
  selectedStyle: {
    backgroundColor: "#eff6ff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  selectedText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1d4ed8",
    textAlign: "center",
  },
  actions: {
    marginTop: "auto",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
  },
});
