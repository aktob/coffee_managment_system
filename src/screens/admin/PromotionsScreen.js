import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
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
  Edit,
  Trash2,
  Plus,
  Users,
  X,
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

const PromotionsScreen = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useSelector((state) => state.language);
  const theme = useSelector((state) => state.theme.mode);
  const isDark = theme === "dark";
  const isRTL = currentLanguage === "ar";

  const [searchQuery, setSearchQuery] = useState("");
  const [tempSearchQuery, setTempSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Form states
  const [promoCode, setPromoCode] = useState("");
  const [promoName, setPromoName] = useState("");
  const [promoDescription, setPromoDescription] = useState("");
  const [promoDiscountType, setPromoDiscountType] = useState("percentage");
  const [promoDiscountValue, setPromoDiscountValue] = useState("");
  const [promoMinOrderAmount, setPromoMinOrderAmount] = useState("");
  const [promoMaxUses, setPromoMaxUses] = useState("");
  const [promoValidFrom, setPromoValidFrom] = useState("");
  const [promoValidUntil, setPromoValidUntil] = useState("");
  const [promoActive, setPromoActive] = useState(true);
  const [promoEditId, setPromoEditId] = useState(null);
  const [isEditingPromo, setIsEditingPromo] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  // Errors
  const [promoCodeError, setPromoCodeError] = useState("");
  const [promoNameError, setPromoNameError] = useState("");
  const [promoDescriptionError, setPromoDescriptionError] = useState("");
  const [promoDiscountValueError, setPromoDiscountValueError] = useState("");
  const [promoMinOrderAmountError, setPromoMinOrderAmountError] = useState("");
  const [promoMaxUsesError, setPromoMaxUsesError] = useState("");

  // Debounced search
  const debouncedSetSearchQuery = useCallback(
    debounce((value) => {
      setSearchQuery(value);
    }, 300),
    []
  );

  const handleSearchChange = useCallback(
    (text) => {
      setTempSearchQuery(text);
      debouncedSetSearchQuery(text);
    },
    [debouncedSetSearchQuery]
  );

  // Fetch promotions list
  const fetchPromotions = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          throw new Error(t("worker.noToken"));
        }

        const response = await fetch(
          `${BASE_URL}/admin/promo-codes?page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Promotions API Response:", result);

        if (result.data && Array.isArray(result.data)) {
          const formattedPromotions = result.data.map((promo) => ({
            id: promo.id,
            code: promo.code || "",
            name: promo.name || "Unnamed Promotion",
            description: promo.description || "",
            discountType: promo.type || "percentage",
            discountValue: parseFloat(promo.value) || 0,
            minimumOrderAmount: parseFloat(promo.minimum_order_amount) || 0,
            maxUses: parseInt(promo.max_uses) || 0,
            startDate: promo.valid_from || "",
            endDate: promo.valid_until || "",
            active: promo.is_active || false,
            usageCount: promo.usage_count || 0,
          }));
          setPromotions(formattedPromotions);
          setTotalPages(result.last_page || Math.ceil(result.total / limit));
        } else {
          throw new Error("No promotions data found");
        }
      } catch (error) {
        console.error("Error fetching promotions:", error.message);
        setError(error.message);
        Alert.alert(t("worker.error"), error.message || t("worker.fetchPromotionsFailed"));
      } finally {
        setLoading(false);
      }
    },
    [t, limit]
  );

  // Fetch single promotion for editing
  const fetchPromotionDetails = useCallback(
    async (id) => {
      setFormLoading(true);
      setError(null);
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          throw new Error(t("worker.noToken"));
        }

        const response = await fetch(`${BASE_URL}/admin/promo-codes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const promo = await response.json();
        console.log("Raw Promotion Details:", promo); // Log the raw response

        // Check if promo.data exists (in case API wraps data in a 'data' object)
        const promoData = promo.data || promo;

        // Set state with fallback values
        setPromoCode(promoData.code || "");
        setPromoName(promoData.name || "");
        setPromoDescription(promoData.description || "");
        setPromoDiscountType(promoData.type || "percentage");
        setPromoDiscountValue(promoData.value ? promoData.value.toString() : "");
        setPromoMinOrderAmount(promoData.minimum_order_amount ? promoData.minimum_order_amount.toString() : "");
        setPromoMaxUses(promoData.max_uses ? promoData.max_uses.toString() : "");
        setPromoValidFrom(promoData.valid_from || "");
        setPromoValidUntil(promoData.valid_until || "");
        setPromoActive(promoData.is_active !== undefined ? promoData.is_active : false);
        setPromoEditId(promoData.id || id);
        setIsEditingPromo(true);
        setFormVisible(true);

        console.log("Set Promotion Details:", {
          code: promoData.code,
          name: promoData.name,
          description: promoData.description,
          type: promoData.type,
          value: promoData.value,
          minimum_order_amount: promoData.minimum_order_amount,
          max_uses: promoData.max_uses,
          valid_from: promoData.valid_from,
          valid_until: promoData.valid_until,
          is_active: promoData.is_active,
          id: promoData.id,
        });
      } catch (error) {
        console.error("Error fetching promotion details:", error.message);
        Alert.alert(t("worker.error"), error.message || t("worker.fetchPromotionDetailsFailed"));
      } finally {
        setFormLoading(false);
      }
    },
    [t]
  );

  useEffect(() => {
    fetchPromotions(currentPage);
  }, [fetchPromotions, currentPage]);

  const filteredPromotions = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return promotions.filter(
      (promo) =>
        (activeFilter === "all" ||
          (activeFilter === "active" && promo.active) ||
          (activeFilter === "inactive" && !promo.active)) &&
        promo.name &&
        typeof promo.name === "string" &&
        (promo.name.toLowerCase().includes(query) || promo.code.toLowerCase().includes(query))
    );
  }, [promotions, searchQuery, activeFilter]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const renderIcon = (iconName, size = 24, color = isDark ? "#ffffff" : "#4e342e") => {
    const icons = {
      Search: <Search size={size} color={color} />,
      Filter: <Filter size={size} color={color} />,
      Tag: <Tag size={size} color={color} />,
      Calendar: <Calendar size={size} color={color} />,
      DollarSign: <DollarSign size={size} color={color} />,
      Percent: <Percent size={size} color={color} />,
      Edit: <Edit size={size} color={color} />,
      Trash2: <Trash2 size={size} color={color} />,
      Plus: <Plus size={size} color={color} />,
      Users: <Users size={size} color={color} />,
      X: <X size={size} color={color} />,
    };
    return icons[iconName] || null;
  };

  const getDiscountIcon = (discountType) => {
    switch (discountType) {
      case "percentage":
        return "Percent";
      case "fixed":
        return "DollarSign";
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
      default:
        return promotion.discountValue || "N/A";
    }
  };

  const validateForm = () => {
    let isValid = true;
    if (!promoCode.trim()) {
      setPromoCodeError(t("admin.promotionCode"));
      isValid = false;
    } else {
      setPromoCodeError("");
    }

    if (!promoName.trim()) {
      setPromoNameError(t("admin.promotionName"));
      isValid = false;
    } else {
      setPromoNameError("");
    }

    if (!promoDescription.trim()) {
      setPromoDescriptionError(t("admin.PromotionDescription"));
      isValid = false;
    } else {
      setPromoDescriptionError("");
    }

    if (!promoDiscountValue || isNaN(promoDiscountValue) || parseFloat(promoDiscountValue) <= 0) {
      setPromoDiscountValueError(t("admin.promotionValue"));
      isValid = false;
    } else {
      setPromoDiscountValueError("");
    }

    if (!promoMinOrderAmount || isNaN(promoMinOrderAmount) || parseFloat(promoMinOrderAmount) < 0) {
      setPromoMinOrderAmountError(t("admin.promoMinOrderAmountInvalid"));
      isValid = false;
    } else {
      setPromoMinOrderAmountError("");
    }

    if (!promoMaxUses || isNaN(promoMaxUses) || parseInt(promoMaxUses) <= 0) {
      setPromoMaxUsesError(t("admin.promoMaxUsesInvalid"));
      isValid = false;
    } else {
      setPromoMaxUsesError("");
    }

    return isValid;
  };

  const handleEditPromotion = (promotion) => {
    fetchPromotionDetails(promotion.id);
  };

  const handleAddPromotion = async () => {
    if (!validateForm()) {
      return;
    }

    setFormLoading(true);
    const promotionData = {
      code: promoCode,
      name: promoName,
      description: promoDescription,
      type: promoDiscountType,
      value: parseFloat(promoDiscountValue),
      minimum_order_amount: parseFloat(promoMinOrderAmount),
      max_uses: parseInt(promoMaxUses),
      valid_from: promoValidFrom,
      valid_until: promoValidUntil,
      is_active: promoActive,
    };

    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        throw new Error(t("worker.noToken"));
      }

      const url = isEditingPromo
        ? `${BASE_URL}/admin/promo-codes/${promoEditId}`
        : `${BASE_URL}/admin/promo-codes`;

      const method = isEditingPromo ? "PUT" : "POST";

      const body = isEditingPromo
        ? {
            name: promoName,
            description: promoDescription,
            value: parseFloat(promoDiscountValue),
            minimum_order_amount: parseFloat(promoMinOrderAmount),
          }
        : promotionData;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      console.log(`${method} Promotion API Response:`, result);

      if (response.ok) {
        Alert.alert(
          t(isEditingPromo ? "admin.editProduct" : "admin.addProduct"),
          t(isEditingPromo ? "admin.promoUpdated" : "admin.promoAdded")
        );
        clearPromoForm();
        fetchPromotions(currentPage);
      } else {
        throw new Error(result.message || t("admin.promoFailed"));
      }
    } catch (error) {
      console.error(`Error ${isEditingPromo ? "updating" : "adding"} promotion:`, error.message);
      Alert.alert(t("worker.error"), error.message || t("admin.promoFailed"));
    } finally {
      setFormLoading(false);
    }
  };

  const clearPromoForm = () => {
    setPromoCode("");
    setPromoName("");
    setPromoDescription("");
    setPromoDiscountType("percentage");
    setPromoDiscountValue("");
    setPromoMinOrderAmount("");
    setPromoMaxUses("");
    setPromoValidFrom("");
    setPromoValidUntil("");
    setPromoActive(true);
    setPromoEditId(null);
    setIsEditingPromo(false);
    setFormVisible(false);
    setPromoCodeError("");
    setPromoNameError("");
    setPromoDescriptionError("");
    setPromoDiscountValueError("");
    setPromoMinOrderAmountError("");
    setPromoMaxUsesError("");
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
        onPress: async () => {
          setLoading(true);
          try {
            const token = await AsyncStorage.getItem("authToken");
            if (!token) {
              throw new Error(t("worker.noToken"));
            }

            const response = await fetch(`${BASE_URL}/admin/promo-codes/${promotion.id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });

            if (response.ok) {
              setPromotions((prev) => prev.filter((p) => p.id !== promotion.id));
              Alert.alert(t("admin.deletePromotion"), t("admin.promoDeleted"));
            } else {
              const result = await response.json();
              throw new Error(result.message || t("admin.promoDeleteFailed"));
            }
          } catch (error) {
            console.error("Error deleting promotion:", error.message);
            Alert.alert(t("worker.error"), error.message || t("admin.promoDeleteFailed"));
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handleToggleActive = async (promotion) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        throw new Error(t("worker.noToken"));
      }

      const response = await fetch(`${BASE_URL}/admin/promo-codes/${promotion.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active: !promotion.active }),
      });

      if (response.ok) {
        setPromotions((prevPromotions) =>
          prevPromotions.map((p) =>
            p.id === promotion.id ? { ...p, active: !p.active } : p
          )
        );
      } else {
        const result = await response.json();
        throw new Error(result.message || t("admin.promoToggleFailed"));
      }
    } catch (error) {
      console.error("Error toggling promotion active state:", error.message);
      Alert.alert(t("worker.error"), error.message || t("admin.promoToggleFailed"));
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
    safeArea: {
      flex: 1,
      backgroundColor: isDark ? "#1a1a1a" : "#f7f3ef",
    },
    container: {
      flex: 1,
      backgroundColor: isDark ? "#1a1a1a" : "#f7f3ef",
    },
    header: {
      paddingTop: 50,
      paddingBottom: 28,
      paddingHorizontal: 20,
      backgroundColor: isDark ? "#2d2d2d" : "#8d6e63",
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      elevation: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      zIndex: 2000, // Ensure header stays above form
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
      backgroundColor: isDark ? "#2d2d2d" : "#fffaf5",
      borderRadius: 20,
      borderWidth: 2,
      borderColor: isDark ? "#3d3d3d" : "#e5d4c0",
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
      color: isDark ? "#ffffff" : "#4e342e",
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
      color: isDark ? "#ffffff" : "#4e342e",
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
      borderColor: isDark ? "#3d3d3d" : "#e5d4c0",
      minHeight: 48,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    filterButtonActive: {
      backgroundColor: isDark ? "#4d4d4d" : "#8d6e63",
      borderColor: isDark ? "#4d4d4d" : "#8d6e63",
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    filterButtonInactive: {
      backgroundColor: isDark ? "#2d2d2d" : "#fffaf5",
      borderColor: isDark ? "#3d3d3d" : "#e5d4c0",
    },
    filterButtonText: {
      fontSize: 14,
      fontWeight: "600",
    },
    filterButtonTextActive: {
      color: "#fff",
    },
    filterButtonTextInactive: {
      color: isDark ? "#ffffff" : "#4e342e",
    },
    addButton: {
      backgroundColor: isDark ? "#4d4d4d" : "#8d6e63",
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
      backgroundColor: isDark ? "#2d2d2d" : "#fffaf5",
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      elevation: 4,
      borderWidth: 1,
      borderColor: isDark ? "#3d3d3d" : "#e5d4c0",
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
      borderBottomColor: isDark ? "#3d3d3d" : "#f0e6e0",
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
      backgroundColor: isDark ? "#3d3d3d" : "#f7f3ef",
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
      borderColor: isDark ? "#4d4d4d" : "#e5d4c0",
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
      color: isDark ? "#ffffff" : "#4e342e",
      marginBottom: 6,
      textAlign: isRTL ? "right" : "left",
      letterSpacing: 0.3,
    },
    promotionDescription: {
      fontSize: 15,
      color: isDark ? "#aaaaaa" : "#6b4f42",
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
      backgroundColor: isDark ? "#3d3d3d" : "#f7f3ef",
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
      backgroundColor: isDark ? "#4d4d4d" : "#e5d4c0",
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
      color: isDark ? "#cccccc" : "#8d6e63",
      fontWeight: "600",
      textAlign: isRTL ? "right" : "left",
      marginBottom: 2,
    },
    detailValue: {
      fontSize: 14,
      color: isDark ? "#ffffff" : "#4e342e",
      fontWeight: "600",
      textAlign: isRTL ? "right" : "left",
    },
    discountBadge: {
      backgroundColor: isDark ? "#4d4d4d" : "#e8f5e8",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: isDark ? "#3d3d3d" : "#4caf50",
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
      color: isDark ? "#ffffff" : "#2e7d32",
      textAlign: "center",
      letterSpacing: 0.3,
    },
    actionButtons: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: isDark ? "#3d3d3d" : "#e5d4c0",
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
      backgroundColor: isDark ? "#4d4d4d" : "#d7bfa9",
    },
    deleteButton: {
      backgroundColor: isDark ? "#3d3d3d" : "#ffcdd2",
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: "600",
      marginRight: isRTL ? 0 : 6,
      marginLeft: isRTL ? 6 : 0,
    },
    editButtonText: {
      color: isDark ? "#ffffff" : "#4e342e",
    },
    deleteButtonText: {
      color: isDark ? "#ff6666" : "#c62828",
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 40,
    },
    emptyStateText: {
      fontSize: 16,
      color: isDark ? "#aaaaaa" : "#6b4f42",
      textAlign: "center",
    },
    inputField: {
      backgroundColor: isDark ? "#2d2d2d" : "#fff",
      borderWidth: 1,
      borderColor: isDark ? "#3d3d3d" : "#ddd",
      padding: 12,
      borderRadius: 10,
      fontSize: 16,
      color: isDark ? "#ffffff" : "#4e342e",
      marginBottom: 12,
      textAlign: isRTL ? "right" : "left",
      width: "100%",
    },
    errorText: {
      color: isDark ? "#ff6666" : "#dc2626",
      fontSize: 14,
      marginBottom: 10,
      marginLeft: 10,
      textAlign: isRTL ? "right" : "left",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      minHeight: 200,
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
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
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
    formContainer: {
      position: "absolute",
      top: 136, // Adjusted to start below header
      left: 0,
      width: "100%",
      height: height - 136, // Subtract header height
      backgroundColor: isDark ? "rgba(26, 26, 26, 0.95)" : "rgba(247, 243, 239, 0.95)",
      padding: 16,
      elevation: 10,
      zIndex: 1000,
    },
    formInnerContainer: {
      backgroundColor: isDark ? "#2d2d2d" : "#fff",
      borderRadius: 16,
      padding: 16,
      width: "100%",
      maxWidth: 600,
      alignSelf: "center",
      flexGrow: 1,
    },
    formTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDark ? "#ffffff" : "#4e342e",
      marginBottom: 12,
      textAlign: isRTL ? "right" : "left",
    },
    closeButton: {
      position: "absolute",
      top: 10,
      right: isRTL ? undefined : 10,
      left: isRTL ? 10 : undefined,
      zIndex: 1001,
    },
    closeButtonText: {
      fontSize: 16,
      color: isDark ? "#ff6666" : "#c62828",
      fontWeight: "600",
    },
    discountTypeContainer: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    discountTypeButton: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: isDark ? "#3d3d3d" : "#ddd",
      alignItems: "center",
      marginHorizontal: 4,
    },
    discountTypeButtonActive: {
      backgroundColor: isDark ? "#4d4d4d" : "#8d6e63",
      borderColor: isDark ? "#4d4d4d" : "#8d6e63",
    },
    discountTypeText: {
      fontSize: 14,
      color: isDark ? "#ffffff" : "#4e342e",
      fontWeight: "600",
    },
    discountTypeTextActive: {
      color: "#fff",
    },
    formScrollContainer: {
      flexGrow: 1,
      paddingBottom: 100,
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 20}
      >
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
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              {renderIcon("Search", 20, isDark ? "#ffffff" : "#6b4f42")}
              <TextInput
                style={styles.searchTextInput}
                placeholder={t("admin.searchPromotions")}
                value={tempSearchQuery}
                onChangeText={handleSearchChange}
                placeholderTextColor={isDark ? "#aaaaaa" : "#8d6e63"}
              />
            </View>
          </View>

          {/* Filter Buttons */}
          <View style={styles.filterContainer}>
            <Text style={styles.filterTitle}>{t("admin.filterByStatus")}</Text>
            <View style={styles.filterButtonsContainer}>
              {["all", "active", "inactive"].map((filter) => (
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
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setFormVisible(true)}
          >
            {renderIcon("Plus", 20, "#fff")}
            <Text style={styles.addButtonText}>{t("admin.addNewPromotion")}</Text>
          </TouchableOpacity>

          {/* Promotions List */}
          <View style={styles.promotionsList}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator
                  size="large"
                  color={isDark ? "#ffffff" : "#8d6e63"}
                />
              </View>
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : filteredPromotions.length > 0 ? (
              filteredPromotions.map((promotion) => (
                <View key={promotion.id} style={styles.promotionCard}>
                  <View style={styles.promotionHeader}>
                    <View style={styles.topRow}>
                      <View style={styles.leftSection}>
                        <View style={styles.promotionIcon}>
                          {renderIcon("Tag", 28, isDark ? "#ffffff" : "#4e342e")}
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
                        trackColor={{
                          false: isDark ? "#3d3d3d" : "#e5d4c0",
                          true: isDark ? "#4d4d4d" : "#8d6e63",
                        }}
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
                          isDark ? "#ffffff" : "#4e342e"
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
                        {renderIcon("Calendar", 18, isDark ? "#ffffff" : "#4e342e")}
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
                        {renderIcon("Calendar", 18, isDark ? "#ffffff" : "#4e342e")}
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

                    <View style={styles.detailRow}>
                      <View style={styles.detailIcon}>
                        {renderIcon("DollarSign", 18, isDark ? "#ffffff" : "#4e342e")}
                      </View>
                      <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>
                          {t("admin.minOrderAmount")}
                        </Text>
                        <Text style={styles.detailValue}>
                          ${promotion.minimumOrderAmount.toFixed(2)}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.detailRow, styles.detailRowLast]}>
                      <View style={styles.detailIcon}>
                        {renderIcon("Users", 18, isDark ? "#ffffff" : "#4e342e")}
                      </View>
                      <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>
                          {t("admin.usageCount")}
                        </Text>
                        <Text style={styles.detailValue}>
                          {promotion.usageCount} / {promotion.maxUses} {t("admin.times")}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.editButton]}
                      onPress={() => handleEditPromotion(promotion)}
                    >
                      {renderIcon("Edit", 16, isDark ? "#ffffff" : "#4e342e")}
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
                      {renderIcon("Trash2", 16, isDark ? "#ff6666" : "#c62828")}
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
                {renderIcon("Tag", 64, isDark ? "#aaaaaa" : "#8d6e63")}
                <Text style={styles.emptyStateText}>
                  {t("admin.noPromotionsFound")}
                </Text>
              </View>
            )}
          </View>

          {/* Pagination */}
          {totalPages > 1 && (
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
                {t("worker.page")} {currentPage} {t("worker.of")} {totalPages}
              </Text>
              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  currentPage === totalPages && styles.paginationButtonDisabled,
                ]}
                onPress={handleNextPage}
                disabled={currentPage === totalPages}
              >
                {renderIcon("ChevronRight", 20, "#fff")}
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {formVisible && (
          <View style={styles.formContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={clearPromoForm}
            >
              {renderIcon("X", 24, isDark ? "#ff6666" : "#c62828")}
            </TouchableOpacity>
            <ScrollView
              style={styles.formInnerContainer}
              contentContainerStyle={styles.formScrollContainer}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
            >
              {formLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator
                    size="large"
                    color={isDark ? "#ffffff" : "#8d6e63"}
                  />
                </View>
              ) : (
                <>
                  <Text style={styles.formTitle}>
                    {isEditingPromo ? t("admin.editPromotion") : t("admin.addNewPromotion")}
                  </Text>

                  <TextInput
                    placeholder={t("admin.promotionCode")}
                    value={promoCode}
                    onChangeText={(text) => {
                      setPromoCode(text);
                      if (text.trim()) setPromoCodeError("");
                    }}
                    style={styles.inputField}
                  />
                  {promoCodeError ? (
                    <Text style={styles.errorText}>{promoCodeError}</Text>
                  ) : null}

                  <TextInput
                    placeholder={t("admin.promotionName")}
                    value={promoName}
                    onChangeText={(text) => {
                      setPromoName(text);
                      if (text.trim()) setPromoNameError("");
                    }}
                    style={styles.inputField}
                  />
                  {promoNameError ? (
                    <Text style={styles.errorText}>{promoNameError}</Text>
                  ) : null}

                  <TextInput
                    placeholder={t("admin.PromotionDescription")}
                    value={promoDescription}
                    onChangeText={(text) => {
                      setPromoDescription(text);
                      if (text.trim()) setPromoDescriptionError("");
                    }}
                    style={styles.inputField}
                  />
                  {promoDescriptionError ? (
                    <Text style={styles.errorText}>{promoDescriptionError}</Text>
                  ) : null}

                  <View style={styles.discountTypeContainer}>
                    {["percentage", "fixed"].map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.discountTypeButton,
                          promoDiscountType === type && styles.discountTypeButtonActive,
                        ]}
                        onPress={() => setPromoDiscountType(type)}
                      >
                        <Text
                          style={[
                            styles.discountTypeText,
                            promoDiscountType === type && styles.discountTypeTextActive,
                          ]}
                        >
                          {t(`admin.${type}`)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TextInput
                    placeholder={t("admin.promotionValue")}
                    value={promoDiscountValue}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      setPromoDiscountValue(text);
                      if (!isNaN(text) && text.trim()) setPromoDiscountValueError("");
                    }}
                    style={styles.inputField}
                  />
                  {promoDiscountValueError ? (
                    <Text style={styles.errorText}>{promoDiscountValueError}</Text>
                  ) : null}

                  <TextInput
                    placeholder={t("admin.minOrderAmount")}
                    value={promoMinOrderAmount}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      setPromoMinOrderAmount(text);
                      if (!isNaN(text) && text.trim()) setPromoMinOrderAmountError("");
                    }}
                    style={styles.inputField}
                  />
                  {promoMinOrderAmountError ? (
                    <Text style={styles.errorText}>{promoMinOrderAmountError}</Text>
                  ) : null}

                  <TextInput
                    placeholder={t("admin.promoMaxUsesInvalid")} // Should be t("admin.maxUses")
                    value={promoMaxUses}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      setPromoMaxUses(text);
                      if (!isNaN(text) && text.trim()) setPromoMaxUsesError("");
                    }}
                    style={styles.inputField}
                  />
                  {promoMaxUsesError ? (
                    <Text style={styles.errorText}>{promoMaxUsesError}</Text>
                  ) : null}

                  <TextInput
                    placeholder={t("admin.promotionStart")}
                    value={promoValidFrom}
                    onChangeText={setPromoValidFrom}
                    style={styles.inputField}
                  />

                  <TextInput
                    placeholder={t("admin.promotionEnd")}
                    value={promoValidUntil}
                    onChangeText={setPromoValidUntil}
                    style={styles.inputField}
                  />

                  <View style={{ flexDirection: isRTL ? "row-reverse" : "row", alignItems: "center", marginBottom: 12 }}>
                    <Text style={[styles.detailLabel, { marginRight: isRTL ? 0 : 8, marginLeft: isRTL ? 8 : 0 }]}>
                      {t("admin.activeStatus")}
                    </Text>
                    <Switch
                      value={promoActive}
                      onValueChange={setPromoActive}
                      trackColor={{ false: isDark ? "#3d3d3d" : "#e5d4c0", true: isDark ? "#4d4d4d" : "#8d6e63" }}
                      thumbColor={promoActive ? "#fff" : "#f4f3f4"}
                    />
                  </View>

                  <View style={{ flexDirection: isRTL ? "row-reverse" : "row", justifyContent: "space-between", marginTop: 12 }}>
                    <TouchableOpacity
                      onPress={handleAddPromotion}
                      style={[styles.addButton, { flex: 1, marginRight: isRTL ? 0 : 6, marginLeft: isRTL ? 6 : 0 }]}
                      disabled={formLoading}
                    >
                      <Text style={styles.addButtonText}>{t("common.save")}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={clearPromoForm}
                      style={[styles.addButton, { flex: 1, backgroundColor: isDark ? "#3d3d3d" : "#aaa", marginRight: isRTL ? 6 : 0, marginLeft: isRTL ? 0 : 6 }]}
                      disabled={formLoading}
                    >
                      <Text style={styles.addButtonText}>{t("common.cancel")}</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PromotionsScreen;