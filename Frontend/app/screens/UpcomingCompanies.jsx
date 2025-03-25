import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	StyleSheet,
	StatusBar,
	ScrollView,
	SafeAreaView,
	Alert
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { getAccessToken, getRefreshToken } from '../../utils/tokenStorage.js';
import { useUser } from '../../context/userContext.js';

const imageMap = {
	'Apple.png': require('@/assets/images/apple.png'),
	'Google.png': require('@/assets/images/google.png'),
	'Microsoft.png': require('@/assets/images/microsoft.png'),
	'Amazon.png': require('@/assets/images/amazon.png'),
	'Meta.png': require('@/assets/images/meta.png'),
	'Netflix.png': require('@/assets/images/netflix.png'),
	'Nvidia.png': require('@/assets/images/nvidia.png'),
};

const App = () => {
	const [companies, setCompanies] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const { user, login } = useUser()

	const showNextCompany = () => {
		if (currentIndex < companies.length - 1) {
			setCurrentIndex(currentIndex + 1);
		}
	};

	const showPreviousCompany = () => {
		if (currentIndex > 0) {
			setCurrentIndex(currentIndex - 1);
		}
	};

	const renderCompanyCard = () => {
		const item = companies[currentIndex];
		return (
			<View style={styles.cardContainer}>
				<LinearGradient
					colors={['rgba(138, 35, 135, 0.8)', 'rgba(26, 1, 44, 0.9)']}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={styles.card}
				>
					<View style={styles.companyHeader}>
						<Image
							source={imageMap[`${item.companyName}.png`]}
							style={styles.image}
							onError={() => console.log('Image failed to load')}
						/>
						<View style={styles.headerTextContainer}>
							<Text style={styles.companyName}>{item.companyName}</Text>
						</View>
					</View>

					<View style={styles.divider} />

					<ScrollView style={styles.detailsScrollView} showsVerticalScrollIndicator={false}>
						<View style={styles.detailsContainer}>
							<DetailItem icon="graduation-cap" label="Eligible Branches" value={item?.eligibleBranches?.join(', ')} />
							<DetailItem icon="users" label="Eligible Batches" value={item?.eligibleBatches?.join(', ')} />
							<DetailItem icon="briefcase" label="Role" value={item?.role} />
							<DetailItem icon="star" label="CGPA Criteria" value={item?.cgpaCriteria} />
							<DetailItem icon="tasks" label="Hiring Process" value={item?.hiringProcess} />
							<DetailItem icon="map-marker" label="Job Location" value={item?.jobLocation} />
							<DetailItem icon="calendar" label="Schedule" value={item?.schedule} />
							<DetailItem icon="laptop" label="Mode" value={item?.mode} />
							<DetailItem icon="building" label="Opportunity Type" value={item?.opportunityType} />
							<DetailItem icon="info-circle" label="Extra Details" value={item?.extraDetails} />
							<DetailItem icon="user" label="Point of Contact" value={item?.pocDetails?.name} />
							<DetailItem icon="phone" label="Contact Number" value={item?.pocDetails?.contactNo} />
							{checkEligibiity(currentIndex) ? (
								<TouchableOpacity
									style={[
										styles.applyButton,
										styles.eligible
									]}
									onPress={() => handleApplyCompany(currentIndex)}
								>
									<Text style={styles.applyButtonText}>
										Apply
									</Text>
								</TouchableOpacity>) : (
								<TouchableOpacity
									style={[
										styles.applyButton,
										styles.notEligible,
									]}
								>
									<Text style={styles.applyButtonText}>
										Not Eligible
									</Text>
								</TouchableOpacity>
							)}

							<View style={styles.scrollPadding} />
						</View>
					</ScrollView>
				</LinearGradient>
			</View>
		);
	};

	const normalizeDecimalFields = (data) => {
		return data.map((item) => ({
			...item,
			cgpaCriteria: item.cgpaCriteria?.$numberDecimal || item.cgpaCriteria,
			stipend: item.stipend?.$numberDecimal || item.stipend,
			ctc: item.ctc?.$numberDecimal || item.ctc,
		}));
	};

	useEffect(() => {
		fetchAllCompanies();
	}, []);

	useEffect(() => {
		fetchAllCompanies()
	}, [user])

	const fetchAllCompanies = async () => {
		try {

			const accessToken = await getAccessToken()
			const refreshToken = await getRefreshToken()

			const response = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:5000/api/v1/companies/list-all-company`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${accessToken}`,
					'x-refresh-token': `${refreshToken}`
				}
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || 'Failed to fetch companies');
			}
			// console.log(result.data);

			setCompanies(normalizeDecimalFields(result.data));
		} catch (error) {
			Alert.alert(
				"Error",
				error.message || "Something went wrong. Please try again.",
				[{ text: "OK" }]
			);
			console.error('Error:', error.message);
		}
	};

	const getSlab = (lpa) => {
		if (lpa <= 8)
			return 0;
		else if (lpa <= 12)
			return 1;
		else if (lpa <= 18)
			return 2;
		else if (lpa <= 25)
			return 3;
		else
			return 4;
	}

	const checkEligibiity = (index) => {
		const currentCompany = companies[index] || []

		const branchEligibility = currentCompany?.eligibleBranches?.includes(user.branch)
		const batchEligibility = currentCompany?.eligibleBatches?.includes(user.batch) || true
		const cgpaEligibility = currentCompany?.cgpaCriteria <= user.branch || true
		const internshipEligibility = user.internshipEligible
		let fullTimeEligibility = user.fullTimeEligible
		if (!fullTimeEligibility)
			fullTimeEligibility = getSlab(parseFloat(currentCompany?.ctc?.split(" ")[0])) > user.slab

		if (currentCompany.opportunityType === 'Internship')
			return branchEligibility && batchEligibility && cgpaEligibility && internshipEligibility
		else if (currentCompany.opportunityType === 'Full Time') {
			return branchEligibility && batchEligibility && cgpaEligibility && fullTimeEligibility
		} else {
			return branchEligibility && batchEligibility && cgpaEligibility && internshipEligibility && fullTimeEligibility
		}

	}

	const handleApplyCompany = async (index) => {
		const currentCompany = companies[index]
		if (!currentCompany)
			Alert.alert(
				"Error",
				"Company not found",
				[{ text: "OK" }]
			);

		try {
			const accessToken = await getAccessToken()
			const refreshToken = await getRefreshToken()

			const response = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:5000/api/v1/companies/apply-to-company/c/${currentCompany._id}`, {
				method: 'PATCH',
				headers: {
					'Authorization': `Bearer ${accessToken}`,
					'x-refresh-token': refreshToken,
					'Content-Type': 'application/json'
				}
			})
			// console.log(response);

			// if (!response.ok) {
			// 	throw new Error("Failed to apply to company")
			// }

			const result = await response.json()
			console.log(result);

			if (result.statusCode === 200) {
				login(result.data)

				Alert.alert(
					"Success",
					`Applied to ${currentCompany.companyName} successfully`,
					[{ text: "OK" }]
				);
			}

		} catch (error) {
			Alert.alert(
				"Error",
				error.message || "Something went wrong. Please try again.",
				[{ text: "OK" }]
			);
			console.error('Error:', error.message);
		}
	}

	const DetailItem = ({ icon, label, value }) => (
		<View style={styles.detailItem}>
			<View style={styles.iconContainer}>
				<FontAwesome name={icon} size={16} color="#fff" />
			</View>
			<View style={styles.detailTextContainer}>
				<Text style={styles.detailLabel}>{label}</Text>
				<Text style={styles.detailValue}>{value || "Not specified"}</Text>
			</View>
		</View>
	);

	if (companies.length === 0) {
		return (
			<View style={styles.loadingContainer}>
				<LinearGradient
					colors={['rgba(138, 35, 135, 0.8)', 'rgba(26, 1, 44, 0.9)']}
					style={styles.loadingGradient}
				>
					<Text style={styles.loadingText}>Loading...</Text>
				</LinearGradient>
			</View>
		);
	}

	return (
		<SafeAreaView style={styles.safeArea}>
			<LinearGradient
				colors={['#2d0e3e', '#1a012c']}
				style={styles.container}
			>
				<StatusBar barStyle="light-content" backgroundColor="#2d0e3e" />

				{/* Header with Logo */}
				<BlurView intensity={30} tint="dark" style={styles.headerBlur}>
					<View style={styles.header}>
						<View style={styles.logoContainer}>
							<Image source={require('@/assets/images/logo.png')} style={styles.logo} />
							<Text style={styles.logoText}>Placement Plus</Text>
						</View>
						<TouchableOpacity style={styles.profileButton}>
							<Ionicons name="person-circle" size={35} color="#fff" />
						</TouchableOpacity>
					</View>
				</BlurView>

				{/* Page Title & Indicators */}
				<View style={styles.titleContainer}>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.indicatorScrollContent}
					>
						<View style={styles.indicatorContainer}>
							{companies.map((_, i) => (
								<TouchableOpacity
									key={i}
									onPress={() => setCurrentIndex(i)}
								>
									<View
										style={[
											styles.indicator,
											{ backgroundColor: currentIndex === i ? '#bb39bf' : 'rgba(255, 255, 255, 0.2)' },
										]}
									/>
								</TouchableOpacity>
							))}
						</View>
					</ScrollView>
				</View>

				{/* Company Card */}
				{renderCompanyCard()}

				{/* Navigation Buttons */}
				<View style={styles.navigationButtons}>
					<TouchableOpacity
						style={[
							styles.navButton,
							currentIndex === 0 ? styles.navButtonDisabled : styles.navButtonEnabled
						]}
						onPress={showPreviousCompany}
						disabled={currentIndex === 0}
					>
						<FontAwesome name="chevron-left" size={16} color="white" />
						<Text style={styles.navButtonText}>Previous</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[
							styles.navButton,
							currentIndex === companies.length - 1 ? styles.navButtonDisabled : styles.navButtonEnabled
						]}
						onPress={showNextCompany}
						disabled={currentIndex === companies.length - 1}
					>
						<Text style={styles.navButtonText}>Next</Text>
						<FontAwesome name="chevron-right" size={16} color="white" />
					</TouchableOpacity>
				</View>

				{/* Footer with Social Media Icons */}
				<BlurView intensity={20} tint="dark" style={styles.footerBlur}>
					<View style={styles.footer}>
						<TouchableOpacity style={styles.socialButton}>
							<FontAwesome name="facebook" size={20} color="#fff" />
						</TouchableOpacity>
						<TouchableOpacity style={styles.socialButton}>
							<FontAwesome name="twitter" size={20} color="#fff" />
						</TouchableOpacity>
						<TouchableOpacity style={styles.socialButton}>
							<FontAwesome name="instagram" size={20} color="#fff" />
						</TouchableOpacity>
						<TouchableOpacity style={styles.socialButton}>
							<FontAwesome name="linkedin" size={20} color="#fff" />
						</TouchableOpacity>
					</View>
				</BlurView>
			</LinearGradient>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#2d0e3e',
	},
	container: {
		flex: 1,
		paddingHorizontal: 15,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	loadingGradient: {
		width: '80%',
		height: 100,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
	},
	loadingText: {
		color: 'white',
		fontSize: 18,
		fontWeight: '600',
	},
	headerBlur: {
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(255, 255, 255, 0.1)',
		marginBottom: 15,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		paddingTop: 15,
		paddingBottom: 15,
		paddingHorizontal: 5,
		marginTop: 15
	},
	logoContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	logo: {
		width: 30,
		height: 30,
		resizeMode: 'contain',
		marginRight: 10,
	},
	logoText: {
		color: 'white',
		fontSize: 22,
		fontWeight: 'bold',
		fontFamily: 'System',
	},
	profileButton: {
		padding: 5,
	},
	titleContainer: {
		alignItems: 'center',
		marginBottom: 20,
	},
	indicatorScrollContent: {
		paddingHorizontal: 10,
	},
	indicatorContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
	},
	indicator: {
		height: 6,
		width: 30,
		borderRadius: 3,
		marginHorizontal: 5,
	},
	cardContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 20,
	},
	card: {
		borderRadius: 24,
		padding: 24,
		width: '100%',
		height: '100%',
		shadowColor: '#bb39bf',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.5,
		shadowRadius: 24,
		elevation: 8,
	},
	companyHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 20,
	},
	image: {
		width: 70,
		height: 70,
		borderRadius: 35,
		borderWidth: 3,
		borderColor: 'rgba(255, 255, 255, 0.8)',
	},
	headerTextContainer: {
		marginLeft: 15,
		flex: 1,
	},
	companyName: {
		fontSize: 26,
		fontWeight: 'bold',
		color: 'white',
		fontFamily: 'System',
		letterSpacing: 0.5,
	},
	divider: {
		height: 1,
		backgroundColor: 'rgba(255, 255, 255, 0.15)',
		marginVertical: 20,
	},
	detailsScrollView: {
		flex: 1,
	},
	detailsContainer: {
		width: '100%',
	},
	detailItem: {
		flexDirection: 'row',
		marginBottom: 16,
		alignItems: 'flex-start',
	},
	iconContainer: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: 'rgba(187, 57, 191, 0.3)',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12,
	},
	detailTextContainer: {
		flex: 1,
	},
	detailLabel: {
		fontSize: 14,
		color: 'rgba(255, 255, 255, 0.7)',
		marginBottom: 4,
		fontFamily: 'System',
		fontWeight: '500',
	},
	detailValue: {
		fontSize: 16,
		color: 'white',
		fontFamily: 'System',
		fontWeight: '600',
	},
	applyButton: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 8,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 10,
		width: 128,
		elevation: 3
	},
	eligible: {
		backgroundColor: 'rgba(23, 196, 17, 0.7)',
	},
	notEligible: {
		backgroundColor: 'rgba(207, 17, 17, 0.7)',
	},
	applyButtonText: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#fff",
		textAlign: "center",
	},
	navigationButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 20,
	},
	navButton: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 12,
		justifyContent: 'center',
		width: '47%',
	},
	navButtonEnabled: {
		backgroundColor: 'rgba(187, 57, 191, 0.8)',
	},
	navButtonDisabled: {
		backgroundColor: 'rgba(187, 57, 191, 0.3)',
	},
	navButtonText: {
		color: 'white',
		fontSize: 15,
		fontWeight: '600',
		marginHorizontal: 8,
	},
	footerBlur: {
		borderTopWidth: 1,
		borderTopColor: 'rgba(255, 255, 255, 0.1)',
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 15,
	},
	socialButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: 'rgba(187, 57, 191, 0.3)',
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: 12,
	},
	scrollPadding: {
		height: 20,
	},
});

export default App;