import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Medusa from "@medusajs/medusa-js"
import { Actions } from "react-native-router-flux";
import AsyncStorage from '@react-native-async-storage/async-storage';
const medusa = new Medusa({ baseUrl: "http://192.168.50.103:9000", maxRetries: 3 })

const storeUserInfo = async (userdata) => {

  const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
  await AsyncStorage.setItem("isLoggedIn", "true");
  const userData = JSON.stringify(userdata);
  await AsyncStorage.setItem("userData",userData)

}
const loginStateChange = async (data) => {
  storeUserInfo(data)
  Actions.products();

  console.log(currUserData.customer.first_name)


}
const Login = () => {

  const [username, setUsername] = useState('abhirajbhosle75@gmail.com');
  const [password, setPassword] = useState('12345');

  const handleLogin = () => {
    console.log('Username:', username);
    console.log('Password:', password);
    const requestBody = {
      "email": username,
      "password": password
    };

    // Make the API call with the JSON body
    fetch('http://192.168.50.103:9000/store/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data+"userData")
        loginStateChange(data)
      })
      .catch((error) => {
        console.error("Wrong Password");
      });



  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username or Email"
        onChangeText={(text) => setUsername(text)}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a', // Dark background color
  },
  title: {
    fontSize: 36,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#ffffff', // White color
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#333333', // Dark input background
    marginBottom: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    fontSize: 18,
    color: '#ffffff',
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#4caf50', // Green button background
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Login;
