import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import MyPosition from './composants/MyPosition';
import CalendarMeteo from './composants/CalendarMeteo';

export default function App() {
  return (
    <View style={styles.container}>
      <MyPosition />
      <CalendarMeteo />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
