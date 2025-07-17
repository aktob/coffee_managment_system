import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Animated,
  RefreshControl,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import {
  Search,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Minus,
  RotateCcw,
  Filter,
  TrendingUp,
  TrendingDown,
  Coffee,
  CheckSquare,
  X,
  Trash,
  Check,
  Scan,
  History,
  Download,
} from "lucide-react-native";
import InventoryTimeline from "../../components/InventoryTimeline";
import { getInventoryItems, getInventoryHistory } from "../../data/mockData";

const InventoryScreen = () => {
  const { t, i18n } = useTranslation();
  const theme = useSelector((state) => state.theme.mode);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [restockQuantity, setRestockQuantity] = useState("");
  const [restockDialogVisible, setRestockDialogVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [inventoryItems, setInventoryItems] = useState(getInventoryItems());
  const [isLoading, setIsLoading] = useState(true);
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [isTimelineVisible, setIsTimelineVisible] = useState(false);
  const [selectedTimelineItem, setSelectedTimelineItem] = useState(null);
  const [notificationSubscription, setNotificationSubscription] =
    useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const isRTL = i18n.language === "ar";
  const isDark = theme === "dark";

  useEffect(() => {
    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Load initial inventory data
    loadInventoryData();

    return () => {
      if (notificationSubscription) {
        notificationService.removeNotificationSubscription(
          notificationSubscription
        );
      }
    };
  }, []);

  // Check inventory levels and schedule notifications
  useEffect(() => {
    inventoryItems.forEach((item) => {
      if (item.quantity <= 0) {
        notificationService.scheduleInventoryAlert(item, "out_of_stock");
      } else if (item.quantity <= item.threshold) {
        notificationService.scheduleInventoryAlert(item, "low_stock");
      }

      // Check expiry date if available
      if (item.expiryDate) {
        const expiryDate = new Date(item.expiryDate);
        const today = new Date();
        const daysUntilExpiry = Math.ceil(
          (expiryDate - today) / (1000 * 60 * 60 * 24)
        );

        if (daysUntilExpiry <= 7) {
          notificationService.scheduleInventoryAlert(item, "expiring_soon");
        }
      }
    });
  }, [inventoryItems]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const loadInventoryData = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      const response = await fetch("api/inventory");
      const data = await response.json();
      setInventoryItems(data);
    } catch (error) {
      console.error("Error loading inventory:", error);
      Alert.alert(t("common.error"), t("supervisor.loadError"), [
        { text: t("common.ok") },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInventoryUpdate = (data) => {
    setInventoryItems((currentItems) => {
      const updatedItems = [...currentItems];
      const itemIndex = updatedItems.findIndex((item) => item.id === data.id);

      if (itemIndex !== -1) {
        // Update existing item
        const oldQuantity = updatedItems[itemIndex].quantity;
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          ...data,
          lastUpdated: new Date().toISOString().split("T")[0],
        };

        // Check if we need to send notifications
        const newQuantity = data.quantity;
        if (newQuantity <= 0) {
          notificationService.scheduleInventoryAlert(
            updatedItems[itemIndex],
            "out_of_stock"
          );
        } else if (
          newQuantity <= updatedItems[itemIndex].threshold &&
          oldQuantity > updatedItems[itemIndex].threshold
        ) {
          notificationService.scheduleInventoryAlert(
            updatedItems[itemIndex],
            "low_stock"
          );
        }
      } else {
        // Add new item
        const newItem = {
          ...data,
          lastUpdated: new Date().toISOString().split("T")[0],
        };
        updatedItems.push(newItem);

        // Check if we need to send notifications for the new item
        if (newItem.quantity <= 0) {
          notificationService.scheduleInventoryAlert(newItem, "out_of_stock");
        } else if (newItem.quantity <= newItem.threshold) {
          notificationService.scheduleInventoryAlert(newItem, "low_stock");
        }
      }

      return updatedItems;
    });
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "low":
        return {
          color: "#EF4444",
          bgColor: isDark ? "#7F1D1D" : "#FEF2F2",
          textColor: isDark ? "#FCA5A5" : "#DC2626",
          icon: XCircle,
          label: t("supervisor.low"),
        };
      case "warning":
        return {
          color: "#F59E0B",
          bgColor: isDark ? "#92400E" : "#FFFBEB",
          textColor: isDark ? "#FCD34D" : "#D97706",
          icon: AlertTriangle,
          label: t("supervisor.warning"),
        };
      case "good":
        return {
          color: "#10B981",
          bgColor: isDark ? "#065F46" : "#ECFDF5",
          textColor: isDark ? "#6EE7B7" : "#059669",
          icon: CheckCircle,
          label: t("supervisor.good"),
        };
      default:
        return {
          color: "#6B7280",
          bgColor: isDark ? "#374151" : "#F9FAFB",
          textColor: isDark ? "#9CA3AF" : "#6B7280",
          icon: Package,
          label: t("common.status"),
        };
    }
  };

  const filters = [
    { key: "all", label: t("common.all"), count: inventoryItems.length },
    {
      key: "low",
      label: t("supervisor.low"),
      count: inventoryItems.filter((item) => item.status === "low").length,
    },
    {
      key: "warning",
      label: t("supervisor.warning"),
      count: inventoryItems.filter((item) => item.status === "warning").length,
    },
    {
      key: "good",
      label: t("supervisor.good"),
      count: inventoryItems.filter((item) => item.status === "good").length,
    },
  ];

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || item.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const summaryStats = {
    totalItems: inventoryItems.length,
    lowStockItems: inventoryItems.filter((item) => item.status === "low")
      .length,
    warningItems: inventoryItems.filter((item) => item.status === "warning")
      .length,
    goodItems: inventoryItems.filter((item) => item.status === "good").length,
  };

  const handleRestock = (item) => {
    setSelectedItem(item);
    setRestockDialogVisible(true);
  };

  const toggleSelection = (itemId) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(itemId)) {
      newSelection.delete(itemId);
    } else {
      newSelection.add(itemId);
    }
    setSelectedItems(newSelection);
  };

  const selectAll = () => {
    const allIds = filteredItems.map((item) => item.id);
    setSelectedItems(new Set(allIds));
  };

  const deselectAll = () => {
    setSelectedItems(new Set());
  };

  const handleBulkRestock = () => {
    setRestockDialogVisible(true);
    // We'll handle multiple items in handleRestockConfirm
  };

  const handleBulkDelete = () => {
    Alert.alert(
      t("supervisor.confirmDelete"),
      t("supervisor.confirmDeleteMessage", { count: selectedItems.size }),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: () => {
            setSelectedItems(new Set());
            setIsSelectionMode(false);
          },
        },
      ]
    );
  };

  const handleRestockConfirm = () => {
    const quantity = parseInt(restockQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      Alert.alert(t("common.error"), t("supervisor.invalidQuantity"), [
        { text: t("common.ok") },
      ]);
      return;
    }

    // Reset state
    setRestockDialogVisible(false);
    setRestockQuantity("");
    setSelectedItem(null);
    setSelectedItems(new Set());
    setIsSelectionMode(false);
  };

  const handleViewHistory = (item) => {
    setSelectedTimelineItem(item);
    setIsTimelineVisible(true);
  };

  const handleExport = async (format) => {
    try {
      setIsExporting(true);

      // Prepare data for export
      const exportData = inventoryItems.map((item) => ({
        Name: item.name,
        Quantity: `${item.quantity} ${item.unit}`,
        Threshold: `${item.threshold} ${item.unit}`,
        Status: t(`supervisor.${item.status}`),
        Price: `$${item.price}`,
        "Last Updated": item.lastUpdated,
      }));

      if (format === "csv") {
        await exportService.exportToCSV(
          exportData,
          `inventory_${new Date().toISOString().split("T")[0]}`
        );
      } else {
        await exportService.exportToPDF(
          exportData,
          t("supervisor.inventoryReport"),
          {
            headerColor: isDark ? "#374151" : "#8B4513",
            textColor: isDark ? "#FFFFFF" : "#1F2937",
            backgroundColor: isDark ? "#111827" : "#FFFFFF",
          }
        );
      }
    } catch (error) {
      Alert.alert(t("common.error"), t("supervisor.exportError"), [
        { text: t("common.ok") },
      ]);
    } finally {
      setIsExporting(false);
    }
  };

  const styles = getStyles(isDark, isRTL);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#8B4513" />
        <Text style={styles.loadingText}>{t("common.loading")}</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Header />

          {/* Search Bar */}
          <Animated.View
            style={[
              styles.searchContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.searchBar}>
              <Search size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
              <TextInput
                style={styles.searchInput}
                placeholder={t("supervisor.searchInventory")}
                placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                value={searchQuery}
                onChangeText={setSearchQuery}
                textAlign={isRTL ? "right" : "left"}
              />
            </View>
          </Animated.View>

          {/* Filter Tabs */}
          <Animated.View
            style={[
              styles.filtersContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterTabs}>
                {filters.map((filter) => (
                  <TouchableOpacity
                    key={filter.key}
                    onPress={() => setSelectedFilter(filter.key)}
                    style={[
                      styles.filterTab,
                      selectedFilter === filter.key && styles.filterTabActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterTabText,
                        selectedFilter === filter.key &&
                          styles.filterTabTextActive,
                      ]}
                    >
                      {filter.label}
                    </Text>
                    <View
                      style={[
                        styles.filterBadge,
                        selectedFilter === filter.key &&
                          styles.filterBadgeActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.filterBadgeText,
                          selectedFilter === filter.key &&
                            styles.filterBadgeTextActive,
                        ]}
                      >
                        {filter.count}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </Animated.View>

          {/* Bulk Action Bar */}
          {isSelectionMode && <BulkActionBar />}

          {/* Summary Cards */}
          <Animated.View
            style={[
              styles.summaryContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.summaryGrid}>
              <View style={styles.summaryCard}>
                <View
                  style={[styles.summaryIcon, { backgroundColor: "#3B82F620" }]}
                >
                  <Package size={20} color="#3B82F6" />
                </View>
                <Text style={styles.summaryValue}>
                  {summaryStats.totalItems}
                </Text>
                <Text style={styles.summaryTitle}>
                  {t("supervisor.totalItems")}
                </Text>
              </View>

              <View style={styles.summaryCard}>
                <View
                  style={[styles.summaryIcon, { backgroundColor: "#EF444420" }]}
                >
                  <AlertTriangle size={20} color="#EF4444" />
                </View>
                <Text style={styles.summaryValue}>
                  {summaryStats.lowStockItems}
                </Text>
                <Text style={styles.summaryTitle}>
                  {t("supervisor.lowStockItems")}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Inventory List */}
          <Animated.View
            style={[
              styles.inventoryContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>{t("supervisor.inventory")}</Text>
            <View style={styles.inventoryList}>
              {filteredItems.map((item) => (
                <InventoryCard key={item.id} item={item} />
              ))}
            </View>
          </Animated.View>
        </Animated.View>
      </ScrollView>

      <InventoryTimeline
        visible={isTimelineVisible}
        onClose={() => {
          setIsTimelineVisible(false);
          setSelectedTimelineItem(null);
        }}
        item={selectedTimelineItem}
      />

      <RestockDialog />
    </>
  );
};

const Header = () => (
  <View style={styles.header}>
    <View>
      <Text style={styles.title}>{t("supervisor.inventoryManagement")}</Text>
      <Text style={styles.subtitle}>
        {t("supervisor.stockStatus")} & {t("supervisor.restockNeeded")}
      </Text>
    </View>
    <View style={styles.headerButtons}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => setIsScannerVisible(true)}
      >
        <Scan size={20} color={isDark ? "#FFFFFF" : "#8B4513"} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => {
          Alert.alert(
            t("supervisor.exportFormat"),
            t("supervisor.chooseFormat"),
            [
              {
                text: "PDF",
                onPress: () => handleExport("pdf"),
              },
              {
                text: "CSV",
                onPress: () => handleExport("csv"),
              },
              {
                text: t("common.cancel"),
                style: "cancel",
              },
            ]
          );
        }}
        disabled={isExporting}
      >
        <Download size={20} color={isDark ? "#FFFFFF" : "#8B4513"} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => {
          setIsSelectionMode(!isSelectionMode);
          if (!isSelectionMode) {
            setSelectedItems(new Set());
          }
        }}
      >
        {isSelectionMode ? (
          <X size={20} color={isDark ? "#FFFFFF" : "#8B4513"} />
        ) : (
          <CheckSquare size={20} color={isDark ? "#FFFFFF" : "#8B4513"} />
        )}
      </TouchableOpacity>
    </View>
  </View>
);

const InventoryCard = ({ item }) => {
  const statusConfig = getStatusConfig(item.status);
  return (
    <View key={item.id} style={styles.inventoryCard}>
      <View style={styles.inventoryHeader}>
        {isSelectionMode && (
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => toggleSelection(item.id)}
          >
            <View
              style={[
                styles.checkboxInner,
                selectedItems.has(item.id) && styles.checkboxChecked,
              ]}
            >
              {selectedItems.has(item.id) && (
                <Check size={16} color="#FFFFFF" />
              )}
            </View>
          </TouchableOpacity>
        )}
        <View style={styles.inventoryInfo}>
          <View style={styles.inventoryTitleRow}>
            <Text style={styles.inventoryName}>{item.name}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusConfig.bgColor },
              ]}
            >
              <statusConfig.icon size={14} color={statusConfig.color} />
              <Text
                style={[styles.statusText, { color: statusConfig.textColor }]}
              >
                {statusConfig.label}
              </Text>
            </View>
          </View>

          <View style={styles.inventoryDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t("common.quantity")}:</Text>
              <Text style={styles.detailValue}>
                {item.quantity} {item.unit}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t("common.threshold")}:</Text>
              <Text style={styles.detailValue}>
                {item.threshold} {item.unit}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {t("supervisor.lastUpdated")}:
              </Text>
              <Text style={styles.detailValue}>{item.lastUpdated}</Text>
            </View>
          </View>
        </View>

        <View style={styles.inventoryActions}>
          <View style={styles.trendIndicator}>
            {item.trend === "up" ? (
              <TrendingUp size={16} color="#10B981" />
            ) : (
              <TrendingDown size={16} color="#EF4444" />
            )}
          </View>
          <Text style={styles.priceText}>${item.price}</Text>
          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => handleViewHistory(item)}
          >
            <History size={16} color={isDark ? "#FFFFFF" : "#8B4513"} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.restockButton}
        onPress={() => handleRestock(item)}
      >
        <LinearGradient
          colors={["#8B4513", "#A0522D"]}
          style={styles.restockButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <RotateCcw size={16} color="#FFFFFF" />
          <Text style={styles.restockButtonText}>{t("common.restock")}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const BulkActionBar = () => (
  <Animated.View
    style={[
      styles.bulkActionBar,
      {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      },
    ]}
  >
    <View style={styles.bulkActionLeft}>
      <TouchableOpacity
        style={styles.bulkActionButton}
        onPress={() =>
          selectedItems.size === filteredItems.length
            ? deselectAll()
            : selectAll()
        }
      >
        <Text style={styles.bulkActionButtonText}>
          {selectedItems.size === filteredItems.length
            ? t("common.deselectAll")
            : t("common.selectAll")}
        </Text>
      </TouchableOpacity>
      <Text style={styles.selectedCount}>
        {t("supervisor.selectedItems", { count: selectedItems.size })}
      </Text>
    </View>
    <View style={styles.bulkActionRight}>
      <TouchableOpacity
        style={[styles.bulkActionButton, styles.restockButton]}
        onPress={handleBulkRestock}
        disabled={selectedItems.size === 0}
      >
        <RotateCcw size={16} color="#FFFFFF" />
        <Text style={styles.restockButtonText}>{t("common.restock")}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.bulkActionButton, styles.deleteButton]}
        onPress={handleBulkDelete}
        disabled={selectedItems.size === 0}
      >
        <Trash size={16} color="#FFFFFF" />
        <Text style={styles.deleteButtonText}>{t("common.delete")}</Text>
      </TouchableOpacity>
    </View>
  </Animated.View>
);

