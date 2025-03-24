import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
    TextInput,
    LayoutAnimation,
    Platform,
    UIManager,
    Linking
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getAccessToken, getRefreshToken } from '../../utils/tokenStorage.js';
import * as IntentLauncher from 'expo-intent-launcher';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SubjectMaterials = ({ companyLogo }) => {
    const [subjects, setSubjects] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [filteredSubjects, setFilteredSubjects] = useState([]);
    const [expandedSubjects, setExpandedSubjects] = useState({});

    const filterOptions = ['All', 'Notes', 'Video'];
    const icons = {
        'Operating System': 'laptop',
        'DBMS': 'database',
        'OOPS': 'cubes',
        'Computer Networks': 'sitemap'
    };

    useEffect(() => {
        fetchAllMaterial();
    }, []);

    useEffect(() => {
        let result = subjects;

        if (searchQuery) {
            result = result.map(subject => {
                const filteredMaterials = subject.materials.filter(material =>
                    material?.title?.toLowerCase()?.includes(searchQuery.toLowerCase())
                );

                return {
                    ...subject,
                    materials: filteredMaterials,
                    hasMatchingMaterials: filteredMaterials.length > 0
                };
            }).filter(subject => subject.hasMatchingMaterials ||
                subject.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        // Filter by material type
        if (activeFilter !== 'All') {
            result = result.map(subject => {
                const filteredMaterials = subject.materials.filter(material =>
                    material.type === activeFilter
                );

                return {
                    ...subject,
                    materials: filteredMaterials,
                    hasMatchingMaterials: filteredMaterials.length > 0
                };
            }).filter(subject => subject.hasMatchingMaterials);
        }

        setFilteredSubjects(result);
    }, [searchQuery, activeFilter, subjects]);

    const fetchAllMaterial = async () => {
        try {
            const accessToken = await getAccessToken();
            const refreshToken = await getRefreshToken();

            const response = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:5000/api/v1/cs-fundamentals/get-all-pdf`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "x-refresh-token": refreshToken
                },
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Something went wrong');
            }

            const subjectGroups = {};

            result.data.forEach(item => {
                const subjectName = item.subjectName;

                if (!subjectGroups[subjectName]) {
                    subjectGroups[subjectName] = {
                        id: subjectName.replace(/\s+/g, '-').toLowerCase(),
                        name: subjectName,
                        materials: []
                    };
                }

                subjectGroups[subjectName].materials.push({
                    id: item._id,
                    title: item.fileName,
                    description: item.description,
                    pdfLink: item.pdfLink,
                    type: 'Notes',
                    difficulty: 'Medium'
                });
            });

            const formattedSubjects = Object.values(subjectGroups);

            setSubjects(formattedSubjects);
            setFilteredSubjects(formattedSubjects);

        } catch (error) {
            Alert.alert(
                "Error",
                error.message || "Something went wrong. Please try again.",
                [{ text: "OK" }]
            );
        }
    };

    const openPdf = async (pdfLink) => {
        try {
            const accessToken = await getAccessToken()
            const refreshToken = await getRefreshToken()

            const response = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:5000/api/v1/cs-fundamentals/get-pdf/c/${pdfLink}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken} `,
                    'x-refresh-token': refreshToken
                }
            }
            )

            if (!response.ok) {
                throw new Error(result.message || 'Something went wrong');
            }

            const result = await response.json();

            if (Platform.OS === 'android') {
                IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                    data: result?.data,
                    type: 'application/pdf',
                });
            } else {
                await Linking.openURL(result?.data);
            }

        } catch (error) {
            Alert.alert(
                "Error",
                error.message || "Something went wrong. Please try again.",
                [{ text: "OK" }]
            );
        }
    }

    const toggleExpand = (subjectId) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedSubjects(prev => ({
            ...prev,
            [subjectId]: !prev[subjectId]
        }));
    };

    const getMaterialTypeIcon = (type) => {
        if (!type) return 'file-o';

        switch (type.toLowerCase()) {
            case 'notes':
                return 'file-text-o';
            case 'video':
                return 'play-circle-o';
            case 'quiz':
                return 'question-circle-o';
            default:
                return 'file-o';
        }
    };

    const renderSubjectItem = ({ item }) => {
        const isExpanded = expandedSubjects[item.id] || false;
        const subjectIcon = icons[item.name] || 'folder';

        return (
            <View style={styles.subjectContainer}>
                <TouchableOpacity
                    style={styles.subjectHeader}
                    onPress={() => toggleExpand(item.id)}
                >
                    <View style={styles.subjectTitleContainer}>
                        <FontAwesome name={subjectIcon} size={22} color="#C92EFF" style={styles.subjectIcon} />
                        <Text style={styles.subjectTitle}>{item.name}</Text>
                    </View>
                    <FontAwesome
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={18}
                        color="#fff"
                    />
                </TouchableOpacity>

                {isExpanded && (
                    <View style={styles.materialsContainer}>
                        {Array.isArray(item.materials) && item.materials.length > 0 ? (
                            <FlatList
                                data={item.materials}
                                keyExtractor={(material) => material.id}
                                scrollEnabled={false}
                                ListHeaderComponent={() => (
                                    <View style={styles.tableHeader}>
                                        <Text style={[styles.headerText, styles.col1]}>Material</Text>
                                        <Text style={[styles.headerText, styles.col2]}>Type</Text>
                                        <Text style={[styles.headerText, styles.col3]}></Text>
                                    </View>
                                )}
                                renderItem={({ item: material }) => (
                                    <View>
                                        <View style={styles.materialRow}>
                                            <Text style={[styles.cell, styles.col1]}>{material.title || 'Untitled'}</Text>
                                            <View style={styles.col2}>
                                                <FontAwesome
                                                    name={getMaterialTypeIcon(material.type)}
                                                    size={18}
                                                    color="#C92EFF"
                                                    style={styles.materialIcon}
                                                />
                                            </View>
                                            <TouchableOpacity onPress={() => openPdf(material?.pdfLink)}>
                                                <Text style={[styles.openButton, styles.col3]}>Open</Text>
                                            </TouchableOpacity>
                                        </View>
                                        {material.description && (
                                            <View style={styles.materialDescriptionContainer}>
                                                <Text style={styles.materialDescriptionText}>{material.description}</Text>
                                            </View>
                                        )}
                                    </View>
                                )}
                            />
                        ) : (
                            <View style={styles.emptyMaterials}>
                                <Text style={styles.emptyText}>No materials match your filters</Text>
                            </View>
                        )}
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Learning Materials</Text>
                <Image source={companyLogo} style={styles.logo} />
            </View>

            <View style={styles.searchFilterContainer}>
                <View style={styles.searchContainer}>
                    <FontAwesome name="search" size={18} color="#C92EFF" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search materials..."
                        placeholderTextColor="#8a8a8a"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <View style={styles.filterContainer}>
                    <FlatList
                        data={filterOptions}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.filterOption,
                                    activeFilter === item && styles.activeFilterOption
                                ]}
                                onPress={() => setActiveFilter(item)}
                            >
                                <Text
                                    style={[
                                        styles.filterText,
                                        activeFilter === item && styles.activeFilterText
                                    ]}
                                >
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>

            {filteredSubjects.length > 0 ? (
                <FlatList
                    data={filteredSubjects}
                    keyExtractor={(item) => item.id}
                    renderItem={renderSubjectItem}
                    contentContainerStyle={styles.subjectsList}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <FontAwesome name="search" size={60} color="#C92EFF" style={styles.emptyIcon} />
                    <Text style={styles.emptyTitle}>No Subjects Found</Text>
                    <Text style={styles.emptyMessage}>
                        We couldn't find any subjects that match your search criteria.
                        Try adjusting your filters or search query.
                    </Text>
                    <TouchableOpacity
                        style={styles.resetButton}
                        onPress={() => {
                            setSearchQuery('');
                            setActiveFilter('All');
                        }}
                    >
                        <Text style={styles.resetButtonText}>Reset Filters</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
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
    searchFilterContainer: {
        marginBottom: 15,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 10,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 44,
        color: '#fff',
        fontSize: 16,
    },
    filterContainer: {
        marginVertical: 10,
    },
    filterOption: {
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
    activeFilterOption: {
        backgroundColor: "#C92EFF",
    },
    filterText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    activeFilterText: {
        fontWeight: 'bold',
    },
    subjectsList: {
        paddingBottom: 20,
    },
    subjectContainer: {
        marginBottom: 15,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    subjectHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    subjectTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    subjectIcon: {
        marginRight: 10,
    },
    subjectTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    materialsContainer: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
        paddingBottom: 10,
    },
    tableHeader: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    headerText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "left",
    },
    materialRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    cell: {
        color: "#fff",
        fontSize: 15,
    },
    materialIcon: {
        textAlign: "center",
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
    col1: { flex: 2, paddingRight: 10 },
    col2: { flex: 0.8, alignItems: "center" },
    col3: { flex: 1, alignItems: "center" },
    emptyMaterials: {
        padding: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    materialDescriptionContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'rgba(201, 46, 255, 0.05)',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        marginHorizontal: 16,
        marginBottom: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(201, 46, 255, 0.2)',
    },
    materialDescriptionText: {
        color: '#d0d0d0',
        fontSize: 13,
        lineHeight: 18,
        fontWeight: '400',
    },
    openButton: {
        backgroundColor: '#C92EFF',
        color: '#fff',
        fontWeight: '500',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 4,
        textAlign: 'center',
        overflow: 'hidden',
        fontSize: 14
    },
    emptyText: {
        color: '#8a8a8a',
        fontSize: 16,
        textAlign: 'center',
    },
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
    resetButton: {
        backgroundColor: "#C92EFF",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        elevation: 5,
    },
    resetButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default SubjectMaterials;