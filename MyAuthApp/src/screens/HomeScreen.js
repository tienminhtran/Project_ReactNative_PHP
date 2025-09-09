// HomeScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, ActivityIndicator, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiFetchProducts } from "../sanpham";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // 2 cột, chừa padding

export default function HomeScreen({ route, navigation }) {
  const [user, setUser] = useState(route.params?.user || null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!user) {
        const u = await AsyncStorage.getItem("user");
        if (u) setUser(JSON.parse(u));
      }
    })();
  }, []);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await apiFetchProducts();
      setProducts(data);
    } catch (e) {
      console.log("Lỗi lấy sản phẩm:", e.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("user");
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  if (!user) return null;

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.title}>Xin chào, {user.username} ------</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Thoát</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.section}>-------------------Danh sách sản phẩm -----------------</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={products}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.hinh }} style={styles.img} />
              <Text style={styles.name} numberOfLines={2}>{item.ten}</Text>
              <Text style={styles.price}>{item.gia.toLocaleString("vi-VN")} đ</Text>
              <TouchableOpacity style={styles.buyBtn}>
                <Text style={styles.buyText}>Mua ngay</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#f9fafb", padding: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  title: { fontSize: 18, fontWeight: "700", color: "#111827" },
  logoutBtn: { padding: 8, backgroundColor: "#ef4444", borderRadius: 8 },
  logoutText: { color: "#fff", fontWeight: "600" },
  section: { fontSize: 16, fontWeight: "600", marginBottom: 12, textAlign: "center", color: "#2563eb" },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  img: { width: "100%", height: 120, borderRadius: 8, marginBottom: 8, resizeMode: "cover" },
  name: { fontSize: 14, fontWeight: "600", color: "#111827" },
  price: { fontSize: 14, color: "#ef4444", fontWeight: "700", marginVertical: 4 },
  buyBtn: {
    marginTop: 6,
    backgroundColor: "#2563eb",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  buyText: { color: "#fff", fontWeight: "600" },
});
