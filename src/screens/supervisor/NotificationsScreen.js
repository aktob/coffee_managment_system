import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  Animated,
  I18nManager,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  Bell,
  AlertTriangle,
  Users,
  Settings,
  Check,
  Trash2,
  Clock,
  Filter,
  Eye,
  EyeOff,
} from "lucide-react-native";
import { getNotifications } from "../../data/mockData";

const NotificationsScreen = () => {
  const { t } = useTranslation();
  const currentLanguage = useSelector(
    (state) => state.language?.currentLanguage || "en"
  );
  const isRTL = currentLanguage === "ar";
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [showRead, setShowRead] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    loadNotifications();
  }, [isRTL]);

  const loadNotifications = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setNotifications(getNotifications());
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadNotifications().finally(() => setRefreshing(false));
  }, []);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    Alert.alert(
      t("notifications.markAllAsRead"),
      t("notifications.markAllAsReadConfirm"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.confirm"),
          onPress: () =>
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))),
        },
      ]
    );
  };

  const clearAll = () => {
    Alert.alert(
      t("notifications.clearAll"),
      t("notifications.clearAllConfirm"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.clear"),
          style: "destructive",
          onPress: () => setNotifications([]),
        },
      ]
    );
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getIcon = (type) => {
    const props = { size: 20, color: "#6b4f42" };
    switch (type) {
      case "alert":
        return <AlertTriangle {...props} color="#d32f2f" />;
      case "staff":
        return <Users {...props} color="#8d6e63" />;
      case "system":
        return <Settings {...props} color="#6d4c41" />;
      default:
        return <Bell {...props} />;
    }
  };

  const filtered = notifications.filter(
    (n) =>
      (selectedFilter === "all" || n.type === selectedFilter) &&
      (showRead || !n.read)
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: "#f7f3ef",
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[
            styles.header,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={[styles.title, { textAlign: isRTL ? "right" : "left" }]}
            >
              {t("supervisor.notifications")}
            </Text>
            <Text
              style={[styles.subtitle, { textAlign: isRTL ? "right" : "left" }]}
            >
              {unreadCount} {t("notifications.unreadNotifications")}
            </Text>
          </View>
          <View
            style={{
              flexDirection: isRTL ? "row-reverse" : "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => setShowRead((s) => !s)}
              style={{
                padding: 8,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              {showRead ? (
                <Eye size={28} color="#fff" />
              ) : (
                <EyeOff size={28} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          {(isRTL
            ? ["system", "staff", "alert", "all"]
            : ["all", "alert", "staff", "system"]
          ).map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setSelectedFilter(type)}
              style={[
                styles.tab,
                selectedFilter === type && styles.activeTab,
                {
                  marginLeft: isRTL ? 8 : 0,
                  marginRight: isRTL ? 0 : 8,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedFilter === type && styles.activeTabText,
                  { textAlign: isRTL ? "right" : "left" },
                ]}
              >
                {t(`notifications.${type}`) || t(`common.${type}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.notificationsContainer}>
          {filtered.length > 0 ? (
            filtered.map((n) => (
              <Animated.View
                key={n.id}
                style={[
                  styles.card,
                  {
                    borderColor: n.read ? "#e5d4c0" : "#8d6e63",
                    backgroundColor: n.read ? "#fffaf5" : "#fff",
                  },
                ]}
              >
                <View
                  style={[
                    styles.cardHeader,
                    { flexDirection: isRTL ? "row-reverse" : "row" },
                  ]}
                >
                  <View style={styles.iconContainer}>{getIcon(n.type)}</View>
                  <Text
                    style={[
                      styles.cardTitle,
                      {
                        marginLeft: isRTL ? 0 : 10,
                        marginRight: isRTL ? 10 : 0,
                        textAlign: isRTL ? "right" : "left",
                      },
                    ]}
                  >
                    {n.title}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.cardMsg,
                    { textAlign: isRTL ? "right" : "left" },
                  ]}
                >
                  {n.message}
                </Text>
                <View
                  style={[
                    styles.cardFooter,
                    { flexDirection: isRTL ? "row-reverse" : "row" },
                  ]}
                >
                  <Text
                    style={[
                      styles.date,
                      { textAlign: isRTL ? "right" : "left" },
                    ]}
                  >
                    <Clock size={12} color="#6b4f42" />{" "}
                    {formatDate(n.timestamp)}
                  </Text>
                  {!n.read && (
                    <TouchableOpacity
                      onPress={() => markAsRead(n.id)}
                      style={styles.markReadButton}
                    >
                      <Text
                        style={[
                          styles.markRead,
                          { textAlign: isRTL ? "right" : "left" },
                        ]}
                      >
                        {t("notifications.markAsRead")}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </Animated.View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Bell size={48} color="#8d6e63" />
              <Text
                style={[
                  styles.emptyStateText,
                  { textAlign: isRTL ? "right" : "left" },
                ]}
              >
                {t("notifications.noNotifications")}
              </Text>
            </View>
          )}
        </View>

        {filtered.length > 0 && (
          <View
            style={[
              styles.actionButtons,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
            <TouchableOpacity
              style={[styles.button, styles.markAllButton]}
              onPress={markAllAsRead}
            >
              <Check size={18} color="#fff" />
              <Text
                style={[
                  styles.btnText,
                  { textAlign: isRTL ? "right" : "left" },
                ]}
              >
                {t("notifications.markAllAsRead")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.clearAllButton]}
              onPress={clearAll}
            >
              <Trash2 size={18} color="#fff" />
              <Text
                style={[
                  styles.btnText,
                  { textAlign: isRTL ? "right" : "left" },
                ]}
              >
                {t("notifications.clearAll")}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 14,
    color: "#f0ebe7",
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  tab: {
    backgroundColor: "#fffaf5",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: "#e5d4c0",
  },
  activeTab: {
    backgroundColor: "#8d6e63",
    borderColor: "#8d6e63",
  },
  tabText: {
    fontSize: 14,
    color: "#6b4f42",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#fff",
  },
  notificationsContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#f7f3ef",
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#4e342e",
  },
  cardMsg: {
    fontSize: 14,
    color: "#6b4f42",
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5d4c0",
  },
  date: {
    fontSize: 12,
    color: "#6b4f42",
  },
  markReadButton: {
    backgroundColor: "#f7f3ef",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  markRead: {
    fontSize: 12,
    color: "#8d6e63",
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    marginTop: 60,
    padding: 24,
    backgroundColor: "#fffaf5",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5d4c0",
  },
  emptyStateText: {
    color: "#6b4f42",
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    paddingHorizontal: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    justifyContent: "center",
    flex: 1,
    elevation: 2,
  },
  markAllButton: {
    backgroundColor: "#8d6e63",
  },
  clearAllButton: {
    backgroundColor: "#d32f2f",
  },
  btnText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "700",
  },
});

export default NotificationsScreen;
