import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal } from 'react-native'; // Import Modal
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Camera } from 'expo-camera';
import mime from 'mime';
import axios from 'axios';
import baseURL from '@assets/commons/baseurl';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import TitleContainer from '@shared/Form/TitleContainer';
import Input from '@shared/Form/Input';
import { Button, Center, Image } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

var { height, width } = Dimensions.get("window")

const Register = () => {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [image, setImage] = useState(null);
    const [camera, setCamera] = useState('')
    const [mainImage, setMainImage] = useState('')
    const [hasCameraPermission, setHasCameraPermission] = useState(null)
    const [error, setError] = useState('')

    const [launchCam, setLaunchCam] =  useState(false)
    const [type, setType] = useState(Camera.Constants.Type.back)
    const [modalVisible, setModalVisible] = useState(false);
    
    const navigation = useNavigation()

    const register = () => {
        if (email === "" || name === "" || password === "") {
            setError("Please fill in the form correctly");
        }

        let formData = new FormData()
        const newImageUri = "file:///" + image.split("file:/").join("")

        formData.append("email", email)
        formData.append("name", name)
        formData.append("password", password)
        formData.append("image",
        {
            uri: newImageUri,
            type: mime.getType(newImageUri),
            name: newImageUri.split("/").pop()
        })
        const config = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
        axios
        .post(`${baseURL}users`, formData, config)
        .then((res)=>{
            if (res.status === 200)
            {
                Toast.show({
                    topOffset: 60,
                    type: "success",
                    text1: "Registration Successful",
                    text2: "Please Login your account"
                })
                setTimeout(() => {
                    navigation.navigate("Login");
                }, 100);
            }
        })
        .catch((error) => {
            if (error.response && error.response.data) {
                console.log("Error from Register", error.response.data.error);

            } else {
                console.log("Error from Register", error.message);
            }
            Toast.show({
                position: "bottom",
                bottomOffset: 20,
                type: "error",
                text1: "Something went wrong",
                text2: "Please try again",
            });
        });

    }

    const addimage = async() => {
        setLaunchCam(false); 
    
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
    
        if (!result.canceled) {
            setImage(result.uri);
            setMainImage(result.uri);
            setModalVisible(false);
        }  
    }
    
    const takePicture = async() => {
        setLaunchCam(true);
    
        const cameraPermission = await Camera.requestCameraPermissionsAsync();
        if (cameraPermission.status !== 'granted') {
            console.log('Camera permission not granted');
            return;
        }
    
        let result = await ImagePicker.launchCameraAsync({
            aspect: [4, 3],
            quality: 0.1,
        });
    
        if (!result.canceled) {
            setImage(result.uri);
            setMainImage(result.uri);
        }
    }



    useEffect(() => {
        (async () => {
            const cameraStatus =  await Camera.requestCameraPermissionsAsync()
            setHasCameraPermission(cameraStatus.status === 'granted')
        })();
    })

    return (
        <KeyboardAwareScrollView 
        viewIsInsideTabBar={true}
        extraHeight={200}
        enableOnAndroid={true}
        >
        <TitleContainer title="Register">
        <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Choose an option to get a image:</Text>
                        <View style={styles.buttonRow}>
                        <TouchableOpacity
                            onPress={() => {
                                setModalVisible(false);
                                takePicture();
                            }}
                            title="Take Picture"
                            variant={"ghost"}
                        ><Ionicons name="camera-outline" style={{fontSize: 30}}/> 
                     </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setModalVisible(false);
                                addimage();
                            }}
                            title="Add Image"
                            variant={"ghost"}
                        ><Ionicons name="image-outline" style={{fontSize: 30}}/> 
                         </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            title="Cancel"
                            variant={"ghost"}
                            style={{marginTop:5.5}}
                        ><Text>CANCEL</Text>
                         </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: mainImage}} />
            <TouchableOpacity 
                onPress={() => setModalVisible(true)}
                style={styles.imagePicker}>
                <Ionicons name="camera-outline" style={{ color: "white" }}/>
            </TouchableOpacity>
        </View>
        <Input 
            placeholder={"Email"}
            name = {"email"}
            id = {"email"}
            onChangeText={(text) => setEmail(text.toLowerCase())}
        />

        <Input 
            placeholder={"Name"}
            name = {"name"}
            id = {"name"}
            onChangeText={(text) => setName(text)}
        />

        <Input 
            placeholder={"Password"}
            name = {"password"}
            id = {"password"}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
        />

        <View style={styles.buttonGroup}>
            {error ? <Error message={error} /> : null}
        </View>

        <View>
            <Button variant={"ghost"} onPress={() => register()}>
                <Text style={{ color: "blue" }}>Register</Text>
            </Button>
        </View>

        <View>
            <Button variant={"ghost"} onPress={() => navigation.navigate("Login")}>
                <Text style={{ color: "blue" }}>Back to Login</Text>
            </Button>
        </View>
        </TitleContainer>
        </KeyboardAwareScrollView>
    );
};


const styles = StyleSheet.create({
    buttonGroup: {
        width: "80%",
        margin: 10,
        alignItems: "center",
    },
    buttonContainer: {
        width: "80%",
        marginBottom: 80,
        marginTop: 20,
        alignItems: "center"
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
    },
    cameraContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    fixedRatio: {
        flex: 1,
        aspectRatio: 1
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 5,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
    },
});


export default Register;
