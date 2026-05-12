import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

export default function AdminPanel({ navigation, route }) {
  const admin = route.params?.admin;

  const menuItems = [
    { id: 1, title: '👨‍💼 Barberos', subtitle: 'Gestionar barberos', screen: 'AdminBarbers', color: '#D4AF37', icon: '👨‍💼' },
    { id: 2, title: '🪑 Sillas', subtitle: 'Gestionar puestos', screen: 'AdminSillas', color: '#4CAF50', icon: '🪑' },
    { id: 3, title: '📋 Citas', subtitle: 'Ver todas las citas', screen: 'AdminCitas', color: '#2196F3', icon: '📋' },
    { id: 4, title: '📊 Reportes', subtitle: 'Estadísticas', screen: 'AdminReportes', color: '#9C27B0', icon: '📊' },
  ];

  if (admin?.rol === 'superadmin') {
    menuItems.push({ id: 5, title: '👥 Usuarios', subtitle: 'Gestionar admins', screen: 'AdminUsers', color: '#FF9800', icon: '👥' });
  }

  const handleLogout = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{admin?.nombre?.charAt(0) || 'A'}</Text>
            </View>
            <View>
              <Text style={styles.welcomeText}>Bienvenido</Text>
              <Text style={styles.userName}>{admin?.nombre || 'Administrador'}</Text>
              <View style={[styles.rolBadge, { backgroundColor: admin?.rol === 'superadmin' ? '#9C27B020' : '#2196F320' }]}>
                <Text style={[styles.rolText, { color: admin?.rol === 'superadmin' ? '#9C27B0' : '#2196F3' }]}>
                  {admin?.rol || 'admin'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>PANEL DE CONTROL</Text>

        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuCard, { borderTopColor: item.color }]}
              onPress={() => navigation.navigate(item.screen, { admin })}
              activeOpacity={0.8}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{item.title.replace(item.icon + ' ', '')}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <View style={[styles.menuIndicator, { backgroundColor: item.color }]} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>CERRAR SESIÓN</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0E17' },
  content: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 25, marginTop: 10 },
  userInfo: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1B29', padding: 15, borderRadius: 12, borderTopWidth: 3, borderTopColor: '#D4AF37' },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#D4AF37', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { color: '#0F0E17', fontSize: 24, fontWeight: 'bold' },
  welcomeText: { color: '#888', fontSize: 12 },
  userName: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  rolBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8, alignSelf: 'flex-start' },
  rolText: { fontSize: 10, fontWeight: 'bold', textTransform: 'capitalize' },
  sectionTitle: { color: '#888', fontSize: 12, fontWeight: 'bold', letterSpacing: 2, marginBottom: 15 },
  menuGrid: { gap: 12 },
  menuCard: { backgroundColor: '#1C1B29', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', borderTopWidth: 4 },
  menuIcon: { fontSize: 28, marginRight: 15 },
  menuTextContainer: { flex: 1 },
  menuTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  menuSubtitle: { color: '#888', fontSize: 12 },
  menuIndicator: { width: 30, height: 4, borderRadius: 2 },
  logoutBtn: { backgroundColor: '#333', paddingVertical: 15, borderRadius: 12, marginTop: 30 },
  logoutText: { color: '#ff4444', textAlign: 'center', fontWeight: 'bold', fontSize: 14, letterSpacing: 1 }
});