const RestockDialog = () => (
  <Modal
    visible={restockDialogVisible}
    transparent
    animationType="fade"
    onRequestClose={() => setRestockDialogVisible(false)}
  >
    <View style={styles.modalOverlay}>
      <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
        <Text style={[styles.modalTitle, isDark && styles.modalTitleDark]}>
          {t("supervisor.restockItem")}
        </Text>
        <Text
          style={[styles.modalSubtitle, isDark && styles.modalSubtitleDark]}
        >
          {selectedItem?.name}
        </Text>

        <View style={styles.quantityInputContainer}>
          <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>
            {t("supervisor.enterQuantity")}
          </Text>
          <TextInput
            style={[styles.quantityInput, isDark && styles.quantityInputDark]}
            keyboardType="numeric"
            value={restockQuantity}
            onChangeText={setRestockQuantity}
            placeholder="0"
            placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
          />
          <Text style={[styles.unitText, isDark && styles.unitTextDark]}>
            {selectedItem?.unit}
          </Text>
        </View>

        <View style={styles.modalActions}>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={() => setRestockDialogVisible(false)}
          >
            <Text style={styles.cancelButtonText}>{t("common.cancel")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.confirmButton]}
            onPress={handleRestockConfirm}
          >
            <Text style={styles.confirmButtonText}>{t("common.confirm")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const getStyles = (isDark, isRTL) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#111827" : "#F9FAFB",
    },
    content: {
      padding: 16,
    },
    header: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: isDark ? "#FFFFFF" : "#1F2937",
      textAlign: isRTL ? "right" : "left",
    },
    subtitle: {
      fontSize: 14,
      color: isDark ? "#9CA3AF" : "#6B7280",
      marginTop: 4,
      textAlign: isRTL ? "right" : "left",
    },
    iconButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: isDark ? "#374151" : "#FFFFFF",
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    searchContainer: {
      marginBottom: 20,
    },
    searchBar: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      backgroundColor: isDark ? "#374151" : "#FFFFFF",
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: isDark ? "#FFFFFF" : "#1F2937",
      paddingVertical: 0,
    },
    filtersContainer: {
      marginBottom: 20,
    },
    filterTabs: {
      flexDirection: "row",
      gap: 12,
      paddingHorizontal: 4,
    },
    filterTab: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: isDark ? "#374151" : "#F3F4F6",
      gap: 8,
    },
    filterTabActive: {
      backgroundColor: "#8B4513",
    },
    filterTabText: {
      fontSize: 14,
      fontWeight: "500",
      color: isDark ? "#9CA3AF" : "#6B7280",
    },
    filterTabTextActive: {
      color: "#FFFFFF",
    },
    filterBadge: {
      backgroundColor: isDark ? "#4B5563" : "#E5E7EB",
      borderRadius: 10,
      paddingHorizontal: 8,
      paddingVertical: 2,
      minWidth: 20,
      alignItems: "center",
    },
    filterBadgeActive: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
    },
    filterBadgeText: {
      fontSize: 12,
      fontWeight: "600",
      color: isDark ? "#D1D5DB" : "#4B5563",
    },
    filterBadgeTextActive: {
      color: "#FFFFFF",
    },
    summaryContainer: {
      marginBottom: 24,
    },
    summaryGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 12,
    },
    summaryCard: {
      flex: 1,
      backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
      borderRadius: 16,
      padding: 16,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    summaryIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
    },
    summaryValue: {
      fontSize: 24,
      fontWeight: "700",
      color: isDark ? "#FFFFFF" : "#1F2937",
      marginBottom: 4,
    },
    summaryTitle: {
      fontSize: 14,
      color: isDark ? "#9CA3AF" : "#6B7280",
      textAlign: "center",
    },
    inventoryContainer: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: isDark ? "#FFFFFF" : "#1F2937",
      marginBottom: 16,
      textAlign: isRTL ? "right" : "left",
    },
    inventoryList: {
      gap: 16,
    },
    inventoryCard: {
      backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
      borderRadius: 16,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    inventoryHeader: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 16,
    },
    inventoryInfo: {
      flex: 1,
    },
    inventoryTitleRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    inventoryName: {
      fontSize: 18,
      fontWeight: "600",
      color: isDark ? "#FFFFFF" : "#1F2937",
      flex: 1,
      textAlign: isRTL ? "right" : "left",
    },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      gap: 4,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "600",
    },
    inventoryDetails: {
      gap: 8,
    },
    detailRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    detailLabel: {
      fontSize: 14,
      color: isDark ? "#9CA3AF" : "#6B7280",
      fontWeight: "500",
    },
    detailValue: {
      fontSize: 14,
      color: isDark ? "#FFFFFF" : "#1F2937",
      fontWeight: "600",
    },
    inventoryActions: {
      alignItems: "center",
      gap: 8,
    },
    trendIndicator: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: isDark ? "#374151" : "#F3F4F6",
      justifyContent: "center",
      alignItems: "center",
    },
    priceText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#8B4513",
    },
    restockButton: {
      borderRadius: 12,
      overflow: "hidden",
    },
    restockButtonGradient: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      gap: 8,
    },
    restockButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "600",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: "#FFFFFF",
      borderRadius: 16,
      padding: 24,
      width: "90%",
      maxWidth: 400,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalContentDark: {
      backgroundColor: "#1F2937",
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: "#1F2937",
      marginBottom: 8,
      textAlign: "center",
    },
    modalTitleDark: {
      color: "#FFFFFF",
    },
    modalSubtitle: {
      fontSize: 16,
      color: "#6B7280",
      marginBottom: 24,
      textAlign: "center",
    },
    modalSubtitleDark: {
      color: "#9CA3AF",
    },
    quantityInputContainer: {
      marginBottom: 24,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: "#374151",
      marginBottom: 8,
    },
    inputLabelDark: {
      color: "#D1D5DB",
    },
    quantityInput: {
      backgroundColor: "#F3F4F6",
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: "#1F2937",
      textAlign: "center",
    },
    quantityInputDark: {
      backgroundColor: "#374151",
      color: "#FFFFFF",
    },
    unitText: {
      fontSize: 14,
      color: "#6B7280",
      marginTop: 8,
      textAlign: "center",
    },
    unitTextDark: {
      color: "#9CA3AF",
    },
    modalActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 12,
    },
    modalButton: {
      flex: 1,
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: "center",
    },
    cancelButton: {
      backgroundColor: isDark ? "#374151" : "#F3F4F6",
    },
    confirmButton: {
      backgroundColor: "#8B4513",
    },
    cancelButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: isDark ? "#D1D5DB" : "#374151",
    },
    confirmButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: "#FFFFFF",
    },
    bulkActionBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    bulkActionLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    bulkActionRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    bulkActionButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      gap: 6,
    },
    deleteButton: {
      backgroundColor: "#EF4444",
    },
    deleteButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "600",
    },
    selectedCount: {
      fontSize: 14,
      color: isDark ? "#9CA3AF" : "#6B7280",
    },
    checkbox: {
      width: 24,
      height: 24,
      marginRight: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    checkboxInner: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: isDark ? "#4B5563" : "#D1D5DB",
      justifyContent: "center",
      alignItems: "center",
    },
    checkboxChecked: {
      backgroundColor: "#8B4513",
      borderColor: "#8B4513",
    },
    bulkActionButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "600",
    },
    loadingContainer: {
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: isDark ? "#9CA3AF" : "#6B7280",
    },
    headerButtons: {
      flexDirection: "row",
      gap: 8,
    },
    historyButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: isDark ? "#374151" : "#F3F4F6",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 8,
    },
  });

export default InventoryScreen;
