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
  RefreshCcw,
  RotateCcw,
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

  // State Management
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [formVisible, setFormVisible] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("1");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [barcode, setBarcode] = useState("");
  const [acceptFloat, setAcceptFloat] = useState(true);
  const [showOnWebsite, setShowOnWebsite] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  // Validation States
  const [nameError, setNameError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [stockError, setStockError] = useState("");
  const [barcodeError, setBarcodeError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  // Data States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([
    { id: "all", name: t("admin.allProducts") || "جميع المنتجات" },
    { id: "1", name: t("admin.hotDrinks") || "مشروبات" },
    { id: "2", name: t("admin.beans") || "بن" },
    { id: "3", name: t("admin.food") || "طعام" },
    { id: "4", name: t("admin.snacks") || "وجبات خفيفة" },
  ]);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [perPage, setPerPage] = useState(15);

  // Loading & Error States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Fetch Products Function
  const fetchProducts = async (page = 1, resetData = false) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        throw new Error(t("admin.noToken") || "لم يتم العثور على التوكين");
      }

      const response = await fetch(`${BASE_URL}/admin/products?page=${page}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

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
      const mappedProducts = data.data.map((product) => ({
        id: product.id,
        name: product.name || "منتج بدون اسم",
        category_id: product.category_id?.toString() || "1",
        category: product.category?.name || "غير محدد",
        price: parseFloat(product.price) || 0,
        description: product.description || product.name || "لا يوجد وصف",
        stock: product.stock || "0",
        barcode: product.barcode || "",
        accept_float: product.accept_float || false,
        active: product.active || false,
        show_on_website: product.show_on_website || false,
        rating: product.rating || 0,
        sales: product.sales || 0,
        image:
          product.main_image_url ||
          (product.category_id === "1" || product.category_id === "2"
            ? "☕"
            : "🥐"),
        created_at: product.created_at,
        updated_at: product.updated_at,
        media: product.media || [],
      }));

      if (resetData) {
        setProducts(mappedProducts);
      } else {
        setProducts((prevProducts) =>
          page === 1 ? mappedProducts : [...prevProducts, ...mappedProducts]
        );
      }

      setCurrentPage(data.current_page || 1);
      setTotalPages(data.last_page || 1);
      setTotalProducts(data.total || 0);
      setPerPage(data.per_page || 15);
      setError(null);
    } catch (err) {
      // console.error("Error fetching products:", err.message);
      setError(err.message);
      Alert.alert(t("common.error") || "خطأ", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchProducts(1, true);
  }, []);

  // Filter products based on search and category
  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === "all" ||
        product.category_id === selectedCategory) &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get category icon
  const getCategoryIcon = (categoryId) => {
    switch (categoryId) {
      case "1":
        return "Coffee";
      case "2":
        return "Coffee";
      case "3":
        return "Package";
      case "4":
        return "Package";
      default:
        return "Coffee";
    }
  };

  // Render icons
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
      case "RefreshCcw":
        return <RefreshCcw size={size} color={color} />;
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

  // Form validation
  const validateForm = () => {
    let hasError = false;

    // Reset errors
    setNameError("");
    setPriceError("");
    setStockError("");
    setBarcodeError("");
    setDescriptionError("");

    // Name validation
    if (!name.trim()) {
      setNameError(t("validation.nameRequired") || "اسم المنتج مطلوب");
      hasError = true;
    } else if (name.trim().length < 2) {
      setNameError(
        t("validation.nameMinLength") ||
          "اسم المنتج يجب أن يكون حرفين على الأقل"
      );
      hasError = true;
    } else if (name.trim().length > 100) {
      setNameError(
        t("validation.nameMaxLength") || "اسم المنتج يجب أن يكون أقل من 100 حرف"
      );
      hasError = true;
    }

    // Price validation
    if (!price.trim()) {
      setPriceError(t("validation.priceRequired") || "السعر مطلوب");
      hasError = true;
    } else if (isNaN(price) || parseFloat(price) <= 0) {
      setPriceError(
        t("validation.priceInvalid") || "السعر يجب أن يكون رقمًا موجبًا"
      );
      hasError = true;
    } else if (parseFloat(price) > 99999.99) {
      setPriceError(
        t("validation.priceMax") || "السعر يجب أن يكون أقل من 99999.99"
      );
      hasError = true;
    }

    // Stock validation (optional for some cases)
    if (stock.trim() && (isNaN(stock) || parseFloat(stock) < 0)) {
      setStockError(
        t("validation.stockInvalid") ||
          "المخزون يجب أن يكون رقمًا موجبًا أو صفر"
      );
      hasError = true;
    }

    // Barcode validation
    if (!barcode.trim()) {
      setBarcodeError(t("validation.barcodeRequired"));
      hasError = true;
    } else if (!/^\d+$/.test(barcode.trim())) {
      setBarcodeError(
        t("validation.invalidBarcode") 
      );
      hasError = true;
    }

    // Description validation (optional)
    if (description.trim() && description.trim().length > 500) {
      setDescriptionError(
        t("validation.descriptionMaxLength") ||
          "الوصف يجب أن يكون أقل من 500 حرف"
      );
      hasError = true;
    }

    return !hasError;
  };

  // Clear form
  const clearForm = () => {
    setName("");
    setPrice("");
    setCategory("1");
    setDescription("");
    setStock("");
    setBarcode("");
    setAcceptFloat(true);
    setShowOnWebsite(true);
    setIsEditing(false);
    setEditProductId(null);
    setNameError("");
    setPriceError("");
    setStockError("");
    setBarcodeError("");
    setDescriptionError("");
  };

  // Handle form submission (Add/Edit Product)
  const handleSubmitProduct = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        throw new Error(t("admin.noToken") || "لم يتم العثور على التوكين");
      }

      const productData = {
        name: name.trim(),
        description: description.trim() || name.trim(),
        price: parseFloat(price).toFixed(2),
        category_id: category,
        stock: stock.trim() ? parseFloat(stock).toFixed(2) : "0.00",
        barcode: barcode.trim(),
        accept_float: acceptFloat,
        show_on_website: showOnWebsite,
        active: stock.trim() ? parseFloat(stock) > 0 : true,
      };

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

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 422) {
          if (result.errors) {
            Object.entries(result.errors).forEach(([field, messages]) => {
              const message = Array.isArray(messages) ? messages[0] : messages;
              switch (field) {
                case "name":
                  setNameError(message);
                  break;
                case "price":
                  setPriceError(message);
                  break;
                case "stock":
                  setStockError(message);
                  break;
                case "barcode":
                  setBarcodeError(message);
                  break;
                case "description":
                  setDescriptionError(message);
                  break;
              }
            });
            return;
          }
        }
        throw new Error(
          result.message ||
            t("admin.saveProductError") ||
            `فشل في حفظ المنتج (Status: ${response.status})`
        );
      }

      // After successful add/edit, refresh the product list to ensure sync with server
      await fetchProducts(1, true);

      Alert.alert(
        t("admin.addProduct") || "إضافة منتج",
        isEditing
          ? t("admin.productUpdated") || "تم تعديل المنتج بنجاح!"
          : t("admin.productAdded") || "تم إضافة المنتج بنجاح!"
      );

      setFormVisible(false);
      clearForm();
    } catch (err) {
      // console.error("Error submitting product:", err.message);
      Alert.alert(
        t("common.error") || "خطأ",
        err.message || t("admin.saveProductError") || "فشل في حفظ المنتج"
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle Edit Product
  const handleEditProduct = (product) => {
    setName(product.name);
    setCategory(product.category_id);
    setPrice(product.price.toString());
    setDescription(product.description || "");
    setStock(product.stock?.toString() || "0");
    setBarcode(product.barcode || "");
    setAcceptFloat(product.accept_float || true);
    setShowOnWebsite(product.show_on_website || true);
    setFormVisible(true);
    setIsEditing(true);
    setEditProductId(product.id);
  };

  // Handle Delete Product
  const handleDeleteProduct = async (product) => {
    Alert.alert(
      t("common.deleteProduct") || "حذف المنتج",
      t("common.confirmDeleteMessage") || `هل أنت متأكد من حذف "${product.name}"؟`,
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

              if (!response.ok) {
                const result = await response.json().catch(() => ({}));
                throw new Error(
                  result.message ||
                    t("admin.deleteProductError") ||
                    `فشل في حذف المنتج (Status: ${response.status})`
                );
              }

              // Refresh the product list after deletion to ensure sync with server
              await fetchProducts(1, true);

              // Alert.alert(
              //   t("admin.deleteProduct") || "حذف المنتج",
              //   t("admin.deleteProductSuccess") || "تم حذف المنتج بنجاح"
              // );
            } catch (err) {
              // console.error("Error deleting product:", err.message);
              Alert.alert(
                t("common.error") || "خطأ",
                err.message ||
                  t("admin.deleteProductError") ||
                  "فشل في حذف المنتج"
              );
            }
          },
        },
      ]
    );
  };

  // Handle Toggle Product Status (Active/Inactive)
  const handleToggleProductStatus = async (product) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        throw new Error(t("admin.noToken") || "لم يتم العثور على التوكين");
      }

      const newStatus = !product.active;

      const response = await fetch(`${BASE_URL}/admin/products/${product.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          active: newStatus,
        }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(
          result.message ||
            t("admin.updateStatusError") ||
            `فشل في تحديث حالة المنتج (Status: ${response.status})`
        );
      }

      // Refresh the product list after toggling status
      await fetchProducts(1, true);
    } catch (err) {
      // console.error("Error toggling product status:", err.message);
      Alert.alert(
        t("common.error") || "خطأ",
        err.message ||
          t("admin.updateStatusError") ||
          "فشل في تحديث حالة المنتج"
      );
    }
  };

  // Handle Toggle Website Visibility
  const handleToggleWebsiteVisibility = async (product) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        throw new Error(t("admin.noToken") || "لم يتم العثور على التوكين");
      }

      const newVisibility = !product.show_on_website;

      const response = await fetch(`${BASE_URL}/admin/products/${product.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          show_on_website: newVisibility,
        }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(
          result.message ||
            t("admin.updateVisibilityError") ||
            `فشل في تحديث ظهور المنتج على الموقع (Status: ${response.status})`
        );
      }

      // Refresh the product list after toggling visibility
      await fetchProducts(1, true);
    } catch (err) {
      // console.error("Error toggling website visibility:", err.message);
      Alert.alert(
        t("common.error") || "خطأ",
        err.message ||
          t("admin.updateVisibilityError") ||
          "فشل في تحديث ظهور المنتج"
      );
    }
  };

  // Handle Page Change for Pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      fetchProducts(newPage, true);
    }
  };

  // Handle Refresh Data
  const handleRefresh = () => {
    setCurrentPage(1);
    fetchProducts(1, true);
  };

  // Render Product Card Component
  const renderProductCard = (product) => {
    const isImageUrl = product.image?.startsWith("http");
    const isAvailable = product.active && parseFloat(product.stock || 0) > 0;

    return (
      <View key={product.id} style={styles.productCardContainer}>
        {viewMode === "grid" ? (
          <TouchableOpacity style={styles.gridCard}>
            <View style={styles.gridCardHeader}>
              {isImageUrl ? (
                <Image
                  source={{ uri: product.image }}
                  style={styles.productImage}
                  resizeMode="cover"
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
              <Text style={styles.gridCardName} numberOfLines={2}>
                {product.name}
              </Text>
              <Text style={styles.gridCardCategory}>{product.category}</Text>
              {product.description && (
                <Text style={styles.gridCardDescription} numberOfLines={2}>
                  {product.description}
                </Text>
              )}
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
                      parseFloat(product.stock || 0) === 0 &&
                        styles.stockEmptyText,
                    ]}
                  >
                    {product.stock || "0"}
                  </Text>
                </View>
                <View style={styles.gridCardStat}>
                  <Text style={styles.gridCardStatLabel}>
                    {t("admin.barcode") || "الباركود"}
                  </Text>
                  <Text style={styles.gridCardStatValue}>
                    {product.barcode || "غير محدد"}
                  </Text>
                </View>
              </View>
              <View style={styles.gridCardFlags}>
                <View style={styles.gridCardFlag}>
                  <Text style={styles.gridCardFlagLabel}>
                    {t("admin.acceptFloat") || "كسر"}
                  </Text>
                  <Text
                    style={[
                      styles.gridCardFlagValue,
                      product.accept_float
                        ? styles.flagActive
                        : styles.flagInactive,
                    ]}
                  >
                    {product.accept_float ? "نعم" : "لا"}
                  </Text>
                </View>
                <View style={styles.gridCardFlag}>
                  <Text style={styles.gridCardFlagLabel}>
                    {t("admin.showOnWebsite") || "الموقع"}
                  </Text>
                  <Text
                    style={[
                      styles.gridCardFlagValue,
                      product.show_on_website
                        ? styles.flagActive
                        : styles.flagInactive,
                    ]}
                  >
                    {product.show_on_website ? "ظاهر" : "مخفي"}
                  </Text>
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
              <TouchableOpacity
                style={[styles.gridActionButton, styles.toggleGridButton]}
                onPress={() => handleToggleProductStatus(product)}
              >
                {renderIcon(
                  product.active ? "CheckCircle" : "XCircle",
                  16,
                  "#fff"
                )}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.listCard}>
            <View style={styles.listCardHeader}>
              <View style={styles.listCardLeft}>
                {isImageUrl ? (
                  <Image
                    source={{ uri: product.image }}
                    style={styles.listProductImage}
                    resizeMode="cover"
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
                  <Text style={styles.listCardCategory}>
                    {product.category}
                  </Text>
                  {product.description && (
                    <Text style={styles.listCardDescription} numberOfLines={2}>
                      {product.description}
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.listCardRight}>
                <View style={styles.listCardPrice}>
                  <Text style={styles.listCardPriceText}>
                    ${parseFloat(product.price).toFixed(2)}
                  </Text>
                </View>
                <View style={styles.listCardSwitches}>
                  <View style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>
                      {t("admin.active") || "نشط"}
                    </Text>
                    <Switch
                      value={product.active}
                      onValueChange={() => handleToggleProductStatus(product)}
                      trackColor={{ false: "#e0e0e0", true: "#4CAF50" }}
                      thumbColor={product.active ? "#fff" : "#f4f3f4"}
                    />
                  </View>
                  <View style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>
                      {t("common.website") || "موقع"}
                    </Text>
                    <Switch
                      value={product.show_on_website}
                      onValueChange={() =>
                        handleToggleWebsiteVisibility(product)
                      }
                      trackColor={{ false: "#e0e0e0", true: "#2196F3" }}
                      thumbColor={product.show_on_website ? "#fff" : "#f4f3f4"}
                    />
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.listCardDetails}>
              <View style={styles.listCardDetailRow}>
                <View style={styles.listCardStat}>
                  <Text style={styles.listCardStatLabel}>
                    {t("admin.stock") || "المخزون"}
                  </Text>
                  <Text
                    style={[
                      styles.listCardStatValue,
                      parseFloat(product.stock || 0) === 0 &&
                        styles.stockEmptyText,
                    ]}
                  >
                    {product.stock || "0"} {t("admin.units") || "وحدة"}
                  </Text>
                </View>
                <View style={styles.listCardStat}>
                  <Text style={styles.listCardStatLabel}>
                    {t("admin.barcode") || "الباركود"}
                  </Text>
                  <Text style={styles.listCardStatValue}>
                    {product.barcode || t("admin.notSet") || "غير محدد"}
                  </Text>
                </View>
                <View style={styles.listCardStat}>
                  <Text style={styles.listCardStatLabel}>
                    {t("admin.acceptFloat") || "يقبل كسر"}
                  </Text>
                  <Text
                    style={[
                      styles.listCardStatValue,
                      product.accept_float
                        ? styles.flagActive
                        : styles.flagInactive,
                    ]}
                  >
                    {product.accept_float
                      ? t("common.yes") || "نعم"
                      : t("common.no") || "لا"}
                  </Text>
                </View>
              </View>
              <View style={styles.listCardDetailRow}>
                <View style={styles.listCardStat}>
                  <Text style={styles.listCardStatLabel}>
                    {t("admin.createdAt") || "تاريخ الإنشاء"}
                  </Text>
                  <Text style={styles.listCardStatValue}>
                    {product.created_at
                      ? new Date(product.created_at).toLocaleDateString("ar-EG")
                      : "غير محدد"}
                  </Text>
                </View>
                <View style={styles.listCardStat}>
                  <Text style={styles.listCardStatLabel}>
                    {t("supervisor.lastUpdated") || "آخر تحديث"}
                  </Text>
                  <Text style={styles.listCardStatValue}>
                    {product.updated_at
                      ? new Date(product.updated_at).toLocaleDateString("ar-EG")
                      : "غير محدد"}
                  </Text>
                </View>
                <View style={styles.listCardStat}>
                  <Text style={styles.listCardStatLabel}>
                    {t("admin.adminId") || "المعرف"}
                  </Text>
                  <Text style={styles.listCardStatValue}>#{product.id}</Text>
                </View>
              </View>
            </View>
            <View style={styles.listCardActions}>
              <TouchableOpacity
                style={[styles.listActionButton, styles.editListButton]}
                onPress={() => handleEditProduct(product)}
              >
                {renderIcon("Edit", 16, "#fff")}
                <Text style={styles.listActionText}>
                  {t("common.edit") || "تعديل"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.listActionButton, styles.deleteListButton]}
                onPress={() => handleDeleteProduct(product)}
              >
                {renderIcon("Trash2", 16, "#fff")}
                <Text style={styles.listActionText}>
                  {t("common.delete") || "حذف"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  // Main render return
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>
            {t("admin.productsManagement") || "إدارة المنتجات"}
          </Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
          >
            {renderIcon("RefreshCcw", 24, "#fff")}
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          {t("admin.totalProducts") || "إجمالي المنتجات"}: {totalProducts}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={handleRefresh}
      >
        {/* Search Container */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            {renderIcon("Search", 20, "#6b4f42")}
            <TextInput
              style={styles.searchTextInput}
              placeholder={t("admin.searchProducts") || "ابحث عن المنتجات..."}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#8d6e63"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                style={styles.clearSearchButton}
              >
                {renderIcon("XCircle", 20, "#8d6e63")}
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter Container */}
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

        {/* Add Product Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            clearForm();
            setFormVisible(true);
          }}
        >
          {renderIcon("Plus", 22, "#fff")}
          <Text style={styles.addButtonText}>
            {t("admin.addNewProduct") || "إضافة منتج جديد"}
          </Text>
        </TouchableOpacity>

        {/* Products Container */}
        <View style={styles.productsContainer}>
          {loading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator size="large" color="#8d6e63" />
              <Text style={styles.emptyStateText}>
                {t("common.loading") || "جاري التحميل..."}
              </Text>
            </View>
          ) : error ? (
            <View style={styles.emptyState}>
              <Text style={styles.errorEmoji}>❌</Text>
              <Text style={styles.emptyStateText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleRefresh}
              >
                <Text style={styles.retryButtonText}>
                  {t("common.retry") || "إعادة المحاولة"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : filteredProducts.length > 0 ? (
            viewMode === "grid" ? (
              <View style={styles.gridContainer}>
                {filteredProducts.map(renderProductCard)}
              </View>
            ) : (
              <View style={styles.listContainer}>
                {filteredProducts.map(renderProductCard)}
              </View>
            )
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>☕</Text>
              <Text style={styles.emptyStateText}>
                {searchQuery
                  ? t("admin.noProductsMatchSearch") ||
                    "لم يتم العثور على منتجات تطابق البحث"
                  : t("admin.noProductsFound") || "لم يتم العثور على منتجات"}
              </Text>
              {searchQuery && (
                <TouchableOpacity
                  style={styles.clearFiltersButton}
                  onPress={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                >
                  <Text style={styles.clearFiltersButtonText}>
                    {t("admin.clearFilters") || "إزالة التصفية"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Pagination */}
        {totalPages > 1 && (
          <View style={styles.paginationContainer}>


            <TouchableOpacity
              style={[
                styles.paginationButton,
                currentPage === totalPages && styles.paginationButtonDisabled,
              ]}
              onPress={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <Text style={styles.paginationButtonText}>
                {t("common.next") || "التالي"}
              </Text>
              {renderIcon("ChevronRight", 20, "#fff")}
            </TouchableOpacity>
            


            <View style={styles.pageInfoContainer}>
              <Text style={styles.pageInfo}>
                {t("worker.page") || "صفحة"} {currentPage}{" "}
                {t("worker.of") || "من"} {totalPages}
              </Text>
              <Text style={styles.pageSubInfo}>
                ({filteredProducts.length} {t("worker.of") || "من"}{" "}
                {totalProducts} {t("admin.products") || "منتج"})
              </Text>
            </View>


            <TouchableOpacity
              style={[
                styles.paginationButton,
                currentPage === 1 && styles.paginationButtonDisabled,
              ]}
              onPress={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              {renderIcon("ChevronLeft", 20, "#fff")}
              <Text style={styles.paginationButtonText}>
                {t("common.previous") || "السابق"}
              </Text>
            </TouchableOpacity>



          </View>
        )}
      </ScrollView>

      {/* Add/Edit Product Form Modal */}
      {formVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {isEditing
                    ? t("admin.editProduct") || "تعديل المنتج"
                    : t("admin.addNewProduct") || "إضافة منتج جديد"}
                </Text>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => {
                    setFormVisible(false);
                    clearForm();
                  }}
                >
                  {renderIcon("XCircle", 24, "#8d6e63")}
                </TouchableOpacity>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t("admin.productName") || "اسم المنتج"} *
                </Text>
                <TextInput
                  style={[
                    styles.inputField,
                    nameError && styles.inputFieldError,
                  ]}
                  placeholder={t("admin.productName") || "أدخل اسم المنتج"}
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (text.trim()) setNameError("");
                  }}
                  placeholderTextColor="#8d6e63"
                />
                {nameError ? (
                  <Text style={styles.errorText}>{nameError}</Text>
                ) : null}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t("admin.productCategory") || "الفئة"} *
                </Text>
                <View style={styles.categorySelector}>
                  {categories
                    .filter((cat) => cat.id !== "all")
                    .map((cat) => (
                      <TouchableOpacity
                        key={cat.id}
                        style={[
                          styles.categoryOption,
                          category === cat.id && styles.categoryOptionSelected,
                        ]}
                        onPress={() => setCategory(cat.id)}
                      >
                        {renderIcon(
                          getCategoryIcon(cat.id),
                          20,
                          category === cat.id ? "#fff" : "#8d6e63"
                        )}
                        <Text
                          style={[
                            styles.categoryOptionText,
                            category === cat.id &&
                              styles.categoryOptionTextSelected,
                          ]}
                        >
                          {cat.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t("admin.price") || "السعر"} *
                </Text>
                <TextInput
                  style={[
                    styles.inputField,
                    priceError && styles.inputFieldError,
                  ]}
                  placeholder={t("admin.productPrice") || "أدخل السعر"}
                  value={price}
                  onChangeText={(text) => {
                    setPrice(text);
                    if (!isNaN(text) && parseFloat(text) > 0) setPriceError("");
                  }}
                  keyboardType="numeric"
                  placeholderTextColor="#8d6e63"
                />
                {priceError ? (
                  <Text style={styles.errorText}>{priceError}</Text>
                ) : null}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t("admin.stock") || "المخزون"}
                </Text>
                <TextInput
                  style={[
                    styles.inputField,
                    stockError && styles.inputFieldError,
                  ]}
                  placeholder={t("admin.stock") || "أدخل كمية المخزون"}
                  value={stock}
                  onChangeText={(text) => {
                    setStock(text);
                    if (!text.trim() || (!isNaN(text) && parseFloat(text) >= 0))
                      setStockError("");
                  }}
                  keyboardType="numeric"
                  placeholderTextColor="#8d6e63"
                />
                {stockError ? (
                  <Text style={styles.errorText}>{stockError}</Text>
                ) : null}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t("admin.barcode") || "الباركود"} *
                </Text>
                <TextInput
                  style={[
                    styles.inputField,
                    barcodeError && styles.inputFieldError,
                  ]}
                  placeholder={t("admin.barcode") || "أدخل الباركود"}
                  value={barcode}
                  onChangeText={(text) => {
                    setBarcode(text);
                    if (text.trim()) setBarcodeError("");
                  }}
                  placeholderTextColor="#8d6e63"
                />
                {barcodeError ? (
                  <Text style={styles.errorText}>{barcodeError}</Text>
                ) : null}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t("admin.productDescription") || "الوصف"}
                </Text>
                <TextInput
                  style={[
                    styles.textareaField,
                    descriptionError && styles.inputFieldError,
                  ]}
                  placeholder={
                    t("admin.productDescription") || "أدخل وصف المنتج (اختياري)"
                  }
                  value={description}
                  onChangeText={(text) => {
                    setDescription(text);
                    if (!text.trim() || text.trim().length <= 500)
                      setDescriptionError("");
                  }}
                  multiline
                  numberOfLines={4}
                  placeholderTextColor="#8d6e63"
                />
                {descriptionError ? (
                  <Text style={styles.errorText}>{descriptionError}</Text>
                ) : null}
              </View>
              <View style={styles.optionsContainer}>
                <View style={styles.optionRow}>
                  <Text style={styles.optionLabel}>
                    {t("admin.acceptFloat") || "يقبل كسور"}
                  </Text>
                  <Switch
                    value={acceptFloat}
                    onValueChange={setAcceptFloat}
                    trackColor={{ false: "#e0e0e0", true: "#4CAF50" }}
                    thumbColor={acceptFloat ? "#fff" : "#f4f3f4"}
                  />
                </View>
                <View style={styles.optionRow}>
                  <Text style={styles.optionLabel}>
                    {t("admin.showOnWebsite") || "ظاهر على الموقع"}
                  </Text>
                  <Switch
                    value={showOnWebsite}
                    onValueChange={setShowOnWebsite}
                    trackColor={{ false: "#e0e0e0", true: "#2196F3" }}
                    thumbColor={showOnWebsite ? "#fff" : "#f4f3f4"}
                  />
                </View>
              </View>
              <View style={styles.formActions}>
                <TouchableOpacity
                  style={[styles.formActionButton, styles.cancelButton]}
                  onPress={() => {
                    setFormVisible(false);
                    clearForm();
                  }}
                  disabled={submitLoading}
                >
                  <Text style={styles.cancelButtonText}>
                    {t("common.cancel") || "إلغاء"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.formActionButton, styles.saveButton]}
                  onPress={handleSubmitProduct}
                  disabled={submitLoading}
                >
                  {submitLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      {renderIcon(isEditing ? "Edit" : "Plus", 18, "#fff")}
                      <Text style={styles.saveButtonText}>
                        {isEditing
                          ? t("common.update") || "تحديث"
                          : t("common.save") || "حفظ"}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
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
    direction: "ltr",
  },
  header: {
    paddingTop: 30,
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
    zIndex: 2000, // Ensure header stays above form
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#ffffff",
    marginTop: 8,
  },
  refreshButton: {
    backgroundColor: "#7b645bff",
    padding: 10,
    borderRadius: 12,
  },
  scrollContainer: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "#fffaf5",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5d4c0",
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchTextInput: {
    flex: 1,
    fontSize: 16,
    color: "#4e342e",
    marginHorizontal: 8,
  },
  clearSearchButton: {
    padding: 4,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fffaf5",
    borderTopWidth: 1,
    borderTopColor: "#e5d4c0",
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4e342e",
  },
  viewModeContainer: {
    flexDirection: "row",
    gap: 8,
  },
  viewModeButton: {
    padding: 8,
    borderRadius: 12,
  },
  viewModeButtonActive: {
    backgroundColor: "#8d6e63",
  },
  viewModeButtonInactive: {
    backgroundColor: "#e0e0e0",
  },
  filterButtonsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  filterButtonActive: {
    backgroundColor: "#8d6e63",
  },
  filterButtonInactive: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5d4c0",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: "#fff",
  },
  filterButtonTextInactive: {
    color: "#2c3e50",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8d6e63",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 16,
    marginVertical: 12,
    gap: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  productsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  listContainer: {
    flexDirection: "column",
  },
  gridCard: {
    width: (width - 48) / 2,
    backgroundColor: "#fffaf5",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#e5d4c0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  gridCardHeader: {
    alignItems: "center",
    marginBottom: 12,
    position: "relative",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  productEmoji: {
    fontSize: 48,
  },
  gridCardBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  gridCardBadgeAvailable: {
    borderColor: "#4caf50",
  },
  gridCardBadgeUnavailable: {
    borderColor: "#f44336",
  },
  gridCardBadgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  gridCardBadgeTextAvailable: {
    color: "#4caf50",
  },
  gridCardBadgeTextUnavailable: {
    color: "#f44336",
  },
  gridCardContent: {
    flex: 1,
  },
  gridCardName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4e342e",
    marginBottom: 8,
    textAlign: "left",
  },
  gridCardCategory: {
    fontSize: 12,
    color: "#8d6e63",
    marginBottom: 8,
    textAlign: "left",
  },
  gridCardDescription: {
    fontSize: 12,
    color: "#6b4f42",
    lineHeight: 18,
    marginBottom: 12,
    textAlign: "left",
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
    flexDirection: "row",
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
  gridCardFlags: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  gridCardFlag: {
    alignItems: "center",
  },
  gridCardFlagLabel: {
    fontSize: 10,
    color: "#8d6e63",
    fontWeight: "500",
  },
  gridCardFlagValue: {
    fontSize: 12,
    fontWeight: "bold",
  },
  flagActive: {
    color: "#27ae60",
  },
  flagInactive: {
    color: "#c0392b",
  },
  gridCardActions: {
    flexDirection: "row",
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
  toggleGridButton: {
    backgroundColor: "#4CAF50",
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
    marginBottom: 16,
  },
  listCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  listCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  listProductImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  listProductEmoji: {
    fontSize: 40,
    marginRight: 16,
  },
  listCardInfo: {
    flex: 1,
  },
  listCardName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4e342e",
    marginBottom: 4,
  },
  listCardCategory: {
    fontSize: 14,
    color: "#8d6e63",
    marginBottom: 4,
  },
  listCardDescription: {
    fontSize: 14,
    color: "#6b4f42",
    lineHeight: 20,
  },
  listCardRight: {
    alignItems: "flex-end",
    gap: 8,
  },
  listCardPrice: {
    backgroundColor: "#e8f5e8",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#4caf50",
  },
  listCardPriceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  listCardSwitches: {
    gap: 8,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  switchLabel: {
    fontSize: 12,
    color: "#4e342e",
    fontWeight: "500",
  },
  listCardDetails: {
    backgroundColor: "#f7f3ef",
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
  },
  listCardDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  listCardStat: {
    alignItems: "center",
    flex: 1,
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
    flexDirection: "row",
    gap: 12,
  },
  listActionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 15,
    gap: 8,
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
    color: "#fff",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
  },
  errorEmoji: {
    fontSize: 64,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#6b4f42",
    textAlign: "center",
    marginTop: 12,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: "#8d6e63",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  clearFiltersButton: {
    marginTop: 16,
    backgroundColor: "#2196F3",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  clearFiltersButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContainer: {
    width: width - 32,
    maxHeight: "80%",
    backgroundColor: "#fffaf5",
    borderRadius: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  modalContent: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4e342e",
  },
  modalCloseButton: {
    padding: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4e342e",
    marginBottom: 8,
  },
  inputField: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5d4c0",
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    color: "#4e342e",
  },
  inputFieldError: {
    borderColor: "#f44336",
  },
  textareaField: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5d4c0",
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    color: "#4e342e",
    minHeight: 100,
    textAlignVertical: "top",
  },
  errorText: {
    color: "#f44336",
    fontSize: 12,
    marginTop: 4,
  },
  categorySelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#e5d4c0",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryOptionSelected: {
    backgroundColor: "#8d6e63",
    borderColor: "#8d6e63",
  },
  categoryOptionText: {
    fontSize: 14,
    color: "#4e342e",
  },
  categoryOptionTextSelected: {
    color: "#fff",
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  optionLabel: {
    fontSize: 14,
    color: "#4e342e",
    fontWeight: "500",
  },
  formActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
    marginBottom: 40,
  },
  formActionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButton: {
    backgroundColor: "#f44336",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  paginationContainer: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  paginationButton: {
    flexDirection: "row",
    backgroundColor: "#8d6e63",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    gap: 8,
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  pageInfoContainer: {
    alignItems: "center",
  },
  pageInfo: {
    fontSize: 16,
    color: "#4e342e",
    fontWeight: "500",
  },
  pageSubInfo: {
    fontSize: 12,
    color: "#6b4f42",
    marginTop: 4,
  },
});

// Export the component explicitly
export default ProductsScreen;
