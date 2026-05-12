import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Modal, ActivityIndicator, Alert } from 'react-native';
import { fetchSillas, createSilla, updateSilla, deleteSilla } from '../../services/sillaService';

const ESTADOS = ['disponible', 'ocupada', 'mantenimiento'];

export default function AdminSillas({ navigation }) {
  const [sillas, setSillas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSilla, setEditingSilla] = useState(null);
  const [form, setForm] = useState({ numero: '', ubicacion: '', estado: 'disponible' });

  useEffect(() => {
    loadSillas();
  }, []);

  const loadSillas = async () => {
    try {
      const data = await fetchSillas();
      setSillas(data || []);
    } catch (error) {
      console.error('Error loading sillas:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ numero: '', ubicacion: '', estado: 'disponible' });
    setEditingSilla(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (silla) => {
    setEditingSilla(silla);
    setForm({ numero: silla.numero.toString(), ubicacion: silla.ubicacion, estado: silla.estado });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de eliminar esta silla?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: async () => {
          const success = await deleteSilla(id);
          if (success) {
            setSillas(sillas.filter(s => s.id !== id));
          }
        }}
      ]
    );
  };

  const handleSave = async () => {
    if (!form.numero || !form.ubicacion) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios');
      return;
    }
    
    try {
      const sillaData = { numero: parseInt(form.numero), ubicacion: form.ubicacion, estado: form.estado };
      
      if (editingSilla) {
        const data = await updateSilla(editingSilla.id, sillaData);
        if (data) {
          setSillas(sillas.map(s => s.id === editingSilla.id ? { ...s, ...sillaData } : s));
        }
      } else {
        const data = await createSilla(sillaData);
        if (data) {
          await loadSillas();
        }
      }
      setShowModal(false);
      resetForm();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la silla');
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'disponible': return '#4CAF50';
      case 'ocupada': return '#FF9800';
      case 'mantenimiento': return '#f44336';
      default: return '#888';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Gestionar Sillas</Text>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addBtnText}>+ Agregar Silla</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color="#D4AF37" style={styles.loader} />
        ) : sillas.length === 0 ? (
          <Text style={styles.emptyText}>No hay sillas registradas</Text>
        ) : (
          <View style={styles.grid}>
            {sillas.map((silla) => (
              <View key={silla.id} style={[styles.sillaCard, { borderLeftColor: getEstadoColor(silla.estado) }]}>
                <View style={styles.sillaHeader}>
                  <View style={[styles.statusDot, { backgroundColor: getEstadoColor(silla.estado) }]} />
                  <Text style={styles.sillaNumero}>Silla #{silla.numero}</Text>
                </View>
                <Text style={styles.sillaUbicacion}>{silla.ubicacion}</Text>
                <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(silla.estado) + '20' }]}>
                  <Text style={[styles.estadoText, { color: getEstadoColor(silla.estado) }]}>{silla.estado}</Text>
                </View>
                <View style={styles.sillaActions}>
                  <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(silla)}>
                    <Text style={styles.editBtnText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(silla.id)}>
                    <Text style={styles.deleteBtnText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingSilla ? 'Editar Silla' : 'Nueva Silla'}</Text>
            
            <TextInput style={styles.input} placeholder="Número" placeholderTextColor="#666" keyboardType="numeric" value={form.numero} onChangeText={(t) => setForm({ ...form, numero: t })} />
            <TextInput style={styles.input} placeholder="Ubicación" placeholderTextColor="#666" value={form.ubicacion} onChangeText={(t) => setForm({ ...form, ubicacion: t })} />
            
            <Text style={styles.label}>Estado</Text>
            <View style={styles.estadoOptions}>
              {ESTADOS.map((estado) => (
                <TouchableOpacity
                  key={estado}
                  style={[styles.estadoOption, form.estado === estado && { backgroundColor: getEstadoColor(estado) }]}
                  onPress={() => setForm({ ...form, estado })}
                >
                  <Text style={[styles.estadoOptionText, form.estado === estado && { color: '#fff' }]}>{estado}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => { setShowModal(false); resetForm(); }}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSave}>
                <Text style={styles.modalSaveText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0E17' },
  content: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 20 },
  backText: { color: '#D4AF37', fontSize: 14, marginBottom: 10 },
  title: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  addBtn: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 12, marginBottom: 20 },
  addBtnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  loader: { marginTop: 40 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  sillaCard: { backgroundColor: '#1C1B29', borderRadius: 12, padding: 15, width: '47%', borderLeftWidth: 4 },
  sillaHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  sillaNumero: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  sillaUbicacion: { color: '#888', fontSize: 12, marginBottom: 10 },
  estadoBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 10 },
  estadoText: { fontSize: 11, fontWeight: 'bold', textTransform: 'capitalize' },
  sillaActions: { flexDirection: 'row', gap: 8 },
  editBtn: { backgroundColor: '#2196F3', padding: 8, borderRadius: 6 },
  deleteBtn: { backgroundColor: '#ff4444', padding: 8, borderRadius: 6 },
  emptyText: { color: '#666', textAlign: 'center', marginTop: 40 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1C1B29', borderRadius: 16, padding: 24 },
  modalTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#0F0E17', color: '#FFF', padding: 15, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: '#333' },
  label: { color: '#888', fontSize: 14, marginBottom: 8 },
  estadoOptions: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  estadoOption: { flex: 1, padding: 12, borderRadius: 8, backgroundColor: '#0F0E17', alignItems: 'center' },
  estadoOptionText: { color: '#888', fontSize: 12, fontWeight: 'bold', textTransform: 'capitalize' },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 10 },
  modalCancelBtn: { flex: 1, backgroundColor: '#333', padding: 14, borderRadius: 10 },
  modalCancelText: { color: '#FFF', textAlign: 'center', fontWeight: 'bold' },
  modalSaveBtn: { flex: 1, backgroundColor: '#4CAF50', padding: 14, borderRadius: 10 },
  modalSaveText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' }
});
