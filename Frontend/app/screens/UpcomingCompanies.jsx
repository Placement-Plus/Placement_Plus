import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import companiesData from '../companies.json';

// Map image names to require statements
const imageMap = {
  'apple.png': require('@/assets/images/apple.png'),
  'google.png': require('@/assets/images/google.png'),
  'microsoft.png': require('@/assets/images/microsoft.png'),
  'amazon.png': require('@/assets/images/amazon.png'),
  'meta.png': require('@/assets/images/meta.png'),
  'netflix.png': require('@/assets/images/netflix.png'),
  'nvidia.png': require('@/assets/images/nvidia.png'),
};

const App = () => {
  const [companies, setCompanies] = useState(companiesData?.companies || []);
  const [currentIndex, setCurrentIndex] = useState(0);

  const showNextCompany = () => {
    if (currentIndex < companies.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const showPreviousCompany = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const renderCompanyCard = () => {
    const item = companies[currentIndex];
    return (
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.companyHeader}>
            <Image
              source={imageMap[item.photo]}
              style={styles.image}
              onError={() => console.log('Image failed to load')}
            />
            <View style={styles.headerTextContainer}>
              <Text style={styles.companyName}>{item.name}</Text>
              <Text style={styles.poc}>POC: {item.poc}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsContainer}>
            <DetailItem icon="graduation-cap" label="Eligible Branches" value={item.eligibleBranches.join(', ')} />
            <DetailItem icon="check-circle" label="Eligibility Criteria" value={item.eligibilityCriteria} />
            <DetailItem icon="money" label="Stipend/CTC" value={item.stipendCTC} />
            <DetailItem icon="list-ol" label="No. of Rounds" value={item.noOfRounds} />
            <DetailItem icon="calendar" label="Assessment Dates" value={item.assessmentInterviewDates} />
          </View>
        </View>
      </View>
    );
  };

  const DetailItem = ({ icon, label, value }) => (
    <View style={styles.detailItem}>
      <FontAwesome name={icon} size={18} color="#f0c5f1" style={styles.detailIcon} />
      <View style={styles.detailTextContainer}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );

  if (companies.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a012c" />

      {/* Header with Logo */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
          <Text style={styles.logoText}>Placement Plus</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle" size={35} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Page Title */}
      <View style={styles.titleContainer}>
        {/* <Text style={styles.titleText}>Upcoming Companies</Text> */}
        <View style={styles.indicatorContainer}>
          {companies.map((_, i) => (
            <View
              key={i}
              style={[
                styles.indicator,
                { backgroundColor: currentIndex === i ? '#8b0890' : '#555' },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Company Card */}
      {renderCompanyCard()}

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={[styles.navButton, { opacity: currentIndex > 0 ? 1 : 0.5 }]}
          onPress={showPreviousCompany}
          disabled={currentIndex === 0}
        >
          <FontAwesome name="chevron-left" size={20} color="white" />
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButton, { opacity: currentIndex < companies.length - 1 ? 1 : 0.5 }]}
          onPress={showNextCompany}
          disabled={currentIndex === companies.length - 1}
        >
          <Text style={styles.navButtonText}>Next</Text>
          <FontAwesome name="chevron-right" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Footer with Social Media Icons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="facebook" size={22} color="#3b5998" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="twitter" size={22} color="#1da1f2" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="instagram" size={22} color="#e1306c" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="linkedin" size={22} color="#0077b5" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a012c',
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1a012c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: 10,
    paddingBottom: 2,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginRight: 10,
  },
  logoText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileButton: {
    padding: 5,
  },
  titleContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 1,
  },
  indicator: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#1a012c',
    borderRadius: 16,
    padding: 20,
    shadowColor: 'rgb(247, 3, 255)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 15,
    elevation: 5,
    width: '90%',
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'white',
  },
  headerTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  companyName: {
    fontSize: 29,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'smonospace',
  },
  poc: {
    fontSize: 14,
    color: '#f0c5f1',
    marginTop: 5,
    fontWeight: 'bold',
    fontFamily: 'smonospace',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(254, 254, 254, 0.2)',
    marginVertical: 15,
  },
  detailsContainer: {
    width: '100%',
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  detailIcon: {
    marginRight: 10,
    marginTop: 3,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#f0c5f1',
    marginBottom: 3,
    fontFamily: 'smonospace',
  },
  detailValue: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'smonospace',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  navButton: {
    backgroundColor: '#8b0890',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    justifyContent: 'center',
    width: '45%',
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  socialButton: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
});

export default App;