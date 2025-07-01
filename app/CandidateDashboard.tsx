import * as DocumentPicker from 'expo-document-picker';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { API_BASE_URL } from '../constants/config';

export default function CandidateDashboard() {
  const {
    id,
    first_name,
    last_name,
    email,
    phone,
    address,
    job_title,
  } = useLocalSearchParams();

  const [candidate, setCandidate] = useState({
    id: Number(id) || 0,
    first_name: Array.isArray(first_name) ? first_name[0] : first_name || '',
    last_name: Array.isArray(last_name) ? last_name[0] : last_name || '',
    email: Array.isArray(email) ? email[0] : email || '',
    phone: Array.isArray(phone) ? phone[0] : phone || '',
    address: Array.isArray(address) ? address[0] : address || '',
    job_title: Array.isArray(job_title) ? job_title[0] : job_title || '',
  });

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/candidates/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(candidate),
      });

      const data = await response.json();

      if (!response.ok) {
        return Alert.alert('Update failed', data.message || 'Something went wrong');
      }

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  const handleCVUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    });

    if (result.canceled || !result.assets?.length) return;

    const file = result.assets[0];

    const formData = new FormData();
    formData.append('email', candidate.email);
    formData.append('cv', {
      uri: file.uri,
      name: file.name,
      type: file.mimeType || 'application/octet-stream',
    } as any);

    try {
      const response = await fetch(`${API_BASE_URL}/candidates/upload-cv`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return Alert.alert('Upload failed', data.message || 'Something went wrong');
      }

      Alert.alert('Success', 'CV uploaded successfully!');
    } catch (error) {
      console.error('CV upload error:', error);
      Alert.alert('Error', 'Failed to upload CV');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome, {candidate.first_name}!</Text>

      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        value={candidate.first_name}
        onChangeText={(text) => setCandidate({ ...candidate, first_name: text })}
      />

      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        value={candidate.last_name}
        onChangeText={(text) => setCandidate({ ...candidate, last_name: text })}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={candidate.email}
        editable={false}
      />

      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        value={candidate.phone}
        onChangeText={(text) => setCandidate({ ...candidate, phone: text })}
      />

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        value={candidate.address}
        onChangeText={(text) => setCandidate({ ...candidate, address: text })}
      />

      <Text style={styles.label}>Job Title</Text>
      <TextInput
        style={styles.input}
        value={candidate.job_title}
        onChangeText={(text) => setCandidate({ ...candidate, job_title: text })}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>SAVE CHANGES</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.uploadButton} onPress={handleCVUpload}>
        <Text style={styles.buttonText}>Upload New CV</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f0f0f0', flex: 1 },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#b71c1c',
  },
  label: { marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  uploadButton: {
    backgroundColor: '#00796B',
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
