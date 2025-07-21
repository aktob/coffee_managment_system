import React, { useState } from "react";
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

const { width } = Dimensions.get("window");

const ProductsScreen = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useSelector((state) => state.language);
  const isRTL = currentLanguage === "ar";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid or list



<<<<<<< HEAD

=======
>>>>>>> 0b17bb2a4cee837c8c038f3d4dc354ab1221e9ef
  // New i added
const [formVisible, setFormVisible] = useState(false);
const [name, setName] = useState("");
const [category, setCategory] = useState("hot");
const [price, setPrice] = useState("");
const [description, setDescription] = useState("");
const [stock, setStock] = useState("");
const [isEditing, setIsEditing] = useState(false);
const [editProductId, setEditProductId] = useState(null);
<<<<<<< HEAD

const [nameError, setNameError] = useState("");
const [priceError, setPriceError] = useState("");
const [stockError, setStockError] = useState("");
  // New i added





=======
  // New i added


>>>>>>> 0b17bb2a4cee837c8c038f3d4dc354ab1221e9ef
  // Mock product data
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Espresso",
      category: "hot",
      price: 3.99,
      description: "Strong and pure coffee shot",
      available: true,
      stock: 45,
      rating: 4.8,
      sales: 156,
      image: "☕",
    },
    {
      id: 2,
      name: "Cappuccino",
      category: "hot",
      price: 4.99,
      description: "Espresso with steamed milk foam",
      available: true,
      stock: 32,
      rating: 4.9,
      sales: 203,
      image: "☕",
    },
    {
      id: 3,
      name: "Iced Latte",
      category: "cold",
      price: 4.49,
      description: "Espresso with cold milk and ice",
      available: false,
      stock: 0,
      rating: 4.6,
      sales: 89,
      image: "🧊",
    },
    {
      id: 4,
      name: "Croissant",
      category: "food",
      price: 2.99,
      description: "Buttery French pastry",
      available: true,
      stock: 28,
      rating: 4.7,
      sales: 134,
      image: "🥐",
    },
    {
      id: 5,
      name: "Chocolate Cake",
      category: "snacks",
      price: 3.49,
      description: "Rich chocolate layer cake",
      available: true,
      stock: 15,
      rating: 4.5,
      sales: 67,
      image: "🍰",
    },
  ]);

  const categories = ["all", "hot", "cold", "food", "snacks"];

  const filteredProducts = products.filter(
    (product) =>
      (selectedCategory === "all" || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const getCategoryIcon = (category) => {
    switch (category) {
      case "hot":
        return "Coffee";
      case "cold":
        return "Coffee";
      case "food":
        return "Package";
      case "snacks":
        return "Package";
      default:
        return "Coffee";
    }
  };


<<<<<<< HEAD
  // New i added
  // const handleAddProduct = () => {
  //   if (!name || !price) {
  //     Alert.alert("Error", "Please enter name and price");
  //     return;
  //   }
    
  // if (isEditing) {
  //   const updatedProducts = products.map((item) =>
  //     item.id === editProductId
  //       ? {
  //           ...item,
  //           name,
  //           category,
  //           price: parseFloat(price),
  //           description,
  //           stock: parseInt(stock),
  //         }
  //       : item
  //   );
  //   setProducts(updatedProducts);
  //   Alert.alert(t("admin.editProduct"), t("admin.editProductMessage"));
  // } else {
  //   const newProduct = {
  //     id: products.length + 1,
  //     name,
  //     category,
  //     price: parseFloat(price),
  //     description,
  //     stock: parseInt(stock),
  //     available: true,
  //     sales: 0,
  //     rating: 0,
  //     image: "☕",
  //   };
  //   setProducts([...products, newProduct]);
  //   Alert.alert(t("admin.addProduct"), t("admin.addProductMessage"));
  // }
  
  // reset form
    // setFormVisible(false); // يخفي الفورم
  // يفضي القيم بعد الإضافة
  //   setName("");
  //   setPrice("");
  //   setCategory("hot");
  //   setDescription("");
  //   setStock("");
  //   setIsEditing(false);
  //   setEditProductId(null);
  // };
  // New i added



  // New i added
const handleAddProduct = () => {
  let hasError = false;

  // Reset errors
  setNameError("");
  setPriceError("");
  setStockError("");

  // Validation
  if (!name.trim()) {
    setNameError("Name is required");
    hasError = true;
  }
  if (!price || isNaN(price) || parseFloat(price) <= 0) {
    setPriceError("Valid price is required");
    hasError = true;
  }
  if (!stock || isNaN(stock) || parseInt(stock) < 0) {
    setStockError("Valid stock is required");
    hasError = true;
  }

  if (hasError) return;

  // لو مفيش Errors نكمل
=======

  // New i added
  const handleAddProduct = () => {
    if (!name || !price) {
      Alert.alert("Error", "Please enter name and price");
      return;
    }
     
>>>>>>> 0b17bb2a4cee837c8c038f3d4dc354ab1221e9ef

  if (isEditing) {
    const updatedProducts = products.map((item) =>
      item.id === editProductId
        ? {
            ...item,
            name,
            category,
            price: parseFloat(price),
            description,
            stock: parseInt(stock),
          }
        : item
    );
    setProducts(updatedProducts);
<<<<<<< HEAD
    Alert.alert(t("admin.editProduct"), t("Product updated successfully!"));
  } else {
    const newProduct = {
      id: Date.now(),
=======
    Alert.alert(t("admin.editProduct"), t("admin.editProductMessage"));
  } else {
    const newProduct = {
      id: products.length + 1,
>>>>>>> 0b17bb2a4cee837c8c038f3d4dc354ab1221e9ef
      name,
      category,
      price: parseFloat(price),
      description,
      stock: parseInt(stock),
      available: true,
      sales: 0,
      rating: 0,
      image: "☕",
    };
    setProducts([...products, newProduct]);
    Alert.alert(t("admin.addProduct"), t("admin.addProductMessage"));
  }

<<<<<<< HEAD
  // reset form
  setFormVisible(false);
  setName("");
  setPrice("");
  setCategory("hot");
  setDescription("");
  setStock("");
  setIsEditing(false);
  setEditProductId(null);
};
  // New i added




  // New i added
  const handleEditProduct = (product) => {
    setName(product.name);
    setCategory(product.category);
    setPrice(product.price.toString());
    setDescription(product.description);
    setStock(product.stock.toString());
    setFormVisible(true);
    setIsEditing(true);
    setEditProductId(product.id);
=======


    
  // reset form
    setFormVisible(false); // يخفي الفورم
  // يفضي القيم بعد الإضافة
    setName("");
    setPrice("");
    setCategory("hot");
    setDescription("");
    setStock("");
    setIsEditing(false);
    setEditProductId(null);
  };
  // New i added


  // New i added
  const handleEditProduct = (product) => {
    setName(product.name);
  setCategory(product.category);
  setPrice(product.price.toString());
  setDescription(product.description);
  setStock(product.stock.toString());
  setFormVisible(true);
  setIsEditing(true);
  setEditProductId(product.id);
>>>>>>> 0b17bb2a4cee837c8c038f3d4dc354ab1221e9ef
  };
  // New i added


<<<<<<< HEAD

=======
>>>>>>> 0b17bb2a4cee837c8c038f3d4dc354ab1221e9ef
  // New i added
  const handleDeleteProduct = (product) => {
    Alert.alert(t("admin.deleteProduct"), t("admin.deleteProductConfirm"), [
      {
        text: t("common.cancel"),
        style: "cancel",
      },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: () => {
<<<<<<< HEAD
=======

>>>>>>> 0b17bb2a4cee837c8c038f3d4dc354ab1221e9ef
          setProducts((prevProducts) =>
            prevProducts.filter((p) => p.id !== product.id)
          );
        },
      },
    ]);
  };
  // New i added



  // New i added
  const handleToggleAvailability = (product) => {
<<<<<<< HEAD
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === product.id ? { ...p, available: !p.available } : p
      )
    );
=======
    product.available = !product.available;
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === product.id ? product : p))
    );  
