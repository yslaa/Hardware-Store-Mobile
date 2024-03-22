import React from 'react';
import { NativeBaseProvider, extendTheme } from "native-base";
import { NavigationContainer } from '@react-navigation/native'
import 'react-native-gesture-handler';
import Main from './Main';
import Auth from '@context/Store/Auth';
import { Provider } from 'react-redux';
import store from '@redux/store';
import DrawerNavigation from '@navigators/DrawerNavigation'

const newColorTheme = {
  brand: {
    900: "#8287af",
    800: "#7c83db",
    700: "#b3bef6",
  },
};

const theme = extendTheme({ colors: newColorTheme });

export default function App() {
  return (
    <Auth>
      <Provider store={store}>
    <NativeBaseProvider theme={theme}>
    <NavigationContainer>
      <DrawerNavigation/>
        {/* <Main /> */}
        </NavigationContainer>
    </NativeBaseProvider>
    </Provider>
    </Auth>
  );
}