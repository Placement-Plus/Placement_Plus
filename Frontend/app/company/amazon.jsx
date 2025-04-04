import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Linking, Alert, TextInput } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import companyLogo from "@/assets/companyImages/amazon2.png";
import { getAccessToken, getRefreshToken } from "../../utils/tokenStorage.js";
import { useUser } from "../../context/userContext.js";

const CodingProblems = () => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const { theme } = useUser()

  const themeColors = {
    darkBackground: "#1a012c",
    lightBackground: "#F5F5F5",
    darkText: "#fff",
    lightText: "#333333",
    darkSubtitleText: "#d8b8e8",
    lightSubtitleText: "#666666",
    darkPurple: "#C92EFF",
    lightPurple: "#6A0DAD",
  };

  // Get current theme color
  const getThemeColor = (darkValue, lightValue) => theme === 'dark' ? darkValue : lightValue;

  const getDifficultyStyle = (difficulty) => {
    const baseStyles = {
      Easy: {
        dark: {
          backgroundColor: "#0f5132",
          color: "#d1e7dd",
        },
        light: {
          backgroundColor: "#d1e7dd",
          color: "#0f5132",
        }
      },
      Medium: {
        dark: {
          backgroundColor: "#664d03",
          color: "#f8d775",
        },
        light: {
          backgroundColor: "#fff3cd",
          color: "#664d03",
        }
      },
      Hard: {
        dark: {
          backgroundColor: "#58151c",
          color: "#f5c2c7",
        },
        light: {
          backgroundColor: "#f8d7da",
          color: "#58151c",
        }
      },
    };

    const diffStyle = baseStyles[difficulty] ? baseStyles[difficulty][theme] : {};

    return {
      backgroundColor: diffStyle.backgroundColor,
      color: diffStyle.color,
    };
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleOpenLink = (url) => {
    Linking.openURL(url).catch((err) => console.error("Error opening link:", err));
  };

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

      const response = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:5000/api/v1/questions/get-company-questions/c/Amazon`, {
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

      if (result.statusCode === 200) {
        setProblems(result.data);
        setFilteredProblems(result.data);
      } else {
        Alert.alert('Error', result?.message || "Something went worng. Please try again later.")
      }

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
    <View style={[
      styles.container,
      { backgroundColor: getThemeColor(themeColors.darkBackground, themeColors.lightBackground) }
    ]}>
      <View style={styles.headerContainer}>
        <Text style={[
          styles.header,
          { color: getThemeColor(themeColors.darkPurple, themeColors.lightPurple) }
        ]}>Coding Problems</Text>
        <View style={styles.headerRight}>
          <Image source={companyLogo} style={styles.logo} />
        </View>
      </View>

      <View style={[
        styles.searchContainer,
        {
          backgroundColor: getThemeColor("rgba(255, 255, 255, 0.08)", "rgba(106, 13, 173, 0.08)"),
          borderColor: getThemeColor("rgba(201, 46, 255, 0.3)", "rgba(106, 13, 173, 0.3)")
        }
      ]}>
        <FontAwesome
          name="search"
          size={20}
          color={getThemeColor(themeColors.darkPurple, themeColors.lightPurple)}
          style={styles.searchIcon}
        />
        <TextInput
          style={[
            styles.searchInput,
            { color: getThemeColor(themeColors.darkText, themeColors.lightText) }
          ]}
          placeholder="Search problems..."
          placeholderTextColor={getThemeColor("#8a8a8a", "#999")}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
            <FontAwesome
              name="times-circle"
              size={20}
              color={getThemeColor(themeColors.darkPurple, themeColors.lightPurple)}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterContainer}>
        <Text style={[
          styles.filterLabel,
          { color: getThemeColor(themeColors.darkText, themeColors.lightText) }
        ]}>Difficulty:</Text>
        <ScrollableFilterButtons
          difficultyFilter={difficultyFilter}
          handleFilterChange={handleFilterChange}
          theme={theme}
          themeColors={themeColors}
        />
      </View>

      {(searchQuery.length > 0 || difficultyFilter !== "All") && (
        <View style={[
          styles.activeFiltersContainer,
          {
            backgroundColor: getThemeColor(
              "rgba(201, 46, 255, 0.1)",
              "rgba(106, 13, 173, 0.1)"
            )
          }
        ]}>
          <Text style={[
            styles.activeFiltersText,
            { color: getThemeColor(themeColors.darkSubtitleText, themeColors.lightSubtitleText) }
          ]}>
            Active filters: {difficultyFilter !== "All" ? difficultyFilter : ""}
            {searchQuery.length > 0 ? (difficultyFilter !== "All" ? ", " : "") + `"${searchQuery}"` : ""}
          </Text>
          <TouchableOpacity
            style={[
              styles.resetFiltersButton,
              {
                backgroundColor: getThemeColor(
                  "rgba(201, 46, 255, 0.3)",
                  "rgba(106, 13, 173, 0.3)"
                )
              }
            ]}
            onPress={resetFilters}
          >
            <Text style={[
              styles.resetFiltersText,
              { color: getThemeColor(themeColors.darkText, themeColors.lightText) }
            ]}>Reset Filters</Text>
          </TouchableOpacity>
        </View>
      )}

      {isLoading ? (
        <View style={[
          styles.emptyContainer,
          {
            backgroundColor: getThemeColor(
              "rgba(255, 255, 255, 0.03)",
              "rgba(106, 13, 173, 0.03)"
            )
          }
        ]}>
          <Text style={[
            styles.emptyTitle,
            { color: getThemeColor(themeColors.darkText, themeColors.lightText) }
          ]}>Loading...</Text>
        </View>
      ) : filteredProblems && filteredProblems.length > 0 ? (
        <FlatList
          data={filteredProblems}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={() => (
            <View style={[
              styles.tableHeader,
              { borderBottomColor: getThemeColor("#ddd", "#ddd") }
            ]}>
              <Text style={[
                styles.headerText,
                styles.col1,
                { color: getThemeColor(themeColors.darkText, themeColors.lightText) }
              ]}>No.</Text>
              <Text style={[
                styles.headerText,
                styles.col2,
                { color: getThemeColor(themeColors.darkText, themeColors.lightText) }
              ]}>Problem</Text>
              <Text style={[
                styles.headerText,
                styles.col3,
                { color: getThemeColor(themeColors.darkText, themeColors.lightText) }
              ]}>Practice</Text>
              <Text style={[
                styles.headerText,
                styles.col4,
                { color: getThemeColor(themeColors.darkText, themeColors.lightText) }
              ]}>Difficulty</Text>
            </View>
          )}
          renderItem={({ item, index }) => (
            <View style={[
              styles.row,
              { borderBottomColor: getThemeColor("#444", "#ddd") }
            ]}>
              <Text style={[
                styles.cell,
                styles.col1,
                { color: getThemeColor(themeColors.darkText, themeColors.lightText) }
              ]}>{index + 1}.</Text>
              <Text style={[
                styles.cell,
                styles.col2,
                { color: getThemeColor(themeColors.darkText, themeColors.lightText) }
              ]}>{item.name}</Text>
              <TouchableOpacity onPress={() => handleOpenLink(item?.link)}>
                <FontAwesome
                  name="code"
                  size={22}
                  style={[
                    styles.icon,
                    { color: getThemeColor(themeColors.darkPurple, themeColors.lightPurple) }
                  ]}
                />
              </TouchableOpacity>
              <Text
                style={[
                  styles.difficulty,
                  styles.col4,
                  getDifficultyStyle(item.difficulty)
                ]}
              >
                {item.difficulty}
              </Text>
            </View>
          )}
        />
      ) : (
        <View style={[
          styles.emptyContainer,
          {
            backgroundColor: getThemeColor(
              "rgba(255, 255, 255, 0.03)",
              "rgba(106, 13, 173, 0.03)"
            )
          }
        ]}>
          <FontAwesome
            name="search"
            size={60}
            color={getThemeColor(themeColors.darkPurple, themeColors.lightPurple)}
            style={styles.emptyIcon}
          />
          <Text style={[
            styles.emptyTitle,
            { color: getThemeColor(themeColors.darkText, themeColors.lightText) }
          ]}>No Matching Problems</Text>
          <Text style={[
            styles.emptyMessage,
            { color: getThemeColor(themeColors.darkSubtitleText, themeColors.lightSubtitleText) }
          ]}>
            We couldn't find any problems matching your filters.
            Try different search terms or filter settings.
          </Text>
          <TouchableOpacity
            style={[
              styles.refreshButton,
              { backgroundColor: getThemeColor(themeColors.darkPurple, themeColors.lightPurple) }
            ]}
            onPress={resetFilters}
          >
            <Text style={styles.refreshButtonText}>Reset Filters</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// Separate component for filter buttons with horizontal scrolling
const ScrollableFilterButtons = ({ difficultyFilter, handleFilterChange, theme, themeColors }) => {
  const getThemeColor = (darkValue, lightValue) => theme === 'dark' ? darkValue : lightValue;

  const getButtonStyle = (difficulty) => {
    const baseStyles = {
      All: {
        normal: {
          backgroundColor: getThemeColor("rgba(255, 255, 255, 0.1)", "rgba(106, 13, 173, 0.1)"),
          borderColor: getThemeColor("rgba(255, 255, 255, 0.2)", "rgba(106, 13, 173, 0.2)"),
        },
        active: {
          backgroundColor: getThemeColor("#C92EFF", "#6A0DAD"),
          borderColor: getThemeColor("#C92EFF", "#6A0DAD"),
        },
        text: {
          normal: getThemeColor("#fff", "#333"),
          active: "#fff",
        }
      },
      Easy: {
        normal: {
          backgroundColor: getThemeColor("rgba(15, 81, 50, 0.3)", "rgba(209, 231, 221, 0.5)"),
          borderColor: getThemeColor("#0f5132", "#0f5132"),
        },
        active: {
          backgroundColor: getThemeColor("#0f5132", "#198754"),
          borderColor: getThemeColor("#0f5132", "#198754"),
        },
        text: {
          normal: getThemeColor("#d1e7dd", "#0f5132"),
          active: "#d1e7dd",
        }
      },
      Medium: {
        normal: {
          backgroundColor: getThemeColor("rgba(102, 77, 3, 0.3)", "rgba(255, 243, 205, 0.5)"),
          borderColor: getThemeColor("#664d03", "#664d03"),
        },
        active: {
          backgroundColor: getThemeColor("#664d03", "#ffc107"),
          borderColor: getThemeColor("#664d03", "#ffc107"),
        },
        text: {
          normal: getThemeColor("#f8d775", "#664d03"),
          active: "#f8d775",
        }
      },
      Hard: {
        normal: {
          backgroundColor: getThemeColor("rgba(88, 21, 28, 0.3)", "rgba(248, 215, 218, 0.5)"),
          borderColor: getThemeColor("#58151c", "#58151c"),
        },
        active: {
          backgroundColor: getThemeColor("#58151c", "#dc3545"),
          borderColor: getThemeColor("#58151c", "#dc3545"),
        },
        text: {
          normal: getThemeColor("#f5c2c7", "#58151c"),
          active: "#f5c2c7",
        }
      }
    };

    const isActive = difficultyFilter === difficulty;
    const styles = baseStyles[difficulty] || baseStyles.All;

    return {
      button: isActive ? styles.active : styles.normal,
      text: { color: isActive ? styles.text.active : styles.text.normal }
    };
  };

  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={["All", "Easy", "Medium", "Hard"]}
      keyExtractor={(item) => item}
      renderItem={({ item }) => {
        const buttonStyle = getButtonStyle(item);

        return (
          <TouchableOpacity
            style={[
              styles.filterButton,
              buttonStyle.button
            ]}
            onPress={() => handleFilterChange(item)}
          >
            <Text style={[styles.filterText, buttonStyle.text]}>
              {item}
            </Text>
          </TouchableOpacity>
        );
      }}
      contentContainerStyle={styles.filterButtonsContainer}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "sans-serif",
    marginTop: 15
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    borderRadius: 100,
    marginTop: 25
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 46,
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
    borderWidth: 1,
  },
  filterText: {
    fontWeight: "bold",
  },
  activeFiltersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    borderRadius: 8,
    padding: 8,
  },
  activeFiltersText: {
    fontSize: 14,
  },
  resetFiltersButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  resetFiltersText: {
    fontSize: 12,
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    marginHorizontal: 3,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  cell: {
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 0,
    marginLeft: 0,
  },
  icon: {
    textAlign: "center",
    paddingHorizontal: 10,
  },
  difficulty: {
    fontSize: 14,
    fontWeight: "bold",
    paddingVertical: 5,
    borderRadius: 5,
    textAlign: "center",
    marginLeft: 5
  },
  col1: { flex: 0.5, alignItems: "center", justifyContent: "center" },
  col2: { flex: 2, alignItems: "flex-start", paddingLeft: 10 },
  col3: { flex: 1.2, alignItems: "center", paddingRight: 13 },
  col4: { flex: 1.3, alignItems: "center", justifyContent: "center" },

  // Empty state styles
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
  },
  emptyIcon: {
    marginBottom: 20,
    opacity: 0.8,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  refreshButton: {
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