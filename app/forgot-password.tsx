import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { API_BASE_URL } from '../constants/config';
import { useRouter } from 'expo-router';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSendResetLink = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/candidates/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          'Check your email',
          data.message || 'If this email exists, a reset link has been sent.'
        );
        router.back(); // Возврат на экран входа
      } else {
        Alert.alert('Error', data.message || 'Something went wrong. Try again.');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      Alert.alert('Error', 'Could not send reset email.');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://static.wixstatic.com/media/7a7012_37fc018a06c64702b2931771875639a8~mv2.png',
        }}
        style={styles.logo}
      />

      <Text style={styles.title}>Forgot your password?</Text>
      <Text style={styles.subtext}>
        Enter your email below and we’ll send you a reset link.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Your email address"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />

      <TouchableOpacity style={styles.button} onPress={handleSendResetLink}>
        <Text style={styles.buttonText}>Send reset link</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#000',
  },
  subtext: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  button: {
    backgroundColor: '#ED1C24',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
