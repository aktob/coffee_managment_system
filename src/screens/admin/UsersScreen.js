import React, { useState, useEffect } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const BASE_URL = "http://api-coffee.m-zedan.com/api";

const UsersScreen = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useSelector((state) => state.language);
  const isRTL = currentLanguage === "ar";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userStatus, setUserStatus] = useState("active");
  const [userRole, setUserRole] = useState("بائع");
  const [userBranchId, setUserBranchId] = useState("1");
  const [userJoinDate, setUserJoinDate] = useState("");
  const [userEditId, setUserEditId] = useState(null);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [userNameError, setUserNameError] = useState("");
  const [userEmailError, setUserEmailError] = useState("");
  const [userPasswordError, setUserPasswordError] = useState("");
  const [userBranchIdError, setUserBranchIdError] = useState("");
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const roles = ["all", "بائع", "مدير"];
  const branches = ["1", "2"];

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          throw new Error(t("admin.noToken") || "لم يتم العثور على التوكين");
        }

        const response = await fetch(`${BASE_URL}/admin/users?page=${currentPage}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          if (response.status === 401) {
            throw new Error(t("admin.unauthorized") || "التوكين غير صالح أو منتهي");
          }
          throw new Error(
            errorData.message || t("admin.fetchUsersError") || `فشل في جلب المستخدمين (Status: ${response.status})`
          );
        }

        const data = await response.json();
        const mappedUsers = data.data.map((user) => ({
          id: user.id || Date.now(),
          name: user.name || "مستخدم بدون اسم",
          email: user.email || "لا يوجد بريد إلكتروني",
          role: user.role || "بائع",
          status: user.status || "active",
          joinDate: user.created_at || new Date().toISOString().split("T")[0],
          branch_id: user.branch_id || "1",
        }));

        setUsers(mappedUsers);
        setTotalPages(data.last_page || 1);
        setError(null);
      } catch (err) {
        console.error("Error fetching users:", err.message);
        setError(err.message);
        Alert.alert(t("common.error") || "خطأ", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, t]);

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

  const handleEditUser = async (user) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        throw new Error(t("admin.noToken") || "لم يتم العثور على التوكين");
      }

      const response = await fetch(`${BASE_URL}/admin/users/${user.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || t("admin.fetchUserError") || `فشل في جلب بيانات المستخدم (Status: ${response.status})`
        );
      }

      const userData = await response.json();
      setUserName(userData.name || "");
      setUserEmail(userData.email || "");
      setUserRole(userData.role || "بائع");
      setUserStatus(userData.status || "active");
      setUserJoinDate(userData.created_at || "");
      setUserBranchId(userData.branch_id || "1");
      setUserEditId(user.id);
      setIsEditingUser(true);
      setFormVisible(true);
    } catch (err) {
      console.error("Error fetching user for edit:", err.message);
      Alert.alert(t("common.error") || "خطأ", err.message);
    }
  };

  const handleDeleteUser = async (user) => {
    Alert.alert(
      t("admin.deleteUser") || "حذف المستخدم",
      t("admin.deleteUserConfirm") || "هل أنت متأكد من حذف المستخدم؟",
      [
        {
          text: t("common.cancel") || "إلغاء",
          style: "cancel",
        },
        {
          text: t("common.delete") || "حذف",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("authToken");
              if (!token) {
                throw new Error(t("admin.noToken") || "لم يتم العثور على التوكين");
              }

              const response = await fetch(`${BASE_URL}/admin/users/${user.id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
              });

              if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                  errorData.message || t("admin.deleteUserError") || `فشل في حذف المستخدم (Status: ${response.status})`
                );
              }

              setUsers(users.filter((u) => u.id !== user.id));
              Alert.alert(
                t("admin.deleteUser") || "حذف المستخدم",
                t("admin.deleteUserSuccess") || "تم حذف المستخدم بنجاح"
              );
            } catch (err) {
              console.error("Error deleting user:", err.message);
              Alert.alert(t("common.error") || "خطأ", err.message);
            }
          },
        },
      ]
    );
  };

  const handleAddUser = async () => {
    setUserNameError("");
    setUserEmailError("");
    setUserPasswordError("");
    setUserBranchIdError("");

    let hasError = false;

    if (!userName.trim()) {
      setUserNameError(t("admin.nameRequired") || "الاسم مطلوب");
      hasError = true;
    }

    if (!userEmail.trim() || !userEmail.includes("@")) {
      setUserEmailError(t("admin.emailInvalid") || "البريد الإلكتروني غير صالح");
      hasError = true;
    }

    if (!isEditingUser && (!userPassword.trim() || userPassword.length < 6)) {
      setUserPasswordError(t("admin.passwordInvalid") || "كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      hasError = true;
    }

    if (!userBranchId || !["1", "2"].includes(userBranchId)) {
      setUserBranchIdError(t("admin.branchInvalid") || "يجب اختيار فرع صالح");
      hasError = true;
    }

    if (hasError) return;

    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        throw new Error(t("admin.noToken") || "لم يتم العثور على التوكين");
      }

      const userData = {
        name: userName.trim(),
        email: userEmail.trim(),
        role: userRole,
        branch_id: parseInt(userBranchId),
      };

      if (!isEditingUser) {
        userData.password = userPassword.trim();
      }

      const endpoint = isEditingUser
        ? `${BASE_URL}/admin/users/${userEditId}`
        : `${BASE_URL}/admin/users`;

      const response = await fetch(endpoint, {
        method: isEditingUser ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 422) {
          const errorDetails = errorData.errors
            ? Object.entries(errorData.errors)
                .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
                .join("; ")
            : errorData.message || t("admin.invalidData") || "البيانات المرسلة غير صالحة";
          throw new Error(`خطأ 422: ${errorDetails}`);
        }
        throw new Error(
          errorData.message || t("admin.saveUserError") || `فشل في حفظ المستخدم (Status: ${response.status})`
        );
      }

      const result = await response.json();
      const updatedUser = {
        id: isEditingUser ? userEditId : result.id || Date.now(),
        name: userName.trim(),
        email: userEmail.trim(),
        role: userRole,
        status: userStatus,
        joinDate: userJoinDate || new Date().toISOString().split("T")[0],
        branch_id: parseInt(userBranchId),
      };

      if (isEditingUser) {
        setUsers(users.map((u) => (u.id === userEditId ? updatedUser : u)));
        Alert.alert(
          t("admin.editUser") || "تعديل المستخدم",
          t("admin.userUpdated") || `${userName} تم تعديله بنجاح!`
        );
      } else {
        setUsers([...users, updatedUser]);
        Alert.alert(
          t("admin.addUser") || "إضافة مستخدم",
          t("admin.userAdded") || `${userName} تم إضافته بنجاح!`
        );
      }

      clearUserForm();
    } catch (err) {
      console.error("Error adding/editing user:", err.message);
      Alert.alert(t("common.error") || "خطأ", err.message);
    }
  };

  const clearUserForm = () => {
    setUserName("");
    setUserEmail("");
    setUserPassword("");
    setUserRole("بائع");
    setUserStatus("active");
    setUserJoinDate("");
    setUserBranchId("1");
    setUserEditId(null);
    setIsEditingUser(false);
    setUserNameError("");
    setUserEmailError("");
    setUserPasswordError("");
    setUserBranchIdError("");
    setFormVisible(false);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
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
    emptyStateText: {
      fontSize: 16,
      color: "#6b4f42",
      textAlign: "center",
    },
    inputField: {
      backgroundColor: "#fff",
      borderWidth: 1,
      borderColor: "#ddd",
      padding: 12,
      borderRadius: 10,
      fontSize: 16,
      color: "#4e342e",
      marginBottom: 12,
    },
    paginationContainer: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    paginationButton: {
      backgroundColor: "#8d6e63",
      padding: 12,
      borderRadius: 12,
      elevation: 4,
    },
    paginationButtonDisabled: {
      backgroundColor: "#ccc",
    },
    pageInfo: {
      fontSize: 16,
      color: "#4e342e",
      fontWeight: "600",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {t("admin.usersManagement") || "إدارة المستخدمين"}
        </Text>
        <Text style={styles.headerSubtitle}>
          {t("admin.usersSubtitle") || "إدارة المستخدمين في النظام"}
        </Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            {renderIcon("Search", 20, "#6b4f42")}
            <TextInput
              style={styles.searchTextInput}
              placeholder={t("admin.searchUsers") || "ابحث عن المستخدمين"}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#8d6e63"
            />
          </View>
        </View>

        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>
            {t("admin.filterByRole") || "تصفية حسب الدور"}
          </Text>
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
                  {role === "all" ? t("common.all") || "الكل" : t(`common.roles.${role}`) || role}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={() => setFormVisible(true)}>
          {renderIcon("Plus", 20, "#fff")}
          <Text style={styles.addButtonText}>
            {t("admin.addNewUser") || "إضافة مستخدم جديد"}
          </Text>
        </TouchableOpacity>

        <View style={styles.usersList}>
          {loading ? (
            <View style={styles.emptyState}>
              <Text style={{ fontSize: 64 }}>⏳</Text>
              <Text style={styles.emptyStateText}>
                {t("admin.loading") || "جاري التحميل..."}
              </Text>
            </View>
          ) : error ? (
            <View style={styles.emptyState}>
              <Text style={{ fontSize: 64 }}>❌</Text>
              <Text style={styles.emptyStateText}>{error}</Text>
            </View>
          ) : filteredUsers.length > 0 ? (
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
                      {t(`common.roles.${user.role}`) || user.role}
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
                      {t(`common.status.${user.status}`) || user.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.userDetails}>
                  <View style={styles.detailIcon}>
                    {renderIcon("Calendar", 18, "#4e342e")}
                  </View>
                  <Text style={styles.detailText}>
                    {t("admin.joinDate") || "تاريخ الانضمام"}: {formatDate(user.joinDate)}
                  </Text>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => handleEditUser(user)}
                  >
                    {renderIcon("Edit", 16, "#4e342e")}
                    <Text style={[styles.actionButtonText, styles.editButtonText]}>
                      {t("common.edit") || "تعديل"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteUser(user)}
                  >
                    {renderIcon("Trash2", 16, "#c62828")}
                    <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                      {t("common.delete") || "حذف"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              {renderIcon("Users", 64, "#8d6e63")}
              <Text style={styles.emptyStateText}>
                {t("admin.noUsersFound") || "لم يتم العثور على مستخدمين"}
              </Text>
            </View>
          )}
        </View>

        {totalPages > 1 && (
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[
                styles.paginationButton,
                currentPage === 1 && styles.paginationButtonDisabled,
              ]}
              onPress={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              {renderIcon("ChevronLeft", 20, "#fff")}
            </TouchableOpacity>
            <Text style={styles.pageInfo}>
              {t("admin.page") || "الصفحة"} {currentPage} {t("admin.of") || "من"} {totalPages}
            </Text>
            <TouchableOpacity
              style={[
                styles.paginationButton,
                currentPage === totalPages && styles.paginationButtonDisabled,
              ]}
              onPress={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              {renderIcon("ChevronRight", 20, "#fff")}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {formVisible && (
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 16,
            marginBottom: 170,
            elevation: 4,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
            {isEditingUser
              ? t("admin.editUser") || "تعديل المستخدم"
              : t("admin.addNewUser") || "إضافة مستخدم جديد"}
          </Text>

          <TextInput
            placeholder={t("admin.fullName") || "الاسم الكامل"}
            value={userName}
            onChangeText={(text) => {
              setUserName(text);
              if (text.trim()) setUserNameError("");
            }}
            style={styles.inputField}
          />
          {userNameError ? (
            <Text style={{ color: "red", marginBottom: 10, marginLeft: 10 }}>
              {userNameError}
            </Text>
          ) : null}

          <TextInput
            placeholder={t("admin.email") || "البريد الإلكتروني"}
            value={userEmail}
            keyboardType="email-address"
            onChangeText={(text) => {
              setUserEmail(text);
              if (text.trim() && text.includes("@")) setUserEmailError("");
            }}
            style={styles.inputField}
          />
          {userEmailError ? (
            <Text style={{ color: "red", marginBottom: 10, marginLeft: 10 }}>
              {userEmailError}
            </Text>
          ) : null}

          {!isEditingUser && (
            <TextInput
              placeholder={t("admin.password") || "كلمة المرور"}
              value={userPassword}
              secureTextEntry
              onChangeText={(text) => {
                setUserPassword(text);
                if (text.trim() && text.length >= 6) setUserPasswordError("");
              }}
              style={styles.inputField}
            />
          )}
          {userPasswordError && !isEditingUser ? (
            <Text style={{ color: "red", marginBottom: 10, marginLeft: 10 }}>
              {userPasswordError}
            </Text>
          ) : null}

          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
            {roles.filter((role) => role !== "all").map((role) => (
              <TouchableOpacity
                key={role}
                onPress={() => setUserRole(role)}
                style={{
                  backgroundColor: userRole === role ? "#8d6e63" : "#e5d4c0",
                  paddingVertical: 8,
                  borderRadius: 8,
                  marginRight: 8,
                  marginBottom: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                }}
              >
                <Text style={{ color: userRole === role ? "#fff" : "#4e342e", fontWeight: "bold" }}>
                  {t(`common.roles.${role}`) || role}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
            {branches.map((branch) => (
              <TouchableOpacity
                key={branch}
                onPress={() => setUserBranchId(branch)}
                style={{
                  backgroundColor: userBranchId === branch ? "#8d6e63" : "#e5d4c0",
                  paddingVertical: 8,
                  borderRadius: 8,
                  marginRight: 8,
                  marginBottom: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                }}
              >
                <Text style={{ color: userBranchId === branch ? "#fff" : "#4e342e", fontWeight: "bold" }}>
                  {t(`admin.branch${branch}`) || `فرع ${branch}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ flexDirection: "row", marginVertical: 10 }}>
            <TouchableOpacity
              onPress={() => setUserStatus("active")}
              style={{
                flex: 1,
                padding: 12,
                backgroundColor: userStatus === "active" ? "#4CAF50" : "#ddd",
                alignItems: "center",
                borderTopLeftRadius: isRTL ? 0 : 8,
                borderBottomLeftRadius: isRTL ? 0 : 8,
                borderTopRightRadius: isRTL ? 8 : 0,
                borderBottomRightRadius: isRTL ? 8 : 0,
              }}
            >
              <Text style={{ color: userStatus === "active" ? "#fff" : "#000" }}>
                {t("common.status.active") || "نشط"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setUserStatus("inactive")}
              style={{
                flex: 1,
                padding: 12,
                backgroundColor: userStatus === "inactive" ? "#F44336" : "#ddd",
                alignItems: "center",
                borderTopLeftRadius: isRTL ? 8 : 0,
                borderBottomLeftRadius: isRTL ? 8 : 0,
                borderTopRightRadius: isRTL ? 0 : 8,
                borderBottomRightRadius: isRTL ? 0 : 8,
              }}
            >
              <Text style={{ color: userStatus === "inactive" ? "#fff" : "#000" }}>
                {t("common.status.inactive") || "غير نشط"}
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder={t("admin.joinDate") || "تاريخ الانضمام (YYYY-MM-DD)"}
            value={userJoinDate}
            onChangeText={(text) => setUserJoinDate(text)}
            style={styles.inputField}
          />

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
            <TouchableOpacity
              onPress={handleAddUser}
              style={[styles.addButton, { flex: 1, marginRight: 6 }]}
            >
              <Text style={styles.addButtonText}>{t("common.save") || "حفظ"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setFormVisible(false);
                clearUserForm();
              }}
              style={[styles.addButton, { flex: 1, backgroundColor: "#aaa", marginLeft: 6 }]}
            >
              <Text style={styles.addButtonText}>{t("common.cancel") || "إلغاء"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default UsersScreen;