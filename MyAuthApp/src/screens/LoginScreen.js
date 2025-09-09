import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiLogin } from "../api";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  

  const onLogin = async () => {
    if (!username || !password) { Alert.alert("Lỗi", "Nhập đủ username & mật khẩu"); return; }
    try {
      setLoading(true);
      const { data } = await apiLogin({ username, password });
      await AsyncStorage.setItem("user", JSON.stringify(data));
      navigation.reset({ index: 0, routes: [{ name: "Home", params: { user: data } }] });
    } catch (e) {
      Alert.alert("Đăng nhập thất bại", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Chào mừng 👋</Text>
      <TextInput style={styles.input} placeholder="Username" autoCapitalize="none" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Mật khẩu" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.btn} onPress={onLogin} disabled={loading}>
        {loading ? <ActivityIndicator /> : <Text style={styles.btnText}>Đăng nhập</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Register")} style={{ marginTop: 12 }}>
        <Text style={{ textAlign: "center" }}>Chưa có tài khoản? <Text style={{ fontWeight: "600" }}>Đăng ký</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f6f7fb" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 20, textAlign: "center" },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", marginBottom: 12 },
  btn: { backgroundColor: "#2563eb", padding: 14, borderRadius: 12, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700" },
});
//123456