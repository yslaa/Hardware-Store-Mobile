import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import baseURL from '@assets/commons/baseurl'
import Toast from 'react-native-toast-message'
import EasyButton from '@shared/StyledComponents/EasyButton'
import { Box, Input, Select } from 'native-base'
import TitleContainer from '@shared/Form/TitleContainer'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from "expo-image-picker"
import mime from "mime";
import { useNavigation } from '@react-navigation/native'

const BrandUpdate = (props) => {
    console.log("Update:",props.route.params.item._id)
    const [brandName, setBrandName] = useState('')
    const [variant, setVariant] = useState('')
    const [image, setImage] = useState([])
    const [user, setUser] = useState('')
    const [token, setToken] = useState('')
    const [mainImage, setMainImage] = useState('');
    const [error, setError] = useState('')
    const [item, setItem] = useState(null);
    const navigation = useNavigation()
    // console.log(stock)
    // console.log(price)
    // console.log(variant)
    // console.log(item)
    // console.log("iamge:",image)
    useEffect(() =>
    {
        
        setItem(props.route.params.item);
        setBrandName(props.route.params.item.brand_name)
        setVariant(props.route.params.item.variant)
        const imageURLs = props.route.params.item.image.map(imageObj => imageObj.url);
        setImage(imageURLs);
        
        AsyncStorage.getItem("jwt")
        .then((res)=>
        {
            setToken(res)
        })
        .catch((error) => console.log("Errors:", error))
    },[])

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
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

    const updateBrand = () => {
        if (brandName === "" || variant === "") {
            setError(" Fill in all fields ")
            return; 
        }
    
        let formData = new FormData();
        formData.append("brand_name", brandName);
        formData.append("variant", variant);
        if (image.length !== props.route.params.item.image.length) {
            image.forEach((imageUri, index) => {
                const newImageUri = "file:///" + imageUri.split("file:/").join("");
                formData.append('image', {
                    uri: newImageUri,
                    type: mime.getType(newImageUri),
                    name: `image_${index}.jpg`,
                });
            });
        }

        axios.patch(`${baseURL}brand/edit/${item._id}`, formData, config)
            .then((res) => {
                if (res.status === 200 || res.status === 201) {
                    Toast.show({
                        topOffset: 60,
                        type: "success",
                        text1: "Brand Update Successfully"
                    })
                    setTimeout(() => {
                        navigation.navigate("Brand")
                    }, 100)
                }
            })
            .catch((error) => {
                console.log("Error:", error);
                console.log("Error Response:", error.response.data);
                Toast.show({
                    topOffset: 60,
                    type: "error",
                    text1: "Something went wrong",
                    text2: "Please try again"
                });
            });
    }

  return (
    <TitleContainer title="Edit Brand">
    <TouchableOpacity onPress={pickImage}>
                <Text style={styles.selectImageButton}>Select Images</Text>
            </TouchableOpacity>
            <ScrollView horizontal>
    {image.length > 0 && image.map((imageUri, index) => (
        <View key={index}>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <TouchableOpacity onPress={() => deleteImage(index)} style={styles.deleteButton}>
                <Ionicons name="close-outline" size={25} color="white" style={{ fontWeight: 'bold' }} />
            </TouchableOpacity>
        </View>
    ))}
</ScrollView>

    <View style={styles.label}>
         <Text style={{ textDecorationLine: "underline"}}>Brand Name</Text>
    </View>
    <Input 
       placeholder='Brand Name'
       name='brandName'
       id='brandName'
       value={brandName}
       minWidth="90%"
       onChangeText={(text) => setBrandName(text)}
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

       {error ? <Error message={error} /> : null}
       <View style={styles.buttonContainer}>
         <EasyButton
         large 
         primary
         onPress={() => updateBrand()}
         >
            <Text style={styles.buttonText}>Update</Text>
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
    },
    selectImageButton: {
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
export default BrandUpdate