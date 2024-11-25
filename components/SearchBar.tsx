import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { parse, isValid } from "date-fns"; // Import isValid for validation

interface SearchBarProps {
  onSearchFCode?: (text: string) => void;
  onSearchFNumber?: (text: string) => void;
  onSearchDate?: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearchFCode,
  onSearchFNumber,
  onSearchDate,
}) => {
  const handleTextChangeDate = (text: string) => {
    const formats = [
      "dd MMM yy",
      "MMM dd yyyy",
      "MMM dd yy",
      "yyyy MMMM dd",
      "yyyy-MM-dd",
      "MM/dd/yyyy",
      "dd/MM/yyyy",
    ];

    let normalizedDate: string | null = null;

    for (const format of formats) {
      const parsedDate = parse(text, format, new Date());
      if (isValid(parsedDate)) {
        normalizedDate = parsedDate.toISOString().split("T")[0];
        break;
      }
    }

    if (normalizedDate && onSearchDate) {
      onSearchDate(normalizedDate);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, { width: "25%", marginRight: 6 }]}
        placeholder="Code"
        placeholderTextColor="#999"
        onChangeText={(text) => onSearchFCode && onSearchFCode(text)}
        autoCapitalize="characters"
        maxLength={3}
        autoCorrect={false}
      />
      <TextInput
        style={[styles.input, { width: "37%", marginHorizontal: 6 }]}
        placeholder="Flight Number"
        placeholderTextColor="#999"
        onChangeText={(text) => onSearchFNumber && onSearchFNumber(text)}
        keyboardType="numeric"
        maxLength={4}
      />
      <TextInput
        style={[styles.input, { width: "33%", marginLeft: 6, backgroundColor:'#111', borderColor: '#222' }]}
        placeholder="Date (Soon)"
        placeholderTextColor="#444"
        onChangeText={handleTextChangeDate}
        readOnly={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: "row",
    flexWrap: "nowrap",
  },
  input: {
    height: 50,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#FFF",
    backgroundColor: "#333",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#555",
  },
});

export default SearchBar;
