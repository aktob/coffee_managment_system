import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';

const faqs = [
  {
    question: 'إزاي أضيف موظف جديد؟',
    answer: 'من خلال لوحة التحكم، ادخل على قسم الموظفين واضغط على "إضافة".',
  },
  {
    question: 'هل أقدر أعدل المهام بعد تعيينها؟',
    answer: 'أيوه، تقدر من خلال صفحة المهام تضغط على المهمة وتعدلها.',
  },
  {
    question: 'فين أقدر أشوف تقارير الأداء؟',
    answer: 'من قسم التقارير، تقدر تتابع الأداء اليومي والأسبوعي.',
  },
];

const AdminHelpScreen = ({ navigation }) => {
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
            <Text style={styles.backText}>← Back</Text>
          </Animated.View>
        </TouchableWithoutFeedback>
        <Text style={styles.headerTitle}>Admin Help</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Content */}
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={faqs}
        keyExtractor={(item) => item.question}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.question}>{item.question}</Text>
            <Text style={styles.answer}>{item.answer}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </SafeAreaView>
  );
};

export default AdminHelpScreen;

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
    paddingTop: 16,
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
  listContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  answer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
