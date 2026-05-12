import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, ScrollView, useWindowDimensions, ActivityIndicator } from 'react-native';
import { BARBERS } from '../constants/barbers';
import { fetchBarbers } from '../services/barberService';

function BarberCard({ barber, onPress, cardWidth }) {
  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.imageContainer}>
        {barber.imagen ? (
          <Image source={{ uri: barber.imagen }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>{barber.nombre?.charAt(0) || '?'}</Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{barber.nombre}</Text>
        <Text style={styles.specialty} numberOfLines={1}>{barber.especialidad}</Text>
      </View>
      <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.8}>
        <Text style={styles.btnText}>AGENDAR</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const numColumns = width < 400 ? 1 : width < 768 ? 2 : 3;
  const cardWidth = (width - 40 - (numColumns - 1) * 12) / numColumns;

  useEffect(() => {
    loadBarbers();
  }, []);

  const loadBarbers = async () => {
    try {
      const data = await fetchBarbers();
      if (data && data.length > 0) {
        setBarbers(data);
      } else {
        setBarbers(BARBERS);
      }
    } catch (error) {
      console.error('Error loading barbers:', error);
      setBarbers(BARBERS);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>TAUROS BARBERÍA</Text>
      <Text style={styles.subtitle}>SISTEMA DE GESTIÓN DE TURNOS</Text>

      <TouchableOpacity style={styles.adminBtn} onPress={() => navigation.navigate('AdminLogin')}>
        <Text style={styles.adminBtnText}>🔐 ACCESO ADMINISTRATIVO</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D4AF37" />
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollContainer} 
          contentContainerStyle={[styles.gridContainer, { paddingBottom: 20 }]}
          showsVerticalScrollIndicator={false}
        >
          {barbers.map((barber) => (
            <BarberCard
              key={barber.id}
              barber={barber}
              onPress={() => navigation.navigate('BarberDetail', { barber })}
              cardWidth={cardWidth}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0E17',
    padding: 20
  },
  title: {
    color: '#D4AF37',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40
  },
  subtitle: {
    color: '#888',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 1
  },
  adminBtn: {
    backgroundColor: '#1C1B29',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    marginBottom: 20,
    alignSelf: 'center'
  },
  adminBtnText: {
    color: '#D4AF37',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  scrollContainer: { flex: 1 },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  card: {
    backgroundColor: '#1C1B29',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 4,
    borderTopColor: '#D4AF37',
    marginBottom: 12,
    boxShadow: '0 4px 12px rgba(212, 175, 55, 0.15)'
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1 / 1.2,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#2A2940'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2A2940'
  },
  placeholderText: {
    color: '#D4AF37',
    fontSize: 36,
    fontWeight: 'bold'
  },
  content: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10
  },
  name: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4
  },
  specialty: {
    color: '#D4AF37',
    fontSize: 11,
    textAlign: 'center',
    opacity: 0.9
  },
  btn: {
    backgroundColor: '#D4AF37',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 8,
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)'
  },
  btnText: {
    color: '#0F0E17',
    fontWeight: 'bold',
    fontSize: 11,
    letterSpacing: 0.5
  }
});
