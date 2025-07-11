import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5F5F5',
    paddingVertical: 20,
  },
  
  container: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: 60,
    transform: [{ translateY: 70 }], 
    gap:30 
      
},
  ledname: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 20,

 transform: [{ translateY: 30 }],    
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom:'15',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#3498db',
  },
  menuButtonText: {
    color: '#ffffff',
    marginLeft: 10,
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#e74c3c',
  },
  logoutButtonText: {
    color: '#ffffff',
    marginLeft: 10,
    fontSize: 16,
  },
});

export default styles;
