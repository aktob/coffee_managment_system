import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native"; // إضافة useNavigation
import {
  Coffee,
  Snowflake,
  Utensils,
  Clock,
  X,
  Send,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  ShoppingCart,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");
const BASE_URL = "http://api-coffee.m-zedan.com/api";

// دالة debounce يدوية
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const NewOrderScreen = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useSelector((state) => state.language);
  const theme = useSelector((state) => state.theme.mode);
  const isDark = theme === "dark";
  const isRTL = currentLanguage === "ar";
  const navigation = useNavigation(); // إضافة useNavigation
  const [customerName, setCustomerName] = useState("worker");
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState({ hot: [], cold: [], food: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSearchQuery, setTempSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCartModalVisible, setIsCartModalVisible] = useState(false);
  const limit = 10; // عدد المنتجات في الصفحة

  // دالة debounced لتحديث query السيرش
  const debouncedSetSearchQuery = useCallback(
    debounce((value) => {
      setSearchQuery(value);
    }, 300),
    []
  );

  // تحديث tempSearchQuery مع كل تغيير في الـ input
  const handleSearchChange = useCallback(
    (text) => {
      setTempSearchQuery(text);
      debouncedSetSearchQuery(text);
    },
    [debouncedSetSearchQuery]
  );

  const fetchProducts = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const token = await AsyncStorage.getItem("authToken");
        console.log("التوكن المسترد:", token);
        if (!token) {
          throw new Error(t("worker.noToken"));
        }
        const response = await fetch(
          `${BASE_URL}/admin/products?page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`خطأ HTTP! الحالة: ${response.status}`);
        }
        const result = await response.json();
        console.log("استجابة API المنتجات:", result);
        if (result.data && Array.isArray(result.data)) {
          const categorizedProducts = {
            hot: result.data.filter((p) => p.category_id === "2"),
            cold: result.data.filter((p) => p.category_id === "1"),
            food: result.data.filter((p) => p.category_id === "3"),
          };
          setProducts(categorizedProducts);
          setTotalPages(result.totalPages || Math.ceil(result.total / limit));
        } else {
          throw new Error("لم يتم العثور على بيانات المنتجات");
        }
      } catch (error) {
        console.error("خطأ أثناء جلب المنتجات:", error.message);
        setError(error.message);
        Alert.alert(
          t("worker.error"),
          error.message || t("worker.fetchProductsFailed")
        );
      } finally {
        setLoading(false);
      }
    },
    [t, limit]
  );

  useEffect(() => {
    fetchProducts(currentPage);
  }, [fetchProducts, currentPage]);

  const addToCart = (product) => {
    const price = parseFloat(product.price) || 0;
    const unit_type = price > 100 ? "grams" : "pieces";
    const initialQuantity = unit_type === "grams" ? 100 : 1;

    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      if (unit_type === "grams") {
        updateGrams(product.id, existingItem.grams + 100);
      } else {
        updateGrams(product.id, existingItem.grams + 1);
      }
    } else {
      setCart([
        ...cart,
        { ...product, grams: initialQuantity, unit_type },
      ]);
    }
    setIsCartModalVisible(true); // فتح المودال عند إضافة عنصر
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateGrams = (productId, newGrams) => {
    const item = cart.find((item) => item.id === productId);
    if (!item) return;

    const parsedGrams = item.unit_type === "pieces" ? parseInt(newGrams) : parseFloat(newGrams);
    if (isNaN(parsedGrams) || parsedGrams <= 0) {
      Alert.alert(t("common.error"), t("worker.invalidQuantity"));
      return;
    }
    if (item.unit_type === "pieces" && !Number.isInteger(parsedGrams)) {
      return; // منع إدخال أرقام غير صحيحة للمنتجات بالقطعة
    }

    setCart(
      cart.map((item) =>
        item.id === productId ? { ...item, grams: parsedGrams } : item
      )
    );
  };

  const getItemPrice = (item) => {
    if (item.unit_type === "pieces") {
      return item.grams * parseFloat(item.price);
    }
    return (item.grams / 1000) * parseFloat(item.price);
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + getItemPrice(item), 0);
  };

  const getCartItemCount = () => {
    return cart.length;
  };

  const getTranslatedProductName = (productName) =>
    productName || "Unknown Item";

  const getTranslatedProductDescription = () => "";

  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return {
      hot: products.hot.filter(
        (product) =>
          product.name &&
          typeof product.name === "string" &&
          product.name.toLowerCase().includes(query)
      ),
      cold: products.cold.filter(
        (product) =>
          product.name &&
          typeof product.name === "string" &&
          product.name.toLowerCase().includes(query)
      ),
      food: products.food.filter(
        (product) =>
          product.name &&
          typeof product.name === "string" &&
          product.name.toLowerCase().includes(query)
      ),
    };
  }, [products, searchQuery]);

  const renderIcon = (
    iconName,
    size = 24,
    color = isDark ? "#ffffff" : "#4e342e"
  ) => {
    const icons = {
      Coffee: <Coffee size={size} color={color} />,
      Snowflake: <Snowflake size={size} color={color} />,
      Utensils: <Utensils size={size} color={color} />,
      Clock: <Clock size={size} color={color} />,
      X: <X size={size} color={color} />,
      Send: <Send size={size} color={color} />,
      Search: <Search size={size} color={color} />,
      ChevronLeft: <ChevronLeft size={size} color={color} />,
      ChevronRight: <ChevronRight size={size} color={color} />,
      Plus: <Plus size={size} color={color} />,
      Minus: <Minus size={size} color={color} />,
      ShoppingCart: <ShoppingCart size={size} color={color} />,
    };
    return icons[iconName] || <Coffee size={size} color={color} />;
  };

  const placeOrder = async () => {
    console.log("بدء عملية إرسال الطلب...");
    if (!customerName || cart.length === 0) {
      Alert.alert(t("worker.error"), t("worker.enterCustomerAndItems"));
      console.log("خطأ في التحقق:", { customerName, cartLength: cart.length });
      return;
    }

    const invalidItems = cart.filter((item) => item.grams <= 0);
    if (invalidItems.length > 0) {
      Alert.alert(t("worker.error"), t("worker.invalidQuantity"));
      console.log("خطأ: كميات غير صالحة:", invalidItems);
      return;
    }

    const orderData = {
      customer_id: 10,
      branch_id: 1,
      user_id: 15,
      total_amount: getTotal().toFixed(2),
      payment_method: "cash",
      order_status: "pending",
      items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.unit_type === "pieces" ? item.grams : item.grams / 1000,
        unit_price: parseFloat(item.price),
        subtotal: getItemPrice(item).toFixed(2),
        unit_type: item.unit_type,
      })),
    };

    console.log("بيانات الطلب المرسلة:", JSON.stringify(orderData, null, 2));

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      console.log("التوكن المسترد:", token);

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
      console.log("استجابة الـ API:", JSON.stringify(result, null, 2));
      console.log("حالة الاستجابة:", response.status);

      if (response.ok) {
        Alert.alert(
          t("worker.success"),
          t("worker.orderPlaced"),
          [
            {
              text: t("worker.ok"),
              onPress: () => {
                setCart([]);
                setCustomerName("");
                setIsCartModalVisible(false);
                navigation.navigate("Orders"); // الرجوع إلى OrdersScreen
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        throw new Error(
          result.error || `خطأ ${response.status}: فشل إرسال الطلب`
        );
      }
    } catch (error) {
      console.error("خطأ أثناء إرسال الطلب:", error.message);
      Alert.alert(
        t("worker.error"),
        error.message.includes("SQLSTATE")
          ? t("worker.backendError")
          : error.message || t("worker.orderFailed")
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, totalPages]);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: isDark ? "#1a1a1a" : "#f7f3ef" },
    header: {
      paddingTop: 48,
      paddingBottom: 24,
      paddingHorizontal: 16,
      backgroundColor: isDark ? "#2d2d2d" : "#8d6e63",
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "bold",
      color: isDark ? "#ffffff" : "#fff",
      marginBottom: 8,
      textAlign: isRTL ? "right" : "left",
    },
    headerSubtitle: {
      color: isDark ? "rgba(255, 255, 255, 0.7)" : "#f0ebe7",
      fontSize: 18,
      textAlign: isRTL ? "right" : "left",
    },
    scrollContainer: { flex: 1, paddingHorizontal: 16 },
    section: { marginVertical: 24 },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: isDark ? "#ffffff" : "#4e342e",
      marginBottom: 12,
      textAlign: isRTL ? "right" : "left",
    },
    inputContainer: {
      backgroundColor: isDark ? "#2d2d2d" : "#fffaf5",
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: isDark ? "#3d3d3d" : "#e5d4c0",
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
    },
    textInput: {
      fontSize: 18,
      color: isDark ? "#ffffff" : "#4e342e",
      textAlign: isRTL ? "right" : "left",
      flex: 1,
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
      backgroundColor: isDark ? "#2d2d2d" : "#fffaf5",
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: isDark ? "#3d3d3d" : "#e5d4c0",
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
      backgroundColor: isDark ? "#3d3d3d" : "#e5d4c0",
    },
    productContent: { flex: 1 },
    productName: {
      fontSize: 16,
      fontWeight: "bold",
      color: isDark ? "#ffffff" : "#4e342e",
      marginBottom: 6,
      lineHeight: 20,
      textAlign: isRTL ? "right" : "left",
    },
    productDescription: {
      color: isDark ? "#aaaaaa" : "#6b4f42",
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
      color: isDark ? "#cccccc" : "#6d4c41",
      marginBottom: 4,
      textAlign: isRTL ? "right" : "left",
    },
    productTimeContainer: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
    },
    productTime: {
      fontSize: 11,
      color: isDark ? "#aaaaaa" : "#6b4f42",
      marginLeft: isRTL ? 0 : 3,
      marginRight: isRTL ? 3 : 0,
    },
    addButton: {
      backgroundColor: isDark ? "#4d4d4d" : "#8d6e63",
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    cartButton: {
      position: "absolute",
      top: 16,
      right: isRTL ? undefined : 16,
      left: isRTL ? 16 : undefined,
      backgroundColor: isDark ? "#4d4d4d" : "#8d6e63",
      padding: 12,
      borderRadius: 50,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 8,
    },
    cartItemCount: {
      backgroundColor: isDark ? "#3d3d3d" : "#d7bfa9",
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 16,
    },
    cartItemCountText: {
      color: isDark ? "#ffffff" : "#4e342e",
      fontWeight: "600",
      textAlign: "center",
    },
    modalContainer: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: isDark ? "#1a1a1a" : "#f7f3ef",
      borderRadius: 16,
      padding: 16,
      width: width - 32,
      maxHeight: height * 0.9,
    },
    closeModalButton: {
      position: "absolute",
      top: 8,
      right: isRTL ? undefined : 8,
      left: isRTL ? 8 : undefined,
      padding: 8,
    },
      quantityButton: {
      backgroundColor: isDark ? "#4d4d4d" : "#8d6e63",
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    cartTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: isDark ? "#ffffff" : "#4e342e",
      textAlign: isRTL ? "right" : "left",
      marginBottom: 16,
    },
    cartContainer: {
      backgroundColor: isDark ? "#2d2d2d" : "#fffaf5",
      borderRadius: 16,
      padding: 12,
      borderWidth: 1,
      borderColor: isDark ? "#3d3d3d" : "#e5d4c0",
    },
    cartItem: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "#3d3d3d" : "#e5d4c0",
    },
    cartItemDetails: { flex: 1 },
    cartItemName: {
      fontSize: 16,
      fontWeight: "600",
      color: isDark ? "#ffffff" : "#4e342e",
      textAlign: isRTL ? "right" : "left",
    },
    cartItemPrice: {
      color: isDark ? "#aaaaaa" : "#6b4f42",
      textAlign: isRTL ? "right" : "left",
      fontSize: 14,
    },
    cartItemActions: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 8,
    },
    gramsInput: {
      backgroundColor: isDark ? "#3d3d3d" : "#d7bfa9",
      width: 60,
      height: 40,
      borderRadius: 10,
      textAlign: "center",
      fontSize: 14,
      color: isDark ? "#ffffff" : "#4e342e",
    },
    removeButton: {
      backgroundColor: isDark ? "#4d4d4d" : "#8d6e63",
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    cartTotalSection: {
      marginTop: 16,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: isDark ? "#3d3d3d" : "#e5d4c0",
    },
    cartTotalRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    cartTotalLabel: {
      fontSize: 18,
      fontWeight: "600",
      color: isDark ? "#ffffff" : "#4e342e",
      textAlign: isRTL ? "right" : "left",
    },
    cartTotalAmount: {
      fontSize: 20,
      fontWeight: "bold",
      color: isDark ? "#cccccc" : "#6d4c41",
      textAlign: isRTL ? "right" : "left",
    },
    placeOrderButton: {
      backgroundColor: isDark ? "#4d4d4d" : "#8d6e63",
      padding: 16,
      borderRadius: 16,
    },
    placeOrderButtonContent: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    placeOrderButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    emptyCartText: {
      textAlign: "center",
      fontSize: 16,
      color: isDark ? "#aaaaaa" : "#6b4f42",
      marginVertical: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      minHeight: 200,
    },
    errorText: {
      textAlign: "center",
      fontSize: 16,
      color: isDark ? "#ff6666" : "#dc2626",
      marginVertical: 16,
    },
    paginationContainer: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 20,
      gap: 16,
    },
    paginationButton: {
      backgroundColor: isDark ? "#4d4d4d" : "#6d4c41",
      padding: 12,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    paginationButtonDisabled: {
      backgroundColor: isDark ? "#2d2d2d" : "#e5d4c0",
      opacity: 0.5,
    },
    paginationText: {
      fontSize: 16,
      fontWeight: "700",
      color: isDark ? "#ffffff" : "#4e342e",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("worker.newOrder")}</Text>
        <Text style={styles.headerSubtitle}>{t("worker.createNewOrder")}</Text>
        {cart.length > 0 && (
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => setIsCartModalVisible(true)}
          >
            {renderIcon("ShoppingCart", 24, "#fff")}
            <View style={styles.cartItemCount}>
              <Text style={styles.cartItemCountText}>
                {getCartItemCount()} {t("worker.items")}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.inputContainer}>
            {renderIcon("Search", 20, isDark ? "#ffffff" : "#6b4f42")}
            <TextInput
              style={styles.textInput}
              value={tempSearchQuery}
              onChangeText={handleSearchChange}
              placeholder={t("admin.searchProducts")}
              placeholderTextColor={isDark ? "#aaaaaa" : "#9CA3AF"}
            />
          </View>
        </View>
        <View style={styles.section}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="large"
                color={isDark ? "#ffffff" : "#8d6e63"}
              />
            </View>
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <>
              {filteredProducts.hot.length > 0 && (
                <View style={styles.categorySection}>
                  <Text style={styles.sectionTitle}>
                    {t("worker.peansTypes")} ({filteredProducts.hot.length})
                  </Text>
                  <View
                    style={[
                      styles.productsContainer,
                      isRTL && styles.productsContainerRTL,
                    ]}
                  >
                    {filteredProducts.hot.map((product) => (
                      <View key={product.id} style={styles.productCard}>
                        <View style={styles.productHeader}>
                          <View style={styles.productImageContainer}>
                            {renderIcon(
                              "Coffee",
                              28,
                              isDark ? "#ffffff" : "#4e342e"
                            )}
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
                                ${parseFloat(product.price).toFixed(2)}/
                                {parseFloat(product.price) > 100 ? "kg" : "piece"}
                              </Text>
                              <View style={styles.productTimeContainer}>
                                {renderIcon(
                                  "Clock",
                                  12,
                                  isDark ? "#aaaaaa" : "#6b4f42"
                                )}
                                <Text style={styles.productTime}>2 min</Text>
                              </View>
                            </View>
                            <TouchableOpacity
                              style={styles.addButton}
                              onPress={() =>
                                addToCart({
                                  id: product.id,
                                  name: product.name || "Unknown Item",
                                  price: parseFloat(product.price) || 0,
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
              {filteredProducts.cold.length > 0 && (
                <View style={styles.categorySection}>
                  <Text style={styles.sectionTitle}>
                    {t("worker.Drinks")} ({filteredProducts.cold.length})
                  </Text>
                  <View
                    style={[
                      styles.productsContainer,
                      isRTL && styles.productsContainerRTL,
                    ]}
                  >
                    {filteredProducts.cold.map((product) => (
                      <View key={product.id} style={styles.productCard}>
                        <View style={styles.productHeader}>
                          <View style={styles.productImageContainer}>
                            {renderIcon(
                              "Snowflake",
                              28,
                              isDark ? "#ffffff" : "#4e342e"
                            )}
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
                                ${parseFloat(product.price).toFixed(2)}/
                                {parseFloat(product.price) > 100 ? "kg" : "piece"}
                              </Text>
                              <View style={styles.productTimeContainer}>
                                {renderIcon(
                                  "Clock",
                                  12,
                                  isDark ? "#aaaaaa" : "#6b4f42"
                                )}
                                <Text style={styles.productTime}>2 min</Text>
                              </View>
                            </View>
                            <TouchableOpacity
                              style={styles.addButton}
                              onPress={() =>
                                addToCart({
                                  id: product.id,
                                  name: product.name || "Unknown Item",
                                  price: parseFloat(product.price) || 0,
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
              {filteredProducts.food.length > 0 && (
                <View style={styles.categorySection}>
                  <Text style={styles.sectionTitle}>
                    {t("worker.foodItems")} ({filteredProducts.food.length})
                  </Text>
                  <View
                    style={[
                      styles.productsContainer,
                      isRTL && styles.productsContainerRTL,
                    ]}
                  >
                    {filteredProducts.food.map((product) => (
                      <View key={product.id} style={styles.productCard}>
                        <View style={styles.productHeader}>
                          <View style={styles.productImageContainer}>
                            {renderIcon(
                              "Utensils",
                              28,
                              isDark ? "#ffffff" : "#4e342e"
                            )}
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
                                ${parseFloat(product.price).toFixed(2)}/
                                {parseFloat(product.price) > 100 ? "kg" : "piece"}
                              </Text>
                              <View style={styles.productTimeContainer}>
                                {renderIcon(
                                  "Clock",
                                  12,
                                  isDark ? "#aaaaaa" : "#6b4f42"
                                )}
                                <Text style={styles.productTime}>2 min</Text>
                              </View>
                            </View>
                            <TouchableOpacity
                              style={styles.addButton}
                              onPress={() =>
                                addToCart({
                                  id: product.id,
                                  name: product.name || "Unknown Item",
                                  price: parseFloat(product.price) || 0,
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
              <View style={styles.paginationContainer}>
                <TouchableOpacity
                  style={[
                    styles.paginationButton,
                    currentPage === 1 && styles.paginationButtonDisabled,
                  ]}
                  onPress={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  {renderIcon("ChevronLeft", 20, "#fff")}
                </TouchableOpacity>
                <Text style={styles.paginationText}>
                  {t("worker.page")} {currentPage} {t("worker.of")}{" "}
                  {totalPages}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.paginationButton,
                    currentPage === totalPages &&
                      styles.paginationButtonDisabled,
                  ]}
                  onPress={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  {renderIcon("ChevronRight", 20, "#fff")}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={isCartModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsCartModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setIsCartModalVisible(false)}
            >
              {renderIcon("X", 24, isDark ? "#ffffff" : "#4e342e")}
            </TouchableOpacity>
            <Text style={styles.cartTitle}>{t("worker.orderCart")}</Text>
            {cart.length === 0 ? (
              <Text style={styles.emptyCartText}>{t("worker.emptyCart")}</Text>
            ) : (
              <ScrollView style={styles.cartContainer}>
                {cart.map((item) => (
                  <View key={item.id} style={styles.cartItem}>
                    <View style={styles.cartItemDetails}>
                      <Text style={styles.cartItemName}>
                        {getTranslatedProductName(item.name)}
                      </Text>
                      <Text style={styles.cartItemPrice}>
                        ${parseFloat(item.price).toFixed(2)}/
                        {item.unit_type === "grams" ? "kg" : "piece"} - $
                        {getItemPrice(item).toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.cartItemActions}>
                      <TextInput
                        style={styles.gramsInput}
                        value={item.grams.toString()}
                        onChangeText={(text) => {
                          const grams = item.unit_type === "pieces" ? parseInt(text) : parseFloat(text);
                          updateGrams(item.id, grams);
                        }}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor={isDark ? "#aaaaaa" : "#9CA3AF"}
                      />
                      {item.unit_type === "pieces" && (
                        <>
                          <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => updateGrams(item.id, item.grams - 1)}
                            disabled={item.grams <= 1}
                          >
                            {renderIcon("Minus", 16, "#fff")}
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => updateGrams(item.id, item.grams + 1)}
                          >
                            {renderIcon("Plus", 16, "#fff")}
                          </TouchableOpacity>
                        </>
                      )}
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeFromCart(item.id)}
                      >
                        {renderIcon("X", 20, "#fff")}
                      </TouchableOpacity>
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
                    disabled={loading}
                  >
                    <View style={styles.placeOrderButtonContent}>
                      {loading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <>
                          {renderIcon("Send", 20, "#fff")}
                          <Text style={styles.placeOrderButtonText}>
                            {t("worker.placeOrder")}
                          </Text>
                        </>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default NewOrderScreen;