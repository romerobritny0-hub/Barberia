import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform as RNPlatform } from 'react-native';
import { loginAdmin } from '../services/adminService';

export default function AdminLoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Por favor ingresa usuario y contraseña');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const admin = await loginAdmin(username, password);
      
      if (admin) {
        navigation.navigate('AdminPanel', { admin });
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (err) {
      setError('Error al intentar iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={RNPlatform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.lockIcon}>🔐</Text>
        </View>
        
        <Text style={styles.title}>PANEL ADMINISTRATIVO</Text>
        <Text style={styles.subtitle}>Tauros Barbería</Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>USUARIO</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu usuario"
              placeholderTextColor="#555"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>CONTRASEÑA</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu contraseña"
              placeholderTextColor="#555"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity 
            style={[styles.btn, loading && styles.btnDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#0F0E17" />
            ) : (
              <Text style={styles.btnText}>INGRESAR</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
          <Text style={styles.backText}>← Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0F0E17' 
  },
  content: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 30 
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  lockIcon: { 
    fontSize: 70 
  },
  title: { 
    color: '#D4AF37', 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 5 
  },
  subtitle: { 
    color: '#888', 
    fontSize: 14, 
    textAlign: 'center', 
    marginBottom: 40 
  },
  form: {
    backgroundColor: '#1C1B29',
    borderRadius: 16,
    padding: 24,
    borderTopWidth: 3,
    borderTopColor: '#D4AF37'
  },
  inputContainer: {
    marginBottom: 20
  },
  label: {
    color: '#D4AF37',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 1
  },
  input: { 
    backgroundColor: '#0F0E17', 
    color: '#FFF', 
    padding: 16, 
    borderRadius: 10, 
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333'
  },
  errorText: {
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14
  },
  btn: { 
    backgroundColor: '#D4AF37', 
    padding: 16, 
    borderRadius: 12,
    marginTop: 10
  },
  btnDisabled: {
    opacity: 0.7
  },
  btnText: { 
    color: '#0F0E17', 
    fontWeight: 'bold', 
    textAlign: 'center', 
    fontSize: 16,
    letterSpacing: 1
  },
  backLink: { 
    marginTop: 30 
  },
  backText: { 
    color: '#666', 
    textAlign: 'center', 
    fontSize: 14 
  }
});
