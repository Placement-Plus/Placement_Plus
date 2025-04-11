import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Dimensions, Animated, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { SharedElement } from "react-navigation-shared-element";
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import LottieView from "lottie-react-native";

// Import company logos
import microsoftLogo from "@/assets/images/microsoft.png";
import appleLogo from "@/assets/images/apple.png";
import googleLogo from "@/assets/images/google.png";
import amazonLogo from "@/assets/images/amazon.png";
import netflixLogo from "@/assets/images/netflix.png";
import metaLogo from "@/assets/images/meta.png";
import uberLogo from "@/assets/images/uber.png";
import nvidiaLogo from "@/assets/images/nvidia.png";

// Company data with enhanced properties
const companies = [
  {
    id: "microsoft",
    name: "Microsoft",
    logo: microsoftLogo,
    count: 23,
    trendDirection: "up",
    trendPercentage: 15,
    primaryColor: "#00A4EF"
  },
  {
    id: "apple",
    name: "Apple",
    logo: appleLogo,
    count: 18,
    trendDirection: "down",
    trendPercentage: 7,
    primaryColor: "#A2AAAD"
  },
  {
    id: "google",
    name: "Google",
    logo: googleLogo,
    count: 15,
    trendDirection: "up",
    trendPercentage: 12,
    primaryColor: "#4285F4"
  },
  {
    id: "amazon",
    name: "Amazon",
    logo: amazonLogo,
    count: 14,
    trendDirection: "up",
    trendPercentage: 4,
    primaryColor: "#FF9900"
  },
  {
    id: "netflix",
    name: "Netflix",
    logo: netflixLogo,
    count: 8,
    trendDirection: "down",
    trendPercentage: 10,
    primaryColor: "#E50914"
  },
  {
    id: "meta",
    name: "Meta",
    logo: metaLogo,
    count: 12,
    trendDirection: "up",
    trendPercentage: 8,
    primaryColor: "#0668E1"
  },
  {
    id: "uber",
    name: "Uber",
    logo: uberLogo,
    count: 7,
    trendDirection: "up",
    trendPercentage: 22,
    primaryColor: "#000000"
  },
  {
    id: "nvidia",
    name: "Nvidia",
    logo: nvidiaLogo,
    count: 20,
    trendDirection: "up",
    trendPercentage: 45,
    primaryColor: "#76B900"
  },
];

const { width, height } = Dimensions.get('window');
const ITEM_HEIGHT = 110;
const LOADER_DURATION = 2000;

