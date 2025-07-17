import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  Search,
  Filter,
  Tag,
  Calendar,
  DollarSign,
  Percent,
  Package,
  Edit,
  Trash2,
  Plus,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  Clock,
  Users,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

const PromotionsScreen = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useSelector((state) => state.language);
  const isRTL = currentLanguage === "ar";

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Mock promotions data
  const promotions = [
    {
      id: 1,
      name: "Morning Coffee Deal",
      description: "Get 20% off on all hot beverages between 7 AM and 10 AM",
      discountType: "percentage",
      discountValue: 20,
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      active: true,
      usageCount: 145,
    },
    {
      id: 2,
      name: "Student Special",
      description: "Show your student ID and get $2 off on any large drink",
      discountType: "fixed",
      discountValue: 2,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      active: true,
      usageCount: 89,
    },
    {
      id: 3,
      name: "Holiday Bundle",
      description: "Buy any 2 pastries and get a free regular coffee",
      discountType: "bundle",
      discountValue: 0,
      startDate: "2023-12-25",
      endDate: "2024-01-10",
      active: false,
      usageCount: 203,
    },
    {
      id: 4,
      name: "Weekend Special",
      description: "50% off on all cold beverages every weekend",
      discountType: "percentage",
      discountValue: 50,
      startDate: "2024-01-20",
      endDate: "2024-03-20",
      active: true,
      usageCount: 67,
    },
    {
      id: 5,
      name: "Loyalty Reward",
      description: "Free upgrade to large size for loyal customers",
      discountType: "bundle",
      discountValue: 0,
      startDate: "2024-02-01",
      endDate: "2024-04-01",
      active: false,
      usageCount: 34,
    },
  ];

  const filteredPromotions = promotions.filter(
    (promo) =>
      (activeFilter === "all" ||
        (activeFilter === "active" && promo.active) ||
        (activeFilter === "inactive" && !promo.active)) &&
      promo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderIcon = (iconName, size = 24, color = "#4e342e") => {
    switch (iconName) {
      case "Search":
        return <Search size={size} color={color} />;
      case "Filter":
        return <Filter size={size} color={color} />;
      case "Tag":
        return <Tag size={size} color={color} />;
      case "Calendar":
        return <Calendar size={size} color={color} />;
      case "DollarSign":
        return <DollarSign size={size} color={color} />;
      case "Percent":
        return <Percent size={size} color={color} />;
      case "Package":
        return <Package size={size} color={color} />;
      case "Edit":
        return <Edit size={size} color={color} />;
      case "Trash2":
        return <Trash2 size={size} color={color} />;
      case "Plus":
        return <Plus size={size} color={color} />;
      case "TrendingUp":
        return <TrendingUp size={size} color={color} />;
      case "ChevronRight":
        return <ChevronRight size={size} color={color} />;
      case "ChevronLeft":
        return <ChevronLeft size={size} color={color} />;
      case "Clock":
        return <Clock size={size} color={color} />;
      case "Users":
        return <Users size={size} color={color} />;
      default:
        return null;
    }
  };

  const getDiscountIcon = (discountType) => {
    switch (discountType) {
      case "percentage":
        return "Percent";
      case "fixed":
        return "DollarSign";
      case "bundle":
        return "Package";
      default:
        return "Tag";
    }
  };

  const getDiscountText = (promotion) => {
    switch (promotion.discountType) {
      case "percentage":
        return `${promotion.discountValue}%`;
      case "fixed":
        return `$${promotion.discountValue}`;
      case "bundle":
        return t("admin.bundle");
      default:
        return promotion.discountValue;
    }
  };

  const handleEditPromotion = (promotion) => {
    Alert.alert(
      t("admin.editPromotion"),
      `${t("admin.editPromotion")} ${promotion.name}`
    );
  };

  const handleDeletePromotion = (promotion) => {
    Alert.alert(t("admin.deletePromotion"), t("admin.deletePromotionConfirm"), [
      {
        text: t("common.cancel"),
        style: "cancel",
      },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: () => {
          console.log("Delete promotion:", promotion.id);
          Alert.alert(t("common.success"), t("admin.promotionDeleted"));
        },
      },
    ]);
  };

  const handleAddPromotion = () => {
    Alert.alert(t("admin.addNewPromotion"), t("admin.addNewPromotion"));
  };

  const handleToggleActive = (promotion) => {
    console.log("Toggle promotion:", promotion.id, !promotion.active);
    Alert.alert(t("common.success"), t("admin.promotionUpdated"));
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
      marginBottom: 24,
    },
    filterTitle: {
      fontSize: 19,
      fontWeight: "700",
      color: "#4e342e",
      marginBottom: 16,
      textAlign: isRTL ? "right" : "left",
      letterSpacing: 0.3,
    },
    filterButtonsContainer: {
      flexDirection: isRTL ? "row-reverse" : "row",
      gap: 12,
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
    promotionsList: {
      marginBottom: 20,
    },
    promotionCard: {
      backgroundColor: "#fffaf5",
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      elevation: 4,
      borderWidth: 1,
      borderColor: "#e5d4c0",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
    },
    promotionHeader: {
      flexDirection: "column",
      marginBottom: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#f0e6e0",
    },
    topRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    leftSection: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      flex: 1,
      justifyContent: "space-between",
    },
    promotionIcon: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: "#f7f3ef",
      alignItems: "center",
      justifyContent: "center",
      marginRight: isRTL ? 0 : 16,
      marginLeft: isRTL ? 16 : 0,
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      borderWidth: 2,
      borderColor: "#e5d4c0",
    },
    promotionInfo: {
      flexDirection: "column",
      width: "100%",
      alignItems: isRTL ? "flex-end" : "flex-start",
      paddingHorizontal: 20,
    },
    promotionName: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#4e342e",
      marginBottom: 6,
      textAlign: isRTL ? "right" : "left",
      letterSpacing: 0.3,
    },
    promotionDescription: {
      fontSize: 15,
      color: "#6b4f42",
      textAlign: isRTL ? "right" : "left",
      lineHeight: 22,
      fontWeight: "500",
    },
    statusSwitch: {
      marginLeft: isRTL ? 0 : 8,
      marginRight: isRTL ? 8 : 0,
    },
    promotionDetails: {
      marginBottom: 16,
      backgroundColor: "#f7f3ef",
      borderRadius: 16,
      padding: 16,
    },
    detailRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      marginBottom: 12,
    },
    detailRowLast: {
      marginBottom: 0,
    },
    detailIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "#e5d4c0",
      alignItems: "center",
      justifyContent: "center",
      marginRight: isRTL ? 0 : 12,
      marginLeft: isRTL ? 12 : 0,
    },
    detailContent: {
      flex: 1,
    },
    detailLabel: {
      fontSize: 12,
      color: "#8d6e63",
      fontWeight: "600",
      textAlign: isRTL ? "right" : "left",
      marginBottom: 2,
    },
    detailValue: {
      fontSize: 14,
      color: "#4e342e",
      fontWeight: "600",
      textAlign: isRTL ? "right" : "left",
    },
    discountBadge: {
      backgroundColor: "#e8f5e8",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: "#4caf50",
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      minWidth: 60,
      alignItems: "center",
    },
    discountText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#2e7d32",
      textAlign: "center",
      letterSpacing: 0.3,
    },
    actionButtons: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: "#e5d4c0",
    },
    actionButton: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 12,
      flex: 1,
      marginRight: isRTL ? 0 : 8,
      marginLeft: isRTL ? 8 : 0,
    },
    editButton: {
      backgroundColor: "#d7bfa9",
    },
    deleteButton: {
      backgroundColor: "#ffcdd2",
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: "600",
      marginRight: isRTL ? 0 : 6,
      marginLeft: isRTL ? 6 : 0,
    },
    editButtonText: {
      color: "#4e342e",
    },
    deleteButtonText: {
      color: "#c62828",
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 40,
    },
    emptyStateText: {
      fontSize: 16,
      color: "#6b4f42",
      textAlign: "center",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {t("admin.promotionsManagement")}
        </Text>
        <Text style={styles.headerSubtitle}>
          {t("admin.promotionsSubtitle")}
        </Text>
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
              placeholder={t("admin.searchPromotions")}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#8d6e63"
            />
          </View>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>{t("admin.filterByStatus")}</Text>
          <View style={styles.filterButtonsContainer}>
            {["all", "active", "inactive"].map((filter, index) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  activeFilter === filter
                    ? styles.filterButtonActive
                    : styles.filterButtonInactive,
                ]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    activeFilter === filter
                      ? styles.filterButtonTextActive
                      : styles.filterButtonTextInactive,
                  ]}
                >
                  {filter === "all" && t("admin.allPromotions")}
                  {filter === "active" && t("admin.activePromotions")}
                  {filter === "inactive" && t("admin.inactivePromotions")}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Add Promotion Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddPromotion}>
          {renderIcon("Plus", 20, "#fff")}
          <Text style={styles.addButtonText}>{t("admin.addNewPromotion")}</Text>
        </TouchableOpacity>

        {/* Promotions List */}
        <View style={styles.promotionsList}>
          {filteredPromotions.length > 0 ? (
            filteredPromotions.map((promotion) => (
              <View key={promotion.id} style={styles.promotionCard}>
                <View style={styles.promotionHeader}>
                  <View style={styles.topRow}>
                    <View style={styles.leftSection}>
                      <View style={styles.promotionIcon}>
                        {renderIcon("Tag", 28, "#4e342e")}
                      </View>
                    </View>
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>
                        {getDiscountText(promotion)}
                      </Text>
                    </View>
                    <Switch
                      style={styles.statusSwitch}
                      value={promotion.active}
                      onValueChange={() => handleToggleActive(promotion)}
                      trackColor={{ false: "#e5d4c0", true: "#8d6e63" }}
                      thumbColor={promotion.active ? "#fff" : "#f4f3f4"}
                    />
                  </View>
                  <View style={styles.promotionInfo}>
                    <Text style={styles.promotionName}>{promotion.name}</Text>
                    <Text style={styles.promotionDescription}>
                      {promotion.description}
                    </Text>
                  </View>
                </View>

                <View style={styles.promotionDetails}>
                  <View style={styles.detailRow}>
                    <View style={styles.detailIcon}>
                      {renderIcon(
                        getDiscountIcon(promotion.discountType),
                        18,
                        "#4e342e"
                      )}
                    </View>
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>
                        {t("admin.discount")}
                      </Text>
                      <Text style={styles.detailValue}>
                        {getDiscountText(promotion)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.detailIcon}>
                      {renderIcon("Calendar", 18, "#4e342e")}
                    </View>
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>
                        {t("admin.startDate")}
                      </Text>
                      <Text style={styles.detailValue}>
                        {formatDate(promotion.startDate)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.detailIcon}>
                      {renderIcon("Calendar", 18, "#4e342e")}
                    </View>
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>
                        {t("admin.endDate")}
                      </Text>
                      <Text style={styles.detailValue}>
                        {formatDate(promotion.endDate)}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.detailRow, styles.detailRowLast]}>
                    <View style={styles.detailIcon}>
                      {renderIcon("Users", 18, "#4e342e")}
                    </View>
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>
                        {t("admin.usageCount")}
                      </Text>
                      <Text style={styles.detailValue}>
                        {promotion.usageCount} {t("admin.times")}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => handleEditPromotion(promotion)}
                  >
                    {renderIcon("Edit", 16, "#4e342e")}
                    <Text
                      style={[styles.actionButtonText, styles.editButtonText]}
                    >
                      {t("common.edit")}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeletePromotion(promotion)}
                  >
                    {renderIcon("Trash2", 16, "#c62828")}
                    <Text
                      style={[styles.actionButtonText, styles.deleteButtonText]}
                    >
                      {t("common.delete")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              {renderIcon("Tag", 64, "#8d6e63")}
              <Text style={styles.emptyStateText}>
                {t("admin.searchPromotions")}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default PromotionsScreen;
