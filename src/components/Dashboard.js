import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import MenuImage from "./MenuImage/MenuImage";
import { useAuth } from '../components/AuthContext';
import { BarChart } from 'react-native-chart-kit';
import Constants from 'expo-constants';
import { Dimensions } from 'react-native';
import CustomDrawer from '../components/CustomDrawer';

const Dashboard = ({ navigation }) => {
  const { agentCode, ledCode } = useAuth();
  console.log(ledCode);
  const { customerType } = useAuth();
  const { expoConfig } = Constants;
  const { API_URL } = expoConfig?.extra || {};
  const [recentOrders, setRecentOrders] = useState([]);
  const [jsGoal, setJsGoal] = useState([]);
  const [tkGoal, setTkGoal] = useState([]);
  const [summary, setSummary] = useState([]);
  const [summarytk, setSummarytk] = useState([]);
  const [customerNamesTable, setCustomerNamesTable] = useState([]);
  const [topCustomerTable, setTopCustomerTable] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [rowData, setRowData] = useState({});
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState("0.00");

  const toggleDrawer = () => {
    setDrawerOpen((prevDrawerOpen) => !prevDrawerOpen);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const [dashboardData, setDashboardData] = useState({
    orders: 0,
    sales: "0",
    profit: "0",
    customers: 0,
  });

  const [dashboardData2, setDashboardData2] = useState({
    sales: "0",
  });

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  });

  const [chartData2, setChartData2] = useState({
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleStyle: {
        fontWeight: "bold",
        textAlign: "center",
        alignSelf: "center",
        flex: 1,
      },
      headerLeft: () => (
        <MenuImage onPress={toggleDrawer} />
      ),
      headerRight: () => <View />,
    });
  }, [navigation, toggleDrawer]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_URL}/dashboard/OrderRevenue/JAPAN_ACCESORIES?ledcode=${ledCode}&agentCode=${agentCode}`
        );
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          const labels = data.map(entry => entry.DDate);
          const profitData = data.map(entry => entry.Profit);


          const chartData = {
            labels,
            datasets: [
              {
                data: profitData,
              },
            ],
          };

          setChartData(chartData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [API_URL, agentCode, ledCode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_URL}/dashboard/OrderRevenueJs/JAPAN_ACCESORIES?ledcode=${ledCode}&agentCode=${agentCode}`
        );
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          const labels = data.map(entry => entry.Date);
          const profitData = data.map(entry => entry.Commision);


          const chartData2 = {
            labels,
            datasets: [
              {
                data: profitData,
              },
            ],
          };

          setChartData2(chartData2);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [API_URL, agentCode, ledCode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_URL}/dashboard/getTotal/JAPAN_ACCESORIES?days=30&ledcode=${ledCode}&agentCode=${agentCode}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          const { Orders, Sales, Profit, Customers } = data[0];

          // Adjusting data formatting based on customerType
          setDashboardData({
            orders: Orders,
            sales: ["AGENT", "DEALER"].includes(customerType) ? Sales.toString() : Sales,
            profit: ["AGENT", "DEALER"].includes(customerType) ? Profit.toString() : Profit,
            customers: Customers,
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [API_URL, agentCode, ledCode, customerType]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_URL}/dashboard/getTotalJss/JAPAN_ACCESORIES?days=30&ledcode=${ledCode}&agentCode=${agentCode}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          const { Sales } = data[0];

          // Adjusting data formatting based on customerType
          setDashboardData2({

            sales: Sales.toString()

          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [API_URL, agentCode, ledCode, customerType]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_URL}/dashboard/RecentOrders/JAPAN_ACCESORIES?ledcode=${ledCode}&agentCode=${agentCode}`
        );
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          const recentOrdersData = data.map(entry => ({
            title: entry.Title,
            quantity: entry.Qty.toString(),
            price: entry.Price.toString(),
          }));

          setRecentOrders(recentOrdersData);
        }
      } catch (error) {
        console.error('Error fetching recent orders data:', error);
      }
    };

    fetchData();
  }, [agentCode, ledCode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_URL}/dashboard/categorywisecommission/JAPAN_ACCESORIES?ledcode=${ledCode}&agentCode=${agentCode}`
        );
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          const recentOrdersData = data.map(entry => ({
            Category: entry.Category,
            SalesAmount: parseFloat(entry.SalesAmount).toFixed(2),
            Target: entry.Target.toString(),
            Commission: entry.Commision.toString(),
          }));

          setJsGoal(recentOrdersData);
        }
      } catch (error) {
        console.error('Error fetching recent orders data:', error);
      }
    };

    fetchData();
  }, [agentCode, ledCode]);

  // Calculate total SalesAmount and Commission
  const totalSalesAmount = jsGoal.reduce((total, order) => total + parseFloat(order.SalesAmount), 0);
  const totalCommission = jsGoal.reduce((total, order) => total + parseFloat(order.Commission), 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_URL}/dashboard/categorywisetk/JAPAN_ACCESORIES?ledcode=${ledCode}&agentCode=${agentCode}`
        );
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          const recentOrdersData = data.map(entry => ({
            Category: entry.Category,
            SalesAmount: parseFloat(entry.SalesAmount).toFixed(2),
            Target: entry.Target.toString(),
            Commission: entry.Commision.toString(),
          }));

          setTkGoal(recentOrdersData);
        }
      } catch (error) {
        console.error('Error fetching recent orders data:', error);
      }
    };

    fetchData();
  }, [agentCode, ledCode]);

  // Calculate total SalesAmount and Commission
  const totalSalesAmounttk = tkGoal.reduce((total, order) => total + parseFloat(order.SalesAmount), 0);
  const totalCommissiontk = tkGoal.reduce((total, order) => total + parseFloat(order.Commission), 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_URL}/dashboard/summary/JAPAN_ACCESORIES?ledcode=${ledCode}&agentCode=${agentCode}`
        );
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          const recentOrdersData = data.map(entry => ({
            Name: entry.Name,
            Ledcode: entry.Ledcode.toString(),
            SalesAmount: parseFloat(entry.SaleAmount).toFixed(2),
            Target: entry.Target.toString(),
            Goal: entry.Goal.toString(),
          }));

          setSummary(recentOrdersData);
        }
      } catch (error) {
        console.error('Error fetching SUMMARY data:', error);
      }
    };

    fetchData();
  }, [agentCode, ledCode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_URL}/dashboard/summarytk/JAPAN_ACCESORIES?ledcode=${ledCode}&agentCode=${agentCode}`
        );
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          const recentOrdersData = data.map(entry => ({
            Name: entry.Name,
            Ledcode: entry.Ledcode.toString(),
            SalesAmount: parseFloat(entry.SaleAmount).toFixed(2),
            Target: entry.Target.toString(),
            Goal: entry.Goal.toString(),
          }));

          setSummarytk(recentOrdersData);
        }
      } catch (error) {
        console.error('Error fetching SUMMARY data:', error);
      }
    };

    fetchData();
  }, [agentCode, ledCode]);


  useEffect(() => {
    const fetchCustomerNames = async () => {
      try {
        const response = await fetch(
          `${API_URL}/dashboard/CustomerList/JAPAN_ACCESORIES?days=30&ledcode=${ledCode}&agentCode=${agentCode}`
        );
        const data = await response.json();

        if (Array.isArray(data)) {
          setCustomerNamesTable(data);
        }
      } catch (error) {
        console.error('Error fetching customer names:', error);
      }
    };

    fetchCustomerNames();
  }, [API_URL, agentCode, ledCode]);


  useEffect(() => {
    const fetchTopCustomers = async () => {
      try {
        const response = await fetch(
          `${API_URL}/dashboard/TopCustomers/JAPAN_ACCESORIES?ledcode=${ledCode}&agentCode=${agentCode}`
        );
        const data = await response.json();

        if (Array.isArray(data)) {
          // Set the top customers data from the API response
          setTopCustomerTable(data);
        }
      } catch (error) {
        console.error('Error fetching top customers data:', error);
      }
    };

    fetchTopCustomers();
  }, [API_URL, agentCode, ledCode]);
  const handleRowClick = async (index, order) => {
    if (expandedRow === index) {
      setExpandedRow(null);
      setRowData({});
      return;
    }

    setLoading(true);
    setExpandedRow(index);

    // Fetch data from API
    try {
      const response = await fetch(`${API_URL}/dashboard/categorywisetk/JAPAN_ACCESORIES?ledcode=${encodeURIComponent(order.Ledcode)}`);
      const data = await response.json();
      setRowData(data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleRowClick2 = async (index, order) => {
    if (expandedRow === index) {
      setExpandedRow(null);
      setRowData({});
      return;
    }

    setLoading(true);
    setExpandedRow(index);

    // Fetch data from API
    try {
      const response = await fetch(`${API_URL}/dashboard/categorywisecommission/JAPAN_ACCESORIES?ledcode=${encodeURIComponent(order.Ledcode)}`);
      const data = await response.json();
      setRowData(data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch(
          `http://202.21.37.226:86/api/onlineorder/user/balance/JAPAN_ACCESORIES/${ledCode}`
        );
        const data = await response.json();

        if (data.success) {
          setBalance(data.balance); // This will set "68935.16 Dr" or similar
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    fetchBalance();
  }, [ledCode]); // Add ledCode as dependency


  return (
    <ScrollView style={styles.container}>

      <View style={styles.boxContainer}>
        {/* Orders */}
        <TouchableOpacity style={[styles.box, styles.dynamicWidth]}>
          <Text numberOfLines={1} style={styles.boxTitle}>Orders</Text>
          <Text numberOfLines={1} style={styles.boxValue}>{dashboardData.orders}</Text>
        </TouchableOpacity>

        {/* Customers */}
        {customerType !== "JS_EMPLOYEE" && customerType !== "TK_EMPLOYEE" && (
          <TouchableOpacity style={[styles.box, styles.dynamicWidth]}>
            <Text numberOfLines={1} style={styles.boxTitle}>Customers</Text>
            <Text numberOfLines={1} style={styles.boxValue}>{dashboardData.customers}</Text>
          </TouchableOpacity>
        )}

        {/* Sales */}
        {customerType !== "JS_EMPLOYEE" && customerType !== "JS_MANAGER" && customerType !== "TK_MANAGER" && customerType !== "TK_EMPLOYEE" && (
          <TouchableOpacity style={[styles.box, styles.dynamicWidth]}>
            <Text numberOfLines={1} style={styles.boxTitle}>Sales</Text>
            <Text numberOfLines={1} style={styles.boxValue}>{dashboardData.sales}</Text>
          </TouchableOpacity>
        )}

        {/* Profit */}
        {customerType !== 'DEALER' && customerType !== "JS_EMPLOYEE" && customerType !== "JS_MANAGER" && customerType !== "TK_MANAGER" && customerType !== "TK_EMPLOYEE" && (
          <TouchableOpacity style={[styles.box, styles.dynamicWidth]}>
            <Text numberOfLines={1} style={styles.boxTitle}>Profit</Text>
            <Text numberOfLines={1} style={styles.boxValue}>{dashboardData.profit}</Text>
          </TouchableOpacity>
        )}
        {/* jssales */}
        {customerType !== 'DEALER' && customerType !== "AGENT" && (
          <TouchableOpacity style={[styles.box, styles.dynamicWidth]}>
            <Text numberOfLines={1} style={styles.boxTitle}>Sales</Text>
            <Text numberOfLines={1} style={styles.boxValue}>{dashboardData2.sales}</Text>
          </TouchableOpacity>
        )}
        {/* Add this new balance box */}

      </View>
       {customerType !== "AGENT" && (
      <View style={styles.boxContainer}>
        <TouchableOpacity style={[styles.box, styles.dynamicWidth]}>
          <Text numberOfLines={1} style={styles.boxTitle}>Balance</Text>
          <Text numberOfLines={1} style={styles.boxValue}>{balance}</Text>
        </TouchableOpacity>
      </View>
       )}

      {customerType !== 'JS_EMPLOYEE' && customerType !== "JS_MANAGER" && customerType !== "TK_MANAGER" && customerType !== "TK_EMPLOYEE" && (


        <View style={styles.chartcontainer}>
          <Text style={styles.recentOrdersText1}>Order Revenue:</Text>
          <View style={{ flexDirection: 'row' }}>
            <ScrollView horizontal>
              <BarChart
                data={chartData}
                width={Dimensions.get('window').width * 2} // Twice the screen width for a wide chart
                height={300} // Fixed height, adjust as needed
                chartConfig={{
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  decimalPlaces: 0,
                  barPercentage: 0.5,
                }}
              />
            </ScrollView>
          </View>
        </View>
      )}



      {customerType !== 'AGENT' && customerType !== "DEALER" && (
        <View style={styles.chartcontainer}>
          <Text style={styles.recentOrdersText1}>Order Revenue:</Text>
          <View style={{ flexDirection: 'row' }}>
            <ScrollView horizontal>
              <BarChart
                data={chartData2}
                width={Dimensions.get('window').width * 2} // Twice the screen width for a wide chart
                height={300} // Fixed height, adjust as needed
                chartConfig={{
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  decimalPlaces: 0,
                  barPercentage: 0.5,
                }}
              />
            </ScrollView>
          </View>
        </View>
      )}


      {/* Recent Orders Table */}
      <View style={styles.recentOrdersContainer}>
        <Text style={styles.recentOrdersText}>Recent Orders:</Text>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Title</Text>
            <Text style={styles.tableHeaderText1}>Quantity</Text>
            <Text style={styles.tableHeaderText1}>Price</Text>

          </View>
          {recentOrders.map((order, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{order.title}</Text>
              <Text style={styles.tableCell1}>{order.quantity}</Text>
              <Text style={styles.tableCell1}>{order.price}</Text>
            </View>
          ))}
        </View>
      </View>


      {customerType !== 'AGENT' && customerType !== "DEALER" && customerType !== "TK_MANAGER" && customerType !== "TK_EMPLOYEE" && (

        <View style={styles.recentOrdersContainer}>
          <Text style={styles.recentOrdersText}>JS Goal:</Text>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Category</Text>
              <Text style={styles.tableHeaderText1}>Sales Amount</Text>
              <Text style={styles.tableHeaderText1}>Target</Text>
              <Text style={styles.tableHeaderText1}>Commission</Text>
            </View>
            {jsGoal.map((order, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.firstCell]}>{order.Category}</Text>
                <Text style={styles.tableCell1}>{order.SalesAmount}</Text>
                <Text style={styles.tableCell1}>{order.Target}</Text>
                <Text style={[styles.tableCell1, styles.lastCell]}>{order.Commission}</Text>
              </View>
            ))}
            {/* Total Row */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.firstCell, styles.red]}>Total:</Text>
              <Text style={[styles.tableCell1, styles.red]}>{totalSalesAmount.toFixed(2)}</Text>
              <Text style={styles.tableCell1}></Text>
              <Text style={[styles.tableCell1, styles.lastCell, styles.red]}>{totalCommission.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      )}

      {customerType !== 'AGENT' && customerType !== "DEALER" && customerType !== "JS_MANAGER" && customerType !== "JS_EMPLOYEE" && (

        <View style={styles.recentOrdersContainer}>
          <Text style={styles.recentOrdersText}>TK Goal:</Text>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Category</Text>
              <Text style={styles.tableHeaderText1}>Sales Amount</Text>
              <Text style={styles.tableHeaderText1}>Target</Text>
              <Text style={styles.tableHeaderText1}>Commission</Text>
            </View>
            {tkGoal.map((order, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.firstCell]}>{order.Category}</Text>
                <Text style={styles.tableCell1}>{order.SalesAmount}</Text>
                <Text style={styles.tableCell1}>{order.Target}</Text>
                <Text style={[styles.tableCell1, styles.lastCell]}>{order.Commission}</Text>
              </View>
            ))}
            {/* Total Row */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.firstCell, styles.red]}>Total:</Text>
              <Text style={[styles.tableCell1, styles.red]}>{totalSalesAmounttk.toFixed(2)}</Text>
              <Text style={styles.tableCell1}></Text>
              <Text style={[styles.tableCell1, styles.lastCell, styles.red]}>{totalCommissiontk.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      )}

      {customerType !== 'AGENT' && customerType !== "DEALER" && customerType !== "JS_EMPLOYEE" && customerType !== "TK_EMPLOYEE" && customerType !== "TK_MANAGER" && (

        <View style={styles.recentOrdersContainer}>
          <Text style={styles.recentOrdersText}>Summary:</Text>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Name</Text>
              <Text style={styles.tableHeaderText1}>Sales Amount</Text>
              <Text style={styles.tableHeaderText1}>Target</Text>
              <Text style={styles.tableHeaderText1}>Goal %</Text>
            </View>
            {summary.map((order, index) => (
              <View key={index}>
                <TouchableOpacity onPress={() => handleRowClick2(index, order)}>
                  <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.firstCell]}>{order.Name}</Text>
                    <Text style={styles.tableCell1}>{order.SalesAmount}</Text>
                    <Text style={styles.tableCell1}>{order.Target}</Text>
                    <Text style={[styles.tableCell1, styles.lastCell]}>{order.Goal}</Text>
                  </View>
                </TouchableOpacity>
                {expandedRow === index && (
                  <View style={styles.dropdownContainer}>
                    {loading ? (
                      <ActivityIndicator size="small" color="#0000ff" />
                    ) : (
                      <View>
                        <View style={styles.dropdownTableHeader}>
                          <Text style={styles.dropdownHeaderText}>Category</Text>
                          <Text style={styles.dropdownHeaderText}>Sales Amount</Text>
                          <Text style={styles.dropdownHeaderText}>Target</Text>
                          <Text style={styles.dropdownHeaderText}>Commission</Text>
                        </View>
                        {rowData.map((detail, detailIndex) => (
                          <View key={detailIndex} style={styles.dropdownTableRow}>
                            <Text style={[styles.dropdownTableCell, styles.dropdownTableCellLeft]}>{detail.Category}</Text>
                            <Text style={[styles.dropdownTableCell, styles.dropdownTableCellRight]}>{detail.SalesAmount.toFixed(2)}</Text>
                            <Text style={[styles.dropdownTableCell, styles.dropdownTableCellRight]}>{detail.Target.toFixed(2)}</Text>
                            <Text style={[styles.dropdownTableCell, styles.dropdownTableCellRight]}>{detail.Commision.toFixed(2)}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      )}

      {customerType !== 'AGENT' && customerType !== "DEALER" && customerType !== "JS_EMPLOYEE" && customerType !== "TK_EMPLOYEE" && customerType !== "JS_MANAGER" && (

        <View style={styles.recentOrdersContainer}>
          <Text style={styles.recentOrdersText}>Summary:</Text>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Name</Text>
              <Text style={styles.tableHeaderText1}>Sales Amount</Text>
              <Text style={styles.tableHeaderText1}>Target</Text>
              <Text style={styles.tableHeaderText1}>Goal %</Text>
            </View>
            {summarytk.map((order, index) => (
              <View key={index}>
                <TouchableOpacity onPress={() => handleRowClick(index, order)}>
                  <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.firstCell]}>{order.Name}</Text>
                    <Text style={styles.tableCell1}>{order.SalesAmount}</Text>
                    <Text style={styles.tableCell1}>{order.Target}</Text>
                    <Text style={[styles.tableCell1, styles.lastCell]}>{order.Goal}</Text>
                  </View>
                </TouchableOpacity>
                {expandedRow === index && (
                  <View style={styles.dropdownContainer}>
                    {loading ? (
                      <ActivityIndicator size="small" color="#0000ff" />
                    ) : (
                      <View>
                        <View style={styles.dropdownTableHeader}>
                          <Text style={styles.dropdownHeaderText}>Category</Text>
                          <Text style={styles.dropdownHeaderText}>Sales Amount</Text>
                          <Text style={styles.dropdownHeaderText}>Target</Text>
                          <Text style={styles.dropdownHeaderText}>Commission</Text>
                        </View>
                        {rowData.map((detail, detailIndex) => (
                          <View key={detailIndex} style={styles.dropdownTableRow}>
                            <Text style={[styles.dropdownTableCell, styles.dropdownTableCellLeft]}>{detail.Category}</Text>
                            <Text style={[styles.dropdownTableCell, styles.dropdownTableCellRight]}>{detail.SalesAmount.toFixed(2)}</Text>
                            <Text style={[styles.dropdownTableCell, styles.dropdownTableCellRight]}>{detail.Target.toFixed(2)}</Text>
                            <Text style={[styles.dropdownTableCell, styles.dropdownTableCellRight]}>{detail.Commision.toFixed(2)}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

      )}

      {/* Customer Names Table */}
      {customerType !== 'JS_EMPLOYEE' && customerType !== "JS_MANAGER" && customerType !== "TK_MANAGER" && customerType !== "TK_EMPLOYEE" && (
        <View style={styles.recentOrdersContainer}>
          {/* <Text style={styles.recentOrdersText}>Customers:</Text> */}
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Customers</Text>
            </View>
            {customerNamesTable.map((order, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.customerNameCell}>{order.Customer}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {customerType !== 'JS_EMPLOYEE' && customerType !== "JS_MANAGER" && customerType !== "TK_MANAGER" && customerType !== "TK_EMPLOYEE" && (

        <View style={styles.recentOrdersContainer}>
          {/* <Text style={styles.recentOrdersText}>Top Customers:</Text> */}
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Top Customers</Text>
            </View>
            {topCustomerTable.map((order, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.customerNameCell}>{order.Name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      <CustomDrawer isOpen={drawerOpen} onClose={closeDrawer} navigation={navigation} />
      <View style={styles.recentOrdersContainer}>

      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#ecf0f1',
  },
  recentOrdersText1: {
    color: "white"
  },
  mainText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#8b0000',
  },
  boxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
    gap: 2
  },
  box: {
    width: '22%',
    backgroundColor: '#8b0000',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  boxTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  boxValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 5,
  },
  dynamicWidth: {
    flex: 1,
  },

  recentOrdersContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  recentOrdersText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  tableContainer: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#7f8c8d',
    borderRadius: 10,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#8b0000',
    padding: 10,
  },
  tableHeaderText: {
    flex: 1,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 11,
    textAlign: 'center',

  },
  tableHeaderText1: {
    flex: 1,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 11,
    textAlign: 'center',


  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#7f8c8d',
    padding: 10,
  },
  tableCell: {
    flex: 1,
    color: '#2c3e50',
    textAlign: 'left',

    fontSize: 10
  },
  tableCell1: {
    flex: 1,
    color: '#2c3e50',
    textAlign: 'right',
    fontSize: 10

  },
  firstCell: {
    fontWeight: 'bold',
  },
  red: {
    color: 'red'
  },
  lastCell: {
    fontWeight: 'bold',
  },
  chartcontainer: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#8b0000',
    borderRadius: 16,
    padding: 16,
    elevation: 3, // Add elevation for a card-like effect
  },
  customerNameCell: {
    flex: 1,
    color: '#2c3e50',
    fontWeight: 'bold',
    // textAlign: 'center',
  },
  dropdownContainer: {
    backgroundColor: '#f9f9f9',
    paddingVertical: 5,
  },
  dropdownTableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 5,
    marginBottom: 5,
    flex: 1,
    textAlign: 'center',
    paddingVertical: 2,
    borderRightWidth: 1,
    borderRightColor: '#e1e1e1',
  },

  dropdownHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 12,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
  },
  dropdownTableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1', // Light grey line for each row
  },
  dropdownTableCell: {
    flex: 1,
    paddingVertical: 2,
    fontWeight: '400',
    fontSize: 12,
    borderRightWidth: 1,
    borderRightColor: '#e1e1e1',
    color: 'red'
  },
  dropdownTableCellRight: {
    textAlign: 'right',
  },
  dropdownTableCellLeft: {
    textAlign: 'left'
  }
});

export default Dashboard;



