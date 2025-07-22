import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  Coffee,
  Sun,
  Snowflake,
  Utensils,
  Clock,
  X,
  Send,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const BASE_URL = "http://api-coffee.m-zedan.com/api";

const NewOrderScreen = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useSelector((state) => state.language);
  const isRTL = currentLanguage === "ar";
  const [customerName, setCustomerName] = useState("");
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState({ hot: [], cold: [], food: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem("authToken");
      console.log("Retrieved Token:", token);
      if (!token) {
        throw new Error(t("worker.noToken"));
      }

      const response = await fetch(`${BASE_URL}/admin/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Products API Response:", result);

      if (result.data && Array.isArray(result.data)) {
        const categorizedProducts = {
          hot: result.data.filter((p) => p.category_id === "2"),
          cold: result.data.filter((p) => p.category_id === "1"),
          food: [],
        };
        setProducts(categorizedProducts);
      } else {
        throw new Error("No products data found");
      }
    } catch (error) {
      console.error("Error fetching products:", error.message);
      setError(error.message);
      Alert.alert(t("worker.error"), error.message || t("worker.fetchProductsFailed"));
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      updateGrams(product.id, existingItem.grams + 100); // زيادة 100 جرام كافتراضي
    } else {
      setCart([...cart, { ...product, grams: 100 }]); // افتراضي 100 جرام
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateGrams = (productId, newGrams) => {
    if (newGrams < 1) return; // الكمية لازم تكون أكبر من 0
    setCart(
      cart.map((item) =>
        item.id === productId ? { ...item, grams: newGrams } : item
      )
    );
  };

  const getItemPrice = (item) => {
    return (item.grams / 1000) * parseFloat(item.price); // السعر بناءً على الجرامات
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + getItemPrice(item), 0);
  };

  const getCartItemCount = () => {
    return cart.length; // عدد العناصر في السلة
  };

  const getTranslatedProductName = (productName) => productName || "";
  const getTranslatedProductDescription = () => "";
  const getTranslatedPopularity = () => "";

  const renderIcon = (iconName, size = 24, color = "#4e342e") => {
    const icons = {
      Sun: <Sun size={size} color={color} />,
      Snowflake: <Snowflake size={size} color={color} />,
      Utensils: <Utensils size={size} color={color} />,
      Coffee: <Coffee size={size} color={color} />,
      X: <X size={size} color={color} />,
      Send: <Send size={size} color={color} />,
    };
    return icons[iconName] || <Coffee size={size} color={color} />;
  };

  const placeOrder = async () => {
    console.log("Place Order button pressed!");
    if (!customerName || cart.length === 0) {
      Alert.alert(t("worker.error"), t("worker.enterCustomerAndItems"));
      console.log("Validation Error:", { customerName, cartLength: cart.length });
      return;
    }

    const orderData = {
      customer_id: 10,
      branch_id: 1,
      user_id: 15,
      total_amount: getTotal().toFixed(2),
      payment_method: "cash",
      items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.grams / 1000, // تحويل الجرامات إلى كيلو
        unit_price: parseFloat(item.price),
        subtotal: getItemPrice(item).toFixed(2),
      })),
    };

    console.log("Order Data being sent:", orderData);

    try {
      const token = await AsyncStorage.getItem("authToken");
      console.log("Retrieved Token for Order:", token);
      if (!token) {
        throw new Error(t("worker.noToken"));
      }

      const response = await fetch(`${BASE_URL}/admin/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      console.log("Order API Response:", result);
      console.log("API Response Status:", response.status);

      if (response.ok) {
        Alert.alert(t("worker.success"), t("worker.orderPlaced"));
        setCart([]);
        setCustomerName("");
      } else {
        throw new Error(result.message || `Error ${response.status}: Failed to place order`);
      }
    } catch (error) {
      console.error("Error placing order:", error.message);
      Alert.alert(t("worker.error"), error.message || t("worker.orderFailed"));
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f7f3ef" },
    header: {
      paddingTop: 48,
      paddingBottom: 24,
      paddingHorizontal: 16,
      backgroundColor: "#8d6e63",
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#fff",
      marginBottom: 8,
      textAlign: isRTL ? "right" : "left",
    },
    headerSubtitle: {
      color: "#f0ebe7",
      fontSize: 18,
      textAlign: isRTL ? "right" : "left",
    },
    scrollContainer: { flex: 1, paddingHorizontal: 16 },
    section: { marginVertical: 24 },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: "#4e342e",
      marginBottom: 12,
      textAlign: isRTL ? "right" : "left",
    },
    inputContainer: {
      backgroundColor: "#fffaf5",
      borderRadius: 20,
      padding: 16,
      elevation: 4,
      borderWidth: 1,
      borderColor: "#e5d4c0",
    },
    textInput: {
      fontSize: 18,
      color: "#4e342e",
      textAlign: isRTL ? "right" : "left",
    },
    categorySection: { marginBottom: 16 },
    productsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 12,
    },
    productsContainerRTL: { flexDirection: "row-reverse" },
    productCard: {
      backgroundColor: "#fffaf5",
      borderRadius: 16,
      padding: 16,
      elevation: 3,
      borderWidth: 1,
      borderColor: "#e5d4c0",
      width: (width - 48) / 2,
      marginBottom: 12,
    },
    productHeader: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    productImageContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#e5d4c0",
    },
    productContent: { flex: 1 },
    productName: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#4e342e",
      marginBottom: 6,
      lineHeight: 20,
      textAlign: isRTL ? "right" : "left",
    },
    productDescription: {
      color: "#6b4f42",
      marginBottom: 12,
      fontSize: 12,
      lineHeight: 16,
      textAlign: isRTL ? "right" : "left",
    },
    productFooter: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    productInfo: {
      flex: 1,
      marginRight: isRTL ? 0 : 8,
      marginLeft: isRTL ? 8 : 0,
    },
    productPrice: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#6d4c41",
      marginBottom: 4,
      textAlign: isRTL ? "right" : "left",
    },
    productTimeContainer: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
    },
    productTime: {
      fontSize: 11,
      color: "#6b4f42",
      marginLeft: isRTL ? 0 : 3,
      marginRight: isRTL ? 3 : 0,
    },
    addButton: {
      backgroundColor: "#8d6e63",
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      elevation: 3,
    },
    cartSection: { marginBottom: 32 },
    cartHeader: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    cartTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#4e342e",
      textAlign: isRTL ? "right" : "left",
    },
    cartItemCount: {
      backgroundColor: "#d7bfa9",
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 16,
    },
    cartItemCountText: {
      color: "#4e342e",
      fontWeight: "600",
      textAlign: "center",
    },
    cartContainer: {
      backgroundColor: "#fffaf5",
      borderRadius: 20,
      padding: 16,
      elevation: 4,
      borderWidth: 1,
      borderColor: "#e5d4c0",
    },
    cartItem: {
      backgroundColor: "#f7f3ef",
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    cartItemRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    cartItemDetails: { flex: 1 },
    cartItemName: {
      fontSize: 18,
      fontWeight: "600",
      color: "#4e342e",
      textAlign: isRTL ? "right" : "left",
    },
    cartItemPrice: {
      color: "#6b4f42",
      textAlign: isRTL ? "right" : "left",
    },
    cartItemActions: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
    },
    gramsInput: {
      backgroundColor: "#d7bfa9",
      width: 80,
      height: 40,
      borderRadius: 10,
      textAlign: "center",
      fontSize: 16,
      color: "#4e342e",
      marginHorizontal: 8,
    },
    removeButton: {
      marginLeft: isRTL ? 0 : 12,
      marginRight: isRTL ? 12 : 0,
      backgroundColor: "#8d6e63",
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    cartItemTotalContainer: {
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: "#e5d4c0",
    },
    cartItemTotal: {
      textAlign: isRTL ? "left" : "right",
      fontSize: 18,
      fontWeight: "bold",
      color: "#6d4c41",
    },
    cartTotalSection: {
      marginTop: 24,
      paddingTop: 16,
      borderTopWidth: 2,
      borderTopColor: "#e5d4c0",
    },
    cartTotalRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    cartTotalLabel: {
      fontSize: 20,
      fontWeight: "600",
      color: "#4e342e",
      textAlign: isRTL ? "right" : "left",
    },
    cartTotalAmount: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#6d4c41",
      textAlign: isRTL ? "right" : "left",
    },
    placeOrderButton: {
      backgroundColor: "#8d6e63",
      padding: 16,
      borderRadius: 20,
      elevation: 4,
    },
    placeOrderButtonContent: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "center",
    },
    placeOrderButtonText: {
      color: "#fff",
      textAlign: "center",
      fontSize: 18,
      fontWeight: "bold",
      marginRight: isRTL ? 0 : 8,
      marginLeft: isRTL ? 8 : 0,
    },
    productsContainerRTL: { flexDirection: "row-reverse" },
    loadingText: {
      textAlign: "center",
      fontSize: 16,
      color: "#4e342e",
    },
    errorText: {
      textAlign: "center",
      fontSize: 16,
      color: "#dc2626",
      marginVertical: 16,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("worker.newOrder")}</Text>
        <Text style={styles.headerSubtitle}>{t("worker.createNewOrder")}</Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("worker.customerInformation")}
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={customerName}
              onChangeText={setCustomerName}
              placeholder={t("worker.enterCustomerName")}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        <View style={styles.section}>
          {loading ? (
            <Text style={styles.loadingText}>{t("worker.loading")}</Text>
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <>
              {products.hot.length > 0 && (
                <View style={styles.categorySection}>
                  <Text style={styles.sectionTitle}>
                    {t("worker.hotDrinks")}
                  </Text>
                  <View
                    style={[
                      styles.productsContainer,
                      isRTL && styles.productsContainerRTL,
                    ]}
                  >
                    {products.hot.map((product) => (
                      <View key={product.id} style={styles.productCard}>
                        <View style={styles.productHeader}>
                          <View style={styles.productImageContainer}>
                            {renderIcon("Coffee", 28, "#4e342e")}
                          </View>
                        </View>

                        <View style={styles.productContent}>
                          <Text style={styles.productName}>
                            {getTranslatedProductName(product.name)}
                          </Text>
                          <Text style={styles.productDescription}>
                            {getTranslatedProductDescription()}
                          </Text>

                          <View style={styles.productFooter}>
                            <View style={styles.productInfo}>
                              <Text style={styles.productPrice}>
                                ${parseFloat(product.price).toFixed(2)}/kg
                              </Text>
                              <View style={styles.productTimeContainer}>
                                {renderIcon("Clock", 12, "#6b4f42")}
                                <Text style={styles.productTime}>2 min</Text>
                              </View>
                            </View>

                            <TouchableOpacity
                              style={styles.addButton}
                              onPress={() =>
                                addToCart({
                                  id: product.id,
                                  name: product.name,
                                  price: parseFloat(product.price),
                                })
                              }
                            >
                              {renderIcon("Plus", 18, "#fff")}
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {products.cold.length > 0 && (
                <View style={styles.categorySection}>
                  <Text style={styles.sectionTitle}>
                    {t("worker.coldDrinks")}
                  </Text>
                  <View
                    style={[
                      styles.productsContainer,
                      isRTL && styles.productsContainerRTL,
                    ]}
                  >
                    {products.cold.map((product) => (
                      <View key={product.id} style={styles.productCard}>
                        <View style={styles.productHeader}>
                          <View style={styles.productImageContainer}>
                            {renderIcon("Snowflake", 28, "#4e342e")}
                          </View>
                        </View>

                        <View style={styles.productContent}>
                          <Text style={styles.productName}>
                            {getTranslatedProductName(product.name)}
                          </Text>
                          <Text style={styles.productDescription}>
                            {getTranslatedProductDescription()}
                          </Text>

                          <View style={styles.productFooter}>
                            <View style={styles.productInfo}>
                              <Text style={styles.productPrice}>
                                ${parseFloat(product.price).toFixed(2)}/kg
                              </Text>
                              <View style={styles.productTimeContainer}>
                                {renderIcon("Clock", 12, "#6b4f42")}
                                <Text style={styles.productTime}>2 min</Text>
                              </View>
                            </View>

                            <TouchableOpacity
                              style={styles.addButton}
                              onPress={() =>
                                addToCart({
                                  id: product.id,
                                  name: product.name,
                                  price: parseFloat(product.price),
                                })
                              }
                            >
                              {renderIcon("Plus", 18, "#fff")}
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {products.food.length > 0 && (
                <View style={styles.categorySection}>
                  <Text style={styles.sectionTitle}>
                    {t("worker.foodItems")}
                  </Text>
                  <View
                    style={[
                      styles.productsContainer,
                      isRTL && styles.productsContainerRTL,
                    ]}
                  >
                    {products.food.map((product) => (
                      <View key={product.id} style={styles.productCard}>
                        <View style={styles.productHeader}>
                          <View style={styles.productImageContainer}>
                            {renderIcon("Utensils", 28, "#4e342e")}
                          </View>
                        </View>

                        <View style={styles.productContent}>
                          <Text style={styles.productName}>
                            {getTranslatedProductName(product.name)}
                          </Text>
                          <Text style={styles.productDescription}>
                            {getTranslatedProductDescription()}
                          </Text>

                          <View style={styles.productFooter}>
                            <View style={styles.productInfo}>
                              <Text style={styles.productPrice}>
                                ${parseFloat(product.price).toFixed(2)}/kg
                              </Text>
                              <View style={styles.productTimeContainer}>
                                {renderIcon("Clock", 12, "#6b4f42")}
                                <Text style={styles.productTime}>2 min</Text>
                              </View>
                            </View>

                            <TouchableOpacity
                              style={styles.addButton}
                              onPress={() =>
                                addToCart({
                                  id: product.id,
                                  name: product.name,
                                  price: parseFloat(product.price),
                                })
                              }
                            >
                              {renderIcon("Plus", 18, "#fff")}
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </>
          )}
        </View>

        {cart.length > 0 && (
          <View style={styles.cartSection}>
            <View style={styles.cartHeader}>
              <Text style={styles.cartTitle}>{t("worker.orderCart")}</Text>
              <View style={styles.cartItemCount}>
                <Text style={styles.cartItemCountText}>
                  {getCartItemCount()} {t("worker.items")}
                </Text>
              </View>
            </View>

            <View style={styles.cartContainer}>
              {cart.map((item) => (
                <View key={item.id} style={styles.cartItem}>
                  <View style={styles.cartItemRow}>
                    <View style={styles.cartItemDetails}>
                      <Text style={styles.cartItemName}>
                        {getTranslatedProductName(item.name)}
                      </Text>
                      <Text style={styles.cartItemPrice}>
                        ${parseFloat(item.price).toFixed(2)}/kg
                      </Text>
                    </View>
                    <View style={styles.cartItemActions}>
                      <TextInput
                        style={styles.gramsInput}
                        value={item.grams.toString()}
                        onChangeText={(text) => {
                          const grams = parseInt(text) || 0;
                          updateGrams(item.id, grams);
                        }}
                        keyboardType="numeric"
                        placeholder="g"
                        placeholderTextColor="#9CA3AF"
                      />
                      <TouchableOpacity
                        onPress={() => removeFromCart(item.id)}
                        style={styles.removeButton}
                      >
                        {renderIcon("X", 16, "#fff")}
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.cartItemTotalContainer}>
                    <Text style={styles.cartItemTotal}>
                      ${getItemPrice(item).toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))}

              <View style={styles.cartTotalSection}>
                <View style={styles.cartTotalRow}>
                  <Text style={styles.cartTotalLabel}>
                    {t("worker.totalAmount")}
                  </Text>
                  <Text style={styles.cartTotalAmount}>
                    ${getTotal().toFixed(2)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.placeOrderButton}
                  onPress={placeOrder}
                >
                  <View style={styles.placeOrderButtonContent}>
                    {renderIcon("Send", 20, "#fff")}
                    <Text style={styles.placeOrderButtonText}>
                      {t("worker.placeOrder")}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default NewOrderScreen;