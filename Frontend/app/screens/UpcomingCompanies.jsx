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
	Alert,
	TextInput
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { getAccessToken, getRefreshToken } from '../../utils/tokenStorage.js';
import { useUser } from '../../context/userContext.js';
import { router } from 'expo-router';

const imageMap = {
	'Apple.png': require('@/assets/companyImages/apple.png'),
	'Google.png': require('@/assets/companyImages/Google-new.png'),
	'Microsoft.png': require('@/assets/companyImages/Microsoft.png'),
	'Amazon.png': require('@/assets/companyImages/amazon2.png'),
	'Meta.png': require('@/assets/companyImages/meta-new.webp'),
	'Netflix.png': require('@/assets/companyImages/Netflix_Symbol_RGB.png'),
	'Nvidia.png': require('@/assets/companyImages/Nvidia.png'),
	'Gameskraft.png': require("@/assets/companyImages/gameskraft-bg.png"),
	'Morgan Stanley.png': require("@/assets/companyImages/morganStanley.jpg"),
	'Uber.png': require("@/assets/companyImages/uber.png")
};

const CompanyListings = () => {
	const [companies, setCompanies] = useState([]);
	const [filteredCompanies, setFilteredCompanies] = useState([]);
	const { user, theme } = useUser();
	const [showFilters, setShowFilters] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');

	// Filter states
	const [filterBatch, setFilterBatch] = useState('');
	const [filterRole, setFilterRole] = useState('');
	const [filterCGPA, setFilterCGPA] = useState('');
	const [filterBranch, setFilterBranch] = useState('');
	const [filterOpportunityType, setFilterOpportunityType] = useState('');

	// Get unique values for filter dropdowns
	const [uniqueBatches, setUniqueBatches] = useState([]);
	const [uniqueRoles, setUniqueRoles] = useState([]);
	const [uniqueBranches, setUniqueBranches] = useState([]);
	const [uniqueOpportunityTypes, setUniqueOpportunityTypes] = useState([]);

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
		if (companies.length > 0) {
			extractFilterOptions();
			applyFilters();
		}
	}, [companies, searchQuery, filterBatch, filterRole, filterCGPA, filterBranch, filterOpportunityType]);

	const extractFilterOptions = () => {
		if (!companies || !Array.isArray(companies)) return;

		const batches = new Set();
		const roles = new Set();
		const branches = new Set();
		const opportunityTypes = new Set();

		companies.forEach(company => {
			// Normalize and add eligible batches
			if (Array.isArray(company?.eligibleBatch)) {
				company.eligibleBatch.forEach(batch => {
					if (batch) batches.add(String(batch).trim());
				});
			}

			// Normalize and add roles
			if (company?.role && typeof company.role === 'string') {
				roles.add(company.role.trim());
			}

			// Normalize and add eligible branches
			if (Array.isArray(company?.eligibleBranches)) {
				company?.eligibleBranches?.forEach(branch => {
					if (branch && typeof branch === 'string') {
						branches.add(branch.trim());
					}
				});
			}

			// Normalize and add opportunity types
			if (company?.opportunityType && typeof company.opportunityType === 'string') {
				opportunityTypes.add(company.opportunityType.trim());
			}
		});

		setUniqueBatches([...batches].sort());
		setUniqueRoles([...roles].sort());
		setUniqueBranches([...branches].sort());
		setUniqueOpportunityTypes([...opportunityTypes].sort());
	};


	const applyFilters = () => {
		let filtered = [...companies];

		// Apply search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(company =>
				company.companyName.toLowerCase().includes(query) ||
				(company.role && company.role.toLowerCase().includes(query))
			);
		}

		// Apply batch filter
		if (filterBatch) {
			filtered = filtered.filter(company =>
				company.eligibleBatches && company.eligibleBatches.includes(filterBatch)
			);
		}

		// Apply role filter
		if (filterRole) {
			filtered = filtered.filter(company =>
				company.role && company.role === filterRole
			);
		}

		// Apply CGPA filter
		if (filterCGPA) {
			const cgpa = parseFloat(filterCGPA);
			filtered = filtered.filter(company =>
				company.cgpaCriteria && parseFloat(company.cgpaCriteria) <= cgpa
			);
		}

		// Apply branch filter
		if (filterBranch) {
			filtered = filtered.filter(company =>
				company.eligibleBranches && company.eligibleBranches.includes(filterBranch)
			);
		}

		// Apply opportunity type filter
		if (filterOpportunityType) {
			filtered = filtered.filter(company =>
				company.opportunityType === filterOpportunityType
			);
		}

		setFilteredCompanies(filtered);
	};

	const fetchAllCompanies = async () => {
		try {
			const accessToken = await getAccessToken();
			const refreshToken = await getRefreshToken();

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

			if (result.statusCode === 200) {
				const normalizedCompanies = normalizeDecimalFields(result.data);
				setCompanies(normalizedCompanies);
				setFilteredCompanies(normalizedCompanies);
				// console.log(normalizedCompanies);

			} else {
				Alert.alert('Error', result?.message || "Something went wrong. Please try again later");
			}
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
	};

	const checkEligibility = (company) => {
		const branchEligibility = company?.eligibleBranches?.includes(user?.branch);
		const batchEligibility = company?.eligibleBatches?.includes(user?.batch) || true;
		const cgpaEligibility = company?.cgpaCriteria <= user?.CGPA;
		const internshipEligibility = user?.internshipEligible;
		let fullTimeEligibility = user?.fullTimeEligible;

		if (!fullTimeEligibility)
			fullTimeEligibility = getSlab(parseFloat(company?.ctc?.split(" ")[0])) > user?.slab;

		if (company.opportunityType === 'Internship')
			return branchEligibility && batchEligibility && cgpaEligibility && internshipEligibility;
		else if (company.opportunityType === 'Full Time') {
			return branchEligibility && batchEligibility && cgpaEligibility && fullTimeEligibility;
		} else {
			return branchEligibility && batchEligibility && cgpaEligibility && internshipEligibility && fullTimeEligibility;
		}
	};

	const navigateToCompanyDetail = (company) => {
		// Store company in global state or navigate with params
		router.push({
			pathname: 'screens/CompanyDetail',
			params: { companyId: company._id }
		});
	};

	const clearFilters = () => {
		setSearchQuery('');
		setFilterBatch('');
		setFilterRole('');
		setFilterCGPA('');
		setFilterBranch('');
		setFilterOpportunityType('');
	};

	const renderCompanyCard = (company) => {
		const isEligible = checkEligibility(company);
		const hasApplied = user?.appliedCompanies?.some(c => c.companyId === company._id);

		// Theme-based colors
		const cardBackgroundColors = theme === 'light'
			? ['#FFFFFF', '#F0F0F0']
			: ['rgba(138, 35, 135, 0.8)', 'rgba(26, 1, 44, 0.9)'];

		const companyNameColor = theme === 'light' ? "#6A0DAD" : 'white';
		const textColor = theme === 'light' ? '#333333' : 'white';
		const subtextColor = theme === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.7)';

		return (
			<TouchableOpacity
				key={company._id}
				style={styles.cardWrapper}
				onPress={() => navigateToCompanyDetail(company)}
			>
				<LinearGradient
					colors={cardBackgroundColors}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={[
						styles.companyCard,
						{
							backgroundColor: theme === 'light'
								? 'rgba(106, 13, 173, 0.05)'
								: 'transparent'
						}
					]}
				>
					<View style={styles.cardHeader}>
						<Image
							source={imageMap[`${company?.companyName}.png`]}
							style={styles.companyLogo}
							onError={() => console.log('Image failed to load')}
						/>
						<View style={styles.cardHeaderText}>
							<Text style={[styles.companyCardName, { color: companyNameColor }]}>
								{company?.companyName}
							</Text>
							<Text style={[styles.companyRole, { color: subtextColor }]}>
								{company?.role || "No Role Specified"}
							</Text>
						</View>
						{hasApplied && (
							<View style={styles.appliedBadge}>
								<Text style={styles.appliedText}>Applied</Text>
							</View>
						)}
					</View>

					<View style={[
						styles.cardDivider,
						{
							backgroundColor: theme === 'light'
								? 'rgba(106, 13, 173, 0.2)'
								: 'rgba(255, 255, 255, 0.15)'
						}
					]} />

					<View style={styles.cardDetails}>
						<View style={styles.detailRow}>
							<View style={styles.detailItem}>
								<FontAwesome
									name="graduation-cap"
									size={14}
									color={theme === 'light' ? '#6A0DAD' : '#fff'}
									style={styles.detailIcon}
								/>
								<Text style={[styles.detailText, { color: textColor }]}>
									{company?.eligibleBranches ?
										(company.eligibleBranches.length > 2 ?
											`${company.eligibleBranches.slice(0, 2).join(', ')}...` :
											company.eligibleBranches.join(', ')
										) :
										"All Branches"
									}
								</Text>
							</View>

							<View style={styles.detailItem}>
								<FontAwesome
									name="star"
									size={14}
									color={theme === 'light' ? '#6A0DAD' : '#fff'}
									style={styles.detailIcon}
								/>
								<Text style={[styles.detailText, { color: textColor }]}>
									CGPA: {company?.cgpaCriteria || "N/A"}
								</Text>
							</View>
						</View>

						<View style={styles.detailRow}>
							<View style={styles.detailItem}>
								<FontAwesome
									name="users"
									size={14}
									color={theme === 'light' ? '#6A0DAD' : '#fff'}
									style={styles.detailIcon}
								/>
								<Text style={[styles.detailText, { color: textColor }]}>
									{company?.eligibleBatches ?
										company.eligibleBatches.join(', ') :
										"All Batches"
									}
								</Text>
							</View>

							<View style={styles.detailItem}>
								<FontAwesome
									name="building"
									size={14}
									color={theme === 'light' ? '#6A0DAD' : '#fff'}
									style={styles.detailIcon}
								/>
								<Text style={[styles.detailText, { color: textColor }]}>
									{company?.opportunityType || "N/A"}
								</Text>
							</View>
						</View>
					</View>

					<View style={styles.cardFooter}>
						<TouchableOpacity
							style={[
								styles.eligibilityBadge,
								isEligible ?
									{ backgroundColor: 'rgba(23, 196, 17, 0.8)' } :
									{ backgroundColor: 'rgba(207, 17, 17, 0.8)' }
							]}
						>
							<Text style={styles.eligibilityText}>
								{isEligible ? "Eligible" : "Not Eligible"}
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[
								styles.viewDetailsButton,
								{
									backgroundColor: theme === 'light'
										? 'rgba(106, 13, 173, 0.7)'
										: 'rgba(187, 57, 191, 0.8)'
								}
							]}
							onPress={() => navigateToCompanyDetail(company)}
						>
							<Text style={styles.viewDetailsText}>View Details</Text>
						</TouchableOpacity>
					</View>
				</LinearGradient>
			</TouchableOpacity>
		);
	};

	const renderFilterItem = (title, value, setValue, options) => {
		const dropdownColors = theme === 'light'
			? { bg: 'rgba(106, 13, 173, 0.1)', text: '#6A0DAD', border: 'rgba(106, 13, 173, 0.3)' }
			: { bg: 'rgba(187, 57, 191, 0.2)', text: 'white', border: 'rgba(187, 57, 191, 0.5)' };

		return (
			<View style={styles.filterItem}>
				<Text style={[styles.filterLabel, { color: theme === 'light' ? '#6A0DAD' : 'white' }]}>
					{title}
				</Text>
				<TouchableOpacity
					style={[
						styles.filterDropdown,
						{
							backgroundColor: dropdownColors.bg,
							borderColor: dropdownColors.border
						}
					]}
					onPress={() => {
						// In a real implementation, this would open a modal or dropdown
						// For simplicity, we'll show a modal picker in this example
						Alert.alert(
							`Select ${title}`,
							'',
							[
								{ text: 'Clear', onPress: () => setValue('') },
								...options.map(option => ({
									text: option,
									onPress: () => setValue(option)
								})),
								{ text: 'Cancel', style: 'cancel' }
							]
						);
					}}
				>
					<Text style={[styles.filterDropdownText, { color: dropdownColors.text }]}>
						{value || `Select ${title}`}
					</Text>
					<FontAwesome name="chevron-down" size={12} color={dropdownColors.text} />
				</TouchableOpacity>
			</View>
		);
	};

	// Background and theme styling
	const backgroundGradientColors = theme === 'light'
		? ['#F5F5F5', '#E0E0E0']
		: ['#2d0e3e', '#1a012c'];

	const statusBarStyle = theme === 'light' ? 'dark-content' : 'light-content';
	const statusBarBackgroundColor = theme === 'light' ? '#F5F5F5' : '#2d0e3e';
	const searchBgColor = theme === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(50, 8, 74, 0.9)';
	const searchTextColor = theme === 'light' ? '#333' : 'white';
	const searchPlaceholderColor = theme === 'light' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)';

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
		<SafeAreaView style={[
			styles.safeArea,
			{
				backgroundColor: theme === 'light' ? '#F5F5F5' : '#2d0e3e'
			}
		]}>
			<LinearGradient
				colors={backgroundGradientColors}
				style={styles.container}
			>
				<StatusBar
					barStyle={statusBarStyle}
					backgroundColor={statusBarBackgroundColor}
				/>

				{/* Header with Logo */}
				<BlurView
					intensity={theme === 'light' ? 10 : 30}
					tint={theme === 'light' ? 'light' : 'dark'}
					style={[
						styles.headerBlur,
						{
							borderBottomColor: theme === 'light'
								? 'rgba(0,0,0,0.1)'
								: 'rgba(255, 255, 255, 0.1)'
						}
					]}
				>
					<View style={styles.header}>
						<View style={styles.logoContainer}>
							<Image
								source={require('@/assets/images/logo.png')}
								style={styles.logo}
							/>
							<Text style={[
								styles.logoText,
								{ color: theme === 'light' ? '#6A0DAD' : '#ffffff' }
							]}>
								Placement Plus
							</Text>
						</View>
						<TouchableOpacity
							style={styles.profileButton}
							onPress={() => router.push('screens/Profile/Profile')}
						>
							<Ionicons
								name="person-circle"
								size={45}
								color={'#6A0DAD'}
							/>
						</TouchableOpacity>
					</View>
				</BlurView>

				{/* Search Bar */}
				<View style={styles.searchContainer}>
					<View style={[styles.searchBar, { backgroundColor: searchBgColor }]}>
						<FontAwesome name="search" size={16} color={theme === 'light' ? '#6A0DAD' : '#bb39bf'} />
						<TextInput
							style={[styles.searchInput, { color: searchTextColor }]}
							placeholder="Search companies or roles..."
							placeholderTextColor={searchPlaceholderColor}
							value={searchQuery}
							onChangeText={setSearchQuery}
						/>
						{searchQuery !== '' && (
							<TouchableOpacity onPress={() => setSearchQuery('')}>
								<FontAwesome name="times-circle" size={16} color={theme === 'light' ? '#6A0DAD' : '#bb39bf'} />
							</TouchableOpacity>
						)}
					</View>

					<TouchableOpacity
						style={[
							styles.filterButton,
							{
								backgroundColor: theme === 'light'
									? 'rgba(106, 13, 173, 0.7)'
									: 'rgba(187, 57, 191, 0.8)'
							}
						]}
						onPress={() => setShowFilters(!showFilters)}
					>
						<FontAwesome name="filter" size={16} color="white" />
					</TouchableOpacity>
				</View>

				{/* Filter Panel */}
				{showFilters && (
					<BlurView
						intensity={theme === 'light' ? 10 : 20}
						tint={theme === 'light' ? 'light' : 'dark'}
						style={[
							styles.filterPanel,
							{
								borderColor: theme === 'light'
									? 'rgba(106, 13, 173, 0.2)'
									: 'rgba(187, 57, 191, 0.3)'
							}
						]}
					>
						<View style={styles.filterHeader}>
							<Text style={[
								styles.filterTitle,
								{ color: theme === 'light' ? '#6A0DAD' : 'white' }
							]}>
								Filters
							</Text>
							<TouchableOpacity
								style={styles.clearFiltersButton}
								onPress={clearFilters}
							>
								<Text style={[
									styles.clearFiltersText,
									{ color: theme === 'light' ? '#6A0DAD' : '#bb39bf' }
								]}>
									Clear All
								</Text>
							</TouchableOpacity>
						</View>

						<View style={styles.filterContent}>
							{renderFilterItem('Batch', filterBatch, setFilterBatch, uniqueBatches)}
							{renderFilterItem('Role', filterRole, setFilterRole, uniqueRoles)}

							<View style={styles.filterItem}>
								<Text style={[styles.filterLabel, { color: theme === 'light' ? '#6A0DAD' : 'white' }]}>
									Min CGPA
								</Text>
								<TextInput
									style={[
										styles.filterInput,
										{
											backgroundColor: theme === 'light' ? 'rgba(106, 13, 173, 0.1)' : 'rgba(187, 57, 191, 0.2)',
											borderColor: theme === 'light' ? 'rgba(106, 13, 173, 0.3)' : 'rgba(187, 57, 191, 0.5)',
											color: theme === 'light' ? '#6A0DAD' : 'white'
										}
									]}
									placeholder="Enter CGPA"
									placeholderTextColor={theme === 'light' ? 'rgba(106, 13, 173, 0.5)' : 'rgba(255, 255, 255, 0.5)'}
									value={filterCGPA}
									onChangeText={setFilterCGPA}
									keyboardType="numeric"
								/>
							</View>

							{renderFilterItem('Branch', filterBranch, setFilterBranch, uniqueBranches)}
							{renderFilterItem('Type', filterOpportunityType, setFilterOpportunityType, uniqueOpportunityTypes)}
						</View>
					</BlurView>
				)}

				{/* Results Count */}
				<View style={styles.resultsCountContainer}>
					<Text style={[
						styles.resultsCount,
						{ color: theme === 'light' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)' }
					]}>
						Showing {filteredCompanies.length} of {companies.length} companies
					</Text>
				</View>

				{/* Company Cards */}
				<ScrollView
					style={styles.companyListContainer}
					contentContainerStyle={styles.companyListContent}
					showsVerticalScrollIndicator={false}
				>
					{filteredCompanies.length > 0 ? (
						filteredCompanies.map(company => renderCompanyCard(company))
					) : (
						<View style={styles.noResultsContainer}>
							<FontAwesome
								name="search"
								size={50}
								color={theme === 'light' ? 'rgba(106, 13, 173, 0.5)' : 'rgba(187, 57, 191, 0.5)'}
							/>
							<Text style={[
								styles.noResultsText,
								{ color: theme === 'light' ? '#6A0DAD' : 'white' }
							]}>
								No companies match your filters
							</Text>
							<TouchableOpacity
								style={[
									styles.resetButton,
									{
										backgroundColor: theme === 'light'
											? 'rgba(106, 13, 173, 0.7)'
											: 'rgba(187, 57, 191, 0.8)'
									}
								]}
								onPress={clearFilters}
							>
								<Text style={styles.resetButtonText}>Reset Filters</Text>
							</TouchableOpacity>
						</View>
					)}
					<View style={styles.scrollPadding} />
				</ScrollView>

				{/* Footer with Social Media Icons */}
				<BlurView
					intensity={theme === 'light' ? 10 : 20}
					tint={theme === 'light' ? 'light' : 'dark'}
					style={[
						styles.footerBlur,
						{
							borderTopColor: theme === 'light'
								? 'rgba(0,0,0,0.1)'
								: 'rgba(255, 255, 255, 0.1)'
						}
					]}
				>
					<View style={styles.footer}>
						<TouchableOpacity
							style={[
								styles.socialButton,
								{
									backgroundColor: theme === 'light'
										? 'rgba(106, 13, 173, 0.2)'
										: 'rgba(187, 57, 191, 0.3)'
								}
							]}
						>
							<FontAwesome
								name="facebook"
								size={20}
								color={theme === 'light' ? '#6A0DAD' : '#fff'}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
								styles.socialButton,
								{
									backgroundColor: theme === 'light'
										? 'rgba(106, 13, 173, 0.2)'
										: 'rgba(187, 57, 191, 0.3)'
								}
							]}
						>
							<FontAwesome
								name="twitter"
								size={20}
								color={theme === 'light' ? '#6A0DAD' : '#fff'}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
								styles.socialButton,
								{
									backgroundColor: theme === 'light'
										? 'rgba(106, 13, 173, 0.2)'
										: 'rgba(187, 57, 191, 0.3)'
								}
							]}
						>
							<FontAwesome
								name="instagram"
								size={20}
								color={theme === 'light' ? '#6A0DAD' : '#fff'}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
								styles.socialButton,
								{
									backgroundColor: theme === 'light'
										? 'rgba(106, 13, 173, 0.2)'
										: 'rgba(187, 57, 191, 0.3)'
								}
							]}
						>
							<FontAwesome
								name="linkedin"
								size={20}
								color={theme === 'light' ? '#6A0DAD' : '#fff'}
							/>
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
		fontSize: 22,
		fontWeight: 'bold',
		fontFamily: 'System',
	},
	profileButton: {
		// Empty styles for padding
	},
	searchContainer: {
		flexDirection: 'row',
		marginBottom: 15,
		alignItems: 'center',
	},
	searchBar: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderRadius: 12,
		marginRight: 10,
	},
	searchInput: {
		flex: 1,
		marginLeft: 10,
		fontSize: 16,
	},
	filterButton: {
		width: 45,
		height: 45,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
	},
	filterPanel: {
		borderRadius: 12,
		marginBottom: 15,
		padding: 15,
		borderWidth: 1,
	},
	filterHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 15,
	},
	filterTitle: {
		fontSize: 18,
		fontWeight: '600',
	},
	clearFiltersButton: {},
	clearFiltersText: {
		fontSize: 14,
		fontWeight: '500',
	},
	filterContent: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	filterItem: {
		width: '48%',
		marginBottom: 15,
	},
	filterLabel: {
		fontSize: 14,
		fontWeight: '500',
		marginBottom: 6,
	},
	filterDropdown: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 12,
		paddingVertical: 10,
		borderRadius: 8,
		borderWidth: 1,
	},
	filterDropdownText: {
		fontSize: 14,
		fontWeight: '500',
	},
	filterInput: {
		paddingHorizontal: 12,
		paddingVertical: 10,
		borderRadius: 8,
		borderWidth: 1,
		fontSize: 14,
	},
	resultsCountContainer: {
		marginBottom: 15,
	},
	resultsCount: {
		fontSize: 14,
		fontWeight: '500',
	},
	companyListContainer: {
		flex: 1,
	},
	companyListContent: {
		paddingTop: 5,
	},
	cardWrapper: {
		marginBottom: 15,
	},
	companyCard: {
		borderRadius: 16,
		padding: 16,
		shadowColor: '#bb39bf',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
		elevation: 5,
	},
	cardHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
	},
	companyLogo: {
		width: 50,
		height: 50,
		marginRight: 12,
	},
	cardHeaderText: {
		flex: 1,
	},
	companyCardName: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 4,
	},
	companyRole: {
		fontSize: 14,
	},
	appliedBadge: {
		paddingHorizontal: 10,
		paddingVertical: 5,
		backgroundColor: 'rgba(119, 136, 153, 0.7)',
		borderRadius: 12,
	},
	appliedText: {
		color: 'white',
		fontSize: 12,
		fontWeight: '600',
	},
	cardDivider: {
		height: 1,
		marginVertical: 12,
	},
	cardDetails: {
		marginBottom: 12,
	},
	detailRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 8,
	},
	detailItem: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	detailIcon: {
		marginRight: 8,
	},
	detailText: {
		fontSize: 14,
	},
	cardFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	eligibilityBadge: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 8,
	},
	eligibilityText: {
		color: 'white',
		fontSize: 12,
		fontWeight: '600',
	},
	viewDetailsButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 8,
	},
	viewDetailsText: {
		color: 'white',
		fontSize: 14,
		fontWeight: '600',
	},
	noResultsContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: 40,
	},
	noResultsText: {
		fontSize: 16,
		fontWeight: '500',
		marginTop: 15,
		marginBottom: 20,
		textAlign: 'center',
	},
	resetButton: {
		paddingHorizontal: 20,
		paddingVertical: 12,
		borderRadius: 8,
	},
	resetButtonText: {
		color: 'white',
		fontSize: 14,
		fontWeight: '600',
	},
	footerBlur: {
		borderTopWidth: 1,
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
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: 12,
	},
	scrollPadding: {
		height: 20,
	},
});

export default CompanyListings;