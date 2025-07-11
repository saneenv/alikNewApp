import React, { useLayoutEffect, useState, useEffect } from "react";
import { Text, View, Dimensions, Image } from "react-native";
import Swiper from 'react-native-swiper/src';
import styles from "../Recipe/styles";
import base64 from 'base64-js';
import { useAuth } from '../AuthContext';


const { width: viewportWidth } = Dimensions.get("window");

export default function RecipeScreen(props) {
    const { navigation, route } = props;
    const imageURL = route.params?.imageURL;
   const itemId = route.params.itemId;
    const ItemName = route?.params?.ItemName;
    const AP= route?.params?.AP;
    const DP = route?.params?.DP;
    const MOP = route?.params?.MOP;
    const MRP = route?.params?.MRP;
    const Branch = route?.params?.Branch;
    const RealPrateTax = route?.params?.RealPrateTax;


    const [images, setImages] = useState([]);     
    const { customerType, ledCode } = useAuth();

    let priceText = "";

    if (customerType === 'AGENT') {
        priceText = `AP: ${AP}, MOP: ${MOP}, MRP: ${MRP}`;
    } else if (customerType === 'DEALER') {
        priceText = `DP: ${DP}, MOP: ${MOP}, MRP: ${MRP}`;
    } else if (customerType === 'CUSTOMER') {
        priceText = `MOP: ${MOP}, MRP: ${MRP}`;
    } else if (customerType === 'JS_EMPLOYEE') {
        priceText = `Branch: ${Branch}, MRP: ${MRP}`;
    } else if (customerType === 'JS_MANAGER') {
        priceText = `Rate: ${RealPrateTax}, MRP: ${MRP}`;
     } else {
        // Default for other customer types
        priceText = `MRP: ${MRP}`;
    }       

    useEffect(() => {
        const fetchItemImages = async () => {
            try {
                const response = await fetch(
                    `http://202.21.37.226:86/api/onlineorder/stock/getImages/JAPAN_ACCESORIES?itemname=${encodeURIComponent(
                        ItemName
                    )}&itemid=${itemId}`
                );
                const data = await response.json();
                setImages(data);
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };

        fetchItemImages();
    }, [ItemName, itemId]);

    const [initialImage, setInitialImage] = useState(null);

    // Fetching initial image from the provided imageURL
    useEffect(() => {
        const fetchInitialImage = async () => {
            try {
                const response = await fetch(imageURL);
                const data = await response.blob();
                setInitialImage(data);
            } catch (error) {
                console.error("Error fetching initial image:", error);
            }
        };

        if (imageURL) {
            fetchInitialImage();
        }
    }, [imageURL]);

    // Combine initialImage and fetched images for the Swiper
    const swiperImages = initialImage ? [initialImage, ...images] : images;

    useEffect(() => {
        navigation.setOptions({
            title: route.params?.title,
            headerRight: () => <View />,
        });
    }, [navigation, route.params?.title]);

  
    return (
        <View style={styles.container}>
            <View style={styles.carouselContainer}>
                <Swiper style={styles.wrapper}>
                    {swiperImages.map((image, index) => (
                        <View key={index}>
                            <Image
                                source={{
                                    uri: index === 0 && initialImage
                                        ? imageURL
                                        : `data:image/jpeg;base64,${base64.fromByteArray(new Uint8Array(image.Image.data))}`
                                }}
                                style={{ width: '100%', height: '100%' }}
                                resizeMode="center"
                            />
                        </View>
                    ))}
                </Swiper>
                <View style={styles.itemContainer}>
                    <Text style={styles.itemName}>{ItemName}</Text>
                    <View style={styles.itemDetailsContainer}>
                        <Text style={styles.itemDetails}>{priceText}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}