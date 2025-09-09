import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { apiRegister } from "../api";

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ username: "", password: "", ho_ten: "", email: "", so_dien_thoai: "" });
  const [loading, setLoading] = useState(false);

  const setField = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const onRegister = async () => {
    const { username, password, ho_ten, email } = form;
    if (!username || !password || !ho_ten || !email) {
      Alert.alert("Lỗi", "Vui lòng nhập đủ thông tin bắt buộc"); return;
    }
    try {
      setLoading(true);
      await apiRegister(form);
      Alert.alert("Thành công", "Đăng ký thành công, đăng nhập ngay!", [
        { text: "OK", onPress: () => navigation.replace("Login") }
      ]);
    } catch (e) {
      Alert.alert("Đăng ký thất bại", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Tạo tài khoản ✨</Text>
      <TextInput style={styles.input} placeholder="Họ tên" value={form.ho_ten} onChangeText={(t)=>setField("ho_ten", t)} />
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" autoCapitalize="none"
        value={form.email} onChangeText={(t)=>setField("email", t)} />
      <TextInput style={styles.input} placeholder="Số điện thoại" keyboardType="phone-pad"
        value={form.so_dien_thoai} onChangeText={(t)=>setField("so_dien_thoai", t)} />
      <TextInput style={styles.input} placeholder="Username" autoCapitalize="none"
        value={form.username} onChangeText={(t)=>setField("username", t)} />
      <TextInput style={styles.input} placeholder="Mật khẩu" secureTextEntry
        value={form.password} onChangeText={(t)=>setField("password", t)} />
      <TouchableOpacity style={styles.btn} onPress={onRegister} disabled={loading}>
        {loading ? <ActivityIndicator /> : <Text style={styles.btnText}>Đăng ký</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f6f7fb" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 20, textAlign: "center" },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", marginBottom: 12 },
  btn: { backgroundColor: "#16a34a", padding: 14, borderRadius: 12, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700" },
});
