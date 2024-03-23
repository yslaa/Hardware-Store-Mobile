import { View, Text, StyleSheet, BackHandler } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Input from '@shared/Form/Input'
import TitleContainer from '@shared/Form/TitleContainer'
import Error from '@shared/Error'
import AsyncStorage from '@react-native-async-storage/async-storage'
import EasyButton from '@shared/StyledComponents/EasyButton'
import AuthGlobal from '@context/Store/AuthGlobal'
import { Button } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { loginUser } from '@context/Actions/Auth.actions'
import { StackActions } from '@react-navigation/native';

const Login = (props) => {
    const context = useContext(AuthGlobal)
    const navigation = useNavigation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState("")
    useEffect(() => {
        if (context.stateUser.isAuthenticated === true) {
            navigation.dispatch(StackActions.replace('User Profile'));
        }
    }, [context.stateUser.isAuthenticated]);

    const handleSubmit = () =>
    {
        const user = {
            email,
            password,
        }

        if(email === "" || password === "") {
            setError("Fill your Account Information")
        } else {
            loginUser(user, context.dispatch)
            console.log("error")
        }
    }

    AsyncStorage.getAllKeys((err, keys) =>
    {
        AsyncStorage.multiGet(keys, (error, stores) =>
        {
            stores.map((result, i, store) => {
                console.log({ [store[i][0]]: store[i][1] })
                return true
            })
        })
    })

    

  return (
    <TitleContainer>
          <Input
                placeholder={"Enter email"}
                name={"email"}
                id={"email"}
                value={email}
                onChangeText={(text) => setEmail(text.toLowerCase())}
            />
            <Input
                placeholder={"Enter Password"}
                name={"password"}
                id={"password"}
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => setPassword(text)}
            />
             <View style={styles.buttonGroup}>
                {error ? <Error message={error} /> : null}
                <EasyButton
                    large
                    primary
                    onPress={() => handleSubmit()}
                ><Text style={{ color: "white" }}>Login</Text>
                </EasyButton>
            </View>

            <View style={[{ marginTop: 40 }, styles.buttonGroup]}>
                <Text style={styles.middleText}>Dont' Have an Account yet?</Text>
                <EasyButton
                    large
                    secondary
                    onPress={() => navigation.navigate("Register")}
                ><Text style={{ color: "white" }}>Register</Text>
                </EasyButton>
            </View>

    </TitleContainer>
  )
}

const styles = StyleSheet.create({
    buttonGroup: {
        width: "80%",
        alignItems: "center",
    },
    middleText: {
        marginBottom: 20,
        alignSelf: "center",
    },
});
export default Login