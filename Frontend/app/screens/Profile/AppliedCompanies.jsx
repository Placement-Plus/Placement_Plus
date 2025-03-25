import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAccessToken, getRefreshToken } from '../../../utils/tokenStorage';

const CompanyCard = ({ company }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <View style={styles.companycardContainer}>
            {/* Company Header */}
            <TouchableOpacity
                style={styles.companycardHeader}
                onPress={toggleExpand}
            >
                <View style={styles.headerLeft}>
                    <View>
                        <Text style={styles.companyName}>{company.companyName}</Text>
                        <Text style={styles.roleText}>{company.role}</Text>
                    </View>
                </View>
                <View style={styles.headerRight}>
                    <Text style={styles.statusText}>{company.applicationStatus}</Text>
                    <Ionicons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={24}
                        color="#C92EFF"
                    />
                </View>
            </TouchableOpacity>

            {/* Expanded Details */}
            {isExpanded && (
                <View style={styles.expandedContent}>
                    <View style={styles.detailsContainer}>
                        <View style={styles.detailsColumn}>
                            <View style={styles.detailItem}>
                                <View style={styles.detailIconContainer}>
                                    <Ionicons name="location-outline" size={20} color="#C92EFF" />
                                </View>
                                <Text style={styles.detailText}>
                                    Location: {company.jobLocation}
                                </Text>
                            </View>
                            {company.ctc && (
                                <View style={styles.detailItem}>
                                    <View style={styles.detailIconContainer}>
                                        <Ionicons name="cash-outline" size={20} color="#C92EFF" />
                                    </View>
                                    <Text style={styles.detailText}>
                                        CTC: {company.ctc || 'Not specified'}
                                    </Text>
                                </View>
                            )}
                            {company.stipend && (
                                <View style={styles.detailItem}>
                                    <View style={styles.detailIconContainer}>
                                        <Ionicons name="cash-outline" size={20} color="#C92EFF" />
                                    </View>
                                    <Text style={styles.detailText}>
                                        Stipend: {company.stipend || 'Not specified'}
                                    </Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.detailsColumn}>
                            <View style={styles.detailItem}>
                                <View style={styles.detailIconContainer}>
                                    <Ionicons name="school-outline" size={20} color="#C92EFF" />
                                </View>
                                <Text style={styles.detailText}>
                                    CGPA: {company.cgpaCriteria}
                                </Text>
                            </View>
                            <View style={styles.detailItem}>
                                <View style={styles.detailIconContainer}>
                                    <Ionicons name="briefcase-outline" size={20} color="#C92EFF" />
                                </View>
                                <Text style={styles.detailText}>
                                    Mode: {company.mode}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Additional Information */}
                    {(company.extraDetails || company.hiringProcess) && (
                        <View style={styles.additionalInfoSection}>
                            <Text style={styles.sectionTitle}>Additional Information</Text>
                            {company.hiringProcess && (
                                <Text style={styles.infoText}>
                                    <Text style={styles.infoLabel}>Hiring Process: </Text>
                                    {company.hiringProcess}
                                </Text>
                            )}
                            {company.extraDetails && (
                                <Text style={styles.infoText}>
                                    <Text style={styles.infoLabel}>Extra Details: </Text>
                                    {company.extraDetails}
                                </Text>
                            )}
                        </View>
                    )}

                    {company.pocDetails && (
                        <View style={styles.additionalInfoSection}>
                            <Text style={styles.sectionTitle}>Point of Contact</Text>
                            <Text style={styles.infoText}>
                                <Text style={styles.infoLabel}>Name: </Text> {company.pocDetails.name}
                            </Text>
                            <Text style={styles.infoText}>
                                <Text style={styles.infoLabel}>Contact No: </Text> {company.pocDetails.contactNo}
                            </Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}


const AppliedCompaniesPage = () => {
    const [companies, setCompanies] = useState([])

    const fetchAppliedCompanies = async () => {
        try {
            const accessToken = await getAccessToken()
            const refreshToken = await getRefreshToken()

            const response = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:5000/api/v1/companies/get-company-details`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'x-refresh-token': refreshToken
                }
            })

            const result = await response.json()
            // console.log(result);

            if (result.statusCode === 200) {
                setCompanies(result.data)
            }

        } catch (error) {
            console.error('Error: ', error?.message);
            Alert.alert('Error', 'Failed fetch applied companies. Please try again.');
        }
    }

    useEffect(() => {
        fetchAppliedCompanies()
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#C92EFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Applied Companies</Text>
                <View style={{ width: 24 }}>{/* Placeholder for symmetry */}</View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={false}
            >
                {companies && companies.length > 0 ? (
                    companies.map((company, index) => (
                        <CompanyCard key={index} company={company} />
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>
                            No companies found. You haven't applied to any companies yet.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1a012c",
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#390852',
        marginTop: 15,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        color: '#C92EFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    scrollViewContent: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    companycardContainer: {
        backgroundColor: '#2d0a41',
        marginTop: 15,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
    },
    companycardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    headerLeft: {
        flex: 1,
    },
    companyName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15
    },
    roleText: {
        color: '#b388e9',
        fontSize: 14,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusText: {
        color: '#C92EFF',
        marginRight: 10,
        fontSize: 14,
    },
    expandedContent: {
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#390852',
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detailsColumn: {
        width: '48%',
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    detailIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(201, 46, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    detailText: {
        color: '#fff',
        fontSize: 14,
        flex: 1,
    },
    additionalInfoSection: {
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#390852',
    },
    sectionTitle: {
        color: '#C92EFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    infoLabel: {
        color: '#C92EFF',
        fontWeight: 'bold',
    },
    infoText: {
        color: '#fff',
        marginBottom: 8,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    emptyStateText: {
        color: '#b388e9',
        textAlign: 'center',
    },
});

export default AppliedCompaniesPage;