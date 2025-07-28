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
import WorkingHoursScreen from "./workerNavigations/WorkingHoursScreen";
import HelpScreen from './workerNavigations/HelpScreen';
import AboutScreen from './workerNavigations/AboutScreen';
import PrivacyScreen from './workerNavigations/PrivacyScreen';

import AdminHelpScreen from './adminNavigations/AdminHelpScreen';
import AdminAboutScreen from './adminNavigations/AdminAboutScreen';
import AdminPrivacyScreen from './adminNavigations/AdminPrivacyScreen';



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
          <>
            <Stack.Screen name="RoleNavigator" component={RoleNavigator} />
            <Stack.Screen name="Main" component={RoleNavigator} />
            <Stack.Screen name="WorkingHours" component={WorkingHoursScreen} />
            <Stack.Screen name="Help" component={HelpScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
            <Stack.Screen name="Privacy" component={PrivacyScreen} />

            <Stack.Screen name="AdminHelp" component={AdminHelpScreen} />
            <Stack.Screen name="AdminAbout" component={AdminAboutScreen} />
            <Stack.Screen name="AdminPrivacy" component={AdminPrivacyScreen} />

          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
