import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";
import {
  ClipboardList,
  CheckCircle,
  Plus,
  BarChart,
  User,
} from "lucide-react-native";

// Worker Screens
import OrdersScreen from "../screens/worker/OrdersScreen";
import TasksScreen from "../screens/worker/TasksScreen";
import NewOrderScreen from "../screens/worker/NewOrderScreen";
import OrderStatusScreen from "../screens/worker/OrderStatusScreen";

// OPTIONAL: If you don't have a dedicated profile screen yet,
// you can replace this with a simple placeholder or remove the tab.
import ProfileScreen from "../screens/worker/ProfileScreen";

const Tab = createBottomTabNavigator();

const WorkerBottomTabNavigator = () => {
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
        name="Orders"
        component={OrdersScreen}
        options={{
          title: t("worker.orders"),
          tabBarLabel: t("worker.orders"),
          tabBarIcon: ({ color, size }) => (
            <ClipboardList color={color} size={size} />
          ),
        }}
      />

      {/* <Tab.Screen
        name="Tasks"
        component={TasksScreen}
        options={{
          title: t("worker.tasks"),
          tabBarLabel: t("worker.tasks"),
          tabBarIcon: ({ color, size }) => (
            <CheckCircle color={color} size={size} />
          ),
        }}
      /> */}

      <Tab.Screen
        name="NewOrder"
        component={NewOrderScreen}
        options={{
          title: t("worker.newOrder"),
          tabBarLabel: t("worker.newOrder"),
          tabBarIcon: ({ color, size }) => <Plus color={color} size={size} />,
        }}
      />

      {/* <Tab.Screen
        name="OrderStatus"
        component={OrderStatusScreen}
        options={{
          title: t("worker.orderStatus"),
          tabBarLabel: t("worker.orderStatus"),
          tabBarIcon: ({ color, size }) => (
            <BarChart color={color} size={size} />
          ),
        }}
      /> */}

      {/* Profile tab (optional) */}
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

export default WorkerBottomTabNavigator;
