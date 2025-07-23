import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  ClipboardList,
  AlertTriangle,
  AlertCircle,
  Circle,
  AlarmClock,
  Clock,
  CheckCircle,
  Folder,
  Timer,
  Search,
  Play,
  Eye,
  User,
  Calendar,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

const TasksScreen = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useSelector((state) => state.language);
  const isRTL = currentLanguage === "ar";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("all");

  const tasks = [
    {
      id: 1,
      title: "Clean Coffee Machines",
      description: "Perform daily cleaning of all espresso machines",
      priority: "high",
      status: "pending",
      dueTime: "2024-01-20T11:00:00Z",
      assignedBy: "John Supervisor",
      category: "Maintenance",
      estimatedDuration: "30 min",
    },
    {
      id: 2,
      title: "Restock Supplies",
      description: "Check and restock coffee beans, cups, lids, and supplies",
      priority: "medium",
      status: "in-progress",
      dueTime: "2024-01-20T12:00:00Z",
      assignedBy: "Sarah Manager",
      category: "Inventory",
      estimatedDuration: "20 min",
    },
    {
      id: 3,
      title: "Prepare Morning Setup",
      description: "Set up workstation, check equipment for morning shift",
      priority: "high",
      status: "completed",
      dueTime: "2024-01-20T07:00:00Z",
      assignedBy: "Mike Supervisor",
      category: "Setup",
      estimatedDuration: "15 min",
    },
  ];

  const priorities = [
    { key: "all", label: t("worker.allTasks"), icon: "ClipboardList" },
    { key: "high", label: t("worker.highPriority"), icon: "AlertTriangle" },
    { key: "medium", label: t("worker.mediumPriority"), icon: "AlertCircle" },
    { key: "low", label: t("worker.lowPriority"), icon: "Circle" },
  ];

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "high":
        return { bg: "#fef3c7", color: "#92400e" };
      case "medium":
        return { bg: "#dbeafe", color: "#1e3a8a" };
      case "low":
        return { bg: "#bbf7d0", color: "#166534" };
      default:
        return { bg: "#e5e7eb", color: "#374151" };
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return { bg: "#fef3c7", color: "#92400e", icon: "AlarmClock" };
      case "in-progress":
        return { bg: "#dbeafe", color: "#1e3a8a", icon: "Clock" };
      case "completed":
        return { bg: "#bbf7d0", color: "#166534", icon: "CheckCircle" };
      default:
        return { bg: "#e5e7eb", color: "#374151", icon: "ClipboardList" };
    }
  };

  const getTaskCount = (priority) => {
    if (priority === "all") return tasks.length;
    return tasks.filter((task) => task.priority === priority).length;
  };

  const filteredTasks = tasks.filter(
    (task) =>
      (selectedPriority === "all" || task.priority === selectedPriority) &&
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTranslatedStatus = (status) => {
    const translations = {
      pending: t("worker.pending"),
      "in-progress": t("worker.inProgress"),
      completed: t("worker.completed"),
    };
    return translations[status] || status;
  };

  const getTranslatedPriority = (priority) => {
    const translations = {
      high: t("worker.high"),
      medium: t("worker.medium"),
      low: t("worker.low"),
    };
    return translations[priority] || priority;
  };

  const renderIcon = (iconName, size = 24, color = "#4e342e") => {
    switch (iconName) {
      case "ClipboardList":
        return <ClipboardList size={size} color={color} />;
      case "AlertTriangle":
        return <AlertTriangle size={size} color={color} />;
      case "AlertCircle":
        return <AlertCircle size={size} color={color} />;
      case "Circle":
        return <Circle size={size} color={color} />;
      case "AlarmClock":
        return <AlarmClock size={size} color={color} />;
      case "Clock":
        return <Clock size={size} color={color} />;
      case "CheckCircle":
        return <CheckCircle size={size} color={color} />;
      case "Folder":
        return <Folder size={size} color={color} />;
      case "Timer":
        return <Timer size={size} color={color} />;
      case "Search":
        return <Search size={size} color={color} />;
      case "Play":
        return <Play size={size} color={color} />;
      case "Eye":
        return <Eye size={size} color={color} />;
      case "User":
        return <User size={size} color={color} />;
      case "Calendar":
        return <Calendar size={size} color={color} />;
      default:
        return null;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f7f3ef",
    },
    header: {
      paddingTop: 48,
      paddingBottom: 28,
      paddingHorizontal: 20,
      backgroundColor: "#8d6e63",
      borderBottomLeftRadius: 35,
      borderBottomRightRadius: 35,
      marginBottom: 24,
      elevation: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: "800",
      color: "#fff",
      marginBottom: 8,
      textAlign: isRTL ? "right" : "left",
      letterSpacing: -0.5,
    },
    headerSubtitle: {
      color: "rgba(255, 255, 255, 0.9)",
      fontSize: 16,
      textAlign: isRTL ? "right" : "left",
      fontWeight: "500",
    },
    scrollContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    searchSection: {
      marginBottom: 28,
    },
    inputContainer: {
      backgroundColor: "#fffaf5",
      borderRadius: 25,
      paddingHorizontal: 20,
      paddingVertical: 18,
      elevation: 8,
      borderWidth: 1,
      borderColor: "#e5d4c0",
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    textInput: {
      fontSize: 16,
      color: "#4e342e",
      flex: 1,
      textAlign: isRTL ? "right" : "left",
      marginRight: isRTL ? 0 : 12,
      marginLeft: isRTL ? 12 : 0,
      fontWeight: "500",
    },
    section: {
      marginBottom: 28,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: "#4e342e",
      marginBottom: 16,
      textAlign: isRTL ? "right" : "left",
      letterSpacing: -0.3,
    },
    filterRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      paddingHorizontal: 4,
    },
    priorityButton: {
      marginRight: isRTL ? 0 : 12,
      marginLeft: isRTL ? 12 : 0,
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 28,
      backgroundColor: "#fffaf5",
      borderWidth: 1,
      borderColor: "#e5d4c0",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 110,
    },
    priorityButtonSelected: {
      backgroundColor: "#4e342e",
      borderColor: "#4e342e",
    },
    priorityLabel: {
      fontSize: 13,
      fontWeight: "700",
      color: "#4e342e",
      textAlign: "center",
      marginBottom: 4,
      letterSpacing: 0.2,
    },
    priorityLabelSelected: {
      color: "#fff",
    },
    priorityCount: {
      fontSize: 11,
      color: "#6b4f42",
      fontWeight: "600",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
    },
    priorityCountSelected: {
      color: "#fff",
      backgroundColor: "rgba(255, 255, 255, 0.3)",
    },
    tasksContainer: {
      gap: 20,
    },
    taskCard: {
      backgroundColor: "#fffaf5",
      borderRadius: 24,
      padding: 24,
      elevation: 8,
      borderWidth: 1,
      borderColor: "#e5d4c0",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
    },
    taskHeader: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "flex-start",
      marginBottom: 20,
    },
    taskIconContainer: {
      width: 72,
      height: 72,
      borderRadius: 22,
      backgroundColor: "#e5d4c0",
      alignItems: "center",
      justifyContent: "center",
      marginRight: isRTL ? 0 : 20,
      marginLeft: isRTL ? 20 : 0,
      elevation: 6,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
    },
    taskTitleRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      marginBottom: 8,
    },
    taskTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: "#4e342e",
      flex: 1,
      textAlign: isRTL ? "right" : "left",
      letterSpacing: -0.3,
      lineHeight: 26,
    },
    taskPriorityBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      marginLeft: isRTL ? 0 : 12,
      marginRight: isRTL ? 12 : 0,
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    taskPriorityText: {
      fontSize: 11,
      fontWeight: "800",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    taskDescription: {
      fontSize: 15,
      color: "#6b4f42",
      marginBottom: 16,
      textAlign: isRTL ? "right" : "left",
      lineHeight: 22,
      fontWeight: "500",
    },
    taskMetaRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      gap: 20,
    },
    taskMetaIcon: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      backgroundColor: "#f7f3ef",
      paddingLeft: 8,
      paddingVertical: 6,
      borderRadius: 16,
    },
    taskMeta: {
      fontSize: 13,
      color: "#6b4f42",
      marginRight: isRTL ? 0 : 8,
      marginLeft: isRTL ? 8 : 0,
      fontWeight: "600",
    },
    taskDetailsContainer: {
      backgroundColor: "#f7f3ef",
      borderRadius: 20,
      padding: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: "#e5d4c0",
    },
    detailRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      marginBottom: 12,
      alignItems: "center",
    },
    detailLabel: {
      fontSize: 14,
      color: "#6b4f42",
      textAlign: isRTL ? "right" : "left",
      fontWeight: "600",
    },
    detailValue: {
      fontSize: 14,
      fontWeight: "700",
      color: "#4e342e",
      textAlign: isRTL ? "right" : "left",
    },
    statusBadge: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 22,
      alignSelf: "flex-start",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 4,
      gap: 8,
    },
    statusBadgeText: {
      fontWeight: "700",
      fontSize: 12,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    actionsRow: {
      flexDirection: isRTL ? "row-reverse" : "row",
      gap: 16,
    },
    startButton: {
      flex: 1,
      backgroundColor: "#6d4c41",
      padding: 16,
      borderRadius: 20,
      alignItems: "center",
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "center",
      elevation: 6,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
    },
    completeButton: {
      flex: 1,
      backgroundColor: "#6d4c41",
      padding: 16,
      borderRadius: 20,
      alignItems: "center",
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "center",
      elevation: 6,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
    },
    detailsButton: {
      backgroundColor: "#d7bfa9",
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderRadius: 20,
      alignItems: "center",
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "center",
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      borderWidth: 1,
      borderColor: "#e5d4c0",
    },
    actionButtonText: {
      color: "#fff",
      fontWeight: "700",
      marginRight: isRTL ? 0 : 8,
      marginLeft: isRTL ? 8 : 0,
      fontSize: 15,
      letterSpacing: 0.3,
      paddingLeft: 15,     
    },
    detailsButtonText: {
      color: "#4e342e",
      fontWeight: "700",
      marginRight: isRTL ? 0 : 8,
      marginLeft: isRTL ? 8 : 0,
      fontSize: 15,
      letterSpacing: 0.3,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("worker.tasks")}</Text>
        <Text style={styles.headerSubtitle}>
          {t("worker.manageDailyTasks")}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchSection}>
          <View style={styles.inputContainer}>
            {renderIcon("Search", 20, "#6b4f42")}
            <TextInput
              style={styles.textInput}
              placeholder={t("worker.searchTasks")}
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("worker.filterByPriority")}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={
              isRTL ? { flexDirection: "row-reverse" } : {}
            }
          >
            <View style={styles.filterRow}>
              {priorities.map((priority) => (
                <TouchableOpacity
                  key={priority.key}
                  onPress={() => setSelectedPriority(priority.key)}
                  style={[
                    styles.priorityButton,
                    selectedPriority === priority.key &&
                      styles.priorityButtonSelected,
                  ]}
                >
                  {renderIcon(
                    priority.icon,
                    20,
                    selectedPriority === priority.key ? "#fff" : "#4e342e"
                  )}
                  <Text
                    style={[
                      styles.priorityLabel,
                      selectedPriority === priority.key &&
                      styles.priorityLabelSelected,
                    ]}
                  >
                    {priority.label}
                  </Text>
                  <Text
                    style={[
                      styles.priorityCount,
                      selectedPriority === priority.key &&
                        styles.priorityCountSelected,
                    ]}
                  >
                    {getTaskCount(priority.key)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("worker.yourTasks")} ({filteredTasks.length})
          </Text>
          <View style={styles.tasksContainer}>
            {filteredTasks.map((task) => {
              const priority = getPriorityStyle(task.priority);
              const status = getStatusStyle(task.status);

              return (
                <View key={task.id} style={styles.taskCard}>
                  <View style={styles.taskHeader}>
                    <View style={styles.taskIconContainer}>
                      {renderIcon("ClipboardList", 28, "#4e342e")}
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.taskTitleRow}>
                        <Text style={styles.taskTitle}>{task.title}</Text>
                        <View
                          style={[
                            styles.taskPriorityBadge,
                            { backgroundColor: priority.bg },
                          ]}
                        >
                          <Text
                            style={[
                              styles.taskPriorityText,
                              { color: priority.color },
                            ]}
                          >
                            {getTranslatedPriority(task.priority)}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.taskDescription}>
                        {task.description}
                      </Text>
                      <View style={styles.taskMetaRow}>
                        <View style={styles.taskMetaIcon}>
                          {renderIcon("Folder", 14, "#6b4f42")}
                          <Text style={styles.taskMeta}>{task.category}</Text>
                        </View>
                        <View style={styles.taskMetaIcon}>
                          {renderIcon("Timer", 14, "#6b4f42")}
                          <Text style={styles.taskMeta}>
                            {task.estimatedDuration}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={styles.taskDetailsContainer}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>
                        {t("worker.dueTime")}:
                      </Text>
                      <View
                        style={{
                          flexDirection: isRTL ? "row-reverse" : "row",
                          alignItems: "center",
                        }}
                      >
                        {renderIcon("Calendar", 14, "#6b4f42")}
                        <Text style={styles.detailValue}>
                          {formatTime(task.dueTime)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>
                        {t("worker.assignedBy")}:
                      </Text>
                      <View
                        style={{
                          flexDirection: isRTL ? "row-reverse" : "row",
                          alignItems: "center",
                        }}
                      >
                        {renderIcon("User", 14, "#6b4f42")}
                        <Text style={styles.detailValue}>
                          {task.assignedBy}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>
                        {t("worker.status")}:
                      </Text>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: status.bg },
                        ]}
                      >
                        {renderIcon(status.icon, 14, status.color)}
                        <Text
                          style={[
                            styles.statusBadgeText,
                            { color: status.color },
                          ]}
                        >
                          {getTranslatedStatus(task.status)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {task.status !== "completed" && (
                    <View style={styles.actionsRow}>
                      {task.status === "pending" && (
                        <TouchableOpacity style={styles.startButton}>
                          {renderIcon("Play", 16, "#fff")}
                          <Text style={styles.actionButtonText}>
                            {t("worker.startTask")}
                          </Text>
                        </TouchableOpacity>
                      )}
                      {task.status === "in-progress" && (
                        <TouchableOpacity style={styles.completeButton}>
                          {renderIcon("CheckCircle", 16, "#fff")}
                          <Text style={styles.actionButtonText}>
                            {t("worker.completeTask")}
                          </Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity style={styles.detailsButton}>
                        {renderIcon("Eye", 16, "#4e342e")}
                        <Text style={styles.detailsButtonText}>
                          {t("worker.details")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default TasksScreen;
