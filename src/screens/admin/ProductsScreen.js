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
  Switch,
  ActivityIndicator,
  Image,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  Coffee,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Package,
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Star,
  Users,
  Grid,
  List,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const BASE_URL = "http://api-coffee.m-zedan.com/api";

const ProductsScreen = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useSelector((state) => state.language);
  const isRTL = currentLanguage === "ar";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [formVisible, setFormVisible] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("hot");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [barcode, setBarcode] = useState("");
  const [acceptFloat, setAcceptFloat] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [nameError, setNameError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [stockError, setStockError] = useState("");
  const [barcodeError, setBarcodeError] = useState("");
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [error, setError] = useState(null);

  const categories = [
    { id: "all", name: t("admin.allProducts") || "جميع المنتجات" },
    { id: "1", name: t("admin.hotDrinks") || "مشروبات ساخنة" },
    { id: "2", name: t("admin.beans") || "بن" },
    { id: "3", name: t("admin.food") || "طعام" },
    { id: "4", name: t("admin.snacks") || "وجبات خفيفة" },
  ];



  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("authToken");
        console.log("Retrieved Token for Fetch Products:", token);
        if (!token) {
          throw new Error(t("admin.noToken") || "لم يتم العثور على التوكين");
        }

        const response = await fetch(
          `${BASE_URL}/admin/products?page=${currentPage}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        console.log("Fetch Products API Response Status:", response.status);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          if (response.status === 401) {
            throw new Error(
              t("admin.unauthorized") || "التوكين غير صالح أو منتهي"
            );
          }
          throw new Error(
            errorData.message ||
              t("admin.fetchProductsError") ||
              `فشل في جلب المنتجات (Status: ${response.status})`
          );
        }

        const data = await response.json();
        console.log("Fetch Products API Response:", data);

        const mappedProducts = data.data.map((product) => ({
          id: product.id || Date.now(),
          name: product.name || "منتج بدون اسم",
          category_id: product.category_id || "1",
          category:
            product.category?.name ||
            (product.category_id === "1"
              ? "مشروب"
              : product.category_id === "2"
                ? "بن"
                : "طعام"),
          price: parseFloat(product.price) || 0,
          description: product.description || product.name || "لا يوجد وصف",
          stock: product.stock || "0",
          barcode: product.barcode || "",
          accept_float: product.accept_float || false,
          active: product.active || false,
          rating: product.rating || 0,
          sales: product.sales || 0,
          image:
            product.image_url ||
            (product.category_id === "1" || product.category_id === "2"
              ? "☕"
              : "🥐"),
        }));

        setProducts(mappedProducts);
        setTotalPages(data.last_page || 1);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err.message);
        setError(err.message);
        Alert.alert(t("common.error") || "خطأ", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, t]);

  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === "all" ||
        product.category_id === selectedCategory) &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryIcon = (categoryId) => {
    if (categoryId === "1" || categoryId === "2") {
      return "Coffee";
    } else if (categoryId === "3" || categoryId === "4") {
      return "Package";
    }
    return "Coffee";
  };

  const renderIcon = (iconName, size = 24, color = "#4e342e") => {
    switch (iconName) {
      case "Coffee":
        return <Coffee size={size} color={color} />;
      case "Search":
        return <Search size={size} color={color} />;
      case "Filter":
        return <Filter size={size} color={color} />;
      case "Plus":
        return <Plus size={size} color={color} />;
      case "Edit":
        return <Edit size={size} color={color} />;
      case "Trash2":
        return <Trash2 size={size} color={color} />;
      case "DollarSign":
        return <DollarSign size={size} color={color} />;
      case "Package":
        return <Package size={size} color={color} />;
      case "CheckCircle":
        return <CheckCircle size={size} color={color} />;
      case "XCircle":
        return <XCircle size={size} color={color} />;
      case "ChevronRight":
        return <ChevronRight size={size} color={color} />;
      case "ChevronLeft":
        return <ChevronLeft size={size} color={color} />;
      case "Calendar":
        return <Calendar size={size} color={color} />;
      case "Star":
        return <Star size={size} color={color} />;
      case "Users":
        return <Users size={size} color={color} />;
      case "Grid":
        return <Grid size={size} color={color} />;
      case "List":
        return <List size={size} color={color} />;
      default:
        return null;
    }
  };

  async function handleAddProduct() {
    console.log("Add/Edit Product button pressed!");
    let hasError = false;
    setNameError("");
    setPriceError("");
    setStockError("");
    setBarcodeError("");

    if (!name.trim()) {
  setNameError("name is required" || "يجب إدخال اسم المنتج");
  hasError = true;
} else if (name.trim().length < 3) {
  setNameError("name must be at least 3 characters long" || "اسم المنتج يجب أن يكون 3 أحرف على الأقل");
  hasError = true;
} else if (/^[0-9\s]+$/.test(name)) {
  setNameError("name cannot be only numbers" || "اسم المنتج لا يمكن أن يكون أرقام فقط");
  hasError = true;
} else if (!/^[\u0600-\u06FFa-zA-Z0-9\s\-()]+$/.test(name)) {
  setNameError("name contains invalid characters" || "اسم المنتج يحتوي على رموز غير مسموح بها");
  hasError = true;
} else {
  setNameError("");
}


    if (!price) {
  setPriceError("price is required" || "السعر مطلوب");
  hasError = true;
} else if (isNaN(price)) {
  setPriceError("price must be a valid number" || "السعر يجب أن يكون رقمًا صالحًا");
  hasError = true;
} else if (parseFloat(price) <= 0) {
  setPriceError("price must be a positive number" || "السعر يجب أن يكون رقمًا موجبًا");
  hasError = true;
} else {
  setPriceError(""); // مفيش أخطاء
}


   if (!stock) {
  setStockError("stock is required" || "المخزون مطلوب");
  hasError = true;
} else if (isNaN(stock)) {
  setStockError("stock must be a valid number" || "المخزون يجب أن يكون رقمًا صحيحًا");
  hasError = true;
} else if (parseFloat(stock) < 0) {
  setStockError("stock must be a positive number" || "المخزون يجب أن يكون رقمًا موجبًا");
  hasError = true;
} else {
  setStockError(""); // لا يوجد خطأ
}

    if (!barcode.trim()) {
  setBarcodeError("barcode is required" || "يجب إدخال الباركود");
  hasError = true;
} else if (!/^[0-9]{8,14}$/.test(barcode)) {
  setBarcodeError("barcode must be between 8 and 14 digits" || "الباركود يجب أن يكون من 8 إلى 14 رقمًا");
  hasError = true;
} else {
  setBarcodeError("");
}


    if (hasError) {
      console.log("Validation Error:", { name, price, stock, barcode });
      return;
    }

    try {
      const token = await AsyncStorage.getItem("authToken");
      console.log("Retrieved Token for Add/Edit Product:", token);
      if (!token) {
        throw new Error(t("admin.noToken") || "لم يتم العثور على التوكين");
      }

      const categoryMap = {
        hot: "1",
        cold: "2",
        food: "3",
        snacks: "4",
        بن: "2",
      };
      const categoryId = categoryMap[category.toLowerCase()] || "1";

      const productData = {
        name: name.trim(),
        description: description.trim() || name.trim(),
        price: parseFloat(price).toFixed(2),
        category_id: categoryId,
        branch_id: null,
        stock: parseFloat(stock).toFixed(2),
        type: "unit",
        barcode: barcode.trim(),
        accept_float: acceptFloat,
      };

      console.log("Product Data being sent:", productData);

      const endpoint = isEditing
        ? `${BASE_URL}/admin/products/${editProductId}`
        : `${BASE_URL}/admin/products`;

      const response = await fetch(endpoint, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(productData),
      });

      console.log("Add/Edit Product API Response Status:", response.status);
      const result = await response.json();
      console.log("Add/Edit Product API Response:", result);

      if (!response.ok) {
        if (response.status === 422) {
          const errorDetails = result.errors
            ? Object.entries(result.errors)
                .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
                .join("; ")
            : result.message || "البيانات المرسلة غير صالحة";
          throw new Error(`خطأ 422: ${errorDetails}`);
        }
        throw new Error(
          result.message ||
            t("admin.saveProductError") ||
            `فشل في حفظ المنتج (Status: ${response.status})`
        );
      }

      if (isEditing) {
        setProducts(
          products.map((item) =>
            item.id === editProductId
              ? {
                  ...item,
                  name: name.trim(),
                  category_id: categoryId,
                  category:
                    categoryId === "1"
                      ? "مشروب"
                      : categoryId === "2"
                        ? "بن"
                        : category,
                  price: parseFloat(price),
                  description: description.trim() || name.trim(),
                  stock: parseFloat(stock).toFixed(2),
                  barcode: barcode.trim(),
                  accept_float: acceptFloat,
                  active: parseFloat(stock) > 0,
                }
              : item
          )
        );
        Alert.alert(
          t("admin.editProduct") || "تعديل المنتج",
          t("admin.productUpdated") || "تم تعديل المنتج بنجاح!"
        );
      } else {
        setProducts([
          ...products,
          {
            id: result.id || Date.now(),
            name: name.trim(),
            category_id: categoryId,
            category:
              categoryId === "1"
                ? "مشروب"
                : categoryId === "2"
                  ? "بن"
                  : category,
            price: parseFloat(price),
            description: description.trim() || name.trim(),
            stock: parseFloat(stock).toFixed(2),
            barcode: barcode.trim(),
            accept_float: acceptFloat,
            active: parseFloat(stock) > 0,
            sales: 0,
            rating: 0,
            image: categoryId === "1" || categoryId === "2" ? "☕" : "🥐",
          },
        ]);
        Alert.alert(
          t("admin.addProduct") || "إضافة منتج",
          t("admin.addProductMessage") || "تم إضافة المنتج بنجاح!"
        );
      }

      setFormVisible(false);
      setName("");
      setPrice("");
      setCategory("hot");
      setDescription("");
      setStock("");
      setBarcode("");
      setAcceptFloat(true);
      setIsEditing(false);
      setEditProductId(null);
    } catch (err) {
      console.error("Error adding/editing product:", err.message);
      Alert.alert(
        t("common.error") || "خطأ",
        err.message || t("admin.saveProductError") || "فشل في حفظ المنتج"
      );
    }
  }

  const handleEditProduct = (product) => {
    console.log("Edit Product button pressed for:", product.id);
  if (!validateForm()) return;


    setName(product.name);
    setCategory(
      product.category_id === "1"
        ? "hot"
        : product.category_id === "2"
          ? "بن"
          : product.category
    );
    setPrice(product.price.toString());
    setDescription(product.description);
    setStock(product.stock.toString());
    setBarcode(product.barcode);
    setAcceptFloat(product.accept_float);
    setFormVisible(true);
    setIsEditing(true);
    setEditProductId(product.id);
  };

  const handleDeleteProduct = async (product) => {
    console.log("Delete Product button pressed for:", product.id);
    Alert.alert(
      t("admin.deleteProduct") || "حذف المنتج",
      t("admin.deleteProductConfirm") || "هل أنت متأكد من حذف المنتج؟",
      [
        {
          text: t("common.cancel") || "إلغاء",
          style: "cancel",
        },
        {
          text: t("common.delete") || "حذف",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("authToken");
              console.log("Retrieved Token for Delete Product:", token);
              if (!token) {
                throw new Error(
                  t("admin.noToken") || "لم يتم العثور على التوكين"
                );
              }

              const response = await fetch(
                `${BASE_URL}/admin/products/${product.id}`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                  },
                }
              );

              console.log(
                "Delete Product API Response Status:",
                response.status
              );
              const result = await response.json().catch(() => ({}));
              console.log("Delete Product API Response:", result);

              if (!response.ok) {
                throw new Error(
                  result.message ||
                    t("admin.deleteProductError") ||
                    `فشل في حذف المنتج (Status: ${response.status})`
                );
              }

              setProducts(products.filter((p) => p.id !== product.id));
              Alert.alert(
                t("admin.deleteProduct") || "حذف المنتج",
                t("admin.deleteProductSuccess") || "تم حذف المنتج بنجاح"
              );
            } catch (err) {
              console.error("Error deleting product:", err.message);
              Alert.alert(
                t("common.error") || "خطأ",
                err.message || t("admin.deleteProductError")
              );
            }
          },
        },
      ]
    );
  };

  const handleToggleAvailability = async (product) => {
    console.log("Toggle Availability button pressed for:", product.id);
    try {
      const token = await AsyncStorage.getItem("authToken");
      console.log("Retrieved Token for Toggle Availability:", token);
      if (!token) {
        throw new Error(t("admin.noToken") || "لم يتم العثور على التوكين");
      }

      const newStock = parseFloat(product.stock) > 0 ? "0.00" : "1.00";
      const response = await fetch(`${BASE_URL}/admin/products/${product.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          stock: newStock,
        }),
      });

      console.log("Toggle Availability API Response Status:", response.status);
      const result = await response.json().catch(() => ({}));
      console.log("Toggle Availability API Response:", result);

      if (!response.ok) {
        throw new Error(
          result.message ||
            t("admin.updateStockError") ||
            `فشل في تحديث المخزون (Status: ${response.status})`
        );
      }

      setProducts(
        products.map((p) =>
          p.id === product.id
            ? { ...p, stock: newStock, active: parseFloat(newStock) > 0 }
            : p
        )
      );
    } catch (err) {
      console.error("Error toggling availability:", err.message);
      Alert.alert(
        t("common.error") || "خطأ",
        err.message || t("admin.updateStockError")
      );
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderProductCard = (product) => {
    const isImageUrl = product.image?.startsWith("http");
    const isAvailable = product.active && parseFloat(product.stock) > 0;

    return (
      <View>
        {viewMode === "grid" ? (
          <TouchableOpacity key={product.id} style={styles.gridCard}>
            <View style={styles.gridCardHeader}>
              {isImageUrl ? (
                <Image
                  source={{ uri: product.image }}
                  style={{ width: 32, height: 32 }}
                  resizeMode="contain"
                />
              ) : (
                <Text style={styles.productEmoji}>
                  {product.category_id === "1" || product.category_id === "2"
                    ? "☕"
                    : "🥐"}
                </Text>
              )}
              <View
                style={[
                  styles.gridCardBadge,
                  isAvailable
                    ? styles.gridCardBadgeAvailable
                    : styles.gridCardBadgeUnavailable,
                ]}
              >
                <Text
                  style={[
                    styles.gridCardBadgeText,
                    isAvailable
                      ? styles.gridCardBadgeTextAvailable
                      : styles.gridCardBadgeTextUnavailable,
                  ]}
                >
                  {isAvailable
                    ? t("admin.available") || "متوفر"
                    : t("admin.unavailable") || "غير متوفر"}
                </Text>
              </View>
            </View>
            <View style={styles.gridCardContent}>
              <Text style={styles.gridCardName}>{product.name}</Text>
              <Text style={styles.gridCardDescription} numberOfLines={2}>
                {product.description}
              </Text>
              <View style={styles.gridCardPrice}>
                <Text style={styles.gridCardPriceText}>
                  ${parseFloat(product.price).toFixed(2)}
                </Text>
              </View>
              <View style={styles.gridCardStats}>
                <View style={styles.gridCardStat}>
                  <Text style={styles.gridCardStatLabel}>
                    {t("admin.stock") || "المخزون"}
                  </Text>
                  <Text
                    style={[
                      styles.gridCardStatValue,
                      parseFloat(product.stock) === 0 && styles.stockEmptyText,
                    ]}
                  >
                    {product.stock}
                  </Text>
                </View>
                <View style={styles.gridCardStat}>
                  <Text style={styles.gridCardStatLabel}>
                    {t("admin.rating") || "التقييم"}
                  </Text>
                  <Text style={styles.gridCardStatValue}>{product.rating}</Text>
                </View>
              </View>
            </View>
            <View style={styles.gridCardActions}>
              <TouchableOpacity
                style={[styles.gridActionButton, styles.editGridButton]}
                onPress={() => handleEditProduct(product)}
              >
                {renderIcon("Edit", 16, "#fff")}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.gridActionButton, styles.deleteGridButton]}
                onPress={() => handleDeleteProduct(product)}
              >
                {renderIcon("Trash2", 16, "#fff")}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ) : (
          <View key={product.id} style={styles.listCard}>
            <View style={styles.listCardHeader}>
              <View style={styles.listCardLeft}>
                {isImageUrl ? (
                  <Image
                    source={{ uri: product.image }}
                    style={{
                      width: 40,
                      height: 40,
                      marginRight: isRTL ? 0 : 16,
                      marginLeft: isRTL ? 16 : 0,
                    }}
                    resizeMode="contain"
                  />
                ) : (
                  <Text style={styles.listProductEmoji}>
                    {product.category_id === "1" || product.category_id === "2"
                      ? "☕"
                      : "🥐"}
                  </Text>
                )}
                <View style={styles.listCardInfo}>
                  <Text style={styles.listCardName}>{product.name}</Text>
                  <Text style={styles.listCardDescription}>
                    {product.description}
                  </Text>
                </View>
              </View>
              <View style={styles.listCardRight}>
                <View style={styles.listCardPrice}>
                  <Text style={styles.listCardPriceText}>
                    ${parseFloat(product.price).toFixed(2)}
                  </Text>
                </View>
                <Switch
                  value={isAvailable}
                  onValueChange={() => handleToggleAvailability(product)}
                  trackColor={{ false: "#e0e0e0", true: "#4CAF50" }}
                  thumbColor={isAvailable ? "#fff" : "#f4f3f4"}
                />
              </View>
            </View>
            <View style={styles.listCardDetails}>
              <View style={styles.listCardStat}>
                <Text style={styles.listCardStatLabel}>
                  {t("admin.stock") || "المخزون"}
                </Text>
                <Text
                  style={[
                    styles.listCardStatValue,
                    parseFloat(product.stock) === 0 && styles.stockEmptyText,
                  ]}
                >
                  {product.stock} {t("admin.units") || "وحدة"}
                </Text>
              </View>
              <View style={styles.listCardStat}>
                <Text style={styles.listCardStatLabel}>
                  {t("admin.rating") || "التقييم"}
                </Text>
                <Text style={styles.listCardStatValue}>
                  {product.rating}/5.0
                </Text>
              </View>
              <View style={styles.listCardStat}>
                <Text style={styles.listCardStatLabel}>
                  {t("admin.sales") || "المبيعات"}
                </Text>
                <Text style={styles.listCardStatValue}>
                  {product.sales} {t("admin.orders") || "طلب"}
                </Text>
              </View>
            </View>
            <View style={styles.listCardActions}>
              <TouchableOpacity
                style={[styles.listActionButton, styles.editListButton]}
                onPress={() => handleEditProduct(product)}
              >
                {renderIcon("Edit", 16, "#fff")}
                <Text style={[styles.listActionText, styles.editListText]}>
                  {t("common.edit") || "تعديل"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.listActionButton, styles.deleteListButton]}
                onPress={() => handleDeleteProduct(product)}
              >
                {renderIcon("Trash2", 16, "#fff")}
                <Text style={[styles.listActionText, styles.deleteListText]}>
                  {t("common.delete") || "حذف"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f7f3ef",
    },
    header: {
      paddingTop: 60,
      paddingBottom: 28,
      paddingHorizontal: 20,
      backgroundColor: "#8d6e63",
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      elevation: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    headerTitle: {
      fontSize: 32,
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
    scrollContainer: {
      flex: 1,
      paddingHorizontal: 16,
    },
    searchContainer: {
      marginVertical: 20,
    },
    searchInputContainer: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      backgroundColor: "#fffaf5",
      borderRadius: 20,
      borderWidth: 2,
      borderColor: "#e5d4c0",
      paddingHorizontal: 20,
      paddingVertical: 8,
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      minHeight: 56,
    },
    searchTextInput: {
      flex: 1,
      fontSize: 17,
      color: "#4e342e",
      textAlign: isRTL ? "right" : "left",
      paddingVertical: 6,
      fontWeight: "500",
    },
    filterContainer: {
      marginBottom: 20,
    },
    filterHeader: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    filterTitle: {
      fontSize: 19,
      fontWeight: "700",
      color: "#4e342e",
      marginBottom: 16,
      textAlign: isRTL ? "right" : "left",
      letterSpacing: 0.3,
    },
    viewModeContainer: {
      flexDirection: isRTL ? "row-reverse" : "row",
      backgroundColor: "#fffaf5",
      borderRadius: 12,
      padding: 4,
      elevation: 3,
    },
    viewModeButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
    },
    viewModeButtonActive: {
      backgroundColor: "#8d6e63",
    },
    viewModeButtonInactive: {
      backgroundColor: "transparent",
    },
    filterButtonsContainer: {
      flexDirection: isRTL ? "row-reverse" : "row",
      gap: 10,
    },
    filterButton: {
      flex: 1,
      paddingVertical: 14,
      paddingHorizontal: 20,
      alignItems: "center",
      borderRadius: 16,
      borderWidth: 2,
      borderColor: "#e5d4c0",
      minHeight: 48,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      flexDirection: isRTL ? "row-reverse" : "row",
    },
    filterButtonActive: {
      backgroundColor: "#8d6e63",
      borderColor: "#8d6e63",
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    filterButtonInactive: {
      backgroundColor: "#fffaf5",
      borderColor: "#e5d4c0",
    },
    filterButtonText: {
      fontSize: 14,
      fontWeight: "600",
      marginRight: isRTL ? 0 : 8,
      marginLeft: isRTL ? 8 : 0,
    },
    filterButtonTextActive: {
      color: "#fff",
    },
    filterButtonTextInactive: {
      color: "#4e342e",
    },
    addButton: {
      backgroundColor: "#8d6e63",
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 16,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
      elevation: 4,
    },
    addButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
      marginRight: isRTL ? 0 : 8,
      marginLeft: isRTL ? 8 : 0,
    },
    productsContainer: {
      flex: 1,
    },
    gridContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 16,
    },
    listContainer: {
      gap: 16,
    },
    gridCard: {
      width: (width - 48) / 2,
      backgroundColor: "#fffaf5",
      borderRadius: 20,
      padding: 16,
      elevation: 4,
      borderWidth: 1,
      borderColor: "#e5d4c0",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
    },
    gridCardHeader: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    productEmoji: {
      fontSize: 32,
    },
    gridCardBadgeAvailable: {
      backgroundColor: "#e8f5e8",
      padding: 12,
      borderRadius: 5,
    },
    gridCardBadgeUnavailable: {
      backgroundColor: "#fdecea",
      padding: 12,
      borderRadius: 5,
    },
    gridCardBadgeTextAvailable: {
      color: "#27ae60",
    },
    gridCardBadgeTextUnavailable: {
      color: "#c0392b",
    },
    gridCardContent: {
      flex: 1,
    },
    gridCardName: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#4e342e",
      marginBottom: 6,
      textAlign: isRTL ? "right" : "left",
    },
    gridCardDescription: {
      fontSize: 12,
      color: "#6b4f42",
      textAlign: isRTL ? "right" : "left",
      lineHeight: 16,
      marginBottom: 12,
    },
    gridCardPrice: {
      backgroundColor: "#e8f5e8",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 15,
      alignSelf: "flex-start",
      marginBottom: 12,
      borderWidth: 2,
      borderColor: "#4caf50",
    },
    gridCardPriceText: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#2e7d32",
    },
    gridCardStats: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    gridCardStat: {
      alignItems: "center",
    },
    gridCardStatLabel: {
      fontSize: 10,
      color: "#8d6e63",
      fontWeight: "500",
    },
    gridCardStatValue: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#4e342e",
    },
    stockEmptyText: {
      color: "#f44336",
    },
    gridCardActions: {
      flexDirection: isRTL ? "row-reverse" : "row",
      gap: 8,
    },
    gridActionButton: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    editGridButton: {
      backgroundColor: "#2196F3",
    },
    deleteGridButton: {
      backgroundColor: "#f44336",
    },
    listCard: {
      backgroundColor: "#fffaf5",
      borderRadius: 20,
      padding: 20,
      elevation: 4,
      borderWidth: 1,
      borderColor: "#e5d4c0",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
    },
    listCardHeader: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    listCardLeft: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      flex: 1,
    },
    listProductEmoji: {
      fontSize: 40,
      marginRight: isRTL ? 0 : 16,
      marginLeft: isRTL ? 16 : 0,
    },
    listCardInfo: {
      flex: 1,
    },
    listCardName: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#4e342e",
      marginBottom: 4,
      textAlign: isRTL ? "right" : "left",
    },
    listCardDescription: {
      fontSize: 14,
      color: "#6b4f42",
      textAlign: isRTL ? "right" : "left",
    },
    listCardRight: {
      alignItems: "flex-end",
    },
    listCardPrice: {
      backgroundColor: "#e8f5e8",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginBottom: 12,
      borderWidth: 2,
      borderColor: "#4caf50",
    },
    listCardPriceText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#2e7d32",
    },
    listCardDetails: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-around",
      backgroundColor: "#f7f3ef",
      borderRadius: 15,
      padding: 16,
      marginBottom: 16,
    },
    listCardStat: {
      alignItems: "center",
    },
    listCardStatLabel: {
      fontSize: 12,
      color: "#8d6e63",
      fontWeight: "500",
      marginBottom: 4,
    },
    listCardStatValue: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#4e342e",
    },
    listCardActions: {
      flexDirection: isRTL ? "row-reverse" : "row",
      gap: 12,
    },
    listActionButton: {
      flex: 1,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      borderRadius: 15,
    },
    editListButton: {
      backgroundColor: "#2196F3",
    },
    deleteListButton: {
      backgroundColor: "#f44336",
    },
    listActionText: {
      fontSize: 14,
      fontWeight: "600",
      marginRight: isRTL ? 0 : 6,
      marginLeft: isRTL ? 6 : 0,
    },
    editListText: {
      color: "#fff",
    },
    deleteListText: {
      color: "#fff",
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 60,
    },
    emptyStateText: {
      fontSize: 16,
      color: "#6b4f42",
      textAlign: "center",
    },
    inputField: {
      backgroundColor: "#fff",
      borderWidth: 1,
      borderColor: "#ddd",
      padding: 12,
      borderRadius: 10,
      fontSize: 16,
      color: "#4e342e",
      marginBottom: 12,
    },
    paginationContainer: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 20,
    },
    paginationButton: {
      backgroundColor: "#8d6e63",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 12,
      opacity: 1,
    },
    paginationButtonDisabled: {
      opacity: 0.5,
    },
    pageInfo: {
      fontSize: 16,
      color: "#4e342e",
      fontWeight: "500",
    },
    errorText: {
  color: "red",
  fontSize: 12,
  marginLeft: 7,
  marginBottom: 8,
},
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {t("admin.productsManagement") || "إدارة المنتجات"}
        </Text>
        <Text style={styles.headerSubtitle}>
          {t("admin.productsSubtitle") || "إدارة قائمة المنتجات"}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            {renderIcon("Search", 20, "#6b4f42")}
            <TextInput
              style={styles.searchTextInput}
              placeholder={t("admin.searchProducts") || "ابحث عن المنتجات"}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#8d6e63"
            />
          </View>
        </View>

        <View style={styles.filterContainer}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>
              {t("admin.filterByCategory") || "تصفية حسب الفئة"}
            </Text>
            <View style={styles.viewModeContainer}>
              <TouchableOpacity
                style={[
                  styles.viewModeButton,
                  viewMode === "grid"
                    ? styles.viewModeButtonActive
                    : styles.viewModeButtonInactive,
                ]}
                onPress={() => setViewMode("grid")}
              >
                {renderIcon(
                  "Grid",
                  20,
                  viewMode === "grid" ? "#fff" : "#7f8c8d"
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.viewModeButton,
                  viewMode === "list"
                    ? styles.viewModeButtonActive
                    : styles.viewModeButtonInactive,
                ]}
                onPress={() => setViewMode("list")}
              >
                {renderIcon(
                  "List",
                  20,
                  viewMode === "list" ? "#fff" : "#7f8c8d"
                )}
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterButtonsContainer}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.filterButton,
                  selectedCategory === cat.id
                    ? styles.filterButtonActive
                    : styles.filterButtonInactive,
                ]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                {renderIcon(
                  getCategoryIcon(cat.id),
                  18,
                  selectedCategory === cat.id ? "#fff" : "#2c3e50"
                )}
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedCategory === cat.id
                      ? styles.filterButtonTextActive
                      : styles.filterButtonTextInactive,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setFormVisible(true)}
        >
          {renderIcon("Plus", 22, "#fff")}
          <Text style={styles.addButtonText}>
            {t("admin.addNewProduct") || "إضافة منتج جديد"}
          </Text>
        </TouchableOpacity>

        <View style={styles.productsContainer}>
          {loading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator size="large" color="#8d6e63" />
              <Text style={styles.emptyStateText}>
                {t("admin.loading") || "جاري التحميل..."}
              </Text>
            </View>
          ) : error ? (
            <View style={styles.emptyState}>
              <Text style={{ fontSize: 64 }}>❌</Text>
              <Text style={styles.emptyStateText}>{error}</Text>
            </View>
          ) : filteredProducts.length > 0 ? (
            viewMode === "grid" ? (
              <View style={styles.gridContainer}>
                {filteredProducts.map((product) => (
                  <View key={product.id}>{renderProductCard(product)}</View>
                ))}
              </View>
            ) : (
              <View style={styles.listContainer}>
                {filteredProducts.map(renderProductCard)}
              </View>
            )
          ) : (
            <View style={styles.emptyState}>
              <Text style={{ fontSize: 64 }}>☕</Text>
              <Text style={styles.emptyStateText}>
                {t("admin.noProductsFound") || "لم يتم العثور على منتجات"}
              </Text>
            </View>
          )}
        </View>

        {totalPages > 1 && (
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[
                styles.paginationButton,
                currentPage === 1 && styles.paginationButtonDisabled,
              ]}
              onPress={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              {renderIcon("ChevronLeft", 20, "#fff")}
            </TouchableOpacity>
            <Text style={styles.pageInfo}>
              {t("worker.page") || "الصفحة"} {currentPage}{" "}
              {t("worker.of") || "من"} {totalPages}
            </Text>
            <TouchableOpacity
              style={[
                styles.paginationButton,
                currentPage === totalPages && styles.paginationButtonDisabled,
              ]}
              onPress={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              {renderIcon("ChevronRight", 20, "#fff")}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {formVisible && (
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 16,
            marginBottom: 170,
            elevation: 4,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
            {isEditing
              ? t("admin.editProduct") || "تعديل المنتج"
              : t("admin.addNewProduct") || "إضافة منتج جديد"}
          </Text>
          <TextInput
            placeholder={t("admin.productName") || "اسم المنتج"}
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (text.trim()) setNameError("");
            }}
            style={styles.inputField}
          />
          {nameError ? (
            <Text style={styles.errorText}>
              {nameError}
            </Text>
          ) : null}
          <TextInput
            placeholder={t("admin.price") || "السعر"}
            value={price}
            onChangeText={(text) => {
              setPrice(text);
              if (!isNaN(text) && parseFloat(text) > 0) setPriceError("");
            }}
            keyboardType="numeric"
            style={styles.inputField}
          />
          {priceError ? (
            <Text style={styles.errorText}>
              {priceError}
            </Text>
          ) : null}
          <TextInput
            placeholder={t("admin.stock") || "المخزون"}
            value={stock}
            onChangeText={(text) => {
              setStock(text);
              if (!isNaN(text) && parseFloat(text) >= 0) setStockError("");
            }}
            keyboardType="numeric"
            style={styles.inputField}
          />
          {stockError ? (
            <Text style={styles.errorText}>
              {stockError}
            </Text>
          ) : null}

          <TextInput
            placeholder= {"Barcode"  || "الباركود"}
            value={barcode}
            onChangeText={(text) => {
              setBarcode(text);
              if (text.trim()) setBarcodeError("");
            }}
            style={styles.inputField}
          />
          {barcodeError ? (
            <Text style={styles.errorText}>
              {barcodeError}
            </Text>
          ) : null}

          <TextInput
            placeholder={t("admin.productDescription") || "الوصف"}
            value={description}
            onChangeText={setDescription}
            style={styles.inputField}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 12,
            }}
          >
            <TouchableOpacity
              onPress={handleAddProduct}
              style={[styles.addButton, { flex: 1, marginRight: 6 }]}
            >
              <Text style={styles.addButtonText}>
                {t("common.save") || "حفظ"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFormVisible(false)}
              style={[
                styles.addButton,
                { flex: 1, backgroundColor: "#aaa", marginLeft: 6 },
              ]}
            >
              <Text style={styles.addButtonText}>
                {t("common.cancel") || "إلغاء"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default ProductsScreen;
