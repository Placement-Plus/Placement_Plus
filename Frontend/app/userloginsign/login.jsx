import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ImageBackground } from "react-native";
import { Link, useRouter } from "expo-router";
import { SimpleLineIcons, Feather } from "@expo/vector-icons";

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
      <View style={styles.container}>
        {/* Back Button */}
        <Pressable style={styles.backButton} onPress={() => router.push("index")}> 
          <Feather name="arrow-left" size={24} color="white" />
        </Pressable>
        
        {/* Title */}
        <Text style={styles.title}>Welcome <Text style={styles.highlight}>Back!</Text></Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <SimpleLineIcons name="envelope" size={20} color="white" style={styles.inputIcon} />
          <TextInput 
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <SimpleLineIcons name="lock" size={20} color="white" style={styles.inputIcon} />
          <TextInput 
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="white" />
          </Pressable>
        </View>

        {/* Remember Me Checkbox */}
        <Pressable style={styles.rememberContainer} onPress={() => setRememberMe(!rememberMe)}>
          <Feather name={rememberMe ? "check-square" : "square"} size={20} color="white" />
          <Text style={styles.rememberText}> Remember for 30 days</Text>
        </Pressable>

        {/* Log In Button */}
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>LOG IN</Text>
        </Pressable>

        {/* Forgot Password & Sign Up Links */}
        <Link href="/forgot-password" asChild>
          <Pressable>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </Pressable>
        </Link>

        <Text style={styles.signupText}>Don’t have an account? 
          <Link href="userloginsign/Signup"><Text style={styles.highlight}> Sign up</Text></Link>
        </Text>
        
      </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0D021F",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 80,
    fontStyle: "italic",
    textDecorationStyle: "solid",
  },
  highlight: {
    color: "#C92EFF",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1235",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    width: "90%",
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "white",
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  rememberText: {
    color: "white",
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#C92EFF",
    paddingVertical: 15,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotText: {
    color: "#C92EFF",
    marginVertical: 10,
    marginBottom: 50,
  },
  signupText: {
    color: "white",
    marginTop: 10,
    textAlign: "center",
  },
});
