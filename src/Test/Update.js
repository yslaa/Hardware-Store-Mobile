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

const ProductUpdate = (props) => {
    // Props yung props yan yung mga properties na pinapasa sa component
    // props.route.params.item is pinapasa yung object na nasa Products.js
    // console.log("Update:",props.route.params.item._id)

    // Here na yung mga state na gagamitin mo sa component  sa part na to para siyan variable example si setproductName dito sineset mo yung value ng productName
    const [productName, setProductName] = useState('')
    const [type, setType] = useState('')
    const [classes, setClasses] = useState('')
    const [variant, setVariant] = useState('')
    const [price, setPrice] = useState('')
    const [stock, setStock] = useState('')
    const [image, setImage] = useState([])
    const [user, setUser] = useState('')
    const [token, setToken] = useState('')
    const [mainImage, setMainImage] = useState('');
    const [error, setError] = useState('')
    const [item, setItem] = useState(null);

    // nvigation eto is to navigate to other screen para ma redirect yung user sa ibang screen
    // U need to import the useNavigation from react-navigation/native
    const navigation = useNavigation()

    // console.log(stock)
    // console.log(price)
    // console.log(variant)
    // console.log(item)
    // console.log("iamge:",image)
     // kung gusto mo makita yung item gamitin mo yung console.log(item) or console.log("item:",props.route.params)
     // useEffect eto yung parang component na pwede mo gamitin para mag fetch ng data or mag set ng data
    useEffect(() =>
    {
        // setItem(props.route.params.item) eto yung pag set ng item na nsa props.route.params.item
        setItem(props.route.params.item);
        setProductName(props.route.params.item.product_name)
        setType(props.route.params.item.type)
        setClasses(props.route.params.item.class)
        setPrice(props.route.params.item.price.toString())
        setStock(props.route.params.item.stock.toString())
        setVariant(props.route.params.item.variant)
        const imageURLs = props.route.params.item.image.map(imageObj => imageObj.url);
        setImage(imageURLs);

          // AsyncStorage.getItem("jwt") eto yung token naka store sa async storage kasi when you login may token bali doon na store yung token
        // need mo to for create,patch, delete if require ng token yun api
        AsyncStorage.getItem("jwt")
        .then((res)=>
        {
            setToken(res)
        })
        .catch((error) => console.log("Errors:", error))
    },[])


    // PickImage eto yung function na mag pop up yung image picker para makapili ng image
    // need mo import eto import * as ImagePicker from 'expo-image-picker' para sa image picker
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        if (!result.canceled) {
            console.log(result)
            // dito sa part nato yun prevImages is eto yung naka save na image sa state and the result.uri eto yung kinuha mong image sa image picker
            setMainImage(prevImages => [...prevImages, result.uri]);
            setImage(prevImages => [...prevImages, result.uri]);
        }
    }

     // Eto is just to delete the image na kinuha mo sa image picker
    const deleteImage = (index) => {
        setImage(prevImages => prevImages.filter((_, i) => i !== index));
    }

     // eto yung config na need mo para sa axios post request dahil sa Authorization need mo ng token
    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
        }
    }
  // Update products eto kung saan na tayun mag update ng product sa dbase
    const updateProduct = () => {
            // conditions lang if thier is null sa mga fields
        if (productName === "" || type === "" || classes === "" || variant === "" || price === "" || stock === "") {
            setError(" Fill in all fields ")
            return; 
        }

    // eto yung formData na need mo para sa axios post request ginagawa neto is yung mga data na need mo para sa pag post ng product
        let formData = new FormData();
        // example formData.append("product_name" <<---- Eto yung name sa model mo sa backend, productName <<------ eto yung value ng productName na nsa state mo)
        formData.append("product_name", productName);
        formData.append("type", type);
        formData.append("class", classes);
        formData.append("variant", variant);
        formData.append("price", price);
        formData.append("stock", stock);
        // image.forEach eto yung loop para sa mga image na kinuha mo sa image picker
        image.forEach((imageUri) => {
            const newImageUri = "file:///" + imageUri.split("file:/").join("");
            formData.append("image", {
                uri: newImageUri,
                type: mime.getType(newImageUri),
                name: newImageUri.split("/").pop(),
            });
        });
// axios is a tool for making HTTP request at eto yun post request na ginawamo para sa pag add ng product

        axios
        // baseUrl eto yung url mo eto yung baseURL = 'http://192.168.50.222:4000/api/v1/' nasa Base url mo
        // kaya products yan eto kabuan niyan http://192.168.50.222:4000/api/v1/products 
        // formData eto yung data na need mo para sa pag add ng product
        // config nan dito yung token mo na need din ipasa para sa pag add ng product
        // patch is yung method na gingagamit para sa pag update
        .patch(`${baseURL}product/edit/${item._id}`, formData, config)
        // eto yung then para sa pag handel ng respose ng post request if its success or not
            .then((res) => {
                if (res.status === 200 || res.status === 201) {
                    // Toast.show eto yung mag message na nag succes yung pag add
                    Toast.show({
                        topOffset: 60,
                        type: "success",
                        text1: "Product Update Successfully"
                    })
                       // setTimeout eto yung function na mag reredirect sa ibang screen after ng 100ms <---- eto is the time na mag rerender
                    setTimeout(() => {
                        navigation.navigate("Products")
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
     // TitleContainer eto yung component na ginawa mo parang name lang to ng container mo
    <TitleContainer title="Add Product">
          {/* TouchableOpacity pag na click mo nag opacity yun lang yung onpress tatawagin niya yun pickImage para na magrun the pickImage */}
    <TouchableOpacity onPress={pickImage}>
                <Text style={styles.selectImageButton}>Select Images</Text>
            </TouchableOpacity>
              {/* ScrollView is parang i scroll mo lang yung image */}
            <ScrollView horizontal>
                   {/* image.map is just i i rereload niya yung image ng multiple times kung ilang tyung iamge example may 2 kang image i load niya yun */}
    {image.length > 0 && image.map((imageUri, index) => (
        <View key={index}>
             {/* source eto yung sa image { uri mo ung imageUri } */}
            <Image source={{ uri: imageUri }} style={styles.image} />
            <TouchableOpacity onPress={() => deleteImage(index)} style={styles.deleteButton}>
                  {/* TouchableOpacity pag na click mo nag opacity yun lang yung onpress tatawagin niya yun deleteImage para na i delete yung image eto yung mat close outline X */}
                <Ionicons name="close-outline" size={25} color="white" style={{ fontWeight: 'bold' }} />
            </TouchableOpacity>
        </View>
    ))}
</ScrollView>

    <View style={styles.label}>
         <Text style={{ textDecorationLine: "underline"}}>Product Name</Text>
    </View>
       {/* Input eto yung pag in put Placeholder is pag lagay ng name na may product name */}
    <Input 
       placeholder='Product Name'
       name='productName'
       id='productName'
       value={productName}
      //    value eto yung value ng productname nasa state mo
      minWidth="90%"
      onChangeText={(text) => setProductName(text)}
   // onChangeText eto yung function na mag rerender ng value ng productName yung setProductName(text) eto yung function na mag rerender ng value ng productName
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

{/* Box is just a box and need i import */}
<Box>
            <Select
            // Select eto yung component na ginawa mo para makapagselect sila ng variant
                minWidth="90%"
                placeholder="Select your Variant"
             // SelectedValue eto yung value ng variant nasa state mo
                selectedValue={variant}
            // onValueChange eto yung function na mag rerender ng value ng variant
                onValueChange={(value) => setVariant(value)}
            >
                {/*  Sa Select.item eto yung item Label is local eto yung makikita mo and value is i papass niya yung value sa onValueChange */}
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
           {/* EasyButton is a button lang na my design and import this import EasyButton from '@shared/StyledComponents/EasyButton'*/}
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
export default ProductUpdate