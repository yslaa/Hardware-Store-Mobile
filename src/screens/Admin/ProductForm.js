import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useContext, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import baseURL from '@assets/commons/baseurl'
import { Box, Input, Select, Toast } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import TitleContainer from '@shared/Form/TitleContainer'
import { Ionicons } from '@expo/vector-icons'
import RNPickerSelect from 'react-native-picker-select';
import EasyButton from '@shared/StyledComponents/EasyButton'
import * as ImagePicker from 'expo-image-picker'
import mime from "mime";
import AuthGlobal from "@context/Store/AuthGlobal"

const ProductForm = (props) => {
    const context = useContext(AuthGlobal)
    const [productName, setProductName] = useState('')
    const [type, setType] = useState('')
    const [classes, setClasses] = useState('')
    const [variant, setVariant] = useState('Local')
    const [price, setPrice] = useState('')
    const [stock, setStock] = useState('')
    const [image, setImage] = useState(null)
    const [user, setUser] = useState('')
    const [token, setToken] = useState('')
    const [mainImage, setMainImage] = useState('');
    const [error, setError] = useState('')
    const navigation = useNavigation()

    console.log("user:", context.stateUser.userProfile._id)
    AsyncStorage.getItem("jwt")
    .then((res)=>
    {
        setToken(res)
    })
    .catch((error) => console.log("Errors:", error))

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        if (!result.canceled) {
            console.log(result)
            setMainImage(result.assets[0].uri);
            setImage(result.assets[0].uri);
        }
    }

    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
        }
    }

    const addProduct = () =>
    {
        if ( productName === "" || type === "" || classes === "" || variant === "" || price === "" || stock === "" )
        {
            setError(" Fill in all fields ")
        }

        let formData = new FormData()
        const newImageUri = "file:///" + image.split("file:/").join("");
        
        formData.append("user", context.stateUser.userProfile._id);
        formData.append("product_name", productName)
        formData.append("type", type)
        formData.append("class", classes)
        formData.append("variant", variant)
        formData.append("price", price)
        formData.append("stock", stock)
        formData.append("image", {
            uri: newImageUri,
            type: mime.getType(newImageUri),
            name: newImageUri.split("/").pop()
        });

        axios
            .post(`${baseURL}products`, formData, config)
            .then((res) => {
                if(res.status === 200 || res.status === 201)
                {
                    Toast.show({
                        topOffset: 60,
                        type: "success",
                        text1: "Product Add Successfully"
                    })
                    setTimeout(() => {
                        navigation.navigate("Products")
                    }, 100)
                }
            })
            .catch((error) =>
            {
                console.log("Error:", error);
                console.log("Error Response:", error.response.data); 
                Toast.show({
                    topOffset: 60,
                    type: "error",
                    text1: "Something went wrong",
                    text2: "Please try again"
                })
            })
    }


  return (
   <TitleContainer title="Add Product">
        <View style={styles.imageContainer}>
      
        <Image style={styles.image} source={{ uri: mainImage }} />
   
            <TouchableOpacity
              onPress={pickImage}
              style={styles.imagePicker}>
              <Ionicons style={{color: "white"}} name="camera-outline" /> 
            </TouchableOpacity>
        </View>

        <View style={styles.label}>
             <Text style={{ textDecorationLine: "underline"}}>Product Name</Text>
        </View>
        <Input 
           placeholder='Product Name'
           name='productName'
           id='productName'
           value={productName}
           minWidth="90%"
           onChangeText={(text) => setProductName(text)}
           />

        <View style={styles.label}>
             <Text style={{ textDecorationLine: "underline"}}>Type</Text>
        </View>
        <Input 
           placeholder='Type'
           name='type'
           id='type'
           value={type}
           minWidth="90%"
           onChangeText={(text) => setType(text)}
           />

     

        <View style={styles.label}>
            <Text style={{ textDecorationLine: "underline"}}>Class</Text>
        </View>
        <Input 
           placeholder='Class'
           name='classes'
           id='classes'
           value={classes}
           minWidth="90%"
           onChangeText={(text) => setClasses(text)}
           />
        

        <View style={styles.label}>
    <Text style={{ textDecorationLine: "underline"}}>Variant</Text>
</View>

<Box>
            <Select
                minWidth="90%"
                placeholder="Select your Variant"
                selectedValue={variant}
                onValueChange={(value) => setVariant(value)}
            >
                <Select.Item label="Local" value="Local" />
                <Select.Item label="International" value="International" />
            </Select>
        </Box>
       
        <View style={styles.label}>
            <Text style={{ textDecorationLine: "underline"}}>Price</Text>
        </View>
        <Input 
           placeholder='Price'
           name='price'
           id='price'
           value={price}
           keyboardType={"numeric"}
           minWidth="90%"
           onChangeText={(text) => setPrice(text)}
           />
        <View style={styles.label}>
            <Text style={{ textDecorationLine: "underline"}}>Stock</Text>
        </View>
        <Input 
           placeholder='Stock'
           name='stock'
           id='stock'
           value={stock}
           keyboardType={"numeric"}
           minWidth="90%"
           onChangeText={(text) => setStock(text)}
           />

           {error ? <Error message={error} /> : null}
           <View style={styles.buttonContainer}>
             <EasyButton
             large 
             primary
             onPress={() => addProduct()}
             >
                <Text style={styles.buttonText}>Confirm</Text>
             </EasyButton>
           </View>
   </TitleContainer>
  )
}

const styles = StyleSheet.create({
    label: {
        width: "80%",
        marginTop: 10
    },
    buttonContainer: {
        width: "80%",
        marginBottom: 80,
        marginTop: 20,
        alignItems: "center"
    },
    buttonText: {
        color: "white"
    },
    imageContainer: {
        width: 200,
        height: 200,
        borderStyle: "solid",
        borderWidth: 8,
        padding: 0,
        justifyContent: "center",
        borderRadius: 100,
        borderColor: "#E0E0E0",
        elevation: 10
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 100
    },
    imagePicker: {
        position: "absolute",
        right: 5,
        bottom: 5,
        backgroundColor: "grey",
        padding: 8,
        borderRadius: 100,
        elevation: 20
    },pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: '80%',
    },

})

export default ProductForm