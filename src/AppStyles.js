import { StyleSheet, Dimensions } from 'react-native';

// screen sizing
const { width, height } = Dimensions.get('window');
// orientation must fixed
const SCREEN_WIDTH = width < height ? width : height;

const recipeNumColums = 2;
// item size
const RECIPE_ITEM_HEIGHT = 150;
const RECIPE_ITEM_MARGIN = 20; //new

// 2 photos per width
export const RecipeCard = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // gap:'50',
    marginLeft: 9,
    marginRight:9,
    marginTop: 20,
    width: (SCREEN_WIDTH - (recipeNumColums + 1) * RECIPE_ITEM_MARGIN) / recipeNumColums,
    height: 'auto',
    borderColor: '#cccccc',
    backgroundColor:'white',
    borderWidth: 0.5,
    borderRadius: 15,
    
  },
  photo: {
    width: (SCREEN_WIDTH - (recipeNumColums + 1) * 25) / recipeNumColums,
    height: 170,
    marginTop:10,
    // borderRadius: 15,
    // borderBottomLeftRadius: 0,
    // borderBottomRightRadius: 0
  },
  title: {
    flex: 1,
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#444444',
    // marginTop: 3,
    marginRight: 5,
    marginLeft: 5,
  },
  category: {
    marginTop: 5,
    marginBottom: 5
  }
});
