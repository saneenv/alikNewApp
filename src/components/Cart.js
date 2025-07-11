import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Button, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from './AuthContext';
import * as Print from 'expo-print';
// import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Cart = ({ navigation }) => {
  const [cartData, setCartData] = useState([]);
  const { customerType, ledCode: authLedCode } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [areItemsPresent, setAreItemsPresent] = useState(false);
  const { ledName } = useAuth();
  const currentDate = new Date().toLocaleDateString();
  const { mobile, addone, addtwo, addthree } = useAuth();

  useEffect(() => {
    const retrieveCartData = async () => {
      try {
        // Retrieve all keys stored in AsyncStorage
        const allKeys = await AsyncStorage.getAllKeys();

        // Filter out keys that start with 'cartItem_' (assuming this prefix is used for cart items)
        const cartItemKeys = allKeys.filter((key) => key.startsWith('cartItem_'));

        // Retrieve data for each cart item key
        const cartItems = await Promise.all(
          cartItemKeys.map(async (key) => {
            const item = await AsyncStorage.getItem(key);
            return JSON.parse(item);
          })
        );

        setCartData(cartItems);

        // Check if there are items in the cart and update areItemsPresent accordingly
        const itemsPresent = cartItems.some((item) => item.ledCode === authLedCode);
        setAreItemsPresent(itemsPresent);
      } catch (error) {
        console.error("Error retrieving cart data from AsyncStorage:", error);
      }
    };

    retrieveCartData();
  }, []);


  const deleteRow = async (index) => {
    const itemToDelete = filteredCartData[index];

    try {
      // Create the key for the item to be deleted based on its identifier
      let itemKey = `cartItem_${itemToDelete.ID}_`;
      if (itemToDelete.selectedOption) {
        itemKey += `${itemToDelete.selectedOption}`;
      }
      console.log("itemkey:", itemKey);

      // Remove the item from AsyncStorage
      await AsyncStorage.removeItem(itemKey);
      console.log(`Item with key ${itemKey} deleted from AsyncStorage.`);

      // Update filteredCartData and cartData
      const updatedFilteredCartData = [...filteredCartData];
      updatedFilteredCartData.splice(index, 1);

      const updatedCartData = cartData.filter((item) => item.ledCode !== authLedCode);
      updatedCartData.push(...updatedFilteredCartData);

      console.log('Updated Cart Data:', updatedCartData);

      setCartData(updatedCartData);

      // Check if there are any items left in the cart
      if (updatedCartData.length === 0) {
        console.log('No items left in the cart');
        setAreItemsPresent(false);
      }
    } catch (error) {
      console.error('Error deleting item from AsyncStorage:', error);
    }
  };


  const handleClear = async () => {
    setIsClearing(true);

    try {
      // Retrieve all keys stored in AsyncStorage
      const allKeys = await AsyncStorage.getAllKeys();

      // Filter out keys that start with 'cartItem_' (assuming this prefix is used for cart items)
      const cartItemKeys = allKeys.filter((key) => key.startsWith('cartItem_'));

      // Remove all cart items from AsyncStorage
      await AsyncStorage.multiRemove(cartItemKeys);
      console.log('Cart cleared from AsyncStorage.');

      // Update the state variables
      setCartData([]);
      setAreItemsPresent(false); // Update areItemsPresent
    } catch (error) {
      console.error('Error clearing cart from AsyncStorage:', error);
    }

    setIsClearing(false);
  };

  // Filter cart items based on ledCode
  const filteredCartData = cartData.filter((item) => item.ledCode === authLedCode);

  // Calculate the total sum of prices
  const totalSum = filteredCartData.reduce((sum, item) => sum + item.total, 0);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const currentDate = new Date().toISOString().split('T')[0];

    try {
      for (const item of filteredCartData) {
        const response = await fetch(
          `http://202.21.37.226:86/api/onlineorder/getProductByFilter/JAPAN_ACCESORIES?filter=${encodeURIComponent(
            item.itemName
          )}`
        );

        if (response.ok) {
          const apiData = await response.json(); // Assuming the response is an array of objects

          // Find the item in the API response matching the current cart item
          const matchingItem = apiData.find(
            (apiItem) => apiItem.ItemName === item.itemName
          );

          if (matchingItem && item.quantity > matchingItem.Qty) {
            // Quantity check failed, prevent submission
            alert(`out of stock ${item.itemName}`);
            setIsSubmitting(false); // Reset the submitting state to allow resubmission
            return; // Exit function, preventing further execution
          }
        } else {
          console.error(`Failed to fetch data for item ${item.itemName}`);
          setIsSubmitting(false); // Reset the submitting state to allow resubmission
          return; // Exit function if the API fetch fails
        }
      }

      // All quantity checks passed, proceed with submission
      const itemsData = filteredCartData.map((item) => ({
        id: item.ID,
        name: item.itemName,
        dp: item.rate,
        mrp: item.total,
        quantity: item.quantity,
        model: item.selectedOption,
      }));

      const requestBody = `{
        "date": "${currentDate}",
        "id": "${authLedCode}",
        "contact": "",
        "items": "[${itemsData.map(
        (item) =>
          `{\\"id\\":${item.id},\\"name\\":\\"${item.name}\\",\\"model\\":\\"${item.model}\\",\\"dp\\":${item.dp},\\"mrp\\":${item.mrp},\\"quantity\\":${item.quantity}}`
      )}]"
      }`;

      console.log('Request Body:', requestBody);

      const submitResponse = await fetch(
        'http://202.21.37.226:86/api/onlineorder/orderAdd/JAPAN_ACCESORIES',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: requestBody,
        }
      );

      if (submitResponse.status === 200) {
        console.log('Order submitted successfully');
        await handleClear();
        exportCartToPDF();
        navigation.navigate('Success', { totalSum });
      } else {
        console.error('Failed to submit the order.');
      }

      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false); // Reset the submitting state in case of an error
    }
  };

  const exportCartToPDF = async () => {
    try {
      // Define CSS styles for the table
      const tableStyles = `
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px;
              text-align: center;
            }
            th {
              background-color: #f2f2f2;
            }
          </style>
        `;

      // Generate an HTML table from the cart data
      const tableRows = filteredCartData.map((item, index) => (
        `<tr key="${index}">
           <td>${item.itemName}</td>
           <td style="text-align: center;">${item.quantity}</td>
           <td style="text-align: right;">${item.total.toFixed(2)}</td>
         </tr>`
      )).join(''); // Join the rows together to form a single string

      // Calculate the total sum of prices
      const totalSumRow = `
          
        <div style="text-align: right; font-weight: bold; font-size: 50px; margin-right: 120px; transform: translateY(-50px);">${totalSum.toFixed(2)}</div>
          
        `;

      const cartHTML = `
        <html>
<head>
    <title>Invoice</title>
    <link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet">
    <style>
        /* Styling for the red table header */
        th {
            color: white;
            background-color: #BC2231;
            font-family: 'Roboto', sans-serif;
        }
        body {
          font-family: 'Roboto', sans-serif;
      }

        /* Styling for the line */
        .line {
            border-bottom: 1px solid #000;
            margin-bottom: 10px;
        }
        /* Styling for the table */
        table {
            border-collapse: collapse;
            width: 100%;
        }
        th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
        }
    </style>
</head>
<body>
    <div>
    <div style="display: flex; align-items: center;">
    <img src="https://i.postimg.cc/FFc0w6KZ/ALIK-LOGO.png" alt="Alikstore Logo" width="150" height="150">
    <h1 style="margin-left: 20px;">Alik Store</h1>

</div>
        <div class="line"></div>
        <p style="font-weight: bold;">Order Date: ${currentDate}</p>
        <p style="font-weight: bold;">Purchase Order Of: ${ledName}</p>
        <p style="font-weight: bold;">Customer Contact: ${mobile}</p>
        <p style="font-weight: bold;">Customer Address: ${addone}</p>
        <div>
            <p style="text-align: right;font-weight: bold; font-size: 15px;">Payable</p>
            <p style="text-align: right; font-weight: bold; font-size: 25px;">${totalSum.toFixed(2)} INR</p>
        </div>
        <div class="line"></div>          
        
        <table>
            <thead>
                <tr>
                    <th>Item Name</th>
                    <th style="text-align: center;">Quantity</th>
                    <th style="text-align: center;">Price</th>
                </tr>
            </thead>
            <tbody>
                <!-- Replace with actual item details in the table -->
                <tr>
                ${tableRows}
                </tr>
          </tbody>
        </table>
      </div>
    </body>
   </html>
      `;

      // Create a PDF document
      const pdfResult = await Print.printToFileAsync({
        html: cartHTML,
        width: 612,
        height: 810,
      });

      // Share the generated PDF file with the user
      await Sharing.shareAsync(pdfResult.uri, { mimeType: 'application/pdf', dialogTitle: 'Share this PDF' });
    } catch (error) {
      console.error('Error exporting to PDF:', error);
    }
  };

  return (

    <View style={styles.container}>
      {filteredCartData.length > 0 ? (
        <FlatList
          data={filteredCartData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.cartItem}>
              <View style={styles.cartItemSub}>
              <View style={[styles.itemInfo, { marginBottom: 10 }]}>
                  <Text style={styles.itemNameDiv} > <Text style={styles.itemName}>{item.itemName}</Text></Text>

                  <View style={styles.deleteButtonDiv}>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => deleteRow(index)}>
                      <Icon name="trash" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.itemQuantity}>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <View style={styles.selectedOptionContainer}>
                    <Text style={styles.selectedOption}>{item.selectedOption}</Text>
                  </View>
                  <Text style={styles.total}>{item.total.toFixed(2)}</Text>
                </View>

              </View>


            </View>
          )}
        />
      ) : (
        <Text style={styles.errorMessage}>No items to display</Text>
      )}
      {areItemsPresent && (
        <View>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalValue}>{totalSum.toFixed(2)}</Text>
          </View>
          <View style={styles.buttonContainer}>
            {/* <TouchableOpacity
              style={styles.buttonSubmit}
              onPress={exportCartToPDF}
            >
              <Text style={styles.buttonText}>Export to PDF</Text>
            </TouchableOpacity>*/}
            {/* <TouchableOpacity
                  style={styles.buttonClear}
                  onPress={handleClear}
                  disabled={isClearing}
                >
                  <Text style={styles.buttonText}>Clear</Text>
                </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.buttonSubmit}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>Place Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding:3
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#8b0000',
    textAlign: 'center',
  },
  cartItem: {
    flexDirection: 'column',
    // alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 10,
  },
  cartItemSub: {
    flexDirection: 'column',
    
    // height:'100%',
    // alignItems: 'center',
    // padding: 5,
    // borderBottomWidth: 1,
    // borderBottomColor: '#ddd',
    // backgroundColor: 'white',
    // margin: 5,
    // borderRadius: 10,
  },
  itemInfo: {
    flex: 1,
    flexDirection: 'row',
    height: '50%'
  },
  itemNameDiv: {
    width: '90%',
    display: 'flex',
    // backgroundColor:'blue',
    alignItems: 'flex-start'
  },
  itemName: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'left',
    width: '30%', // Adjust the width as needed
    // paddingVertical: 15, 

  },
  selectedOptionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingVertical: 15, 

  },
  selectedOption: {
    fontSize: 12,
    fontWeight: 'bold',

    textAlign: 'center',
  },
  total: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
    color:'#8b0000',
    width: '30%', // Adjust the width as needed
    // paddingVertical: 15, 

  },


  itemQuantity: {
    flex: 1,
    flexDirection: 'row',
    height: '50%',
    display: 'flex',
    flexDirection: 'row',
   
    // gap:'100%',
    width: '100%',
    paddingVertical: 10, 

  },
  itemQuantityText: {
    fontSize: 12,
    display: 'flex',
    width: '50%',
    // marginTop:70,
    //  gap:'100%'
  },
  itemSelect: {
    fontSize: 12,
    fontWeight: 'bold',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'

  },
  itemPrice: {
    fontSize: 15,
    color: '#8b0000',
    display: 'flex',
    width: '50%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  deleteButtonDiv: {
    width: '10%',
    display: 'flex',
    alignItems: 'flex-end'

  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 50,
    padding: 5,
  },
  errorMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'red',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8b0000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the buttons horizontally
    alignItems: 'center', // Center the buttons vertically
    margin: 10,
  },
  buttonClear: {
    flex: 1,
    backgroundColor: 'red',
    padding: 10, // Reduced button padding
    borderRadius: 5, // Reduced border radius
    alignItems: 'center',
    margin: 5, // Added margin for spacing
  },
  buttonSubmit: {
    flex: 1,
    backgroundColor: '#ffa500',
    padding: 10, // Reduced button padding
    borderRadius: 5, // Reduced border radius
    alignItems: 'center',
    margin: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Cart;
