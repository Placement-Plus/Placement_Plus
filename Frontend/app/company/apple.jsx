import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Linking, Alert, TextInput } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import companyLogo from "@/assets/images/nvidia.png";
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
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState("All");

  useEffect(() => {
    getProblem();
  }, []);

  useEffect(() => {
    filterProblems();
  }, [searchQuery, problems, difficultyFilter]);

  const filterProblems = () => {
    let filtered = [...problems];

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        problem => problem.name.toLowerCase().includes(lowercasedQuery)
      );
    }

    // Filter by difficulty
    if (difficultyFilter !== "All") {
      filtered = filtered.filter(
        problem => problem.difficulty === difficultyFilter
      );
    }

    setFilteredProblems(filtered);
  };

  const getProblem = async () => {
    setIsLoading(true);
    try {
      const accessToken = await getAccessToken();
      const refreshToken = await getRefreshToken();

      const response = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:5000/api/v1/questions//get-company-questions/c/Apple`, {
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

      setProblems(result.data);
      setFilteredProblems(result.data);
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "Something went wrong. Please try again.",
        [{ text: "OK" }]
      );
      console.error('Error:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleFilterChange = (difficulty) => {
    setDifficultyFilter(difficulty);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setDifficultyFilter("All");
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Coding Problems</Text>
        <Image source={companyLogo} style={styles.logo} />
      </View>

      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={20} color="#C92EFF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search problems..."
          placeholderTextColor="#8a8a8a"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
            <FontAwesome name="times-circle" size={20} color="#C92EFF" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Difficulty:</Text>
        <ScrollableFilterButtons
          difficultyFilter={difficultyFilter}
          handleFilterChange={handleFilterChange}
        />
      </View>

      {(searchQuery.length > 0 || difficultyFilter !== "All") && (
        <View style={styles.activeFiltersContainer}>
          <Text style={styles.activeFiltersText}>
            Active filters: {difficultyFilter !== "All" ? difficultyFilter : ""}
            {searchQuery.length > 0 ? (difficultyFilter !== "All" ? ", " : "") + `"${searchQuery}"` : ""}
          </Text>
          <TouchableOpacity onPress={resetFilters} style={styles.resetFiltersButton}>
            <Text style={styles.resetFiltersText}>Reset Filters</Text>
          </TouchableOpacity>
        </View>
      )}

      {isLoading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Loading...</Text>
        </View>
      ) : filteredProblems && filteredProblems.length > 0 ? (
        <FlatList
          data={filteredProblems}
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
          <FontAwesome name="search" size={60} color="#C92EFF" style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>No Matching Problems</Text>
          <Text style={styles.emptyMessage}>
            We couldn't find any problems matching your filters.
            Try different search terms or filter settings.
          </Text>
          <TouchableOpacity style={styles.refreshButton} onPress={resetFilters}>
            <Text style={styles.refreshButtonText}>Reset Filters</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// Separate component for filter buttons with horizontal scrolling
const ScrollableFilterButtons = ({ difficultyFilter, handleFilterChange }) => {
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={["All", "Easy", "Medium", "Hard"]}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.filterButton,
            difficultyFilter === item && styles.activeFilterButton,
            item === "Easy" && styles.easyButtonColor,
            item === "Medium" && styles.mediumButtonColor,
            item === "Hard" && styles.hardButtonColor,
            difficultyFilter === item && item === "Easy" && styles.activeEasyButton,
            difficultyFilter === item && item === "Medium" && styles.activeMediumButton,
            difficultyFilter === item && item === "Hard" && styles.activeHardButton,
          ]}
          onPress={() => handleFilterChange(item)}
        >
          <Text
            style={[
              styles.filterText,
              difficultyFilter === item && styles.activeFilterText,
              item === "Easy" && styles.easyText,
              item === "Medium" && styles.mediumText,
              item === "Hard" && styles.hardText,
              difficultyFilter === item && item === "Easy" && styles.activeEasyText,
              difficultyFilter === item && item === "Medium" && styles.activeMediumText,
              difficultyFilter === item && item === "Hard" && styles.activeHardText,
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.filterButtonsContainer}
    />
  );
};

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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(201, 46, 255, 0.3)",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 46,
    color: "#fff",
    fontSize: 16,
    paddingVertical: 10,
  },
  clearButton: {
    padding: 8,
  },
  filterContainer: {
    marginBottom: 15,
  },
  filterLabel: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "bold",
  },
  filterButtonsContainer: {
    paddingRight: 20,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  activeFilterButton: {
    backgroundColor: "#C92EFF",
    borderColor: "#C92EFF",
  },
  easyButtonColor: {
    backgroundColor: "rgba(15, 81, 50, 0.3)",
    borderColor: "#0f5132",
  },
  mediumButtonColor: {
    backgroundColor: "rgba(102, 77, 3, 0.3)",
    borderColor: "#664d03",
  },
  hardButtonColor: {
    backgroundColor: "rgba(88, 21, 28, 0.3)",
    borderColor: "#58151c",
  },
  activeEasyButton: {
    backgroundColor: "#0f5132",
    borderColor: "#0f5132",
  },
  activeMediumButton: {
    backgroundColor: "#664d03",
    borderColor: "#664d03",
  },
  activeHardButton: {
    backgroundColor: "#58151c",
    borderColor: "#58151c",
  },
  filterText: {
    color: "#fff",
    fontWeight: "bold",
  },
  activeFilterText: {
    color: "#fff",
  },
  easyText: {
    color: "#d1e7dd",
  },
  mediumText: {
    color: "#f8d775",
  },
  hardText: {
    color: "#f5c2c7",
  },
  activeEasyText: {
    color: "#d1e7dd",
  },
  activeMediumText: {
    color: "#f8d775",
  },
  activeHardText: {
    color: "#f5c2c7",
  },
  activeFiltersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "rgba(201, 46, 255, 0.1)",
    borderRadius: 8,
    padding: 8,
  },
  activeFiltersText: {
    color: "#d8b8e8",
    fontSize: 14,
  },
  resetFiltersButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "rgba(201, 46, 255, 0.3)",
    borderRadius: 5,
  },
  resetFiltersText: {
    color: "#fff",
    fontSize: 12,
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
    borderRadius: 5,
    textAlign: "center",
    marginLeft: 10
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
  col3: { flex: 1, alignItems: "center", paddingRight: 15 },
  col4: { flex: 1.2, alignItems: "center", justifyContent: "center" },

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