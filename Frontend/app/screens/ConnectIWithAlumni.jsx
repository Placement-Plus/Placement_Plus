import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  FlatList,
  ScrollView,
  SafeAreaView,
  Linking,
} from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
const alumniData = [
  {
    id: '1',
    name: 'Ankush Chatterjee',
    photo: 'ankush.png',
    company: 'Google',
    role: 'Software Engineer',
    batch: '2025',
    experience: '1 years',
    contact: 'ankushchatterje@google.com',
    workCulture: 'Collaborative environment with flexible work hours. Great emphasis on innovation and personal projects. 20% time policy allows working on passion projects.',
    companyPhoto: 'google.png',
    linkedinUrl: 'https://www.linkedin.com/in/ankushchatterjee-profile/',
  },
  {
    id: '2',
    name: 'Shreyansh Gupta',
    photo: 'shreyansh.png',
    company: 'Microsoft',
    role: 'Software Engineer',
    batch: '2026',
    experience: '6 months',
    contact: 'shreyansh@microsoft.com',
    workCulture: 'Fast-paced environment with emphasis on results. Strong ownership culture where everyone is encouraged to think like an owner. Regular team building activities.',
    companyPhoto: 'microsoft.png',
    linkedinUrl: 'https://www.linkedin.com/in/shreyanshgupta001/',
  },
  {
    id: '3',
    name: 'Ishita Gatani',
    photo: 'ishita.png',
    company: 'Apple',
    role: 'Cloud Engineer',
    batch: '2025',
    experience: '1 years',
    contact: 'ishita@apple.com',
    workCulture: 'Strong focus on work-life balance. Hybrid work model with 3 days in office. Great mentorship program for new employees. Quarterly hackathons for creativity.',
    companyPhoto: 'apple.png',
    linkedinUrl: 'https://www.linkedin.com/in/ishita-gattani-951719281/',
  },
  {
    id: '4',
    name: 'Veedanshi Shukla',
    photo: 'veedansi.png',
    company: 'Amazon',
    role: 'Data Scientist',
    batch: '2026',
    experience: '2 months',
    contact: 'veedansi@amazon.com',
    workCulture: 'Fast-paced environment with emphasis on results. Strong ownership culture where everyone is encouraged to think like an owner. Regular team building activities.',
    companyPhoto: 'amazon.png',
    linkedinUrl: 'https://www.linkedin.com/in/veedanshi-shukla-93b783267/', 
  },
  {
    id: '5',
    name: 'Riapreet Kaur',
    photo: 'riapreet.png',
    company: 'Nvidia',
    role: 'Product Manager',
    batch: '2026',
    experience: '4 months',
    contact: 'riapreet@nvidia.com',
    workCulture: 'Strong focus on work-life balance. Hybrid work model with 3 days in office. Great mentorship program for new employees. Quarterly hackathons for creativity.',
    companyPhoto: 'nvidia.png',
    linkedinUrl: 'https://www.linkedin.com/in/riapreet-kaur-a4634825a/',
  },
  {
    id: '6',
    name: 'Vanshika Garg',
    photo: 'vanshika.png',
    company: 'Netflix',
    role: 'Frontend Developer',
    batch: '2026',
    experience: '5 months',
    contact: 'vanshika@netflix.com',
    workCulture: 'Collaborative environment with flexible work hours. Great emphasis on innovation and personal projects. 20% time policy allows working on passion projects.',
    companyPhoto: 'netflix.png',
    linkedinUrl: 'https://www.linkedin.com/in/vanshika-garg-46240525a/', 
  },
  {
    id: '7',
    name: 'Moksh Yadav',
    photo: 'moksh.png',
    company: 'Tech Mahindra',
    role: 'OS Engineer',
    batch: '2026',
    experience: '2 months',
    contact: 'moksh@techmahindra.com',
    workCulture: 'Fast-paced environment with emphasis on results. Strong ownership culture where everyone is encouraged to think like an owner. Regular team building activities.',
    companyPhoto: 'techm.png',
    linkedinUrl: 'https://www.linkedin.com/in/moksh-yadav-24-nitd/', 
  },
];

