import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import baseURL from '@assets/commons/baseurl';

const TransactionperYearList = () => {
    const [loading, setLoading] = useState(true);
    const [transactionperYearData, setTransactionperYearData] = useState([]);

    useEffect(() => {
        const fetchPerYear = async () => {
            try {
                const token = await AsyncStorage.getItem("jwt");
                
                const response = await axios.get(`${baseURL}transactions/getPerYear`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (response.data.success) {
                    // Sort the data by year in ascending order
                    const sortedData = response.data.details.sort((a, b) => a.year - b.year);
                    setTransactionperYearData(sortedData);
                } else {
                    console.error('Error fetching transactions:', response.data.message);
                }
                
                setLoading(false);
                console.log('Fetched transactions:', response.data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
                setLoading(false);
            }
        };
    
        fetchPerYear();
    }, []);

    // Filter the data for the current year (2024)
    const currentYearData = transactionperYearData.find(item => item.year === 2024);

    // Calculate total profit for the current year
    const totalProfitForCurrentYear = currentYearData ? currentYearData.totalSales : 0;

    return (
        <View style={styles.container}>
            {!loading && (
                <View style={styles.chartContainer}>
                    <Text style={styles.title}>Annual Profit</Text>
                    <LineChart
                        data={{
                            labels: transactionperYearData.map(item => item.year.toString()),
                            datasets: [
                                {
                                    data: transactionperYearData.map(item => item.totalSales)
                                }
                            ]
                        }}
                        width={Dimensions.get('window').width - 20} // Adjust width to fit within screen
                        height={220}
                        yAxisLabel="₱"
                        chartConfig={{
                            backgroundGradientFrom: '#ADD8E6',
                            backgroundGradientTo: '#ADD8E6',
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            style: {
                                borderRadius: 16
                            },
                            propsForDots: {
                                r: '6',
                                strokeWidth: '2',
                                stroke: '#90EE90'
                            }
                        }}
                        style={styles.chart}
                    />
                    <View style={styles.totalProfitContainer}>
                        <Text style={styles.totalProfitLabel}>Total Profit for this Year:</Text>
                        <Text style={styles.totalProfitAmount}>₱{totalProfitForCurrentYear}</Text>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        backgroundColor: '#ADD8E6'
    },
    chartContainer: {
        width: '90%',
        alignItems: 'center',
        position: 'relative', // To make the totalProfitContainer position relative to this container
        marginBottom: 10 // Add some margin at the bottom
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10
    },
    chart: {
        margin: 20,
        borderRadius: 16
    },
    totalProfitContainer: {
        position: 'absolute',
        bottom: 0, // Adjust to place it under the chart
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: 5,
        borderRadius: 5,
        alignSelf: 'center' // Center horizontally
    },
    totalProfitLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginRight: 5
    },
    totalProfitAmount: {
        fontSize: 14
    }
});

export default TransactionperYearList;
