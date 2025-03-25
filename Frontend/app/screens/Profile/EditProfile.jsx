import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../../context/userContext.js';
import { router } from 'expo-router';
import * as yup from 'yup';
import { getAccessToken, getRefreshToken } from '../../../utils/tokenStorage.js';

const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string()
        .email('Email must be a valid email')
        .matches(/@nitdelhi\.ac\.in$/, 'Email must be a NIT Delhi email')
        .required('Email is required'),
    rollNo: yup.string().length(9, 'Roll No must be of 9 digits').required('Roll Number is required'),
    mobileNo: yup.string()
        .matches(/^\+?[0-9]{10,15}$/, 'Mobile number must be between 10-15 digits')
        .required('Mobile Number is required'),
    semester: yup.number()
        .typeError('Semester must be a number')
        .min(1, 'Semester must be between 1-8')
        .max(8, 'Semester must be between 1-8')
        .required('Semester is required'),
    cgpa: yup.number()
        .typeError('CGPA must be a number')
        .min(0, 'CGPA must be between 0-10')
        .max(10, 'CGPA must be between 0-10')
        .required('CGPA is required'),
    branch: yup.string().required('Branch is required'),
    batch: yup.string().length(4, 'Batch must be of 4 digits').required('Batch is required')
});

const EditProfileScreen = () => {

    const navigation = useNavigation();
    const { user, login } = useUser();

    const [profile, setProfile] = useState({
        name: '', email: '', rollNo: '', mobileNo: '', semester: '', cgpa: '', branch: '', batch: '',
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    useEffect(() => {
        if (user) {
            setProfile({
                name: user.name || '',
                email: user.email || '',
                rollNo: String(user.rollNo) || '',
                mobileNo: String(user.mobileNo) || '',
                semester: user.semester ? String(user.semester) : '',
                cgpa: user.CGPA ? String(user.CGPA) : '',
                branch: user.branch || '',
                batch: String(user.batch) || '',
            });
        }
    }, [user]);

    const handleSave = async () => {
        try {
            setTouched(Object.keys(profile).reduce((acc, field) => ({ ...acc, [field]: true }), {}));
            await validationSchema.validate(profile, { abortEarly: false });
            // Alert.alert("Success", "Profile updated successfully", [{ text: "OK", onPress: () => navigation.goBack() }]);

            await updateProfile(profile)
        } catch (validationError) {
            setErrors(validationError.inner.reduce((acc, err) => ({ ...acc, [err.path]: err.message }), {}));
        }
    };

    const updateProfile = async (newProfile) => {
        try {
            const accessToken = await getAccessToken()
            const refreshToken = await getRefreshToken()
            if (!accessToken || !refreshToken)
                throw new Error("Tokens are required")

            const response = await fetch(`http:${process.env.EXPO_PUBLIC_IP_ADDRESS}:5000/api/v1/users/update-details`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                    'x-refresh-token': refreshToken,
                },
                body: JSON.stringify(newProfile)
            })

            if (!response.ok)
                throw new Error("Failed to update profile")

            const result = await response.json()

            if (result.statusCode === 200) {
                login(result.data)
                Alert.alert("Success", "Profile updated successfully", [{ text: "OK" }]);
            }
        } catch (error) {
            Alert.alert("Error", error?.message || "Something went worng", [{ text: "OK" }]);
        }
    }

    const handleInputChange = useCallback((field, value) => {
        setProfile(prev => ({ ...prev, [field]: value }));
        setTouched(prev => ({ ...prev, [field]: true }));
        validateField(field, value);
    }, []);

    const validateField = async (field, value) => {
        try {
            await yup.reach(validationSchema, field).validate(value);
            setErrors(prev => ({ ...prev, [field]: undefined }));
        } catch (error) {
            setErrors(prev => ({ ...prev, [field]: error.message }));
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#C92EFF" />
                        <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                    <TouchableOpacity onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.scrollView}>
                    <View style={styles.card}>
                        {Object.entries({
                            name: "Full Name", email: "Email Address", rollNo: "Roll Number", mobileNo: "Mobile Number",
                            semester: "Semester", cgpa: "CGPA", branch: "Branch", batch: "Batch"
                        }).map(([field, label]) => (
                            <View key={field} style={styles.fieldContainer}>
                                <Text style={styles.fieldLabel}>{label}</Text>
                                <TextInput
                                    style={[styles.textInput, touched[field] && errors[field] ? styles.inputError : null]}
                                    value={profile[field]}
                                    onChangeText={(text) => handleInputChange(field, text)}
                                    placeholder={`Enter ${label.toLowerCase()}`}
                                    keyboardType={field === 'email' ? 'email-address' : field === 'cgpa' || field === 'semester' ? 'numeric' : 'default'}
                                />
                                {touched[field] && errors[field] ? <Text style={styles.errorText}>{errors[field]}</Text> : null}
                            </View>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleSave}>
                        <Text style={styles.buttonText}>Save Changes</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a0525',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#2d0a41',
        borderBottomWidth: 1,
        borderBottomColor: '#390852',
        marginTop: 25
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButtonText: {
        marginLeft: 4,
        fontSize: 16,
        color: '#C92EFF',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#C92EFF',
    },
    scrollView: {
        flex: 1,
        marginTop: 10
    },
    profileHeader: {
        alignItems: 'center',
        padding: 24,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#C92EFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#C92EFF',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#C92EFF',
    },
    avatarText: {
        fontSize: 40,
        color: '#fff',
        fontWeight: 'bold',
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#C92EFF',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#1a0525',
    },
    changePhotoText: {
        color: '#C92EFF',
        fontSize: 14,
        fontWeight: '500',
    },
    card: {
        backgroundColor: '#2d0a41',
        borderRadius: 15,
        padding: 16,
        marginHorizontal: 15,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#C92EFF',
    },
    fieldContainer: {
        marginBottom: 16,
    },
    fieldLabel: {
        fontSize: 14,
        color: '#b388e9',
        marginBottom: 8,
    },
    textInput: {
        backgroundColor: '#390852',
        borderRadius: 8,
        padding: 12,
        color: '#fff',
        fontSize: 16,
    },
    inputError: {
        borderWidth: 1,
        borderColor: '#F44336',
    },
    errorText: {
        color: '#F44336',
        fontSize: 12,
        marginTop: 4,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    switchLabel: {
        fontSize: 16,
        color: '#fff',
    },
    button: {
        backgroundColor: '#C92EFF',
        borderRadius: 15,
        padding: 16,
        alignItems: 'center',
        marginHorizontal: 15,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default EditProfileScreen;