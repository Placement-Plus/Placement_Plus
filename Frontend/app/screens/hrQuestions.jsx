import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    StatusBar,
    FlatList,
    TextInput,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { getAccessToken, getRefreshToken } from '../../utils/tokenStorage.js';

const HRQuestionsScreen = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {

            const accessToken = await getAccessToken()
            const refreshToken = await getRefreshToken()

            const response = await fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:5000/api/v1/hr-questions/get-all-questions`, {
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

            setQuestions(result.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching questions:', error);
            setLoading(false);
        }
    };

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Policies':
                return 'file-text-o';
            case 'Performance':
                return 'line-chart';
            case 'Benefits':
                return 'medkit';
            default:
                return 'question-circle-o';
        }
    };

    const filterOptions = ['All', 'Policies', 'Performance', 'Benefits'];

    const filteredQuestions = questions.filter(item =>
        (activeFilter === 'All' || item.category === activeFilter) &&
        (item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#C92EFF" />
                <Text style={[styles.emptyText, { marginTop: 15 }]}>Loading HR Questions...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1a012c" />

            <View style={styles.headerContainer}>
                <Text style={styles.header}>HR Knowledge Base</Text>
                {/* <Image
                    source={require('@/assets/images/logo.png')}  // Replace with your actual logo path
                    style={styles.logo}
                /> */}
            </View>

            <View style={styles.searchFilterContainer}>
                <View style={styles.searchContainer}>
                    <FontAwesome name="search" size={20} color="#C92EFF" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search questions..."
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterContainer}
                >
                    {filterOptions.map(option => (
                        <TouchableOpacity
                            key={option}
                            style={[
                                styles.filterOption,
                                activeFilter === option && styles.activeFilterOption
                            ]}
                            onPress={() => setActiveFilter(option)}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    activeFilter === option && styles.activeFilterText
                                ]}
                            >
                                {option}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {filteredQuestions.length > 0 ? (
                <FlatList
                    data={filteredQuestions}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.subjectsList}
                    renderItem={({ item }) => (
                        <View style={styles.subjectContainer}>
                            <TouchableOpacity
                                style={styles.subjectHeader}
                                onPress={() => toggleExpand(item._id)}
                            >
                                <View style={styles.subjectTitleContainer}>
                                    <FontAwesome
                                        name={getCategoryIcon(item.category)}
                                        size={22}
                                        color="#C92EFF"
                                        style={styles.subjectIcon}
                                    />
                                    <Text style={styles.subjectTitle}>{item.question}</Text>
                                </View>
                                <FontAwesome
                                    name={expandedId === item._id ? 'chevron-up' : 'chevron-down'}
                                    size={18}
                                    color="#fff"
                                />
                            </TouchableOpacity>

                            {expandedId === item._id && (
                                <View style={styles.materialsContainer}>
                                    <View style={styles.materialRow}>
                                        <Text style={[styles.cell, { flex: 1 }]}>{item.answer}</Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    )}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <FontAwesome
                                name="search"
                                size={60}
                                color="rgba(255, 255, 255, 0.3)"
                                style={styles.emptyIcon}
                            />
                            <Text style={styles.emptyTitle}>No Questions Found</Text>
                            <Text style={styles.emptyMessage}>
                                Try adjusting your search or select a different category filter
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
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <FontAwesome
                        name="search"
                        size={60}
                        color="rgba(255, 255, 255, 0.3)"
                        style={styles.emptyIcon}
                    />
                    <Text style={styles.emptyTitle}>No Questions Found</Text>
                    <Text style={styles.emptyMessage}>
                        Try adjusting your search or select a different category filter
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
        </SafeAreaView>
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
        marginTop: 15
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
        flex: 1,
    },
    subjectIcon: {
        marginRight: 10,
    },
    subjectTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
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
        lineHeight: 22,
    },
    materialIcon: {
        textAlign: "center",
    },
    materialDescriptionContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'rgba(201, 46, 255, 0.05)',
        marginHorizontal: 15,
        marginBottom: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(201, 46, 255, 0.2)',
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
        fontSize: 14,
        alignSelf: 'flex-start',
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
        minHeight: 300,
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

export default HRQuestionsScreen;