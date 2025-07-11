import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Button, Dimensions } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { useAuth } from '../components/AuthContext';
import Constants from 'expo-constants';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Icon from 'react-native-vector-icons/FontAwesome';


const Orders = ({ navigation }) => {
  const [tableData, setTableData] = useState([]);
  const { customerType } = useAuth();

  const { width } = Dimensions.get('window');
  const percentageWidth = width * 0.9;

  // Define percentages for each column
  const columnPercentages = [17, 10, 25, 17, 17, 18];

  // Calculate column widths based on the screen width
  const columnWidths = columnPercentages.map(percentage => (percentage / 100) * percentageWidth);

  const { expoConfig } = Constants;
  const { API_URL } = expoConfig?.extra || {};

  const { agentCode, ledCode } = useAuth();

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const [sortedBy, setSortedBy] = useState(null);
  const [isAscending, setIsAscending] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  function formatDateForComparison(inputDate) {
    const dateParts = inputDate.split('-');
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Convert to DD-MM-YYYY
    return formattedDate;
  }



  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleStyle: {
        fontWeight: "bold",
        textAlign: "center",
        alignSelf: "center",
        flex: 1,
        // color: 'white',
      },
      // headerStyle: {
      //   backgroundColor: '#3498db',
      // },
      // headerLeft: () => (
      //   <MenuImage
      //   onPress={() => navigation.dispatch(DrawerActions.openDrawer())}

      //   />
      // ),
      headerRight: () => <View />,
    });
  }, [navigation]);

  useEffect(() => {
    fetch(`${API_URL}/OrderList/JAPAN_ACCESORIES?ledcode=${ledCode}&agentCode=${agentCode}`)
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((item) => [
          formatDate(item.DDate),
          item.InvoiceNo.toString(),
          item.Customer,
          item.Total.toFixed(2),
          item.Profit.toFixed(2),
          item.DeliveryStatus === 0 ? 'Pending' : 'Success',
        ]);

        const filteredData = formattedData.filter((rowData, rowIndex) => {
          // if (rowIndex === 0) {
          //   return true; // Always include the header row
          // }
          const customerName = rowData[2];
          const orderDate = formatDateForComparison(rowData[0]); // Assuming date is in the first column
          const isWithinRange =
            (!startDate || orderDate >= formatDateForComparison(startDate)) &&
            (!endDate || orderDate <= formatDateForComparison(endDate));

          return customerName.toLowerCase().includes(searchQuery.toLowerCase()) && isWithinRange;
        }); // Exclude the header row for filtering purposes

        const entryNumCount = filteredData.length;
        const totalOfTotal = filteredData
          // .slice(1) // Exclude the header row
          .reduce((acc, row) => acc + parseFloat(row[3]), 0)
          .toFixed(2);
        const totalOfProfit = filteredData
          // .slice(1) // Exclude the header row
          .reduce((acc, row) => acc + parseFloat(row[4]), 0)
          .toFixed(2);

        setTableData([
          ['Date', 'Entry No', 'Customer', 'Total', 'Profit', 'Delivery Status'],
          ...filteredData.reverse(),
          [
            'Total:',
            entryNumCount,
            '',
            totalOfTotal,
            totalOfProfit,
            '',
          ],
        ]);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [searchQuery, startDate, endDate]);

  const handleSort = (columnIndex) => {
    const isCurrentlySorting = sortedBy === columnIndex;
    setIsAscending(isCurrentlySorting ? !isAscending : true);
    setSortedBy(columnIndex);
    const clonedTableData = [...tableData];
    clonedTableData.sort((a, b) => {
      const aValue = a[columnIndex];
      const bValue = b[columnIndex];
      return isAscending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
    setTableData(clonedTableData);
  };

  async function printTableAsPDF() {
    try {
      // Convert your table data to HTML with styling
      const tableHTML = `
        <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 12px;">
          ${tableData.map((rowData, rowIndex) =>
            `<tr style="${rowIndex === 0 ? 'background-color: #8b0000; color: white;' : ''}">
              ${rowData.map((cellData, colIndex) =>
                `<td style="border: 1px solid #ccc; padding: 8px; text-align: ${colIndex === 0 ? 'left' : 'right'};
                  ${rowIndex === tableData.length - 1 ? 'font-weight: bold;' : ''}">
                  ${(colIndex === 4 && customerType === 'DEALER') ? '' : cellData}
                </td>`
              ).join('')}
            </tr>`
          ).join('')}
        </table>    
      `;
  
      // Create a PDF document
      const pdfResult = await Print.printToFileAsync({
        html: tableHTML,
        width: 612,
        height: 792,
      });
  
      // Print the generated PDF
      await Print.printAsync({ uri: pdfResult.uri });
    } catch (error) {
      console.error('Error printing PDF:', error);
    }
  }
  
  
  

  const exportTableToExcel = async () => {
    try {
      // Create a CSV string from the table data
      const csvData = tableData.map((rowData, rowIndex) =>
        rowData
          .map((cellData, colIndex) => {
            // Exclude Profit column if customerType is DEALER
            if (customerType === 'DEALER' && colIndex === 4) {
              return '';
            }
            return cellData;
          })
          .join(',')
      ).join('\n');
  
      // Create a file in the device's file system
      const fileName = 'orders.csv';
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
  
      await FileSystem.writeAsStringAsync(fileUri, csvData, {
        encoding: FileSystem.EncodingType.UTF8,
      });
  
      // Share the file with the user
      await Sharing.shareAsync(fileUri, { mimeType: 'text/csv', dialogTitle: 'Share this file' });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <ScrollView>
        <Icon
          name="file-pdf-o"
          size={30}
          color="red"
          style={styles.pdfIcon}
          onPress={printTableAsPDF}
        />
        <Icon
          name="file-excel-o"
          size={30}
          color="green"
          style={styles.excelIcon}
          onPress={exportTableToExcel}
        />

        <TextInput
          style={styles.searchInput}
          placeholder="Search name"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Start Date"
          value={startDate}
          onChangeText={(text) => setStartDate(text)}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="End Date"
          value={endDate}
          onChangeText={(text) => setEndDate(text)}
        />

        <Table borderStyle={styles.table} style={{ width: percentageWidth }}>
          {tableData.map((rowData, rowIndex) => (
            <Row
              key={rowIndex}
              widthArr={columnWidths}
              data={rowData.map((cellData, colIndex) => {
                // Check if the user is a DEALER and the current column is the Profit column
                const isDealerAndProfitColumn = customerType === 'DEALER' && colIndex === 4;

                if (isDealerAndProfitColumn) {
                  // If it's a DEALER, hide the Profit column
                  return null;
                }

                if (rowIndex === 0) {
                  return (
                    <Text style={styles.headerText} key={colIndex}>
                      {cellData}
                    </Text>
                  );
                } else {
                  const isDateColumn = colIndex === 0;
                  const isCurrency = colIndex === 3 || colIndex === 4;
                  // Update the styling for the customer column to make it left-aligned
                  const cellStyle = isDateColumn
                    ? { ...styles.datetext }
                    : colIndex === 2 // Set the text alignment for the customer column
                      ? { ...styles.text, textAlign: 'left' }
                      : colIndex === 5
                        ? cellData === 'Success'
                          ? styles.successCellStyle
                          : styles.pendingCellStyle
                        : isCurrency
                          ? styles.currencyCellStyle
                          : styles.text;
                  if (rowIndex === tableData.length - 1) {
                    return (
                      <Text style={{ ...cellStyle, color: 'red', fontWeight: 'bold', fontSize: 9 }} key={colIndex}>
                        {colIndex === 1 ? tableData.length - 2 : cellData}
                      </Text>
                    );
                  }
                  return (
                    <Text style={cellStyle} key={colIndex}>
                      {cellData}
                    </Text>
                  );
                }
              })}
              style={
                rowIndex === 0
                  ? styles.header
                  : rowIndex === tableData.length - 1
                    ? styles.totalRow
                    : rowIndex % 2 === 0
                      ? styles.rowEven
                      : styles.rowOdd
              }
              onPress={() => {
                if (rowIndex === 0) {
                  handleSort(colIndex);
                }
              }}
            />
          ))}
        </Table>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    // backgroundColor:'white'
  },
  table: {
    borderWidth: 1,
    borderColor: '#7f8c8d',

  },
  header: {
    backgroundColor: '#8b0000',
  },
  rowEven: {
    backgroundColor: 'white',
  },
  rowOdd: {
    backgroundColor: '#D3D3D3',
  },
  text: {
    textAlign: 'center',
    fontSize: 11,
  },
  headerText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 11,
  },
  currencyCellStyle: {
    textAlign: 'right',
    fontSize: 11,
    color: '#2c3e50',
  },
  successCellStyle: {
    color: 'green',
    textAlign: 'center',
    fontSize: 11,
  },
  pendingCellStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 11,
  },
  datetext: {
    fontSize: 9.5,
  },
  searchInput: {
    width: '40%',
    height: 25,
    borderColor: 'black',
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 10,
    transform: [{ translateX: 205 }],
  },
  pdfIcon: {
    position: 'absolute',
    top: 1,
  },
  excelIcon: {
    position: 'absolute',
    top: 1,
    left: 35,
  },

});

export default Orders;
