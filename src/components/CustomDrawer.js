import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  Coffee,
  Users,
  Tag,
  BarChart3,
  Home,
  FileText,
  Package,
  Calendar,
  Bell,
} from "lucide-react-native";
import { toggleTheme } from "../store/slices/themeSlice";
import { setLanguage } from "../store/slices/languageSlice";
import { logout } from "../store/slices/authSlice";

const CustomDrawer = (props) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const userRole = useSelector((state) => state.auth.userRole);

  const getIcon = (routeName) => {
    const iconProps = {
      size: 24,
      color: "#8B4513",
      strokeWidth: 1.5,
    };

    switch (routeName) {
      case "Products":
        return <Coffee {...iconProps} />;
      case "Users":
        return <Users {...iconProps} />;
      case "Promotions":
        return <Tag {...iconProps} />;
      case "Analytics":
        return <BarChart3 {...iconProps} />;
      case "Dashboard":
        return <Home {...iconProps} />;
      case "SalesReport":
        return <FileText {...iconProps} />;
      case "Inventory":
        return <Package {...iconProps} />;
      case "StaffSchedule":
        return <Calendar {...iconProps} />;
      case "Notifications":
        return <Bell {...iconProps} />;
      default:
        return null;
    }
  };

  const handleLanguageToggle = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    dispatch(setLanguage(newLang));
    i18n.changeLanguage(newLang);
  };

  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>{t("common.appName")}</Text>
      </View>

      {props.state.routes.map((route, index) => {
        const focused = index === props.state.index;
        return (
          <TouchableOpacity
            key={route.key}
            style={[styles.menuItem, focused && styles.menuItemFocused]}
            onPress={() => props.navigation.navigate(route.name)}
          >
            {getIcon(route.name)}
            <Text style={[styles.menuText, focused && styles.menuTextFocused]}>
              {t(`${userRole}.${route.name.toLowerCase()}`)}
            </Text>
          </TouchableOpacity>
        );
      })}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => dispatch(toggleTheme())}
        >
          <Text style={styles.footerText}>
            {isDarkMode ? t("common.lightMode") : t("common.darkMode")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={handleLanguageToggle}
        >
          <Text style={styles.footerText}>
            {i18n.language === "en" ? "العربية" : "English"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => dispatch(logout())}
        >
          <Text style={styles.logoutText}>{t("common.logout")}</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    padding: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8B4513",
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemFocused: {
    backgroundColor: "#8B4513",
  },
  menuText: {
    marginLeft: 12,
    color: "#374151",
    fontSize: 16,
  },
  menuTextFocused: {
    color: "#ffffff",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    marginTop: 16,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  footerText: {
    color: "#374151",
    fontSize: 16,
  },
  logoutText: {
    color: "#ef4444",
    fontSize: 16,
  },
});

export default CustomDrawer;
