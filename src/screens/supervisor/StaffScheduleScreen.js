import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  Animated,
  I18nManager,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  Calendar,
  Clock,
  User,
  Plus,
  Edit,
  Swap,
  FileText,
  ChevronLeft,
  ChevronRight,
  Users,
  AlertCircle,
} from "lucide-react-native";
import {
  getStaffSchedule,
  getStaffList,
  getTimeOffRequests,
} from "../../data/mockData";

const StaffScheduleScreen = () => {
  const { t } = useTranslation();
  const currentLanguage = useSelector(
    (state) => state.language?.currentLanguage || "en"
  );
  const isRTL = currentLanguage === "ar";

  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  // Mock schedule data
  const weekDays = [
    { key: "monday", label: t("common.monday"), short: t("common.mon") },
    { key: "tuesday", label: t("common.tuesday"), short: t("common.tue") },
    { key: "wednesday", label: t("common.wednesday"), short: t("common.wed") },
    { key: "thursday", label: t("common.thursday"), short: t("common.thu") },
    { key: "friday", label: t("common.friday"), short: t("common.fri") },
    { key: "saturday", label: t("common.saturday"), short: t("common.sat") },
    { key: "sunday", label: t("common.sunday"), short: t("common.sun") },
  ];

  const shifts = [
    {
      key: "morning",
      label: t("supervisor.morningShift"),
      time: "06:00 - 14:00",
      color: "#8d6e63",
    },
    {
      key: "afternoon",
      label: t("supervisor.afternoonShift"),
      time: "14:00 - 22:00",
      color: "#a1887f",
    },
    {
      key: "evening",
      label: t("supervisor.eveningShift"),
      time: "22:00 - 06:00",
      color: "#6d4c41",
    },
  ];

  // Use mock data for all staff schedule content
  const staffList = getStaffList();
  const getScheduleForDay = (day) => getStaffSchedule(day);
  const timeOffRequests = getTimeOffRequests();

  useEffect(() => {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);

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

    // Load schedule data
    loadScheduleData();
  }, [isRTL]);

  const loadScheduleData = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error loading schedule data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadScheduleData().finally(() => setRefreshing(false));
  }, []);

  const handleEditSchedule = (staff, shift) => {
    Alert.alert(
      t("supervisor.editSchedule"),
      `${t("supervisor.editScheduleFor")} ${staff.name}`,
      [
        { text: t("common.cancel"), style: "cancel" },
        { text: t("common.edit"), onPress: () => console.log("Edit schedule") },
      ]
    );
  };

  const handleAddStaff = (shift) => {
    Alert.alert(t("supervisor.addStaff"), t("supervisor.addStaffToShift"), [
      { text: t("common.cancel"), style: "cancel" },
      { text: t("common.add"), onPress: () => console.log("Add staff") },
    ]);
  };

  const handleSwapShifts = () => {
    Alert.alert(
      t("supervisor.swapShifts"),
      t("supervisor.swapShiftsDescription"),
      [
        { text: t("common.cancel"), style: "cancel" },
        { text: t("common.swap"), onPress: () => console.log("Swap shifts") },
      ]
    );
  };

  const handleTimeOffRequests = () => {
    Alert.alert(
      t("supervisor.timeOffRequests"),
      t("supervisor.timeOffRequestsDescription"),
      [
        { text: t("common.cancel"), style: "cancel" },
        { text: t("common.view"), onPress: () => console.log("View requests") },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "#8d6e63";
      case "pending":
        return "#a1887f";
      case "absent":
        return "#d32f2f";
      default:
        return "#6b4f42";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return t("supervisor.confirmed");
      case "pending":
        return t("supervisor.pending");
      case "absent":
        return t("supervisor.absent");
      default:
        return t("supervisor.unknown");
    }
  };

  const Header = () => (
    <View
      style={[styles.header, { flexDirection: isRTL ? "row-reverse" : "row" }]}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { textAlign: isRTL ? "right" : "left" }]}>
          {t("supervisor.staffSchedule")}
        </Text>
        <Text
          style={[styles.subtitle, { textAlign: isRTL ? "right" : "left" }]}
        >
          {t("supervisor.manageStaffSchedule")}
        </Text>
      </View>
      <View
        style={[
          styles.headerActions,
          { flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
      >
        <TouchableOpacity style={styles.iconButton}>
          <Calendar size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Users size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const WeekNavigation = () => (
    <View
      style={[
        styles.weekNavigation,
        { flexDirection: isRTL ? "row-reverse" : "row" },
      ]}
    >
      <TouchableOpacity
        style={styles.weekNavButton}
        onPress={() => setSelectedWeek(selectedWeek - 1)}
      >
        <ChevronLeft size={20} color="#8d6e63" />
      </TouchableOpacity>

      <Text style={[styles.weekText, { textAlign: isRTL ? "right" : "left" }]}>
        {t("supervisor.week")} {selectedWeek + 1}
      </Text>

      <TouchableOpacity
        style={styles.weekNavButton}
        onPress={() => setSelectedWeek(selectedWeek + 1)}
      >
        <ChevronRight size={20} color="#8d6e63" />
      </TouchableOpacity>
    </View>
  );

  const DayTabs = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.dayTabs}
      contentContainerStyle={styles.dayTabsContent}
    >
      {weekDays.map((day, index) => (
        <TouchableOpacity
          key={day.key}
          style={[
            styles.dayTab,
            selectedDay === index && styles.dayTabActive,
            {
              marginLeft: isRTL ? 8 : 0,
              marginRight: isRTL ? 0 : 8,
            },
          ]}
          onPress={() => setSelectedDay(index)}
        >
          <Text
            style={[
              styles.dayTabText,
              selectedDay === index && styles.dayTabTextActive,
              { textAlign: isRTL ? "right" : "left" },
            ]}
          >
            {day.short}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const StaffCard = ({ staff, shift }) => (
    <View style={styles.staffCard}>
      <View
        style={[
          styles.staffInfo,
          { flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
      >
        <View
          style={[
            styles.avatar,
            { backgroundColor: getStatusColor(staff.status) },
          ]}
        >
          <Text style={styles.avatarText}>{staff.avatar}</Text>
        </View>
        <View style={styles.staffDetails}>
          <Text
            style={[styles.staffName, { textAlign: isRTL ? "right" : "left" }]}
          >
            {staff.name}
          </Text>
          <Text
            style={[styles.staffRole, { textAlign: isRTL ? "right" : "left" }]}
          >
            {staff.role}
          </Text>
          <View
            style={[
              styles.statusContainer,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: getStatusColor(staff.status) },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { textAlign: isRTL ? "right" : "left" },
              ]}
            >
              {getStatusText(staff.status)}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => handleEditSchedule(staff, shift)}
      >
        <Edit size={16} color="#8d6e63" />
      </TouchableOpacity>
    </View>
  );

  const ShiftSection = ({ shift }) => {
    const currentDay = weekDays[selectedDay].key;
    const staffList = getScheduleForDay(currentDay);

    return (
      <View style={styles.shiftSection}>
        <View
          style={[
            styles.shiftHeader,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          <View
            style={[
              styles.shiftInfo,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
            <View
              style={[styles.shiftColor, { backgroundColor: shift.color }]}
            />
            <View>
              <Text
                style={[
                  styles.shiftTitle,
                  { textAlign: isRTL ? "right" : "left" },
                ]}
              >
                {shift.label}
              </Text>
              <Text
                style={[
                  styles.shiftTime,
                  { textAlign: isRTL ? "right" : "left" },
                ]}
              >
                {shift.time}
              </Text>
            </View>
          </View>
          <View style={styles.shiftStats}>
            <Text
              style={[
                styles.staffCount,
                { textAlign: isRTL ? "right" : "left" },
              ]}
            >
              {staffList.length} {t("supervisor.staff")}
            </Text>
          </View>
        </View>

        <View style={styles.staffList}>
          {staffList.map((staff) => (
            <StaffCard key={staff.id} staff={staff} shift={shift.key} />
          ))}

          <TouchableOpacity
            style={styles.addStaffButton}
            onPress={() => handleAddStaff(shift.key)}
          >
            <Plus size={16} color="#8d6e63" />
            <Text
              style={[
                styles.addStaffText,
                { textAlign: isRTL ? "right" : "left" },
              ]}
            >
              {t("supervisor.addStaff")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const QuickActions = () => (
    <View
      style={[
        styles.quickActions,
        { flexDirection: isRTL ? "row-reverse" : "row" },
      ]}
    >
      <TouchableOpacity style={styles.actionButton} onPress={handleSwapShifts}>
        <Swap size={20} color="#fff" />
        <Text
          style={[
            styles.actionButtonText,
            { textAlign: isRTL ? "right" : "left" },
          ]}
        >
          {t("supervisor.swapShifts")}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={handleTimeOffRequests}
      >
        <FileText size={20} color="#fff" />
        <Text
          style={[
            styles.actionButtonText,
            { textAlign: isRTL ? "right" : "left" },
          ]}
        >
          {t("supervisor.timeOffRequests")}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Header />
        <WeekNavigation />
        <DayTabs />

        <View style={styles.content}>
          {shifts.map((shift) => (
            <ShiftSection key={shift.key} shift={shift} />
          ))}
        </View>

        <QuickActions />
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f3ef",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 16,
    backgroundColor: "#8d6e63",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#f0ebe7",
  },
  headerActions: {
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  weekNavigation: {
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop: 16,
  },
  weekNavButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fffaf5",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  weekText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b4f42",
  },
  dayTabs: {
    marginBottom: 16,
  },
  dayTabsContent: {
    paddingHorizontal: 16,
  },
  dayTab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#fffaf5",
    borderWidth: 1,
    borderColor: "#e5d4c0",
  },
  dayTabActive: {
    backgroundColor: "#8d6e63",
    borderColor: "#8d6e63",
  },
  dayTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b4f42",
  },
  dayTabTextActive: {
    color: "#fff",
  },
  content: {
    padding: 16,
    gap: 16,
  },
  shiftSection: {
    backgroundColor: "#fffaf5",
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: "#e5d4c0",
    marginBottom: 12,
    elevation: 2,
  },
  shiftHeader: {
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  shiftInfo: {
    alignItems: "center",
    gap: 12,
  },
  shiftColor: {
    width: 4,
    height: 24,
    borderRadius: 2,
  },
  shiftTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4e342e",
  },
  shiftTime: {
    fontSize: 14,
    color: "#6b4f42",
  },
  shiftStats: {
    alignItems: "flex-end",
  },
  staffCount: {
    fontSize: 14,
    color: "#6b4f42",
  },
  staffList: {
    gap: 12,
  },
  staffCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5d4c0",
  },
  staffInfo: {
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  staffDetails: {
    flex: 1,
  },
  staffName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4e342e",
    marginBottom: 2,
  },
  staffRole: {
    fontSize: 14,
    color: "#6b4f42",
    marginBottom: 4,
  },
  statusContainer: {
    alignItems: "center",
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    color: "#6b4f42",
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f7f3ef",
    justifyContent: "center",
    alignItems: "center",
  },
  addStaffButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: "#8d6e63",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#fffaf5",
  },
  addStaffText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8d6e63",
  },
  quickActions: {
    gap: 12,
    padding: 16,
    paddingTop: 0,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#8d6e63",
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default StaffScheduleScreen;
