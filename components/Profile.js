import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { useEffect } from 'react';
import Button from './Button';
import { Image } from 'react-native';



export default function Profile() {
const [sales_channelsID,Setsales_channelsID]=useState("sc_01HBQV4JFSBEJ9XFK8V4Y9CGCK")
const [productsData,SetproductsData]=useState([])

  useEffect(()=>{
fetchproducts()
  },[sales_channelsID])
 
function fetchproducts(){
  fetch(`http://localhost:9000/store/products?sales_channel_id[0]=${sales_channelsID}`).then((Response)=>{
    return Response.json();
  }).then((data)=>{
SetproductsData(data.products)

  })
}
function helper(id)
{
if(sales_channelsID==id)return;
Setsales_channelsID(id)
}
  return (
    <View>
      <View style={{flexDirection:'row', flexWrap:'wrap',marginTop:34}}>
<Button title={"store 1"} onPress={()=>helper("sc_01HBQV4JFSBEJ9XFK8V4Y9CGCK")}/>
<Button title={"store 2"} onPress={()=>helper("sc_01HC44C7WJW5D26GZ3RJZHD3S1")}/>
</View>

{
  productsData.map((data)=>{
return <View>
        <Image
        source={{
          uri: data.thumbnail,
        }}
      style={{width:123,height:134}}
      />
  <Text>{data.title}</Text>
</View>
  })
}
    </View>
  )
}