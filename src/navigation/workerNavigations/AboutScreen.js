import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';

const AboutScreen = ({ navigation }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start(() => navigation.goBack());
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableWithoutFeedback
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Animated.View style={[styles.backButton, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.backText}>Back</Text>
          </Animated.View>
        </TouchableWithoutFeedback>
        <Text style={styles.headerTitle}>About</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Coffee System</Text>
        <Text style={styles.description}>
          التطبيق ده معمول لتسهيل شغل الـ Workers في إدارة الطلبات، المهام، والتواصل داخل النظام.
        </Text>
        <Text style={styles.label}>الإصدار: <Text style={styles.value}>1.0.0</Text></Text>
        <Text style={styles.label}>تم التطوير بواسطة: <Text style={styles.value}>فريق ITI 2025</Text></Text>
      </View>
    </SafeAreaView>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F2EF',
  },
  header: {
    backgroundColor: '#6D4C41',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#ffffff30',
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#4E342E',
  },
  description: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  value: {
    fontWeight: 'normal',
    color: '#444',
  },
});
