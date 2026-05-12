import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Modal, ActivityIndicator, Alert } from 'react-native';
import { fetchCitas, createCita, updateCita, deleteCita } from '../../services/citaService';
import { fetchBarbers } from '../../services/barberService';

const ESTADOS = ['pendiente', 'confirmada', 'completada', 'cancelada'];

export default function AdminCitas({ navigation }) {
  const [citas, setCitas] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCita, setEditingCita] = useState(null);
  const [form, setForm] = useState({ cliente_nombre: '', cliente_telefono: '', barbero_id: '', fecha: '', hora: '', estado: 'pendiente', servicio: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [citasData, barbersData] = await Promise.all([fetchCitas(), fetchBarbers()]);
      setCitas(citasData || []);
      setBarbers(barbersData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ cliente_nombre: '', cliente_telefono: '', barbero_id: '', fecha: '', hora: '', estado: 'pendiente', servicio: '' });
    setEditingCita(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (cita) => {
    setEditingCita(cita);
    setForm({
      cliente_nombre: cita.cliente_nombre,
      cliente_telefono: cita.cliente_telefono || '',
      barbero_id: cita.barbero_id?.toString() || '',
      fecha: cita.fecha,
      hora: cita.hora,
      estado: cita.estado,
      servicio: cita.servicio || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de eliminar esta cita?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: async () => {
          const success = await deleteCita(id);
          if (success) {
            setCitas(citas.filter(c => c.id !== id));
          }
        }}
      ]
    );
  };

  const handleSave = async () => {
    if (!form.cliente_nombre || !form.barbero_id || !form.fecha || !form.hora) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios');
      return;
    }
    
    try {
      const citaData = {
        cliente_nombre: form.cliente_nombre,
        cliente_telefono: form.cliente_telefono || null,
        barbero_id: parseInt(form.barbero_id),
        fecha: form.fecha,
        hora: form.hora,
        estado: form.estado,
        servicio: form.servicio || null
      };
      
      if (editingCita) {
        const data = await updateCita(editingCita.id, citaData);
        if (data) {
          await loadData();
        }
      } else {
        const data = await createCita(citaData);
        if (data) {
          await loadData();
        }
      }
      setShowModal(false);
      resetForm();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la cita');
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente': return '#FF9800';
      case 'confirmada': return '#4CAF50';
      case 'completada': return '#2196F3';
      case 'cancelada': return '#f44336';
      default: return '#888';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Gestionar Citas</Text>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addBtnText}>+ Agregar Cita</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color="#D4AF37" style={styles.loader} />
        ) : citas.length === 0 ? (
          <Text style={styles.emptyText}>No hay citas registradas</Text>
        ) : (
          citas.map((cita) => (
            <View key={cita.id} style={[styles.card, { borderLeftColor: getEstadoColor(cita.estado) }]}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardCliente}>{cita.cliente_nombre}</Text>
                <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(cita.estado) + '20' }]}>
                  <Text style={[styles.estadoText, { color: getEstadoColor(cita.estado) }]}>{cita.estado}</Text>
                </View>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardDetail}>👨‍💼 {cita.barberos?.nombre || 'N/A'}</Text>
                <Text style={styles.cardDetail}>📅 {formatDate(cita.fecha)}</Text>
                <Text style={styles.cardDetail}>🕐 {cita.hora}</Text>
                {cita.servicio && <Text style={styles.cardDetail}>✂️ {cita.servicio}</Text>}
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(cita)}>
                  <Text style={styles.editBtnText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(cita.id)}>
                  <Text style={styles.deleteBtnText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.modalScroll}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{editingCita ? 'Editar Cita' : 'Nueva Cita'}</Text>
              
              <TextInput style={styles.input} placeholder="Nombre del cliente *" placeholderTextColor="#666" value={form.cliente_nombre} onChangeText={(t) => setForm({ ...form, cliente_nombre: t })} />
              <TextInput style={styles.input} placeholder="Teléfono" placeholderTextColor="#666" value={form.cliente_telefono} onChangeText={(t) => setForm({ ...form, cliente_telefono: t })} />
              <TextInput style={styles.input} placeholder="Fecha (YYYY-MM-DD) *" placeholderTextColor="#666" value={form.fecha} onChangeText={(t) => setForm({ ...form, fecha: t })} />
              <TextInput style={styles.input} placeholder="Hora (ej: 10:00 AM) *" placeholderTextColor="#666" value={form.hora} onChangeText={(t) => setForm({ ...form, hora: t })} />
              <TextInput style={styles.input} placeholder="Servicio" placeholderTextColor="#666" value={form.servicio} onChangeText={(t) => setForm({ ...form, servicio: t })} />
              
              <Text style={styles.label}>Barbero *</Text>
              <View style={styles.barberoOptions}>
                {barbers.map((barber) => (
                  <TouchableOpacity
                    key={barber.id}
                    style={[styles.barberoOption, form.barbero_id === barber.id.toString() && styles.barberoOptionSelected]}
                    onPress={() => setForm({ ...form, barbero_id: barber.id.toString() })}
                  >
                    <Text style={[styles.barberoOptionText, form.barbero_id === barber.id.toString() && { color: '#fff' }]}>{barber.nombre}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
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
          </ScrollView>
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
  addBtn: { backgroundColor: '#2196F3', padding: 15, borderRadius: 12, marginBottom: 20 },
  addBtnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  loader: { marginTop: 40 },
  card: { backgroundColor: '#1C1B29', borderRadius: 12, padding: 15, marginBottom: 12, borderLeftWidth: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardCliente: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  estadoBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  estadoText: { fontSize: 11, fontWeight: 'bold', textTransform: 'capitalize' },
  cardBody: { marginBottom: 10 },
  cardDetail: { color: '#888', fontSize: 14, marginBottom: 4 },
  cardActions: { flexDirection: 'row', gap: 10 },
  editBtn: { backgroundColor: '#2196F3', padding: 10, borderRadius: 8 },
  deleteBtn: { backgroundColor: '#ff4444', padding: 10, borderRadius: 8 },
  emptyText: { color: '#666', textAlign: 'center', marginTop: 40 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)' },
  modalScroll: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1C1B29', borderRadius: 16, padding: 24 },
  modalTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#0F0E17', color: '#FFF', padding: 15, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: '#333' },
  label: { color: '#888', fontSize: 14, marginBottom: 8 },
  barberoOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 15 },
  barberoOption: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#0F0E17' },
  barberoOptionSelected: { backgroundColor: '#D4AF37' },
  barberoOptionText: { color: '#888', fontSize: 12 },
  estadoOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  estadoOption: { padding: 10, borderRadius: 8, backgroundColor: '#0F0E17' },
  estadoOptionText: { color: '#888', fontSize: 12, fontWeight: 'bold', textTransform: 'capitalize' },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 10 },
  modalCancelBtn: { flex: 1, backgroundColor: '#333', padding: 14, borderRadius: 10 },
  modalCancelText: { color: '#FFF', textAlign: 'center', fontWeight: 'bold' },
  modalSaveBtn: { flex: 1, backgroundColor: '#D4AF37', padding: 14, borderRadius: 10 },
  modalSaveText: { color: '#0F0E17', textAlign: 'center', fontWeight: 'bold' }
});
