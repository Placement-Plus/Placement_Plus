import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Modal
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Feather } from '@expo/vector-icons';

const PlacementDashboard = () => {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  const [branchModalVisible, setBranchModalVisible] = useState(false);
  
  // Available branches
  const branches = [
    'All Branches',
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'Electrical'
  ];

  // Sample data for placements in 2025 (branch-wise)
  const branchData = {
    'All Branches': {
      totalPlacements: 487,
      averageCTC: 12.8,
      highestPackage: 45,
      companiesVisited: 72,
      placementRate: 92,
      monthlyData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            data: [32, 45, 38, 42, 50, 65, 53, 42, 35, 28, 25, 32],
            color: (opacity = 1) => `rgba(186, 104, 200, ${opacity})`,
            strokeWidth: 2
          }
        ]
      },
      ctcRanges: {
        labels: ['<5 LPA', '5-10 LPA', '10-15 LPA', '15-20 LPA', '20+ LPA'],
        data: [15, 32, 28, 18, 7]
      }
    },
    'Computer Science': {
      totalPlacements: 156,
      averageCTC: 18.5,
      highestPackage: 45,
      companiesVisited: 58,
      placementRate: 98,
      monthlyData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            data: [12, 18, 15, 14, 20, 25, 22, 15, 10, 8, 5, 6],
            color: (opacity = 1) => `rgba(186, 104, 200, ${opacity})`,
            strokeWidth: 2
          }
        ]
      },
      ctcRanges: {
        labels: ['<5 LPA', '5-10 LPA', '10-15 LPA', '15-20 LPA', '20+ LPA'],
        data: [5, 25, 30, 25, 15]
      }
    },
    'Electronics': {
      totalPlacements: 124,
      averageCTC: 14.2,
      highestPackage: 32,
      companiesVisited: 48,
      placementRate: 94,
      monthlyData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            data: [8, 12, 10, 15, 18, 16, 12, 10, 9, 5, 6, 5],
            color: (opacity = 1) => `rgba(186, 104, 200, ${opacity})`,
            strokeWidth: 2
          }
        ]
      },
      ctcRanges: {
        labels: ['<5 LPA', '5-10 LPA', '10-15 LPA', '15-20 LPA', '20+ LPA'],
        data: [10, 30, 35, 18, 7]
      }
    },
    'Mechanical': {
      totalPlacements: 98,
      averageCTC: 9.5,
      highestPackage: 22,
      companiesVisited: 35,
      placementRate: 86,
      monthlyData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            data: [5, 8, 7, 9, 10, 15, 12, 10, 8, 6, 4, 4],
            color: (opacity = 1) => `rgba(186, 104, 200, ${opacity})`,
            strokeWidth: 2
          }
        ]
      },
      ctcRanges: {
        labels: ['<5 LPA', '5-10 LPA', '10-15 LPA', '15-20 LPA', '20+ LPA'],
        data: [25, 40, 22, 10, 3]
      }
    },
    'Civil': {
      totalPlacements: 56,
      averageCTC: 8.2,
      highestPackage: 18,
      companiesVisited: 25,
      placementRate: 82,
      monthlyData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            data: [4, 5, 4, 5, 6, 7, 6, 5, 4, 3, 3, 4],
            color: (opacity = 1) => `rgba(186, 104, 200, ${opacity})`,
            strokeWidth: 2
          }
        ]
      },
      ctcRanges: {
        labels: ['<5 LPA', '5-10 LPA', '10-15 LPA', '15-20 LPA', '20+ LPA'],
        data: [30, 45, 18, 5, 2]
      }
    },
    'Electrical': {
      totalPlacements: 85,
      averageCTC: 10.6,
      highestPackage: 25,
      companiesVisited: 38,
      placementRate: 88,
      monthlyData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            data: [5, 8, 7, 6, 9, 12, 10, 9, 7, 5, 4, 3],
            color: (opacity = 1) => `rgba(186, 104, 200, ${opacity})`,
            strokeWidth: 2
          }
        ]
      },
      ctcRanges: {
        labels: ['<5 LPA', '5-10 LPA', '10-15 LPA', '15-20 LPA', '20+ LPA'],
        data: [20, 38, 25, 12, 5]
      }
    }
  };

  // Get data for selected branch
  const placementData = branchData[selectedBranch];

  // Placement statistics component
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

  // Branch selector modal
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Placement Dashboard</Text>
            <Text style={styles.subtitle}>Academic Year 2024-2025</Text>
          </View>
          <View style={styles.yearSelector}>
            <TouchableOpacity 
              style={[
                styles.yearButton, 
                selectedYear === '2024' && styles.selectedYear
              ]}
              onPress={() => setSelectedYear('2024')}
            >
              <Text style={[
                styles.yearText,
                selectedYear === '2024' && styles.selectedYearText
              ]}>2024</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.yearButton, 
                selectedYear === '2025' && styles.selectedYear
              ]}
              onPress={() => setSelectedYear('2025')}
            >
              <Text style={[
                styles.yearText,
                selectedYear === '2025' && styles.selectedYearText
              ]}>2025</Text>
            </TouchableOpacity>
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
            value={placementData.totalPlacements} 
            change={8.2} 
          />
          <StatCard 
            title="Average CTC" 
            value={placementData.averageCTC} 
            unit="LPA"
            change={12.3} 
          />
          <StatCard 
            title="Highest Package" 
            value={placementData.highestPackage} 
            unit="LPA"
            change={15.4} 
          />
          <StatCard 
            title="Placement Rate" 
            value={placementData.placementRate} 
            unit="%"
            change={5.9} 
          />
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Monthly Placements (2025) - {selectedBranch}</Text>
          <LineChart
            data={placementData.monthlyData}
            width={Dimensions.get('window').width - 40}
            height={220}
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
            {placementData.ctcRanges.labels.map((label, index) => (
              <View key={index} style={styles.ctcItem}>
                <View style={styles.ctcBarContainer}>
                  <View 
                    style={[
                      styles.ctcBar, 
                      { height: placementData.ctcRanges.data[index] * 3 }
                    ]} 
                  />
                </View>
                <Text style={styles.ctcLabel}>{label}</Text>
                <Text style={styles.ctcValue}>{placementData.ctcRanges.data[index]}%</Text>
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