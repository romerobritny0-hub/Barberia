import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Modal, Image, ActivityIndicator } from 'react-native';
import { fetchBarbers, createBarber, updateBarber, deleteBarber } from '../../services/barberService';

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

export default function AdminBarbers({ navigation }) {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBarber, setEditingBarber] = useState(null);
  const [form, setForm] = useState({ nombre: '', especialidad: '', imagen: '' });
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ visible: false, type: '', message: '' });
  const [confirmDelete, setConfirmDelete] = useState({ visible: false, id: null });

  useEffect(() => {
    loadBarbers();
  }, []);

  const loadBarbers = async () => {
    try {
      setLoading(true);
      const data = await fetchBarbers();
      setBarbers(data || []);
    } catch (error) {
      showNotification('error', 'Error al cargar barberos');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ visible: true, type, message });
  };

  const resetForm = () => {
    setForm({ nombre: '', especialidad: '', imagen: '' });
    setEditingBarber(null);
  };

  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setForm({ ...form, imagen: e.target.result });
      };
      reader.readAsDataURL(file);
    }
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

  const handleDeletePress = (id) => {
    setConfirmDelete({ visible: true, id });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteBarber(confirmDelete.id);
      await loadBarbers();
      setConfirmDelete({ visible: false, id: null });
      showNotification('success', 'Barbero eliminado correctamente');
    } catch (error) {
      setConfirmDelete({ visible: false, id: null });
      showNotification('error', 'Error al eliminar barbero');
    }
  };

  const handleSave = async () => {
    if (!form.nombre || !form.especialidad) {
      showNotification('error', 'Completa todos los campos obligatorios');
      return;
    }
    
    try {
      setSaving(true);
      const dataToSave = { ...form, imagen: form.imagen || '' };
      
      if (editingBarber) {
        await updateBarber(editingBarber.id, dataToSave);
      } else {
        await createBarber(dataToSave);
      }
      await loadBarbers();
      setShowModal(false);
      resetForm();
      showNotification('success', editingBarber ? 'Barbero actualizado' : 'Barbero creado correctamente');
    } catch (error) {
      showNotification('error', 'Error al guardar barbero');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={true}>
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
          barbers.map((barber) => {
              const isLocalImage = barber.imagen?.startsWith('blob:') || barber.imagen?.startsWith('file://');
              return (
                <View key={barber.id} style={styles.card}>
                  {barber.imagen && !isLocalImage ? (
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
                    <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeletePress(barber.id)}>
                      <Text style={styles.deleteBtnText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
        )}
      </ScrollView>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingBarber ? 'Editar Barbero' : 'Nuevo Barbero'}</Text>
            
            <TextInput style={styles.input} placeholder="Nombre *" placeholderTextColor="#666" value={form.nombre} onChangeText={(t) => setForm({ ...form, nombre: t })} />
            <TextInput style={styles.input} placeholder="Especialidad *" placeholderTextColor="#666" value={form.especialidad} onChangeText={(t) => setForm({ ...form, especialidad: t })} />
            
            <Text style={styles.label}>Imagen</Text>
            <TouchableOpacity 
              style={styles.imagePickerBtn} 
              onPress={() => fileInputRef.current?.click()}
            >
              <Text style={styles.imagePickerBtnText}>📁 Subir imagen</Text>
            </TouchableOpacity>
            
            <View style={{ height: 0, overflow: 'hidden' }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </View>
            
            <Text style={[styles.label, { marginTop: 10 }]}>O pega una URL:</Text>
            <TextInput 
              style={styles.input} 
              value={form.imagen || ''}
              onChangeText={(t) => setForm({ ...form, imagen: t })}
              autoCapitalize="none"
              keyboardType="url"
              placeholder="https://ejemplo.com/imagen.jpg"
              placeholderTextColor="#666"
            />
            
            {form.imagen && (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: form.imagen }} style={styles.imagePreview} />
                <TouchableOpacity style={styles.removeImageBtn} onPress={() => setForm({ ...form, imagen: '' })}>
                  <Text style={styles.removeImageBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
            
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
        message="¿Estás seguro de eliminar este barbero?"
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
  imagePickerBtn: { backgroundColor: '#2A2940', padding: 15, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: '#D4AF37', alignItems: 'center' },
  imagePickerBtnText: { color: '#D4AF37', fontSize: 14, fontWeight: 'bold' },
  imagePreviewContainer: { alignItems: 'center', marginBottom: 12, position: 'relative' },
  imagePreview: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: '#D4AF37' },
  removeImageBtn: { position: 'absolute', top: -10, right: '35%', backgroundColor: '#ff4444', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  removeImageBtnText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 10 },
  modalCancelBtn: { flex: 1, backgroundColor: '#333', padding: 14, borderRadius: 10 },
  modalCancelText: { color: '#FFF', textAlign: 'center', fontWeight: 'bold' },
  modalSaveBtn: { flex: 1, backgroundColor: '#D4AF37', padding: 14, borderRadius: 10 },
  modalSaveText: { color: '#0F0E17', textAlign: 'center', fontWeight: 'bold' },
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