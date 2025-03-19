import React, { useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Animated, StatusBar, Dimensions } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Import company logos
import microsoftLogo from "@/assets/images/microsoft.png";
import appleLogo from "@/assets/images/apple.png";
import googleLogo from "@/assets/images/google.png";
import amazonLogo from "@/assets/images/amazon.png";
import netflixLogo from "@/assets/images/netflix.png";
import metaLogo from "@/assets/images/meta.png";
import uberLogo from "@/assets/images/uber.png";
import nvidiaLogo from "@/assets/images/nvidia.png";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 60) / 2;

const companies = [
  { name: "Microsoft", logo: microsoftLogo },
  { name: "Apple", logo: appleLogo },
  { name: "Google", logo: googleLogo },
  { name: "Amazon", logo: amazonLogo },
  { name: "Netflix", logo: netflixLogo },
  { name: "Meta", logo: metaLogo },
  { name: "Uber", logo: uberLogo },
  { name: "Nvidia", logo: nvidiaLogo },
  { name: "Microsoft", logo: microsoftLogo },
  { name: "Apple", logo: appleLogo },
  { name: "Google", logo: googleLogo },
  { name: "Amazon", logo: amazonLogo },
  { name: "Netflix", logo: netflixLogo },
  { name: "Meta", logo: metaLogo },
  { name: "Uber", logo: uberLogo },
  { name: "Nvidia", logo: nvidiaLogo },
  { name: "Microsoft", logo: microsoftLogo },
  { name: "Apple", logo: appleLogo },
  { name: "Google", logo: googleLogo },
  { name: "Amazon", logo: amazonLogo },
  { name: "Netflix", logo: netflixLogo },
  { name: "Meta", logo: metaLogo },
  { name: "Uber", logo: uberLogo },
  { name: "Nvidia", logo: nvidiaLogo },
  { name: "Microsoft", logo: microsoftLogo },
  { name: "Apple", logo: appleLogo },
  { name: "Google", logo: googleLogo },
  { name: "Amazon", logo: amazonLogo },
  { name: "Netflix", logo: netflixLogo },
  { name: "Meta", logo: metaLogo },
  { name: "Uber", logo: uberLogo },
  { name: "Nvidia", logo: nvidiaLogo },
];

const PastYearCompanies = () => {
  const router = useRouter();
  const scaleAnimations = useRef(companies.map(() => new Animated.Value(1))).current;

  const handleCompanyPress = (index, companyName) => {
    Animated.sequence([
      Animated.timing(scaleAnimations[index], {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimations[index], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start(() => {
      router.push(`/company/${companyName.toLowerCase().replace(/ /g, "-")}`);
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#14011F" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require("@/assets/images/logo.png")} style={styles.logo} />
          <Text style={styles.logoText}>Placement Plus</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle" size={34} color="#C92EFF" />
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Search companies...</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <MaterialIcons name="filter-list" size={22} color="#C92EFF" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Interview Questions</Text>
          <Text style={styles.subtitle}>Prepare with real questions from top companies</Text>
        </View>
        
        <View style={styles.companyList}>
          {companies.map((company, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleCompanyPress(index, company.name)}
              activeOpacity={0.7}
            >
              <Animated.View
                style={[
                  styles.companyItem,
                  { transform: [{ scale: scaleAnimations[index] }] },
                ]}
              >
                <Image source={company.logo} style={styles.companyLogo} />
                <Text style={styles.companyText}>{company.name}</Text>
                <View style={styles.questionsCount}>
                  <Text style={styles.countText}>50+</Text>
                </View>
              </Animated.View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#14011F",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 28,
    height: 28,
    resizeMode: "contain",
    marginRight: 8,
  },
  logoText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  profileButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchPlaceholder: {
    color: "#888",
    fontSize: 15,
  },
  filterButton: {
    backgroundColor: "rgba(201, 46, 255, 0.15)",
    padding: 10,
    borderRadius: 10,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  titleContainer: {
    marginBottom: 24,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 6,
  },
  subtitle: {
    color: "#AAA",
    fontSize: 14,
  },
  companyList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  companyItem: {
    width: ITEM_WIDTH,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  companyLogo: {
    width: 56,
    height: 56,
    resizeMode: "contain",
    marginBottom: 12,
  },
  companyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  questionsCount: {
    backgroundColor: "rgba(201, 46, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    color: "#C92EFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default PastYearCompanies;