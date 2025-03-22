// screens/order/OrderDetailScreen.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { ArrowLeft } from "phosphor-react-native";
import orderApiService, {
  Order,
  OrderDetail,
} from "../../services/OrderApiService";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useTabBar } from "@/navigation/TabBarContext";

type OrderStackParamList = {
  OrderList: undefined;
  OrderDetail: { orderId: number };
};

type OrderDetailRouteProp = RouteProp<OrderStackParamList, "OrderDetail">;

const OrderDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<OrderDetailRouteProp>();
  const { orderId } = route.params;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { handleScroll } = useTabBar();

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const orderData = await orderApiService.getOrderById(orderId);
      setOrder(orderData);
    } catch (err) {
      setError("Failed to load order details. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  const getStatusBadgeStyle = (status: string) => {
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E88E5" />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchOrderDetails}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Order not found</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      onScroll={handleScroll}
      scrollEventThrottle={16}
      nestedScrollEnabled={true}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order #{order.orderID}</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Order Status */}
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                getStatusBadgeStyle(order.orderStatus),
              ]}
            >
              <Text style={styles.statusText}>{order.orderStatus}</Text>
            </View>
            <Text style={styles.orderDate}>
              Ordered on: {formatDate(order.orderDate)}
            </Text>
          </View>

          {/* Order Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total Amount:</Text>
              <Text style={styles.detailValue}>${order.total.toFixed(2)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Method:</Text>
              <Text style={styles.detailValue}>
                {order.paymentMethod || "Not specified"}
              </Text>
            </View>
            {order.voucherID && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Voucher ID:</Text>
                <Text style={styles.detailValue}>{order.voucherID}</Text>
              </View>
            )}
          </View>

          {/* Shipping Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shipping Information</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Shipping Address:</Text>
              <Text style={styles.detailValue}>
                {order.address || "Not specified"}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Shipping Method ID:</Text>
              <Text style={styles.detailValue}>{order.shippingMethodID}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Shipper ID:</Text>
              <Text style={styles.detailValue}>
                {order.shipperID || "Not assigned yet"}
              </Text>
            </View>
          </View>

          {/* Customer Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Information</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>User ID:</Text>
              <Text style={styles.detailValue}>{order.userID}</Text>
            </View>
          </View>

          {/* Order Items */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Items</Text>
            {order.orderDetails && order.orderDetails.length > 0 ? (
              order.orderDetails.map((item, index) => (
                <View key={item.orderDetailID || index} style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>Item #{index + 1}</Text>
                    <Text style={styles.itemId}>ID: {item.productItemID}</Text>
                  </View>
                  <View style={styles.itemDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Quantity:</Text>
                      <Text style={styles.detailValue}>{item.quantity}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Price:</Text>
                      <Text style={styles.detailValue}>
                        ${item.price.toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Subtotal:</Text>
                      <Text style={styles.detailValue}>
                        ${(item.quantity * item.price).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noItemsText}>No items found</Text>
            )}
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingTop: 50, // Extra padding for status bar
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 15,
  },
  statusContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 8,
  },
  statusText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
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
  orderDate: {
    fontSize: 14,
    color: "#666",
  },
  section: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    paddingBottom: 5,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    flex: 2,
    textAlign: "right",
  },
  itemCard: {
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#1E88E5",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
  },
  itemId: {
    fontSize: 13,
    color: "#666",
  },
  itemDetails: {
    backgroundColor: "#FFF",
    borderRadius: 6,
    padding: 8,
  },
  noItemsText: {
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    padding: 20,
  },
  errorText: {
    color: "#E53935",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: "#1E88E5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default OrderDetailScreen;
