import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart } from 'react-native-chart-kit';
import baseURL from '@assets/commons/baseurl';

const TransactionperMonthList = () => {
    const [loading, setLoading] = useState(true);
    const [transactionperMonthData, setTransactionperMonthData] = useState([]);

    useEffect(() => {
        const fetchPerMonth = async () => {
            try {
                const token = await AsyncStorage.getItem("jwt");
                
                const response = await axios.get(`${baseURL}transactions/getPerMonth`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTransactionperMonthData(response.data.details);
                setLoading(false);
    
                console.log('Fetched transactions:', response.data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
                setLoading(false);
            }
        };
    
        fetchPerMonth();
    }, []);

    const monthsData = transactionperMonthData.reduce((acc, curr) => {
        // Extract month from _id object
        const month = curr._id.month;
        acc[month] = curr.totalAmount;
        return acc;
    }, {});

    const months = Object.keys(monthsData).map(month => month.slice(0, 3));
    const salesData = Object.values(monthsData);

    const allMonths = [...Array(12)].map((_, i) => {
        const date = new Date();
        date.setMonth(i);
        return date.toLocaleString('default', { month: 'short' });
    });

    allMonths.forEach((month, index) => {
        if (!months.includes(month)) {
            months.splice(index, 0, month);
            salesData.splice(index, 0, 0);
        }
    });

    const totalSales = salesData.reduce((acc, curr) => acc + curr, 0);

    return (
        <View style={styles.container}>
            <View style={styles.chartContainer}>
                <Text style={styles.title}>Monthly Sales</Text>
                <BarChart
                    data={{
                        labels: months,
                        datasets: [
                            {
                                data: salesData,
                            },
                        ],
                    }}
                    width={Dimensions.get('window').width - 40}
                    height={220}
                    yAxisLabel="₱"
                    chartConfig={{
                        backgroundGradientFrom: '#ffcdd6',
                        backgroundGradientTo: '#ffcdd6',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                        barPercentage: 0.5,
                        propsForBackgroundLines: {
                            strokeWidth: 0
                        },
                        propsForLabels: {
                            fontSize: 12
                        },
                        barRadius: 8,
                    }}
                    bezier
                    style={{
                        borderRadius: 16,
                    }}
                />
                <View style={styles.totalProfitContainer}>
                    <Text style={styles.totalProfitLabel}>Total Sales for this Month:</Text>
                    <Text style={styles.totalProfitAmount}>₱{totalSales}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chartContainer: {
        alignItems: 'center',
        width: Dimensions.get('window').width - 40,
        borderRadius: 16,
        backgroundColor: '#ffcdd6',
        padding: 10,
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    totalProfitContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: 5,
        borderRadius: 5,
        marginTop: 10
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

export default TransactionperMonthList;
