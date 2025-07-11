import React, { useLayoutEffect, useEffect, useState } from "react";
import { FlatList, Text, View, TouchableOpacity, Image, TextInput, ImageBackground } from "react-native";
import styles from "./styles";
import { useAuth } from '../AuthContext';
import CustomDrawer from '../../components/CustomDrawer';
import CustomDropdown from "../../components/CustomDropdown";

import AsyncStorage from '@react-native-async-storage/async-storage';

const CategoryItem = ({ item, onPressItems, onItemAddedToCart }) => {
  const imageURL = `http://148.72.210.101:866/uploads/${item.ID}.jpg`;

  // Assuming these properties exist in the item object
  const { ItemName, MRP, MOP, DP, AP, ID, Qty , Branch, RealPrateTax} = item;

  const itemName = ItemName

  const [quantity, setQuantity] = useState("");
  const { customerType, ledCode } = useAuth();
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    fetchDropdownOptions(ItemName);
  }, [ItemName]);
 
  const fetchDropdownOptions = async (itemName) => {
    try {
      const apiUrl = `http://202.21.37.226:86/api/onlineorder/getProductByNewFilter/JAPAN_ACCESORIES?filter=${encodeURIComponent(
        itemName
      )}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      setDropdownOptions(data.map((option) => option.model));
    } catch (error) {
      console.error('Error fetching dropdown options:', error);
    }
  };



  const handleQuantityChange = (text) => {
    if (text === "" || /^\d+$/.test(text)) {
      setQuantity(text);
    }
  };

  const handleBlur = async () => {
    if (quantity.trim() !== "" && parseInt(quantity, 10) > 0) {
      const parsedQuantity = parseInt(quantity, 10);

      // Check if the parsed quantity is greater than the available stock (Qty)
      if (parsedQuantity > Qty) {
        // Quantity is greater than available stock, display an alert or handle it as needed
        alert(`Available stock is ${Qty}`);
      } else {
        try {
          let rateToSave;

          switch (customerType) {
            case "DEALER":
              rateToSave = DP;
              break;
            case "CUSTOMER":
              rateToSave = MOP;
              break;
              case "JS_EMPLOYEE":
              rateToSave = Branch;
              break;
              case "TK_EMPLOYEE":
              rateToSave = Branch;
              break;
              case "JS_MANAGER":
              rateToSave = RealPrateTax;
              break;
              case "TK_MANAGER":
              rateToSave = RealPrateTax;
              break;
            default:
              break;
          }

          if (rateToSave !== undefined) {
            const dataToSave = {
              itemName,
              rate: rateToSave,
              quantity: parsedQuantity,
              total: rateToSave * parsedQuantity,
              ledCode,
              ID,
              selectedOption // Add the selectedOption here
            };

            // Logging for debugging
            console.log("customerType:", customerType);
            console.log("rateToSave:", rateToSave);
            console.log(dataToSave);

            const key = `cartItem_${ID}_${selectedOption}`;
            console.log("AsyncStorage key:", key);
            await AsyncStorage.setItem(key, JSON.stringify(dataToSave));

            console.log(`Item ${itemName} saved to AsyncStorage.`);


            setSelectedOption("");


            // Notify item addition to cart
            onItemAddedToCart(itemName);

            // Reset the quantity state to clear the input field
            setQuantity(""); // Clear the input field
          }
        } catch (error) {
          console.error("Error saving data to AsyncStorage:", error);
        }
      }
    }
  };

  const handleAddToCart = () => {
    // You can perform actions here when the "Add to Cart" button is pressed
    // For instance, you can trigger the function to add the item to the cart
    onItemAddedToCart(itemName);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onPressItems(item, imageURL)}>
        <Image style={styles.photo} source={{ uri: imageURL }} />
      </TouchableOpacity>

      <Text style={styles.title}>{ItemName}</Text>
      
      <View style={styles.subcontainer}>
        {dropdownOptions.length > 0 && (
          <CustomDropdown
            options={dropdownOptions}
            selectedOption={selectedOption}
            onSelectOption={setSelectedOption}
          />
        )}

        <View style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: 10  }}>
          {customerType === 'AGENT' && <Text style={styles.price}>AP:{AP},</Text>}
          {customerType === 'DEALER' && <Text style={styles.price}>DP:{DP},</Text>}
          {customerType === 'JS_EMPLOYEE' && <Text style={styles.price}>Branch:{Branch},</Text>}
          {customerType === 'JS_MANAGER' && <Text style={styles.price}>Rate:{RealPrateTax},</Text>}
          {customerType === 'TK_EMPLOYEE' && <Text style={styles.price}>Branch:{Branch},</Text>}
          {customerType === 'TK_MANAGER' && <Text style={styles.price}>Rate:{RealPrateTax},</Text>}

  
          {customerType !== 'JS_EMPLOYEE' && customerType !== 'JS_MANAGER'  && customerType !== 'TK_EMPLOYEE'  && customerType !== 'TK_MANAGER' && <Text style={styles.price}>MOP:{MOP},</Text>}
          <Text style={styles.price}>MRP:{MRP}</Text>
        </View>
  
        {customerType !== "AGENT" && (
          <View style={styles.quantityandbutton}>
            <View style={styles.quantityInputContainer}>
              <TextInput
                style={styles.quantityInput}
                value={quantity.toString()}
                onChangeText={handleQuantityChange}
                keyboardType="numeric"
              />
            </View>
           
            <TouchableOpacity onPress={handleBlur} style={styles.addToCartButton}>
              <Text style={styles.addToCartButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};


const ItemsListScreen = (props) => {
  const { navigation, route } = props;
  const [items, setItems] = useState([]);
  const categoryId = route?.params?.categoryId;
  const { customerType } = useAuth();
  const [cartNotification, setCartNotification] = useState(null);

  // const BackgroundImage = require('../../../assets/backgound.jpg');
  const imageURL = 'https://i.postimg.cc/NMNc06Kz/ALK-3.jpg';

  const onItemAddedToCart = (itemName) => {
    setCartNotification('Item added to the cart');
    // setTimeout(() => {
    //   setCartNotification(null);
    // }, 5000); // Hide the notification after 5 seconds
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`http://202.21.37.226:86/api/onlineorder/getProductByCategory/JAPAN_ACCESORIES?Id=${categoryId}`);
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Error fetching Items:", error);
      }
    };

    fetchItems();
  }, [categoryId]);

  useEffect(() => {
    navigation.setOptions({
      title: route.params?.title,
      headerRight: () => <View />,
    });
  }, [navigation, route.params?.title]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleStyle: {
        fontWeight: "bold",
        textAlign: "center",
        alignSelf: "center",
        flex: 1,
      },
      headerRight: () => <View />,
    });
  }, [navigation]);

  const onPressItems = (item, imageURL) => {
    const itemId = item.ID;
    const AP = item.AP;
    const DP = item.DP;
    const MOP = item.MOP;
    const MRP = item.MRP;
    const Branch = item.Branch;
    const RealPrateTax = item.RealPrateTax;
    const categoryId = route?.params?.categoryId;
    const ItemName = item.ItemName;
    const title = item.ItemName;
    navigation.navigate("Slideshow", { categoryId, itemId, ItemName, title, AP, DP, MOP, MRP,Branch,RealPrateTax, imageURL });
  };


  return (
    <ImageBackground source={{ uri: imageURL }} style={styles.backgroundImage}>
      <View style={styles.screen}>
        {cartNotification && (
          <View style={styles.stickyNotification}>
            <Text style={styles.stickyNotificationText}>
              {cartNotification}{" "}
              <Text
                style={styles.cartLink}
                onPress={() => {
                  navigation.navigate("Cart");
                  setCartNotification(null);
                }}
              >
                Visit Your Cart
              </Text>
            </Text>
          </View>
        )}

        <FlatList
          vertical
          showsVerticalScrollIndicator={false}
          numColumns={2}
          data={items}
          renderItem={({ item }) => (
            <CategoryItem
              item={item}
              onPressItems={onPressItems}
              onItemAddedToCart={onItemAddedToCart}
            />
          )}
          keyExtractor={(item) => `${item.ID}`}
        />
      </View>
    </ImageBackground>

  );

};

export default ItemsListScreen;
