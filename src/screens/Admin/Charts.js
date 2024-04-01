import React from 'react';
import UserGetAll from '@screens/Admin/UserGetAll';
import PerMonth from '@screens/Admin/PerMonth';
import PerYear from '@screens/Admin/PerYear';
import { View, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function() {
    return (
        <ScrollView style={styles.container}>
            <UserGetAll />
            <PerMonth />
            <PerYear />
           
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'col', // Added flexDirection to make it a flex row layout
    },
});
