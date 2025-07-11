import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Success = ({ route, navigation }) => {
    const { totalSum } = route.params;

    const currentDateTime = new Date();
    const formattedDate = formatDate(currentDateTime);
    const formattedTime = formatTime(currentDateTime);

    return (
        <View style={styles.cardContainer}>
            <View style={styles.cardContent}>
                <Icon name="check-circle" size={60} color="mediumseagreen" />
                <Text style={styles.title1}>Hurray!</Text>
                <Text style={styles.title}>Order Placed Successfully!</Text>
                {totalSum !== undefined ? (
                    <Text style={styles.totalAmount}>Total Amount: {totalSum.toFixed(2)}</Text>
                ) : (
                    <Text style={styles.errorText}>Error: Total amount not available</Text>
                )}
                <Text style={styles.dateTime}>Date: {formattedDate}</Text>
                <Text style={styles.dateTime}>Time: {formattedTime}</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Home')}
                    style={styles.returnButton}
                >
                    <Text style={styles.returnButtonText}>Return Home</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
};

const formatTime = (date) => {
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    return date.toLocaleTimeString(undefined, options);
};

const styles = StyleSheet.create({
    cardContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#8b0000',
        padding: 16, // Add padding to create the card-like appearance
    },
    cardContent: {
        backgroundColor: 'white', // Set the background color to white for the card
        padding: 16,
        borderRadius: 10, // Add border radius for rounded corners
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        alignItems: 'center',
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    title1: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color:'mediumseagreen'
    },
    totalAmount: {
        fontSize: 18,
        marginBottom: 10,
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        marginBottom: 10,
    },
    dateTime: {
        fontSize: 16,
        marginVertical: 5,
    },
    returnButton: {
        backgroundColor: 'mediumseagreen',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    returnButtonText: {
        fontSize: 18,
        color: 'white',
    },
});

export default Success;
