import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ImageBackground } from "react-native";
import { Link, useRouter } from "expo-router";
import { SimpleLineIcons, Feather } from "@expo/vector-icons";

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
<<<<<<< HEAD
  const [isLoading, setIsLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };

  const handleBlur = (field) => {
    setTouchedFields({
      ...touchedFields,
      [field]: true,
    });

    validateField(field);
  };

  const validateField = async (field) => {
    try {
      const fieldSchema = Yup.reach(LoginSchema, field);
      await fieldSchema.validate(formData[field]);
      setErrors({
        ...errors,
        [field]: null,
      });
    } catch (error) {
      setErrors({
        ...errors,
        [field]: error.message,
      });
    }
  };

  const validateForm = async () => {
    try {
      await LoginSchema.validate(formData, { abortEarly: false });
      return true;
    } catch (error) {
      const validationErrors = {};
      if (error.inner) {
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
      }
      setErrors(validationErrors);
      return false;
    }
  };

  const handleLogin = async () => {
    Keyboard.dismiss();

    const isValid = await validateForm();
    if (!isValid) return;

    setIsLoading(true);

    try {
      const response = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:5000/api/v1/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      console.log('Login successful:', result);

    } catch (error) {
      Alert.alert(
        "Login Failed",
        error.message || "Something went wrong. Please try again.",
        [{ text: "OK" }]
      );
      console.error('Error:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={['#0D021F', '#1E0442']}
        style={styles.container}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <Pressable
            style={styles.backButton}
            onPress={() => router.push("index")}
            hitSlop={20}
          >
            <Feather name="arrow-left" size={24} color="white" />
          </Pressable>

          <View style={styles.contentContainer}>
            <Text style={styles.title}>
              Welcome <Text style={styles.highlight}>Back!</Text>
            </Text>
            <View style={[
              styles.inputContainer,
              touchedFields.email && errors.email ? styles.inputError : null
            ]}>
              <SimpleLineIcons name="envelope" size={20} color={touchedFields.email && errors.email ? "#FF6B6B" : "#9D8ACE"} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#9D8ACE"
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
                onBlur={() => handleBlur("email")}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {touchedFields.email && !errors.email && (
                <MaterialIcons name="check-circle" size={20} color="#4CD964" />
              )}
            </View>
            {touchedFields.email && errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
        {/* Log In Button
        <Pressable style={styles.button} onPress={() => router.push("/HomePage/Home")}>
          <Text style={styles.buttonText}></Text>
        </Pressable> */}

            <View style={[
              styles.inputContainer,
              touchedFields.password && errors.password ? styles.inputError : null
            ]}>
              <SimpleLineIcons name="lock" size={20} color={touchedFields.password && errors.password ? "#FF6B6B" : "#9D8ACE"} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#9D8ACE"
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={(text) => handleChange("password", text)}
                onBlur={() => handleBlur("password")}
                autoCapitalize="none"
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={10}
              >
                <Feather
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#9D8ACE"
                />
              </Pressable>
            </View>
            {touchedFields.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <Pressable
              style={({ pressed }) => [
                styles.buttonContainer,
                pressed && styles.buttonPressed
              ]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#C92EFF', '#8E24F8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.buttonText}>LOG IN</Text>
                )}
              </LinearGradient>
            </Pressable>

            <Link href="/forgot-password" asChild>
              <Pressable style={styles.forgotContainer}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </Pressable>
            </Link>

            <Text style={styles.signupText}>
              Don't have an account?
              <Link href="userloginsign/Signup">
                <Text style={styles.highlight}> Sign up</Text>
              </Link>
            </Text>
             {/* Log In Button */}
        <Pressable style={styles.button} onPress={() => router.push("/HomePage/Home")}>
          <Text style={styles.buttonText}>Home</Text>
=======
  const [rememberMe, setRememberMe] = useState(false);

  return (
      <View style={styles.container}>
        {/* Back Button */}
        <Pressable style={styles.backButton} onPress={() => router.push("index")}> 
          <Feather name="arrow-left" size={24} color="white" />
>>>>>>> a3d4c5c (Change in frontend directory)
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
        <Pressable style={styles.button} onPress={() => router.push("HomePage/Home")}>
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
