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
  Plus,
  Minus,
  X,
  Send,
} from "lucide-react-native";

const { width } = Dimensions.get("window");
const BASE_URL = "http://api-coffee.m-zedan.com/api"; // استبدل بالـ base_url الصحيح
const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vYXBpLWNvZmZlZS5tLXplZGFuLmNvbS9hcGkvYWRtaW4vYXV0aC9sb2dpbiIsImlhdCI6MTc1MzAxOTAwNSwiZXhwIjoxNzUzMDIyNjA1LCJuYmYiOjE3NTMwMTkwMDUsImp0aSI6IllvQ2wxeUVKc2g5QThjVFEiLCJzdWIiOiIxNSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.lAPTE4qIaeM9Eco0XGWusb5JY1zxC-mFvV4dSYRVyvA";

const NewOrderScreen = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useSelector((state) => state.language);
  const isRTL = currentLanguage === "ar";
  const [customerName, setCustomerName] = useState("تجريبي1");
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState({ hot: [], cold: [], food: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/admin/products`, {
        headers: {
          Authorization: `Bearer ${token}`, 
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      console.log("API Response:", result);
      if (result.data && Array.isArray(result.data)) {
        const categorizedProducts = {
          hot: result.data.filter((p) => p.category_id === "2"), // "بن" كـ hot
          cold: result.data.filter((p) => p.category_id === "1"), // "مشروبات" كـ cold
          food: [], // يمكن تكون فاضية حاليًا، لو فيه تصنيف جديد زوده
        };
        setProducts(categorizedProducts);
      } else {
        throw new Error("No products data found");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      Alert.alert(t("worker.error"), t("worker.fetchProductsFailed"));
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(
      cart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotal = () => {
    return cart.reduce(
      (total, item) => total + parseFloat(item.price) * item.quantity,
      0
    );
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
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
      Plus: <Plus size={size} color={color} />,
      Minus: <Minus size={size} color={color} />,
      X: <X size={size} color={color} />,
      Send: <Send size={size} color={color} />,
    };
    return icons[iconName] || <Coffee size={size} color={color} />;
  };

  const placeOrder = async () => {
    console.log("Place Order button pressed!"); // للتحقق من الضغط
    if (!customerName || cart.length === 0) {
      // Alert.alert(t("worker.error"), t("worker.enterCustomerAndItems"));
      console.log("worker.error");
      console.log(customerName + cart.length);

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
        quantity: item.quantity,
        unit_price: parseFloat(item.price),
        subtotal: (parseFloat(item.price) * item.quantity).toFixed(2),
      })),
    };

    // عرض الـ orderData قبل الطلب
    console.log("Order Data being sent:", orderData);

    try {
      const response = await fetch(`${BASE_URL}/admin/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API Response Status:", response.status);
      console.log("API Response:", result);

      if (response.ok) {
        Alert.alert(t("worker.success"), t("worker.orderPlaced"));
        setCart([]);
        setCustomerName("");
      } else {
        const errorMessage =
          result.message || `Error ${response.status}: Failed to place order`;
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error placing order:", error.message);
      Alert.alert(t("worker.error"), error.message); // عرض الخطأ للمستخدم
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
    qtyButton: {
      backgroundColor: "#d7bfa9",
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    qtyPlusButton: { backgroundColor: "#6d4c41" },
    cartItemQty: {
      marginHorizontal: 16,
      fontSize: 18,
      fontWeight: "600",
      color: "#4e342e",
      minWidth: 30,
      textAlign: "center",
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
                                ${parseFloat(product.price).toFixed(2)}
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
                                ${parseFloat(product.price).toFixed(2)}
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
                                ${parseFloat(product.price).toFixed(2)}
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
                        ${item.price.toFixed(2)} {t("worker.each")}
                      </Text>
                    </View>
                    <View style={styles.cartItemActions}>
                      <TouchableOpacity
                        onPress={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        style={styles.qtyButton}
                      >
                        {renderIcon("Minus", 16, "#4e342e")}
                      </TouchableOpacity>
                      <Text style={styles.cartItemQty}>{item.quantity}</Text>
                      <TouchableOpacity
                        onPress={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        style={[styles.qtyButton, styles.qtyPlusButton]}
                      >
                        {renderIcon("Plus", 16, "#fff")}
                      </TouchableOpacity>
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
                      ${(item.price * item.quantity).toFixed(2)}
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
