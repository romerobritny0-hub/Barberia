import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, ScrollView, useWindowDimensions, SafeAreaView } from 'react-native';
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
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{barber.nombre}</Text>
        <Text style={styles.specialty}>{barber.especialidad}</Text>
        <TouchableOpacity style={styles.btn} onPress={onPress}>
          <Text style={styles.btnText}>AGENDAR</Text>
        </TouchableOpacity>
      </View>
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
      setBarbers(data || []);
    } catch (err) {
      console.error('Error loading barbers:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>TAUROS BARBERÍA</Text>
      <Text style={styles.subtitle}>SISTEMA DE GESTIÓN DE TURNOS</Text>

      <TouchableOpacity style={styles.adminBtn} onPress={() => navigation.navigate('AdminLogin')}>
        <Text style={styles.adminBtnText}>🔐 ACCESO ADMINISTRATIVO</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando barberos...</Text>
        </View>
      ) : barbers.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>No hay barberos disponibles</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollContainer} 
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={true}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0E17',
    padding: 20
  },
  scrollContainer: {
    flex: 1
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
    alignItems: 'center',
    minHeight: 200
  },
  loadingText: {
    color: '#D4AF37',
    fontSize: 16,
    marginTop: 10
  },
  errorText: {
    color: '#ff4444',
    fontSize: 18,
    fontWeight: 'bold'
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20
  },
  card: {
    backgroundColor: '#1C1B29',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 4,
    borderTopColor: '#D4AF37',
    marginBottom: 12
  },
  imageContainer: {
    width: '70%',
    aspectRatio: 1 / 1.2,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#2A2940',
    alignSelf: 'center'
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
  infoContainer: {
    width: '100%',
    paddingTop: 10,
    alignItems: 'center'
  },
  name: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  specialty: {
    color: '#D4AF37',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4
  },
  btn: {
    backgroundColor: '#D4AF37',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 12,
    width: '100%'
  },
  btnText: {
    color: '#0F0E17',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center'
  }
});