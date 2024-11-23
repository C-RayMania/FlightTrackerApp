import { FontAwesome6 } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { Text, TouchableOpacity, Alert } from "react-native";

export default function RootLayout() {
  return (
    <Stack screenOptions={{
      headerStyle: {
        backgroundColor: '#333',
      },
      headerTintColor: '#fff',
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerRight: () => (
        <TouchableOpacity onPress={() => {
          Alert.alert('Feedback Form (Coming Soon)', 'Spotted a bug? Found a design flaw? Or maybe you have an epic idea that could make this app even better?\n\nThis is where your feedback would go—if the feedback form actually existed. Good news: it\’s coming soon! In the meantime, jot down your ideas, hold on to your suggestions, and check back later.', [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ]);
        }}>
          <FontAwesome6 name="bug" color="#FFF" size={24} />
        </TouchableOpacity>
      )
    }}>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
    </Stack>
  );
}
