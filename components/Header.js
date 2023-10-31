import { View, Image, StyleSheet, Text } from "react-native";
import React from "react";
import { widthToDp } from "rn-responsive-screen";
import { Actions } from "react-native-router-flux";
import { TouchableOpacity } from "react-native-gesture-handler";
import Button from "./Button";
TouchableOpacity
export default function Header({ title }) {
  return (
    <View>
    <View style={styles.container}>
  
      <Image
        source={{
          uri: "https://user-images.githubusercontent.com/7554214/153162406-bf8fd16f-aa98-4604-b87b-e13ab4baf604.png",
        }}
        style={styles.logo}
      />
      
      <Text style={styles.title}>{title}</Text>
      </View>



    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: widthToDp(100),
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
  },
  logo: {
    width: 50,
    height: 50,
  },
  profilelogo:{
    width:40,
    height:43,
   position:"absolute",
    top:-23,
    right:5,
    borderRadius:50,
  }
});
