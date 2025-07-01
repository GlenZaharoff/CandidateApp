import React, { useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const jobs = [
  { id: '1', title: 'Construction Supervisor' },
  { id: '2', title: 'Frontend Developer' },
  { id: '3', title: 'Hotel Manager' },
  { id: '4', title: 'Logistics Coordinator' },
];

export default function HomeScreen() {
  const [search, setSearch] = useState('');

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />

      <Text style={styles.header}>Welcome to Workforce</Text>

      <Text style={styles.description}>
        We connect elite professionals with top companies across:
        {'\n'}🔸 Construction
        {'\n'}🔹 IT Services
        {'\n'}🔸 Hospitality
        {'\n'}🔹 Logistics & Supply Chain
      </Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search for a job title..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.jobCard}>
            <Text style={styles.jobTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.noResults}>No jobs found.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: '#fff',
  },
  logo: {
    width: 140,
    height: 140,
    alignSelf: 'center',
    marginBottom: 10,
    resizeMode: 'contain',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ED1C24',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 20,
    color: '#333',
  },
  searchInput: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  jobCard: {
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
  },
  noResults: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 20,
  },
});
