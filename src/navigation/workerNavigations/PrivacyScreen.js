import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';

const PrivacyScreen = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.paragraph}>
          نحن نُقدّر خصوصيتك. يتم استخدام بياناتك فقط في حدود التشغيل الداخلي للنظام ولا يتم مشاركتها مع أي طرف ثالث تحت أي ظرف.
        </Text>
        <Text style={styles.paragraph}>
          كل البيانات محمية ويتم حفظها على خوادم مؤمنة. دخولك للنظام يعني موافقتك على سياسة الخصوصية الخاصة بالتطبيق.
        </Text>
        <Text style={styles.paragraph}>
          يمكنك التواصل معنا في حالة وجود أي استفسار أو طلب تعديل أو حذف لأي من بياناتك.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyScreen;

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
  paragraph: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    marginBottom: 20,
  },
});
