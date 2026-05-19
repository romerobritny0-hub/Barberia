import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { BARBERS } from '../../constants/barbers';

const STATS = [
  { id: 1, label: 'Citas Hoy', value: '12', icon: '📅', color: '#D4AF37' },
  { id: 2, label: 'Barberos', value: '3', icon: '👨‍💼', color: '#4CAF50' },
  { id: 3, label: 'Sillas Activas', value: '4', icon: '🪑', color: '#2196F3' },
  { id: 4, label: 'Ingresos', value: '$2,450', icon: '💰', color: '#9C27B0' },
];

const RECENT_CITAS = [
  { id: 1, cliente: 'Juan Pérez', hora: '10:00 AM', estado: 'completada' },
  { id: 2, cliente: 'María López', hora: '11:00 AM', estado: 'pendiente' },
  { id: 3, cliente: 'Carlos Ruiz', hora: '2:00 PM', estado: 'confirmada' },
  { id: 4, cliente: 'Ana Martínez', hora: '3:00 PM', estado: 'confirmada' },
];

export default function AdminReportes({ navigation }) {
  const [periodo, setPeriodo] = useState('hoy');

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'completada': return '#4CAF50';
      case 'pendiente': return '#FF9800';
      case 'confirmada': return '#2196F3';
      default: return '#888';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={true}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Reportes y Estadísticas</Text>
        </View>

        <View style={styles.periodSelector}>
          {['hoy', 'semana', 'mes'].map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.periodBtn, periodo === p && styles.periodBtnActive]}
              onPress={() => setPeriodo(p)}
            >
              <Text style={[styles.periodText, periodo === p && styles.periodTextActive]}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsGrid}>
          {STATS.map((stat) => (
            <View key={stat.id} style={[styles.statCard, { borderTopColor: stat.color }]}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Próximas Citas</Text>
          {RECENT_CITAS.map((cita) => (
            <View key={cita.id} style={styles.citaItem}>
              <View style={styles.citaInfo}>
                <Text style={styles.citaCliente}>{cita.cliente}</Text>
                <Text style={styles.citaHora}>{cita.hora}</Text>
              </View>
              <View style={[styles.citaEstado, { backgroundColor: getEstadoColor(cita.estado) + '20' }]}>
                <Text style={[styles.citaEstadoText, { color: getEstadoColor(cita.estado) }]}>
                  {cita.estado}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Rendimiento por Barbero</Text>
          <View style={styles.barberStats}>
            {BARBERS.map((barber, i) => (
              <View key={barber.id} style={styles.barberItem}>
                <Text style={styles.barberName}>{barber.nombre}</Text>
                <View style={styles.barberBar}>
                  <View style={[styles.barberFill, { width: `${60 + i * 15}%` }]} />
                </View>
                <Text style={styles.barberValue}>{8 - i} citas</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0E17' },
  content: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 20 },
  backText: { color: '#D4AF37', fontSize: 14, marginBottom: 10 },
  title: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  periodSelector: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  periodBtn: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: '#1C1B29', alignItems: 'center' },
  periodBtnActive: { backgroundColor: '#D4AF37' },
  periodText: { color: '#888', fontWeight: 'bold' },
  periodTextActive: { color: '#0F0E17' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 25 },
  statCard: { width: '47%', backgroundColor: '#1C1B29', borderRadius: 12, padding: 15, alignItems: 'center', borderTopWidth: 4 },
  statIcon: { fontSize: 28, marginBottom: 8 },
  statValue: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  statLabel: { color: '#888', fontSize: 12, marginTop: 4 },
  section: { marginBottom: 25 },
  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  citaItem: { backgroundColor: '#1C1B29', borderRadius: 10, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  citaInfo: {},
  citaCliente: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  citaHora: { color: '#888', fontSize: 12 },
  citaEstado: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  citaEstadoText: { fontSize: 11, fontWeight: 'bold', textTransform: 'capitalize' },
  barberStats: { backgroundColor: '#1C1B29', borderRadius: 12, padding: 15 },
  barberItem: { marginBottom: 12 },
  barberName: { color: '#FFF', fontSize: 14, marginBottom: 6 },
  barberBar: { height: 8, backgroundColor: '#333', borderRadius: 4, marginBottom: 4 },
  barberFill: { height: '100%', backgroundColor: '#D4AF37', borderRadius: 4 },
  barberValue: { color: '#888', fontSize: 12 }
});