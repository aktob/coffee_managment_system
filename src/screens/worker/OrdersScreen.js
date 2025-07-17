import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
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

const OrdersScreen = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useSelector((state) => state.language);
  const isRTL = currentLanguage === "ar";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const orders = [
    {
      id: "ORD001",
      customerName: "John Smith",
      customerPhone: "+1 (555) 123-4567",
      items: [
        { name: "Espresso", quantity: 1, price: 2.99 },
        { name: "Croissant", quantity: 2, price: 4.98 },
      ],
      total: 7.97,
      status: "pending",
      time: "2024-01-20T10:30:00Z",
      estimatedTime: "10:45 AM",
      paymentMethod: "Credit Card",
      specialInstructions: "Extra hot espresso",
    },
    {
      id: "ORD002",
      customerName: "Sarah Johnson",
      customerPhone: "+1 (555) 234-5678",
      items: [
        { name: "Latte", quantity: 2, price: 7.98 },
        { name: "Muffin", quantity: 1, price: 2.99 },
      ],
      total: 10.97,
      status: "in-progress",
      time: "2024-01-20T10:25:00Z",
      estimatedTime: "10:40 AM",
      paymentMethod: "Cash",
      specialInstructions: "No foam on lattes",
    },
    {
      id: "ORD003",
      customerName: "Mike Brown",
      customerPhone: "+1 (555) 345-6789",
      items: [
        { name: "Cappuccino", quantity: 1, price: 3.99 },
        { name: "Sandwich", quantity: 1, price: 5.99 },
      ],
      total: 9.98,
      status: "completed",
      time: "2024-01-20T10:15:00Z",
      estimatedTime: "10:30 AM",
      paymentMethod: "Mobile Payment",
      specialInstructions: "",
    },
    {
      id: "ORD004",
      customerName: "Emily Davis",
      customerPhone: "+1 (555) 456-7890",
      items: [
        { name: "Iced Latte", quantity: 1, price: 4.49 },
        { name: "Frappuccino", quantity: 1, price: 4.99 },
        { name: "Cookie", quantity: 2, price: 3.98 },
      ],
      total: 13.46,
      status: "pending",
      time: "2024-01-20T10:35:00Z",
      estimatedTime: "10:50 AM",
      paymentMethod: "Credit Card",
      specialInstructions: "Light ice in iced latte",
    },
  ];

  const statuses = [
    { key: "all", label: t("worker.allOrders"), icon: "ClipboardList" },
    { key: "pending", label: t("worker.pending"), icon: "Clock" },
    {
      key: "in-progress",
      label: t("worker.inProgress"),
      icon: "Timer",
    },
    { key: "completed", label: t("worker.completed"), icon: "CheckCircle" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return { backgroundColor: "#fef3c7", textColor: "#92400e" };
      case "in-progress":
        return { backgroundColor: "#dbeafe", textColor: "#1e3a8a" };
      case "completed":
        return { backgroundColor: "#bbf7d0", textColor: "#166534" };
      default:
        return { backgroundColor: "#e5e7eb", textColor: "#374151" };
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

  const filteredOrders = orders.filter(
    (order) =>
      (selectedStatus === "all" || order.status === selectedStatus) &&
      (order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
    return orders.reduce((total, order) => total + order.total, 0);
  };

  const renderIcon = (iconName, size = 24, color = "#4e342e") => {
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
      backgroundColor: "#f7f3ef",
    },
    header: {
      paddingTop: 48,
      paddingBottom: 28,
      paddingHorizontal: 20,
      backgroundColor: "#8d6e63",
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
      color: "#fff",
      marginBottom: 8,
      textAlign: isRTL ? "right" : "left",
      letterSpacing: -0.5,
    },
    headerSubtitle: {
      color: "rgba(255, 255, 255, 0.9)",
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
      backgroundColor: "#fffaf5",
      borderRadius: 24,
      padding: 20,
      marginHorizontal: 6,
      elevation: 8,
      borderWidth: 1,
      borderColor: "#e5d4c0",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    cardValue: {
      fontSize: 26,
      fontWeight: "800",
      color: "#4e342e",
      textAlign: isRTL ? "right" : "left",
    },
    cardLabel: {
      fontSize: 14,
      color: "#6b4f42",
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
      color: "#4e342e",
      marginBottom: 16,
      textAlign: isRTL ? "right" : "left",
      letterSpacing: -0.3,
    },
    inputContainer: {
      backgroundColor: "#fffaf5",
      borderRadius: 25,
      paddingHorizontal: 20,
      paddingVertical: 18,
      elevation: 8,
      borderWidth: 1,
      borderColor: "#e5d4c0",
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    textInput: {
      fontSize: 16,
      color: "#4e342e",
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
      backgroundColor: "#fffaf5",
      borderWidth: 1,
      borderColor: "#e5d4c0",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 110,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
    },
    statusButtonSelected: {
      backgroundColor: "#6d4c41",
      borderColor: "#6d4c41",
      elevation: 8,
      shadowOpacity: 0.2,
    },
    statusIcon: {
      marginBottom: 6,
    },
    statusLabel: {
      fontSize: 13,
      fontWeight: "700",
      color: "#4e342e",
      textAlign: "center",
      marginBottom: 4,
      letterSpacing: 0.2,
    },
    statusLabelSelected: {
      color: "#fff",
    },
    statusCount: {
      fontSize: 11,
      color: "#6b4f42",
      fontWeight: "600",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
    },
    statusCountSelected: {
      color: "#fff",
      backgroundColor: "rgba(255, 255, 255, 0.3)",
    },
    ordersContainer: {
      gap: 20,
    },
    orderCard: {
      backgroundColor: "#fffaf5",
      borderRadius: 24,
      padding: 24,
      elevation: 8,
      borderWidth: 1,
      borderColor: "#e5d4c0",
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
      color: "#4e342e",
      textAlign: isRTL ? "right" : "left",
      letterSpacing: -0.3,
    },
    orderId: {
      fontSize: 16,
      color: "#6b4f42",
      marginBottom: 6,
      textAlign: isRTL ? "right" : "left",
      fontWeight: "600",
    },
    orderPhone: {
      fontSize: 14,
      color: "#6b4f42",
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
      backgroundColor: "#f7f3ef",
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: "#e5d4c0",
    },
    orderItemsTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: "#4e342e",
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
      color: "#4e342e",
      fontWeight: "600",
      textAlign: isRTL ? "right" : "left",
    },
    orderItemPrice: {
      fontSize: 15,
      color: "#6b4f42",
      fontWeight: "700",
      textAlign: isRTL ? "right" : "left",
    },
    orderDetailsContainer: {
      backgroundColor: "#e7d7c9",
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: "#e5d4c0",
    },
    detailRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      marginBottom: 12,
      alignItems: "center",
    },
    detailLabel: {
      fontSize: 14,
      color: "#6b4f42",
      textAlign: isRTL ? "right" : "left",
      fontWeight: "600",
    },
    detailValue: {
      fontSize: 14,
      color: "#4e342e",
      fontWeight: "700",
      textAlign: isRTL ? "right" : "left",
    },
    totalLabel: {
      fontSize: 16,
      fontWeight: "800",
      color: "#4e342e",
      textAlign: isRTL ? "right" : "left",
    },
    totalValue: {
      fontSize: 20,
      fontWeight: "800",
      color: "#6d4c41",
      textAlign: isRTL ? "right" : "left",
    },
    instructionsContainer: {
      backgroundColor: "#fff4e5",
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: "#e5d4c0",
    },
    instructionsTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: "#4e342e",
      marginBottom: 8,
      textAlign: isRTL ? "right" : "left",
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
    },
    instructionsText: {
      fontSize: 15,
      color: "#6b4f42",
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
      backgroundColor: "#6d4c41",
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
      backgroundColor: "#8d6e63",
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
      backgroundColor: "#d7bfa9",
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
      borderColor: "#e5d4c0",
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
      color: "#4e342e",
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
      >
        <View style={styles.statsContainer}>
          <View style={styles.card}>
            <Text style={styles.cardValue}>{orders.length}</Text>
            <Text style={styles.cardLabel}>{t("worker.totalOrders")}</Text>
          </View>
          <View style={styles.card}>
            <Text style={[styles.cardValue, { color: "#6d4c41" }]}>
              ${getTotalRevenue().toFixed(2)}
            </Text>
            <Text style={styles.cardLabel}>{t("worker.totalRevenue")}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.inputContainer}>
            {renderIcon("Search", 20, "#6b4f42")}
            <TextInput
              style={styles.textInput}
              placeholder={t("worker.searchOrdersByCustomer")}
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("worker.filterByStatus")}</Text>
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
                      selectedStatus === status.key ? "#fff" : "#4e342e"
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("worker.orders")} ({filteredOrders.length})
          </Text>
          <View style={styles.ordersContainer}>
            {filteredOrders.map((order) => {
              const statusStyle = getStatusColor(order.status);

              return (
                <View key={order.id} style={styles.orderCard}>
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
                        {renderIcon("Phone", 14, "#6b4f42")}
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

                  <View style={styles.orderItemsContainer}>
                    <View
                      style={{
                        flexDirection: isRTL ? "row-reverse" : "row",
                        alignItems: "center",
                        marginBottom: 12,
                      }}
                    >
                      {renderIcon("ShoppingBag", 18, "#4e342e")}
                      <Text style={styles.orderItemsTitle}>
                        {t("worker.orderItemsTitle")}
                      </Text>
                    </View>
                    {order.items.map((item, idx) => (
                      <View key={idx} style={styles.orderItemRow}>
                        <Text style={styles.orderItemName}>
                          {item.quantity}x {item.name}
                        </Text>
                        <Text style={styles.orderItemPrice}>
                          ${item.price.toFixed(2)}
                        </Text>
                      </View>
                    ))}
                  </View>

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
                      <Text style={[styles.detailValue, { color: "#6d4c41" }]}>
                        {order.estimatedTime}
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
                        ${order.total.toFixed(2)}
                      </Text>
                    </View>
                  </View>

                  {order.specialInstructions ? (
                    <View style={styles.instructionsContainer}>
                      <View
                        style={{
                          flexDirection: isRTL ? "row-reverse" : "row",
                          alignItems: "center",
                          marginBottom: 8,
                        }}
                      >
                        {renderIcon("FileText", 16, "#4e342e")}
                        <Text style={styles.instructionsTitle}>
                          {t("worker.specialInstructions")}:
                        </Text>
                      </View>
                      <Text style={styles.instructionsText}>
                        {order.specialInstructions}
                      </Text>
                    </View>
                  ) : null}

                  {order.status !== "completed" && (
                    <View style={styles.actionsRow}>
                      {order.status === "pending" && (
                        <TouchableOpacity style={styles.startButton}>
                          {renderIcon("Play", 16, "#fff")}
                          <Text style={styles.actionButtonText}>
                            {t("worker.startOrderButton")}
                          </Text>
                        </TouchableOpacity>
                      )}
                      {order.status === "in-progress" && (
                        <TouchableOpacity style={styles.completeButton}>
                          {renderIcon("CheckCircle", 16, "#fff")}
                          <Text style={styles.actionButtonText}>
                            {t("worker.completeOrderButton")}
                          </Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity style={styles.detailsButton}>
                        {renderIcon("Eye", 16, "#4e342e")}
                        <Text style={styles.detailsButtonText}>
                          {t("worker.detailsButton")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OrdersScreen;
