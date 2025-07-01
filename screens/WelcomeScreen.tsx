import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Image source={require('../assets/images/banner.jpeg')} style={styles.banner} />

      <Animated.Image
        source={require('../assets/images/logo.png')}
        style={[styles.logo, { transform: [{ scale: scaleAnim }] }]}
      />

      <View style={styles.card}>
        <Text style={styles.title}>Welcome to WorkForce</Text>
        <Text style={styles.description}>
          We connect top-notch professionals with world-class Saudi companies across:
        </Text>
        <Text style={styles.bullet}>🔶 Construction</Text>
        <Text style={styles.bullet}>🔷 IT & Consulting</Text>
        <Text style={styles.bullet}>🔶 Hospitality & Services</Text>
        <Text style={styles.bullet}>🔷 Logistics & Supply Chain</Text>
        <Text style={styles.tagline}>
          <Text style={{ fontStyle: 'italic' }}>Where potential meets opportunity.</Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.mainButton}>
        <Text style={styles.mainButtonText}>Explore Jobs</Text>
      </TouchableOpacity>

      <View style={styles.authButtonsContainer}>
        <TouchableOpacity
          style={styles.authButton}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.authButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.authButton}
          onPress={() => router.push('/register')}
        >
          <Text style={styles.authButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  banner: {
    width: '100%',
    aspectRatio: 1.5,
    resizeMode: 'cover',
  },
  logo: {
    width: 170,
    height: 170,
    marginTop: -20,
    borderRadius: 100,
    backgroundColor: '#fff',
  },
  card: {
    marginTop: -10,
    backgroundColor: '#f9f9f9',
    padding: 18,
    borderRadius: 12,
    width: '90%',
    alignItems: 'center',
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d00000',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 10,
  },
  bullet: {
    fontSize: 15,
    marginVertical: 2,
  },
  tagline: {
    marginTop: 10,
    color: '#555',
  },
  mainButton: {
    backgroundColor: '#d00000',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  mainButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  authButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 20,
  },
  authButton: {
    backgroundColor: '#87CEEB', // SkyBlue
    paddingVertical: 10,
    width: 120,
    alignItems: 'center',
    borderRadius: 25,
  },
  authButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
