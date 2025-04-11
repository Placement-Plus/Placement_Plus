import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	StyleSheet,
	StatusBar,
	Animated,
	Dimensions,
	FlatList,
	ScrollView,
	SafeAreaView,
	Linking,
} from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { getAccessToken, getRefreshToken } from '../../utils/tokenStorage.js'
import { useUser } from '../../context/userContext.js';
import { useRouter } from 'expo-router';
import { getFileFromAppwrite } from '../../utils/appwrite.js';
import { EXPO_PUBLIC_IP_ADDRESS } from "@env"

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = height * 0.65;

const AlumniPage = () => {
	const [activeIndex, setActiveIndex] = useState(0);
	const flatListRef = useRef(null);
	const scrollX = useRef(new Animated.Value(0)).current;
	const [alumniData, setAlumniData] = useState([])
	const { theme } = useUser()
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		fetchAlumniData()
	}, [])

	const fetchAlumniData = async () => {
		setIsLoading(true)
		try {
			const accessToken = await getAccessToken()
			const refreshToken = await getRefreshToken()

			const response = await fetch(`http://${EXPO_PUBLIC_IP_ADDRESS}:5000/api/v1/alumnis/get-details`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${accessToken}`,
					'x-refresh-token': refreshToken
				}
			})

			const result = await response.json()
			if (result.statusCode === 200) {
				const alumniWithImages = await Promise.all(
					result.data.map(async (alum) => {
						if (alum?.profilePicId) {
							const url = await getFileFromAppwrite(alum?.profilePicId);
							return { ...alum, profilePicUrl: url };
						} else
							return alum
					})
				);
				setAlumniData(alumniWithImages)
				console.log(alumniWithImages);

			} else {
				alert(result?.message)
			}

		} catch (error) {
			console.error('Failed to fetch alumni data:', error)
			alert('Failed to fetch alumni data. Please try again later.')
		} finally {
			setIsLoading(false)
		}
	}


	const onViewableItemsChanged = useRef(({ viewableItems }) => {
		if (viewableItems.length > 0) {
			setActiveIndex(viewableItems[0].index);
		}
	}).current;

	const viewabilityConfig = useRef({
		itemVisiblePercentThreshold: 50,
	}).current;

	const handleScroll = Animated.event(
		[{ nativeEvent: { contentOffset: { x: scrollX } } }],
		{ useNativeDriver: false }
	);

	const handlePrevious = () => {
		if (activeIndex > 0) {
			const newIndex = activeIndex - 1;
			setActiveIndex(newIndex);
			flatListRef.current?.scrollToOffset({
				offset: newIndex * CARD_WIDTH,
				animated: true,
			});
		}
	};

	const handleNext = () => {
		if (activeIndex < alumniData.length - 1) {
			const newIndex = activeIndex + 1;
			setActiveIndex(newIndex);
			flatListRef.current?.scrollToOffset({
				offset: newIndex * CARD_WIDTH,
				animated: true,
			});
		}
	};

	const getItemLayout = (_, index) => ({
		length: CARD_WIDTH,
		offset: CARD_WIDTH * index,
		index,
	});

	const handleConnect = (linkedInId) => {
		Linking.openURL(linkedInId).catch((err) => {
			console.error('Failed to open LinkedIn:', err);
			alert('Failed to open LinkedIn profile. Please check the URL.');
		});
	};

	const DetailItem = ({ icon, label, value }) => (
		<View style={styles.detailItem}>
			<View style={styles.iconBackground}>
				<FontAwesome name={icon} size={16} color="#fff" />
			</View>
			<View style={styles.detailTextContainer}>
				<Text style={styles.detailLabel}>{label}</Text>
				<Text style={styles.detailValue}>{value}</Text>
			</View>
		</View>
	);

	const renderAlumniCard = ({ item, index }) => {

		const inputRange = [
			(index - 1) * CARD_WIDTH,
			index * CARD_WIDTH,
			(index + 1) * CARD_WIDTH,
		];

		const scale = scrollX.interpolate({
			inputRange,
			outputRange: [0.9, 1, 0.9],
			extrapolate: 'clamp',
		});

		const opacity = scrollX.interpolate({
			inputRange,
			outputRange: [0.7, 1, 0.7],
			extrapolate: 'clamp',
		});

		return (
			<Animated.View
				style={[
					styles.cardContainer,
					{ transform: [{ scale }], opacity }
				]}
			>
				<ScrollView
					style={styles.cardScroll}
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.card}>
						{/* Alumni Header */}
						<View style={styles.alumniHeader}>
							<View style={styles.headerTextContainer}>
								{item?.profilePicUrl && (
									<Image source={{ uri: item.profilePicUrl }} style={styles.profileImage} />
								)}
								<View style={styles.infoContainer}>
									<Text style={styles.alumniName}>{item.name}</Text>
									<View style={styles.roleContainer}>
										<MaterialIcons name="work" size={14} color="#f0c5f1" />
										<Text style={styles.roleText}>
											{item.currentCompany.position} at {item.currentCompany.name}
										</Text>
									</View>
									<View style={styles.batchContainer}>
										<MaterialIcons name="school" size={14} color="#f0c5f1" />
										<Text style={styles.batchText}>Batch of {item.batch}</Text>
									</View>
								</View>
							</View>
						</View>

						{/* Current Company Section */}
						<View style={styles.companySection}>
							<View style={styles.cultureBadge}>
								<MaterialIcons name="stars" size={16} color="#fff" />
								<Text style={styles.cultureLabel}>Current Company</Text>
							</View>
							<Text style={styles.cultureDescription}>
								{item.currentCompany.position} at {item.currentCompany.name}
							</Text>
						</View>

						{/* Previous Companies Section */}
						<View style={styles.previousCompaniesSection}>
							<View style={styles.cultureBadge}>
								<MaterialIcons name="history" size={16} color="#fff" />
								<Text style={styles.cultureLabel}>Previous Experience</Text>
							</View>
							{item?.previousCompany && item.previousCompany.map((company, companyIndex) => (
								<View key={companyIndex} style={styles.previousCompanyItem}>
									<Text style={styles.previousCompanyName}>
										{company.Position} at {company.name}
									</Text>
									<Text style={styles.previousCompanyDuration}>
										Duration: {company.Duration} months
									</Text>
									<Text style={styles.previousCompanyExperience}>
										{company.Experience}
									</Text>
								</View>
							))}
						</View>

						<View style={styles.divider} />

						{/* Alumni Details */}
						<View style={styles.detailsContainer}>
							<DetailItem
								icon="envelope"
								label="Email"
								value={item.email}
							/>

							{/* Connect Button */}
							<TouchableOpacity
								style={styles.connectButton}
								onPress={() => handleConnect(item.linkedInId)}
							>
								<FontAwesome name="linkedin" size={16} color="#fff" style={styles.connectIcon} />
								<Text style={styles.connectText}>
									Connect with {item.name.split(' ')[0]}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</Animated.View>
		);
	};

	const getStyles = (currentTheme) => StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: currentTheme === 'light' ? '#F5F5F5' : '#120023',
		},
		header: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			width: '100%',
			paddingTop: 10,
			paddingBottom: 8,
			paddingHorizontal: 16,
			borderBottomWidth: 1,
			borderBottomColor: currentTheme === 'light' ? '#E0E0E0' : 'rgba(255, 255, 255, 0.05)',
			marginBottom: 20,
			marginTop: 20,
		},
		logoContainer: {
			flexDirection: 'row',
			alignItems: 'center',
		},
		logo: {
			width: 28,
			height: 28,
			resizeMode: 'contain',
			marginRight: 8,
		},
		logoText: {
			color: currentTheme === 'light' ? '#6A0DAD' : 'white',
			fontSize: 18,
			fontWeight: '700',
		},
		profileButton: {
			padding: 4,
		},
		titleContainer: {
			alignItems: 'center',
			marginVertical: 12,
			paddingHorizontal: 20,
		},
		indicatorContainer: {
			flexDirection: 'row',
			justifyContent: 'center',
		},
		indicator: {
			height: 6,
			width: 6,
			borderRadius: 3,
			marginHorizontal: 4,
			backgroundColor: currentTheme === 'light' ? '#C9C9C9' : '#555',
		},
		activeIndicator: {
			width: 20,
			backgroundColor: currentTheme === 'light' ? '#6A0DAD' : '#e535f7',
		},
		carouselContainer: {
			paddingHorizontal: width * 0.075,
		},
		cardContainer: {
			width: CARD_WIDTH,
			height: CARD_HEIGHT,
			justifyContent: 'center',
			alignItems: 'center',
		},
		cardScroll: {
			width: '100%',
			borderRadius: 24,
		},
		card: {
			backgroundColor: currentTheme === 'light' ? '#FFFFFF' : '#2c0847',
			borderRadius: 24,
			padding: 16,
			shadowColor: currentTheme === 'light' ? '#6A0DAD' : '#e535f7',
			shadowOffset: { width: 0, height: 8 },
			shadowOpacity: currentTheme === 'light' ? 0.1 : 0.3,
			shadowRadius: 12,
			elevation: 8,
			width: '100%',
			borderWidth: currentTheme === 'light' ? 1 : 0,
			borderColor: currentTheme === 'light' ? 'rgba(106, 13, 173, 0.1)' : 'transparent',
		},
		alumniHeader: {
			flexDirection: 'row',
			alignItems: 'center',
			marginBottom: 12,
		},
		headerTextContainer: {
			marginHorizontal: 8,
			paddingVertical: 8,
			flex: 1,
			flexDirection: 'row',
			alignItems: 'center',
			gap: 12,
			borderRadius: 12,
		},

		profileImage: {
			width: 80,
			height: 80,
			borderRadius: 100,
			marginRight: 12,
			borderWidth: 3,
			borderColor: currentTheme === 'light' ? 'rgba(136, 19, 220, 0.8)' : 'rgba(255, 255, 255, 0.2)',
		},

		infoContainer: {
			flex: 1,
			paddingVertical: 4,
		},

		alumniName: {
			fontSize: 22,
			fontWeight: '700',
			color: currentTheme === 'light' ? '#222' : '#fff',
			marginBottom: 2,
		},

		roleContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			marginTop: 4,
		},

		roleText: {
			fontSize: 15,
			color: currentTheme === 'light' ? '#6A0DAD' : '#f0c5f1',
			marginLeft: 6,
			fontWeight: '500',
		},

		batchContainer: {
			flexDirection: 'row',
			alignItems: 'center',
		},

		batchText: {
			fontSize: 14,
			color: currentTheme === 'light' ? '#6A0DAD' : '#f0c5f1',
			marginLeft: 6,
			fontWeight: '400',
		},

		companySection: {
			backgroundColor: currentTheme === 'light' ? 'rgba(106, 13, 173, 0.05)' : 'rgba(139, 8, 144, 0.15)',
			borderRadius: 16,
			padding: 12,
			marginVertical: 10,
			borderWidth: currentTheme === 'light' ? 1 : 0,
			borderColor: currentTheme === 'light' ? 'rgba(106, 13, 173, 0.1)' : 'transparent',
		},
		companyHeader: {
			flexDirection: 'row',
			alignItems: 'center',
			marginBottom: 8,
		},
		companyLogo: {
			width: 28,
			height: 28,
			borderRadius: 14,
			marginRight: 8,
		},
		companyName: {
			fontSize: 16,
			fontWeight: 'bold',
			color: currentTheme === 'light' ? '#333333' : 'white',
		},
		previousCompaniesSection: {
			backgroundColor: currentTheme === 'light' ? 'rgba(106, 13, 173, 0.05)' : 'rgba(139, 8, 144, 0.15)',
			borderRadius: 16,
			padding: 12,
			marginVertical: 10,
			borderWidth: currentTheme === 'light' ? 1 : 0,
			borderColor: currentTheme === 'light' ? 'rgba(106, 13, 173, 0.1)' : 'transparent',
		},
		previousCompanyItem: {
			marginBottom: 10,
			borderBottomWidth: 1,
			borderBottomColor: currentTheme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
			paddingBottom: 10,
		},
		previousCompanyName: {
			color: currentTheme === 'light' ? '#333333' : 'white',
			fontSize: 16,
			fontWeight: 'bold',
			marginBottom: 4,
		},
		previousCompanyDuration: {
			color: currentTheme === 'light' ? '#6A0DAD' : '#f0c5f1',
			fontSize: 14,
			marginBottom: 4,
		},
		previousCompanyExperience: {
			color: currentTheme === 'light' ? '#666666' : 'white',
			fontSize: 14,
			lineHeight: 20,
		},
		cultureBadge: {
			flexDirection: 'row',
			alignItems: 'center',
			backgroundColor: currentTheme === 'light' ? '#6A0DAD' : '#8b0890',
			alignSelf: 'flex-start',
			paddingHorizontal: 8,
			paddingVertical: 3,
			borderRadius: 10,
			marginBottom: 8,
		},
		cultureLabel: {
			color: 'white',
			fontSize: 12,
			fontWeight: 'bold',
			marginLeft: 4,
		},
		cultureDescription: {
			color: currentTheme === 'light' ? '#333333' : 'white',
			fontSize: 14,
			lineHeight: 20,
		},
		divider: {
			height: 1,
			backgroundColor: currentTheme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(254, 254, 254, 0.15)',
			marginVertical: 10,
		},
		detailsContainer: {
			width: '100%',
		},
		detailItem: {
			flexDirection: 'row',
			marginBottom: 12,
			alignItems: 'flex-start',
		},
		iconBackground: {
			width: 28,
			height: 28,
			borderRadius: 14,
			backgroundColor: currentTheme === 'light' ? '#6A0DAD' : '#8b0890',
			justifyContent: 'center',
			alignItems: 'center',
			marginRight: 12,
		},
		detailTextContainer: {
			flex: 1,
		},
		detailLabel: {
			fontSize: 12,
			color: currentTheme === 'light' ? '#6A0DAD' : '#f0c5f1',
			marginBottom: 2,
			fontWeight: '500',
		},
		detailValue: {
			fontSize: 14,
			color: currentTheme === 'light' ? '#333333' : 'white',
			fontWeight: '400',
		},
		connectButton: {
			backgroundColor: currentTheme === 'light' ? '#6A0DAD' : '#e535f7',
			borderRadius: 12,
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
			paddingVertical: 10,
			marginTop: 8,
		},
		connectIcon: {
			marginRight: 8,
		},
		connectText: {
			color: 'white',
			fontSize: 15,
			fontWeight: 'bold',
		},
		navigationButtons: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginTop: 10,
			marginBottom: 12,
			paddingHorizontal: 20,
		},
		navButton: {
			backgroundColor: currentTheme === 'light' ? '#6A0DAD' : '#8b0890',
			flexDirection: 'row',
			alignItems: 'center',
			paddingVertical: 8,
			paddingHorizontal: 10,
			borderRadius: 12,
			justifyContent: 'space-around',
			width: 110
		},
		navButtonText: {
			color: 'white',
			fontSize: 14,
			fontWeight: 'bold',
			marginHorizontal: 4,
		},
		pageIndicator: {
			backgroundColor: currentTheme === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.1)',
			paddingHorizontal: 10,
			paddingVertical: 4,
			borderRadius: 12,
		},
		pageText: {
			color: currentTheme === 'light' ? '#333333' : 'white',
			fontSize: 14,
			fontWeight: '500',
		},
		footer: {
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			marginTop: 'auto',
			marginBottom: 12,
			paddingTop: 12,
			borderTopWidth: 1,
			borderTopColor: currentTheme === 'light' ? '#E0E0E0' : 'rgba(255, 255, 255, 0.08)',
		},
		socialButton: {
			width: 32,
			height: 32,
			borderRadius: 16,
			backgroundColor: currentTheme === 'light' ? 'rgba(106, 13, 173, 0.7)' : 'rgba(139, 8, 144, 0.7)',
			justifyContent: 'center',
			alignItems: 'center',
			marginHorizontal: 8,
		},
	});

	const styles = useMemo(() => getStyles(theme), [theme]);

	if (isLoading) {
		return (
			<View style={styles.container}>
				<StatusBar barStyle="light-content" backgroundColor="#120023" />
				<View style={styles.header}>
					<Text style={styles.logoText}>Loading...</Text>
				</View>
			</View>
		)
	}

	{
		!isLoading && alumniData.length === 0 && (
			<Text style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>
				No alumni data found.
			</Text>
		)
	}


	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor="#120023" />

			{/* Header with Logo */}
			<View style={styles.header}>
				<View style={styles.logoContainer}>
					<Image source={require('@/assets/images/logo.png')} style={styles.logo} />
					<Text style={styles.logoText}>Placement Plus</Text>
				</View>
				<TouchableOpacity
					style={styles.profileButton}
					onPress={() => router.push('screens/Profile/Profile')}
				>
					<Ionicons name="person-circle" size={32} color={'#6A0DAD'} />
				</TouchableOpacity>
			</View>

			{/* Page Title with Indicators */}
			<View style={styles.titleContainer}>
				<View style={styles.indicatorContainer}>
					{alumniData.map((_, i) => (
						<View
							key={i}
							style={[
								styles.indicator,
								{ backgroundColor: activeIndex === i ? '#e535f7' : '#555' },
								activeIndex === i && styles.activeIndicator
							]}
						/>
					))}
				</View>
			</View>

			{/* Alumni Cards Carousel */}
			<FlatList
				ref={flatListRef}
				data={alumniData}
				renderItem={renderAlumniCard}
				keyExtractor={(item) => item._id}
				horizontal
				showsHorizontalScrollIndicator={false}
				snapToInterval={CARD_WIDTH}
				decelerationRate="fast"
				contentContainerStyle={styles.carouselContainer}
				onScroll={handleScroll}
				onViewableItemsChanged={onViewableItemsChanged}
				viewabilityConfig={viewabilityConfig}
				snapToAlignment="center"
				getItemLayout={getItemLayout}
				initialScrollIndex={0}
				onMomentumScrollEnd={(event) => {
					const newIndex = Math.round(event.nativeEvent.contentOffset.x / CARD_WIDTH);
					setActiveIndex(newIndex);
				}}
			/>

			{/* Navigation Buttons */}
			<View style={styles.navigationButtons}>
				<TouchableOpacity
					style={[
						styles.navButton,
						{ opacity: activeIndex > 0 ? 1 : 0.5 }
					]}
					onPress={handlePrevious}
					disabled={activeIndex === 0}
					activeOpacity={0.7}
				>
					<FontAwesome name="chevron-left" size={18} color="white" />
					<Text style={styles.navButtonText}>Previous</Text>
				</TouchableOpacity>

				<View style={styles.pageIndicator}>
					<Text style={styles.pageText}>{activeIndex + 1}/{alumniData.length}</Text>
				</View>

				<TouchableOpacity
					style={[
						styles.navButton,
						{ opacity: activeIndex < alumniData.length - 1 ? 1 : 0.5 }
					]}
					onPress={handleNext}
					disabled={activeIndex === alumniData.length - 1}
					activeOpacity={0.7}
				>
					<Text style={styles.navButtonText}>Next</Text>
					<FontAwesome name="chevron-right" size={18} color="white" />
				</TouchableOpacity>
			</View>

			{/* Footer with Social Media Icons */}
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
		</SafeAreaView>
	);
};



export default AlumniPage;