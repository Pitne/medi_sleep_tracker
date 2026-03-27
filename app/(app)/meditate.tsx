import { StyleSheet, Text, View } from 'react-native';

export default function MeditateScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meditate</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
