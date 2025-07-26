import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Star,
  Calendar,
  Download,
  FileText,
  ArrowLeft,
  ArrowRight,
} from "lucide-react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const BASE_URL = "http://api-coffee.m-zedan.com/api";

const AnalyticsScreen = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useSelector((state) => state.language);
  const isRTL = currentLanguage === "ar";
  const [timeRange, setTimeRange] = useState("week");
  const [dashboardData, setDashboardData] = useState({
    summary: {
      products: { total: 0, low_stock: 0, out_of_stock: 0 },
      users: { total: 0, active: 0 },
      today: { orders: 0, sales: 0, purchases: 0 },
      monthly: { orders: 0, sales: 0, purchases: 0 },
    },
    trends: { sales_trend: [] },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const chartConfig = {
    backgroundColor: "#8d6e63",
    backgroundGradientFrom: "#8d6e63",
    backgroundGradientTo: "#6d4c41",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 12,
      fontWeight: "600",
    },
  };

  // Fetch dashboard data from API
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        throw new Error(t("worker.noToken"));
      }
      const response = await fetch(`${BASE_URL}/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Dashboard API response:", result);
      setDashboardData(result);
    } catch (error) {
      console.error("Error fetching dashboard data:", error.message);
      setError(error.message);
      Alert.alert(t("worker.error"), error.message || t("worker.fetchFailed"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Revenue Chart Data
  const revenueData = {
    week: {
      labels: dashboardData.trends.sales_trend.map((trend) =>
        new Date(trend.date).toLocaleDateString(isRTL ? "ar-EG" : "en-US", {
          day: "numeric",
          month: "short",
        })
      ).reverse(),
      datasets: [
        {
          data: dashboardData.trends.sales_trend.map((trend) => parseFloat(trend.sales)).reverse(),
        },
      ],
    },
    month: {
      labels: isRTL
        ? [t("admin.week4"), t("admin.week3"), t("admin.week2"), t("admin.week1")]
        : [t("admin.week1"), t("admin.week2"), t("admin.week3"), t("admin.week4")],
      datasets: [
        {
          data: isRTL
            ? [16000, 13500, 15000, 12000] // Mock data for monthly
            : [12000, 15000, 13500, 16000],
        },
      ],
    },
  };

  // Category Performance (Mock data as no category data in API)
  const categoryData = {
    labels: isRTL
      ? [
          t("admin.others"),
          t("admin.pastries"),
          t("admin.tea"),
          t("admin.coldCoffee"),
          t("admin.hotCoffee"),
        ]
      : [
          t("admin.hotCoffee"),
          t("admin.coldCoffee"),
          t("admin.tea"),
          t("admin.pastries"),
          t("admin.others"),
        ],
    datasets: [
      {
        data: isRTL ? [10, 15, 15, 25, 35] : [35, 25, 15, 15, 10],
      },
    ],
  };

  // Peak Hours Distribution (Mock data as no peak hours in API)
  const pieChartData = [
    {
      name: t("admin.morning"),
      population: 35,
      color: "#8d6e63",
      legendFontColor: "#4e342e",
    },
    {
      name: t("admin.afternoon"),
      population: 40,
      color: "#6d4c41",
      legendFontColor: "#4e342e",
    },
    {
      name: t("admin.evening"),
      population: 25,
      color: "#a1887f",
      legendFontColor: "#4e342e",
    },
  ];

  const renderIcon = (
    iconName,
    size = 24,
    color = "#4e342e",
    isRTL = false
  ) => {
    if (isRTL) {
      if (iconName === "ArrowLeft") {
        iconName = "ArrowRight";
      } else if (iconName === "ArrowRight") {
        iconName = "ArrowLeft";
      }
    }

    const iconStyle = isRTL ? { alignSelf: "flex-end" } : {};

    switch (iconName) {
      case "TrendingUp":
        return <TrendingUp size={size} color={color} style={iconStyle} />;
      case "DollarSign":
        return <DollarSign size={size} color={color} style={iconStyle} />;
      case "ShoppingBag":
        return <ShoppingBag size={size} color={color} style={iconStyle} />;
      case "Star":
        return <Star size={size} color={color} style={iconStyle} />;
      case "Calendar":
        return <Calendar size={size} color={color} style={iconStyle} />;
      case "Download":
        return <Download size={size} color={color} style={iconStyle} />;
      case "FileText":
        return <FileText size={size} color={color} style={iconStyle} />;
      case "ArrowLeft":
        return <ArrowLeft size={size} color={color} style={iconStyle} />;
      case "ArrowRight":
        return <ArrowRight size={size} color={color} style={iconStyle} />;
      default:
        return null;
    }
  };

  const handleExportPDF = async () => {
    try {
      const htmlContent = `
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              body { font-family: Arial; padding: 24px; direction: ${isRTL ? "rtl" : "ltr"}; }
              h1 { color: #333; }
              table { width: 100%; border-collapse: collapse; margin-top: 16px; }
              th, td { border: 1px solid #ccc; padding: 8px; text-align: ${isRTL ? "right" : "left"}; }
            </style>
          </head>
          <body>
            <h1>${t("admin.analyticsReport")}</h1>
            <table>
              <tr><th>${t("admin.metric")}</th><th>${t("admin.value")}</th></tr>
              <tr><td>${t("admin.totalRevenue")}</td><td>${dashboardData.summary.monthly.sales.toFixed(2)}</td></tr>
              <tr><td>${t("admin.totalOrders")}</td><td>${dashboardData.summary.monthly.orders}</td></tr>
              <tr><td>${t("admin.users")}</td><td>${dashboardData.summary.users.total}</td></tr>
              <tr><td>${t("admin.products")}</td><td>${dashboardData.summary.products.total}</td></tr>
            </table>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error("Error generating PDF:", error);
      Alert.alert(t("worker.error"), t("worker.exportFailed"));
    }
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
    section: {
      marginVertical: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: "#4e342e",
      marginBottom: 16,
      textAlign: isRTL ? "right" : "left",
    },
    timeRangeContainer: {
      flexDirection: isRTL ? "row-reverse" : "row",
      backgroundColor: "#fffaf5",
      borderRadius: 20,
      padding: 4,
      borderWidth: 1,
      borderColor: "#e5d4c0",
    },
    timeRangeButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    timeRangeButtonActive: {
      backgroundColor: "#8d6e63",
    },
    timeRangeButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: "#6b4f42",
    },
    timeRangeButtonTextActive: {
      color: "#fff",
    },
    metricsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginBottom: 24,
    },
    metricCard: {
      width: (width - 48) / 2,
      backgroundColor: "#fffaf5",
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: "#e5d4c0",
    },
    metricValue: {
      fontSize: 24,
      fontWeight: "800",
      color: "#6d4c41",
      marginBottom: 8,
      textAlign: isRTL ? "right" : "left",
    },
    metricLabel: {
      fontSize: 14,
      color: "#6b4f42",
      fontWeight: "600",
      textAlign: isRTL ? "right" : "left",
    },
    chartContainer: {
      backgroundColor: "#fffaf5",
      borderRadius: 24,
      padding: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: "#e5d4c0",
    },
    chartTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: "#4e342e",
      marginBottom: 16,
      textAlign: isRTL ? "right" : "left",
    },
    exportContainer: {
      flexDirection: isRTL ? "row-reverse" : "row",
      marginBottom: 24,
      gap: 16,
    },
    exportButton: {
      flex: 1,
      backgroundColor: "#8d6e63",
      padding: 16,
      borderRadius: 20,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "center",
    },
    exportButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "700",
      marginRight: isRTL ? 0 : 8,
      marginLeft: isRTL ? 8 : 0,
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
      color: "#dc2626",
      marginVertical: 16,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("admin.analytics")}</Text>
        <Text style={styles.headerSubtitle}>
          {t("admin.analyticsSubtitle")}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8d6e63" />
          </View>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>
            {/* Time Range Selector */}
            <View style={styles.section}>
              <View style={styles.timeRangeContainer}>
                <TouchableOpacity
                  style={[
                    styles.timeRangeButton,
                    timeRange === "week" && styles.timeRangeButtonActive,
                  ]}
                  onPress={() => setTimeRange("week")}
                >
                  <Text
                    style={[
                      styles.timeRangeButtonText,
                      timeRange === "week" && styles.timeRangeButtonTextActive,
                    ]}
                  >
                    {t("admin.thisWeek")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.timeRangeButton,
                    timeRange === "month" && styles.timeRangeButtonActive,
                  ]}
                  onPress={() => setTimeRange("month")}
                >
                  <Text
                    style={[
                      styles.timeRangeButtonText,
                      timeRange === "month" && styles.timeRangeButtonTextActive,
                    ]}
                  >
                    {t("admin.thisMonth")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Key Metrics */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t("admin.keyMetrics")}</Text>
              <View style={styles.metricsContainer}>
                <View style={styles.metricCard}>
                  {renderIcon("DollarSign", 24, "#6d4c41", isRTL)}
                  <Text style={styles.metricValue}>
                    ${dashboardData.summary[timeRange === "week" ? "today" : "monthly"].sales.toFixed(2)}
                  </Text>
                  <Text style={styles.metricLabel}>{t("admin.totalRevenue")}</Text>
                </View>
                <View style={styles.metricCard}>
                  {renderIcon("ShoppingBag", 24, "#6d4c41", isRTL)}
                  <Text style={styles.metricValue}>
                    {dashboardData.summary[timeRange === "week" ? "today" : "monthly"].orders}
                  </Text>
                  <Text style={styles.metricLabel}>{t("admin.totalOrders")}</Text>
                </View>
                <View style={styles.metricCard}>
                  {renderIcon("TrendingUp", 24, "#6d4c41", isRTL)}
                  <Text style={styles.metricValue}>
                    {dashboardData.summary.users.total}
                  </Text>
                  <Text style={styles.metricLabel}>{t("admin.users")}</Text>
                </View>
                <View style={styles.metricCard}>
                  {renderIcon("Star", 24, "#6d4c41", isRTL)}
                  <Text style={styles.metricValue}>
                    {dashboardData.summary.products.total}
                  </Text>
                  <Text style={styles.metricLabel}>{t("admin.products")}</Text>
                </View>
              </View>
            </View>

            {/* Revenue Chart */}
            <View style={styles.section}>
              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>{t("admin.revenueOverview")}</Text>
                <LineChart
                  data={revenueData[timeRange]}
                  width={width - 72}
                  height={220}
                  chartConfig={chartConfig}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                  getDotProps={() => ({
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#6d4c41",
                  })}
                />
              </View>
            </View>

            {/* Category Performance */}
            <View style={styles.section}>
              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>
                  {t("admin.categoryPerformance")}
                </Text>
                <BarChart
                  data={categoryData}
                  width={width - 72}
                  height={220}
                  chartConfig={chartConfig}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                />
              </View>
            </View>

            {/* Peak Hours Distribution */}
            <View style={styles.section}>
              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>
                  {t("admin.peakHoursDistribution")}
                </Text>
                <PieChart
                  data={pieChartData}
                  width={width - 72}
                  height={220}
                  chartConfig={chartConfig}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                />
              </View>
            </View>

            {/* Export Actions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t("admin.exportData")}</Text>
              <View style={styles.exportContainer}>
                <TouchableOpacity
                  style={styles.exportButton}
                  onPress={handleExportPDF}
                >
                  {renderIcon("FileText", 20, "#fff", isRTL)}
                  <Text style={styles.exportButtonText}>
                    {t("admin.exportPDF")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default AnalyticsScreen;