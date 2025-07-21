import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  RefreshControl,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { LineChart, BarChart } from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Download,
  FileText,
  Calendar,
  DollarSign,
  ShoppingCart,
  Target,
  Percent,
} from "lucide-react-native";
import { getSalesData } from "../../data/mockData";

const { width: screenWidth } = Dimensions.get("window");

const SalesReportScreen = () => {
  const { t, i18n } = useTranslation();
  const theme = useSelector((state) => state.theme.mode);
  const [timeRange, setTimeRange] = useState("week");
  const [refreshing, setRefreshing] = useState(false);

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
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const chartConfig = {
    backgroundColor: isDark ? "#1F2937" : "#8B4513",
    backgroundGradientFrom: isDark ? "#1F2937" : "#8B4513",
    backgroundGradientTo: isDark ? "#374151" : "#D2691E",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffffff",
    },
  };

  // Use mock data for all sales report content
  const salesData = getSalesData();
  const timeRanges = salesData.timeRanges;
  const popularProducts = salesData.popularProducts;
  const salesByCategory = salesData.salesByCategory;
  const hourlySales = salesData.hourlySales;

  const productData = {
    labels: [
      t("products.espresso"),
      t("products.latte"),
      t("products.cappuccino"),
      t("products.mocha"),
      t("products.tea"),
    ],
    datasets: [
      {
        data: [20, 45, 28, 80, 99],
        colors: [
          (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
          (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
          (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
          (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
          (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
        ],
      },
    ],
  };

  const keyMetrics = [
    {
      id: 1,
      title: t("supervisor.totalRevenue"),
      value: "$12,345",
      change: "+8.2%",
      isPositive: true,
      icon: DollarSign,
      color: "#10B981",
    },
    {
      id: 2,
      title: t("supervisor.totalOrders"),
      value: "1,234",
      change: "+15.3%",
      isPositive: true,
      icon: ShoppingCart,
      color: "#3B82F6",
    },
    {
      id: 3,
      title: t("supervisor.avgOrderValue"),
      value: "$10.50",
      change: "-2.1%",
      isPositive: false,
      icon: Target,
      color: "#F59E0B",
    },
    {
      id: 4,
      title: t("supervisor.growthRate"),
      value: "15%",
      change: "+3.2%",
      isPositive: true,
      icon: TrendingUp,
      color: "#8B5CF6",
    },
  ];

  const handleExport = (type) => {
    // Handle export functionality
    console.log(`Exporting ${type}`);
  };

  const styles = getStyles(isDark, isRTL);

  return (
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
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{t("supervisor.salesReport")}</Text>
            <Text style={styles.subtitle}>
              {t("supervisor.performance")} & {t("supervisor.trend")}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Calendar size={20} color={isDark ? "#FFFFFF" : "#8B4513"} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Time Range Selector */}
        <Animated.View
          style={[
            styles.timeRangeContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>{t("supervisor.timeRange")}</Text>
          <View style={styles.timeRangeSelector}>
            {timeRanges.map((range) => (
              <TouchableOpacity
                key={range.key}
                onPress={() => setTimeRange(range.key)}
                style={[
                  styles.timeRangeButton,
                  timeRange === range.key && styles.timeRangeButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.timeRangeText,
                    timeRange === range.key && styles.timeRangeTextActive,
                  ]}
                >
                  {range.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Key Metrics */}
        <Animated.View
          style={[
            styles.metricsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>{t("supervisor.keyMetrics")}</Text>
          <View style={styles.metricsGrid}>
            {keyMetrics.map((metric) => (
              <View key={metric.id} style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <View
                    style={[
                      styles.metricIcon,
                      { backgroundColor: `${metric.color}20` },
                    ]}
                  >
                    <metric.icon size={20} color={metric.color} />
                  </View>
                  <View
                    style={[
                      styles.changeIndicator,
                      {
                        backgroundColor: metric.isPositive
                          ? "#10B981"
                          : "#EF4444",
                      },
                    ]}
                  >
                    {metric.isPositive ? (
                      <TrendingUp size={12} color="#FFFFFF" />
                    ) : (
                      <TrendingDown size={12} color="#FFFFFF" />
                    )}
                    <Text style={styles.changeText}>{metric.change}</Text>
                  </View>
                </View>
                <Text style={styles.metricValue}>{metric.value}</Text>
                <Text style={styles.metricTitle}>{metric.title}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Sales Overview Chart */}
        <Animated.View
          style={[
            styles.chartContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>
            {t("supervisor.salesOverview")}
          </Text>
          <View style={styles.chartCard}>
            <LineChart
              data={salesData[timeRange]}
              width={screenWidth - 48}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              withInnerLines={false}
              withOuterLines={false}
              withVerticalLabels={true}
              withHorizontalLabels={true}
              fromZero={true}
            />
          </View>
        </Animated.View>

        {/* Popular Products Chart */}
        <Animated.View
          style={[
            styles.chartContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>
            {t("supervisor.popularProducts")}
          </Text>
          <View style={styles.chartCard}>
            <BarChart
              data={productData}
              width={screenWidth - 48}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              withInnerLines={false}
              withHorizontalLabels={true}
              withVerticalLabels={false}
              fromZero={true}
              showValuesOnTopOfBars={true}
            />
          </View>
        </Animated.View>

        {/* Export Actions */}
        <Animated.View
          style={[
            styles.exportContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>{t("common.export")}</Text>
          <View style={styles.exportButtons}>
            <TouchableOpacity
              style={styles.exportButton}
              onPress={() => handleExport("pdf")}
            >
              <LinearGradient
                colors={["#EF4444", "#DC2626"]}
                style={styles.exportButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <FileText size={20} color="#FFFFFF" />
                <Text style={styles.exportButtonText}>
                  {t("supervisor.exportPDF")}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.exportButton}
              onPress={() => handleExport("csv")}
            >
              <LinearGradient
                colors={["#10B981", "#059669"]}
                style={styles.exportButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Download size={20} color="#FFFFFF" />
                <Text style={styles.exportButtonText}>
                  {t("supervisor.exportCSV")}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </ScrollView>
  );
};

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
    headerActions: {
      flexDirection: "row",
      gap: 8,
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
    timeRangeContainer: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: isDark ? "#FFFFFF" : "#1F2937",
      marginBottom: 16,
      textAlign: isRTL ? "right" : "left",
    },
    timeRangeSelector: {
      flexDirection: "row",
      backgroundColor: isDark ? "#374151" : "#F3F4F6",
      borderRadius: 12,
      padding: 4,
    },
    timeRangeButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: "center",
    },
    timeRangeButtonActive: {
      backgroundColor: "#8B4513",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    timeRangeText: {
      fontSize: 14,
      fontWeight: "500",
      color: isDark ? "#9CA3AF" : "#6B7280",
    },
    timeRangeTextActive: {
      color: "#FFFFFF",
      fontWeight: "600",
    },
    metricsContainer: {
      marginBottom: 24,
    },
    metricsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    metricCard: {
      width: "48%",
      backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    metricHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    metricIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    changeIndicator: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      gap: 4,
    },
    changeText: {
      fontSize: 12,
      fontWeight: "600",
      color: "#FFFFFF",
    },
    metricValue: {
      fontSize: 24,
      fontWeight: "700",
      color: isDark ? "#FFFFFF" : "#1F2937",
      marginBottom: 4,
    },
    metricTitle: {
      fontSize: 14,
      color: isDark ? "#9CA3AF" : "#6B7280",
      fontWeight: "500",
    },
    chartContainer: {
      marginBottom: 24,
    },
    chartCard: {
      backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
      borderRadius: 16,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    chart: {
      borderRadius: 16,
    },
    exportContainer: {
      marginBottom: 24,
    },
    exportButtons: {
      flexDirection: "row",
      gap: 12,
    },
    exportButton: {
      flex: 1,
      borderRadius: 12,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    exportButtonGradient: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
      paddingHorizontal: 20,
      gap: 8,
    },
    exportButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
  });

export default SalesReportScreen;
