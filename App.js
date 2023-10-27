import { Router, Scene, Stack } from "react-native-router-flux";
import Products from "./screens/Products";
import ProductInfo from "./screens/ProductInfo";
import axios from "axios";
import baseURL from "./constants/url";
import { useEffect } from "react";
import Cart from "./screens/Cart";
import Checkout from "./screens/Checkout";
import { Provider as PaperProvider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { publishable_key } from "./constants/stripe";
import { StripeProvider } from "@stripe/stripe-react-native";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Demo from "./components/Demo";
export default function App() {
  const getCartId = () => {
    axios.post(`${baseURL}/store/carts`).then((res) => {
      AsyncStorage.setItem("cart_id", res.data.cart.id);
    });
  };
  // Check cart_id
  const checkCartId = async () => {
    const cartId = await AsyncStorage.getItem("cart_id");
    if (!cartId) {
      getCartId();
    }
  };

  useEffect(() => {
    checkCartId();
  }, []);

  return (
    <StripeProvider publishableKey={publishable_key}>
      <PaperProvider>
        <Router>
          <Stack key="root">
            <Scene key="products" component={Products} hideNavBar />
            <Scene key="ProductInfo" component={ProductInfo} hideNavBar />
            <Scene key="cart" component={Cart} hideNavBar />
            <Scene key="checkout" component={Checkout} hideNavBar />
            <Scene key="login" initial component={Login} hideNavBar/>
            <Scene key="profile"  component={Profile} hideNavBar/>
            <Scene key="demo"  component={Demo} hideNavBar/>

            
          </Stack>
        </Router>
      </PaperProvider>
    </StripeProvider>
  );
}