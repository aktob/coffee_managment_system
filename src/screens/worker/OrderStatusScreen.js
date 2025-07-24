import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";
import {
  Phone,
  CreditCard,
  ChefHat,
  CheckCircle,
  Coffee,
  Timer,
  ClipboardCheck,
  X,
  Clock,
  User,
  Package,
  AlertCircle,
  Star,
  DollarSign,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

const OrderStatusScreen = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useSelector((state) => state.language);
  const isRTL = currentLanguage === "ar";
  const route = useRoute();
  const orderId = route.params?.orderId || "ORD001";


  const order = {
    id: orderId,
    customerName: "John Smith",
    customerPhone: "+1 (555) 123-4567",
    items: [
      { name: "Espresso", quantity: 1, status: "completed", price: 2.99 },
      { name: "Croissant", quantity: 2, status: "in-progress", price: 4.98 },
      { name: "Cappuccino", quantity: 1, status: "pending", price: 3.99 },
    ],
    total: 11.96,
    status: "in-progress",
    time: "2024-01-20T10:30:00Z",
    estimatedCompletion: "10:45 AM",
    steps: [
      {
        id: 1,
        title: t("worker.orderReceived"),
        description: t("worker.orderConfirmed"),
        time: "10:30 AM",
        completed: true,
        icon: "ClipboardCheck",
      },
      {
        id: 2,
        title: t("worker.paymentProcessed"),
        description: t("worker.paymentSuccessful"),
        time: "10:31 AM",
        completed: true,
        icon: "CreditCard",
      },
      {
        id: 3,
        title: t("worker.preparingOrder"),
        description: t("worker.orderBeingPrepared"),
        time: "10:35 AM",
        completed: true,
        icon: "ChefHat",
      },
      {
        id: 4,
        title: t("worker.qualityCheck"),
        description: t("worker.checkingOrder"),
        time: null,
        completed: false,
        icon: "CheckCircle",
      },
      {
        id: 5,
        title: t("worker.readyForPickup"),
        description: t("worker.orderReady"),
        time: null,
        completed: false,
        icon: "Coffee",
      },
    ],
  };


  const [orderData, setOrderData] = useState(order);
  const [actionsVisible, setActionsVisible] = useState(true);

  const getTranslatedProductName = (productName) => {
    const translations = {
      Espresso: t("worker.espresso"),
      Croissant: t("worker.croissant"),
      Cappuccino: t("worker.cappuccino"),
    };
    return translations[productName] || productName;
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "completed":
        return { bg: "#bbf7d0", color: "#166534", icon: "CheckCircle" };
      case "in-progress":
        return { bg: "#dbeafe", color: "#1e3a8a", icon: "Clock" };
      case "pending":
        return { bg: "#fef3c7", color: "#92400e", icon: "AlertCircle" };
      default:
        return { bg: "#e5e7eb", color: "#374151", icon: "AlertCircle" };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return t("worker.statusCompleted");
      case "in-progress":
        return t("worker.statusInProgress");
      case "pending":
        return t("worker.statusPending");
      default:
        return status;
    }
  };

  const renderIcon = (iconName, size = 24, color = "#4e342e") => {
    switch (iconName) {
      case "Phone":
        return <Phone size={size} color={color} />;
      case "CreditCard":
        return <CreditCard size={size} color={color} />;
      case "ChefHat":
        return <ChefHat size={size} color={color} />;
      case "CheckCircle":
        return <CheckCircle size={size} color={color} />;
      case "Coffee":
        return <Coffee size={size} color={color} />;
      case "Timer":
        return <Timer size={size} color={color} />;
      case "ClipboardCheck":
        return <ClipboardCheck size={size} color={color} />;
      case "X":
        return <X size={size} color={color} />;
      case "Clock":
        return <Clock size={size} color={color} />;
      case "User":
        return <User size={size} color={color} />;
      case "Package":
        return <Package size={size} color={color} />;
      case "AlertCircle":
        return <AlertCircle size={size} color={color} />;
      case "Star":
        return <Star size={size} color={color} />;
      case "DollarSign":
        return <DollarSign size={size} color={color} />;
      default:
        return null;
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCancelOrder = () => {
  Alert.alert(t("worker.cancelOrder"), t("worker.cancelOrderConfirm"), [
    {
      text: t("common.cancel"),
      style: "cancel",
    },
    {
      text: t("worker.cancelOrder"),
      style: "destructive",
      onPress: () => {
        
        // حزف الأوردر من الليست
        setOrderData(null); // 👈 يخفي الطلب من الشاشة
        // إخفاء الزرارين بعد الإلغاء
        setActionsVisible(false);
      },
    },
  ]);
};


const handleMarkReady = () => {
  const updatedSteps = orderData.steps.map((step) => ({
    ...step,
    completed: true,
    time: step.time || new Date().toLocaleTimeString(),
  }));

  setOrderData((prevOrder) => ({
    ...prevOrder,
    steps: updatedSteps,
  }));

    setActionsVisible(false); // 👈 إخفاء الأزرار
};


  const handleMarkComplete = (stepId) => {
     const updatedSteps = orderData.steps.map((step) =>
    step.id === stepId ? { ...step, completed: true, time: new Date().toLocaleTimeString() } : step
  );

    setOrderData((prevOrder) => ({
    ...prevOrder,
    steps: updatedSteps,
  }));

  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f7f3ef",
    },
    header: {
      paddingTop: 60,
      paddingBottom: 24,
      paddingHorizontal: 16,
      backgroundColor: "#8d6e63",
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      elevation: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
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
    scrollContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    card: {
      backgroundColor: "#fffaf5",
      borderRadius: 24,
      padding: 20,
      marginTop: 10,
      elevation: 6,
      borderWidth: 1,
      borderColor: "#e5d4c0",
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    orderHeader: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 16,
    },
    orderInfo: {
      flex: 1,
      marginRight: isRTL ? 0 : 12,
      marginLeft: isRTL ? 12 : 0,
    },
    orderCustomer: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#4e342e",
      marginBottom: 4,
      textAlign: isRTL ? "right" : "left",
    },
    orderId: {
      fontSize: 16,
      color: "#6b4f42",
      marginBottom: 8,
      textAlign: isRTL ? "right" : "left",
    },
    orderPhone: {
      fontSize: 14,
      color: "#6b4f42",
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
    },
    statusBadge: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      minWidth: 100,
      elevation: 3,
    },
    statusBadgeText: {
      fontWeight: "700",
      fontSize: 14,
      textTransform: "capitalize",
    },
    sectionDivider: {
      borderBottomWidth: 1,
      borderColor: "#e5d4c0",
      marginVertical: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#4e342e",
      marginBottom: 12,
      textAlign: isRTL ? "right" : "left",
    },
    itemRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: "#f7f3ef",
      borderRadius: 12,
    },
    itemInfo: {
      flex: 1,
      marginRight: isRTL ? 0 : 12,
      marginLeft: isRTL ? 12 : 0,
    },
    itemName: {
      fontSize: 16,
      fontWeight: "600",
      color: "#4e342e",
      textAlign: isRTL ? "right" : "left",
    },
    itemPrice: {
      fontSize: 14,
      color: "#6b4f42",
      marginTop: 2,
      textAlign: isRTL ? "right" : "left",
    },
    itemStatusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
    },
    itemStatusText: {
      fontSize: 12,
      fontWeight: "700",
      textTransform: "capitalize",
      marginRight: isRTL ? 0 : 4,
      marginLeft: isRTL ? 4 : 0,
    },
    detailRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
      paddingVertical: 4,
    },
    detailLabel: {
      fontSize: 15,
      color: "#6b4f42",
      textAlign: isRTL ? "right" : "left",
    },
    detailValue: {
      fontSize: 15,
      fontWeight: "600",
      color: "#4e342e",
      textAlign: isRTL ? "right" : "left",
    },
    totalRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 2,
      borderTopColor: "#e5d4c0",
    },
    totalLabel: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#4e342e",
      textAlign: isRTL ? "right" : "left",
    },
    totalValue: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#6d4c41",
      textAlign: isRTL ? "right" : "left",
    },
    progressTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#4e342e",
      marginBottom: 16,
      textAlign: isRTL ? "right" : "left",
    },
    stepRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "flex-start",
      marginBottom: 24,
    },
    timeline: {
      alignItems: "center",
      marginRight: isRTL ? 0 : 16,
      marginLeft: isRTL ? 16 : 0,
    },
    stepIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    timelineLine: {
      width: 3,
      flex: 1,
      backgroundColor: "#d1d5db",
      borderRadius: 2,
    },
    stepContent: {
      flex: 1,
    },
    stepHeader: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6,
    },
    stepTitle: {
      fontSize: 18,
      fontWeight: "bold",
      textAlign: isRTL ? "right" : "left",
    },
    stepTime: {
      fontSize: 13,
      color: "#6b4f42",
      textAlign: isRTL ? "right" : "left",
    },
    stepDescription: {
      fontSize: 14,
      color: "#6b4f42",
      marginBottom: 8,
      textAlign: isRTL ? "right" : "left",
      lineHeight: 20,
    },
    completeButton: {
      backgroundColor: "#6d4c41",
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 16,
      alignItems: "center",
      alignSelf: isRTL ? "flex-end" : "flex-start",
      elevation: 3,
    },
    completeButtonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 14,
    },
    actionsRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      marginBottom: 32,
      gap: 12,
    },
    actionButton: {
      flex: 1,
      padding: 18,
      borderRadius: 20,
      alignItems: "center",
      elevation: 6,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      flexDirection: isRTL ? "row-reverse" : "row",
    },
    actionButtonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
      marginRight: isRTL ? 0 : 8,
      marginLeft: isRTL ? 8 : 0,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("worker.orderStatus")}</Text>
        <Text style={styles.headerSubtitle}>
          {t("worker.trackOrderProgress")}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Info */}
        <View style={styles.card}>
          <View style={styles.orderHeader}>
            <View style={styles.orderInfo}>
              <Text style={styles.orderCustomer}>{order.customerName}</Text>
              <Text style={styles.orderId}>{order.id}</Text>
              <View style={styles.orderPhone}>
                {renderIcon("Phone", 16, "#6b4f42")}
                <Text
                  style={{
                    marginLeft: isRTL ? 0 : 8,
                    marginRight: isRTL ? 8 : 0,
                  }}
                >
                  {order.customerPhone}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusStyle(order.status).bg },
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  { color: getStatusStyle(order.status).color },
                ]}
              >
                {getStatusText(order.status)}
              </Text>
            </View>
          </View>

          <View style={styles.sectionDivider} />
          <Text style={styles.sectionTitle}>{t("worker.orderItems")}</Text>
          {order.items.map((item, idx) => {
            const status = getStatusStyle(item.status);
            return (
              <View key={idx} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>
                    {item.quantity}x {getTranslatedProductName(item.name)}
                  </Text>
                  <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                </View>
                <View
                  style={[
                    styles.itemStatusBadge,
                    { backgroundColor: status.bg },
                  ]}
                >
                  {renderIcon(status.icon, 12, status.color)}
                  <Text
                    style={[styles.itemStatusText, { color: status.color }]}
                  >
                    {getStatusText(item.status)}
                  </Text>
                </View>
              </View>
            );
          })}

          <View style={styles.sectionDivider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t("worker.orderTime")}</Text>
            <Text style={styles.detailValue}>{formatTime(order.time)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t("worker.estimatedReady")}</Text>
            <Text style={[styles.detailValue, { color: "#6d4c41" }]}>
              {order.estimatedCompletion}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{t("worker.total")}</Text>
            <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Progress Timeline */}
        <Text style={styles.progressTitle}>{t("worker.orderProgress")}</Text>
        {orderData && (
        <View style={styles.card}>
          {orderData.steps.map((step, idx) => {
            return (
              <View key={step.id} style={styles.stepRow}>
                <View style={styles.timeline}>
                  <View
                    style={[
                      styles.stepIconContainer,
                      {
                        backgroundColor: step.completed ? "#6d4c41" : "#d1d5db",
                      },
                    ]}
                  >
                    {renderIcon(step.icon, 24, "#fff")}
                  </View>
                  {idx < orderData.steps.length - 1 && (
                    <View style={styles.timelineLine} />
                  )}
                </View>
                <View style={styles.stepContent}>
                  <View style={styles.stepHeader}>
                    <Text
                      style={[
                        styles.stepTitle,
                        { color: step.completed ? "#4e342e" : "#9ca3af" },
                      ]}
                    >
                      {step.title}
                    </Text>
                    {step.time && (
                      <Text style={styles.stepTime}>{step.time}</Text>
                    )}
                  </View>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                  {!step.completed && (
                    <TouchableOpacity
                      style={styles.completeButton}
                      onPress={() => handleMarkComplete(step.id)}
                    >
                      <Text style={styles.completeButtonText}>
                        {t("worker.markComplete")}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>
)}
        {/* Action Buttons */}
        {actionsVisible && (
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#d9534f" }]}
            onPress={handleCancelOrder}
          >
            {renderIcon("X", 20, "#fff")}
            <Text style={styles.actionButtonText}>
              {t("worker.cancelOrder")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#6d4c41" }]}
            onPress={handleMarkReady}
          >
            {renderIcon("CheckCircle", 20, "#fff")}
            <Text style={styles.actionButtonText}>{t("worker.markReady")}</Text>
          </TouchableOpacity>
        </View>
        )}
      </ScrollView>
    </View>
  );
};

export default OrderStatusScreen;
