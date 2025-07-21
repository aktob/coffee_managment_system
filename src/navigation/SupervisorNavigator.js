import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  Home,
  BarChart2,
  Boxes,
  CalendarCheck,
  Bell,
  User,
} from "lucide-react-native";

// Import Supervisor Screens
import DashboardScreen from "../screens/supervisor/DashboardScreen";
import SalesReportScreen from "../screens/supervisor/SalesReportScreen";
import InventoryScreen from "../screens/supervisor/InventoryScreen";
import StaffScheduleScreen from "../screens/supervisor/StaffScheduleScreen";
import NotificationsScreen from "../screens/supervisor/NotificationsScreen";
import ProfileScreen from "../screens/supervisor/ProfileScreen";

const Tab = createBottomTabNavigator();

const SupervisorNavigator = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useSelector((state) => state.language);
  const isRTL = currentLanguage === "ar";

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#4e342e",
        tabBarInactiveTintColor: "#6b4f42",
        tabBarStyle: {
          backgroundColor: "#fffaf5",
          borderTopColor: "#e5d4c0",
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600", marginBottom: 2 },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: t("supervisor.dashboard"),
          tabBarLabel: t("supervisor.dashboard"),
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="SalesReport"
        component={SalesReportScreen}
        options={{
          title: t("supervisor.salesReport"),
          tabBarLabel: t("supervisor.salesReport"),
          tabBarIcon: ({ color, size }) => (
            <BarChart2 color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{
          title: t("supervisor.inventory"),
          tabBarLabel: t("supervisor.inventory"),
          tabBarIcon: ({ color, size }) => <Boxes color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="StaffSchedule"
        component={StaffScheduleScreen}
        options={{
          title: t("supervisor.staffSchedule"),
          tabBarLabel: t("supervisor.staffSchedule"),
          tabBarIcon: ({ color, size }) => (
            <CalendarCheck color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: t("supervisor.notifications"),
          tabBarLabel: t("supervisor.notifications"),
          tabBarIcon: ({ color, size }) => <Bell color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: t("common.profile"),
          tabBarLabel: t("common.profile"),
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default SupervisorNavigator;
