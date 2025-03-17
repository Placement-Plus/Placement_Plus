import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { Ionicons, FontAwesome, MaterialIcons } from "@expo/vector-icons";

const PlacementPlusPage = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require("@/assets/images/logo.png")} style={styles.logo} />
          <Text style={styles.logoText}>Placement Plus</Text>
        </View>
        <Ionicons name="person-circle" size={35} color="#fff" />
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        <View style={styles.contentBox}>
          <Image source={require("@/assets/images/google.png")} style={styles.contentLogo} />
          <Text style={styles.contentTitle}>Mohd Wajid</Text>
          <Text style={styles.contentTitle}>Software Engineer at Google</Text>
          <Text style={styles.contentDescription}>
            A small work culture typically features close-knit teams, where communication is direct.
            Employees often take on multiple roles with fewer layers of hierarchy. There's a strong
            sense of ownership and a visible impact of individual contributions, fostering a
            collaborative, flexible, and supportive environment.
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Striver</Text>
        <View style={styles.socialIcons}>
          <FontAwesome name="google" size={24} color="#4A90E2" style={styles.socialIcon} />
          <MaterialIcons name="chat" size={24} color="#4A90E2" style={styles.socialIcon} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a012c",
    paddingVertical: 15,
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
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  contentBox: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  contentLogo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 50,
    backgroundColor: "#E0E0E0",
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  contentDescription: {
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    padding: 20,
    backgroundColor: "#fff",
  },
  footerText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  socialIcons: {
    flexDirection: "row",
  },
  socialIcon: {
    marginLeft: 15,
  },
});

export default PlacementPlusPage;