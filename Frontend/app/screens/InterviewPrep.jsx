import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const PreparationHub = () => {
  const router = useRouter();
  const navigateTo = (routeName) => {
    try {
      console.log("Navigating to:", routeName);
      if (router) {
        router.push(routeName);
      } else {
        console.error("Router is not initialized.");
      }
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const preparationOptions = [
    {
      id: "dsa",
      title: "DSA Preparation",
      description: "Data Structures & Algorithms",
      route: "/screens/QuestionAskByCompanies", // Route for DSA preparation
      icon: (props) => <FontAwesome5 name="code" {...props} />, // Icon for DSA
      gradient: ["#3a1c71", "#d76d77"], // Gradient colors
      topics: "100+ Algorithms & 50+ Data Structures", // Topics description
    },
    {
      id: "cs",
      title: "Computer Fundamentals",
      description: "OS, DBMS, CN & OOPS",
      route: "/screens/FundamentalSubject", // Route for Computer Fundamentals
      icon: (props) => <MaterialCommunityIcons name="laptop" {...props} />, // Icon for CS
      gradient: ["#000428", "#004e92"], // Gradient colors
      topics: "4 Subjects & 200+ Important Topics", // Topics description
    },
    {
      id: "hr",
      title: "HR Preparation",
      description: "Interview Skills & Communication",
      route: "/screens/hrQuestions", // Route for HR preparation
      icon: (props) => <Ionicons name="people" {...props} />, // Icon for HR
      gradient: ["#603813", "#b29f94"], // Gradient colors
      topics: "50+ Common Questions & Mock Interviews", // Topics description
    },
  ];

  // Function to render each preparation card
  const renderPreparationCard = (option, index) => {
    return (
      <TouchableOpacity
        key={option.id}
        style={styles.cardContainer}
        activeOpacity={0.7}
        onPress={() => navigateTo(option.route)} // Navigate on press
      >
        <LinearGradient
          colors={option.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.cardContent}>
            <View style={styles.iconContainer}>
              {option.icon({ size: 32, color: "white" })} {/* Render icon */}
            </View>
            <View style={styles.cardTextContent}>
              <Text style={styles.cardTitle}>{option.title}</Text>
              <Text style={styles.cardDescription}>{option.description}</Text>
              <View style={styles.topicsContainer}>
                <Text style={styles.topicsText}>{option.topics}</Text>
              </View>
            </View>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.getStartedText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={18} color="white" />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a012c" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Hello, Candidate</Text>
            <Text style={styles.subtitle}>
              What would you like to prepare today?
            </Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Image
              source={require("@/assets/images/logo.png")} // Replace with your image path
              style={styles.profileImage}
              defaultSource={require("@/assets/images/logo.png")} // Fallback image
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Page Content */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Preparation Tracks</Text>

        {/* Preparation Options */}
        <View style={styles.cardsContainer}>
          {preparationOptions.map(renderPreparationCard)}{" "}
          {/* Render all cards */}
        </View>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a012c",
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    marginTop: 10
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 16,
    color: "#f0c5f1",
    marginTop: 5,
  },
  profileButton: {
    width: 45,
    height: 45,
    borderRadius: 25,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#8b0890",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  cardsContainer: {
    flex: 1,
  },
  cardContainer: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
  },
  cardContent: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  cardTextContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  cardDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  topicsContainer: {
    marginTop: 8,
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: "flex-start",
  },
  topicsText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 15,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  getStartedText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    marginRight: 8,
  },
});

export default PreparationHub;

