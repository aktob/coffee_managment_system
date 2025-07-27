import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';

const workingHours = [
  { day: 'Monday', hours: '9:00 AM - 5:00 PM' },
  { day: 'Tuesday', hours: '9:00 AM - 5:00 PM' },
  { day: 'Wednesday', hours: '9:00 AM - 5:00 PM' },
  { day: 'Thursday', hours: '9:00 AM - 5:00 PM' },
  { day: 'Friday', hours: '9:00 AM - 3:00 PM' },
  { day: 'Saturday', hours: 'Closed' },
  { day: 'Sunday', hours: 'Closed' },
];


const WorkingHoursScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>

       <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
  <View style={styles.backContent}>
    <Text style={styles.backText}>Back</Text>
  </View>
</TouchableOpacity>


        <Text style={styles.headerTitle}>Working Hours</Text>
         {/* spacer */}
        <View style={{ width: 60 }} />
      </View>

      {/* Content */}
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={workingHours}
        keyExtractor={(item) => item.day}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.day}>{item.day}</Text>
            <Text style={[styles.hours, item.hours === 'Closed' && styles.closed]}>
              {item.hours}
            </Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </SafeAreaView>
  );
};

export default WorkingHoursScreen;

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
  backText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  day: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  hours: {
    fontSize: 15,
    fontWeight: '500',
    color: '#555',
  },
  closed: {
    color: '#C62828',
    fontWeight: 'bold',
  },
  backButton: {
  paddingVertical: 6,
  paddingHorizontal: 10,
  borderRadius: 8,
  backgroundColor: '#ffffff20',
},

backContent: {
  flexDirection: 'row',
  alignItems: 'center',
},

backArrow: {
  fontSize: 20,
  color: '#fff',
  marginRight: 4,
},

backText: {
  fontSize: 16,
  color: '#fff',
  fontWeight: '600',
},

});
