import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const RoleSelectionScreen = () => {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#0D021F', '#1D0442']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={require("@/assets/images/logo.png")} style={styles.logo} />
        <Text style={styles.logoText}>Placement Plus</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>
        {/* Select Your <Text style={styles.highlight}>Role</Text> */}
        Let's Get <Text style={styles.highlight}>Started</Text>
      </Text>

      {/* Role Buttons */}
      <Pressable
        style={styles.buttonContainer}
        onPress={() => router.push("Admin/login")}
      >
        <LinearGradient
          colors={['#C92EFF', '#8428B2']}
          style={styles.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Ionicons name="shield-checkmark" size={28} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>ADMIN</Text>
        </LinearGradient>
      </Pressable>

      <Pressable
        style={styles.buttonContainer}
        onPress={() => router.push("roles/alumni")}
      >
        <LinearGradient
          colors={['#C92EFF', '#8428B2']}
          style={styles.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <FontAwesome5 name="user-graduate" size={26} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>ALUMNI</Text>
        </LinearGradient>
      </Pressable>

      <Pressable
        style={styles.buttonContainer}
        onPress={() => router.push("screens/Roles/Student")}
      >
        <LinearGradient
          colors={['#C92EFF', '#8428B2']}
          style={styles.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Ionicons name="school" size={28} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>STUDENT</Text>
        </LinearGradient>
      </Pressable>
    </LinearGradient>
  );
};

export default RoleSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 60,
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
  title: {
    fontSize: 55,
    fontFamily: "sans-serif",
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 60,
    fontStyle: "italic",
    textShadowColor: 'rgba(201, 46, 255, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  highlight: {
    color: "#C92EFF",
  },
  buttonContainer: {
    width: "80%",
    marginVertical: 12,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: "#C92EFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 15,
  },
  buttonIcon: {
    marginRight: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
  },
  backIcon: {
    marginRight: 8,
  },
  backText: {
    color: "white",
    fontSize: 16,
  }
});