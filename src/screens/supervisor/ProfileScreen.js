import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Modal,
  Switch,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { setLanguage } from "../../store/slices/languageSlice";
import { logout } from "../../store/slices/authSlice";
import {
  User,
  Settings,
  LogOut,
  Clock,
  Award,
  Star,
  Calendar,
  Bell,
  Shield,
  HelpCircle,
  Info,
  Edit,
  ChevronRight,
  ChevronLeft,
  Coffee,
  CheckCircle,
  TrendingUp,
  Globe,
  Volume2,
} from "lucide-react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const ProfileScreen = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentLanguage } = useSelector((state) => state.language);
  const isRTL = currentLanguage === "ar";
  const navigation = useNavigation();
  // Local state for settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // Mock data - replace with real data from your backend
  const supervisorStats = {
    totalOrders: 234,
    completedOrders: 218,
    averageRating: 4.9,
    totalHours: 156,
    thisWeekOrders: 45,
    thisMonthOrders: 167,
  };

  const profileSections = [
    {
      title: t("supervisor.personalInfo"),
      icon: "User",
      items: [
        {
          label: t("supervisor.fullName"),
          value: user?.name || "Sara Al-Rashid",
          icon: "User",
        },
        {
          label: t("auth.email"),
          value: user?.email || "sara.alrashid@coffee.com",
          icon: "User",
        },
        {
          label: t("supervisor.phone"),
          value: "+966 50 987 6543",
          icon: "User",
        },
        {
          label: t("supervisor.employeeId"),
          value: "SUP-2024-001",
          icon: "User",
        },
      ],
    },
    {
      title: t("supervisor.workStats"),
      icon: "TrendingUp",
      items: [
        {
          label: t("supervisor.totalOrders"),
          value: supervisorStats.totalOrders.toString(),
          icon: "Coffee",
        },
        {
          label: t("supervisor.completedOrders"),
          value: supervisorStats.completedOrders.toString(),
          icon: "CheckCircle",
        },
        {
          label: t("supervisor.averageRating"),
          value: supervisorStats.averageRating.toString(),
          icon: "Star",
        },
        {
          label: t("supervisor.totalHours"),
          value: `${supervisorStats.totalHours}h`,
          icon: "Clock",
        },
      ],
    },
  ];

  const settingsSections = [
    {
      title: t("supervisor.preferences"),
      icon: "Settings",
      items: [
        {
          label: t("supervisor.notifications"),
          icon: "Bell",
          type: "switch",
          value: notificationsEnabled,
          onValueChange: setNotificationsEnabled,
        },
        {
          label: t("supervisor.language"),
          value: currentLanguage.toUpperCase(),
          icon: "Globe",
          action: "language",
        },
        {
          label: t("supervisor.sound"),
          icon: "Volume2",
          type: "switch",
          value: soundEnabled,
          onValueChange: setSoundEnabled,
        },
        {
          label: t("supervisor.workingHours"),
          icon: "Clock",
          action: "workingHours",
        },
      ],
    },
    {
      title: t("supervisor.support"),
      icon: "HelpCircle",
      items: [
        {
          label: t("supervisor.help"),
          icon: "HelpCircle",
          action: "help",
        },
        {
          label: t("supervisor.about"),
          icon: "Info",
          action: "about",
        },
        {
          label: t("supervisor.privacy"),
          icon: "Shield",
          action: "privacy",
        },
      ],
    },
  ];

  const renderIcon = (iconName, size = 24, color = "#4e342e") => {
    switch (iconName) {
      case "User":
        return <User size={size} color={color} />;
      case "Settings":
        return <Settings size={size} color={color} />;
      case "LogOut":
        return <LogOut size={size} color={color} />;
      case "Clock":
        return <Clock size={size} color={color} />;
      case "Award":
        return <Award size={size} color={color} />;
      case "Star":
        return <Star size={size} color={color} />;
      case "Calendar":
        return <Calendar size={size} color={color} />;
      case "Bell":
        return <Bell size={size} color={color} />;
      case "Shield":
        return <Shield size={size} color={color} />;
      case "HelpCircle":
        return <HelpCircle size={size} color={color} />;
      case "Info":
        return <Info size={size} color={color} />;
      case "Edit":
        return <Edit size={size} color={color} />;
      case "ChevronRight":
        return <ChevronRight size={size} color={color} />;
      case "ChevronLeft":
        return <ChevronLeft size={size} color={color} />;
      case "Coffee":
        return <Coffee size={size} color={color} />;
      case "CheckCircle":
        return <CheckCircle size={size} color={color} />;
      case "TrendingUp":
        return <TrendingUp size={size} color={color} />;
      case "Globe":
        return <Globe size={size} color={color} />;
      case "Volume2":
        return <Volume2 size={size} color={color} />;
      default:
        return null;
    }
  };

  const handleLanguageChange = (language) => {
    dispatch(setLanguage(language));
    i18n.changeLanguage(language);
    setShowLanguageModal(false);
  };

  const handleLogout = () => {
    Alert.alert(t("supervisor.logout"), t("supervisor.logoutConfirm"), [
      {
        text: t("common.cancel"),
        style: "cancel",
      },
      {
        text: t("supervisor.logout"),
        style: "destructive",
        onPress: () => {
          // Handle logout logic here
          console.log("Logout pressed");
          // Dispatch logout action to clear authentication state
          dispatch(logout());
        },
      },
    ]);
  };

  const handleAction = (action) => {
    switch (action) {
      case "language":
        setShowLanguageModal(true);
        break;
      case "workingHours":
        Alert.alert(
          t("supervisor.workingHours"),
          t("supervisor.workingHoursSettings")
        );
        break;
      case "help":
        Alert.alert(t("supervisor.help"), t("supervisor.helpMessage"));
        break;
      case "about":
        Alert.alert(t("supervisor.about"), t("supervisor.aboutMessage"));
        break;
      case "privacy":
        Alert.alert(t("supervisor.privacy"), t("supervisor.privacyMessage"));
        break;
      default:
        break;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f7f3ef",
    },
    header: {
      paddingTop: 48,
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
    profileCard: {
      backgroundColor: "#fffaf5",
      borderRadius: 24,
      padding: 24,
      marginVertical: 16,
      elevation: 6,
      borderWidth: 1,
      borderColor: "#e5d4c0",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    profileHeader: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      marginBottom: 24,
    },
    profileAvatar: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: "#e5d4c0",
      alignItems: "center",
      justifyContent: "center",
      marginRight: isRTL ? 0 : 20,
      marginLeft: isRTL ? 20 : 0,
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      fontSize: 26,
      fontWeight: "bold",
      color: "#4e342e",
      marginBottom: 6,
      textAlign: isRTL ? "right" : "left",
    },
    profileRole: {
      fontSize: 18,
      color: "#6b4f42",
      textAlign: isRTL ? "right" : "left",
    },
    editButton: {
      backgroundColor: "#d7bfa9",
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 16,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      elevation: 3,
    },
    editButtonText: {
      color: "#4e342e",
      fontWeight: "600",
      marginRight: isRTL ? 0 : 6,
      marginLeft: isRTL ? 6 : 0,
      fontSize: 14,
    },
    statsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
      paddingTop: 20,
      borderTopWidth: 1,
      borderTopColor: "#e5d4c0",
    },
    statItem: {
      alignItems: "center",
      flex: 1,
      paddingHorizontal: 8,
    },
    statValue: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#6d4c41",
      marginBottom: 6,
    },
    statLabel: {
      fontSize: 13,
      color: "#6b4f42",
      textAlign: "center",
      fontWeight: "500",
    },
    section: {
      marginVertical: 16,
    },
    sectionHeader: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: "#4e342e",
      marginLeft: isRTL ? 0 : 10,
      marginRight: isRTL ? 10 : 0,
    },
    sectionCard: {
      backgroundColor: "#fffaf5",
      borderRadius: 20,
      elevation: 4,
      borderWidth: 1,
      borderColor: "#e5d4c0",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
    },
    sectionItem: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      padding: 18,
      borderBottomWidth: 1,
      borderBottomColor: "#e5d4c0",
    },
    sectionItemLast: {
      borderBottomWidth: 0,
    },
    itemIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: "#e5d4c0",
      alignItems: "center",
      justifyContent: "center",
      marginRight: isRTL ? 0 : 14,
      marginLeft: isRTL ? 14 : 0,
    },
    itemContent: {
      flex: 1,
    },
    itemLabel: {
      fontSize: 17,
      fontWeight: "600",
      color: "#4e342e",
      textAlign: isRTL ? "right" : "left",
    },
    itemValue: {
      fontSize: 15,
      color: "#6b4f42",
      marginTop: 3,
      textAlign: isRTL ? "right" : "left",
    },
    itemAction: {
      padding: 8,
    },
    logoutButton: {
      backgroundColor: "#8d6e63",
      padding: 18,
      borderRadius: 20,
      marginVertical: 24,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "center",
      elevation: 6,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
    },
    logoutButtonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
      marginRight: isRTL ? 0 : 10,
      marginLeft: isRTL ? 10 : 0,
    },
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: "#fffaf5",
      borderRadius: 24,
      padding: 24,
      width: width * 0.85,
      elevation: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#4e342e",
      marginBottom: 20,
      textAlign: "center",
    },
    languageOption: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      backgroundColor: "#f7f3ef",
      borderWidth: 2,
      borderColor: "transparent",
    },
    languageOptionSelected: {
      borderColor: "#8d6e63",
      backgroundColor: "#e5d4c0",
    },
    languageText: {
      fontSize: 18,
      fontWeight: "600",
      color: "#4e342e",
      marginLeft: isRTL ? 0 : 12,
      marginRight: isRTL ? 12 : 0,
    },
    languageTextSelected: {
      color: "#6d4c41",
    },
    closeButton: {
      backgroundColor: "#8d6e63",
      padding: 16,
      borderRadius: 16,
      marginTop: 16,
      alignItems: "center",
    },
    closeButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("supervisor.profile")}</Text>
        <Text style={styles.headerSubtitle}>
          {t("supervisor.profileSubtitle")}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.profileAvatar}>
              {renderIcon("User", 44, "#4e342e")}
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {user?.name || "Sara Al-Rashid"}
              </Text>
              <Text style={styles.profileRole}>
                {t("supervisor.coffeeSupervisor")}
              </Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              {renderIcon("Edit", 18, "#4e342e")}
              <Text style={styles.editButtonText}>{t("supervisor.edit")}</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {supervisorStats.thisWeekOrders}
              </Text>
              <Text style={styles.statLabel}>{t("supervisor.thisWeek")}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {supervisorStats.thisMonthOrders}
              </Text>
              <Text style={styles.statLabel}>{t("supervisor.thisMonth")}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {supervisorStats.averageRating}
              </Text>
              <Text style={styles.statLabel}>{t("supervisor.rating")}</Text>
            </View>
          </View>
        </View>

        {/* Profile Sections */}
        {profileSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <View style={styles.sectionHeader}>
              {renderIcon(section.icon, 22, "#4e342e")}
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <View style={styles.sectionCard}>
              {section.items.map((item, itemIndex) => (
                <View
                  key={itemIndex}
                  style={[
                    styles.sectionItem,
                    itemIndex === section.items.length - 1 &&
                      styles.sectionItemLast,
                  ]}
                >
                  <View style={styles.itemIcon}>
                    {renderIcon(item.icon, 22, "#4e342e")}
                  </View>
                  <View style={styles.itemContent}>
                    <Text style={styles.itemLabel}>{item.label}</Text>
                    {item.value && (
                      <Text style={styles.itemValue}>{item.value}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <View style={styles.sectionHeader}>
              {renderIcon(section.icon, 22, "#4e342e")}
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <View style={styles.sectionCard}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.sectionItem,
                    itemIndex === section.items.length - 1 &&
                      styles.sectionItemLast,
                  ]}
                  onPress={() => handleAction(item.action)}
                  disabled={item.type === "switch"}
                >
                  <View style={styles.itemIcon}>
                    {renderIcon(item.icon, 22, "#4e342e")}
                  </View>
                  <View style={styles.itemContent}>
                    <Text style={styles.itemLabel}>{item.label}</Text>
                    {item.value && !item.type && (
                      <Text style={styles.itemValue}>{item.value}</Text>
                    )}
                  </View>
                  {item.type === "switch" ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.onValueChange}
                      trackColor={{ false: "#e5d4c0", true: "#8d6e63" }}
                      thumbColor={item.value ? "#fff" : "#f4f3f4"}
                    />
                  ) : (
                    <View style={styles.itemAction}>
                      {renderIcon(
                        isRTL ? "ChevronLeft" : "ChevronRight",
                        18,
                        "#6b4f42"
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          {renderIcon("LogOut", 22, "#fff")}
          <Text style={styles.logoutButtonText}>{t("supervisor.logout")}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {t("supervisor.selectLanguage")}
            </Text>

            <TouchableOpacity
              style={[
                styles.languageOption,
                currentLanguage === "en" && styles.languageOptionSelected,
              ]}
              onPress={() => handleLanguageChange("en")}
            >
              {renderIcon("Globe", 24, "#4e342e")}
              <Text
                style={[
                  styles.languageText,
                  currentLanguage === "en" && styles.languageTextSelected,
                ]}
              >
                English
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageOption,
                currentLanguage === "ar" && styles.languageOptionSelected,
              ]}
              onPress={() => handleLanguageChange("ar")}
            >
              {renderIcon("Globe", 24, "#4e342e")}
              <Text
                style={[
                  styles.languageText,
                  currentLanguage === "ar" && styles.languageTextSelected,
                ]}
              >
                العربية
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowLanguageModal(false)}
            >
              <Text style={styles.closeButtonText}>{t("common.close")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileScreen;
