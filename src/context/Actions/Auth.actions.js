import "core-js/stable/atob"
import { jwtDecode } from "jwt-decode"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Toast from "react-native-toast-message"
import baseURL from "@assets/commons/baseurl"


export const SET_CURRENT_USER = "SET_CURRENT_USER"


export const loginUser = (user, dispatch) => {
    fetch(`${baseURL}login`, {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
    .then((res) => res.json())
    .then((data) => {
        if (data) {
            console.log("User:", data); 
            const token = data.details.accessToken;
            const userInfo = data.details.user; 
            AsyncStorage.setItem("jwt", token);
            console.log(token)
            AsyncStorage.setItem("user", JSON.stringify(userInfo)) 
                .then(() => {
                    const decoded = jwtDecode(token);
                    dispatch(setCurrentUser(decoded, userInfo)); 
                })
                .catch((error) => {
                    console.error('Error saving user info:', error);
                    logoutUser(dispatch);
                });
        } else {
           logoutUser(dispatch);
        }
    })
    .catch((err) => {
        Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Please provide correct credentials",
            text2: ""
        });
        console.log(err);
        logoutUser(dispatch);
    });
};



export const getUserProfile = (id) => {
    fetch(`${baseURL}user/${id}`, {
        method: "GET",
        body: JSON.stringify(user),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
    })
    .then((res) => res.json())
    // .then((data) => console.log(data));
}

export const logoutUser = (dispatch) => {
    AsyncStorage.removeItem("jwt");
    dispatch(setCurrentUser({}))
}

export const setCurrentUser = (decoded, userInfo) => { 
    return {
        type: SET_CURRENT_USER,
        payload: decoded,
        userProfile: userInfo 
    };
};