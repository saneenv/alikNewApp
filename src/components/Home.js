import React, { useLayoutEffect, useState, useEffect } from "react";
import { FlatList, Text, View, Image, TouchableHighlight, StyleSheet, ImageBackground,TouchableOpacity } from "react-native";
import MenuImage from "../components/MenuImage/MenuImage";
import { useAuth } from '../components/AuthContext'
import { DrawerActions } from '@react-navigation/native';
import CustomDrawer from '../components/CustomDrawer';


export default function Home({ navigation }) {
  const { customerType } = useAuth();
  const [categories, setCategories] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen((prevDrawerOpen) => !prevDrawerOpen);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

 const categoryImageMapping = {
    685: "https://i.postimg.cc/dtbMp3t7/charger-wallpaper.jpg",
    686: "https://i.postimg.cc/Rh03kGdT/earphone.jpg",
    687:"https://i.postimg.cc/9MYYhqF1/bluetooth2.jpg",
    688:"https://i.postimg.cc/Nfq89vNh/airpods.jpg",
    690:"https://i.postimg.cc/6Qbn9ybK/watch.jpg",
    691:"https://i.postimg.cc/gcqqfkyM/new-arrivals.jpg",
    692:"https://i.postimg.cc/Kc9RzK51/neckband3.jpg",
    693:"https://i.postimg.cc/wMp513JG/data-cable.jpg",
    694:"https://i.postimg.cc/cJ7wV0P7/bluetooth-speaker.jpg",
    695:"https://i.postimg.cc/k5jKnfXD/power-bank.jpg",
    696:"https://i.postimg.cc/K8TmczGT/power-bank-cables.webp",
    698:"https://i.postimg.cc/Ss2Bd1nM/other-accessories.jpg",
    699:"https://i.postimg.cc/j2zdgSDP/otg.webp",
    700:"https://i.postimg.cc/Fz1V3wzM/power-extension-cord.webp",
    701:"https://i.postimg.cc/3RY5stMq/pouch.jpg",
    702:"https://i.postimg.cc/V6k1SK7C/boat1.jpg",
    703:"https://i.postimg.cc/MKNyd4Vz/jbl.jpg",
    704:"https://i.postimg.cc/Gmn66M11/mobile2.jpg",
    709:"https://i.postimg.cc/Fz1V3wzM/power-extension-cord.webp",
    710:"https://i.postimg.cc/rF83Cfxn/car-charger.jpg",
    711:"https://i.postimg.cc/FzJRPhMv/wireless-charger.jpg",
    712:"https://i.postimg.cc/0NFr764n/car-holder.jpg",
    713:"https://i.postimg.cc/h4C6s9sK/power-strip.jpg",
    714:"https://i.postimg.cc/0jWN2b77/bed-lamb.jpg",
    715:"https://i.postimg.cc/SRvz1Z10/convert.jpg",
    716:"https://i.postimg.cc/vTD2gZ4W/aux-cable.jpg",
    718:"https://i.postimg.cc/K8TmczGT/power-bank-cables.webp",
    720:"https://i.postimg.cc/5NFG22Yw/pphone2.jpg",
    724:"https://i.postimg.cc/Rq5zZ6vD/bike4.webp",
    726:"https://i.postimg.cc/8ky4gQZL/wireless-headphone.jpg",
    735:"https://i.postimg.cc/m2nGDngH/screen-protector.webp",
    751:"https://i.postimg.cc/x8xqqPX1/watch-strap.jpg",
    752:"https://i.postimg.cc/pr2qPPjt/data.jpg",
    755:"https://i.postimg.cc/jqgMv5ZN/memory-card-2.webp",
    756:"https://i.postimg.cc/WzYrxZcx/pendrive.jpg",
    758:"https://i.postimg.cc/252LJvYm/pouch2.jpg",
    761:"https://i.postimg.cc/WzxKThMf/microphone.webp",
    771:"https://i.postimg.cc/26tKKSr0/hub-adaptor2.webp",
    772:"https://i.postimg.cc/xTzjHmF8/selfie-stick.jpg",
    773:"https://i.postimg.cc/ZqMKpLZ9/stylus-pen.jpg",
    779:"https://i.postimg.cc/Kcrhy5Vn/ring-stand.jpg",
    784:"https://i.postimg.cc/zv8TCf35/User-favorite-i-Phone-wallpapers-2022-idownloadblog-mockup.png",
    787:"https://i.postimg.cc/zDb5nkKd/oppo.webp",
    789:"https://i.postimg.cc/28DDPcHV/vivo.jpg",
    791:"https://i.postimg.cc/tJ9xcdww/mi1.webp",
    793:"https://i.postimg.cc/VsTx87Dj/real-me1.jpg",
    795:"https://i.postimg.cc/qRGqfmCw/watch-charging-cable.jpg",
    796:"https://i.postimg.cc/3Rc3gPMk/trimmer.jpg",
    797:"https://i.postimg.cc/SKbdKsJs/realmepad.webp",
    798:"https://i.postimg.cc/65vtsjRX/samsang-mobile.jpg",
    799:"https://i.postimg.cc/RZGHfZ0G/samsang-tab.jpg",
    800:"https://i.postimg.cc/bYFV0qZy/samsang-watch.jpg",
    801:"https://i.postimg.cc/WbJfpxX5/samsang-lap.webp"
  };
  
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
    // Fetch data from the API
    fetch("http://202.21.37.226:86/api/onlineorder/getCategories/JAPAN_ACCESORIES")
      .then((response) => response.json())
      .then((data) => {
        // Sort categories array
        const sortedCategories = data.sort((a, b) => {
          if (a.Name === "NEW ARRIVAL") return -1;
          if (b.Name === "NEW ARRIVAL") return 1;
          if (a.Name === "OTHER ACCESSORIES") return 1;
          if (b.Name === "OTHER ACCESSORIES") return -1;
          // Add more conditions if needed for other categories
          return a.Name.localeCompare(b.Name);
        });
  
        // Update the state with the sorted categories
        setCategories(sortedCategories);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);   

  const onPressCategory = (item) => {
    const title = item.Name;
    const category = item;
    navigation.navigate("ItemsList", { category, title, categoryId: item.Id });
  };


  const renderCategory = ({ item }) => (
    <TouchableHighlight underlayColor="#8b0000" onPress={() => onPressCategory(item)}>
      <View style={styles.categoriesItemContainer}>
        <Image style={styles.categoriesPhoto} source={{ uri: categoryImageMapping[item.Id] || 'https://i.postimg.cc/gcqqfkyM/new-arrivals.jpg' }} />
        <Text style={styles.categoriesName}>{item.Name}</Text>
      </View>
    </TouchableHighlight>
  );                                                                      

  const imageURL = 'https://i.postimg.cc/NMNc06Kz/ALK-3.jpg';

  return (
    <ImageBackground source={{ uri: imageURL }} style={styles.backgroundImage}>
    <View style={styles.screenmain}>
    
      <FlatList data={categories} renderItem={renderCategory} keyExtractor={(item) => `${item.Id}`} />
    </View>
    <CustomDrawer isOpen={drawerOpen} onClose={closeDrawer} navigation={navigation} />

    </ImageBackground>

  );
}

const styles = StyleSheet.create({
  categoriesItemContainer: {
    flex: 1,
    backgroundColor:'white',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 215,
    borderColor: '#cccccc',
    borderWidth: 0.5,
    borderRadius: 20,
  },
  screenmain:{
    flex: 1, 
    backgroundImage: 'url("https://i.postimg.cc/NMNc06Kz/ALK-3.jpg")',    
    resizeMode:'cover',                                                                                                                                                                                                                                                                                                                                                                                
  },

  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  categoriesPhoto: {
    width: '100%',
    height: 155,
    borderRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: 'blue',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
    elevation: 3
  },
  categoriesName: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333',
    marginTop: 8
  },
  categoriesInfo: {
    marginTop: 3,
    marginBottom: 5
  }
});
