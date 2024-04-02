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

const ReviewUpdate = (props) => {
    const navigation = useNavigation();
    const [productName, setProductName] = useState('');
    const [type, setType] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [image, setImage] = useState([]);
    const [pickerValues, setPickerValues] = useState('');
    const [brands, setBrands] = useState([]);
    const [error, setError] = useState('');
    const [item, setItem] = useState(null);
    const [token, setToken] = useState('');

    useEffect(() => {
        setItem(props.route.params.item);
        setProductName(props.route.params.item.product_name);
        setType(props.route.params.item.type);
        setPrice(props.route.params.item.price.toString());
        setStock(props.route.params.item.stock.toString());
        setPickerValues(props.route.params.item.brand);
        const imageURLs = props.route.params.item.image.map(imageObj => imageObj.url);
        setImage(imageURLs);

        AsyncStorage.getItem('jwt')
            .then((res) => {
                setToken(res);
            })
            .catch((error) => console.log('Errors:', error));
    }, []);

    useEffect(() => {
        AsyncStorage.getItem('jwt')
            .then((res) => {
                setToken(res);
                axios
                    .get(`${baseURL}brands`, {
                        headers: { Authorization: `Bearer ${res}` },
                    })
                    .then((res) => {
                        setBrands(res.data);
                    })
                    .catch((error) => console.log(error));
            })
            .catch((error) => console.log(error));
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(prevImages => [...prevImages, result.uri]);
        }
    };

    const deleteImage = (index) => {
        setImage(prevImages => prevImages.filter((_, i) => i !== index));
    };

    const updateProduct = () => {
        if (productName === '' || type === '' || pickerValues === '' || price === '' || stock === '') {
            setError('Fill in all fields');
            return;
        }
    
        let formData = new FormData();
        formData.append("product_name", productName)
        formData.append("type", type)
        formData.append("brand", pickerValues)
        formData.append("price", price)
        formData.append("stock", stock)
    
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
    
        axios.patch(`${baseURL}product/edit/${item._id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
            },
        })
        .then((res) => {
            if (res.status === 200 || res.status === 201) {
                Toast.show({
                    topOffset: 60,
                    type: 'success',
                    text1: 'Product Updated Successfully',
                });
                navigation.navigate('Products');
            }
        })
        .catch((error) => {
            console.log('Error:', error);
            console.log('Error Response:', error.response.data);
            Toast.show({
                topOffset: 60,
                type: 'error',
                text1: 'Something went wrong',
                text2: 'Please try again',
            });
        });
    };


  return (
    <TitleContainer title="Add Product">
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
                placeholder="Select your Type"
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
    <Text style={{ textDecorationLine: "underline" }}>Brand</Text>
</View>

<Box>
    <Select
        minWidth="90%"
        placeholder="Select your Brand"
        selectedValue={pickerValues}
        onValueChange={(value) => setPickerValues(value)}
    >
        {brands && brands.details && brands.details.map((brand) => (
            <Select.Item 
                key={brand._id} 
                label={brand.brand_name} 
                value={brand._id} 
            />
        ))}
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
         onPress={() => updateProduct()}
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
export default ReviewUpdate