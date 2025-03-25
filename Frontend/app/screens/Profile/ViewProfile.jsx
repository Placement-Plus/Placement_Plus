// ProfileView.js with updated styling
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../../context/userContext.js';
import { getAccessToken, getRefreshToken } from '../../../utils/tokenStorage';
import * as IntentLauncher from 'expo-intent-launcher';

const ProfileView = () => {
    const navigation = useNavigation();
    const { user } = useUser()

    const profile = {
        name: user?.name || '-',
        email: user?.email || '-',
        rollNo: user?.rollNo || '-',
        mobileNo: user?.mobileNo || '-',
        semester: user?.semester || '-',
        cgpa: user?.CGPA || 'N/A',
        branch: user?.branch || '-',
        batch: user?.batch || '-',
        resumeUrl: user?.resumeLink || '-',
        internshipEligible: user?.internshipEligible,
        fullTimeEligible: user?.fullTimeEligible,
        slab: user?.slab || '-'
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleViewResume = async () => {
        try {
            const accessToken = await getAccessToken()
            const refreshToken = await getRefreshToken()

            if (!accessToken || !refreshToken)
                throw new Error("Tokens are required")

            const response = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:5000/api/v1/users/view-resume`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'x-refresh-token': refreshToken
                }
            })

            if (!response.ok)
                throw new Error("Something went wrong")

            const result = await response.json()
            // console.log(result);


            await openPdf(result?.data)

        } catch (error) {
            console.error('Error fetching resume:', error?.message);
            Alert.alert('Error', 'Failed to log out. Please try again.');
        }
    };

    const openPdf = async (pdfLink) => {
        if (Platform.OS === 'android') {
            IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                data: pdfLink,
                type: 'application/pdf',
            });
        } else {
            await Linking.openURL(result?.data);
        }
    }

    const ProfileField = ({ label, value }) => (
        <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <Text style={styles.fieldValue}>{value}</Text>
        </View>
    );

    const Badge = ({ text, isPositive, outlined }) => (
        <View style={[
            styles.badge,
            isPositive ? styles.positiveBadge : styles.negativeBadge,
            outlined && styles.outlinedBadge
        ]}>
            <Text style={[
                styles.badgeText,
                outlined && styles.outlinedBadgeText
            ]}>
                {text}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#C92EFF" />
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.profileHeader}>
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>{profile.name.charAt(0)}</Text>
                    </View>
                    <Text style={styles.profileName}>{profile.name}</Text>
                </View>

                {/* Stats section for semester and CGPA */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{profile.semester}</Text>
                        <Text style={styles.statLabel}>Semester</Text>
                    </View>

                    <View style={styles.statDivider} />

                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{profile.cgpa}</Text>
                        <Text style={styles.statLabel}>CGPA</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Personal Information</Text>
                    <ProfileField label="Email" value={profile.email} />
                    <ProfileField label="Roll Number" value={profile.rollNo} />
                    <ProfileField label="Mobile Number" value={profile.mobileNo} />
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Academic Information</Text>
                    <ProfileField label="Branch" value={profile.branch} />
                    <ProfileField label="Batch" value={profile.batch} />
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Eligibility Status</Text>
                    <View style={styles.badgesContainer}>
                        <Badge
                            text={profile.internshipEligible ? "Internship Eligible" : "Not Eligible for Internship"}
                            isPositive={profile.internshipEligible}
                        />
                        <Badge
                            text={profile.fullTimeEligible ? "Full-Time Eligible" : "Not Eligible for Full-Time"}
                            isPositive={profile.fullTimeEligible}
                        />
                        {!profile.fullTimeEligible && profile.slab && (
                            <Badge text={`Slab: ${profile.slab}`} outlined={true} />
                        )}
                    </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleViewResume}>
                    <Text style={styles.buttonText}>View Resume</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a0525', // Darker than card backgrounds for contrast
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#2d0a41',
        borderBottomWidth: 1,
        borderBottomColor: '#390852',
        marginTop: 25
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButtonText: {
        marginLeft: 4,
        fontSize: 16,
        color: '#C92EFF',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    profileHeader: {
        alignItems: 'center',
        padding: 24,
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#C92EFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 3,
        borderColor: '#C92EFF',
    },
    avatarText: {
        fontSize: 32,
        color: '#fff',
        fontWeight: 'bold',
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    card: {
        backgroundColor: '#2d0a41',
        borderRadius: 15,
        padding: 16,
        marginHorizontal: 15,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#C92EFF',
    },
    fieldContainer: {
        marginBottom: 12,
    },
    fieldLabel: {
        fontSize: 14,
        color: '#b388e9',
        marginBottom: 4,
    },
    fieldValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#fff',
    },
    badgesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginBottom: 8,
    },
    positiveBadge: {
        backgroundColor: '#4CAF50',
    },
    negativeBadge: {
        backgroundColor: '#F44336',
    },
    outlinedBadge: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#C92EFF',
    },
    badgeText: {
        color: '#fff',
        fontWeight: '500',
        fontSize: 14,
    },
    outlinedBadgeText: {
        color: '#C92EFF',
    },
    button: {
        backgroundColor: '#C92EFF',
        borderRadius: 15,
        padding: 16,
        alignItems: 'center',
        marginHorizontal: 15,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    // Stats section styles
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#2d0a41',
        marginHorizontal: 15,
        marginBottom: 16,
        padding: 15,
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
    statItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statValue: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    statLabel: {
        color: '#b388e9',
        fontSize: 14,
        marginTop: 5,
    },
    statDivider: {
        width: 1,
        height: '80%',
        backgroundColor: '#390852',
    },
});

export default ProfileView;