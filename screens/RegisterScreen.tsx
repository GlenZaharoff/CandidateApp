import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { API_BASE_URL } from '../constants/config';

export default function RegisterScreen() {
  type CVAsset = {
    uri: string;
    name: string;
    mimeType?: string;
    [key: string]: any;
  };

  const [form, setForm] = useState<{
    firstName: string;
    lastName: string;
    iqamaNumber: string;
    address: string;
    jobTitle: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    cv: CVAsset | null;
  }>({
    firstName: '',
    lastName: '',
    iqamaNumber: '',
    address: '',
    jobTitle: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    cv: null,
  });

  const handleChange = (name: string, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
      });
      if (!result.canceled && result.assets.length > 0) {
        handleChange('cv', result.assets[0]);
      }
    } catch (error) {
      console.log('Document pick error:', error);
    }
  };

  const handleSubmit = async () => {
    const {
      firstName,
      lastName,
      iqamaNumber,
      address,
      jobTitle,
      email,
      phone,
      password,
      confirmPassword,
      cv,
    } = form;

    if (
      !firstName ||
      !lastName ||
      !address ||
      !jobTitle ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword ||
      !cv
    ) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('iqamaNumber', iqamaNumber);
    formData.append('address', address);
    formData.append('jobTitle', jobTitle);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('password', password);
    formData.append('cv', {
      uri: cv.uri,
      name: cv.name,
      type: cv.mimeType || 'application/pdf',
    } as any);

    try {
      const response = await fetch(`${API_BASE_URL}/candidates/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network error');
      }

      const data = await response.json();
      Alert.alert('Success', 'Candidate registered!');
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', 'Failed to submit form');
    }
  };

  const isFormValid =
    Object.values(form).every((value) => value && value !== '') &&
    form.password === form.confirmPassword;

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={100}
    >
      <Image
        source={{
          uri: 'https://static.wixstatic.com/media/7a7012_37fc018a06c64702b2931771875639a8~mv2.png',
        }}
        style={styles.logo}
      />
      <Text style={styles.title}>New Candidate Registration Form</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name*"
        onChangeText={(text) => handleChange('firstName', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name*"
        onChangeText={(text) => handleChange('lastName', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Iqama Number"
        onChangeText={(text) => handleChange('iqamaNumber', text)}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.address}
          onValueChange={(value) => handleChange('address', value)}
        >
          <Picker.Item label="Select your city..." value="" color="#999" />
          <Picker.Item label="Riyadh" value="Riyadh" />
          <Picker.Item label="Jeddah" value="Jeddah" />
          <Picker.Item label="Mecca" value="Mecca" />
          <Picker.Item label="Medina" value="Medina" />
          <Picker.Item label="Dammam" value="Dammam" />
          <Picker.Item label="Khobar" value="Khobar" />
          <Picker.Item label="Abha" value="Abha" />
          <Picker.Item label="Tabuk" value="Tabuk" />
          <Picker.Item label="Najran" value="Najran" />
          <Picker.Item label="Hail" value="Hail" />
          <Picker.Item label="Al Qassim" value="Al Qassim" />
          <Picker.Item label="Jubail" value="Jubail" />
          <Picker.Item label="Yanbu" value="Yanbu" />
          <Picker.Item label="Al Baha" value="Al Baha" />
          <Picker.Item label="Al Hofuf" value="Al Hofuf" />
          <Picker.Item label="Al Mubarraz" value="Al Mubarraz" />
          <Picker.Item label="Sakaka" value="Sakaka" />
          <Picker.Item label="Arar" value="Arar" />
          <Picker.Item label="Al Khafji" value="Al Khafji" />
          <Picker.Item label="Al Qurayyat" value="Al Qurayyat" />
          <Picker.Item label="Taif" value="Taif" />
          <Picker.Item label="Buraidah" value="Buraidah" />
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.jobTitle}
          onValueChange={(value) => handleChange('jobTitle', value)}
        >
          <Picker.Item label="Select job title..." value="" color="#999" />
          <Picker.Item label="Waiter" value="Waiter" />
          <Picker.Item label="Housekeeper" value="Housekeeper" />
          <Picker.Item label="Host" value="Host" />
          <Picker.Item label="Restaurant Manager" value="Restaurant Manager" />
          <Picker.Item label="Resort Manager" value="Resort Manager" />
          <Picker.Item label="Concierge" value="Concierge" />
          <Picker.Item label="Bartender" value="Bartender" />
          <Picker.Item label="Chef" value="Chef" />
          <Picker.Item label="Front Desk Agent" value="Front Desk Agent" />
          <Picker.Item label="Bellhop" value="Bellhop" />
          <Picker.Item label="Event Coordinator" value="Event Coordinator" />
          <Picker.Item label="Spa Therapist" value="Spa Therapist" />
          <Picker.Item label="Lifeguard" value="Lifeguard" />
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Email (Username)*"
        keyboardType="email-address"
        onChangeText={(text) => handleChange('email', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone number*"
        keyboardType="phone-pad"
        onChangeText={(text) => handleChange('phone', text)}
      />

      <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
        <Text style={styles.uploadButtonText}>
          {form.cv ? form.cv.name : 'Upload your CV (PDF/DOCX)*'}
        </Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Create Password*"
        secureTextEntry
        onChangeText={(text) => handleChange('password', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password*"
        secureTextEntry
        onChangeText={(text) => handleChange('confirmPassword', text)}
      />

      <TouchableOpacity
        style={[styles.button, !isFormValid && { backgroundColor: '#ccc' }]}
        onPress={handleSubmit}
        disabled={!isFormValid}
      >
        <Text style={styles.buttonText}>REGISTER</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  pickerContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 12,
  },
  uploadButton: {
    backgroundColor: '#eee',
    padding: 14,
    borderRadius: 6,
    width: '100%',
    marginBottom: 12,
  },
  uploadButtonText: {
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#ED1C24',
    paddingVertical: 14,
    borderRadius: 6,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
