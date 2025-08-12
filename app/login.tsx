import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

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

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log("Login attempt:", { email, password });

    if (!email || !password) {
      alert("メールアドレスとパスワードを入力してください");
      return;
    }

    setLoading(true);

    // 簡易的なログイン処理
    setTimeout(() => {
      alert("ログイン成功！ホーム画面に移動します");
      router.push("/home");
      setLoading(false);
    }, 1000);
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
    >
      <View style={styles.form}>
        <Text style={styles.title}>ログイン</Text>

        <WebInput
          placeholder="メールアドレス"
          value={email}
          onChangeText={setEmail}
        />

        <WebInput
          placeholder="パスワード"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />

        <WebButton
          title={loading ? "ログイン中..." : "ログイン"}
          onPress={handleLogin}
          disabled={loading}
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
    marginBottom: 24,
    color: "#1f2937",
  },
});
