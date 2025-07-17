import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";

// Auth Screens
import LoginScreen from "../screens/auth/LoginScreen";
import SplashScreen from "../screens/auth/SplashScreen";

// Role-based Navigators
import SupervisorNavigator from "./SupervisorNavigator";
import AdminNavigator from "./AdminNavigator";
import WorkerNavigator from "./WorkerNavigator";

const Stack = createNativeStackNavigator();

// Component for role-based navigation
const RoleNavigator = () => {
  const { userRole } = useSelector((state) => state.auth);

  switch (userRole) {
    case "supervisor":
      return <SupervisorNavigator />;
    case "admin":
      return <AdminNavigator />;
    case "worker":
      return <WorkerNavigator />;
    default:
      return null;
  }
};

const AppNavigator = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        ) : (
          <Stack.Screen name="Main" component={RoleNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
