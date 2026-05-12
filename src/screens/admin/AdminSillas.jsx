import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Modal, ActivityIndicator } from 'react-native';
import { fetchSillas, createSilla, updateSilla, deleteSilla } from '../../services/sillaService';

const ESTADOS = ['disponible', 'ocupada', 'mantenimiento'];

function NotificationModal({ visible, type, message, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.notificationOverlay}>
        <View style={[styles.notificationContent, type === 'success' ? styles.successBg : styles.errorBg]}>
          <Text style={styles.notificationIcon}>{type === 'success' ? '✓' : '✕'}</Text>
          <Text style={styles.notificationText}>{message}</Text>
          <TouchableOpacity style={styles.notificationBtn} onPress={onClose}>
            <Text style={styles.notificationBtnText}>Aceptar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function ConfirmModal({ visible, title, message, onConfirm, onCancel }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.notificationOverlay}>
        <View style={styles.confirmContent}>
          <Text style={styles.confirmTitle}>{title}</Text>
          <Text style={styles.confirmMessage}>{message}</Text>
          <View style={styles.confirmButtons}>
            <TouchableOpacity style={styles.confirmCancelBtn} onPress={onCancel}>
              <Text style={styles.confirmCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmOkBtn} onPress={onConfirm}>
              <Text style={styles.confirmOkText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function AdminSillas({ navigation }) {
  const [sillas, setSillas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSilla, setEditingSilla] = useState(null);
  const [form, setForm] = useState({ numero: '', ubicacion: '', estado: 'disponible' });
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ visible: false, type: '', message: '' });
  const [confirmDelete, setConfirmDelete] = useState({ visible: false, id: null });

  useEffect(() => {
    loadSillas();
  }, []);

  const loadSillas = async () => {
    try {
      setLoading(true);
      const data = await fetchSillas();
      setSillas(data || []);
    } catch (error) {
      showNotification('error', 'Error al cargar sillas');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ visible: true, type, message });
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

  const handleDeletePress = (id) => {
    setConfirmDelete({ visible: true, id });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteSilla(confirmDelete.id);
      await loadSillas();
      setConfirmDelete({ visible: false, id: null });
      showNotification('success', 'Silla eliminada correctamente');
    } catch (error) {
      setConfirmDelete({ visible: false, id: null });
      showNotification('error', 'Error al eliminar silla');
    }
  };

  const handleSave = async () => {
    if (!form.numero || !form.ubicacion) {
      showNotification('error', 'Completa todos los campos');
      return;
    }
    
    try {
      setSaving(true);
      const sillaData = { numero: parseInt(form.numero), ubicacion: form.ubicacion, estado: form.estado };
      
      if (editingSilla) {
        await updateSilla(editingSilla.id, sillaData);
      } else {
        await createSilla(sillaData);
      }
      await loadSillas();
      setShowModal(false);
      resetForm();
      showNotification('success', editingSilla ? 'Silla actualizada' : 'Silla creada correctamente');
    } catch (error) {
      showNotification('error', 'Error al guardar silla');
    } finally {
      setSaving(false);
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
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeletePress(silla.id)}>
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
            
            <TextInput style={styles.input} placeholder="Número *" placeholderTextColor="#666" keyboardType="numeric" value={form.numero} onChangeText={(t) => setForm({ ...form, numero: t })} />
            <TextInput style={styles.input} placeholder="Ubicación *" placeholderTextColor="#666" value={form.ubicacion} onChangeText={(t) => setForm({ ...form, ubicacion: t })} />
            
            <Text style={styles.label}>Estado</Text>
            <View style={styles.estadoOptions}>
              {ESTADOS.filter(e => editingSilla ? e !== 'ocupada' : true).map((estado) => (
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
              <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSave} disabled={saving}>
                <Text style={styles.modalSaveText}>{saving ? 'Guardando...' : 'Guardar'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <NotificationModal
        visible={notification.visible}
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ ...notification, visible: false })}
      />

      <ConfirmModal
        visible={confirmDelete.visible}
        title="Confirmar eliminación"
        message="¿Estás seguro de eliminar esta silla?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDelete({ visible: false, id: null })}
      />
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
  modalSaveText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  notificationOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  notificationContent: { backgroundColor: '#1C1B29', borderRadius: 16, padding: 30, width: '100%', maxWidth: 320, alignItems: 'center' },
  successBg: { borderTopWidth: 4, borderTopColor: '#4CAF50' },
  errorBg: { borderTopWidth: 4, borderTopColor: '#ff4444' },
  notificationIcon: { fontSize: 48, marginBottom: 15, color: '#D4AF37' },
  notificationText: { color: '#FFF', fontSize: 16, textAlign: 'center', marginBottom: 20 },
  notificationBtn: { backgroundColor: '#D4AF37', paddingHorizontal: 40, paddingVertical: 12, borderRadius: 10 },
  notificationBtnText: { color: '#0F0E17', fontWeight: 'bold', fontSize: 16 },
  confirmContent: { backgroundColor: '#1C1B29', borderRadius: 16, padding: 30, width: '100%', maxWidth: 320 },
  confirmTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  confirmMessage: { color: '#AAA', fontSize: 14, textAlign: 'center', marginBottom: 25 },
  confirmButtons: { flexDirection: 'row', gap: 12 },
  confirmCancelBtn: { flex: 1, backgroundColor: '#333', padding: 14, borderRadius: 10 },
  confirmCancelText: { color: '#FFF', textAlign: 'center', fontWeight: 'bold' },
  confirmOkBtn: { flex: 1, backgroundColor: '#ff4444', padding: 14, borderRadius: 10 },
  confirmOkText: { color: '#FFF', textAlign: 'center', fontWeight: 'bold' }
});