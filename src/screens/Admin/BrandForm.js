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

const BrandForm = (props) => {
    const context = useContext(AuthGlobal)
    const [brandName, setBrandName] = useState('')
    const [variant, setVariant] = useState('Local')
    const [image, setImage] = useState([])
    const [token, setToken] = useState('')
    const [mainImage, setMainImage] = useState('');
    const [error, setError] = useState('')
    const navigation = useNavigation()
 console.log(image)
    // console.log("user:", context.stateUser.userProfile._id)
    useEffect(() => {
        AsyncStorage.getItem("jwt")
        .then((res)=>
        {
            setToken(res)
        })
        .catch((error) => console.log("Errors:", error))
    })
    

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

    const addBrand = () =>
    {
        if ( brandName === "" || variant === "" || image.length === 0)
        {
            setError(" Fill in all fields ")
        }

        let formData = new FormData()
        // const newImageUri = "file:///" + image.split("file:/").join("");
      
        formData.append("user", context.stateUser.userProfile._id);
        formData.append("brand_name", brandName)
        formData.append("variant", variant)
        image.forEach((imageUri) => {
            const newImageUri = "file:///" + imageUri.split("file:/").join("");
            formData.append("image", {
                uri: newImageUri,
                type: mime.getType(newImageUri),
                name: newImageUri.split("/").pop(),
            });
        });

        axios
            .post(`${baseURL}brands`, formData, config)
            .then((res) => {
                if(res.status === 200 || res.status === 201)
                {
                    Toast.show({
                        topOffset: 60,
                        type: "success",
                        text1: "Brand Add Successfully"
                    })
                    setTimeout(() => {
                        navigation.navigate("Brands")
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
  <TitleContainer title="Add Brand">
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
          onPress={() => addBrand()}
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

export default BrandForm