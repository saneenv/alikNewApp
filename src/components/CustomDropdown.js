import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput,FlatList } from 'react-native';

const CustomDropdown = ({ options, selectedOption, onSelectOption }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
        <Text style={styles.selectedOption}>
          {selectedOption ? selectedOption : 'Select compatible'}
        </Text>
      </TouchableOpacity>
      {dropdownVisible && (
        <View style={styles.dropdown}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchTerm}
            onChangeText={text => setSearchTerm(text)}
          />
          <ScrollView style={styles.optionContainer}>
            {filteredOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  onSelectOption(option);
                  setDropdownVisible(false);
                }}
              >
                <Text style={styles.option}>{option}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  selectedOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  dropdown: {
    // position: 'absolute',
    // top: '100%',
    // left: 0,
    // zIndex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 5,
    // width: '100%',
  },
  searchInput: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionContainer: {
    maxHeight: 100,
    // position: 'relative',
    // zIndex: 1000,
  },
  option: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default CustomDropdown;