const CompaniesScreen = ({ navigation }) => {
  const [companies, setCompanies] = useState([])
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loopedCompanies, setLoopedCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // Load custom fonts
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  // Initial loading animation
  useEffect(() => {
    if (fontsLoaded) {
      // Simulate API loading with a delay
      setTimeout(() => {
        setIsLoading(false);

        // Animate in the content
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          })
        ]).start(() => {
          setHasLoaded(true);
        });
      }, LOADER_DURATION);
    }
  }, [fontsLoaded]);

  // Filter companies based on selected filter and search query
  useEffect(() => {
    if (!hasLoaded) return;

    let data = [...companies];

    // Apply filter
    if (selectedFilter === "popular") {
      data = data.filter(company => company.count > 15);
    } else if (selectedFilter === "trending") {
      data = data.filter(company => company.trendDirection === "up" && company.trendPercentage > 10);
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(company => company.name.toLowerCase().includes(query));
    }

    setFilteredCompanies(data);

    // Create looped data for infinite scroll
    const multipleData = [];
    for (let i = 0; i < 5; i++) {
      multipleData.push(...data.map(item => ({ ...item, key: `${item.id}-${i}` })));
    }
    setLoopedCompanies(multipleData);

    // Initialize scroll position to middle for infinite loop effect
    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({
          offset: data.length * ITEM_HEIGHT * 2,
          animated: false
        });
      }
    }, 100);
  }, [selectedFilter, searchQuery, hasLoaded]);

  // Create smooth scroll handler with intelligent loop reset
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  const handleScrollEnd = useCallback((event) => {
    if (!filteredCompanies.length) return;

    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const singleSetHeight = filteredCompanies.length * ITEM_HEIGHT;

    // Reset to middle when reaching near ends for seamless looping
    if (offsetY > contentHeight - height - singleSetHeight) {
      flatListRef.current?.scrollToOffset({
        offset: 2 * singleSetHeight,
        animated: false
      });
    } else if (offsetY < singleSetHeight) {
      flatListRef.current?.scrollToOffset({
        offset: 3 * singleSetHeight,
        animated: false
      });
    }
  }, [filteredCompanies]);

  const handleCompanyPress = useCallback((company) => {
    // Navigation would occur here to a detail screen
    console.log(`Selected ${company.name}`);
    // Example: navigation.navigate('CompanyDetail', { company });
  }, []);

  // Render company item with enhanced animations
  const renderCompanyItem = useCallback(({ item, index }) => {
    const inputRange = [
      (index - 2) * ITEM_HEIGHT,
      (index - 1) * ITEM_HEIGHT,
      index * ITEM_HEIGHT,
      (index + 1) * ITEM_HEIGHT,
      (index + 2) * ITEM_HEIGHT,
    ];

    // Enhanced scale animation with smoother curve
    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [0.85, 0.95, 1, 0.95, 0.85],
      extrapolate: 'clamp',
    });

    // Enhanced opacity animation with smoother curve
    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: [0.5, 0.8, 1, 0.8, 0.5],
      extrapolate: 'clamp',
    });

    // Translate animation for parallax effect
    const translateY = scrollY.interpolate({
      inputRange,
      outputRange: [25, 10, 0, -10, -25],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.companyItemContainer,
          {
            transform: [{ scale }, { translateY }],
            opacity
          }
        ]}
      >
        <TouchableOpacity
          style={styles.companyItem}
          activeOpacity={0.8}
          onPress={() => handleCompanyPress(item)}
        >
          <SharedElement id={`company.${item.id}.logo`}>
            <Image source={item.logo} style={styles.companyLogo} />
          </SharedElement>

          <View style={styles.companyDetails}>
            <Text style={styles.companyText}>{item.name}</Text>
            <View style={styles.statsContainer}>
              <Text style={styles.companyCount}>{item.count} placements</Text>
              <View style={styles.trendContainer}>
                <Ionicons
                  name={item.trendDirection === "up" ? "trending-up" : "trending-down"}
                  size={16}
                  color={item.trendDirection === "up" ? "#4CAF50" : "#F44336"}
                />
                <Text
                  style={[
                    styles.trendText,
                    { color: item.trendDirection === "up" ? "#4CAF50" : "#F44336" }
                  ]}
                >
                  {item.trendPercentage}%
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.iconContainer, { backgroundColor: item.primaryColor + '20' }]}>
            <Ionicons name="chevron-forward" size={24} color={item.primaryColor} />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }, [scrollY]);

  // If fonts are still loading or initial animation is running
  if (isLoading || !fontsLoaded) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <StatusBar barStyle="light-content" />
        <LottieView
          source={require('@/assets/animations/placement-loader.json')}
          autoPlay
          loop
          style={styles.lottieLoader}
        />
        <Text style={styles.loaderText}>Placement Plus</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Animated header with blur effect */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <BlurView intensity={20} style={styles.blurContainer}>
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Image source={require("@/assets/images/logo.png")} style={styles.logo} />
              <Text style={styles.logoText}>Placement Plus</Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <Ionicons name="person-circle" size={35} color="#fff" />
            </TouchableOpacity>
          </View>
        </BlurView>
      </Animated.View>

      {/* Animated Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {/* Search bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#FFFFFF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search companies..."
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filter tabs with animated indicator */}
        <View style={styles.filterContainer}>
          <FilterTab
            label="All"
            isActive={selectedFilter === "all"}
            onPress={() => setSelectedFilter("all")}
          />
          <FilterTab
            label="Popular"
            isActive={selectedFilter === "popular"}
            onPress={() => setSelectedFilter("popular")}
          />
          <FilterTab
            label="Trending"
            isActive={selectedFilter === "trending"}
            onPress={() => setSelectedFilter("trending")}
          />
        </View>

        {/* Empty state if no companies match filter */}
        {filteredCompanies.length === 0 && hasLoaded ? (
          <View style={styles.emptyContainer}>
            <LottieView
              source={require('@/assets/animations/empty-state.json')}
              autoPlay
              loop
              style={styles.emptyAnimation}
            />
            <Text style={styles.emptyText}>No companies found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
          </View>
        ) : (
          /* Optimized FlatList for smooth scrolling */
          <View style={styles.carouselContainer}>
            <Animated.FlatList
              ref={flatListRef}
              data={loopedCompanies}
              renderItem={renderCompanyItem}
              keyExtractor={(item) => item.key}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate={0.85}
              onScroll={handleScroll}
              onMomentumScrollEnd={handleScrollEnd}
              contentContainerStyle={styles.listContainer}
              snapToAlignment="center"
              removeClippedSubviews={true}
              maxToRenderPerBatch={5}
              initialNumToRender={8}
              windowSize={10}
            />
          </View>
        )}
      </Animated.View>

      {/* Floating action button */}
      {hasLoaded && (
        <TouchableOpacity style={styles.floatingButton}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

// Reusable filter tab component with animation
const FilterTab = ({ label, isActive, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.filterButton, isActive && styles.filterButtonActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{label}</Text>
      {isActive && <View style={styles.filterIndicator} />}
    </TouchableOpacity>
  );
};

// Text input component with proper imports
const TextInput = Animated.createAnimatedComponent(require('react-native').TextInput);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a012c",
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: "#1a012c",
    justifyContent: "center",
    alignItems: "center",
  },
  lottieLoader: {
    width: 200,
    height: 200,
  },
  loaderText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },
  header: {
    width: "100%",
    zIndex: 10,
  },
  blurContainer: {
    width: "100%",
    overflow: "hidden",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 15
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    marginRight: 10,
  },
  logoText: {
    color: "white",
    fontSize: 22,
    fontFamily: "Poppins_700Bold",
  },
  profileButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 45,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontFamily: "Poppins_400Regular",
    height: 45,
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 25,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    position: "relative",
  },
  filterButtonActive: {
    backgroundColor: "rgba(201, 46, 255, 0.15)",
  },
  filterText: {
    color: "#FFFFFF",
    opacity: 0.7,
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
  },
  filterTextActive: {
    color: "#C92EFF",
    opacity: 1,
    fontFamily: "Poppins_600SemiBold",
  },
  filterIndicator: {
    position: "absolute",
    bottom: -5,
    left: "50%",
    marginLeft: -3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#C92EFF",
  },
  carouselContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    paddingVertical: height / 5,
  },
  companyItemContainer: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  companyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.97)",
    borderRadius: 18,
    padding: 16,
    width: width - 40,
    shadowColor: "#C92EFF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  companyLogo: {
    width: 55,
    height: 55,
    resizeMode: "contain",
    marginRight: 15,
    borderRadius: 12,
  },
  companyDetails: {
    flex: 1,
  },
  companyText: {
    color: "#1a012c",
    fontSize: 17,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 3,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  companyCount: {
    color: "#666",
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 12,
    fontFamily: "Poppins_600SemiBold",
    marginLeft: 3,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyAnimation: {
    width: 150,
    height: 150,
  },
  emptyText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    marginTop: 10,
  },
  emptySubtext: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    marginTop: 5,
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#C92EFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#C92EFF",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
});

export default CompaniesScreen;