>>>>>>> 0b17bb2a4cee837c8c038f3d4dc354ab1221e9ef
  };
  // New i added



<<<<<<< HEAD
=======

>>>>>>> 0b17bb2a4cee837c8c038f3d4dc354ab1221e9ef
  const renderProductCard = (product) => {
    if (viewMode === "grid") {
      return (
        <TouchableOpacity key={product.id} style={styles.gridCard}>
          <View style={styles.gridCardHeader}>
            <Text style={styles.productEmoji}>{product.image}</Text>
            <View style={styles.gridCardBadge}>
              <Text style={styles.gridCardBadgeText}>
                {product.available
                  ? t("admin.available")
                  : t("admin.unavailable")}
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
                ${product.price.toFixed(2)}
              </Text>
            </View>

            <View style={styles.gridCardStats}>
              <View style={styles.gridCardStat}>
                <Text style={styles.gridCardStatLabel}>{t("admin.stock")}</Text>
                <Text style={styles.gridCardStatValue}>{product.stock}</Text>
              </View>
              <View style={styles.gridCardStat}>
                <Text style={styles.gridCardStatLabel}>
                  {t("admin.rating")}
                </Text>
                <Text style={styles.gridCardStatValue}>{product.rating}</Text>
              </View>
            </View>
          </View>

          <View style={styles.gridCardActions}>
            <TouchableOpacity
              style={styles.gridActionButton}
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
      );
    }

    return (
      <View key={product.id} style={styles.listCard}>
        <View style={styles.listCardHeader}>
          <View style={styles.listCardLeft}>
            <Text style={styles.listProductEmoji}>{product.image}</Text>
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
                ${product.price.toFixed(2)}
              </Text>
            </View>
            <Switch
              value={product.available}
              onValueChange={() => handleToggleAvailability(product)}
              trackColor={{ false: "#e0e0e0", true: "#4CAF50" }}
              thumbColor={product.available ? "#fff" : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={styles.listCardDetails}>
          <View style={styles.listCardStat}>
            <Text style={styles.listCardStatLabel}>{t("admin.stock")}</Text>
            <Text style={styles.listCardStatValue}>
              {product.stock} {t("admin.units")}
            </Text>
          </View>
          <View style={styles.listCardStat}>
            <Text style={styles.listCardStatLabel}>{t("admin.rating")}</Text>
            <Text style={styles.listCardStatValue}>{product.rating}/5.0</Text>
          </View>
          <View style={styles.listCardStat}>
            <Text style={styles.listCardStatLabel}>{t("admin.sales")}</Text>
            <Text style={styles.listCardStatValue}>
              {product.sales} {t("admin.orders")}
            </Text>
          </View>
        </View>

        <View style={styles.listCardActions}>
          <TouchableOpacity
            style={styles.listActionButton}
            onPress={() => handleEditProduct(product)}
          >
            {renderIcon("Edit", 16, "#2196F3")}
            <Text style={styles.listActionText}>{t("common.edit")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.listActionButton, styles.deleteListButton]}
            onPress={() => handleDeleteProduct(product)}
          >
            {renderIcon("Trash2", 16, "#f44336")}
            <Text style={[styles.listActionText, styles.deleteListText]}>
              {t("common.delete")}
            </Text>
          </TouchableOpacity>
        </View>
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
    gridCardBadge: {
      backgroundColor: "#e8f5e8",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 10,
    },
    gridCardBadgeText: {
      fontSize: 10,
      fontWeight: "600",
      color: "#27ae60",
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
    gridCardActions: {
      flexDirection: isRTL ? "row-reverse" : "row",
      gap: 8,
    },
    gridActionButton: {
      flex: 1,
      backgroundColor: "#d7bfa9",
      paddingVertical: 8,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    deleteGridButton: {
      backgroundColor: "#ffcdd2",
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
      backgroundColor: "#d7bfa9",
    },
    deleteListButton: {
      backgroundColor: "#ffcdd2",
    },
    listActionText: {
      fontSize: 14,
      fontWeight: "600",
      color: "#4e342e",
      marginRight: isRTL ? 0 : 6,
      marginLeft: isRTL ? 6 : 0,
    },
    deleteListText: {
      color: "#c62828",
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
<<<<<<< HEAD
=======

>>>>>>> 0b17bb2a4cee837c8c038f3d4dc354ab1221e9ef
     inputField: {
  backgroundColor: "#fff",
  borderWidth: 1,
  borderColor: "#ddd",
  padding: 12,
  borderRadius: 10,
  fontSize: 16,
  color: "#4e342e",
  marginBottom: 12,
}
<<<<<<< HEAD
=======

>>>>>>> 0b17bb2a4cee837c8c038f3d4dc354ab1221e9ef
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("admin.productsManagement")}</Text>
        <Text style={styles.headerSubtitle}>{t("admin.productsSubtitle")}</Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            {renderIcon("Search", 20, "#6b4f42")}
            <TextInput
              style={styles.searchTextInput}
              placeholder={t("admin.searchProducts")}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#8d6e63"
            />
          </View>
        </View>

        {/* Filter Header with View Mode */}
        <View style={styles.filterContainer}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>
              {t("admin.filterByCategory")}
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

          {/* Category Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterButtonsContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterButton,
                  selectedCategory === category
                    ? styles.filterButtonActive
                    : styles.filterButtonInactive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                {renderIcon(
                  getCategoryIcon(category),
                  18,
                  selectedCategory === category ? "#fff" : "#2c3e50"
                )}
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedCategory === category
                      ? styles.filterButtonTextActive
                      : styles.filterButtonTextInactive,
                  ]}
                >
                  {category === "all" && t("admin.allProducts")}
                  {category === "hot" && t("admin.hotDrinks")}
                  {category === "cold" && t("admin.coldDrinks")}
                  {category === "food" && t("admin.food")}
                  {category === "snacks" && t("admin.snacks")}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Add Product Button */}
<<<<<<< HEAD
        <TouchableOpacity style={styles.addButton} onPress={() => setFormVisible(true)}>
=======

        <TouchableOpacity style={styles.addButton} onPress={() => setFormVisible(true)}>

>>>>>>> 0b17bb2a4cee837c8c038f3d4dc354ab1221e9ef
          {renderIcon("Plus", 22, "#fff")}
          <Text style={styles.addButtonText}>{t("admin.addNewProduct")}</Text>
        </TouchableOpacity>

        {/* Products List */}
        <View style={styles.productsContainer}>
          {filteredProducts.length > 0 ? (
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
              <Text style={{ fontSize: 64 }}>☕</Text>
              <Text style={styles.emptyStateText}>
                {t("admin.noProductsFound")}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>



<<<<<<< HEAD
=======

>>>>>>> 0b17bb2a4cee837c8c038f3d4dc354ab1221e9ef
 {/* New i added */}
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
      {t("admin.addNewProduct")}
    </Text>

    <TextInput
      placeholder="Product Name"
      value={name}
<<<<<<< HEAD
      // onChangeText={setName}
      onChangeText={(text) => {
        setName(text);
        if (text.trim()) setNameError("");
        }}
      style={styles.inputField}
    />
{nameError ? <Text style={{ color: 'red', marginBottom: 10, marginLeft: 10 }}>{nameError}</Text> : null}
=======
      onChangeText={setName}
      style={styles.inputField}
    />
>>>>>>> 0b17bb2a4cee837c8c038f3d4dc354ab1221e9ef


    <TextInput
      placeholder="Price"
      value={price}
<<<<<<< HEAD
      // onChangeText={setPrice}
      onChangeText={(text) => {
      setPrice(text);
      if (!isNaN(text) && parseFloat(text) > 0) setPriceError("");
      }}
      keyboardType="numeric"
      style={styles.inputField}
    />
    {priceError ? <Text style={{ color: 'red', marginBottom: 10, marginLeft: 10 }}>{priceError}</Text> : null}

    <TextInput
      placeholder="Stock"
      value={stock}
      onChangeText={(text) => {
        setStock(text);
        if (!isNaN(text) && parseInt(text) > 0) setStockError("");
      }}
      keyboardType="numeric"
      style={styles.inputField}
    />
    {stockError ? <Text style={{ color: 'red', marginBottom: 10, marginLeft: 10 }}>{stockError}</Text> : null}


=======
      onChangeText={setPrice}
      keyboardType="numeric"
      style={styles.inputField}
    />
>>>>>>> 0b17bb2a4cee837c8c038f3d4dc354ab1221e9ef
    <TextInput
      placeholder="Description"
      value={description}
      onChangeText={setDescription}
      style={styles.inputField}
    />
<<<<<<< HEAD
  
=======
    <TextInput
      placeholder="Stock"
      value={stock}
      onChangeText={setStock}
      keyboardType="numeric"
      style={styles.inputField}
    />
>>>>>>> 0b17bb2a4cee837c8c038f3d4dc354ab1221e9ef

    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
      <TouchableOpacity
        onPress={handleAddProduct}
        style={[styles.addButton, { flex: 1, marginRight: 6 }]}
      >
        <Text style={styles.addButtonText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setFormVisible(false)}
        style={[styles.addButton, { flex: 1, backgroundColor: "#aaa", marginLeft: 6 }]}
      >
        <Text style={styles.addButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
)}
 {/* New i added */}


    </View>
  );
};

export default ProductsScreen;
