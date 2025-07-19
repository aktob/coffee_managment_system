import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  RefreshControl,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import {
  ClipboardList,
  Clock,
  Timer,
  CheckCircle,
  Search,
  Phone,
  FileText,
  Play,
  Eye,
  DollarSign,
  ShoppingBag,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

// Mock data as fallback
const mockOrders = [
  {
    id: "ORD001",
    customerName: "John Smith",
    customerPhone: "+1 (555) 123-4567",
    items: [
      {
        name: "Espresso",
        quantity: 1,
        price: 2.99,
        description: "Dark roast espresso",
      },
      {
        name: "Croissant",
        quantity: 2,
        price: 4.98,
        description: "Freshly baked croissant",
      },
    ],
    total: 7.97,
    status: "pending",
    time: "2025-07-17T10:30:00Z",
    estimatedTime: "10:45 AM",
    paymentMethod: "Credit Card",
    specialInstructions: "Extra hot espresso",
  },
  // ... (rest of mockOrders)
];

const OrdersScreen = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useSelector((state) => state.language);
  const theme = useSelector((state) => state.theme.mode);
  const isDark = theme === "dark";
  const isRTL = currentLanguage === "ar";
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [orders, setOrders] = useState(mockOrders);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("all");
  const [sort, setSort] = useState("newest");
  const [filterExpanded, setFilterExpanded] = useState(false);
  const toggleFilter = () => setFilterExpanded(!filterExpanded);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const statuses = [
    { key: "all", label: t("worker.allOrders"), icon: "ClipboardList" },
    { key: "pending", label: t("worker.pending"), icon: "Clock" },
    { key: "in-progress", label: t("worker.inProgress"), icon: "Timer" },
    { key: "completed", label: t("worker.completed"), icon: "CheckCircle" },
  ];

  const paymentMethods = [
    { key: "all", label: t("worker.allPayments") },
    { key: "Credit Card", label: t("worker.creditCard") },
    { key: "Cash", label: t("worker.cash") },
    { key: "Mobile Payment", label: t("worker.mobilePayment") },
  ];

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vYXBpLWNvZmZlZS5tLXplZGFuLmNvbS9hcGkvYWRtaW4vYXV0aC9sb2dpbiIsImlhdCI6MTc1Mjg4NDc0NiwiZXhwIjoxNzUyODg4MzQ2LCJuYmYiOjE3NTI4ODQ3NDYsImp0aSI6IkJiZnZzY2p6ME9UQ05rVGQiLCJzdWIiOiIxNSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.kHd1iZQuP5QxWD95nOMMmTVSV2fGDdO6HGynMwMNBb0";
      const response = await fetch("http://api-coffee.m-zedan.com/api/admin/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      console.log("API Response:", data);

      const transformedOrders = data.data.map((order) => ({
        id: order.id,
        customerName: order.created_by?.name || "Unknown",
        customerPhone: order.created_by?.phone || "N/A",
        items: order.items || [], // Default to empty array if items is undefined
        total: parseFloat(order.total) || 0,
        status: order.status || "pending",
        time: order.created_at || new Date().toISOString(),
        estimatedTime: "N/A",
        paymentMethod: order.paymentMethod || "Cash",
        specialInstructions: order.specialInstructions || "",
      }));
      setOrders(transformedOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(t("common.errorFetchingData"));
      setOrders(mockOrders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      fetchOrders();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const startOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "in-progress" } : order
      )
    );
  };

  const completeOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "completed" } : order
      )
    );
  };

  const viewDetails = (order) => {
    navigation.navigate("OrderDetailsScreen", { order });
  };

  const viewProductDetails = (item) => {
    Alert.alert(item.name, item.description || t("worker.noDescription"));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return { backgroundColor: "#fef3c7", textColor: "#92400e" };
      case "in-progress":
        return { backgroundColor: "#dbeafe", textColor: "#1e3a8a" };
      case "completed":
        return { backgroundColor: "#bbf7d0", textColor: "#166534" };
      default:
        return {
          backgroundColor: isDark ? "#2d2d2d" : "#e5e7eb",
          textColor: isDark ? "#ffffff" : "#374151",
        };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return t("worker.statusPending");
      case "in-progress":
        return t("worker.statusInProgress");
      case "completed":
        return t("worker.statusCompleted");
      default:
        return status;
    }
  };

  const getTranslatedPaymentMethod = (method) => {
    const translations = {
      "Credit Card": t("worker.creditCard"),
      Cash: t("worker.cash"),
      "Mobile Payment": t("worker.mobilePayment"),
    };
    return translations[method] || method;
  };

  const getRemainingTime = (estimatedTime) => {
    const now = new Date();
    const estimated = new Date(`2025-07-17 ${estimatedTime}`);
    const diff = Math.max(0, (estimated - now) / 1000 / 60);
    return diff > 0
      ? `${Math.floor(diff)} ${t("common.minutes")}`
      : t("common.ready");
  };

  const filteredOrders = orders.filter(
    (order) =>
      (selectedStatus === "all" || order.status === selectedStatus) &&
      (selectedPaymentMethod === "all" ||
        order.paymentMethod === selectedPaymentMethod) &&
      (order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        ))
  );

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sort === "newest") return new Date(b.time) - new Date(a.time);
    if (sort === "oldest") return new Date(a.time) - new Date(b.time);
    return 0;
  });

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOrderCount = (status) => {
    if (status === "all") return orders.length;
    return orders.filter((order) => order.status === status).length;
  };

  const getTotalRevenue = () => {
    return orders.reduce((total, order) => total + (order.total || 0), 0);
  };

  const renderIcon = (
    iconName,
    size = 24,
    color = isDark ? "#ffffff" : "#4e342e"
  ) => {
    switch (iconName) {
      case "ClipboardList":
        return <ClipboardList size={size} color={color} />;
      case "Clock":
        return <Clock size={size} color={color} />;
      case "Timer":
        return <Timer size={size} color={color} />;
      case "CheckCircle":
        return <CheckCircle size={size} color={color} />;
      case "Search":
        return <Search size={size} color={color} />;
      case "Phone":
        return <Phone size={size} color={color} />;
      case "FileText":
        return <FileText size={size} color={color} />;
      case "Play":
        return <Play size={size} color={color} />;
      case "Eye":
        return <Eye size={size} color={color} />;
      case "DollarSign":
        return <DollarSign size={size} color={color} />;
      case "ShoppingBag":
        return <ShoppingBag size={size} color={color} />;
      default:
        return null;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#1a1a1a" : "#f7f3ef",
    },
    header: {
      paddingTop: 48,
      paddingBottom: 28,
      paddingHorizontal: 20,
      backgroundColor: isDark ? "#2d2d2d" : "#8d6e63",
      borderBottomLeftRadius: 35,
      borderBottomRightRadius: 35,
      marginBottom: 24,
      elevation: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: "800",
      color: isDark ? "#ffffff" : "#fff",
      marginBottom: 8,
      textAlign: isRTL ? "right" : "left",
      letterSpacing: -0.5,
    },
    headerSubtitle: {
      color: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.9)",
      fontSize: 16,
      textAlign: isRTL ? "right" : "left",
      fontWeight: "500",
    },
    scrollContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    statsContainer: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      marginBottom: 28,
    },
    card: {
      flex: 1,
      backgroundColor: isDark ? "#2d2d2d" : "#fffaf5",
      borderRadius: 24,
      padding: 20,
      marginHorizontal: 6,
      elevation: 8,
      borderWidth: 1,
      borderColor: isDark ? "#3d3d3d" : "#e5d4c0",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    cardValue: {
      fontSize: 26,
      fontWeight: "800",
      color: isDark ? "#ffffff" : "#4e342e",
      textAlign: isRTL ? "right" : "left",
    },
    cardLabel: {
      fontSize: 14,
      color: isDark ? "#aaaaaa" : "#6b4f42",
      marginTop: 6,
      textAlign: isRTL ? "right" : "left",
      fontWeight: "600",
    },
    section: {
      marginBottom: 28,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: isDark ? "#ffffff" : "#4e342e",
      marginBottom: 16,
      textAlign: isRTL ? "right" : "left",
      letterSpacing: -0.3,
    },
    inputContainer: {
      backgroundColor: isDark ? "#2d2d2d" : "#fffaf5",
      borderRadius: 25,
      paddingHorizontal: 20,
      paddingVertical: 18,
      elevation: 8,
      borderWidth: 1,
      borderColor: isDark ? "#3d3d3d" : "#e5d4c0",
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    textInput: {
      fontSize: 16,
      color: isDark ? "#ffffff" : "#4e342e",
      flex: 1,
      textAlign: isRTL ? "right" : "left",
      marginRight: isRTL ? 0 : 12,
      marginLeft: isRTL ? 12 : 0,
      fontWeight: "500",
    },
    filterRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      paddingHorizontal: 4,
    },
    statusButton: {
      marginRight: isRTL ? 0 : 12,
      marginLeft: isRTL ? 12 : 0,
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 28,
      elevation: 6,
      backgroundColor: isDark ? "#2d2d2d" : "#fffaf5",
      borderWidth: 1,
      borderColor: isDark ? "#3d3d3d" : "#e5d4c0",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 110,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
    },
    statusButtonSelected: {
      backgroundColor: isDark ? "#4d4d4d" : "#6d4c41",
      borderColor: isDark ? "#4d4d4d" : "#6d4c41",
      elevation: 8,
      shadowOpacity: 0.2,
    },
    statusIcon: {
      marginBottom: 6,
    },
    statusLabel: {
      fontSize: 13,
      fontWeight: "700",
      color: isDark ? "#ffffff" : "#4e342e",
      textAlign: "center",
      marginBottom: 4,
      letterSpacing: 0.2,
    },
    statusLabelSelected: {
      color: "#fff",
    },
    statusCount: {
      fontSize: 11,
      color: isDark ? "#aaaaaa" : "#6b4f42",
      fontWeight: "600",
      backgroundColor: isDark
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(255, 255, 255, 0.2)",
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
    },
    statusCountSelected: {
      color: "#fff",
      backgroundColor: "rgba(255, 255, 255, 0.3)",
    },
    sortContainer: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: isRTL ? "flex-end" : "flex-start",
      marginBottom: 16,
      gap: 12,
    },
    sortButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: isDark ? "#2d2d2d" : "#fffaf5",
      borderWidth: 1,
      borderColor: isDark ? "#3d3d3d" : "#e5d4c0",
    },
    sortButtonSelected: {
      backgroundColor: isDark ? "#4d4d4d" : "#6d4c41",
      borderColor: isDark ? "#4d4d4d" : "#6d4c41",
    },
    sortButtonText: {
      fontSize: 14,
      color: isDark ? "#ffffff" : "#4e342e",
      fontWeight: "600",
    },
    sortButtonTextSelected: {
      color: "#fff",
    },
    errorContainer: {
      backgroundColor: isDark ? "#4b1c1c" : "#fee2e2",
      borderRadius: 20,
      padding: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: isDark ? "#7f2a2a" : "#fecaca",
    },
    errorText: {
      color: isDark ? "#ffffff" : "#b91c1c",
      fontSize: 16,
      textAlign: "center",
      fontWeight: "600",
    },
    ordersContainer: {
      gap: 20,
    },
    orderCard: {
      backgroundColor: isDark ? "#2d2d2d" : "#fffaf5",
      borderRadius: 24,
      padding: 24,
      elevation: 8,
      borderWidth: 1,
      borderColor: isDark ? "#3d3d3d" : "#e5d4c0",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
    },
    orderHeader: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      marginBottom: 16,
      alignItems: "flex-start",
    },
    orderCustomer: {
      fontSize: 20,
      fontWeight: "800",
      color: isDark ? "#ffffff" : "#4e342e",
      textAlign: isRTL ? "right" : "left",
      letterSpacing: -0.3,
    },
    orderId: {
      fontSize: 16,
      color: isDark ? "#aaaaaa" : "#6b4f42",
      marginBottom: 6,
      textAlign: isRTL ? "right" : "left",
      fontWeight: "600",
    },
    orderPhone: {
      fontSize: 14,
      color: isDark ? "#aaaaaa" : "#6b4f42",
      textAlign: isRTL ? "right" : "left",
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
    },
    statusBadge: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 22,
      alignSelf: "flex-start",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 4,
    },
    statusBadgeText: {
      fontWeight: "700",
      fontSize: 12,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    orderItemsContainer: {
      backgroundColor: isDark ? "#3d3d3d" : "#f7f3ef",
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: isDark ? "#4d4d4d" : "#e5d4c0",
    },
    orderItemsTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: isDark ? "#ffffff" : "#4e342e",
      marginBottom: 12,
      textAlign: isRTL ? "right" : "left",
      letterSpacing: -0.3,
    },
    orderItemRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      marginBottom: 8,
      alignItems: "center",
    },
    orderItemName: {
      fontSize: 15,
      color: isDark ? "#ffffff" : "#4e342e",
      fontWeight: "600",
      textAlign: isRTL ? "right" : "left",
    },
    orderItemPrice: {
      fontSize: 15,
      color: isDark ? "#aaaaaa" : "#6b4f42",
      fontWeight: "700",
      textAlign: isRTL ? "right" : "left",
    },
    orderDetailsContainer: {
      backgroundColor: isDark ? "#3d3d3d" : "#e7d7c9",
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: isDark ? "#4d4d4d" : "#e5d4c0",
    },
    detailRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      marginBottom: 12,
      alignItems: "center",
    },
    detailLabel: {
      fontSize: 14,
      color: isDark ? "#aaaaaa" : "#6b4f42",
      textAlign: isRTL ? "right" : "left",
      fontWeight: "600",
    },
    detailValue: {
      fontSize: 14,
      color: isDark ? "#ffffff" : "#4e342e",
      fontWeight: "700",
      textAlign: isRTL ? "right" : "left",
    },
    totalLabel: {
      fontSize: 16,
      fontWeight: "800",
      color: isDark ? "#ffffff" : "#4e342e",
      textAlign: isRTL ? "right" : "left",
    },
    totalValue: {
      fontSize: 20,
      fontWeight: "800",
      color: isDark ? "#cccccc" : "#6d4c41",
      textAlign: isRTL ? "right" : "left",
    },
    instructionsContainer: {
      backgroundColor: isDark ? "#3d3d3d" : "#fff4e5",
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: isDark ? "#4d4d4d" : "#e5d4c0",
    },
    instructionsTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: isDark ? "#ffffff" : "#4e342e",
      marginBottom: 8,
      textAlign: isRTL ? "right" : "left",
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
    },
    instructionsText: {
      fontSize: 15,
      color: isDark ? "#aaaaaa" : "#6b4f42",
      textAlign: isRTL ? "right" : "left",
      lineHeight: 22,
      fontWeight: "500",
    },
    actionsRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      marginTop: 12,
      gap: 16,
    },
    startButton: {
      flex: 1,
      backgroundColor: isDark ? "#4d4d4d" : "#6d4c41",
      padding: 16,
      borderRadius: 20,
      alignItems: "center",
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "center",
      elevation: 6,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
    },
    completeButton: {
      flex: 1,
      backgroundColor: isDark ? "#4d4d4d" : "#8d6e63",
      padding: 16,
      borderRadius: 20,
      alignItems: "center",
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "center",
      elevation: 6,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
    },
    detailsButton: {
      backgroundColor: isDark ? "#3d3d3d" : "#d7bfa9",
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderRadius: 20,
      alignItems: "center",
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "center",
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      borderWidth: 1,
      borderColor: isDark ? "#4d4d4d" : "#e5d4c0",
    },
    actionButtonText: {
      color: "#fff",
      fontWeight: "700",
      marginRight: isRTL ? 0 : 8,
      marginLeft: isRTL ? 8 : 0,
      fontSize: 15,
      letterSpacing: 0.3,
    },
    detailsButtonText: {
      color: isDark ? "#ffffff" : "#4e342e",
      fontWeight: "700",
      marginRight: isRTL ? 0 : 8,
      marginLeft: isRTL ? 8 : 0,
      fontSize: 15,
      letterSpacing: 0.3,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("worker.orders")}</Text>
        <Text style={styles.headerSubtitle}>
          {t("worker.manageAndTrackOrders")}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchOrders}
            tintColor={isDark ? "#ffffff" : "#8d6e63"}
            colors={[isDark ? "#ffffff" : "#8d6e63"]}
          />
        }
      >
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* اجمالي الطلبات و اجمالي الايرادات */}
        <View style={styles.statsContainer}>
          <View style={styles.card}>
            <Text style={styles.cardValue}>{orders.length}</Text>
            <Text style={styles.cardLabel}>{t("worker.totalOrders")}</Text>
          </View>
          <View style={styles.card}>
            <Text
              style={[
                styles.cardValue,
                { color: isDark ? "#cccccc" : "#6d4c41" },
              ]}
            >
              ${getTotalRevenue().toFixed(2)}
            </Text>
            <Text style={styles.cardLabel}>{t("worker.totalRevenue")}</Text>
          </View>
        </View>

        {/* search box */}
        <View style={styles.section}>
          <View style={styles.inputContainer}>
            {renderIcon("Search", 20, isDark ? "#ffffff" : "#6b4f42")}
            <TextInput
              style={styles.textInput}
              placeholder={t("worker.searchOrdersByCustomer")}
              placeholderTextColor={isDark ? "#aaaaaa" : "#9CA3AF"}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* قسم الفلترة السريعة */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={toggleFilter}
          >
            <Text style={styles.textInput}>{t("worker.filterOptions")}</Text>
          </TouchableOpacity>

          {filterExpanded && (
            <View style={{ marginTop: 12 }}>
              {/* // فیلتر حسب الوضع */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {t("worker.filterByStatus")}
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  inverted={isRTL}
                  contentContainerStyle={
                    isRTL ? { flexDirection: "row-reverse" } : {}
                  }
                >
                  <View style={styles.filterRow}>
                    {statuses.map((status) => (
                      <TouchableOpacity
                        key={status.key}
                        onPress={() => setSelectedStatus(status.key)}
                        style={[
                          styles.statusButton,
                          selectedStatus === status.key &&
                            styles.statusButtonSelected,
                        ]}
                      >
                        <View style={styles.statusIcon}>
                          {renderIcon(
                            status.icon,
                            20,
                            selectedStatus === status.key
                              ? "#fff"
                              : isDark
                                ? "#ffffff"
                                : "#4e342e"
                          )}
                        </View>
                        <Text
                          style={[
                            styles.statusLabel,
                            selectedStatus === status.key &&
                              styles.statusLabelSelected,
                          ]}
                        >
                          {status.label}
                        </Text>
                        <Text
                          style={[
                            styles.statusCount,
                            selectedStatus === status.key &&
                              styles.statusCountSelected,
                          ]}
                        >
                          {getOrderCount(status.key)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* // فیلتر حسب طريقة الدفع */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {t("worker.filterByPayment")}
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  inverted={isRTL}
                  contentContainerStyle={
                    isRTL ? { flexDirection: "row-reverse" } : {}
                  }
                >
                  <View style={styles.filterRow}>
                    {paymentMethods.map((method) => (
                      <TouchableOpacity
                        key={method.key}
                        onPress={() => setSelectedPaymentMethod(method.key)}
                        style={[
                          styles.statusButton,
                          selectedPaymentMethod === method.key &&
                            styles.statusButtonSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusLabel,
                            selectedPaymentMethod === method.key &&
                              styles.statusLabelSelected,
                          ]}
                        >
                          {method.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* // فلتر حسب الاقدميه */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t("worker.sortby")}</Text>
                <View style={styles.sortContainer}>
                  <TouchableOpacity
                    style={[
                      styles.sortButton,
                      sort === "newest" && styles.sortButtonSelected,
                    ]}
                    onPress={() => setSort("newest")}
                  >
                    <Text
                      style={[
                        styles.sortButtonText,
                        sort === "newest" && styles.sortButtonTextSelected,
                      ]}
                    >
                      {t("worker.sortNewest")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.sortButton,
                      sort === "oldest" && styles.sortButtonSelected,
                    ]}
                    onPress={() => setSort("oldest")}
                  >
                    <Text
                      style={[
                        styles.sortButtonText,
                        sort === "oldest" && styles.sortButtonTextSelected,
                      ]}
                    >
                      {t("worker.sortOldest")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("worker.orders")} ({sortedOrders.length})
          </Text>
          <View style={styles.ordersContainer}>
            {sortedOrders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const statusStyle = getStatusColor(order.status);

              return (
                <TouchableOpacity
                  key={order.id}
                  onPress={() =>
                    setExpandedOrderId(isExpanded ? null : order.id)
                  }
                  style={styles.orderCard}
                  activeOpacity={0.8}
                >
                  {/* ===== رأس الطلب ===== */}
                  <View style={styles.orderHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.orderCustomer}>
                        {order.customerName}
                      </Text>
                      <Text style={styles.orderId}>
                        {t("worker.orderId")}: {order.id}
                      </Text>
                      <View
                        style={{
                          flexDirection: isRTL ? "row-reverse" : "row",
                          alignItems: "center",
                        }}
                      >
                        {renderIcon(
                          "Phone",
                          14,
                          isDark ? "#aaaaaa" : "#6b4f42"
                        )}
                        <Text style={styles.orderPhone}>
                          {order.customerPhone}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: statusStyle.backgroundColor },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          { color: statusStyle.textColor },
                        ]}
                      >
                        {getStatusText(order.status)}
                      </Text>
                    </View>
                  </View>

                  {/* ===== التفاصيل (تظهر فقط لو Expanded) ===== */}
                  {isExpanded && (
                    <>
                      {/* المنتجات */}
                      <View style={styles.orderItemsContainer}>
                        <View
                          style={{
                            flexDirection: isRTL ? "row-reverse" : "row",
                            alignItems: "center",
                            marginBottom: 12,
                          }}
                        >
                          {renderIcon(
                            "ShoppingBag",
                            18,
                            isDark ? "#ffffff" : "#4e342e"
                          )}
                          <Text style={styles.orderItemsTitle}>
                            {t("worker.orderItemsTitle")}
                          </Text>
                        </View>
                        {order.items?.map((item, idx) => (
                          <TouchableOpacity
                            key={idx}
                            style={styles.orderItemRow}
                            onPress={() => viewProductDetails(item)}
                          >
                            <Text style={styles.orderItemName}>
                              {item.quantity}x {item.name}
                            </Text>
                            <Text style={styles.orderItemPrice}>
                              ${(item.price ?? 0).toFixed(2)}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>

                      {/* التفاصيل العامة */}
                      <View style={styles.orderDetailsContainer}>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>
                            {t("worker.orderTime")}
                          </Text>
                          <Text style={styles.detailValue}>
                            {formatTime(order.time)}
                          </Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>
                            {t("worker.estimatedReady")}
                          </Text>
                          <Text
                            style={[
                              styles.detailValue,
                              { color: isDark ? "#cccccc" : "#6d4c41" },
                            ]}
                          >
                            {order.estimatedTime}
                          </Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>
                            {t("worker.timeRemaining")}
                          </Text>
                          <Text style={styles.detailValue}>
                            {getRemainingTime(order.estimatedTime)}
                          </Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>
                            {t("worker.payment")}
                          </Text>
                          <Text style={styles.detailValue}>
                            {getTranslatedPaymentMethod(order.paymentMethod)}
                          </Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.totalLabel}>
                            {t("common.total")}:
                          </Text>
                          <Text style={styles.totalValue}>
                            ${(order.total ?? 0).toFixed(2)}
                          </Text>
                        </View>
                      </View>

                      {/* تعليمات خاصة */}
                      {order.specialInstructions ? (
                        <View style={styles.instructionsContainer}>
                          <View
                            style={{
                              flexDirection: isRTL ? "row-reverse" : "row",
                              alignItems: "center",
                              marginBottom: 8,
                            }}
                          >
                            {renderIcon(
                              "FileText",
                              16,
                              isDark ? "#ffffff" : "#4e342e"
                            )}
                            <Text style={styles.instructionsTitle}>
                              {t("worker.specialInstructions")}:
                            </Text>
                          </View>
                          <Text style={styles.instructionsText}>
                            {order.specialInstructions}
                          </Text>
                        </View>
                      ) : null}

                      {/* أزرار العمليات */}
                      {order.status !== "completed" && (
                        <View style={styles.actionsRow}>
                          {order.status === "pending" && (
                            <TouchableOpacity
                              style={styles.startButton}
                              onPress={() => startOrder(order.id)}
                            >
                              {renderIcon("Play", 16, "#fff")}
                              <Text style={styles.actionButtonText}>
                                {t("worker.startOrderButton")}
                              </Text>
                            </TouchableOpacity>
                          )}
                          {order.status === "in-progress" && (
                            <TouchableOpacity
                              style={styles.completeButton}
                              onPress={() => completeOrder(order.id)}
                            >
                              {renderIcon("CheckCircle", 16, "#fff")}
                              <Text style={styles.actionButtonText}>
                                {t("worker.completeOrderButton")}
                              </Text>
                            </TouchableOpacity>
                          )}
                          <TouchableOpacity
                            style={styles.detailsButton}
                            onPress={() => viewDetails(order)}
                          >
                            {renderIcon(
                              "Eye",
                              16,
                              isDark ? "#ffffff" : "#4e342e"
                            )}
                            <Text style={styles.detailsButtonText}>
                              {t("worker.detailsButton")}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OrdersScreen;