import React,{useLayoutEffect} from 'react';
import MenuImage from "./MenuImage/MenuImage";

import { ImageBackground,View, Text, Image, ScrollView, Linking } from 'react-native';
import { StyleSheet } from 'react-native';
import { DrawerActions } from '@react-navigation/native';


function About({ navigation }) {    
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
        //   headerLeft: () => (
        //     <MenuImage
        //     onPress={() => navigation.dispatch(DrawerActions.openDrawer())}

        //     />
        //   ),
          headerRight: () => <View />,
        });
      }, [navigation]);
      const imageURL = 'https://i.postimg.cc/NMNc06Kz/ALK-3.jpg';
    return (
        <ImageBackground source={{ uri: imageURL }} style={styles.backgroundImage}>
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <Image
                    source={{ uri: 'https://i.postimg.cc/FFc0w6KZ/ALIK-LOGO.png' }}
                    style={styles.logoImage} 
                />
                <Text style={styles.headerText}>ALIK STORE</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Our Mission</Text>
                <Text style={styles.sectionText}>
                    Welcome to ALIK STORE, your trusted online shopping destination. We are committed to providing a seamless and enjoyable shopping experience with high-quality products from various categories.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Our Vision</Text>
                <Text style={styles.sectionText}>
                    Our vision is to revolutionize online shopping by leveraging technology and innovation. We aim to be the go-to destination for everyday essentials and unique items, bringing convenience, value, and joy to people's lives.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Wide Product Range</Text>
                <Text style={styles.sectionText}>
                    Explore our extensive catalog of carefully curated products from trusted suppliers and brands. We aim to meet diverse customer needs and preferences.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionHeader}>User-Friendly Experience</Text>
                <Text style={styles.sectionText}>
                    Our user-friendly interface and advanced search options make finding products a breeze. Detailed descriptions and reviews help you make informed decisions.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Exceptional Support</Text>
                <Text style={styles.sectionText}>
                    Our dedicated support team is ready to assist you with any inquiries, product recommendations, or concerns. Your satisfaction is our priority.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Community & Sustainability</Text>
                <Text style={styles.sectionText}>
                    We believe in giving back to the community and supporting social and environmental causes. Your support contributes to our mission.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionText}>
                    Thank you for choosing ALIK STORE as your online shopping destination. Established in 2022, we serve customers across Kerala.
                </Text>
            </View>

            <View style={styles.addressContainer}>
                <Image
                    source={{ uri: 'https://i.postimg.cc/FFc0w6KZ/ALIK-LOGO.png' }}
                    style={styles.aboutImage}
                />
                <View style={styles.addressTextContainer}>
                    <Text style={styles.addressText}>Gulf Bazar,</Text>
                    <Text style={styles.addressText}>Tirur Malappuram,</Text>
                    <Text style={styles.addressText}>Kerala 676101</Text>
                    <Text style={styles.addressText}>
                        <Text style={styles.icon}>📞</Text>&nbsp; +91 88484 83211
                    </Text>
                    <Text style={styles.addressText}>
                        <Text style={styles.icon}>📧</Text>&nbsp; alikstore.ind@gmail.com
                    </Text>
                </View>
            </View>

            <View style={styles.footerContainer}>
                <Text style={styles.footerText}>
                    Copyright © 2023 SherSoft
                </Text>
            </View>
        </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundImage: 'url("https://i.postimg.cc/NMNc06Kz/ALK-3.jpg")',    
        resizeMode:'cover',
    },
  
    headerContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logoImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
      },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    section: {
        marginBottom: 20,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    sectionText: {
        fontSize: 16,
        color: '#333',
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    aboutImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    addressTextContainer: {
        marginLeft: 10,
    },
    icon: {
        fontSize: 16,
    },
    addressText: {
        fontSize: 16,
    },
    footerContainer: {
        alignItems: 'center',
        margin: 20,
    },
    footerText: {
        fontSize: 14,
        color: '#777',
    },
});

export default About;
