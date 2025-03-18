import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

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
];

const PastYearCompanies = () => {
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
        <Text style={styles.title}>Past Year Companies</Text>
        <View style={styles.companyList}>
          {companies.map((company, index) => (
            <View key={index} style={styles.companyItem}>
              <Image source={company.logo} style={styles.companyLogo} />
              <Text style={styles.companyText}>{company.name}</Text>
            </View>
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
    width: "90%",
    marginTop: 20,
    marginBottom: 25,
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
    paddingTop: 20,
  },
  title: {
    color: "#C92EFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  companyList: {
    width: "90%",
  },
  companyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  companyLogo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginRight: 15,
  },
  companyText: {
    color: "#1a012c",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PastYearCompanies;