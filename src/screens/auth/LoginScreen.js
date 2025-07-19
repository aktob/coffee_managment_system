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
} from "react-native";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Coffee, Mail, Lock, Eye, EyeOff, Globe } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../store/slices/authSlice";

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const isRTL = i18n.language === "ar";

  useEffect(() => {
    // Start entrance animations
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

      // TODO: Replace with actual API call
      if (email && password) {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const mockRoles = {
          "admin@coffee.com": "admin",
          "supervisor@coffee.com": "supervisor",
          "worker@coffee.com": "worker",
        };

        const role = mockRoles[email.toLowerCase()];

        if (role && password === "password123") {
          dispatch(
            loginSuccess({
              user: { email, name: email.split("@")[0] },
              role,
              token: "mock-token",
            })
          );
        } else {
          throw new Error("Invalid credentials");
        }
      } else {
        throw new Error("Please fill in all fields");
      }
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
    >
      <LinearGradient
        colors={["#F4A460", "#D2691E", "#8B4513"]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Background decoration */}
        <View style={styles.backgroundDecoration}>
          <View style={[styles.circle, styles.circle1]} />
          <View style={[styles.circle, styles.circle2]} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
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

          {/* Login Form Card */}
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
              {/* Email Input */}
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
                  />
                </View>
              </View>

              {/* Password Input */}
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

              {/* Error Message */}
              {error ? (
                <Animated.View style={styles.errorContainer}>
                  <Text style={styles.errorText}>
                    {t("auth.invalidCredentials")}
                  </Text>
                </Animated.View>
              ) : null}

              {/* Demo Credentials */}
              <View style={styles.demoContainer}>
                <Text style={styles.demoTitle}>Demo Credentials:</Text>
                <Text style={styles.demoText}>admin@coffee.com</Text>
                <Text style={styles.demoText}>supervisor@coffee.com</Text>
                <Text style={styles.demoText}>worker@coffee.com</Text>
                <Text style={styles.demoText}>Password: password123</Text>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  isLoading && styles.loginButtonDisabled,
                ]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={["#8B4513", "#A0522D"]}
                  style={styles.loginButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.loginButtonText}>
                    {isLoading ? "Signing in..." : t("common.login")}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Language Toggle */}
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
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    fontWeight: "400",
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
  demoContainer: {
    backgroundColor: "#F0F9FF",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#0EA5E9",
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0369A1",
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    color: "#0369A1",
    marginBottom: 2,
    fontFamily: "monospace",
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
    bottom: 50,
    alignSelf: "center",
  },
  languageButton: {
    bottom: 680,
    left: 120,
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
