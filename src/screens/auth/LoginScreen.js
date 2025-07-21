import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Coffee, Mail, Lock, Eye, EyeOff, Globe } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../store/slices/authSlice";

const { width, height } = Dimensions.get("window");

const loginUser = async (email, password) => {
  try {
    // إيميل وباسورد ثابتين للعامل
    const WORKER_EMAIL = "worker@blal.com";
    const WORKER_PASSWORD = "worker123";
    const ADMIN_EMAIL = "tgrybe560@blal.com"; 
    const ADMIN_PASSWORD = "tgrybe560"; 

    // لو الإيميل والباسورد هما الثابتين للعامل
    if (email === WORKER_EMAIL && password === WORKER_PASSWORD) {
      const response = await axios.post(
        "http://api-coffee.m-zedan.com/api/admin/auth/login",
        { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("API Response (Worker Login):", response.data);
      console.log("Access Token:", response.data.access_token);
      const { access_token, user } = response.data;
      // رجّع الـ role كـ vendor مع بيانات المستخدم الثابتة
      return {
        user: { email: WORKER_EMAIL, name: "Worker" },
        role: "worker",
        token: access_token,
      };
    }

    // تسجيل الدخول العادي عبر الـ API
    const response = await axios.post(
      "http://api-coffee.m-zedan.com/api/admin/auth/login",
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("API Response:", response.data);
    const { access_token, user } = response.data;
    const role = user.roles[0]?.name === "المدير" ? "admin" : "vendor";
    return { user: { email: user.email, name: user.name }, role, token: access_token };
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "فشل تسجيل الدخول. تحقق من الإيميل أو كلمة السر."
    );
  }
};


const LoginScreen = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const isRTL = i18n.language === "ar";

  useEffect(() => {
    console.log("Rendering LoginScreen...");
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t("auth.invalidEmail"));
    } else if (password && password.length < 6) {
      setError(t("auth.shortPassword"));
    } else {
      setError("");
    }
  }, [email, password, t]);

  const shakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError("");
      dispatch(loginStart());

      if (!email || !password) {
        throw new Error(t("auth.fillAllFields"));
      }

      const response = await loginUser(email, password);
      await AsyncStorage.setItem("authToken", response.token);
      dispatch(loginSuccess(response));
    } catch (err) {
      dispatch(loginFailure(err.message));
      setError(err.message);
      shakeAnimation();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <LinearGradient
        colors={["#F4A460", "#D2691E", "#8B4513"]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.backgroundDecoration}>
          <View style={[styles.circle, styles.circle1]} />
          <View style={[styles.circle, styles.circle2]} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.headerContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.iconContainer}>
              <View style={styles.iconBackground}>
                <Coffee size={60} color="#8B4513" strokeWidth={2} />
              </View>
            </View>
            <Text style={styles.title}>{t("auth.loginTitle")}</Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.formCard,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { translateX: shakeAnim },
                ],
              },
            ]}
          >
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t("common.email")}</Text>
                <View style={styles.inputContainer}>
                  <Mail size={20} color="#8B4513" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, isRTL && styles.inputRTL]}
                    value={email}
                    onChangeText={setEmail}
                    placeholder={t("common.email")}
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    textAlign={isRTL ? "right" : "left"}
                    accessibilityLabel={t("common.email")}
                    accessibilityHint={t("auth.emailHint")}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t("common.password")}</Text>
                <View style={styles.inputContainer}>
                  <Lock size={20} color="#8B4513" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, isRTL && styles.inputRTL]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder={t("common.password")}
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                    textAlign={isRTL ? "right" : "left"}
                    accessibilityLabel={t("common.password")}
                    accessibilityHint={t("auth.passwordHint")}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#8B4513" />
                    ) : (
                      <Eye size={20} color="#8B4513" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {error ? (
                <Animated.View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </Animated.View>
              ) : null}

              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={["#8B4513", "#A0522D"]}
                  style={styles.loginButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.loginButtonText}>{t("common.login")}</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>

        <Animated.View
          style={[styles.languageContainer, { opacity: fadeAnim }]}
        >
          <TouchableOpacity
            style={styles.languageButton}
            onPress={() =>
              i18n.changeLanguage(i18n.language === "en" ? "ar" : "en")
            }
          >
            <Globe size={20} color="#8B4513" />
            <Text style={styles.languageButtonText}>
              {i18n.language === "en" ? "عربي" : "English"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  backgroundDecoration: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  circle: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  circle1: {
    width: 300,
    height: 300,
    top: -150,
    right: -100,
  },
  circle2: {
    width: 200,
    height: 200,
    bottom: -100,
    left: -50,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: 1,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  formContainer: {
    gap: 20,
  },
  inputGroup: {
    marginBottom: 4,
  },
  label: {
    color: "#374151",
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
    paddingVertical: 0,
  },
  inputRTL: {
    textAlign: "right",
  },
  eyeIcon: {
    padding: 4,
  },
  errorContainer: {
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#EF4444",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
  },
  languageContainer: {
    position: "absolute",
    top: 50,
    right:50,
    alignSelf: "center",
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffffe6",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  languageButtonText: {
    color: "#8B4513",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
});

export default LoginScreen;


