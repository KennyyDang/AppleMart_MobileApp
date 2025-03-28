import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useTabBar } from "../navigation/TabBarContext";
import ManageApiService from "../services/ManageApiService";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const screenWidth = Dimensions.get("window").width;

interface TopProduct {
  productName: string;
  totalSales: number;
  rank?: number;
}

interface TopCustomer {
  customerName: string;
  totalPurchases: number;
  rank?: number;
  userID?: string;
  totalSpent?: number;
}

const ManageScreen = () => {
  const { handleScroll } = useTabBar();
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [error, setError] = useState(null);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        usersResponse,
        revenueResponse,
        productsResponse,
        topProductsResponse,
        topCustomersResponse,
      ] = await Promise.all([
        ManageApiService.getTotalUsers(),
        ManageApiService.getTotalRevenue(),
        ManageApiService.getTotalProducts(),
        ManageApiService.getTopSellingProducts(),
        ManageApiService.getTopCustomers(),
      ]);

      // Handle users data
      setTotalUsers(extractNumberValue(usersResponse.data));

      // Handle revenue data
      setTotalRevenue(extractNumberValue(revenueResponse.data));

      // Handle products data
      setTotalProducts(extractNumberValue(productsResponse.data));

      // Handle top products data
      if (
        topProductsResponse.data &&
        topProductsResponse.data.topProductItems &&
        topProductsResponse.data.topProductItems.$values
      ) {
        const productsData = topProductsResponse.data.topProductItems.$values;
        const rankedProducts = productsData.map(
          (product: any, index: number) => ({
            productName: product.name,
            totalSales: product.totalSold || 0,
            rank: index + 1,
          })
        );
        setTopProducts(rankedProducts);
      }
      if (
        topCustomersResponse.data &&
        topCustomersResponse.data.topCustomers &&
        topCustomersResponse.data.topCustomers.$values
      ) {
        const customersData = topCustomersResponse.data.topCustomers.$values;

        const rankedCustomers = customersData.map(
          (customer: any, index: number) => ({
            customerName: customer.customerName || customer.userID,
            totalPurchases: customer.totalPurchases || 0,
            userID: customer.userID,
            totalSpent: customer.totalSpent ?? 0, // Use nullish coalescing to provide a default of 0
            rank: index + 1,
          })
        );

        setTopCustomers(rankedCustomers);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setLoading(false);
    }
  };

  const extractNumberValue = (data: any): number => {
    if (data === null || data === undefined) {
      return 0;
    }

    // If it's already a number, return it
    if (typeof data === "number") {
      return data;
    }

    // If it's a string that can be converted to a number
    if (typeof data === "string" && !isNaN(Number(data))) {
      return Number(data);
    }
    <View style={styles.topProductsContainer}>
      <Text style={styles.topProductsTitle}>Top Selling Products</Text>
      {topProducts.length > 0 ? (
        topProducts.map((product) => (
          <View key={product.productName} style={styles.topProductItem}>
            <View style={styles.topProductRankContainer}>
              <Text style={styles.topProductRank}>#{product.rank}</Text>
            </View>
            <View style={styles.topProductDetails}>
              <Text style={styles.topProductName} numberOfLines={1}>
                {product.productName}
              </Text>
              <Text style={styles.topProductSales}>
                ${product.totalSales.toFixed(2)} Sales
              </Text>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noProductsText}>No top selling products found</Text>
      )}
    </View>;

    // If it's an object
    if (typeof data === "object") {
      // Check for common properties
      if ("total" in data) {
        return extractNumberValue(data.total);
      }
      if ("totalRevenue" in data) {
        return extractNumberValue(data.totalRevenue);
      }
      if ("totalUsers" in data) {
        return extractNumberValue(data.totalUsers);
      }
      if ("count" in data) {
        return extractNumberValue(data.count);
      }
      if ("value" in data) {
        return extractNumberValue(data.value);
      }

      // Extract the first numeric value from the object
      for (const key in data) {
        const val = data[key];
        if (typeof val === "number") {
          return val;
        }
        if (typeof val === "string" && !isNaN(Number(val))) {
          return Number(val);
        }
      }
    }

    // Default fallback
    return 0;
  };

  const chartData = [
    {
      name: "Users",
      population: totalUsers,
      color: "#FF6384",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Revenue",
      population: totalRevenue,
      color: "#36A2EB",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Products",
      population: totalProducts,
      color: "#FFCE56",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];

  return (
    <ScrollView
      onScroll={handleScroll}
      scrollEventThrottle={16}
      nestedScrollEnabled={true}
      style={styles.scrollView}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Manage</Text>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.loader}
          />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>
            <View style={styles.metricsContainer}>
              {/* Revenue Card */}
              <View style={[styles.metricCard, { backgroundColor: "#E8FFF1" }]}>
                <View
                  style={[styles.iconContainer, { backgroundColor: "#17B978" }]}
                >
                  <Icon name="wallet" size={24} color="white" />
                </View>
                <View style={styles.metricTextContainer}>
                  <Text style={styles.metricTitle}>TOTAL REVENUE</Text>
                  <View style={styles.metricValueContainer}>
                    <Text style={styles.metricValue}>
                      ${totalRevenue.toFixed(2)}
                    </Text>
                    <Icon name="arrow-up" size={16} color="#17B978" />
                  </View>
                </View>
              </View>

              {/* Users Card */}
              <View style={[styles.metricCard, { backgroundColor: "#FFE9F2" }]}>
                <View
                  style={[styles.iconContainer, { backgroundColor: "#E83E8C" }]}
                >
                  <Icon name="account-group" size={24} color="white" />
                </View>
                <View style={styles.metricTextContainer}>
                  <Text style={styles.metricTitle}>TOTAL USERS</Text>
                  <View style={styles.metricValueContainer}>
                    <Text style={styles.metricValue}>{totalUsers}</Text>
                    <Icon name="arrow-right" size={16} color="#E83E8C" />
                  </View>
                </View>
              </View>

              {/* Products Card */}
              <View style={[styles.metricCard, { backgroundColor: "#F0F2FF" }]}>
                <View
                  style={[styles.iconContainer, { backgroundColor: "#4A68FF" }]}
                >
                  <Icon name="package-variant" size={24} color="white" />
                </View>
                <View style={styles.metricTextContainer}>
                  <Text style={styles.metricTitle}>TOTAL PRODUCTS</Text>
                  <Text style={styles.metricValue}>{totalProducts}</Text>
                </View>
              </View>
            </View>

            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Distribution</Text>
              <PieChart
                data={chartData}
                width={screenWidth - 40}
                height={220}
                chartConfig={{
                  backgroundColor: "#ffffff",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                absolute
              />
            </View>

            {/* Top Selling Products Ranking */}
            <View style={styles.topProductsContainer}>
              <Text style={styles.topProductsTitle}>Top Selling Products</Text>
              {topProducts.map((product) => (
                <View key={product.productName} style={styles.topProductItem}>
                  <View style={styles.topProductRankContainer}>
                    <Text style={styles.topProductRank}>#{product.rank}</Text>
                  </View>
                  <View style={styles.topProductDetails}>
                    <Text style={styles.topProductName} numberOfLines={1}>
                      {product.productName}
                    </Text>
                    <Text style={styles.topProductSales}>
                      ${product.totalSales.toFixed(2)} Sales
                    </Text>
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.topCustomersContainer}>
              <Text style={styles.topCustomersTitle}>Top Customers</Text>
              {topCustomers.length > 0 ? (
                topCustomers.map((customer) => (
                  <View
                    key={customer.userID} // Use userID as key instead of customerName
                    style={styles.topCustomerItem}
                  >
                    <View style={styles.topCustomerRankContainer}>
                      <Text style={styles.topCustomerRank}>
                        #{customer.rank}
                      </Text>
                    </View>
                    <View style={styles.topCustomerDetails}>
                      <Text style={styles.topCustomerName} numberOfLines={1}>
                        {customer.userID}{" "}
                        {/* Display userID if no name is available */}
                      </Text>
                      <Text style={styles.topCustomerPurchases}>
                        ${(customer.totalSpent ?? 0).toFixed(2)} Total
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.noDataText}>
                  No top customers found for this month
                </Text>
              )}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  loader: {
    marginVertical: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 20,
  },
  metricsContainer: {
    marginBottom: 20,
  },
  metricCard: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  metricTextContainer: {
    flex: 1,
  },
  metricTitle: {
    fontSize: 14,
    color: "#777",
    marginBottom: 4,
  },
  metricValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  metricValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginRight: 8,
  },
  chartContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 20,
    marginBottom: 10,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  productDetailsContainer: {
    marginTop: 16,
  },
  productDetailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  productName: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#17B978",
  },
  topProductsContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  topProductsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  topProductItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  topProductRankContainer: {
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  topProductRank: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
  },
  topProductDetails: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topProductName: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
  topProductSales: {
    fontSize: 14,
    color: "#17B978",
    fontWeight: "bold",
  },
  noProductsText: {
    textAlign: "center",
    color: "#777",
    marginVertical: 10,
  },
  topCustomersContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  topCustomersTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  topCustomerItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  topCustomerRankContainer: {
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  topCustomerRank: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
  },
  topCustomerDetails: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topCustomerName: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
  topCustomerPurchases: {
    fontSize: 14,
    color: "#17B978",
    fontWeight: "bold",
  },
  noDataText: {
    textAlign: "center",
    color: "#777",
    marginVertical: 10,
  },
});

export default ManageScreen;
