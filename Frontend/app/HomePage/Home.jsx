import React, { useState, useRef } from "react";
import { View, Text, TextInput, Pressable, Image, Dimensions, Animated } from "react-native";
import { FontAwesome, Entypo, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import pastYearCompany from "@/assets/images/pastyearcompany.png";
import placementStat from "@/assets/images/placementstat.png";
import alumni from "@/assets/images/alumni.png";
import questionAskByCompany from "@/assets/images/questionaskbycompany.png";
import upcomingCompany from "@/assets/images/upcomingcompany.png";
import branchStat from "@/assets/images/branchstat.png";
import placementPolicies from "@/assets/images/placementpolicies.png";
import uploadResume from "@/assets/images/uploadresume.png";
import chatbot from "@/assets/images/chatbot.png";

const images = [
  pastYearCompany,
  placementStat,
  alumni,
  questionAskByCompany,
  upcomingCompany,
  branchStat,
  placementPolicies,
  uploadResume,
  chatbot,
];

const { width, height } = Dimensions.get("window");

const PlacementPlus = () => {
  const scaleAnims = useRef(images.map(() => new Animated.Value(1))).current; // Array of Animated values

  const handlePressIn = (index) => {
    Animated.spring(scaleAnims[index], {
      toValue: 1.2, 
      friction: 3, 
      useNativeDriver: true, 
    }).start();
  };

  const handlePressOut = (index) => {
    Animated.spring(scaleAnims[index], {
      toValue: 1,
      friction: 3, 
      useNativeDriver: true,
    }).start();
  };

  const handlePress = (index) => {
    switch (index) {
      case 0:
        router.push("/screens/PastYearCompanies");
        break;
      case 1:
        router.push("/screens/CurrentYearPlacement");
        break;
      case 2:
        router.push("/screens/ConnectWithAlumni");
        break;
      case 3:
        router.push("/screens/QuestionAskByCompanies");
        break;
      case 4:
        router.push("/screens/UpcomingCompanies");
        break;
      case 5:
        router.push("/screens/BranchWisePlacement");
        break;
      case 6:
        router.push("/screens/PlacementPolicies");
        break;
      case 7:
        router.push("/screens/UploadResume");
        break;
      case 8:
        router.push("/screens/ChatBot");
        break;
      default:
        break;
    }
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

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <FontAwesome name="search" size={20} color="#a100f2" style={styles.searchIcon} />
        <TextInput
          placeholder="Search..."
          style={styles.searchInput}
          placeholderTextColor="#a100f2" 
        />
      </View>

      {/* Grid Layout */}
      <View style={styles.gridContainer}>
        {[
          "Past Year Companies",
          "Current year Placement",
          "Connect with Alumni",
          "Question Ask by Companies",
          "Upcoming Companies",
          "Branch Wise Placement",
          "Placement Policies",
          "Upload Resume",
          "Chat Bot",
        ].map((item, index) => (
          <Pressable
            key={index}
            onPressIn={() => handlePressIn(index)} 
            onPressOut={() => handlePressOut(index)}
            onPress={() => handlePress(index)}
          >
            <Animated.View
              style={[
                styles.gridItem,
                { transform: [{ scale: scaleAnims[index] }] }, 
              ]}
            >
              <View style={styles.gridIconContainer}>
                <Image
                  source={images[index]}
                  style={styles.gridIcon}
                />
              </View>
              <Text style={styles.gridText}>{item}</Text>
            </Animated.View>
          </Pressable>
        ))}
      </View>

      {/* Social Media Icons */}
      <View style={styles.socialIconsContainer}>
        <FontAwesome name="envelope" size={24} color="#a100f2" style={styles.socialIcon} />
        <Entypo name="phone" size={24} color="#a100f2" style={styles.socialIcon} />
        <FontAwesome name="instagram" size={24} color="#a100f2" style={styles.socialIcon} />
      </View>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#1a012c",
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
  
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    marginTop: 20,
    marginBottom: 25,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 10,
    width: "90%",
    marginTop: 20,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 7,
  },
  searchInput: {
    flex: 1,
    color: "#a100f2",
    fontWeight: "bold",
    fontSize: 16,
    borderWidth: 0, 
    outlineStyle: "none", 
  },
  gridContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
    marginBottom: 20,
  },
  gridItem: {
    width: 100, 
    alignItems: "center",
    marginBottom: 20,
    marginHorizontal: 6,
  },
  gridIconContainer: {
    width: 83,
    height: 83,
    backgroundColor: "white",
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  gridIcon: {
    width: 75,
    height: 75,
  },
  gridText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "sans-serif",
    marginTop: 5,
  },
  socialIconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginBottom: 5,
  },
  socialIcon: {
    marginHorizontal: 10,
    color: "#fff",
  },
};

export default PlacementPlus;