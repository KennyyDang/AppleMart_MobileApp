import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
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
  ScrollView,
} from "react-native";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { MagnifyingGlass, X, CaretDown } from "phosphor-react-native";
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

const ORDER_STATUS_TRANSITIONS = {
  Pending: ["Processing"],
  Processing: ["Shipped"],
  Delivered: ["Completed"],
  RefundRequested: ["Refunded"],
};

const OrderScreen = () => {
  const navigation = useNavigation<OrderNavigationProp>();
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [shipperID, setShipperID] = useState("");
  const [nextPossibleStatus, setNextPossibleStatus] = useState<string[]>([]);
  const [selectedNewStatus, setSelectedNewStatus] = useState<string | null>(
    null
  );
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const ORDER_STATUSES = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Completed",
    "Refunded",
    "RefundRequested",
    "Cancelled",
  ];

  const { handleScroll } = useTabBar();

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (statusFilter) {
      result = result.filter((order) => order.orderStatus === statusFilter);
    }

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter((order) => {
        const orderIdMatch = order.orderID
          .toString()
          .toLowerCase()
          .includes(query);
        const statusMatch = order.orderStatus.toLowerCase().includes(query);

        return orderIdMatch || statusMatch;
      });
    }

    result.sort((a, b) => {
      const dateA = new Date(a.orderDate).getTime();
      const dateB = new Date(b.orderDate).getTime();

      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [orders, statusFilter, searchQuery, sortOrder]);

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      const currentStatus = selectedOrder.orderStatus;
      const possibleStatuses =
        ORDER_STATUS_TRANSITIONS[
          currentStatus as keyof typeof ORDER_STATUS_TRANSITIONS
        ] || [];
      setNextPossibleStatus(possibleStatuses);
      setSelectedNewStatus(null);
    }
  }, [selectedOrder]);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await orderApiService.getOrders();

      const validOrders = data.filter(
        (order) =>
          order &&
          typeof order === "object" &&
          typeof order.orderID === "number" &&
          typeof order.orderStatus === "string"
      );

      if (validOrders.length === 0) {
        setError("No valid orders found");
      }

      setOrders(validOrders);
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        // Kiểm tra nếu không phải đang ở modal
        if (!statusModalVisible) {
          Keyboard.dismiss();
        }
      }
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, [statusModalVisible]);

  const renderFilterSection = () => (
    <View style={styles.filterContainer}>
      {/* Filter theo ngày */}
      <View style={styles.filterGroup}>
        <Text style={styles.filterLabel}>Sort:</Text>
        <TouchableOpacity
          style={[
            styles.filterButton,
            sortOrder === "newest" && styles.filterButtonActive,
          ]}
          onPress={() => setSortOrder("newest")}
        >
          <Text style={styles.filterButtonText}>Newest</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            sortOrder === "oldest" && styles.filterButtonActive,
          ]}
          onPress={() => setSortOrder("oldest")}
        >
          <Text style={styles.filterButtonText}>Oldest</Text>
        </TouchableOpacity>
      </View>

      {/* Filter theo status */}
      <View style={styles.filterGroup}>
        <Text style={styles.filterLabel}>Status:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statusFilterScrollView}
        >
          <TouchableOpacity
            style={[
              styles.filterButton,
              statusFilter === null && styles.filterButtonActive,
            ]}
            onPress={() => setStatusFilter(null)}
          >
            <Text style={styles.filterButtonText}>All</Text>
          </TouchableOpacity>
          {ORDER_STATUSES.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                statusFilter === status && styles.filterButtonActive,
              ]}
              onPress={() => setStatusFilter(status)}
            >
              <Text style={styles.filterButtonText}>{status}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  const handleUpdateOrderStatus = async () => {
    if (!selectedOrder || !selectedNewStatus) {
      Alert.alert("Error", "Please select a new status");
      return;
    }

    try {
      // Determine the appropriate API call based on current and new status
      let updatedOrder;
      switch (selectedOrder.orderStatus) {
        case "Pending":
          // /api/Admin/${orderId}/status?NewStatus=Processing
          updatedOrder = await orderApiService.updateOrderStatus(
            selectedOrder.orderID,
            "Processing"
          );
          break;

        case "Processing":
          // /api/Admin/${orderId}/status?NewStatus=Shipped&ShipperId=54448292-adeb-44a8-9a97-8d94987b23ac
          if (!shipperID) {
            Alert.alert("Error", "Shipper ID is required");
            return;
          }
          updatedOrder = await orderApiService.updateOrderStatus(
            selectedOrder.orderID,
            "Shipped",
            shipperID
          );
          break;

        case "Delivered":
          // /api/Admin/${orderId}/status?NewStatus=Completed
          updatedOrder = await orderApiService.updateOrderStatus(
            selectedOrder.orderID,
            "Completed"
          );
          break;

        case "RefundRequested":
          // /api/Admin/${orderId}/status?NewStatus=Refunded
          updatedOrder = await orderApiService.updateOrderStatus(
            selectedOrder.orderID,
            "Refunded"
          );
          break;

        default:
          throw new Error("Invalid status transition");
      }

      const updatedOrders = orders.map((order) =>
        order.orderID === selectedOrder.orderID ? updatedOrder : order
      );
      setOrders(updatedOrders);

      // Reset state
      setStatusModalVisible(false);
      setSelectedOrder(null);
      setShipperID("");
      setSelectedNewStatus(null);
      await fetchOrders();
    } catch (err) {
      console.error("Status update error:", err);
      Alert.alert(
        "Update Failed",
        err instanceof Error
          ? err.message
          : "Unable to update order status. Please try again."
      );
    }
  };

  const openStatusModal = (order: Order) => {
    setSelectedOrder(order);
    setStatusModalVisible(true);

    // Reset shipper ID if moving from Processing to Shipped
    setShipperID(
      order.orderStatus === "Processing" ? "" : order.shipperID || ""
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  const [isStatusDropdownVisible, setIsStatusDropdownVisible] = useState(false);

  const renderStatusDropdown = () => (
    <View style={styles.statusDropdownContainer}>
      {nextPossibleStatus.map((status) => (
        <TouchableOpacity
          key={status}
          style={[
            styles.statusDropdownItem,
            selectedNewStatus === status && styles.statusDropdownItemSelected,
          ]}
          onPress={() => {
            setSelectedNewStatus(status);
            setIsStatusDropdownVisible(false);
          }}
        >
          <Text style={styles.statusDropdownItemText}>{status}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <MagnifyingGlass size={20} color="#666" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search by Order ID or Status"
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={handleSearchChange}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity
          style={styles.clearSearchButton}
          onPress={() => {
            setSearchQuery("");
          }}
        >
          <X size={16} color="#666" />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderStatusUpdateModal = () => (
    <Modal
      transparent={true}
      visible={statusModalVisible}
      onRequestClose={() => setStatusModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Update Order Status</Text>
            <TouchableOpacity onPress={() => setStatusModalVisible(false)}>
              <X size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Add order details to make it clear which order is being updated */}
          {selectedOrder && (
            <View style={styles.orderUpdateDetails}>
              <Text style={styles.orderUpdateDetailsText}>
                Updating Order #{selectedOrder.orderID}
              </Text>
              <Text style={styles.orderUpdateDetailsSubtext}>
                Current Status: {selectedOrder.orderStatus}
              </Text>
            </View>
          )}

          {/* Rest of the modal content remains the same */}
          {/* Status Selection Dropdown */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>New Status</Text>
            <TouchableOpacity
              style={styles.statusPickerButton}
              onPress={() =>
                setIsStatusDropdownVisible(!isStatusDropdownVisible)
              }
            >
              <Text style={styles.statusPickerButtonText}>
                {selectedNewStatus || "Select Status"}
              </Text>
              <CaretDown size={20} color="#666" />
            </TouchableOpacity>
            {isStatusDropdownVisible && renderStatusDropdown()}
          </View>

          {/* Dynamically show Shipper ID input only for Processing to Shipped */}
          {selectedOrder?.orderStatus === "Processing" && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>Shipper ID</Text>
              <TextInput
                style={styles.input}
                value={shipperID}
                onChangeText={setShipperID}
                placeholder="Enter Shipper ID"
                keyboardType="default"
              />
            </View>
          )}

          <View style={styles.formButtonContainer}>
            <TouchableOpacity
              style={[styles.formButton, styles.cancelButton]}
              onPress={() => {
                setStatusModalVisible(false);
                setSelectedNewStatus(null);
                setIsStatusDropdownVisible(false);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.formButton,
                styles.saveButton,
                !selectedNewStatus && styles.disabledButton,
              ]}
              onPress={handleUpdateOrderStatus}
              disabled={!selectedNewStatus}
            >
              <Text style={styles.saveButtonText}>Update Status</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order</Text>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </>
  );

  return (
    <View
      style={styles.container}
      onStartShouldSetResponder={() => {
        Keyboard.dismiss();
        return false;
      }}
    >
      {isLoading && !filteredOrders.length ? (
        <>
          {renderHeader()}
          <ActivityIndicator size="large" color="#000" style={styles.loader} />
        </>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item, index) => {
            if (item && typeof item.orderID === "number") {
              return item.orderID.toString();
            }
            return `order-${index}`;
          }}
          renderItem={({ item }) => {
            // Add multiple layers of defensive checks
            if (!item) {
              console.warn("Received undefined or null item in renderItem");
              return null;
            }

            // Explicitly check for orderID, ensuring it's a number
            if (typeof item.orderID !== "number") {
              return null;
            }

            const getStatusStyle = (status: string) => {
              switch (status) {
                case "Completed":
                  return styles.statusCompleted;
                case "Pending":
                  return styles.statusPending;
                case "Cancelled":
                  return styles.statusCancelled;
                case "Processing":
                  return styles.statusProcessing;
                case "Shipped":
                  return styles.statusShipped;
                case "Delivered":
                  return styles.statusDelivered;
                case "RefundRequested":
                  return styles.statusRefundRequested;
                case "Refunded":
                  return styles.statusRefunded;
                default:
                  return styles.statusProcessing;
              }
            };

            return (
              <TouchableOpacity
                key={`order-${item.orderID}`}
                style={styles.orderCard}
                onPress={() => {
                  // Extra safety check before navigation
                  if (item && item.orderID) {
                    navigation.navigate("OrderDetail", {
                      orderId: item.orderID,
                    });
                  }
                }}
              >
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>
                    Order #{item.orderID?.toString() ?? "N/A"}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.statusBadge,
                      getStatusStyle(item.orderStatus ?? "Unknown"),
                    ]}
                    onPress={() => {
                      // Extra safety checks
                      if (
                        item?.orderStatus &&
                        Object.keys(ORDER_STATUS_TRANSITIONS).includes(
                          item.orderStatus
                        )
                      ) {
                        openStatusModal(item);
                      }
                    }}
                  >
                    <Text style={styles.statusText}>
                      {item.orderStatus ?? "Unknown Status"}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.orderDate}>
                  {item.orderDate
                    ? formatDate(item.orderDate)
                    : "Date Unavailable"}
                </Text>
                <Text style={styles.orderTotal}>
                  Total: ${item.total?.toFixed(2) ?? "N/A"}
                </Text>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={styles.listContent}
          refreshing={isLoading}
          onRefresh={fetchOrders}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery
                  ? "No orders match your search"
                  : "No orders found"}
              </Text>
            </View>
          }
          ListHeaderComponent={() => (
            <>
              {renderHeader()}
              {renderSearchBar()}
              {renderFilterSection()}
            </>
          )}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
      )}

      {renderStatusUpdateModal()}
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
  cancelButtonText: {
    color: "#333",
    fontWeight: "600",
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#A0A0A0",
  },
  statusDropdownContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    maxHeight: 200,
    zIndex: 1000,
  },
  statusDropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  statusDropdownItemText: {
    fontSize: 16,
    color: "#333",
  },
  statusDropdownItemSelected: {
    backgroundColor: "#E6F2FF",
  },
  formGroup: {
    marginBottom: 15,
    position: "relative",
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filterGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  filterLabel: {
    marginRight: 10,
    fontWeight: "bold",
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: "#1E88E5",
  },
  filterButtonText: {
    color: "#333",
    fontSize: 14,
  },
  statusFilterScrollView: {
    alignItems: "center",
  },
  orderUpdateDetails: {
    backgroundColor: "#F0F0F0",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: "center",
  },
  orderUpdateDetailsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  orderUpdateDetailsSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    marginBottom: 10,
    height: 45,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  clearSearchButton: {
    padding: 5,
  },
});

export default OrderScreen;
