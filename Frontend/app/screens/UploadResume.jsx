import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Pressable,
    Platform,
    useWindowDimensions,
    TextInput,
    ActivityIndicator,
    Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome5, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import * as DocumentPicker from 'expo-document-picker';
import * as Progress from 'react-native-progress';
import { getAccessToken, getRefreshToken } from "../../utils/tokenStorage.js";
import * as FileSystem from "expo-file-system";

const ResumeUploadScreen = () => {
    const { width, height } = useWindowDimensions();
    const [resumeFile, setResumeFile] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [atsScore, setAtsScore] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [improvementExpanded, setImprovementExpanded] = useState(null);

    // Responsive sizing helper
    const getResponsiveSize = (size, dimension) => {
        const baseWidth = 375;
        return dimension === 'width'
            ? (size / baseWidth) * width
            : size;
    };

    // Mock ATS analysis results
    //   const mockATSAnalysis = {
    //     score: 76,
    //     sections: {
    //       keywords: {
    //         score: 68,
    //         title: "Keyword Optimization",
    //         description: "Your resume matches 68% of key skills for your target roles.",
    //         improvements: [
    //           "Add more technical skills like 'React Native' and 'Firebase'",
    //           "Include industry-specific terms like 'Agile methodologies'",
    //           "Mention specific tools relevant to the job descriptions"
    //         ]
    //       },
    //       format: {
    //         score: 92,
    //         title: "Format & Readability",
    //         description: "Your resume is well-structured and easily parsed by ATS systems.",
    //         improvements: [
    //           "Remove the table in your skills section",
    //           "Ensure all dates follow a consistent MM/YYYY format"
    //         ]
    //       },
    //       content: {
    //         score: 79,
    //         title: "Content Quality",
    //         description: "Your achievements are well articulated but could be improved.",
    //         improvements: [
    //           "Quantify more achievements with specific metrics",
    //           "Add more action verbs at the beginning of bullet points",
    //           "Be more specific about your contributions to each project"
    //         ]
    //       },
    //       experience: {
    //         score: 73,
    //         title: "Experience Matching",
    //         description: "Your experience partially aligns with your target positions.",
    //         improvements: [
    //           "Highlight leadership experiences even in junior roles",
    //           "Better emphasize transferable skills from previous roles",
    //           "Focus more on achievements than responsibilities"
    //         ]
    //       }
    //     }
    //   };

    const handleBackPress = () => {
        router.back();
    };

    const selectResume = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "application/pdf",
                copyToCacheDirectory: true
            });

            if (result.canceled) {
                return;
            }

            const { uri, name, mimeType } = result?.assets[0];

            const resume = {
                uri,
                name,
                type: mimeType || 'application/pdf',
            };

            // setResumeFile(resume)
            await uploadResume(resume)
            // await checkResumeScore(resume)

        } catch (error) {
            console.error("Error picking document:", error);
        }
    };

    const uploadResume = async (resumeFile) => {

        const accessToken = await getAccessToken()
        const refreshToken = await getRefreshToken()

        // console.log(resumeFile);


        let resume = resumeFile
        if (resumeFile.uri.startsWith("data:application/pdf;base64,")) {
            const fileUri = `${FileSystem.cacheDirectory}${resumeFile.name}`;

            await FileSystem.writeAsStringAsync(fileUri, resumeFile.uri.split(",")[1], {
                encoding: FileSystem.EncodingType.Base64,
            });

            resume = {
                uri: fileUri,
                name: resumeFile.name,
                type: "application/pdf",
            };

        }

        const formData = new FormData()
        formData.append("resume", {
            uri: resume.uri,
            name: resume.name,
            type: resume.type,
        });

        try {

            const response = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:5000/api/v1/users/upload-resume`, {
                method: 'PATCH',
                body: formData,
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "x-refresh-token": refreshToken
                },
            });

            const result = await response.json();

            if (result.statusCode === 200) {
                Alert.alert("Success", "Resume uploaded successfully!");
            }

            // console.log(result?.data);

        } catch (error) {
            Alert.alert(
                "Error",
                error.message || "Something went wrong. Please try again.",
                [{ text: "OK" }]
            );
            console.error('Error:', error.message);
        }
    };

    const checkResumeScore = async (resumeFile) => {
        try {
            if (!resumeFile) {
                Alert.alert("Error", "Please select a resume file first.");
                return;
            }

            const formData = new FormData();
            formData.append("file", {
                uri: resumeFile.uri.replace("file://", ""),
                name: resumeFile.name || "resume.pdf",
                type: resumeFile.mimeType || "application/pdf",
            });

            // console.log(resumeFile?.uri);

            const response = await fetch("https://api.apilayer.com/resume_parser/upload", {
                method: "POST",
                headers: {
                    "apikey": 'EUBS320vq05lxYZsWXpjHPAfUMzd1Ynt',
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || `Upload failed: ${response.status}`);
            }

            Alert.alert("Success", "Resume uploaded successfully!");
            console.log("API Response:", responseData);
        } catch (error) {
            console.error("Upload Error:", error.message);
            Alert.alert("Error", error.message || "Failed to upload resume.");
        }
    };


    const analyzeResume = (file) => {
        setIsAnalyzing(true);
        setTimeout(() => {
            setAtsScore(mockATSAnalysis);
            setIsAnalyzing(false);
        }, 2500);
    };

    const toggleImprovementSection = (sectionKey) => {
        if (improvementExpanded === sectionKey) {
            setImprovementExpanded(null);
        } else {
            setImprovementExpanded(sectionKey);
        }
    };

    const renderScoreRing = (score) => {
        const color = score >= 85 ? "#4CAF50" : score >= 70 ? "#FF9800" : "#F44336";
        return (
            <View style={styles.scoreRingContainer}>
                <Progress.Circle
                    progress={score / 100}
                    size={120}
                    thickness={10}
                    color={color}
                    unfilledColor="rgba(255, 255, 255, 0.2)"
                    borderWidth={0}
                    strokeCap="round"
                    style={styles.scoreRing}
                />
                <View style={styles.scoreTextContainer}>
                    <Text style={styles.scoreText}>{score}</Text>
                    <Text style={styles.scoreLabel}>ATS Score</Text>
                </View>
            </View>
        );
    };

    const renderTabContent = () => {
        if (!atsScore) return null;

        switch (activeTab) {
            case 'overview':
                return (
                    <View style={styles.tabContent}>
                        {renderScoreRing(atsScore.score)}

                        <Text style={styles.overviewText}>
                            Your resume is {atsScore.score >= 85 ? 'excellent' : atsScore.score >= 70 ? 'good' : 'below average'} for ATS optimization.
                            {atsScore.score < 85 ? ' We recommend making the suggested improvements to increase your chances of getting past automated screening systems.' : ' Keep up the good work!'}
                        </Text>

                        <View style={styles.statsContainer}>
                            {Object.entries(atsScore.sections).map(([key, section]) => (
                                <LinearGradient
                                    key={key}
                                    colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.03)']}
                                    style={styles.statCard}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <View style={styles.statHeader}>
                                        <Text style={styles.statTitle}>{section.title}</Text>
                                        <View style={[styles.scoreBadge, {
                                            backgroundColor: section.score >= 85 ? "#4CAF50" : section.score >= 70 ? "#FF9800" : "#F44336"
                                        }]}>
                                            <Text style={styles.scoreBadgeText}>{section.score}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.statDescription}>{section.description}</Text>
                                </LinearGradient>
                            ))}
                        </View>
                    </View>
                );
            case 'improvements':
                return (
                    <View style={styles.tabContent}>
                        <Text style={styles.improvementsIntro}>
                            The following improvements could significantly increase your resume's effectiveness with ATS systems and hiring managers.
                        </Text>

                        {Object.entries(atsScore.sections).map(([key, section]) => (
                            <LinearGradient
                                key={key}
                                colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.03)']}
                                style={styles.improvementCard}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Pressable
                                    style={styles.improvementHeader}
                                    onPress={() => toggleImprovementSection(key)}
                                >
                                    <View style={styles.improvementHeaderLeft}>
                                        <View style={[styles.improvementIcon, {
                                            backgroundColor: section.score >= 85 ? "rgba(76, 175, 80, 0.2)" :
                                                section.score >= 70 ? "rgba(255, 152, 0, 0.2)" : "rgba(244, 67, 54, 0.2)"
                                        }]}>
                                            {key === 'keywords' && <Feather name="tag" size={20} color={section.score >= 85 ? "#4CAF50" : section.score >= 70 ? "#FF9800" : "#F44336"} />}
                                            {key === 'format' && <Feather name="layout" size={20} color={section.score >= 85 ? "#4CAF50" : section.score >= 70 ? "#FF9800" : "#F44336"} />}
                                            {key === 'content' && <Feather name="file-text" size={20} color={section.score >= 85 ? "#4CAF50" : section.score >= 70 ? "#FF9800" : "#F44336"} />}
                                            {key === 'experience' && <Feather name="briefcase" size={20} color={section.score >= 85 ? "#4CAF50" : section.score >= 70 ? "#FF9800" : "#F44336"} />}
                                        </View>
                                        <View style={styles.improvementTitleContainer}>
                                            <Text style={styles.improvementTitle}>{section.title}</Text>
                                            <Text style={styles.improvementSubtitle}>{section.description}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.improvementHeaderRight}>
                                        <View style={[styles.miniScoreBadge, {
                                            backgroundColor: section.score >= 85 ? "#4CAF50" : section.score >= 70 ? "#FF9800" : "#F44336"
                                        }]}>
                                            <Text style={styles.miniScoreBadgeText}>{section.score}</Text>
                                        </View>
                                        <Ionicons
                                            name={improvementExpanded === key ? "chevron-up" : "chevron-down"}
                                            size={20}
                                            color="#fff"
                                        />
                                    </View>
                                </Pressable>

                                {improvementExpanded === key && (
                                    <View style={styles.improvementContent}>
                                        <View style={styles.improvementDivider} />
                                        {section.improvements.map((item, index) => (
                                            <View key={index} style={styles.improvementItem}>
                                                <View style={styles.bulletPoint} />
                                                <Text style={styles.improvementText}>{item}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </LinearGradient>
                        ))}
                    </View>
                );
            case 'sample':
                return (
                    <View style={styles.tabContent}>
                        <Text style={styles.sampleIntro}>
                            Below are examples of how to implement our suggested improvements in your resume.
                        </Text>

                        <LinearGradient
                            colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.03)']}
                            style={styles.sampleCard}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <View style={styles.sampleHeader}>
                                <Text style={styles.sampleTitle}>Before</Text>
                            </View>
                            <View style={styles.sampleContent}>
                                <Text style={styles.sampleText}>
                                    "Responsible for developing mobile applications using React"
                                </Text>
                            </View>
                        </LinearGradient>

                        <View style={styles.arrowContainer}>
                            <Feather name="arrow-down" size={24} color="#C92EFF" />
                        </View>

                        <LinearGradient
                            colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.03)']}
                            style={[styles.sampleCard, styles.highlightCard]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <View style={styles.sampleHeader}>
                                <Text style={styles.sampleTitle}>After</Text>
                            </View>
                            <View style={styles.sampleContent}>
                                <Text style={styles.sampleText}>
                                    "Engineered <Text style={styles.highlightText}>responsive mobile applications using React Native, Redux, and Firebase</Text>, reducing load times by 40% and increasing user engagement by 25%"
                                </Text>
                            </View>
                        </LinearGradient>

                        <Text style={styles.sampleTip}>
                            ✓ Added specific technologies{"\n"}
                            ✓ Used stronger action verb{"\n"}
                            ✓ Included quantifiable results
                        </Text>

                        <TouchableOpacity style={styles.viewMoreButton}>
                            <Text style={styles.viewMoreText}>View More Examples</Text>
                        </TouchableOpacity>
                    </View>
                );
            default:
                return null;
        }
    };

    // Calculate dynamic padding based on screen size
    const dynamicPadding = {
        horizontal: getResponsiveSize(16, 'width'),
        vertical: Math.min(getResponsiveSize(16, 'height'), 20)
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#14011F" />

            {/* Background gradient */}
            <LinearGradient
                colors={['#1D0A3F', '#14011F']}
                style={styles.backgroundGradient}
            />

            {/* Header */}
            <View style={[styles.header, { paddingHorizontal: dynamicPadding.horizontal }]}>
                <Pressable onPress={handleBackPress} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </Pressable>
                <Text style={styles.headerText}>Resume Analysis</Text>
                <View style={{ width: 40 }} /> {/* Empty view for balanced header */}
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            >
                {/* Upload Section */}
                <View style={[styles.uploadSection, { marginHorizontal: dynamicPadding.horizontal }]}>
                    {!resumeFile ? (
                        <LinearGradient
                            colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.03)']}
                            style={styles.uploadArea}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <View style={styles.uploadIconContainer}>
                                <FontAwesome5 name="file-upload" size={28} color="#C92EFF" />
                            </View>
                            <Text style={styles.uploadTitle}>Upload Your Resume</Text>
                            <Text style={styles.uploadText}>
                                Upload your resume to analyze its effectiveness with Applicant Tracking Systems (ATS).
                            </Text>
                            <TouchableOpacity style={styles.uploadButton} onPress={selectResume}>
                                <LinearGradient
                                    colors={['#C92EFF', '#9332FF']}
                                    style={styles.uploadButtonGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <Ionicons name="cloud-upload-outline" size={20} color="#fff" style={styles.uploadButtonIcon} />
                                    <Text style={styles.uploadButtonText}>Select File</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <Text style={styles.supportedText}>Supported formats: PDF</Text>
                        </LinearGradient>
                    ) : (
                        <LinearGradient
                            colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.03)']}
                            style={styles.filePreview}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <View style={styles.fileHeader}>
                                <View style={styles.fileIconContainer}>
                                    <Ionicons
                                        name={resumeFile.name.endsWith('.pdf') ? "document-text" : "document"}
                                        size={28}
                                        color="#C92EFF"
                                    />
                                </View>
                                <View style={styles.fileInfo}>
                                    <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">
                                        {resumeFile.name}
                                    </Text>
                                    <Text style={styles.fileSize}>
                                        {(resumeFile.size / 1024).toFixed(1)} KB
                                    </Text>
                                </View>
                                <TouchableOpacity style={styles.replaceButton} onPress={selectResume}>
                                    <Text style={styles.replaceButtonText}>Replace</Text>
                                </TouchableOpacity>
                            </View>

                            {isAnalyzing ? (
                                <View style={styles.analyzingContainer}>
                                    <ActivityIndicator size="large" color="#C92EFF" />
                                    <Text style={styles.analyzingText}>Analyzing your resume...</Text>
                                </View>
                            ) : null}
                        </LinearGradient>
                    )}
                </View>

                {/* Analysis Results */}
                {!isAnalyzing && atsScore && (
                    <>
                        {/* Tabs */}
                        <View style={styles.tabContainer}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={[styles.tabScroll, { paddingHorizontal: dynamicPadding.horizontal }]}
                                contentContainerStyle={{ paddingRight: dynamicPadding.horizontal }}
                            >
                                {[
                                    { id: 'overview', label: 'Overview', icon: 'pie-chart-outline' },
                                    { id: 'improvements', label: 'Improvements', icon: 'trending-up-outline' },
                                    { id: 'sample', label: 'Examples', icon: 'clipboard-outline' }
                                ].map((tab) => {
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <TouchableOpacity
                                            key={tab.id}
                                            style={[styles.tab, isActive && styles.activeTab]}
                                            onPress={() => setActiveTab(tab.id)}
                                        >
                                            {isActive ? (
                                                <LinearGradient
                                                    colors={['#C92EFF', '#9332FF']}
                                                    style={styles.activeTabGradient}
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 1 }}
                                                >
                                                    <Ionicons name={tab.icon} size={18} color="#fff" style={styles.tabIcon} />
                                                    <Text style={styles.activeTabText}>{tab.label}</Text>
                                                </LinearGradient>
                                            ) : (
                                                <>
                                                    <Ionicons name={tab.icon} size={18} color="#9D9DB5" style={styles.tabIcon} />
                                                    <Text style={styles.tabText}>{tab.label}</Text>
                                                </>
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </View>

                        {/* Tab Content */}
                        <View style={[styles.analysisContainer, { paddingHorizontal: dynamicPadding.horizontal }]}>
                            {renderTabContent()}
                        </View>

                        {/* Action Button */}
                        <View style={[styles.actionContainer, { marginHorizontal: dynamicPadding.horizontal }]}>
                            <TouchableOpacity style={styles.improveButton}>
                                <LinearGradient
                                    colors={['#C92EFF', '#9332FF']}
                                    style={styles.improveButtonGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <Ionicons name="create-outline" size={20} color="#fff" style={styles.improveButtonIcon} />
                                    <Text style={styles.improveButtonText}>Improve My Resume</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#14011F',
    },
    backgroundGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 50 : 10,
        paddingBottom: 16,
        marginTop: 20,
    },
    backButton: {
        padding: 8,
    },
    headerText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 45,
    },
    scrollView: {
        flex: 1,
    },
    uploadSection: {
        marginVertical: 16,
    },
    uploadArea: {
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(201, 46, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    uploadTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 12,
    },
    uploadText: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
    },
    uploadButton: {
        borderRadius: 30,
        overflow: 'hidden',
        shadowColor: '#C92EFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
        marginBottom: 16,
    },
    uploadButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 25,
    },
    uploadButtonIcon: {
        marginRight: 8,
    },
    uploadButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    supportedText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.5)',
    },
    filePreview: {
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    fileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    fileIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(201, 46, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    fileInfo: {
        flex: 1,
    },
    fileName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 4,
    },
    fileSize: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
    },
    replaceButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    replaceButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    analyzingContainer: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    analyzingText: {
        marginTop: 12,
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.7)',
    },
    tabContainer: {
        marginTop: 8,
        marginBottom: 16,
    },
    tabScroll: {
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginRight: 12,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    tabIcon: {
        marginRight: 8,
    },
    activeTab: {
        padding: 0,
        overflow: 'hidden',
    },
    activeTabGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 30,
    },
    tabText: {
        fontSize: 15,
        color: '#9D9DB5',
        fontWeight: '500',
    },
    activeTabText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
    },
    analysisContainer: {
        paddingBottom: 20,
    },
    tabContent: {
        width: '100%',
    },
    scoreRingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        position: 'relative',
    },
    scoreRing: {
    },
    scoreTextContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scoreText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
    },
    scoreLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
    },
    overviewText: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    statsContainer: {
        width: '100%',
    },
    statCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    statTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    scoreBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: '#FF9800',
    },
    scoreBadgeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    statDescription: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
        lineHeight: 20,
    },
    improvementsIntro: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 16,
        lineHeight: 24,
    },
    improvementCard: {
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
    },
    improvementHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    improvementHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    improvementIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    improvementTitleContainer: {
        flex: 1,
    },
    improvementTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 2,
    },
    improvementSubtitle: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.6)',
    },
    improvementHeaderRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    miniScoreBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        marginRight: 8,
    },
    miniScoreBadgeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    improvementContent: {
        padding: 16,
        paddingTop: 0,
    },
    improvementDivider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginBottom: 16,
    },
    improvementItem: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'flex-start',
    },
    bulletPoint: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#C92EFF',
        marginTop: 8,
        marginRight: 12,
    },
    improvementText: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.8)',
        flex: 1,
        lineHeight: 22,
    },
    sampleIntro: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 16,
        lineHeight: 24,
    },
    sampleCard: {
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
    },
    highlightCard: {
        borderColor: 'rgba(201, 46, 255, 0.3)',
    },
    sampleHeader: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    sampleTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    sampleContent: {
        padding: 16,
    },
    sampleText: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: 22,
    },
    highlightText: {
        color: '#C92EFF',
        fontWeight: '500',
    },
    arrowContainer: {
        alignItems: 'center',
        marginVertical: 8,
    },
    sampleTip: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: 16,
        marginBottom: 20,
        lineHeight: 22,
    },
    viewMoreButton: {
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    viewMoreText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    actionContainer: {
        marginTop: 10,
        marginBottom: 30,
    },
    improveButton: {
        borderRadius: 30,
        overflow: 'hidden',
        shadowColor: '#C92EFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    improveButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
    },
    improveButtonIcon: {
        marginRight: 8,
    },
    improveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ResumeUploadScreen