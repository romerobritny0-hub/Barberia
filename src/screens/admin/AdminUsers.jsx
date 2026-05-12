import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Modal, ActivityIndicator } from 'react-native';
import { fetchAdmins, createAdmin, updateAdmin, deleteAdmin } from '../../services/adminService';

const ROLES = ['admin', 'superadmin'];

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

export default function AdminUsers({ navigation, route }) {
  const currentAdmin = route.params?.admin;
  const isSuperAdmin = currentAdmin?.rol === 'superadmin';
  
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [form, setForm] = useState({ nombre: '', username: '', password: '', rol: 'admin' });
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ visible: false, type: '', message: '' });
  const [confirmDelete, setConfirmDelete] = useState({ visible: false, id: null });

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const data = await fetchAdmins();
      setAdmins(data || []);
    } catch (error) {
      showNotification('error', 'Error al cargar administradores');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ visible: true, type, message });
  };

  const resetForm = () => {
    setForm({ nombre: '', username: '', password: '', rol: 'admin' });
    setEditingAdmin(null);
  };

  const handleAdd = () => {
    if (!isSuperAdmin) {
      showNotification('error', 'Solo el superadmin puede agregar administradores');
      return;
    }
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (admin) => {
    if (!isSuperAdmin && admin.id !== currentAdmin?.id) {
      showNotification('error', 'No tienes permisos para editar este administrador');
      return;
    }
    setEditingAdmin(admin);
    setForm({ 
      nombre: admin.nombre, 
      username: admin.username, 
      password: '', 
      rol: admin.rol 
    });
    setShowModal(true);
  };

  const handleDeletePress = (id) => {
    if (!isSuperAdmin) {
      showNotification('error', 'Solo el superadmin puede eliminar administradores');
      return;
    }
    if (id === currentAdmin?.id) {
      showNotification('error', 'No puedes eliminarte a ti mismo');
      return;
    }
    setConfirmDelete({ visible: true, id });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteAdmin(confirmDelete.id);
      await loadAdmins();
      setConfirmDelete({ visible: false, id: null });
      showNotification('success', 'Administrador eliminado correctamente');
    } catch (error) {
      setConfirmDelete({ visible: false, id: null });
      showNotification('error', 'Error al eliminar administrador');
    }
  };

  const handleSave = async () => {
    if (!form.nombre || !form.username) {
      showNotification('error', 'Completa todos los campos obligatorios');
      return;
    }
    if (!editingAdmin && !form.password) {
      showNotification('error', 'La contraseña es obligatoria para nuevos administradores');
      return;
    }

    try {
      setSaving(true);
      const adminData = {
        nombre: form.nombre,
        username: form.username,
        rol: form.rol
      };
      if (form.password) {
        adminData.password = form.password;
      }
      
      if (editingAdmin) {
        await updateAdmin(editingAdmin.id, adminData);
      } else {
        await createAdmin(adminData);
      }
      await loadAdmins();
      setShowModal(false);
      resetForm();
      showNotification('success', editingAdmin ? 'Administrador actualizado' : 'Administrador creado correctamente');
    } catch (error) {
      showNotification('error', 'Error al guardar administrador');
    } finally {
      setSaving(false);
    }
  };

  const getRolColor = (rol) => {
    return rol === 'superadmin' ? '#9C27B0' : '#2196F3';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Gestionar Administradores</Text>
          {isSuperAdmin && (
            <View style={styles.superAdminBadge}>
              <Text style={styles.superAdminText}>SUPERADMIN</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addBtnText}>+ Agregar Administrador</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color="#D4AF37" style={styles.loader} />
        ) : admins.length === 0 ? (
          <Text style={styles.emptyText}>No hay administradores</Text>
        ) : (
          admins.map((admin) => (
            <View key={admin.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{admin.nombre?.charAt(0) || '?'}</Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{admin.nombre}</Text>
                  <Text style={styles.cardUsername}>@{admin.username}</Text>
                </View>
                <View style={[styles.rolBadge, { backgroundColor: getRolColor(admin.rol) + '20' }]}>
                  <Text style={[styles.rolText, { color: getRolColor(admin.rol) }]}>{admin.rol}</Text>
                </View>
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(admin)}>
                  <Text style={styles.editBtnText}>✏️ Editar</Text>
                </TouchableOpacity>
                {isSuperAdmin && admin.id !== currentAdmin?.id && (
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeletePress(admin.id)}>
                    <Text style={styles.deleteBtnText}>🗑️ Eliminar</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingAdmin ? 'Editar Administrador' : 'Nuevo Administrador'}</Text>
            
            <TextInput style={styles.input} placeholder="Nombre completo *" placeholderTextColor="#666" value={form.nombre} onChangeText={(t) => setForm({ ...form, nombre: t })} />
            <TextInput style={styles.input} placeholder="Username *" placeholderTextColor="#666" value={form.username} onChangeText={(t) => setForm({ ...form, username: t })} autoCapitalize="none" />
            <TextInput style={styles.input} placeholder={editingAdmin ? "Nueva contraseña (opcional)" : "Contraseña *"} placeholderTextColor="#666" secureTextEntry value={form.password} onChangeText={(t) => setForm({ ...form, password: t })} />
            
            {isSuperAdmin && (
              <View style={styles.rolSection}>
                <Text style={styles.label}>Rol</Text>
                <View style={styles.rolOptions}>
                  {ROLES.map((rol) => (
                    <TouchableOpacity
                      key={rol}
                      style={[styles.rolOption, form.rol === rol && { backgroundColor: getRolColor(rol) }]}
                      onPress={() => setForm({ ...form, rol })}
                    >
                      <Text style={[styles.rolOptionText, form.rol === rol && { color: '#fff' }]}>{rol}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
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
        message="¿Estás seguro de eliminar este administrador?"
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
  superAdminBadge: { backgroundColor: '#9C27B0', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start', marginTop: 10 },
  superAdminText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  addBtn: { backgroundColor: '#9C27B0', padding: 15, borderRadius: 12, marginBottom: 20 },
  addBtnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  loader: { marginTop: 40 },
  card: { backgroundColor: '#1C1B29', borderRadius: 12, padding: 15, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#9C27B0' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#9C27B0', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  cardInfo: { flex: 1, marginLeft: 12 },
  cardName: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  cardUsername: { color: '#888', fontSize: 12 },
  rolBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  rolText: { fontSize: 11, fontWeight: 'bold', textTransform: 'capitalize' },
  cardActions: { flexDirection: 'row', gap: 10 },
  editBtn: { backgroundColor: '#2196F3', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  editBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  deleteBtn: { backgroundColor: '#ff4444', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  deleteBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  emptyText: { color: '#666', textAlign: 'center', marginTop: 40 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1C1B29', borderRadius: 16, padding: 24 },
  modalTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#0F0E17', color: '#FFF', padding: 15, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: '#333' },
  rolSection: { marginBottom: 15 },
  label: { color: '#888', fontSize: 14, marginBottom: 8 },
  rolOptions: { flexDirection: 'row', gap: 10 },
  rolOption: { flex: 1, padding: 12, borderRadius: 8, backgroundColor: '#0F0E17', alignItems: 'center' },
  rolOptionText: { color: '#888', fontSize: 12, fontWeight: 'bold', textTransform: 'capitalize' },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 10 },
  modalCancelBtn: { flex: 1, backgroundColor: '#333', padding: 14, borderRadius: 10 },
  modalCancelText: { color: '#FFF', textAlign: 'center', fontWeight: 'bold' },
  modalSaveBtn: { flex: 1, backgroundColor: '#9C27B0', padding: 14, borderRadius: 10 },
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