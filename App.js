import React from "react";
import { Provider } from "react-redux";
import { I18nextProvider } from "react-i18next";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "@rneui/themed";
import store from "./src/store/store";
import i18n from "./src/i18n";
import AppNavigator from "./src/navigation/AppNavigator";
import "./src/i18n";

export default function App() {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <SafeAreaProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <AppNavigator />
            </GestureHandlerRootView>
          </SafeAreaProvider>
        </ThemeProvider>
      </I18nextProvider>
    </Provider>
  );
}
