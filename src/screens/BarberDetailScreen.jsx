import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform, SafeAreaView, Image, ScrollView, useWindowDimensions } from 'react-native';
import { useBooking } from '../context/BookingContext';
import { createCita } from '../services/citaService';

const SCHEDULES = [];
for (let h = 8; h <= 20; h++) {
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h > 12 ? h - 12 : h;
  SCHEDULES.push(`${hour}:00 ${period}`);
}

const DateTimePicker = Platform.OS !== 'web' ? require('@react-native-community/datetimepicker').default : null;

function ConfirmationModal({ visible, barber, date, time, onConfirm, onCancel }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.modalIconContainer}>
              <Text style={styles.modalIcon}>✓</Text>
            </View>
            <Text style={styles.modalTitle}>Confirmar Cita</Text>
          </View>
          
          <View style={styles.modalBody}>
            {barber?.imagen && (
              <Image source={{ uri: barber.imagen }} style={styles.modalBarberImage} />
            )}
            <Text style={styles.modalBarberName}>{barber?.nombre}</Text>
            
            <View style={styles.modalDetails}>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>📅 Fecha</Text>
                <Text style={styles.modalDetailValue}>{date}</Text>
              </View>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>🕐 Hora</Text>
                <Text style={styles.modalDetailValue}>{time}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalCancelBtn} onPress={onCancel}>
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalConfirmBtn} onPress={onConfirm}>
              <Text style={styles.modalConfirmText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function SuccessModal({ visible, barberName, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.successModalContent}>
          <View style={styles.successIconContainer}>
            <Text style={styles.successIcon}>✓</Text>
          </View>
          <Text style={styles.successTitle}>¡Cita Confirmada!</Text>
          <Text style={styles.successMessage}>
            Tu cita con <Text style={styles.successHighlight}>{barberName}</Text> ha sido agendada exitosamente.
          </Text>
          <View style={styles.successDivider} />
          <Text style={styles.successNote}>Te esperamos en Tauros Barbería</Text>
          <TouchableOpacity style={styles.successBtn} onPress={onClose}>
            <Text style={styles.successBtnText}>Entendido</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function WarningModal({ visible, message, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.warningModalContent}>
          <View style={styles.warningIconContainer}>
            <Text style={styles.warningIcon}>⚠️</Text>
          </View>
          <Text style={styles.warningTitle}>Atención</Text>
          <Text style={styles.warningMessage}>{message}</Text>
          <TouchableOpacity style={styles.warningBtn} onPress={onClose}>
            <Text style={styles.warningBtnText}>Entendido</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function BarberDetailScreen({ route, navigation }) {
  const { barber } = route?.params || { barber: { nombre: 'Profesional', imagen: null } };
  const { width } = useWindowDimensions();
  const { addBookedSlot, isSlotBooked } = useBooking();
  
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const formatDate = (d) => d.toISOString().split('T')[0];
  const dateKey = formatDate(date);

  const isToday = date.toDateString() === new Date().toDateString();
  
  const getCurrentHour = () => {
    const now = new Date();
    return now.getHours();
  };

  const isPastHour = (time) => {
    if (!isToday) return false;
    const hour = parseInt(time.split(':')[0]);
    const period = time.includes('PM') ? 'PM' : 'AM';
    let hour24 = hour;
    if (period === 'PM' && hour !== 12) hour24 += 12;
    if (period === 'AM' && hour === 12) hour24 = 0;
    return hour24 <= getCurrentHour();
  };

  const handleDateChange = (_, selectedDate) => {
    if (selectedDate) {
      const selected = new Date(selectedDate);
      selected.setHours(0, 0, 0, 0);
      if (selected >= today) {
        setDate(selectedDate);
        setSelectedTime(null);
      } else {
        setWarningMessage('No puedes seleccionar una fecha pasada.');
        setShowWarningModal(true);
        return;
      }
    }
    if (Platform.OS !== 'web') setShowDatePicker(false);
  };

  const handleBooking = () => {
    if (!selectedTime) {
      setWarningMessage('Por favor selecciona un horario antes de confirmar tu cita.');
      setShowWarningModal(true);
      return;
    }
    if (isPastHour(selectedTime)) {
      setWarningMessage('No puedes agendar una hora que ya pasó.');
      setShowWarningModal(true);
      return;
    }
    if (isSlotBooked(barber.id, dateKey, selectedTime)) {
      setWarningMessage('Este horario ya está ocupado. Por favor selecciona otro.');
      setShowWarningModal(true);
      return;
    }
    setShowModal(true);
  };

  const handleConfirm = async () => {
    try {
      const citaData = {
        barbero_id: barber.id,
        cliente_nombre: 'Cliente',
        cliente_telefono: '',
        fecha: date.toISOString().split('T')[0],
        hora: selectedTime,
        estado: 'confirmada',
        servicio: barber.especialidad || 'Corte'
      };
      await createCita(citaData);
      addBookedSlot(barber.id, dateKey, selectedTime);
      setShowModal(false);
      setShowSuccessModal(true);
      setSelectedTime(null);
    } catch (error) {
      console.error('Error al guardar cita:', error);
      addBookedSlot(barber.id, dateKey, selectedTime);
      setShowModal(false);
      setShowSuccessModal(true);
      setSelectedTime(null);
    }
  };

  const handleCancelModal = () => {
    setShowModal(false);
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={true}
        alwaysBounceVertical={true}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← VOLVER</Text>
        </TouchableOpacity>

        <Text style={styles.title}>AGENDAR CITA</Text>

        <View style={[styles.card, { width: width - 40 }]}>
          {barber.imagen ? (
            <Image source={{ uri: barber.imagen }} style={styles.barberImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.avatarText}>{barber.nombre?.charAt(0).toUpperCase() || '?'}</Text>
            </View>
          )}
          <Text style={styles.barberName}>{barber.nombre}</Text>
          <Text style={styles.barberSpecialty}>{barber.especialidad}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📅 FECHA</Text>
            {isToday && <Text style={styles.todayBadge}>HOY</Text>}
          </View>
          {Platform.OS === 'web' ? (
            <input
              type="date"
              min={today.toISOString().split('T')[0]}
              style={styles.webInput}
              onChange={(e) => {
                const [y, m, d] = e.target.value.split('-');
                const newDate = new Date(y, m - 1, d);
                if (newDate >= today) {
                  setDate(newDate);
                  setSelectedTime(null);
                }
              }}
            />
          ) : (
            <>
              <TouchableOpacity style={styles.dateBtn} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.dateBtnText}>{formatDate(date)}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <View style={styles.pickerContainer}>
                  <DateTimePicker value={date} mode="date" display="spinner" minimumDate={new Date()} onChange={handleDateChange} />
                  <TouchableOpacity style={styles.doneBtn} onPress={() => setShowDatePicker(false)}>
                    <Text style={styles.doneBtnText}>Aceptar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🕐 HORARIO</Text>
          <View style={styles.timeGrid}>
            {SCHEDULES.map((time) => {
              const booked = isSlotBooked(barber.id, dateKey, time);
              const past = isPastHour(time);
              return (
                <TouchableOpacity
                  key={time}
                  style={[styles.timeBtn, selectedTime === time && !past && !booked && styles.timeBtnSelected, past && styles.timeBtnPast, booked && styles.timeBtnDisabled]}
                  onPress={() => {
                    if (!past && !booked) {
                      setSelectedTime(time);
                    }
                  }}
                  disabled={past || booked}
                  activeOpacity={past || booked ? 1 : 0.7}
                >
                  <Text style={[styles.timeText, selectedTime === time && !past && !booked && styles.timeTextSelected, past && styles.timeTextPast, booked && styles.timeTextDisabled]}>
                    {past ? 'Pasado' : booked ? '❌' : time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity style={styles.confirmBtn} onPress={handleBooking}>
          <Text style={styles.confirmBtnText}>CONFIRMAR CITA</Text>
        </TouchableOpacity>
      </ScrollView>

      <ConfirmationModal
        visible={showModal}
        barber={barber}
        date={dateKey}
        time={selectedTime}
        onConfirm={handleConfirm}
        onCancel={handleCancelModal}
      />

      <SuccessModal
        visible={showSuccessModal}
        barberName={barber.nombre}
        onClose={handleCloseSuccess}
      />

      <WarningModal
        visible={showWarningModal}
        message={warningMessage}
        onClose={() => setShowWarningModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0E17' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  backBtn: { marginBottom: 15 },
  backText: { color: '#D4AF37', fontSize: 14, fontWeight: 'bold' },
  title: { color: '#D4AF37', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 25 },
  card: { backgroundColor: '#1C1B29', borderRadius: 16, padding: 20, alignItems: 'center', alignSelf: 'center', borderTopWidth: 4, borderTopColor: '#D4AF37', marginBottom: 25, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' },
  barberImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 15 },
  imagePlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#2A2940', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  avatarText: { color: '#D4AF37', fontSize: 32, fontWeight: 'bold' },
  barberName: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  barberSpecialty: { color: '#D4AF37', fontSize: 14 },
  section: { marginBottom: 25 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, gap: 10 },
  sectionTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  todayBadge: { backgroundColor: '#D4AF37', color: '#0F0E17', fontSize: 10, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  dateBtn: { backgroundColor: '#1C1B29', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#D4AF37' },
  dateBtnText: { color: '#D4AF37', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  webInput: { padding: 12, borderRadius: 10, border: '1px solid #D4AF37', backgroundColor: '#1C1B29', color: 'white', fontSize: 16 },
  pickerContainer: { backgroundColor: '#1C1B29', borderRadius: 10, marginTop: 10, padding: 10 },
  doneBtn: { backgroundColor: '#D4AF37', padding: 10, borderRadius: 8, marginTop: 10 },
  doneBtnText: { color: '#000', textAlign: 'center', fontWeight: 'bold' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  timeBtn: { backgroundColor: '#1C1B29', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#333' },
  timeBtnSelected: { backgroundColor: '#D4AF37', borderColor: '#D4AF37' },
  timeBtnPast: { backgroundColor: '#1a1a1a', borderColor: '#2a2a2a', opacity: 0.5 },
  timeBtnDisabled: { backgroundColor: '#2a2a2a', borderColor: '#444', opacity: 0.6 },
  timeText: { color: '#FFF', fontSize: 14 },
  timeTextSelected: { color: '#000', fontWeight: 'bold' },
  timeTextPast: { color: '#555' },
  timeTextDisabled: { color: '#666' },
  confirmBtn: { backgroundColor: '#D4AF37', padding: 18, borderRadius: 12, marginTop: 10, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' },
  confirmBtnText: { color: '#000', fontWeight: 'bold', textAlign: 'center', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1C1B29', borderRadius: 20, padding: 24, width: '100%', maxWidth: 340, borderTopWidth: 4, borderTopColor: '#D4AF37' },
  modalHeader: { alignItems: 'center', marginBottom: 20 },
  modalIconContainer: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#D4AF37', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  modalIcon: { color: '#0F0E17', fontSize: 28, fontWeight: 'bold' },
  modalTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  modalBody: { alignItems: 'center', marginBottom: 24 },
  modalBarberImage: { width: 70, height: 70, borderRadius: 35, marginBottom: 10 },
  modalBarberName: { color: '#D4AF37', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  modalDetails: { backgroundColor: '#0F0E17', borderRadius: 12, padding: 16, width: '100%' },
  modalDetailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  modalDetailLabel: { color: '#888', fontSize: 14 },
  modalDetailValue: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  modalButtons: { flexDirection: 'row', gap: 12 },
  modalCancelBtn: { flex: 1, backgroundColor: '#333', paddingVertical: 14, borderRadius: 10 },
  modalCancelText: { color: '#FFF', textAlign: 'center', fontWeight: 'bold', fontSize: 14 },
  modalConfirmBtn: { flex: 1, backgroundColor: '#D4AF37', paddingVertical: 14, borderRadius: 10 },
  modalConfirmText: { color: '#0F0E17', textAlign: 'center', fontWeight: 'bold', fontSize: 14 },
  successModalContent: { backgroundColor: '#1C1B29', borderRadius: 20, padding: 30, width: '100%', maxWidth: 320, alignItems: 'center', borderTopWidth: 4, borderTopColor: '#D4AF37' },
  successIconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#D4AF37', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  successIcon: { color: '#0F0E17', fontSize: 40, fontWeight: 'bold' },
  successTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  successMessage: { color: '#CCC', fontSize: 15, textAlign: 'center', marginBottom: 20, lineHeight: 22 },
  successHighlight: { color: '#D4AF37', fontWeight: 'bold' },
  successDivider: { width: '80%', height: 1, backgroundColor: '#333', marginBottom: 15 },
  successNote: { color: '#D4AF37', fontSize: 13, marginBottom: 25, fontStyle: 'italic' },
  successBtn: { backgroundColor: '#D4AF37', paddingVertical: 14, paddingHorizontal: 50, borderRadius: 12 },
  successBtnText: { color: '#0F0E17', fontSize: 16, fontWeight: 'bold' },
  warningModalContent: { backgroundColor: '#1C1B29', borderRadius: 20, padding: 30, width: '100%', maxWidth: 320, alignItems: 'center', borderTopWidth: 4, borderTopColor: '#FF9800' },
  warningIconContainer: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#FF9800', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  warningIcon: { fontSize: 32 },
  warningTitle: { color: '#FF9800', fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  warningMessage: { color: '#CCC', fontSize: 15, textAlign: 'center', marginBottom: 25, lineHeight: 22 },
  warningBtn: { backgroundColor: '#FF9800', paddingVertical: 14, paddingHorizontal: 50, borderRadius: 12 },
  warningBtnText: { color: '#0F0E17', fontSize: 16, fontWeight: 'bold' }
});