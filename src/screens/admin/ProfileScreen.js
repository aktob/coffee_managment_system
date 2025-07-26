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
  TextInput,
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
  Users,
  BarChart3,
  Package,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

const AdminProfileScreen = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentLanguage } = useSelector((state) => state.language);
  const isRTL = currentLanguage === "ar";
  // Local state for settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

// New i added
const [showEditModal, setShowEditModal] = useState(false);
const [editedName, setEditedName] = useState(user?.name || "");
const [editedEmail, setEditedEmail] = useState(user?.email || "");
const [editedPhone, setEditedPhone] = useState("+966 50 123 4567"); // أو user.phone لو موجود
const [localUser, setLocalUser] = useState(user); // نسخة محلية من المستخدم
// New i added



const [showHelpModal, setShowHelpModal] = useState(false);
const [showAboutModal, setShowAboutModal] = useState(false);
const [showPrivacyModal, setShowPrivacyModal] = useState(false);
const [showSystemSettingsModal, setShowSystemSettingsModal] = useState(false);

  const [errors, setErrors] = useState({});



const validateForm = () => {
  let valid = true;
  let newErrors = {};

  // name is required
  const nameRegex = /^[a-zA-Z\u0600-\u06FF\s]{3,40}$/;
  if (!editedName.trim()) {
    newErrors.name = "name is required";
    valid = false;
  }else if (!nameRegex.test(editedName)) {
  newErrors.name = "name is invalid";
  valid = false;
}

  // email is invalid
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!editedEmail.trim()) {
    newErrors.email = "email is required";
    valid = false;
  } else if (!emailRegex.test(editedEmail)) {
    newErrors.email = "email is invalid";
    valid = false;
  }

  // phone is required and valid
  const phoneRegex = /^[0-9]{11}$/;
  if (!editedPhone.trim()) {
    newErrors.phone = "phone is required";
    valid = false;
  } else if (!phoneRegex.test(editedPhone)) {
    newErrors.phone = "phone is invalid";
    valid = false;
  }

  setErrors(newErrors);
  return valid;
};



  // Mock data - replace with real data from your backend
  const adminStats = {
    totalUsers: 45,
    totalProducts: 28,
    totalOrders: 1234,
    totalRevenue: 45678,
    thisWeekOrders: 89,
    thisMonthOrders: 345,
  };

  const profileSections = () => [
    {
      title: t("admin.personalInfo"),
      icon: "User",
      items: [
        {
          label: t("admin.fullName"),
          value: localUser?.name || "Admin Manager",
          icon: "User",
        },
        {
          label: t("auth.email"),
          value: localUser?.email || "admin@coffee.com",
          icon: "User",
        },
        {
          label: t("admin.phone"),
          value: localUser?.phone || "+966 50 123 4567",
          icon: "User",
        },
        {
          label: t("admin.adminId"),
          // value: "ADM-2024-001",
          value: `ADM-${Date.now().toString().slice(-6)}`, // Mock ID, replace with real ID
          icon: "User",
        },
      ],
    },
    {
      title: t("admin.systemStats"),
      icon: "TrendingUp",
      items: [
        {
          label: t("admin.totalUsers"),
          value: adminStats.totalUsers.toString(),
          icon: "Users",
        },
        {
          label: t("admin.totalProducts"),
          value: adminStats.totalProducts.toString(),
          icon: "Package",
        },
        {
          label: t("admin.totalOrders"),
          value: adminStats.totalOrders.toString(),
          icon: "Coffee",
        },
        {
          label: t("admin.totalRevenue"),
          value: `$${adminStats.totalRevenue.toLocaleString()}`,
          icon: "BarChart3",
        },
      ],
    },
  ];

  const settingsSections = [
    {
      title: t("admin.preferences"),
      icon: "Settings",
      items: [
        {
          label: t("admin.notifications"),
          icon: "Bell",
          type: "switch",
          value: notificationsEnabled,
          onValueChange: setNotificationsEnabled,
        },
        {
          label: t("admin.language"),
          value: currentLanguage.toUpperCase(),
          icon: "Globe",
          action: "language",
        },
        {
          label: t("admin.sound"),
          icon: "Volume2",
          type: "switch",
          value: soundEnabled,
          onValueChange: setSoundEnabled,
        },
        {
          label: t("admin.systemSettings"),
          icon: "Settings",
          action: "systemSettings",
        },
      ],
    },
    {
      title: t("admin.support"),
      icon: "HelpCircle",
      items: [
        {
          label: t("admin.help"),
          icon: "HelpCircle",
          action: "help",
        },
        {
          label: t("admin.about"),
          icon: "Info",
          action: "about",
        },
        {
          label: t("admin.privacy"),
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
      case "Users":
        return <Users size={size} color={color} />;
      case "BarChart3":
        return <BarChart3 size={size} color={color} />;
      case "Package":
        return <Package size={size} color={color} />;
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
    Alert.alert(t("admin.logout"), t("admin.logoutConfirm"), [
      {
        text: t("common.cancel"),
        style: "cancel",
      },
      {
        text: t("admin.logout"),
        style: "destructive",
        onPress: () => {
          dispatch(logout());
        },
      },
    ]);
  };


  const handleSaveEdit = () => {
      if (!validateForm()) return;

setLocalUser((prev) => ({
    ...prev,
    name: editedName,
    email: editedEmail,
    phone: editedPhone,
  }));
  setShowEditModal(false);
  // Alert.alert("Success", "Profile updated successfully!");
};



  const handleAction = (action) => {
    switch (action) {
      case "language":
        setShowLanguageModal(true);
        break;
      case "systemSettings":
              setShowSystemSettingsModal(true);
        break;
      case "help":
        setShowHelpModal(true);
        break;
      case "about":
        setShowAboutModal(true);
        break;
      case "privacy":
        setShowPrivacyModal(true);
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
    input: {
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 8,
  padding: 10,
  marginBottom: 10,
  backgroundColor: "#fff",
},
modalButton: {
  padding: 10,
  borderRadius: 8,
  minWidth: 100,
  alignItems: "center",
},
modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  newModalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    width: "80%",
    alignItems: "center",
  },
  newModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#444",
  },
  newModalButton: {
    backgroundColor: "#4e342e",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  errorText: {
  color: "red",
  fontSize: 12,
  marginLeft: 7,
  marginBottom: 8,
},
  });


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("admin.profile")}</Text>
        <Text style={styles.headerSubtitle}>{t("admin.profileSubtitle")}</Text>
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
                {localUser?.name || "Admin Manager"}
              </Text>
              <Text style={styles.profileRole}>
                {t("admin.systemAdministrator")}
              </Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={() => setShowEditModal(true)}>
              {renderIcon("Edit", 18, "#4e342e")}
              <Text style={styles.editButtonText}>{t("admin.edit")}</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{adminStats.thisWeekOrders}</Text>
              <Text style={styles.statLabel}>{t("admin.thisWeek")}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{adminStats.thisMonthOrders}</Text>
              <Text style={styles.statLabel}>{t("admin.thisMonth")}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{adminStats.totalUsers}</Text>
              <Text style={styles.statLabel}>{t("admin.users")}</Text>
            </View>
          </View>
        </View>

        {/* Profile Sections */}
        {profileSections().map((section, sectionIndex) => (
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
                      <Text style={styles.itemValue}>{item.value}</Text>            ////////////////////////////////
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
          <Text style={styles.logoutButtonText}>{t("admin.logout")}</Text>
        </TouchableOpacity>
      </ScrollView>





 {/* New i added */}
<Modal
  visible={showEditModal}
  transparent={true}
  animationType="slide"
  onRequestClose={() => setShowEditModal(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Admin</Text>

      <TextInput
        style={styles.input}
        value={editedName}
        onChangeText={setEditedName}
        placeholder={t("admin.fullName")}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      <TextInput
        style={styles.input}
        value={editedEmail}
        onChangeText={setEditedEmail}
        placeholder={t("auth.email")}
        keyboardType="email-address"
      />
{errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TextInput
        style={styles.input}
        value={editedPhone}
        onChangeText={setEditedPhone}
        placeholder={t("admin.phone")}
        keyboardType="phone-pad"
      />
{errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity
          style={[styles.modalButton, { backgroundColor: "#ccc" }]}
          onPress={() => setShowEditModal(false)}
        >
          <Text>{t("common.cancel")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modalButton, { backgroundColor: "#4e342e" }]}
          onPress={() => {
            // تقدر هنا تبعت التعديلات للباك إند
            handleSaveEdit();
            // setShowEditModal(false);
          }}
        >
          <Text style={{ color: "#fff" }}>{t("common.save")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
 {/* New i added */}





{/* Help Modal */}
<Modal visible={showHelpModal} animationType="slide" transparent>
  <View style={styles.modalContainer}>
    <View style={styles.newModalContent}>
      <Text style={styles.newModalTitle}>{t("admin.help")}</Text>
      <Text style={styles.modalText}>
        {t("admin.helpMessage") || "لو محتاج مساعدة، اتواصل مع الدعم أو شوف دليل الاستخدام"}
      </Text>
      <TouchableOpacity style={styles.newModalButton} onPress={() => setShowHelpModal(false)}>
        <Text style={styles.modalButtonText}>{t("common.close") || "إغلاق"}</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

{/* About Modal */}
<Modal visible={showAboutModal} animationType="slide" transparent>
  <View style={styles.modalContainer}>
    <View style={styles.newModalContent}>
      <Text style={styles.newModalTitle}>{t("admin.about")}</Text>
      <Text style={styles.modalText}>
        {t("admin.aboutMessage") || "تطبيق إدارة القهوة - الإصدار 1.0. جميع الحقوق محفوظة."}
      </Text>
      <TouchableOpacity style={styles.newModalButton} onPress={() => setShowAboutModal(false)}>
        <Text style={styles.modalButtonText}>{t("common.close")}</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

{/* Privacy Modal */}
<Modal visible={showPrivacyModal} animationType="slide" transparent>
  <View style={styles.modalContainer}>
    <View style={styles.newModalContent}>
      <Text style={styles.newModalTitle}>{t("admin.privacy")}</Text>
      <Text style={styles.modalText}>
        {t("admin.privacyMessage") || "نلتزم بالحفاظ على خصوصيتك وعدم مشاركة بياناتك مع أي طرف خارجي."}
      </Text>
      <TouchableOpacity style={styles.newModalButton} onPress={() => setShowPrivacyModal(false)}>
        <Text style={styles.modalButtonText}>{t("common.close")}</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

{/* System Settings Modal */}
<Modal visible={showSystemSettingsModal} animationType="slide" transparent>
  <View style={styles.modalContainer}>
    <View style={styles.newModalContent}>
      <Text style={styles.newModalTitle}>{t("admin.systemSettings")}</Text>
      <Text style={styles.modalText}>
        {t("admin.systemSettingsMessage") || "هنا هتقدر تعدل إعدادات النظام زي التنبيهات، اللغة، والمظهر."}
      </Text>
      <TouchableOpacity style={styles.newModalButton} onPress={() => setShowSystemSettingsModal(false)}>
        <Text style={styles.modalButtonText}>{t("common.close")}</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>





      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t("admin.selectLanguage")}</Text>

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

export default AdminProfileScreen;
