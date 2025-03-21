import { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './src/navigation';
import Entry from './src/screens/Entry';
import { getToken } from './integrations/authStorage';

export default function App() {
  const [isUserLogin, setIsUserLogin] = useState(false);

  // Check if a token exists when the app starts
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await getToken();
      if (token) {
        setIsUserLogin(true);  // Auto-login if a token exists
      }
    };
    checkLoginStatus();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {isUserLogin ? (
        <NavigationContainer>
          <Tabs setIsUserLogin={setIsUserLogin} />
        </NavigationContainer>
      ) : (
        <Entry setIsUserLogin={setIsUserLogin} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#222b45' }
});