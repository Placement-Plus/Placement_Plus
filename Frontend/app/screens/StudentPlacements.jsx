import React, { useState, useMemo, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getAccessToken, getRefreshToken } from '../../utils/tokenStorage.js';

const PlacementDashboard = () => {

    const [placementData, setPlacementData] = useState([])
    const [loading, setLoading] = useState(false)

    // State for filters
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Derive unique filter options
    const branchOptions = ['', ...new Set(placementData?.map(item => item?.studentData?.branch))];
    const typeOptions = ['', 'Internship', 'Full Time', 'Internship + Full Time'];

    useEffect(() => {
        getStudentPlacementData()
    }, [])

    const getStudentPlacementData = async () => {
        setLoading(true)
        try {
            const accessToken = await getAccessToken()
            const refreshToken = await getRefreshToken()
            if (!accessToken || !refreshToken) {
                Alert.alert("Error", "Tokens are required, Please login again")
                return
            }

            const response = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:5000/api/v1/placements/get-all-student-placement`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'x-refresh-token': refreshToken
                }
            })

            if (!response.ok) {
                const errorText = await response.text();
                console.log("Server response:", errorText);
                throw new Error(`HTTP Error ${response.status}: ${errorText}`);
            }

            const result = await response.json()
            console.log(result);

            if (result?.statusCode === 200) {
                setPlacementData(result?.data)
            } else {
                console.log(result.message)
                Alert.alert("Error", result?.message)
            }
        } catch (error) {
            console.log(error.message)
            Alert.alert("Error", error?.message)
        } finally {
            setLoading(false)
        }
    }

    // Filtered and searched data
    const filteredData = useMemo(() => {
        return placementData.filter(item =>
            (selectedBranch === '' || item.studentData.branch === selectedBranch) &&
            (selectedType === '' || item.placementType === selectedType) &&
            (searchQuery === '' ||
                item.studentData.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.studentData.rollNo.toString().includes(searchQuery) ||
                item.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [selectedBranch, selectedType, searchQuery, placementData]);

    // Render individual placement item
    const renderPlacementItem = ({ item }) => (
        <View style={styles.placementCard}>
            {/* Student Details */}
            <View style={styles.studentHeader}>
                <Text style={styles.studentName}>{item?.studentData?.name || "N/A"}</Text>
                <Text style={styles.studentRollNo}>Roll No: {item?.studentData?.rollNo || "-"}</Text>
            </View>

            {/* Student Additional Details */}
            <View style={styles.studentDetails}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Branch:</Text>
                    <Text style={styles.detailValue}>{item?.studentData?.branch || "-"}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Semester:</Text>
                    <Text style={styles.detailValue}>{item?.studentData?.semester || "-"}</Text>
                </View>
            </View>

            {/* Placement Details */}
            <View style={styles.placementDetails}>
                <Text style={styles.placementTitle}>Placement Details</Text>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Company:</Text>
                    <Text style={styles.companyName}>{item?.companyName}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Role:</Text>
                    <Text style={styles.detailValue}>{item?.role}</Text>
                </View>
                {item?.ctc && (
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>CTC:</Text>
                        <Text style={styles.detailValue}>{item?.ctc}</Text>
                    </View>
                )}
                {item.stipend && (
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Stipend:</Text>
                        <Text style={styles.detailValue}>{item?.stipend}</Text>
                    </View>
                )}
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Location:</Text>
                    <Text style={styles.detailValue}>{item?.jobLocation}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Type:</Text>
                    <Text style={styles.detailValue}>{item?.placementType}</Text>
                </View>
            </View>
        </View>
    );

    // Reset filters
    const resetFilters = () => {
        setSelectedBranch('');
        setSelectedType('');
        setSearchQuery('');
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#C92EFF" />
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Student Placement Dashboard</Text>

            {/* Filters Container */}
            <View style={styles.filtersContainer}>
                {/* Search Input */}
                <TextInput
                    placeholder="Search by Name, Roll No, or Company"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={styles.searchInput}
                    placeholderTextColor="#BA68C8"
                />

                {/* Branch Picker */}
                <Picker
                    selectedValue={selectedBranch}
                    onValueChange={(itemValue) => setSelectedBranch(itemValue)}
                    style={styles.picker}
                >
                    {branchOptions.map((branch, index) => (
                        <Picker.Item
                            key={index}
                            label={branch || 'All Branches'}
                            value={branch}
                            color="#1C1235"
                        />
                    ))}
                </Picker>

                {/* Opportunity Type Picker */}
                <Picker
                    selectedValue={selectedType}
                    onValueChange={(itemValue) => setSelectedType(itemValue)}
                    style={styles.picker}
                >
                    {typeOptions.map((type, index) => (
                        <Picker.Item
                            key={index}
                            label={type || 'All Types'}
                            value={type}
                        />
                    ))}
                </Picker>

                {/* Reset Filters Button */}
                <TouchableOpacity
                    style={styles.resetButton}
                    onPress={resetFilters}
                >
                    <Text style={styles.resetButtonText}>Reset Filters</Text>
                </TouchableOpacity>
            </View>

            {/* Placement List */}
            <FlatList
                data={filteredData}
                renderItem={renderPlacementItem}
                keyExtractor={(item) => item._id}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No placements found</Text>
                    </View>
                }
                contentContainerStyle={styles.listContainer}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D021F',
        marginTop: 20
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 15,
        color: 'white',
    },
    filtersContainer: {
        padding: 10,
        backgroundColor: '#1C1235',
        marginBottom: 10,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#2A1E43',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 10,
        backgroundColor: '#1C1235',
        color: 'white',
    },
    picker: {
        marginBottom: 10,
        backgroundColor: '#1C1235',
        color: 'white',
    },
    resetButton: {
        backgroundColor: '#C92EFF',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    resetButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    listContainer: {
        paddingHorizontal: 10,
    },
    placementCard: {
        backgroundColor: '#1C1235',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    studentHeader: {
        borderBottomWidth: 1,
        borderBottomColor: '#2A1E43',
        paddingBottom: 10,
        marginBottom: 10,
    },
    studentName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    studentRollNo: {
        fontSize: 14,
        color: '#BA68C8',
        marginTop: 5,
    },
    studentDetails: {
        marginBottom: 10,
    },
    placementDetails: {
        borderTopWidth: 1,
        borderTopColor: '#2A1E43',
        paddingTop: 10,
    },
    placementTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#C92EFF',
        marginBottom: 10,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    detailLabel: {
        fontWeight: 'bold',
        marginRight: 5,
        color: '#BA68C8',
        width: 100,
    },
    detailValue: {
        color: 'white',
        flex: 1,
    },
    companyName: {
        color: '#C92EFF',
        fontWeight: 'bold',
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        fontSize: 18,
        color: '#BA68C8',
    },
});

export default PlacementDashboard;