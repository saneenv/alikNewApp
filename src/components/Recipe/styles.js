import { StyleSheet, Dimensions } from 'react-native';

const { width: viewportWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1
  },

  carouselContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10, 
    width:'100%',
    height:'100%'
  },

  wrapper: {
    // height: '80%' // Adjust the height of the Swiper
  },

  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    // width: viewportWidth,
    height: '80%', 
  },

  infoRecipeContainer: {
    flex: 1,
    margin: 25,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },

  infoValue: {
    fontSize: 18,
    color: '#2cd18a',
  },

  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  infoPhoto: {
    height: 20,
    width: 20,
    marginRight: 0
  },

  infoRecipe: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  
  category: {
    fontSize: 14,
    fontWeight: 'bold',
    margin: 10,
    color: '#2cd18a'
  },
  infoDescriptionRecipe: {
    textAlign: 'left',
    fontSize: 16,
    marginTop: 30,
    margin: 15
  },
  infoRecipeName: {
    fontSize: 28,
    margin: 10,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center'
  },
  itemName: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10, 
  },
  itemDetailsContainer: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
},
itemDetails: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginRight: 10,
},

});



export default styles;
