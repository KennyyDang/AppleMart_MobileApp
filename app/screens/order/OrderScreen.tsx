import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";
import {
  MagnifyingGlass,
  Plus,
  Pencil,
  Trash,
  X,
  CaretDown,
} from "phosphor-react-native";
import orderApiService, { Order } from "../../services/OrderApiService";
import axios from "axios";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTabBar } from "@/navigation/TabBarContext";

type OrderStackParamList = {
  OrderList: undefined;
  OrderDetail: { orderId: number };
};

type OrderNavigationProp = StackNavigationProp<
  OrderStackParamList,
  "OrderList"
>;

const ORDER_STATUS_OPTIONS = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Completed",
  "RefundRequested",
  "Refunded",
  "Cancelled",
];

const OrderScreen = () => {
  const navigation = useNavigation<OrderNavigationProp>();
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [statusPickerVisible, setStatusPickerVisible] = useState(false);
  const [orderFormData, setOrderFormData] = useState<Partial<Order>>({
    userID: "",
    shipperID: "",
    orderDate: new Date().toISOString().split("T")[0],
    address: "",
    paymentMethod: "",
    shippingMethodID: 0,
    total: 0,
    orderStatus: "Pending",
    isDeleted: false,
  });

  const { handleScroll } = useTabBar();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchQuery, orders]);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await orderApiService.getOrders();
      setOrders(data);
      setFilteredOrders(data);
    } catch (err) {
      setError("Failed to fetch orders. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    if (!searchQuery.trim()) {
      setFilteredOrders(orders);
      return;
    }

    const filtered = orders.filter(
      (order) =>
        order.orderID.toString().includes(searchQuery) ||
        order.orderStatus.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  const handleViewOrderDetails = async (orderId: number) => {
    navigation.navigate("OrderDetail", { orderId });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order</Text>
      </View>

      <View style={styles.searchContainer}>
        <MagnifyingGlass size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search orders..."
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </>
  );

  return (
    <View style={styles.container}>
      {isLoading && !filteredOrders.length ? (
        <>
          {renderHeader()}
          <ActivityIndicator size="large" color="#000" style={styles.loader} />
        </>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.orderID.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.orderCard}
              onPress={() => handleViewOrderDetails(item.orderID)}
            >
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Order #{item.orderID}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    item.orderStatus === "Completed"
                      ? styles.statusCompleted
                      : item.orderStatus === "Pending"
                        ? styles.statusPending
                        : item.orderStatus === "Cancelled"
                          ? styles.statusCancelled
                          : item.orderStatus === "Shipped"
                            ? styles.statusShipped
                            : item.orderStatus === "Delivered"
                              ? styles.statusDelivered
                              : item.orderStatus === "RefundRequested"
                                ? styles.statusRefundRequested
                                : item.orderStatus === "Refunded"
                                  ? styles.statusRefunded
                                  : styles.statusProcessing,
                  ]}
                >
                  <Text style={styles.statusText}>{item.orderStatus}</Text>
                </View>
              </View>
              <Text style={styles.orderDate}>
                {formatDate(item.orderDate)}
              </Text>
              <Text style={styles.orderTotal}>
                Total: ${item.total.toFixed(2)}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          refreshing={isLoading}
          onRefresh={fetchOrders}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No orders found</Text>
            </View>
          }
          ListHeaderComponent={renderHeader()}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: "#1a73e8",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginHorizontal: 20,
    marginBottom: 15,
    marginTop: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    color: "#e53935",
    textAlign: "center",
    marginBottom: 10,
    marginHorizontal: 20,
  },
  loader: {
    marginTop: 20,
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 20,
  },
  orderCard: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusCompleted: {
    backgroundColor: "#4CAF50", // Green
  },
  statusPending: {
    backgroundColor: "#FFC107", // Yellow
  },
  statusCancelled: {
    backgroundColor: "#E53935", // Red
  },
  statusProcessing: {
    backgroundColor: "#1E88E5", // Blue
  },
  statusShipped: {
    backgroundColor: "#9C27B0", // Purple
  },
  statusDelivered: {
    backgroundColor: "#00BCD4", // Cyan
  },
  statusRefundRequested: {
    backgroundColor: "#FF9800", // Orange
  },
  statusRefunded: {
    backgroundColor: "#795548", // Brown
  },
  statusText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  actionButtonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 10,
  },
  actionButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  formContainer: {
    maxHeight: 400,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#FFF",
  },
  formButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  formButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#757575",
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: "#1E88E5",
  },
  formButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  // Status picker styles
  statusPickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#FFF",
  },
  statusPickerButtonText: {
    fontSize: 16,
    color: "#333",
  },
  statusPickerContainer: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 5,
    backgroundColor: "#FFF",
    maxHeight: 200,
  },
  statusPickerItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  statusPickerItemText: {
    fontSize: 16,
    color: "#333",
  },
  statusPickerItemSelected: {
    fontWeight: "bold",
    color: "#1E88E5",
  },
});

export default OrderScreen;