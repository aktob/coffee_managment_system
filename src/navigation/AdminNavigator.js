import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";
import { Package, Gift, Users, BarChart3, User } from "lucide-react-native";

// Import Admin Screens
import ProductsScreen from "../screens/admin/ProductsScreen";
import PromotionsScreen from "../screens/admin/PromotionsScreen";
import UsersScreen from "../screens/admin/UsersScreen";
import AnalyticsScreen from "../screens/admin/AnalyticsScreen";
import ProfileScreen from "../screens/admin/ProfileScreen";

const Tab = createBottomTabNavigator();

const AdminNavigator = () => {
  const { t } = useTranslation();

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
        name="Products"
        component={ProductsScreen}
        options={{
          title: t("admin.products"),
          tabBarLabel: t("admin.products"),
          tabBarIcon: ({ color, size }) => (
            <Package color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Promotions"
        component={PromotionsScreen}
        options={{
          title: t("admin.promotions"),
          tabBarLabel: t("admin.promotions"),
          tabBarIcon: ({ color, size }) => <Gift color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Users"
        component={UsersScreen}
        options={{
          title: t("admin.users"),
          tabBarLabel: t("admin.users"),
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          title: t("admin.analytics"),
          tabBarLabel: t("admin.analytics"),
          tabBarIcon: ({ color, size }) => (
            <BarChart3 color={color} size={size} />
          ),
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

export default AdminNavigator;
