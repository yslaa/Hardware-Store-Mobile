import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import baseURL from '@assets/commons/baseurl'
import { Box, Input, ScrollView, Select } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import TitleContainer from '@shared/Form/TitleContainer'
import { Ionicons } from '@expo/vector-icons'
import EasyButton from '@shared/StyledComponents/EasyButton'
import * as ImagePicker from 'expo-image-picker'
import mime from "mime";
import AuthGlobal from "@context/Store/AuthGlobal"
import Toast from 'react-native-toast-message'

const ProductForm = (props) => {
    const context = useContext(AuthGlobal)
    const [productName, setProductName] = useState('')
    const [type, setType] = useState('')
    const [classes, setClasses] = useState('')
    const [variant, setVariant] = useState('Local')
    const [price, setPrice] = useState('')
    const [stock, setStock] = useState('')
    const [image, setImage] = useState([])
    const [user, setUser] = useState('')
    const [token, setToken] = useState('')
    const [mainImage, setMainImage] = useState('');
    const [error, setError] = useState('')
    const [brands, setBrands] = useState([])
    const [pickerValues, setPickerValues] = useState('')
    const navigation = useNavigation()
 console.log(image)
//  console.log(brands.details.brand_name)
    // console.log("user:", context.stateUser.userProfile._id)
    console.log(pickerValues)
    useEffect(() => {
        AsyncStorage.getItem("jwt")
        .then((res)=>
        {
            setToken(res)
        })
        .catch((error) => console.log("Errors:", error))
    })
    
    useEffect(() => {
                AsyncStorage.getItem("jwt")
                    .then((res) => {
                        setToken(res)
                        axios
                            .get(`${baseURL}brands`, {
                                headers: { Authorization: `Bearer ${res}` }
                            })
                            .then((res) => {
                                console.log(res.data)
                                setBrands(res.data);
                                setLoading(false);
                            })
                            .catch((error) => console.log(error));
                    })
                    .catch((error) => console.log(error))
            },
            [],
        )

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            console.log(result)
            setMainImage(prevImages => [...prevImages, result.uri]);
            setImage(prevImages => [...prevImages, result.uri]);
        }
    }

    const deleteImage = (index) => {
        setImage(prevImages => prevImages.filter((_, i) => i !== index));
    }

    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
        }
    }

    const addProduct = () =>
    {
        if ( productName === "" || type === "" || brands === "" || classes === "" || price === "" || stock === "" || image.length === 0)
        {
            setError(" Fill in all fields ")
        }

        let formData = new FormData()
        // const newImageUri = "file:///" + image.split("file:/").join("");
        
        formData.append("user", context.stateUser.userProfile._id);
        formData.append("product_name", productName)
        formData.append("type", type)
        formData.append("brand", pickerValues)
        formData.append("class", classes)
        formData.append("price", price)
        formData.append("stock", stock)
        image.forEach((imageUri) => {
            const newImageUri = "file:///" + imageUri.split("file:/").join("");
            formData.append("image", {
                uri: newImageUri,
                type: mime.getType(newImageUri),
                name: newImageUri.split("/").pop(),
            });
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
         <TouchableOpacity onPress={pickImage}>
                <Text style={styles.selectImageButton}>Select Images</Text>
            </TouchableOpacity>
            <ScrollView horizontal>
               {image.map((imageUri, index) => (
        <View key={index} >
            <Image source={{ uri: imageUri }} style={styles.image} />
            <TouchableOpacity onPress={() => deleteImage(index)} style={styles.deleteButton}>
                <Ionicons name="close-outline" size={25} color="white" style={{ fontWeight: 'bold' }} />
            </TouchableOpacity>
        </View>
    ))}
            </ScrollView>

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

<Box>
            <Select
                minWidth="90%"
                placeholder="Select your Variant"
                selectedValue={type}
                onValueChange={(value) => setType(value)}
            >
                <Select.Item label="Door Accessories" value="Door Accessories" />
                <Select.Item label="Machinery Equipment" value="Machinery Equipment" />
                <Select.Item label="Hand Tools" value="Hand Tools" />
                <Select.Item label="Safety and Security" value="Safety and Security" />
                <Select.Item label="Power Tools" value="Power Tools" />
                <Select.Item label="Painting" value="Painting" />
                <Select.Item label="Electrical" value="Electrical" />
                <Select.Item label="Lighting" value="Lighting" />
                <Select.Item label="Building Materials" value="Building Materials" />
            </Select>
        </Box>

        <View style={styles.label}>
    <Text style={{ textDecorationLine: "underline"}}>Brand</Text>
</View>

<Box>
            <Select
                minWidth="90%"
                placeholder="Select your Brand"
                selectedValue={pickerValues}
                onValueChange={(value) => setPickerValues(value)}
            >
                {brands && brands.details && brands.details.map((brand, index) => (
               <Select.Item 
               key={brand._id} 
               label={brand.brand_name} 
               value={brand._id} />
                 ))}
               
               
            </Select>
        </Box>


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
    image: {
        width: 100,
        height: 100,
        marginHorizontal: 5,
        borderRadius: 5,
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
    },selectImageButton: {
        fontSize: 16,
        color: 'blue',
        textDecorationLine: 'underline',
        marginBottom: 10,
    },deleteButton: {
        position: 'absolute',
        top: 5,
        right: 10,
        backgroundColor: 'transparent',
    },

})

export default ProductForm