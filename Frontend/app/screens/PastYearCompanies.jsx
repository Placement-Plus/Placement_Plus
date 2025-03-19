import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView, Dimensions, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Import company logos
import microsoftLogo from "@/assets/images/microsoft.png";
import appleLogo from "@/assets/images/apple.png";
import googleLogo from "@/assets/images/google.png";
import amazonLogo from "@/assets/images/amazon.png";
import netflixLogo from "@/assets/images/netflix.png";
import metaLogo from "@/assets/images/meta.png";
import uberLogo from "@/assets/images/uber.png";
import nvidiaLogo from "@/assets/images/nvidia.png";

// Unique list of companies with additional data
const companies = [
  { name: "Microsoft", logo: microsoftLogo, count: 23 },
  { name: "Apple", logo: appleLogo, count: 18 },
  { name: "Google", logo: googleLogo, count: 15 },
  { name: "Amazon", logo: amazonLogo, count: 14 },
  { name: "Netflix", logo: netflixLogo, count: 8 },
  { name: "Meta", logo: metaLogo, count: 12 },
  { name: "Uber", logo: uberLogo, count: 7 },
  { name: "Nvidia", logo: nvidiaLogo, count: 20 },
];

const { width, height } = Dimensions.get('window');
const ITEM_HEIGHT = 120;

const PastYearCompanies = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loopedCompanies, setLoopedCompanies] = useState([]);
  const scrollY = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  // Create a looped data array for infinite scroll effect
  useEffect(() => {
    let data = [];
    if (selectedFilter === "all") {
      data = [...companies];
    } else if (selectedFilter === "popular") {
      data = [...companies.filter(company => company.count > 15)];
    }
    
    // Duplicate the data array multiple times to create a loop effect
    const loop = [...data, ...data, ...data, ...data, ...data];
    setFilteredCompanies(data);
    setLoopedCompanies(loop);
    
    // Initialize scroll to middle to create illusion of infinite scroll
    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({ 
          offset: data.length * ITEM_HEIGHT, 
          animated: false 
        });
      }
    }, 100);
  }, [selectedFilter]);

  // Handle scroll to create infinite loop effect
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  const handleScrollEnd = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    
    // If we're near the end, jump back to the middle
    if (offsetY > contentHeight - height - ITEM_HEIGHT * 2) {
      flatListRef.current.scrollToOffset({ 
        offset: filteredCompanies.length * ITEM_HEIGHT, 
        animated: false 
      });
    }
    
    // If we're near the beginning, jump to the middle
    if (offsetY < ITEM_HEIGHT * 2) {
      flatListRef.current.scrollToOffset({ 
        offset: filteredCompanies.length * ITEM_HEIGHT * 3, 
        animated: false 
      });
    }
  };

  const renderCompanyItem = ({ item, index }) => {
    const inputRange = [
      (index - 2) * ITEM_HEIGHT,
      (index - 1) * ITEM_HEIGHT,
      index * ITEM_HEIGHT,
      (index + 1) * ITEM_HEIGHT,
      (index + 2) * ITEM_HEIGHT,
    ];
    
    // Scale animation
    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [0.8, 0.9, 1, 0.9, 0.8],
      extrapolate: 'clamp',
    });
    
    // Opacity animation
    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: [0.6, 0.8, 1, 0.8, 0.6],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View 
        style={[
          styles.companyItemContainer,
          { 
            transform: [{ scale }],
            opacity 
          }
        ]}
      >
        <TouchableOpacity style={styles.companyItem}>
          <Image source={item.logo} style={styles.companyLogo} />
          <View style={styles.companyDetails}>
            <Text style={styles.companyText}>{item.name}</Text>
            <Text style={styles.companyCount}>{item.count} placements</Text>
          </View>
          <View style={styles.iconContainer}>
            <Ionicons name="chevron-forward" size={24} color="#C92EFF" />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require("@/assets/images/logo.png")} style={styles.logo} />
          <Text style={styles.logoText}>Placement Plus</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle" size={35} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        
        {/* Filters */}
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[styles.filterButton, selectedFilter === "all" && styles.filterButtonActive]} 
            onPress={() => setSelectedFilter("all")}
          >
            <Text style={[styles.filterText, selectedFilter === "all" && styles.filterTextActive]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, selectedFilter === "popular" && styles.filterButtonActive]} 
            onPress={() => setSelectedFilter("popular")}
          >
            <Text style={[styles.filterText, selectedFilter === "popular" && styles.filterTextActive]}>Popular</Text>
          </TouchableOpacity>
        </View>
        
        {/* Cyclical Company List */}
        <View style={styles.carouselContainer}>
          <FlatList
            ref={flatListRef}
            data={loopedCompanies}
            renderItem={renderCompanyItem}
            keyExtractor={(item, index) => `${item.name}-${index}`}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            onScroll={handleScroll}
            onMomentumScrollEnd={handleScrollEnd}
            contentContainerStyle={styles.listContainer}
            snapToAlignment="center"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a012c",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
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
    fontWeight: "bold",
    fontFamily: "sans-serif",
  },
  profileButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 25,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginHorizontal: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  filterButtonActive: {
    backgroundColor: "#C92EFF",
  },
  filterText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  carouselContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    paddingVertical: height / 4, // Add padding to create space above and below the list
  },
  companyItemContainer: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    // marginVertical: 10,
  },
  companyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 15,
    padding: 15,
    width: width - 40,
    shadowColor: "#C92EFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  companyLogo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginRight: 15,
  },
  companyDetails: {
    flex: 1,
  },
  companyText: {
    color: "#1a012c",
    fontSize: 18,
    fontWeight: "bold",
  },
  companyCount: {
    color: "#666",
    fontSize: 14,
    marginTop: 3,
  },
  iconContainer: {
    padding: 5,
  },
});

export default PastYearCompanies;