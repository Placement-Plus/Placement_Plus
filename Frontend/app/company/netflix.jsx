import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Linking } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import companyLogo from "@/assets/images/netflix.png";
import { getAccessToken, getRefreshToken } from "../../utils/tokenStorage.js";

const getDifficultyStyle = (difficulty) => {
  switch (difficulty) {
    case "Easy":
      return styles.easy;
    case "Medium":
      return styles.medium;
    case "Hard":
      return styles.hard;
    default:
      return {};
  }
};

const handleOpenLink = (url) => {
  Linking.openURL(url).catch((err) => console.error("Error opening link:", err));
};

const CodingProblems = () => {

  const [problems, setProblems] = useState([])

  useEffect(() => {
    getProblem()
  }, [])

  const getProblem = async () => {
    try {
      const accessToken = await getAccessToken()
      const refreshToken = await getRefreshToken()

      const response = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:5000/api/v1/questions//get-company-questions/c/Netflix`, {
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

      setProblems(result.data)
      // console.log(result.data);

    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "Something went wrong. Please try again.",
        [{ text: "OK" }]
      );
      console.error('Error:', error.message);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Coding Problems</Text>
        <Image source={companyLogo} style={styles.logo} />
      </View>

      {problems && problems.length > 0 ? (
        <FlatList
          data={problems}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={() => (
            <View style={styles.tableHeader}>
              <Text style={[styles.headerText, styles.col1]}>No.</Text>
              <Text style={[styles.headerText, styles.col2]}>Problem</Text>
              <Text style={[styles.headerText, styles.col3]}>Practice</Text>
              <Text style={[styles.headerText, styles.col4]}>Difficulty</Text>
            </View>
          )}
          renderItem={({ item, index }) => (
            <View style={styles.row}>
              <Text style={[styles.cell, styles.col1]}>{index + 1}.</Text>
              <Text style={[styles.cell, styles.col2]}>{item.name}</Text>
              <TouchableOpacity onPress={() => handleOpenLink(item.link)}>
                <FontAwesome name="code" size={22} color="#fff" style={styles.icon} />
              </TouchableOpacity>
              <Text style={[styles.difficulty, styles.col4, getDifficultyStyle(item.difficulty)]}>
                {item.difficulty}
              </Text>
            </View>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <FontAwesome name="code" size={60} color="#C92EFF" style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>No Problems Available</Text>
          <Text style={styles.emptyMessage}>
            Our team is currently preparing new coding challenges for you.
            Check back soon for exciting problems to sharpen your skills!
          </Text>
          <TouchableOpacity style={styles.refreshButton}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a012c",
    padding: 15,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  header: {
    color: "#C92EFF",
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "sans-serif",
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    borderRadius: 100,
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginHorizontal: 3,
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  cell: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 0,
    marginLeft: 0,
  },
  icon: {
    textAlign: "center",
    color: "#C92EFF",
    paddingHorizontal: 10,
  },
  difficulty: {
    fontSize: 14,
    fontWeight: "bold",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    textAlign: "center",
  },
  easy: {
    backgroundColor: "#0f5132",
    color: "#d1e7dd",
  },
  medium: {
    backgroundColor: "#664d03",
    color: "#f8d775",
  },
  hard: {
    backgroundColor: "#58151c",
    color: "#f5c2c7",
  },
  col1: { flex: 0.5, alignItems: "center", justifyContent: "center" },
  col2: { flex: 2, alignItems: "flex-start", paddingLeft: 10 },
  col3: { flex: 0.8, alignItems: "center", paddingRight: 15 },
  col4: { flex: 1, alignItems: "center", justifyContent: "center" },

  // Empty state styles
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 15,
    marginTop: 20,
  },
  emptyIcon: {
    marginBottom: 20,
    opacity: 0.8,
  },
  emptyTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  emptyMessage: {
    color: "#d8b8e8",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  refreshButton: {
    backgroundColor: "#C92EFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 5,
  },
  refreshButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CodingProblems;
