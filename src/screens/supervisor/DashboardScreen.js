import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  RefreshControl,
  Platform,
  Image,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { LineChart } from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient";
import { Icon } from "react-native-elements";
import { getDashboardMetrics, mockData } from "../../data/mockData";
import {
  TrendingUp,
  BarChart2,
  Users,
  Coffee,
  Star,
  Calendar,
  Bell,
  Clock,
  ChevronRight,
} from "lucide-react-native";

const { width: screenWidth } = Dimensions.get("window");

const DashboardScreen = () => {
  const { t, i18n } = useTranslation();
  const theme = useSelector((state) => state.theme.mode);
  const [refreshing, setRefreshing] = React.useState(false);
  const { currentLanguage } = useSelector((state) => state.language);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Enhanced animations
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const isRTL = currentLanguage === "ar";
  const isDark = theme === "dark";

  useEffect(() => {
    // Enhanced entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(400),
        Animated.spring(rotateAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const onQuickLinkPress = (index) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Use mock data for all dashboard content
  const metrics = getDashboardMetrics();
  const recentOrders = mockData.dashboard.recentOrders;
  const lowStockItems = mockData.dashboard.lowStockItems;
  const staffOnDuty = mockData.dashboard.staffOnDuty;
  const weeklySales = mockData.dashboard.weeklySales;

  // Sales data for the chart
  const salesData = {
    labels: [
      t("common.monday").slice(0, 3),
      t("common.tuesday").slice(0, 3),
      t("common.wednesday").slice(0, 3),
      t("common.thursday").slice(0, 3),
      t("common.friday").slice(0, 3),
      t("common.saturday").slice(0, 3),
      t("common.sunday").slice(0, 3),
    ],
    datasets: [
      {
        data: weeklySales.map((day) => day.sales),
        color: (opacity = 1) => `rgba(78, 52, 46, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  // Transform metrics object to array for UI
  const metricsCards = [
    {
      id: 1,
      title: t("supervisor.totalRevenue"),
      value: `$${metrics.totalRevenue.toLocaleString()}`,
      icon: "attach-money",
      color: "#8d6e63",
      gradient: ["#8d6e63", "#6d4c41"],
      change: "+12%",
      isPositive: true,
    },
    {
      id: 2,
      title: t("supervisor.totalOrders"),
      value: metrics.totalOrders.toLocaleString(),
      icon: "shopping-cart",
      color: "#8d6e63",
      gradient: ["#8d6e63", "#6d4c41"],
      change: "+8%",
      isPositive: true,
    },
    {
      id: 3,
      title: t("supervisor.avgOrderValue"),
      value: `$${metrics.avgOrderValue}`,
      icon: "trending-up",
      color: "#8d6e63",
      gradient: ["#8d6e63", "#6d4c41"],
      change: "+2%",
      isPositive: true,
    },
    {
      id: 4,
      title: t("supervisor.customerSatisfaction"),
      value: `${metrics.customerSatisfaction}★`,
      icon: "star",
      color: "#8d6e63",
      gradient: ["#8d6e63", "#6d4c41"],
      change: "+1%",
      isPositive: true,
    },
    {
      id: 5,
      title: t("supervisor.growthRate"),
      value: `${metrics.growthRate}%`,
      icon: "trending-up",
      color: "#8d6e63",
      gradient: ["#8d6e63", "#6d4c41"],
      change: "+5%",
      isPositive: true,
    },
  ];

  const chartConfig = {
    backgroundColor: "#fffaf5",
    backgroundGradientFrom: "#fffaf5",
    backgroundGradientTo: "#fffaf5",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(78, 52, 46, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 79, 66, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#8d6e63",
    },
  };

  const alerts = [
    {
      id: 1,
      type: "warning",
      title: t("supervisor.lowInventoryTitle"),
      message: `${t("products.arabicaBeans")} ${t("supervisor.stockBelowThreshold")}`,
      icon: "warning",
      color: "#d32f2f",
      bgColor: "#fffaf5",
      textColor: "#d32f2f",
    },
    {
      id: 2,
      type: "info",
      title: t("supervisor.peakHoursTitle"),
      message: t("supervisor.approachingPeakHours"),
      icon: "access-time",
      color: "#f57c00",
      bgColor: "#fffaf5",
      textColor: "#f57c00",
    },
    {
      id: 3,
      type: "success",
      title: t("supervisor.dailySalesTarget"),
      message: t("supervisor.dailySalesTarget"),
      icon: "check-circle",
      color: "#388e3c",
      bgColor: "#fffaf5",
      textColor: "#388e3c",
    },
  ];

  const quickLinks = [
    {
      icon: "BarChart2",
      label: t("supervisor.salesReport"),
    },
    {
      icon: "Calendar",
      label: t("supervisor.staffSchedule"),
    },
    {
      icon: "Bell",
      label: t("supervisor.notifications"),
    },
    {
      icon: "Coffee",
      label: t("supervisor.inventory"),
    },
  ];

  const renderIcon = (iconName, size = 28, color = "#4e342e") => {
    switch (iconName) {
      case "TrendingUp":
        return <TrendingUp size={size} color={color} />;
      case "BarChart2":
        return <BarChart2 size={size} color={color} />;
      case "Users":
        return <Users size={size} color={color} />;
      case "Coffee":
        return <Coffee size={size} color={color} />;
      case "Star":
        return <Star size={size} color={color} />;
      case "Calendar":
        return <Calendar size={size} color={color} />;
      case "Bell":
        return <Bell size={size} color={color} />;
      case "Clock":
        return <Clock size={size} color={color} />;
      default:
        return null;
    }
  };

  const styles = getStyles(isDark, isRTL);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>{t("common.welcome")}</Text>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString(
              currentLanguage === "ar" ? "ar-SA" : "en-US",
              {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Icon name="account-circle" size={40} color="#8d6e63" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#8d6e63"
            colors={["#8d6e63"]}
          />
        }
      >
        {/* Overview Cards */}
        <View style={styles.overviewContainer}>
          {metricsCards.slice(0, 2).map((metric, index) => (
            <Animated.View
              key={metric.id}
              style={[
                styles.overviewCard,
                index === 1 && styles.overviewCardRight,
              ]}
            >
              <LinearGradient
                colors={metric.gradient}
                style={styles.overviewGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.overviewIconContainer}>
                  <Icon
                    name={metric.icon}
                    type="material"
                    size={28}
                    color="#FFFFFF"
                  />
                </View>
                <Text style={styles.overviewValue}>{metric.value}</Text>
                <Text style={styles.overviewTitle}>{metric.title}</Text>
                <View style={styles.overviewTrend}>
                  <Icon
                    name={metric.isPositive ? "trending-up" : "trending-down"}
                    type="material"
                    size={16}
                    color={metric.isPositive ? "#4caf50" : "#f44336"}
                  />
                  <Text
                    style={[
                      styles.overviewTrendText,
                      { color: metric.isPositive ? "#4caf50" : "#f44336" },
                    ]}
                  >
                    {metric.change}
                  </Text>
                </View>
              </LinearGradient>
            </Animated.View>
          ))}
        </View>

        {/* Sales Chart Section */}
        <View style={styles.chartSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t("supervisor.weeklySalesOverview")}
            </Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>{t("common.seeAll")}</Text>
              <ChevronRight size={16} color="#8d6e63" />
            </TouchableOpacity>
          </View>
          <View style={styles.chartCard}>
            <LineChart
              data={salesData}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                backgroundColor: "#fffaf5",
                backgroundGradientFrom: "#fffaf5",
                backgroundGradientTo: "#fffaf5",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(141, 110, 99, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(78, 52, 46, ${opacity})`,
                propsForBackgroundLines: {
                  strokeDasharray: "",
                  stroke: "rgba(141, 110, 99, 0.1)",
                  strokeWidth: 1,
                },
                propsForLabels: {
                  fontSize: 12,
                  fontWeight: "600",
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#8d6e63",
                },
              }}
              bezier
              style={styles.chart}
              withInnerLines={true}
              withOuterLines={false}
              withVerticalLines={false}
              withHorizontalLines={true}
              withVerticalLabels={true}
              withHorizontalLabels={true}
              fromZero={true}
            />
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          {metricsCards.slice(2).map((metric) => (
            <TouchableOpacity key={metric.id} style={styles.statCard}>
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: metric.gradient[0] + "15" },
                ]}
              >
                <Icon
                  name={metric.icon}
                  type="material"
                  size={24}
                  color={metric.gradient[0]}
                />
              </View>
              <Text style={styles.statValue}>{metric.value}</Text>
              <Text style={styles.statLabel}>{metric.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Alerts */}
        <View style={styles.alertsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t("supervisor.recentAlerts")}
            </Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>{t("common.seeAll")}</Text>
              <ChevronRight size={16} color="#8d6e63" />
            </TouchableOpacity>
          </View>
          {alerts.map((alert) => (
            <TouchableOpacity key={alert.id} style={styles.alertCard}>
              <View
                style={[
                  styles.alertIcon,
                  { backgroundColor: `${alert.color}15` },
                ]}
              >
                <Icon
                  name={alert.icon}
                  type="material"
                  size={24}
                  color={alert.color}
                />
              </View>
              <View style={styles.alertInfo}>
                <Text style={styles.alertTitle}>{alert.title}</Text>
                <Text style={styles.alertMessage}>{alert.message}</Text>
              </View>
              <ChevronRight size={20} color="#8d6e63" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t("supervisor.quickLinks")}
            </Text>
          </View>
          <View style={styles.actionGrid}>
            {quickLinks.map((link, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.actionCard}
                onPress={() => onQuickLinkPress(idx)}
                activeOpacity={0.7}
              >
                <View style={styles.actionIcon}>
                  {renderIcon(link.icon, 24, "#4e342e")}
                </View>
                <Text style={styles.actionLabel}>{link.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const getStyles = (isDark, isRTL) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f7f3ef",
    },
    topBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: Platform.OS === "ios" ? 60 : 20,
      paddingBottom: 20,
      backgroundColor: "#fffaf5",
      borderBottomWidth: 1,
      borderBottomColor: "#e5d4c0",
    },
    greetingContainer: {
      flex: 1,
    },
    greetingText: {
      fontSize: 14,
      color: "#6b4f42",
      marginBottom: 4,
    },
    dateText: {
      fontSize: 18,
      fontWeight: "600",
      color: "#4e342e",
    },
    profileButton: {
      padding: 4,
    },
    scrollContainer: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 30,
    },
    overviewContainer: {
      flexDirection: "row",
      padding: 20,
      gap: 15,
    },
    overviewCard: {
      flex: 1,
      borderRadius: 20,
      overflow: "hidden",
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
    },
    overviewCardRight: {
      marginLeft: 15,
    },
    overviewGradient: {
      padding: 15,
      height: 140,
    },
    overviewIconContainer: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      padding: 8,
      borderRadius: 12,
      alignSelf: "flex-start",
      marginBottom: 12,
    },
    overviewValue: {
      fontSize: 24,
      fontWeight: "700",
      color: "#FFFFFF",
      marginBottom: 4,
    },
    overviewTitle: {
      fontSize: 14,
      color: "rgba(255, 255, 255, 0.9)",
      marginBottom: 12,
    },
    overviewTrend: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FFFFFF",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: "flex-start",
    },
    overviewTrendText: {
      fontSize: 12,
      fontWeight: "600",
      marginLeft: 4,
    },
    chartSection: {
      marginTop: 10,
      paddingHorizontal: 20,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: "#4e342e",
    },
    seeAllButton: {
      flexDirection: "row",
      alignItems: "center",
    },
    seeAllText: {
      fontSize: 14,
      color: "#8d6e63",
      marginRight: 4,
    },
    chartCard: {
      backgroundColor: "#fffaf5",
      borderRadius: 20,
      padding: 15,
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      borderWidth: 1,
      borderColor: "#e5d4c0",
    },
    chart: {
      marginVertical: 8,
      borderRadius: 16,
    },
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      padding: 20,
      gap: 15,
    },
    statCard: {
      width: (screenWidth - 55) / 2,
      backgroundColor: "#fffaf5",
      borderRadius: 20,
      padding: 15,
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      borderWidth: 1,
      borderColor: "#e5d4c0",
    },
    statIconContainer: {
      padding: 10,
      borderRadius: 15,
      alignSelf: "flex-start",
      marginBottom: 12,
    },
    statValue: {
      fontSize: 20,
      fontWeight: "700",
      color: "#4e342e",
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 14,
      color: "#6b4f42",
    },
    alertsSection: {
      paddingHorizontal: 20,
      marginTop: 10,
    },
    alertCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fffaf5",
      borderRadius: 20,
      padding: 15,
      marginBottom: 12,
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      borderWidth: 1,
      borderColor: "#e5d4c0",
    },
    alertIcon: {
      padding: 10,
      borderRadius: 15,
      marginRight: 15,
    },
    alertInfo: {
      flex: 1,
    },
    alertTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: "#4e342e",
      marginBottom: 4,
    },
    alertMessage: {
      fontSize: 14,
      color: "#6b4f42",
    },
    quickActions: {
      paddingHorizontal: 20,
      marginTop: 20,
    },
    actionGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 15,
    },
    actionCard: {
      width: (screenWidth - 55) / 2,
      backgroundColor: "#fffaf5",
      borderRadius: 20,
      padding: 20,
      alignItems: "center",
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      borderWidth: 1,
      borderColor: "#e5d4c0",
    },
    actionIcon: {
      backgroundColor: "rgba(141, 110, 99, 0.1)",
      padding: 12,
      borderRadius: 16,
      marginBottom: 12,
    },
    actionLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: "#4e342e",
      textAlign: "center",
    },
  });

export default DashboardScreen;
