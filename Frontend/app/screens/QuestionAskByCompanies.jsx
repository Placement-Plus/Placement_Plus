import React, { useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Animated } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
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
  const scaleAnimations = useRef(companies.map(() => new Animated.Value(1))).current; // Array of animations for each company

  const handleCompanyPress = (index, companyName) => {
    // Scale down the entire company item
    Animated.timing(scaleAnimations[index], {
      toValue: 1.1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // Scale back to original size
      Animated.timing(scaleAnimations[index], {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      // Navigate to the company details page
      router.push(`/company/${companyName.toLowerCase().replace(/ /g, "-")}`);
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require("@/assets/images/logo.png")} style={styles.logo} />
          <Text style={styles.logoText}>Placement Plus</Text>
        </View>
        <Ionicons name="person-circle" size={35} color="#fff" />
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Interview Questions</Text>
        <View style={styles.companyList}>
          {companies.map((company, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleCompanyPress(index, company.name)}
              activeOpacity={0.6}
            >
              <Animated.View
                style={[
                  styles.companyItem,
                  {
                    transform: [{ scale: scaleAnimations[index] }], // Scale the entire item
                  },
                ]}
              >
                <Image source={company.logo} style={styles.companyLogo} />
                <Text style={styles.companyText}>{company.name}</Text>
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
      backgroundColor: "#1a012c",
      padding: 10,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      marginTop: 20,
      marginBottom: 25,
      paddingHorizontal: 15,
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
    content: {
      flexGrow: 1,
      alignItems: "center",
      paddingTop: 10,
      marginBottom: 20,
    },
    title: {
      color: "#C92EFF",
      fontSize: 34,
      fontWeight: "bold",
      marginBottom: 38,
      fontFamily: "sans-serif",
  
  
    },
    companyList: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      width: "93%",
      alignContent: "center",
    },
    companyItem: {
      width: "150px", 
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: 13,
      marginBottom: 20,
      marginHorizontal: 4,
    },
    companyLogo: {
      width: 50,
      height: 50,
      resizeMode: "contain",
      marginRight: 10,
    },
    companyText: {
      color: "#1a012c",
      fontSize: 16,
      fontWeight: "bold",
    },
  });

export default PastYearCompanies;