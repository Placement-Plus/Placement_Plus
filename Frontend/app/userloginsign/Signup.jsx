import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Feather, FontAwesome } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { SelectList } from "react-native-dropdown-select-list";

// Reusable Input Field Component
const InputField = ({ icon, placeholder, value, onChangeText, keyboardType, secureTextEntry }) => (
  <View style={styles.inputContainer}>
    <FontAwesome name={icon} size={20} color="#999" style={styles.inputIcon} />
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#aaa"
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);

const SignupScreen = ({ setScreen }) => {
  const [rollNumber, setRollNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [branch, setBranch] = useState("Computer Science");
  const [semester, setSemester] = useState("1");
  const [cgpa, setCgpa] = useState("");
  const [batchYear, setBatchYear] = useState("");
  const [course, setCourse] = useState("BTech");
  const [email, setEmail] = useState("");
  const [resume, setResume] = useState(null);

  const [activeDropdown, setActiveDropdown] = useState(null); // Track active dropdown

  const branches = ["Computer Science", "Mechanical", "Civil", "Electrical", "ECE", "AIDS", "VLSI"];
  const semesters = Array.from({ length: 8 }, (_, i) => `${i + 1}`);
  const courses = ["BTech", "MTech"];

  const handleResumeUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
    if (result.type !== "cancel") {
      setResume(result.uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <TouchableOpacity onPress={() => router.push("userloginsign/login")} style={styles.backButton}>
        <Feather name="arrow-left" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.welcomeTitle}>Create an <Text style={styles.purpleText}>Account!</Text></Text>

      {/* Input Fields */}
      <InputField icon="user" placeholder="Full Name" />
      <InputField
        icon="envelope"
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <InputField
        icon="id-card"
        placeholder="Roll Number"
        value={rollNumber}
        onChangeText={setRollNumber}
        keyboardType="numeric"
      />
      <InputField
        icon="mobile"
        placeholder="Mobile Number"
        value={mobileNumber}
        onChangeText={setMobileNumber}
        keyboardType="numeric"
      />
      <InputField
        icon="book"
        placeholder="CGPA"
        value={cgpa}
        onChangeText={setCgpa}
        keyboardType="decimal-pad"
      />
      <InputField
        icon="calendar"
        placeholder="Batch Year"
        value={batchYear}
        onChangeText={setBatchYear}
        keyboardType="numeric"
      />

      {/* Dropdowns with Correct zIndex Management */}
      <View style={[styles.dropdownContainer, { zIndex: activeDropdown === "branch" ? 3 : 1 }]}>
        <SelectList
          setSelected={setBranch}
          data={branches.map((b) => ({ key: b, value: b }))}
          boxStyles={styles.dropdownBox}
          dropdownStyles={styles.dropdownList}
          dropdownTextStyles={styles.dropdownText}
          placeholder="Select Branch"
          onFocus={() => setActiveDropdown("branch")} 
          onBlur={() => setActiveDropdown(null)} 
        />
      </View>
      <View style={[styles.dropdownContainer, { zIndex: activeDropdown === "semester" ? 2 : 1 }]}>
        <SelectList
          setSelected={setSemester}
          data={semesters.map((s) => ({ key: s, value: s }))}
          boxStyles={styles.dropdownBox}
          dropdownStyles={styles.dropdownList}
          dropdownTextStyles={styles.dropdownText}
          placeholder="Select Semester"
          onFocus={() => setActiveDropdown("semester")} 
          onBlur={() => setActiveDropdown(null)} 
        />
      </View>
      <View style={[styles.dropdownContainer, { zIndex: activeDropdown === "course" ? 2 : 1 }]}>
        <SelectList
          setSelected={setCourse}
          data={courses.map((c) => ({ key: c, value: c }))}
          boxStyles={styles.dropdownBox}
          dropdownStyles={styles.dropdownList}
          dropdownTextStyles={styles.dropdownText}
          placeholder="Select Course"
          onFocus={() => setActiveDropdown("course")} 
          onBlur={() => setActiveDropdown(null)} 
        />
      </View>

      {/* Upload Resume Button */}
      <TouchableOpacity style={styles.button} onPress={handleResumeUpload}>
        <Text style={styles.buttonText}>{resume ? "Resume Uploaded" : "Upload Resume"}</Text>
      </TouchableOpacity>

      {/* Create Account Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
      </TouchableOpacity>

      {/* Footer Link */}
      <TouchableOpacity onPress={() =>router.push("userloginsign/login")}>
        <Text style={styles.bottomText}>Already have an account? <Text style={styles.purpleText}>Sign in</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#0D021F",
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  purpleText: {
    color: "#C92EFF",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1235",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    width: "100%",
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "white",
  },
  dropdownContainer: {
    width: "100%",
    marginBottom: 15,
  },
  dropdownBox: {
    backgroundColor: "#1C1235",
    borderRadius: 10,
    borderWidth: 0,
  },
  dropdownList: {
    backgroundColor: "#1C1235",
    borderWidth: 0,
    marginTop: 5,
    position: "absolute",
    backgroundColor: "#1C1235",
    width: "100%",
  },
  dropdownText: {
    color: "white",
  },
  button: {
    backgroundColor: "#C92EFF",
    paddingVertical: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomText: {
    color: "white",
    marginTop: 10,
  },
});

export default SignupScreen;
