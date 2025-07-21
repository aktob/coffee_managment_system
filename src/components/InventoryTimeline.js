import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Trash,
  Clock,
  X,
  User,
} from "lucide-react-native";

const InventoryTimeline = ({ visible, onClose, item }) => {
  const { t } = useTranslation();
  const theme = useSelector((state) => state.theme.mode);
  const isDark = theme === "dark";

  // Mock history data - replace with actual data from API
  const history = [
    {
      id: 1,
      type: "restock",
      quantity: 100,
      oldQuantity: 50,
      newQuantity: 150,
      timestamp: "2024-01-20T10:30:00Z",
      user: "John Doe",
      note: "Regular restock",
    },
    {
      id: 2,
      type: "adjustment",
      quantity: -20,
      oldQuantity: 150,
      newQuantity: 130,
      timestamp: "2024-01-19T15:45:00Z",
      user: "Jane Smith",
      note: "Inventory count adjustment",
    },
    {
      id: 3,
      type: "usage",
      quantity: -30,
      oldQuantity: 130,
      newQuantity: 100,
      timestamp: "2024-01-19T09:15:00Z",
      user: "System",
      note: "Automatic deduction from sales",
    },
  ];

  const getEventIcon = (type) => {
    switch (type) {
      case "restock":
        return <RotateCcw size={16} color="#10B981" />;
      case "adjustment":
        return quantity > 0 ? (
          <ArrowUp size={16} color="#10B981" />
        ) : (
          <ArrowDown size={16} color="#EF4444" />
        );
      case "usage":
        return <ArrowDown size={16} color="#EF4444" />;
      case "delete":
        return <Trash size={16} color="#EF4444" />;
      default:
        return null;
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const TimelineEvent = ({ event, isLast }) => (
    <View style={styles.eventContainer}>
      <View style={styles.eventIconContainer}>
        {getEventIcon(event.type)}
        {!isLast && <View style={styles.eventLine} />}
      </View>
      <View style={[styles.eventContent, isDark && styles.eventContentDark]}>
        <View style={styles.eventHeader}>
          <View style={styles.eventType}>
            <Text
              style={[styles.eventTypeText, isDark && styles.eventTypeTextDark]}
            >
              {t(`supervisor.${event.type}`)}
            </Text>
            <Text
              style={[
                styles.quantityChange,
                { color: event.quantity > 0 ? "#10B981" : "#EF4444" },
              ]}
            >
              {event.quantity > 0 ? "+" : ""}
              {event.quantity} {item?.unit}
            </Text>
          </View>
          <View style={styles.eventTimestamp}>
            <Clock size={12} color={isDark ? "#9CA3AF" : "#6B7280"} />
            <Text
              style={[styles.timestampText, isDark && styles.timestampTextDark]}
            >
              {formatDate(event.timestamp)}
            </Text>
          </View>
        </View>

        <View style={styles.quantityContainer}>
          <Text
            style={[styles.quantityLabel, isDark && styles.quantityLabelDark]}
          >
            {t("supervisor.quantityChange")}:
          </Text>
          <Text
            style={[styles.quantityText, isDark && styles.quantityTextDark]}
          >
            {event.oldQuantity} → {event.newQuantity} {item?.unit}
          </Text>
        </View>

        <View style={styles.userContainer}>
          <User size={12} color={isDark ? "#9CA3AF" : "#6B7280"} />
          <Text style={[styles.userText, isDark && styles.userTextDark]}>
            {event.user}
          </Text>
        </View>

        {event.note && (
          <Text style={[styles.noteText, isDark && styles.noteTextDark]}>
            {event.note}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.container, isDark && styles.containerDark]}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, isDark && styles.titleDark]}>
              {t("supervisor.inventoryHistory")}
            </Text>
            <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
              {item?.name}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.closeButton, isDark && styles.closeButtonDark]}
            onPress={onClose}
          >
            <X size={20} color={isDark ? "#FFFFFF" : "#1F2937"} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.timeline}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.timelineContent}
        >
          {history.map((event, index) => (
            <TimelineEvent
              key={event.id}
              event={event}
              isLast={index === history.length - 1}
            />
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  containerDark: {
    backgroundColor: "#111827",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
  },
  titleDark: {
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  subtitleDark: {
    color: "#9CA3AF",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonDark: {
    backgroundColor: "#374151",
  },
  timeline: {
    flex: 1,
  },
  timelineContent: {
    padding: 16,
  },
  eventContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  eventIconContainer: {
    width: 32,
    alignItems: "center",
  },
  eventLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#E5E7EB",
    marginTop: 8,
    marginBottom: -8,
  },
  eventContent: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
  },
  eventContentDark: {
    backgroundColor: "#1F2937",
  },
  eventHeader: {
    marginBottom: 8,
  },
  eventType: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  eventTypeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  eventTypeTextDark: {
    color: "#FFFFFF",
  },
  quantityChange: {
    fontSize: 14,
    fontWeight: "600",
  },
  eventTimestamp: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timestampText: {
    fontSize: 12,
    color: "#6B7280",
  },
  timestampTextDark: {
    color: "#9CA3AF",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  quantityLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginRight: 4,
  },
  quantityLabelDark: {
    color: "#9CA3AF",
  },
  quantityText: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "500",
  },
  quantityTextDark: {
    color: "#FFFFFF",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  userText: {
    fontSize: 12,
    color: "#6B7280",
  },
  userTextDark: {
    color: "#9CA3AF",
  },
  noteText: {
    fontSize: 14,
    color: "#6B7280",
    fontStyle: "italic",
  },
  noteTextDark: {
    color: "#9CA3AF",
  },
});

export default InventoryTimeline;
