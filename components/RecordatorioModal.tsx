import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

interface ReminderModalProps {
  visible: boolean;
  onClose: () => void;
  onSetReminder: (frequency: string) => void;
}

const ReminderModal: React.FC<ReminderModalProps> = ({ visible, onClose, onSetReminder }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>¿Cada cuánto tiempo deseas un recordatorio?</Text>
          <TouchableOpacity style={styles.reminderButton} onPress={() => onSetReminder('diario')}>
            <Text style={styles.reminderButtonText}>Diario</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reminderButton} onPress={() => onSetReminder('semanal')}>
            <Text style={styles.reminderButtonText}>Semanal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reminderButton} onPress={() => onSetReminder('mensual')}>
            <Text style={styles.reminderButtonText}>Mensual</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  reminderButton: {
    backgroundColor: '#001061',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
    width: '100%',
  },
  reminderButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ReminderModal;
