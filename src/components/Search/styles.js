import { StyleSheet } from "react-native";
import { RecipeCard } from "../../AppStyles";

const styles = StyleSheet.create({
  container: RecipeCard.container,
  photo: RecipeCard.photo,
  title: RecipeCard.title,
  category: RecipeCard.category,
  btnIcon: {
    height: 14,
    width: 14,
  },
  searchContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#EDEDED", 
    borderRadius: 10, 
    width: 250,
    justifyContent: "space-around"
  },
  searchIcon: { 
    width: 30, 
    height: 30, 
    tintColor: 'grey' 
  },
  searchInput: {
    backgroundColor: "#EDEDED",
    color: "black",
    width: 180,
    height: 50,
  },
  quantityContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  price: {
    fontSize: 10, // Adjust this value to set the desired font size
    // Other style properties...
    fontWeight:'bold'
  },
  quantityLabel: {
    marginRight: 8, 
  },
  quantityInputContainer: {
    alignItems: 'center', // Horizontal centering
    justifyContent: 'center', // Vertical centering
    paddingVertical: 10, 
    // marginBottom: 10,
  },
  quantityandbutton:{
    alignItems: 'center', // Horizontal centering
    justifyContent: 'center', // Vertical centering
    paddingVertical: 10, 
     
  },
  
  quantityInput: {
    width: 50,
    height: 30,
    borderWidth: 1,
    borderColor: 'black',
    textAlign: 'center',
  },
  screen: {
    flex: 1,
    backgroundImage: 'url("https://i.postimg.cc/NMNc06Kz/ALK-3.jpg")',    
    resizeMode:'cover'
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  notificationBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  notificationText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  cartLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
 stickyNotification: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  backgroundColor: "red",
  color:"white",
  padding: 10,
  alignItems: "center",
  zIndex: 1,
},

  stickyNotificationText: {
    color: "white", 
  },
  addToCartButton: {
    backgroundColor: '#BC2231',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  
  },
  addToCartButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    // Add more styles as needed
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    // Add more styles as needed
  },

   subcontainer: {
    width:'90%',
    // gap:'10%',
    paddingVertical: 10, 
    // height:'50%'
   
  },
  
 
});

export default styles;
