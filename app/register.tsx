import { useRouter } from "expo-router";
import { useState } from "react";
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

export default function RegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    gender: "other",
    age: "",
  });
  const [loading, setLoading] = useState(false);

  const updateFormData = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleRegister = async () => {
    const { email, password, confirmPassword, nickname, gender, age } =
      formData;

    // バリデーション
    if (!email || !password || !confirmPassword || !nickname || !age) {
      alert("すべての項目を入力してください");
      return;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 13 || ageNum > 100) {
      alert("年齢は13歳から100歳の間で入力してください");
      return;
    }

    if (password !== confirmPassword) {
      alert("パスワードが一致しません");
      return;
    }

    if (password.length < 6) {
      alert("パスワードは6文字以上で入力してください");
      return;
    }

    setLoading(true);

    try {
      // ユーザープロファイルを作成・保存
      const userProfile = {
        id: Date.now().toString(),
        email,
        nickname,
        gender,
        age: parseInt(age),
        createdAt: new Date().toISOString(),
      };

      await UserService.saveUserProfile(userProfile);

      // 好み設定画面へ遷移
      router.push("/preferences");
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
    >
      <View style={styles.form}>
        <Text style={styles.title}>新規登録</Text>
        <Text style={styles.subtitle}>アカウントを作成してください</Text>

        <WebInput
          placeholder="ニックネーム"
          value={formData.nickname}
          onChangeText={(value: string) => updateFormData("nickname", value)}
        />

        <WebInput
          placeholder="メールアドレス"
          value={formData.email}
          onChangeText={(value: string) => updateFormData("email", value)}
        />

        <WebInput
          placeholder="パスワード（6文字以上）"
          value={formData.password}
          onChangeText={(value: string) => updateFormData("password", value)}
          secureTextEntry={true}
        />

        <WebInput
          placeholder="パスワード確認"
          value={formData.confirmPassword}
          onChangeText={(value: string) =>
            updateFormData("confirmPassword", value)
          }
          secureTextEntry={true}
        />

        <WebInput
          placeholder="年齢"
          value={formData.age}
          onChangeText={(value: string) => updateFormData("age", value)}
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
                onPress={() => updateFormData("gender", key)}
                style={{
                  backgroundColor:
                    formData.gender === key ? "#6366f1" : "#e5e7eb",
                  color: formData.gender === key ? "white" : "#374151",
                  width: "auto",
                  flex: 1,
                  margin: "4px",
                }}
              />
            ))}
          </View>
        </View>

        <WebButton
          title={loading ? "登録中..." : "登録"}
          onPress={handleRegister}
          disabled={loading}
          style={{
            backgroundColor: loading ? "#9ca3af" : "#10b981",
            marginTop: "20px",
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  form: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
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
});
