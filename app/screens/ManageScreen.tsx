import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import Header from '../components/Header';

const screenWidth = Dimensions.get('window').width;

const ManageScreen = () => {
  const data = [
    { name: 'Red', population: 40, color: 'red', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Yellow', population: 30, color: 'yellow', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Blue', population: 20, color: 'blue', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Green', population: 10, color: 'green', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  ];

  return (
    <View style={styles.screenContainer}>
      <Header title="Manage screen" />
      <PieChart
        data={data}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor={'population'}
        backgroundColor={'transparent'}
        paddingLeft={'15'}
        absolute
      />
    </View>
  );
};

export default ManageScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
});
