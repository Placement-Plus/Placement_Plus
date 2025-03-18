import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  Dimensions,
  Animated,
  FlatList,
  StatusBar,
  SafeAreaView,
  TouchableOpacity
} from "react-native";
import { FontAwesome, Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import pastYearCompany from "@/assets/images/pastyearcompany.png";
import placementStat from "@/assets/images/placementstat.png";
import alumni from "@/assets/images/alumni.png";
import questionAskByCompany from "@/assets/images/questionaskbycompany.png";
import upcomingCompany from "@/assets/images/upcomingcompany.png";
import branchStat from "@/assets/images/branchstat.png";
import placementPolicies from "@/assets/images/placementpolicies.png";
import uploadResume from "@/assets/images/uploadresume.png";
import chatbot from "@/assets/images/chatbot.png";

const { width, height } = Dimensions.get("window");

const MENU_ITEMS = [
  {
    id: 0,
    title: "Past Year Companies",
    icon: pastYearCompany,
    route: "/screens/PastYearCompanies",
    description: "View companies that recruited in previous years"
  },
  {
    id: 1,
    title: "Current Year Placement",
    icon: placementStat,
    route: "/screens/CurrentYearPlacement",
    description: "Track ongoing placement statistics"
  },
  {
    id: 2,
    title: "Connect with Alumni",
    icon: alumni,
    route: "/screens/ConnectWithAlumni",
    description: "Network with graduates from your college"
  },
  {
    id: 3,
    title: "Questions by Companies",
    icon: questionAskByCompany,
    route: "/screens/QuestionAskByCompanies",
    description: "Practice interview questions from companies"
  },
  {
    id: 4,
    title: "Upcoming Companies",
    icon: upcomingCompany,
    route: "/screens/UpcomingCompanies",
    description: "See which companies are visiting soon"
  },
  {
    id: 5,
    title: "Branch-wise Stats",
    icon: branchStat,
    route: "/screens/BranchWisePlacement",
    description: "View placements categorized by branch"
  },
  {
    id: 6,
    title: "Placement Policies",
    icon: placementPolicies,
    route: "/screens/PlacementPolicies",
    description: "Understand the rules and guidelines"
  },
  {
    id: 7,
    title: "Upload Resume",
    icon: uploadResume,
    route: "/screens/UploadResume",
    description: "Submit and manage your resume"
  },
  {
    id: 8,
    title: "AI Assistant",
    icon: chatbot,
    route: "/screens/ChatBot",
    description: "Get immediate answers to your questions"
  },
];

const PlacementPlus = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(MENU_ITEMS);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dark');

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.9],
    extrapolate: 'clamp'
  });

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [180, 120],
    extrapolate: 'clamp'
  });

  // Filter menu items based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredItems(MENU_ITEMS);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = MENU_ITEMS.filter(item =>
        item.title.toLowerCase().includes(lowercasedQuery) ||
        item.description.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery]);

  const handleItemPress = (item) => {
    router.push(item.route);
  };

  const toggleTheme = () => {
    setCurrentTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  // Calculate styles based on the current theme
  const themeStyles = {
    backgroundColor: currentTheme === 'dark' ? '#0f0a20' : '#f5f5f5',
    textColor: currentTheme === 'dark' ? '#ffffff' : '#333333',
    cardBackground: currentTheme === 'dark' ? '#1a1132' : '#ffffff',
    accentColor: '#a100f2',
    headerGradient: currentTheme === 'dark'
      ? ['#2d0066', '#1a012c']
      : ['#a100f2', '#7000c8'],
  };

  const renderMenuItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => handleItemPress(item)}
        activeOpacity={0.7}
      >
        <Animated.View style={[
          styles.menuItem,
          { backgroundColor: themeStyles.cardBackground }
        ]}>
          <View style={styles.menuIconContainer}>
            <Image source={item.icon} style={styles.menuIcon} />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={[styles.menuTitle, { color: themeStyles.textColor }]}>
              {item.title}
            </Text>
            <Text style={styles.menuDescription}>{item.description}</Text>
          </View>
          <MaterialIcons name="arrow-forward-ios" size={16} color={themeStyles.accentColor} />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.gridHeaderContainer}>
        <Text style={[styles.gridHeaderTitle, { color: themeStyles.textColor }]}>
          Placement Resources
        </Text>
        <Text style={styles.gridHeaderSubtitle}>
          Explore tools to help with your placement journey
        </Text>
      </View>
    );
  };

  const renderEmptyList = () => {
    return (
      <View style={styles.emptyListContainer}>
        <MaterialIcons name="search-off" size={50} color={themeStyles.accentColor} />
        <Text style={[styles.emptyListText, { color: themeStyles.textColor }]}>
          No matches found for "{searchQuery}"
        </Text>
        <TouchableOpacity onPress={() => setSearchQuery('')}>
          <Text style={styles.clearSearchButton}>Clear Search</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <StatusBar barStyle={currentTheme === 'dark' ? 'light-content' : 'dark-content'} />

      {/* Animated Header */}
      <Animated.View style={[
        styles.header,
        {
          height: headerHeight,
          opacity: headerOpacity,
        }
      ]}>
        <LinearGradient
          colors={themeStyles.headerGradient}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Image source={require("@/assets/images/logo.png")} style={styles.logo} />
              <Text style={styles.logoText}>Placement Plus</Text>
            </View>

            <View style={styles.headerRightContainer}>
              <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
                <Ionicons
                  name={currentTheme === 'dark' ? 'sunny' : 'moon'}
                  size={24}
                  color="#fff"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsProfileModalVisible(true)}>
                <Ionicons name="person-circle" size={35} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchBarContainer}>
            <View style={styles.searchBar}>
              <FontAwesome name="search" size={18} color={themeStyles.accentColor} />
              <TextInput
                placeholder="Search resources..."
                placeholderTextColor="#a89cb1"
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color={themeStyles.accentColor} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Main Content */}
      <FlatList
        data={filteredItems}
        renderItem={renderMenuItem}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      />

      {/* Footer */}
      <BlurView intensity={80} tint={currentTheme === 'dark' ? 'dark' : 'light'} style={styles.footer}>
        <View style={styles.socialIconsContainer}>
          <TouchableOpacity style={styles.socialIconButton}>
            <FontAwesome name="envelope" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIconButton}>
            <Entypo name="phone" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIconButton}>
            <FontAwesome name="instagram" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIconButton}>
            <FontAwesome name="linkedin" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </BlurView>

      {/* Profile Modal (simplified) */}
      {isProfileModalVisible && (
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsProfileModalVisible(false)}
        >
          <BlurView intensity={90} tint="dark" style={styles.blurContainer}>
            <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
              <Text style={styles.modalTitle}>Profile</Text>
              {/* Profile content would go here */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsProfileModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </Pressable>
          </BlurView>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    overflow: 'hidden',
  },
  headerGradient: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeToggle: {
    marginRight: 15,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 32,
    height: 32,
    resizeMode: "contain",
    marginRight: 10,
  },
  logoText: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "System",
  },
  searchBarContainer: {
    paddingHorizontal: 5,
    marginTop: 20,
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#333",
    fontSize: 16,
    marginLeft: 10,
    marginRight: 10,
    padding: 0,
  },
  flatListContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  gridHeaderContainer: {
    marginTop: 20,
    marginBottom: 15,
  },
  gridHeaderTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 5,
  },
  gridHeaderSubtitle: {
    fontSize: 14,
    color: "#a89cb1",
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  menuIconContainer: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(161, 0, 242, 0.1)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 12,
    color: '#a89cb1',
  },
  emptyListContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyListText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  clearSearchButton: {
    color: '#a100f2',
    fontSize: 16,
    fontWeight: '600',
    padding: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIconButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(161, 0, 242, 0.9)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  blurContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: 'rgba(26, 1, 44, 0.95)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#a100f2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
};

export default PlacementPlus;