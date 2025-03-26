import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  Alert
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Feather } from '@expo/vector-icons';
import { getAccessToken, getRefreshToken } from '../../utils/tokenStorage.js'

const PlacementDashboard = () => {
  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  const [branchModalVisible, setBranchModalVisible] = useState(false);
  const [placementData, setPlacementData] = useState([
    {
      "_id": "67c5a5320d1d84d76200a791",
      "branch": "CSE",
      "avgPackage": 32.333333333333336,
      "medianPackage": 32,
      "maxPackage": 35,
      "totalStudents": 60,
      "placedStudents": 3,
      "ctcValues": [
        {
          "_id": "67e2f7d23cefdb1a4140aa01",
          "ctc": 30,
          "month": "January"
        },
        {
          "_id": "67e2f7d23cefdb1a4140aa02",
          "ctc": 32,
          "month": "January"
        },
        {
          "_id": "67e2f7d23cefdb1a4140aa03",
          "ctc": 35,
          "month": "March"
        }
      ],
      "createdAt": "2025-03-03T12:48:50.571Z",
      "updatedAt": "2025-03-03T17:10:09.718Z",
      "__v": 0
    },
    {
      "_id": "67c5aa4b6dd7e0e4ea94eabe",
      "branch": "EE",
      "avgPackage": 25,
      "medianPackage": 25,
      "maxPackage": 25,
      "totalStudents": 60,
      "placedStudents": 1,
      "ctcValues": [
        {
          "_id": "67e2f7d23cefdb1a4140aa04",
          "ctc": 25,
          "month": "February"
        }
      ],
      "createdAt": "2025-03-03T13:10:35.967Z",
      "updatedAt": "2025-03-03T13:10:35.967Z",
      "__v": 0
    }
  ])

  const branches = [
    'All Branches',
    ...new Set(placementData.map(item => item.branch))
  ];

  const getPlacementData = async () => {
    try {
      const accessToken = await getAccessToken()
      const refreshToken = await getRefreshToken()
      if (!accessToken || !refreshToken) {
        Alert.alert("Error", "Please login again to view this page")
        return
      }

      const response = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:5000/api/placement-statistics/get-placement-statistics`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'x-refresh-token': refreshToken
        }
      })

      const result = await response.json()
      console.log(result);

      if (result.statusCode === 200) {
        setPlacementData(result.data)
      } else {
        Alert.alert("Error", result.message)
        return
      }

    } catch (error) {
      console.error(error)
      Alert.alert("Error", error.message)
    }
  }

  // Get data for selected branch
  const getCurrentBranchData = () => {

    const monthOrder = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const getMonthlyData = () => {
      const monthlyCounts = {};
      const currentMonthIndex = new Date().getMonth();
      const filteredMonths = monthOrder.slice(0, currentMonthIndex + 1);

      // Initialize monthlyCounts with 0 for each month
      filteredMonths.forEach(month => {
        monthlyCounts[month] = 0;
      });

      // Filter data based on selectedBranch
      const relevantData = selectedBranch === "All Branches"
        ? placementData
        : placementData.filter(branch => branch.branch === selectedBranch);

      // Accumulate placement counts per month
      relevantData.forEach(branch => {
        if (branch.ctcValues) {
          branch.ctcValues.forEach(({ month }) => {
            if (filteredMonths.includes(month)) {
              monthlyCounts[month] += 1;
            }
          });
        }
      });

      return {
        labels: filteredMonths,
        datasets: [{
          data: filteredMonths.map(month => monthlyCounts[month])
        }]
      };
    };
    const rangeCounts = [0, 0, 0, 0, 0];

    placementData.forEach(branch => {
      if (!branch.ctcValues || branch.ctcValues.length === 0) return;

      branch?.ctcValues.forEach(({ ctc }) => {
        if (ctc < 25) rangeCounts[0]++;
        else if (ctc >= 25 && ctc < 30) rangeCounts[1]++;
        else if (ctc >= 30 && ctc < 35) rangeCounts[2]++;
        else if (ctc >= 35 && ctc < 40) rangeCounts[3]++;
        else rangeCounts[4]++;
      })
    });

    const totalCount = rangeCounts.reduce((sum, count) => sum + count, 0);
    const rangePercentages = rangeCounts.map(count => Number(((count / totalCount) * 100).toFixed(2)));

    if (selectedBranch === 'All Branches') {
      const totalPlaced = placementData.reduce((sum, item) => sum + item.placedStudents, 0);
      const totalStudents = placementData.reduce((sum, item) => sum + item.totalStudents, 0);
      const avgCTC = placementData.length
        ? Number((placementData.reduce((sum, item) => sum + item.avgPackage, 0) / placementData.length).toFixed(2))
        : 0;
      const highestPackage = Math.max(...placementData.map(item => item.maxPackage));
      const placementRate = totalStudents ? Number(((totalPlaced / totalStudents) * 100).toFixed(2)) : 0;

      return {
        totalPlacements: totalPlaced,
        averageCTC: avgCTC,
        highestPackage: highestPackage.toFixed(2),
        placementRate,
        monthlyData: getMonthlyData(placementData),
        ctcRanges: {
          labels: ['<25', '25-30', '30-35', '35-40', '40+'],
          data: rangePercentages
        }
      };
    }

    const branchData = placementData.find(item => item.branch === selectedBranch);
    if (!branchData) return null;

    return {
      totalPlacements: branchData.placedStudents,
      averageCTC: Number(branchData.avgPackage).toFixed(2),
      highestPackage: Number(branchData.maxPackage).toFixed(2),
      placementRate: Number(((branchData.placedStudents / branchData.totalStudents) * 100).toFixed(2)),
      monthlyData: getMonthlyData([branchData]),
      ctcRanges: {
        labels: ['<25', '25-30', '30-35', '35-40', '40+'],
        data: [
          branchData.ctcValues.filter(v => v.ctc < 25).length,
          branchData.ctcValues.filter(v => v.ctc >= 25 && v.ctc < 30).length,
          branchData.ctcValues.filter(v => v.ctc >= 30 && v.ctc < 35).length,
          branchData.ctcValues.filter(v => v.ctc >= 35 && v.ctc < 40).length,
          branchData.ctcValues.filter(v => v.ctc >= 40).length
        ].map(count => Number(((count / branchData.ctcValues.length) * 100).toFixed(2)))
      }
    };
  };

  const currentBranchData = getCurrentBranchData();

  // StatCard component (unchanged from previous version)
  const StatCard = ({ title, value, unit, change }) => (
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>{title}</Text>
      <View style={styles.statValueContainer}>
        <Text style={styles.statValue}>{value}</Text>
        {unit && <Text style={styles.statUnit}> {unit}</Text>}
      </View>
      {change && (
        <Text style={[
          styles.statChange,
          change > 0 ? styles.positive : styles.negative
        ]}>
          {change > 0 ? '+' : ''}{change}% vs 2024
        </Text>
      )}
    </View>
  );

  // BranchModal component (unchanged from previous version)
  const BranchModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={branchModalVisible}
      onRequestClose={() => setBranchModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Branch</Text>
            <TouchableOpacity onPress={() => setBranchModalVisible(false)}>
              <Feather name="x" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <ScrollView>
            {branches.map((branch, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.branchOption,
                  selectedBranch === branch && styles.selectedBranchOption
                ]}
                onPress={() => {
                  setSelectedBranch(branch);
                  setBranchModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.branchOptionText,
                    selectedBranch === branch && styles.selectedBranchOptionText
                  ]}
                >
                  {branch}
                </Text>
                {selectedBranch === branch && (
                  <Feather name="check" size={20} color="#C92EFF" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  if (!currentBranchData) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Placement Dashboard</Text>
            <Text style={styles.subtitle}>Academic Year 2024-2025</Text>
          </View>
        </View>

        {/* Branch Selector */}
        <TouchableOpacity
          style={styles.branchSelector}
          onPress={() => setBranchModalVisible(true)}
        >
          <View style={styles.branchDisplay}>
            <Text style={styles.branchText}>{selectedBranch}</Text>
            <Feather name="chevron-down" size={20} color="#BA68C8" />
          </View>
          <Text style={styles.branchLabel}>Branch</Text>
        </TouchableOpacity>

        <View style={styles.statsContainer}>
          <StatCard
            title="Total Placements"
            value={currentBranchData.totalPlacements}
            change={8.2}
          />
          <StatCard
            title="Average CTC"
            value={currentBranchData.averageCTC}
            unit="LPA"
            change={12.3}
          />
          <StatCard
            title="Highest Package"
            value={currentBranchData.highestPackage}
            unit="LPA"
            change={15.4}
          />
          <StatCard
            title="Placement Rate"
            value={currentBranchData.placementRate}
            unit="%"
            change={5.9}
          />
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Monthly Placements (2025) - {selectedBranch}</Text>
          <LineChart
            data={currentBranchData.monthlyData}
            width={Dimensions.get('window').width - 40}
            height={220}
            yAxisInterval={Math.max(...currentBranchData.monthlyData.datasets[0].data) > 10 ? 2 : 1} fromZero={true}
            chartConfig={{
              backgroundColor: '#1C1235',
              backgroundGradientFrom: '#1C1235',
              backgroundGradientTo: '#1C1235',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(186, 104, 200, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#C92EFF',
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>CTC Distribution (%) - {selectedBranch}</Text>
          <View style={styles.ctcDistribution}>
            {currentBranchData.ctcRanges.labels.map((label, index) => (
              <View key={index} style={styles.ctcItem}>
                <View
                  style={styles.ctcBarContainer}
                  onLayout={(event) => {
                    const { height } = event.nativeEvent.layout;
                  }}
                >
                  <View
                    style={[
                      styles.ctcBar,
                      { height: currentBranchData.ctcRanges.data[index] }
                    ]}
                  />
                </View>
                <Text style={styles.ctcLabel}>{label}</Text>
                <Text style={styles.ctcValue}>{currentBranchData.ctcRanges.data[index]}%</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Last updated: March 22, 2025
          </Text>
        </View>
      </ScrollView>

      <BranchModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D021F',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginTop: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: '#BA68C8',
    marginTop: 4,
  },
  yearSelector: {
    flexDirection: 'row',
    backgroundColor: '#1C1235',
    borderRadius: 8,
  },
  yearButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  selectedYear: {
    backgroundColor: '#C92EFF',
  },
  yearText: {
    fontWeight: '600',
    color: '#BA68C8',
  },
  selectedYearText: {
    color: 'white',
  },
  branchSelector: {
    backgroundColor: '#1C1235',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  branchDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  branchText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  branchLabel: {
    fontSize: 14,
    color: '#BA68C8',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1C1235',
    borderRadius: 12,
    width: '100%',
    maxHeight: '70%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  branchOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2A1E43',
    paddingHorizontal: 10
  },
  selectedBranchOption: {
    backgroundColor: 'rgba(201, 46, 255, 0.1)',
  },
  branchOptionText: {
    fontSize: 16,
    color: 'white',
  },
  selectedBranchOptionText: {
    fontWeight: 'bold',
    color: '#C92EFF',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#1C1235',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  statTitle: {
    fontSize: 14,
    color: '#BA68C8',
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statUnit: {
    fontSize: 14,
    color: '#E1BEE7',
  },
  statChange: {
    fontSize: 12,
    marginTop: 8,
  },
  positive: {
    color: '#4CAF50',
  },
  negative: {
    color: '#F44336',
  },
  chartCard: {
    backgroundColor: '#1C1235',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 12,
    marginVertical: 8,
  },
  ctcDistribution: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 150,
    paddingTop: 20,
  },
  ctcItem: {
    alignItems: 'center',
    width: '18%',
  },
  ctcBarContainer: {
    height: 100,
    width: 20,
    justifyContent: 'flex-end',
  },
  ctcBar: {
    width: 20,
    backgroundColor: '#C92EFF',
    borderRadius: 4,
  },
  ctcLabel: {
    fontSize: 10,
    color: '#BA68C8',
    marginTop: 8,
    textAlign: 'center',
  },
  ctcValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 4,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#BA68C8',
  },
});
export default PlacementDashboard;