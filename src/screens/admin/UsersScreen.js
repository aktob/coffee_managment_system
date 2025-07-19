import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  Search,
  Filter,
  User,
  Mail,
  Calendar,
  Shield,
  Edit,
  Trash2,
  Plus,
  Users,
  ChevronRight,
  ChevronLeft,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

const UsersScreen = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useSelector((state) => state.language);
  const isRTL = currentLanguage === "ar";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  // Mock users data
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@coffee.com",
      role: "supervisor",
      status: "active",
      joinDate: "2023-06-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@coffee.com",
      role: "worker",
      status: "active",
      joinDate: "2023-08-20",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@coffee.com",
      role: "admin",
      status: "inactive",
      joinDate: "2023-04-10",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah@coffee.com",
      role: "worker",
      status: "active",
      joinDate: "2023-09-05",
    },
    {
      id: 5,
      name: "David Brown",
      email: "david@coffee.com",
      role: "supervisor",
      status: "active",
      joinDate: "2023-07-12",
    },
  ];

  const roles = ["all", "admin", "supervisor", "worker"];

  const filteredUsers = users.filter(
    (user) =>
      (selectedRole === "all" || user.role === selectedRole) &&
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderIcon = (iconName, size = 24, color = "#4e342e") => {
    switch (iconName) {
      case "Search":
        return <Search size={size} color={color} />;
      case "Filter":
        return <Filter size={size} color={color} />;
      case "User":
        return <User size={size} color={color} />;
      case "Mail":
        return <Mail size={size} color={color} />;
      case "Calendar":
        return <Calendar size={size} color={color} />;
      case "Shield":
        return <Shield size={size} color={color} />;
      case "Edit":
        return <Edit size={size} color={color} />;
      case "Trash2":
        return <Trash2 size={size} color={color} />;
      case "Plus":
        return <Plus size={size} color={color} />;
      case "Users":
        return <Users size={size} color={color} />;
      case "ChevronRight":
        return <ChevronRight size={size} color={color} />;
      case "ChevronLeft":
        return <ChevronLeft size={size} color={color} />;
      default:
        return null;
    }
  };

  const handleEditUser = (user) => {
    Alert.alert(
      t("admin.editUserDetails"),
      `${t("admin.editUserDetails")} ${user.name}`
    );
  };

  const handleDeleteUser = (user) => {
    Alert.alert(t("admin.deleteUser"), t("admin.deleteUserConfirm"), [
      {
        text: t("common.cancel"),
        style: "cancel",
      },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: () => {
          console.log("Delete user:", user.id);
          Alert.alert(t("common.success"), t("admin.userDeleted"));
        },
      },
    ]);
  };

  const handleAddUser = () => {
    Alert.alert(t("admin.addNewUser"), t("admin.addNewUser"));
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f7f3ef",
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
    headerTitle: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#fff",
      marginBottom: 8,
      textAlign: isRTL ? "right" : "left",
    },
    headerSubtitle: {
      color: "#f0ebe7",
      fontSize: 18,
      textAlign: isRTL ? "right" : "left",
    },
    scrollContainer: {
      flex: 1,
      paddingHorizontal: 16,
    },
    searchContainer: {
      marginVertical: 16,
    },
    searchInput: {
      backgroundColor: "#fffaf5",
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      borderWidth: 1,
      borderColor: "#e5d4c0",
      textAlign: isRTL ? "right" : "left",
      flexDirection: isRTL ? "row-reverse" : "row",
    },
    searchInputContainer: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      backgroundColor: "#fffaf5",
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "#e5d4c0",
      paddingHorizontal: 16,
      paddingVertical: 4,
    },
    searchIcon: {
      marginRight: isRTL ? 0 : 12,
      marginLeft: isRTL ? 12 : 0,
    },
    searchTextInput: {
      flex: 1,
      fontSize: 16,
      color: "#4e342e",
      textAlign: isRTL ? "right" : "left",
    },
    filterContainer: {
      marginBottom: 16,
    },
    filterTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: "#4e342e",
      marginBottom: 12,
      textAlign: isRTL ? "right" : "left",
    },
    filterScrollView: {
      flexDirection: isRTL ? "row-reverse" : "row",
    },
    filterButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      marginRight: isRTL ? 0 : 12,
      marginLeft: isRTL ? 12 : 0,
      borderWidth: 2,
      borderColor: "transparent",
    },
    filterButtonActive: {
      backgroundColor: "#8d6e63",
      borderColor: "#8d6e63",
    },
    filterButtonInactive: {
      backgroundColor: "#e5d4c0",
      borderColor: "#e5d4c0",
    },
    filterButtonText: {
      fontSize: 14,
      fontWeight: "600",
      textAlign: "center",
    },
    filterButtonTextActive: {
      color: "#fff",
    },
    filterButtonTextInactive: {
      color: "#4e342e",
    },
    addButton: {
      backgroundColor: "#8d6e63",
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 16,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
      elevation: 4,
    },
    addButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
      marginRight: isRTL ? 0 : 8,
      marginLeft: isRTL ? 8 : 0,
    },
    usersList: {
      marginBottom: 20,
    },
    userCard: {
      backgroundColor: "#fffaf5",
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      elevation: 4,
      borderWidth: 1,
      borderColor: "#e5d4c0",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
    },
    userHeader: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      marginBottom: 16,
    },
    userAvatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: "#e5d4c0",
      alignItems: "center",
      justifyContent: "center",
      marginRight: isRTL ? 0 : 16,
      marginLeft: isRTL ? 16 : 0,
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#4e342e",
      marginBottom: 4,
      textAlign: isRTL ? "right" : "left",
    },
    userEmail: {
      fontSize: 14,
      color: "#6b4f42",
      marginBottom: 4,
      textAlign: isRTL ? "right" : "left",
    },
    userRole: {
      fontSize: 14,
      color: "#8d6e63",
      fontWeight: "600",
      textAlign: isRTL ? "right" : "left",
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      marginLeft: isRTL ? 0 : 8,
      marginRight: isRTL ? 8 : 0,
    },
    statusBadgeActive: {
      backgroundColor: "#e8f5e8",
      borderWidth: 1,
      borderColor: "#4caf50",
    },
    statusBadgeInactive: {
      backgroundColor: "#ffeaea",
      borderWidth: 1,
      borderColor: "#f44336",
    },
    statusText: {
      fontSize: 12,
      fontWeight: "600",
      textAlign: "center",
    },
    statusTextActive: {
      color: "#2e7d32",
    },
    statusTextInactive: {
      color: "#c62828",
    },
    userDetails: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      marginBottom: 12,
    },
    detailIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "#f0ebe7",
      alignItems: "center",
      justifyContent: "center",
      marginRight: isRTL ? 0 : 12,
      marginLeft: isRTL ? 12 : 0,
    },
    detailText: {
      fontSize: 14,
      color: "#6b4f42",
      textAlign: isRTL ? "right" : "left",
    },
    actionButtons: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: "#e5d4c0",
    },
    actionButton: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 12,
      flex: 1,
      marginRight: isRTL ? 0 : 8,
      marginLeft: isRTL ? 8 : 0,
    },
    editButton: {
      backgroundColor: "#d7bfa9",
    },
    deleteButton: {
      backgroundColor: "#ffcdd2",
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: "600",
      marginRight: isRTL ? 0 : 6,
      marginLeft: isRTL ? 6 : 0,
    },
    editButtonText: {
      color: "#4e342e",
    },
    deleteButtonText: {
      color: "#c62828",
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 40,
    },
    emptyStateIcon: {
      marginBottom: 16,
    },
    emptyStateText: {
      fontSize: 16,
      color: "#6b4f42",
      textAlign: "center",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("admin.usersManagement")}</Text>
        <Text style={styles.headerSubtitle}>{t("admin.usersSubtitle")}</Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            {renderIcon("Search", 20, "#6b4f42")}
            <TextInput
              style={styles.searchTextInput}
              placeholder={t("admin.searchUsers")}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#8d6e63"
            />
          </View>
        </View>

        {/* Role Filter */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>{t("admin.filterByRole")}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScrollView}
            contentContainerStyle={{ paddingHorizontal: 0 }}
          >
            {roles.map((role) => (
              <TouchableOpacity
                key={role}
                style={[
                  styles.filterButton,
                  selectedRole === role
                    ? styles.filterButtonActive
                    : styles.filterButtonInactive,
                ]}
                onPress={() => setSelectedRole(role)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedRole === role
                      ? styles.filterButtonTextActive
                      : styles.filterButtonTextInactive,
                  ]}
                >
                  {role === "all" ? t("common.all") : t(`common.roles.${role}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Add User Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddUser}>
          {renderIcon("Plus", 20, "#fff")}
          <Text style={styles.addButtonText}>{t("admin.addNewUser")}</Text>
        </TouchableOpacity>

        {/* Users List */}
        <View style={styles.usersList}>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <View key={user.id} style={styles.userCard}>
                <View style={styles.userHeader}>
                  <View style={styles.userAvatar}>
                    {renderIcon("User", 28, "#4e342e")}
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                    <Text style={styles.userRole}>
                      {t(`common.roles.${user.role}`)}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      user.status === "active"
                        ? styles.statusBadgeActive
                        : styles.statusBadgeInactive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        user.status === "active"
                          ? styles.statusTextActive
                          : styles.statusTextInactive,
                      ]}
                    >
                      {t(`common.status.${user.status}`)}
                    </Text>
                  </View>
                </View>

                <View style={styles.userDetails}>
                  <View style={styles.detailIcon}>
                    {renderIcon("Calendar", 18, "#4e342e")}
                  </View>
                  <Text style={styles.detailText}>
                    {t("admin.joinDate")}: {formatDate(user.joinDate)}
                  </Text>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => handleEditUser(user)}
                  >
                    {renderIcon("Edit", 16, "#4e342e")}
                    <Text
                      style={[styles.actionButtonText, styles.editButtonText]}
                    >
                      {t("common.edit")}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteUser(user)}
                  >
                    {renderIcon("Trash2", 16, "#c62828")}
                    <Text
                      style={[styles.actionButtonText, styles.deleteButtonText]}
                    >
                      {t("common.delete")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              {renderIcon("Users", 64, "#8d6e63")}
              <Text style={styles.emptyStateText}>
                {t("admin.searchUsers")}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default UsersScreen;
