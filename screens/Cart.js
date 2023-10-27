import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import baseURL from "../constants/url";
import Toast from "../components/Toast";
import CartItem from "../components/CartItem";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { width, widthToDp } from "rn-responsive-screen";
import Button from "../components/Button";
import { Actions } from "react-native-router-flux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from "react-native-gesture-handler";
export default function Cart() {
  const [cart, setCart] = useState([]);
  const [discountCode,setDiscountCode]=useState("")

  const fetchCart = async () => {
    // Get the cart id from the device storage
    const cartId = await AsyncStorage.getItem("cart_id");
    // Fetch the products from the cart API using the cart id
    axios.get(`${baseURL}/store/carts/${cartId}`).then(({ data }) => {
      // Set the cart state to the products in the cart
      console.log(data)
      setCart(data.cart);
    });
  };
async function applyDiscount(){
  const cartId = await AsyncStorage.getItem("cart_id");
const requestBody = {
  discounts: [
    {
      code: discountCode
    }
  ],
  region_id: 'reg_01HBQV4JHVC9EJNBQMB0HPBZHE'
};

fetch(`http://192.168.50.103:9000/store/carts/${cartId}`, {
  method: 'POST', // You can change the HTTP method if needed
  headers: {
    'Content-Type': 'application/json'
    // Add any other headers if required
  },
  body: JSON.stringify(requestBody)
})
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Network response was not ok.');
  })
  .then(data => {
    console.log('Success:', data);
    // Handle the successful response here
  })
  .catch(error => {
    console.error('Error:', error);
    // Handle errors here
  });
  fetchCart();
}
async function removeDisount()
{
  const cartId = await AsyncStorage.getItem("cart_id");
const requestBody = {
  discounts: [
    {
      code: discountCode
    }
  ],
  region_id: 'reg_01HBQV4JHVC9EJNBQMB0HPBZHE'
};

fetch(`http://192.168.50.103:9000/store/carts/${cartId}/discounts/${discountCode}`, {
  method: 'DELETE', // You can change the HTTP method if needed
  headers: {
    'Content-Type': 'application/json'
    // Add any other headers if required
  },
  body: JSON.stringify(requestBody)
})
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Network response was not ok.');
  })
  .then(data => {
    console.log('Success:', data);
    // Handle the successful response here
  })
  .catch(error => {
    console.error('Error:', error);
    // Handle errors here
  });

  fetchCart();
  
}
  useEffect(() => {
    // Calling the fetchCart function when the component mounts
    fetchCart();
  }, []);
  return (
    // SafeAreaView is used to avoid the notch on the phone

    <SafeAreaView style={[styles.container]}>
      {/* SchrollView is used in order to scroll the content */}
      <ScrollView contentContainerStyle={styles.container}>
        {/* Using the reusable header component */}
        <Header title="My Cart" />

        {/* Mapping the products into the Cart component */}
        {cart?.items?.map((product) => (
          <CartItem product={product} />
        ))}
      </ScrollView>
      {/* Creating a seperate view to show the total amount and checkout button */}
      <View>
        <View style={styles.row}>
          <Text style={styles.cartTotalText}>Items</Text>

          {/* Showing Cart Total */}
          <Text
            style={[
              styles.cartTotalText,
              {
                color: "#4C4C4C",
              },
            ]}
          >
            {/* Dividing the total by 100 because Medusa doesn't store numbers in decimal */}
            ${cart?.subtotal / 100}
          </Text>
        </View>
        <View style={styles.row}>
          {/* Showing the discount (if any) */}
          <Text style={styles.cartTotalText}>Discount</Text>
          <Text
            style={[
              styles.cartTotalText,
              {
                color: "#4C4C4C",
              },
            ]}
          >
            - ${cart?.discount_total / 100}
          </Text>
        </View>
        {console.log(discountCode)}
        <View style={[styles.row, styles.total]}>
          <Text style={styles.cartTotalText}>Total</Text>
          <Text
            style={[
              styles.cartTotalText,
              {
                color: "#4C4C4C",
              },
            ]}
          >
            {/* Calculating the total */}$
            {cart?.subtotal / 100 - cart?.discount_total / 100}
          </Text>
        </View>
        {
  cart.discount_total > 0 ? (
    <View style={{ backgroundColor: '#4CAF50', padding: 10, borderRadius: 5, marginBottom: 10 }}>
      <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>Discount Applied  <Button onPress={()=>removeDisount()} title={"Delete"}/></Text>
   
    </View>
  ) : (
    <View style={{ marginBottom: 10 }}>
      <TextInput
        value={discountCode}
        onChangeText={(text) => setDiscountCode(text)}
        placeholder="Enter your CODE here"
        style={{
          borderWidth: 1,
          borderColor: 'red',
          backgroundColor: '#e3e3e3',
          height: 40,
          paddingHorizontal: 10,
          marginBottom: 8,
          borderRadius: 5,
        }}
      />
      <Button title="Apply" onPress={applyDiscount} style={{ backgroundColor: '#4CAF50', color: 'white', padding: 10, borderRadius: 5 }} />
    </View>
  )
}


        <View>
          {/* A button to navigate to checkout screen */}
          <Button
            large={true}
            onPress={() => {
              Actions.checkout({
                cart,
              });
            }}
            title={cart?.items?.length > 0 ? "Checkout" : "Empty Cart"}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

// Styles....
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: widthToDp(90),
    marginTop: 10,
  },
  total: {
    borderTopWidth: 1,
    paddingTop: 10,
    borderTopColor: "#E5E5E5",
    marginBottom: 10,
  },
  cartTotalText: {
    fontSize: widthToDp(4.5),
    color: "#989899",
  },
});
