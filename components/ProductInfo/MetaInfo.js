import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import { height, heightToDp } from "rn-responsive-screen";
import { TouchableOpacity } from "react-native-gesture-handler";
import Button from "../Button";
import axios from "axios";
import baseURL from "../../constants/url";
import { useEffect } from "react";
import token from "../../constants/Token";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function MetaInfo({ product }) {
  const [activeSize, setActiveSize] = useState(0);
  const [activelocation, setActivelocation] = useState(0);

  const [locationdata, setlocationData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [currLocation,SetcurrLocation]=useState("")
  const [currVariant,setVariant]=useState(product.variants[0].id)
  const [stockStatus,setstockStatus]=useState("Loading..")
  const [currInventoryID,setcurriInventoryID]=useState("")
  




  function getAvailableQuantity(productId, variantId, stockLocationId) {
    let variantsData=null
    let foundData=false
    // Find the product with the given productId
    inventoryData.map(data=>{
     data.variants.map((data2)=>{
      if(data2.id==variantId){
       data.location_levels.map(location=>{
        if(location.location_id==stockLocationId)
        {
          foundData=true
          setcurriInventoryID(data.id)
          setstockStatus(location.available_quantity)
          console.log(location.available_quantity)
          console.log(data.id)
          
        }
  
       })
      }
     })
    })

if(!foundData)setstockStatus(0)
    
}

  const addToCart = async () => {
    const cartId = await AsyncStorage.getItem("cart_id");

    axios
      .post(baseURL + "/store/carts/" + cartId + "/line-items", {
        variant_id: product.variants[0].id,
        quantity: 1,
      })
      .then(({ data }) => {
        alert(`Item ${product.title} added to cart`);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  async function HandleOrderclick() {
    if(stockStatus<=0)return
    const stockQuantity = stockStatus-1; // Replace 10 with the actual stock quantity you want to send
  
    try {
      const response = await fetch(`http://localhost:9000/admin/inventory-items/${currInventoryID}/location-levels/${currLocation}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "stocked_quantity": stockQuantity }) // Include stock quantity in the request body
      });
  
      if (response.ok) {
        const jsonData = await response.json();
        setInventoryData(jsonData.inventory_items);
      } else {
        console.error('Error:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    fetchInventoryItems()
  }
  
  const fetchInventoryItems = async () => {
    try {
      const response = await fetch("http://localhost:9000/admin/inventory-items", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      {console.log(currInventoryID)}

      if (response.ok) {
        const jsonData = await response.json();
        setInventoryData(jsonData.inventory_items);
      } else {
        console.error('Error:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:9000/admin/stock-locations", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const jsonData = await response.json();
      setlocationData(jsonData.stock_locations);
      SetcurrLocation(jsonData.stock_locations[0].id)
    } catch (error) {
      console.error('Error:', error);
    }
  };
  useEffect(()=>{
    fetchInventoryItems()
    fetchData();
    getAvailableQuantity()
  },[])
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {console.log(product.id)}
        <Text style={styles.title}>{product.title}</Text>
        <View>
          <Text style={styles.price}>
            ${product.variants[0].prices[1].amount / 100}
          </Text>
          <Text style={styles.star}>⭐⭐⭐</Text>
        </View>
      </View>
      <Text style={styles.heading}>Available Sizes</Text>
      <View style={styles.row}>
        {product.options[0].values.map((size, index) => (
          <TouchableOpacity onPress={() => {
            setActiveSize(index)
       setVariant(size.variant_id)
          }
          }>
            
            <Text
              style={[
                styles.sizeTag,
                {
                  borderWidth: activeSize === index ? 3 : 0,
                  backgroundColor:product.variants[index].metadata ? product.variants[index].metadata.hexvalue : ""
                },
              ]}
            >
                    
              {size.value}
            </Text>

          </TouchableOpacity>
        ))}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 29 }}>
      {
        locationdata.map((data,index)=>{
          if(data==null)return
          return <TouchableOpacity   style={[
            styles.sizeTag,
            {
              borderWidth: activelocation === index ? 3 : 0,

            }
          ]} onPress={() => {
            setActivelocation(index)
            SetcurrLocation(data.id)
          }
          }>
          <Button title={data.name} onPress={()=>{
            // SetcurrLocation(data.id)
          }
            }/>
          </TouchableOpacity >
        })
      }
      </View>
      <Text style={styles.heading}>Description</Text>
      <Text style={styles.description}>{product.description}</Text>
      <Text>Stock Available:  {stockStatus}</Text>
        <Button title="Get Data" onPress={()=>getAvailableQuantity(product.id,currVariant,currLocation)}/>
        <Button style={{marginTop:14}} title="Order" onPress={HandleOrderclick}/>
      <Button onPress={addToCart} title="Add to Cart" large={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: heightToDp(-5),
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: heightToDp(5),
  },
  title: {
    fontSize: heightToDp(6),
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: heightToDp(5),
    fontWeight: "bold",
    color: "#C37AFF",
  },
  heading: {
    fontSize: heightToDp(5),
    marginTop: heightToDp(3),
  },
  star: {
    fontSize: heightToDp(3),
    marginTop: heightToDp(1),
  },
  sizeTag: {
    borderColor: "#C37AFF",
    backgroundColor: "#F7F6FB",
    color: "#000",
    paddingHorizontal: heightToDp(7),
    paddingVertical: heightToDp(2),
    borderRadius: heightToDp(2),
    marginTop: heightToDp(2),
    overflow: "hidden",
    fontSize: heightToDp(4),
    marginBottom: heightToDp(2),
  },
  description: {
    fontSize: heightToDp(4),
    color: "#aaa",
    marginTop: heightToDp(2),
  },
});
