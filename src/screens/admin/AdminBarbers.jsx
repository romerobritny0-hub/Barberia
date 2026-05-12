import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Modal, Image, ActivityIndicator, Alert } from 'react-native';
import { fetchBarbers, createBarber, updateBarber, deleteBarber } from '../../services/barberService';

export default function AdminBarbers({ navigation }) {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBarber, setEditingBarber] = useState(null);
  const [form, setForm] = useState({ nombre: '', especialidad: '', imagen: '' });

  useEffect(() => {
    loadBarbers();
  }, []);

  const loadBarbers = async () => {
    try {
      const data = await fetchBarbers();
      setBarbers(data || []);
    } catch (error) {
      console.error('Error loading barbers:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ nombre: '', especialidad: '', imagen: '' });
    setEditingBarber(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (barber) => {
    setEditingBarber(barber);
    setForm({ nombre: barber.nombre, especialidad: barber.especialidad, imagen: barber.imagen || '' });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de eliminar este barbero?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: async () => {
          const success = await deleteBarber(id);
          if (success) {
            setBarbers(barbers.filter(b => b.id !== id));
          }
        }}
      ]
    );
  };

  const handleSave = async () => {
    if (!form.nombre || !form.especialidad) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios');
      return;
    }
    
    try {
      if (editingBarber) {
        const data = await updateBarber(editingBarber.id, form);
        if (data) {
          setBarbers(barbers.map(b => b.id === editingBarber.id ? { ...b, ...form } : b));
        }
      } else {
        const data = await createBarber(form);
        if (data) {
          await loadBarbers();
        }
      }
      setShowModal(false);
      resetForm();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el barbero');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Gestionar Barberos</Text>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addBtnText}>+ Agregar Barbero</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color="#D4AF37" style={styles.loader} />
        ) : barbers.length === 0 ? (
          <Text style={styles.emptyText}>No hay barberos registrados</Text>
        ) : (
          barbers.map((barber) => (
            <View key={barber.id} style={styles.card}>
              {barber.imagen ? (
                <Image source={{ uri: barber.imagen }} style={styles.cardImage} />
              ) : (
                <View style={styles.cardImagePlaceholder}>
                  <Text style={styles.cardImagePlaceholderText}>{barber.nombre?.charAt(0) || '?'}</Text>
                </View>
              )}
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{barber.nombre}</Text>
                <Text style={styles.cardSpecialty}>{barber.especialidad}</Text>
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(barber)}>
                  <Text style={styles.editBtnText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(barber.id)}>
                  <Text style={styles.deleteBtnText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingBarber ? 'Editar Barbero' : 'Nuevo Barbero'}</Text>
            
            <TextInput style={styles.input} placeholder="Nombre" placeholderTextColor="#666" value={form.nombre} onChangeText={(t) => setForm({ ...form, nombre: t })} />
            <TextInput style={styles.input} placeholder="Especialidad" placeholderTextColor="#666" value={form.especialidad} onChangeText={(t) => setForm({ ...form, especialidad: t })} />
            <TextInput style={styles.input} placeholder="URL de imagen" placeholderTextColor="#666" value={form.imagen} onChangeText={(t) => setForm({ ...form, imagen: t })} />
            
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
  addBtn: { backgroundColor: '#D4AF37', padding: 15, borderRadius: 12, marginBottom: 20 },
  addBtnText: { color: '#0F0E17', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  loader: { marginTop: 40 },
  card: { backgroundColor: '#1C1B29', borderRadius: 12, padding: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cardImage: { width: 60, height: 60, borderRadius: 30 },
  cardImagePlaceholder: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#2A2940', justifyContent: 'center', alignItems: 'center' },
  cardImagePlaceholderText: { color: '#D4AF37', fontSize: 24, fontWeight: 'bold' },
  cardInfo: { flex: 1, marginLeft: 15 },
  cardName: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  cardSpecialty: { color: '#D4AF37', fontSize: 12 },
  cardActions: { flexDirection: 'row', gap: 10 },
  editBtn: { backgroundColor: '#2196F3', padding: 10, borderRadius: 8 },
  deleteBtn: { backgroundColor: '#ff4444', padding: 10, borderRadius: 8 },
  emptyText: { color: '#666', textAlign: 'center', marginTop: 40 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1C1B29', borderRadius: 16, padding: 24 },
  modalTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#0F0E17', color: '#FFF', padding: 15, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: '#333' },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 10 },
  modalCancelBtn: { flex: 1, backgroundColor: '#333', padding: 14, borderRadius: 10 },
  modalCancelText: { color: '#FFF', textAlign: 'center', fontWeight: 'bold' },
  modalSaveBtn: { flex: 1, backgroundColor: '#D4AF37', padding: 14, borderRadius: 10 },
  modalSaveText: { color: '#0F0E17', textAlign: 'center', fontWeight: 'bold' }
});
