import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from "react-native";
import Button from './Button';
import { ScrollView } from 'react-native-gesture-handler';
import { Image } from 'react-native';
export default function Demo() {
  const [data, setData] = useState(null);
  const [productData, setProductData] = useState([]);
  const [currSlocID, setCurrSlocID] = useState("sloc_01HCCQ7R8SYDYD5S5G1GWDSH26");
  const [filteredProductIds, setFilteredProductIds] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);

  const token = "eeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNyXzAxSEJRVjRKR1ZWUEhYMVI1MUhOUUZBQlZTIiwiZG9tYWluIjoiYWRtaW4iLCJpYXQiOjE2OTgzODA5NDAsImV4cCI6MTY5ODQ2NzM0MH0.grD-lSC8_1h_zx92i5dTNVD7dv3AQHABFyXrlUA6bys"; // Replace with your actual token
  
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:9000/admin/stock-locations", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const jsonData = await response.json();
      setData(jsonData.stock_locations);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchInventoryItems = async () => {
    try {
      const response = await fetch("http://localhost:9000/admin/inventory-items", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
  };

  const filterProducts =async () => {

    const filteredProducts = inventoryData.filter(item => {
      const location = item.location_levels.find(level => level.location_id === currSlocID);
      return location && location.available_quantity > 0;
    });
  
    const productIds = filteredProducts.map(item => {
      const variant = item.variants[0]; // Assuming there's only one variant, modify this logic if there are multiple variants
      return variant ? variant.product_id : null;
    });
  
    setFilteredProductIds(productIds.filter(id => id !== null)); // Filter out null product IDs
    const productPromises = productIds.filter(id => id !== null).map(data =>
        fetch(`http://192.168.50.103:9000/store/products/${data}`).then(response => response.json())
      );
    
      try {
        const products = await Promise.all(productPromises);
        const productData = products.map(data => data.product);
        console.log(productData[0].id)
        setProductData(productData);
        // console.log("temp", productData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
  };

  useEffect(() => {
    fetchData();
    fetchInventoryItems();
  }, []);


useEffect(()=>{
  fetchInventoryItems()
    filterProducts();
    
},[currSlocID])
  return (
    <View>
      {data && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 29 }}>
          {data.map(location => (
            <Button
            
              title={location.name}
              onPress={() => setCurrSlocID(location.id)}
            />
          ))}
        </View>
      )}
{console.log(filteredProductIds)}

        <ScrollView>
          
            {productData.map((data)=>{
                // {console.log(data)}
                return    <View style={styles.card}>
                <Image source={{ uri: data.thumbnail }} style={styles.thumbnail} />
                {console.log(data.thumbnail)}
                <Text style={styles.title}>{data.title}</Text>
                <Text style={styles.description}>{data.description}</Text>
                <Text style={styles.price}>Price: ${data.variants[0].prices[0].amount}</Text>
              </View>
            })}

            </ScrollView>    
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: 'grey',
    padding: 16,
    margin: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  thumbnail: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#FFFFFF',
  },
  description: {
    fontSize: 18,
    marginBottom: 8,
    color: '#FFFFFF',
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
  },
});
