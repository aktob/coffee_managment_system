// Mock data for supervisor dashboard
export const mockData = {
  // Dashboard data
  dashboard: {
    metrics: {
      totalRevenue: 15420.5,
      totalOrders: 342,
      avgOrderValue: 45.09,
      customerSatisfaction: 4.8,
      growthRate: 12.5,
    },
    recentOrders: [
      {
        id: 1,
        customer: "John Smith",
        amount: 28.5,
        status: "completed",
        time: "2 min ago",
      },
      {
        id: 2,
        customer: "Sarah Johnson",
        amount: 45.2,
        status: "preparing",
        time: "5 min ago",
      },
      {
        id: 3,
        customer: "Mike Wilson",
        amount: 32.1,
        status: "completed",
        time: "8 min ago",
      },
      {
        id: 4,
        customer: "Emily Davis",
        amount: 18.9,
        status: "pending",
        time: "12 min ago",
      },
    ],
    lowStockItems: [
      { id: 1, name: "Arabica Beans", quantity: 5, threshold: 20, unit: "kg" },
      { id: 2, name: "Milk", quantity: 8, threshold: 15, unit: "L" },
      { id: 3, name: "Sugar", quantity: 3, threshold: 10, unit: "kg" },
    ],
    staffOnDuty: [
      { id: 1, name: "John Doe", role: "Barista", status: "active" },
      { id: 2, name: "Jane Smith", role: "Cashier", status: "active" },
      { id: 3, name: "Mike Johnson", role: "Barista", status: "break" },
    ],
    weeklySales: [
      { day: "Mon", sales: 1200 },
      { day: "Tue", sales: 1350 },
      { day: "Wed", sales: 1100 },
      { day: "Thu", sales: 1450 },
      { day: "Fri", sales: 1800 },
      { day: "Sat", sales: 2200 },
      { day: "Sun", sales: 1900 },
    ],
  },

  // Sales report data
  salesReport: {
    timeRanges: [
      { key: "today", label: "Today" },
      { key: "week", label: "This Week" },
      { key: "month", label: "This Month" },
      { key: "quarter", label: "This Quarter" },
      { key: "year", label: "This Year" },
    ],
    // Chart data for different time ranges
    week: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          data: [1200, 1350, 1100, 1450, 1800, 2200, 1900],
          color: (opacity = 1) => `rgba(141, 110, 99, ${opacity})`,
          strokeWidth: 3,
        },
      ],
    },
    month: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        {
          data: [8500, 9200, 8800, 9500],
          color: (opacity = 1) => `rgba(141, 110, 99, ${opacity})`,
          strokeWidth: 3,
        },
      ],
    },
    quarter: {
      labels: ["Jan", "Feb", "Mar"],
      datasets: [
        {
          data: [32000, 35000, 38000],
          color: (opacity = 1) => `rgba(141, 110, 99, ${opacity})`,
          strokeWidth: 3,
        },
      ],
    },
    year: {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      datasets: [
        {
          data: [105000, 115000, 125000, 135000],
          color: (opacity = 1) => `rgba(141, 110, 99, ${opacity})`,
          strokeWidth: 3,
        },
      ],
    },
    popularProducts: [
      { id: 1, name: "Espresso", sales: 245, revenue: 1225.0, growth: 15.2 },
      { id: 2, name: "Cappuccino", sales: 198, revenue: 1584.0, growth: 8.7 },
      { id: 3, name: "Latte", sales: 187, revenue: 1683.0, growth: 12.3 },
      { id: 4, name: "Americano", sales: 156, revenue: 936.0, growth: 5.9 },
      { id: 5, name: "Mocha", sales: 134, revenue: 1474.0, growth: 18.1 },
    ],
    salesByCategory: [
      { category: "Hot Coffee", sales: 45, revenue: 3240.0 },
      { category: "Cold Drinks", sales: 32, revenue: 2560.0 },
      { category: "Pastries", sales: 28, revenue: 1120.0 },
      { category: "Snacks", sales: 15, revenue: 600.0 },
    ],
    hourlySales: [
      { hour: "6AM", sales: 120 },
      { hour: "8AM", sales: 280 },
      { hour: "10AM", sales: 320 },
      { hour: "12PM", sales: 450 },
      { hour: "2PM", sales: 380 },
      { hour: "4PM", sales: 420 },
      { hour: "6PM", sales: 350 },
      { hour: "8PM", sales: 280 },
    ],
  },

  // Inventory data
  inventory: {
    items: [
      {
        id: 1,
        name: "Arabica Coffee Beans",
        quantity: 25,
        threshold: 20,
        unit: "kg",
        price: 45.0,
        status: "good",
        lastUpdated: "2024-01-20",
        barcode: "1234567890123",
        category: "Coffee",
        supplier: "Coffee Supplier Co.",
        expiryDate: "2024-06-15",
        trend: "up",
      },
      {
        id: 2,
        name: "Robusta Coffee Beans",
        quantity: 15,
        threshold: 20,
        unit: "kg",
        price: 35.0,
        status: "low",
        lastUpdated: "2024-01-19",
        barcode: "1234567890124",
        category: "Coffee",
        supplier: "Coffee Supplier Co.",
        expiryDate: "2024-05-20",
        trend: "down",
      },
      {
        id: 3,
        name: "Fresh Milk",
        quantity: 12,
        threshold: 15,
        unit: "L",
        price: 8.5,
        status: "low",
        lastUpdated: "2024-01-20",
        barcode: "1234567890125",
        category: "Dairy",
        supplier: "Dairy Farm Ltd.",
        expiryDate: "2024-01-25",
        trend: "down",
      },
      {
        id: 4,
        name: "Sugar",
        quantity: 8,
        threshold: 10,
        unit: "kg",
        price: 12.0,
        status: "low",
        lastUpdated: "2024-01-18",
        barcode: "1234567890126",
        category: "Sweeteners",
        supplier: "Sugar Corp.",
        expiryDate: "2024-12-31",
        trend: "down",
      },
      {
        id: 5,
        name: "Vanilla Syrup",
        quantity: 5,
        threshold: 8,
        unit: "L",
        price: 25.0,
        status: "low",
        lastUpdated: "2024-01-17",
        barcode: "1234567890127",
        category: "Syrups",
        supplier: "Flavor Co.",
        expiryDate: "2024-08-15",
        trend: "down",
      },
      {
        id: 6,
        name: "Chocolate Powder",
        quantity: 18,
        threshold: 15,
        unit: "kg",
        price: 30.0,
        status: "good",
        lastUpdated: "2024-01-20",
        barcode: "1234567890128",
        category: "Ingredients",
        supplier: "Chocolate Ltd.",
        expiryDate: "2024-10-20",
        trend: "up",
      },
      {
        id: 7,
        name: "Paper Cups (Large)",
        quantity: 500,
        threshold: 200,
        unit: "pcs",
        price: 0.15,
        status: "good",
        lastUpdated: "2024-01-20",
        barcode: "1234567890129",
        category: "Packaging",
        supplier: "Packaging Inc.",
        expiryDate: "2025-12-31",
        trend: "up",
      },
      {
        id: 8,
        name: "Paper Cups (Medium)",
        quantity: 150,
        threshold: 200,
        unit: "pcs",
        price: 0.12,
        status: "low",
        lastUpdated: "2024-01-19",
        barcode: "1234567890130",
        category: "Packaging",
        supplier: "Packaging Inc.",
        expiryDate: "2025-12-31",
        trend: "down",
      },
    ],
    categories: [
      { key: "all", label: "All Items" },
      { key: "coffee", label: "Coffee" },
      { key: "dairy", label: "Dairy" },
      { key: "sweeteners", label: "Sweeteners" },
      { key: "syrups", label: "Syrups" },
      { key: "ingredients", label: "Ingredients" },
      { key: "packaging", label: "Packaging" },
    ],
    history: [
      {
        id: 1,
        itemId: 1,
        type: "restock",
        quantity: 50,
        oldQuantity: 25,
        newQuantity: 75,
        timestamp: "2024-01-20T10:30:00Z",
        user: "John Doe",
        note: "Regular restock",
      },
      {
        id: 2,
        itemId: 2,
        type: "usage",
        quantity: -10,
        oldQuantity: 25,
        newQuantity: 15,
        timestamp: "2024-01-19T15:45:00Z",
        user: "System",
        note: "Automatic deduction from sales",
      },
      {
        id: 3,
        itemId: 3,
        type: "adjustment",
        quantity: -3,
        oldQuantity: 15,
        newQuantity: 12,
        timestamp: "2024-01-19T09:15:00Z",
        user: "Jane Smith",
        note: "Inventory count adjustment",
      },
    ],
  },

  // Staff schedule data
  staffSchedule: {
    staff: [
      {
        id: 1,
        name: "John Doe",
        role: "Barista",
        avatar: "JD",
        status: "active",
      },
      {
        id: 2,
        name: "Jane Smith",
        role: "Cashier",
        avatar: "JS",
        status: "active",
      },
      {
        id: 3,
        name: "Mike Johnson",
        role: "Barista",
        avatar: "MJ",
        status: "active",
      },
      {
        id: 4,
        name: "Sarah Wilson",
        role: "Server",
        avatar: "SW",
        status: "active",
      },
      {
        id: 5,
        name: "Tom Brown",
        role: "Barista",
        avatar: "TB",
        status: "active",
      },
      {
        id: 6,
        name: "Emily Davis",
        role: "Cashier",
        avatar: "ED",
        status: "active",
      },
      {
        id: 7,
        name: "Alex Turner",
        role: "Server",
        avatar: "AT",
        status: "active",
      },
      {
        id: 8,
        name: "Lisa Garcia",
        role: "Cashier",
        avatar: "LG",
        status: "active",
      },
      {
        id: 9,
        name: "David Lee",
        role: "Server",
        avatar: "DL",
        status: "active",
      },
    ],
    schedule: {
      monday: {
        morning: [
          {
            id: 1,
            name: "John Doe",
            role: "Barista",
            status: "confirmed",
            avatar: "JD",
          },
          {
            id: 2,
            name: "Jane Smith",
            role: "Cashier",
            status: "confirmed",
            avatar: "JS",
          },
        ],
        afternoon: [
          {
            id: 3,
            name: "Mike Johnson",
            role: "Barista",
            status: "pending",
            avatar: "MJ",
          },
          {
            id: 4,
            name: "Sarah Wilson",
            role: "Server",
            status: "confirmed",
            avatar: "SW",
          },
        ],
        evening: [
          {
            id: 5,
            name: "Tom Brown",
            role: "Barista",
            status: "confirmed",
            avatar: "TB",
          },
          {
            id: 6,
            name: "Emily Davis",
            role: "Cashier",
            status: "confirmed",
            avatar: "ED",
          },
        ],
      },
      tuesday: {
        morning: [
          {
            id: 1,
            name: "John Doe",
            role: "Barista",
            status: "confirmed",
            avatar: "JD",
          },
          {
            id: 7,
            name: "Alex Turner",
            role: "Server",
            status: "confirmed",
            avatar: "AT",
          },
        ],
        afternoon: [
          {
            id: 3,
            name: "Mike Johnson",
            role: "Barista",
            status: "confirmed",
            avatar: "MJ",
          },
          {
            id: 8,
            name: "Lisa Garcia",
            role: "Cashier",
            status: "confirmed",
            avatar: "LG",
          },
        ],
        evening: [
          {
            id: 5,
            name: "Tom Brown",
            role: "Barista",
            status: "confirmed",
            avatar: "TB",
          },
          {
            id: 9,
            name: "David Lee",
            role: "Server",
            status: "confirmed",
            avatar: "DL",
          },
        ],
      },
      wednesday: {
        morning: [
          {
            id: 2,
            name: "Jane Smith",
            role: "Cashier",
            status: "confirmed",
            avatar: "JS",
          },
          {
            id: 7,
            name: "Alex Turner",
            role: "Server",
            status: "confirmed",
            avatar: "AT",
          },
        ],
        afternoon: [
          {
            id: 4,
            name: "Sarah Wilson",
            role: "Server",
            status: "confirmed",
            avatar: "SW",
          },
          {
            id: 8,
            name: "Lisa Garcia",
            role: "Cashier",
            status: "confirmed",
            avatar: "LG",
          },
        ],
        evening: [
          {
            id: 6,
            name: "Emily Davis",
            role: "Cashier",
            status: "confirmed",
            avatar: "ED",
          },
          {
            id: 9,
            name: "David Lee",
            role: "Server",
            status: "confirmed",
            avatar: "DL",
          },
        ],
      },
      thursday: {
        morning: [
          {
            id: 1,
            name: "John Doe",
            role: "Barista",
            status: "confirmed",
            avatar: "JD",
          },
          {
            id: 2,
            name: "Jane Smith",
            role: "Cashier",
            status: "confirmed",
            avatar: "JS",
          },
        ],
        afternoon: [
          {
            id: 3,
            name: "Mike Johnson",
            role: "Barista",
            status: "confirmed",
            avatar: "MJ",
          },
          {
            id: 4,
            name: "Sarah Wilson",
            role: "Server",
            status: "confirmed",
            avatar: "SW",
          },
        ],
        evening: [
          {
            id: 5,
            name: "Tom Brown",
            role: "Barista",
            status: "confirmed",
            avatar: "TB",
          },
          {
            id: 6,
            name: "Emily Davis",
            role: "Cashier",
            status: "confirmed",
            avatar: "ED",
          },
        ],
      },
      friday: {
        morning: [
          {
            id: 1,
            name: "John Doe",
            role: "Barista",
            status: "confirmed",
            avatar: "JD",
          },
          {
            id: 7,
            name: "Alex Turner",
            role: "Server",
            status: "confirmed",
            avatar: "AT",
          },
        ],
        afternoon: [
          {
            id: 3,
            name: "Mike Johnson",
            role: "Barista",
            status: "confirmed",
            avatar: "MJ",
          },
          {
            id: 8,
            name: "Lisa Garcia",
            role: "Cashier",
            status: "confirmed",
            avatar: "LG",
          },
        ],
        evening: [
          {
            id: 5,
            name: "Tom Brown",
            role: "Barista",
            status: "confirmed",
            avatar: "TB",
          },
          {
            id: 9,
            name: "David Lee",
            role: "Server",
            status: "confirmed",
            avatar: "DL",
          },
        ],
      },
      saturday: {
        morning: [
          {
            id: 2,
            name: "Jane Smith",
            role: "Cashier",
            status: "confirmed",
            avatar: "JS",
          },
          {
            id: 7,
            name: "Alex Turner",
            role: "Server",
            status: "confirmed",
            avatar: "AT",
          },
        ],
        afternoon: [
          {
            id: 4,
            name: "Sarah Wilson",
            role: "Server",
            status: "confirmed",
            avatar: "SW",
          },
          {
            id: 8,
            name: "Lisa Garcia",
            role: "Cashier",
            status: "confirmed",
            avatar: "LG",
          },
        ],
        evening: [
          {
            id: 6,
            name: "Emily Davis",
            role: "Cashier",
            status: "confirmed",
            avatar: "ED",
          },
          {
            id: 9,
            name: "David Lee",
            role: "Server",
            status: "confirmed",
            avatar: "DL",
          },
        ],
      },
      sunday: {
        morning: [
          {
            id: 1,
            name: "John Doe",
            role: "Barista",
            status: "confirmed",
            avatar: "JD",
          },
          {
            id: 2,
            name: "Jane Smith",
            role: "Cashier",
            status: "confirmed",
            avatar: "JS",
          },
        ],
        afternoon: [
          {
            id: 3,
            name: "Mike Johnson",
            role: "Barista",
            status: "confirmed",
            avatar: "MJ",
          },
          {
            id: 4,
            name: "Sarah Wilson",
            role: "Server",
            status: "confirmed",
            avatar: "SW",
          },
        ],
        evening: [
          {
            id: 5,
            name: "Tom Brown",
            role: "Barista",
            status: "confirmed",
            avatar: "TB",
          },
          {
            id: 6,
            name: "Emily Davis",
            role: "Cashier",
            status: "confirmed",
            avatar: "ED",
          },
        ],
      },
    },
    timeOffRequests: [
      {
        id: 1,
        staffId: 1,
        staffName: "John Doe",
        startDate: "2024-01-25",
        endDate: "2024-01-27",
        reason: "Family vacation",
        status: "pending",
      },
      {
        id: 2,
        staffId: 4,
        staffName: "Sarah Wilson",
        startDate: "2024-01-30",
        endDate: "2024-01-30",
        reason: "Medical appointment",
        status: "approved",
      },
    ],
  },

  // Notifications data
  notifications: [
    {
      id: 1,
      type: "alert",
      title: "Low Inventory Alert",
      message: "Arabica beans stock is below threshold",
      timestamp: "2024-01-20T10:30:00Z",
      read: false,
      priority: "high",
    },
    {
      id: 2,
      type: "staff",
      title: "Staff Schedule Update",
      message: "John Doe requested time off for next week",
      timestamp: "2024-01-20T09:15:00Z",
      read: true,
      priority: "medium",
    },
    {
      id: 3,
      type: "system",
      title: "System Maintenance",
      message: "System update scheduled for tonight at 12 AM",
      timestamp: "2024-01-19T18:45:00Z",
      read: false,
      priority: "low",
    },
    {
      id: 4,
      type: "alert",
      title: "Peak Hours Alert",
      message: "Approaching peak hours, ensure adequate staffing",
      timestamp: "2024-01-19T14:20:00Z",
      read: true,
      priority: "high",
    },
    {
      id: 5,
      type: "staff",
      title: "Time Off Request",
      message: "Sarah Wilson requested time off for next Friday",
      timestamp: "2024-01-19T11:30:00Z",
      read: false,
      priority: "medium",
    },
    {
      id: 6,
      type: "alert",
      title: "Low Stock Warning",
      message: "Milk quantity is running low",
      timestamp: "2024-01-19T08:15:00Z",
      read: false,
      priority: "medium",
    },
    {
      id: 7,
      type: "system",
      title: "Backup Complete",
      message: "Daily backup completed successfully",
      timestamp: "2024-01-18T23:00:00Z",
      read: true,
      priority: "low",
    },
    {
      id: 8,
      type: "staff",
      title: "Shift Swap Request",
      message: "Mike Johnson wants to swap shifts with Tom Brown",
      timestamp: "2024-01-18T16:30:00Z",
      read: false,
      priority: "medium",
    },
  ],
};

// Helper functions for mock data
export const getInventoryItems = () => mockData.inventory.items;

export const getInventoryHistory = (itemId) =>
  mockData.inventory.history.filter((h) => h.itemId === itemId);

export const getNotifications = () => mockData.notifications;

export const getStaffSchedule = (day) =>
  mockData.staffSchedule.schedule[day] || {};

export const getDashboardMetrics = () => mockData.dashboard.metrics;

export const getSalesData = () => mockData.salesReport;

export const getTimeOffRequests = () => mockData.staffSchedule.timeOffRequests;

export const getStaffList = () => mockData.staffSchedule.staff;
