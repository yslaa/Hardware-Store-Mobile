import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import baseURL from '@assets/commons/baseurl'
import Toast from 'react-native-toast-message'
import EasyButton from '@shared/StyledComponents/EasyButton'
import { Box, Input, Select } from 'native-base'
import TitleContainer from '@shared/Form/TitleContainer'
import { Ionicons } from '@expo/vector-icons'
import mime from "mime";
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/FontAwesome'

const StarRating = ({ ratings, onRate }) => {
    const stars = [1, 2, 3, 4, 5];
    
      return (
        <View style={{ flexDirection: 'row' }}>
          {stars.map((star) => (
            <TouchableOpacity key={star} onPress={() => onRate(star)}>
              <Icon
                name={star <= ratings ? 'star' : 'star-o'}
                size={20}
                color={star <= ratings ? 'orange' : 'gray'}
              />
            </TouchableOpacity>
          ))}
          <Text style={{ marginLeft: 5 }}>{ratings} stars</Text>
        </View>
      );
  };

const ReviewUpdate = (props) => {
    //console.log("Item: ", props.route.params.item)
    const navigation = useNavigation();
    const [ratings, setRatings] = useState();
    const [text, setText] = useState('');
    const [error, setError] = useState('');

    const item = props.route.params.item;

    useEffect(() => {
        setRatings(item.ratings);
        setText(item.text.toString());

        AsyncStorage.getItem('jwt')
            .then((res) => {
                setToken(res);
            })
            .catch((error) => console.log('Errors:', error));
    }, []);

    const updateComment = () => {
        if (ratings === '' || text === '') {
            setError('Fill in all fields');
            return;
        }
    
        let formData = new FormData();
        formData.append("ratings", ratings)
        formData.append("text", text)
    
        AsyncStorage.getItem('jwt')
            .then((res) => {
                axios.patch(`${baseURL}comment/edit/${item._id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${res}`,
                    },
                })
                .then((res) => {
                    if (res.status === 200 || res.status === 201) {
                        Alert.alert("Comment Updated")
                        navigation.navigate('Reviews');
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
            })
    };

    const handleRate = (newRating) => {
        setRatings(newRating);
      };


  return (
    <TitleContainer title="Update Comment">

    <View style={styles.label}>
         <Text style={{ textDecorationLine: "underline"}}>Ratings</Text>
    </View>
    <StarRating ratings={ratings} onRate={handleRate} />

    <View style={styles.label}>
        <Text style={{ textDecorationLine: "underline"}}>Comment</Text>
    </View>
    <Input 
       name='text'
       id='text'
       value={text}
       minWidth="90%"
       onChangeText={(text) => setText(text)}
    />

       {error ? <Error message={error} /> : null}
       <View style={styles.buttonContainer}>
         <EasyButton
         large 
         primary
         onPress={() => updateComment()}
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
    deleteButton: {
        position: 'absolute',
        top: 5,
        right: 10,
        backgroundColor: 'transparent',
    },

})
export default ReviewUpdate