// Map image names to require statements
const imageMap = {
  'ankush.png': require('@/assets/images/ankush.png'),
  'ishita.png': require('@/assets/images/ishita.png'),
  'veedansi.png': require('@/assets/images/veedansi.png'),
  'riapreet.png': require('@/assets/images/riapreet.png'),
  'vanshika.png': require('@/assets/images/vanshika.png'),
  'shreyansh.png': require('@/assets/images/shreyansh.png'),
  'google.png': require('@/assets/images/google.png'),
  'microsoft.png': require('@/assets/images/microsoft.png'),
  'amazon.png': require('@/assets/images/amazon.png'),
  'apple.png': require('@/assets/images/apple.png'),
  'nvidia.png': require('@/assets/images/nvidia.png'),
  'netflix.png': require('@/assets/images/netflix.png'),
  'techm.png': require('@/assets/images/techm.png'),
  'moksh.png': require('@/assets/images/moksh.png'),
};

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = height * 0.65;

const AlumniPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handlePrevious = () => {
    if (activeIndex > 0) {
      const newIndex = activeIndex - 1;
      setActiveIndex(newIndex);
      flatListRef.current?.scrollToOffset({
        offset: newIndex * CARD_WIDTH,
        animated: true,
      });
    }
  };

  const handleNext = () => {
    if (activeIndex < alumniData.length - 1) {
      const newIndex = activeIndex + 1;
      setActiveIndex(newIndex);
      flatListRef.current?.scrollToOffset({
        offset: newIndex * CARD_WIDTH,
        animated: true,
      });
    }
  };

  const getItemLayout = (_, index) => ({
    length: CARD_WIDTH,
    offset: CARD_WIDTH * index,
    index,
  });

  const handleConnect = (linkedinUrl) => {
    Linking.openURL(linkedinUrl).catch((err) => {
      console.error('Failed to open LinkedIn:', err);
      alert('Failed to open LinkedIn profile. Please check the URL.');
    });
  };

  const DetailItem = ({ icon, label, value }) => (
    <View style={styles.detailItem}>
      <View style={styles.iconBackground}>
        <FontAwesome name={icon} size={16} color="#fff" />
      </View>
      <View style={styles.detailTextContainer}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );

  const renderAlumniCard = ({ item, index }) => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH,
    ];
    
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp',
    });
    
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.7, 1, 0.7],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View 
        style={[
          styles.cardContainer,
          { transform: [{ scale }], opacity }
        ]}
      >
        <ScrollView 
          style={styles.cardScroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            {/* Alumni Header with Photo and Name */}
            <View style={styles.alumniHeader}>
              <Image
                source={imageMap[item.photo]}
                style={styles.alumniPhoto}
                onError={() => console.log('Image failed to load')}
              />
              <View style={styles.headerTextContainer}>
                <Text style={styles.alumniName}>{item.name}</Text>
                <View style={styles.roleContainer}>
                  <MaterialIcons name="work" size={14} color="#f0c5f1" />
                  <Text style={styles.roleText}>{item.role} at {item.company}</Text>
                </View>
                <View style={styles.batchContainer}>
                  <MaterialIcons name="school" size={14} color="#f0c5f1" />
                  <Text style={styles.batchText}>Batch of {item.batch}</Text>
                </View>
              </View>
            </View>

            {/* Company Information Section */}
            <View style={styles.companySection}>
              <View style={styles.companyHeader}>
                <Image 
                  source={imageMap[item.companyPhoto]} 
                  style={styles.companyLogo}
                />
                <Text style={styles.companyName}>{item.company}</Text>
              </View>
              
              <View style={styles.cultureBadge}>
                <MaterialIcons name="stars" size={16} color="#fff" />
                <Text style={styles.cultureLabel}>Work Culture</Text>
              </View>
              
              <Text style={styles.cultureDescription}>{item.workCulture}</Text>
            </View>

            <View style={styles.divider} />

            {/* Alumni Details */}
            <View style={styles.detailsContainer}>
              <DetailItem 
                icon="briefcase" 
                label="Experience" 
                value={item.experience} 
              />
              <DetailItem 
                icon="envelope" 
                label="Contact" 
                value={item.contact} 
              />
              
              {/* Connect Button */}
              <TouchableOpacity 
                style={styles.connectButton}
                onPress={() => handleConnect(item.linkedinUrl)}
              >
                <FontAwesome name="handshake-o" size={16} color="#fff" style={styles.connectIcon} />
                <Text style={styles.connectText}>Connect with {item.name.split(' ')[0]}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#120023" />

      {/* Header with Logo */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
          <Text style={styles.logoText}>Placement Plus</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle" size={32} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Page Title with Indicators */}
      <View style={styles.titleContainer}>
        <View style={styles.indicatorContainer}>
          {alumniData.map((_, i) => (
            <View
              key={i}
              style={[
                styles.indicator,
                { backgroundColor: activeIndex === i ? '#e535f7' : '#555' },
                activeIndex === i && styles.activeIndicator
              ]}
            />
          ))}
        </View>
      </View>

      {/* Alumni Cards Carousel */}
      <FlatList
        ref={flatListRef}
        data={alumniData}
        renderItem={renderAlumniCard}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={styles.carouselContainer}
        onScroll={handleScroll}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        snapToAlignment="center"
        getItemLayout={getItemLayout}
        initialScrollIndex={0}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / CARD_WIDTH);
          setActiveIndex(newIndex);
        }}
      />

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={[
            styles.navButton, 
            { opacity: activeIndex > 0 ? 1 : 0.5 }
          ]}
          onPress={handlePrevious}
          disabled={activeIndex === 0}
          activeOpacity={0.7}
        >
          <FontAwesome name="chevron-left" size={18} color="white" />
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>
        
        <View style={styles.pageIndicator}>
          <Text style={styles.pageText}>{activeIndex + 1}/{alumniData.length}</Text>
        </View>
        
        <TouchableOpacity
          style={[
            styles.navButton, 
            { opacity: activeIndex < alumniData.length - 1 ? 1 : 0.5 }
          ]}
          onPress={handleNext}
          disabled={activeIndex === alumniData.length - 1}
          activeOpacity={0.7}
        >
          <Text style={styles.navButtonText}>Next</Text>
          <FontAwesome name="chevron-right" size={18} color="white" />
        </TouchableOpacity>
      </View>

      {/* Footer with Social Media Icons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="facebook" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="twitter" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="instagram" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="linkedin" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#120023',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: 10,
    paddingBottom: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom:20,
    marginTop:10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    marginRight: 8,
  },
  logoText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  profileButton: {
    padding: 4,
  },
  titleContainer: {
    alignItems: 'center',
    marginVertical: 12,
    paddingHorizontal: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    height: 6,
    width: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  activeIndicator: {
    width: 20,
  },
  carouselContainer: {
    paddingHorizontal: width * 0.075,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardScroll: {
    width: '100%',
    borderRadius: 24,
  },
  card: {
    backgroundColor: '#2c0847',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#e535f7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    width: '100%',
  },
  alumniHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  alumniPhoto: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#e535f7',
  },
  headerTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  alumniName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  roleText: {
    fontSize: 14,
    color: '#f0c5f1',
    marginLeft: 4,
    fontWeight: '500',
  },
  batchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  batchText: {
    fontSize: 14,
    color: '#f0c5f1',
    marginLeft: 4,
    fontWeight: '400',
  },
  companySection: {
    backgroundColor: 'rgba(139, 8, 144, 0.15)',
    borderRadius: 16,
    padding: 12,
    marginVertical: 10,
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  companyLogo: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  cultureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8b0890',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 8,
  },
  cultureLabel: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  cultureDescription: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(254, 254, 254, 0.15)',
    marginVertical: 10,
  },
  detailsContainer: {
    width: '100%',
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  iconBackground: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#8b0890',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#f0c5f1',
    marginBottom: 2,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: 'white',
    fontWeight: '400',
  },
  connectButton: {
    backgroundColor: '#e535f7',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 8,
  },
  connectIcon: {
    marginRight: 8,
  },
  connectText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  navButton: {
    backgroundColor: '#8b0890',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    justifyContent: 'center',
  },
  navButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 4,
  },
  pageIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pageText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  socialButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 8, 144, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
});

export default AlumniPage;