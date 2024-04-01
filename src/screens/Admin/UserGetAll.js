import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PieChart } from 'react-native-chart-kit';
import baseURL from '@assets/commons/baseurl';

const UserList = () => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [userData, setUserData] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Fetch token from AsyncStorage
                const token = await AsyncStorage.getItem("jwt");
                
                // Fetch users from the backend
                const response = await axios.get(`${baseURL}users/getAll`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Set all user data
                setUserData(response.data.details);
                setLoading(false);
    
                // Log fetched users to the console
                console.log('Fetched users:', response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
                setLoading(false);
            }
        };
    
        fetchUsers();
    }, []);

    const handleSegmentPress = (data, index) => {
        setSelectedUser(data[index]);
    };

    const getRandomColor = () => {
        // Generate random color
        return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="red" />
            ) : (
                <View>
                    <View style={styles.chartContainer}>
                        <Text style={styles.title}>Users Chart</Text>
                        <PieChart
                            data={userData.map(user => ({
                                name: user.role === 'Admin' ? 'Admin' : 'Customer',
                                count: user.count,
                                color: getRandomColor(), // Random color for each segment
                                legendFontColor: '#7F7F7F',
                                legendFontSize: 15,
                            }))}
                            width={Dimensions.get('window').width - 40}
                            height={220}
                            chartConfig={{
                                backgroundColor: '#1cc910',
                                backgroundGradientFrom: '#eff3ff',
                                backgroundGradientTo: '#efefef',
                                decimalPlaces: 2,
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Black color for legends
                                style: {
                                    borderRadius: 16,
                                },
                            }}
                            accessor="count"
                            backgroundColor="transparent"
                            paddingLeft="15"
                            absolute
                            onDataPointPress={({ data, dataIndex }) => handleSegmentPress(data, dataIndex)}
                        />
                    </View>
                    {selectedUser && (
                        <View style={styles.tooltip}>
                            <Text>{selectedUser.name}</Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20,
    },
    chartContainer: {
        borderWidth: 1,
        borderRadius: 9,
        backgroundColor: '#ffa7',
        alignItems: 'center', // Center items horizontally
        paddingVertical: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default UserList;
