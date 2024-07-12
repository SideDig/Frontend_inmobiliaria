// Registro.tsx

import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Button } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const Registro: React.FC = () => {
  const [nombre, setNombre] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [contrasena, setContrasena] = useState<string>('');
  const [confirmarContrasena, setConfirmarContrasena] = useState<string>('');

  const { registrarUsuario } = useAuth();
  const navigation = useNavigation();

  const handleRegistro = async () => {
    if (contrasena !== confirmarContrasena) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      await registrarUsuario({ nombre, email, contrasena });
      navigation.navigate('FormDatosPersonales' as never); 
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Ocurrió un error durante el registro.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        translucent={false}
        barStyle="light-content"
        backgroundColor="rgba(7,11,31,1)"
      />
      <LinearGradient
        colors={['rgba(7,11,31,1)', 'rgba(21,51,210,1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('../assets/logo_etacarinae.png')}
          />
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.inputsContainer}>
            <Text style={styles.titulo_form}>Registro</Text>
            <Text style={styles.subtitulo}>
              Bienvenido crea una cuenta para continuar
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={nombre}
              onChangeText={setNombre}
            />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={contrasena}
              onChangeText={setContrasena}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Confirmar contraseña"
              value={confirmarContrasena}
              onChangeText={setConfirmarContrasena}
              secureTextEntry
            />
            <Button
              title="Regístrate"
              buttonStyle={styles.button}
              titleStyle={styles.buttonTitle}
              containerStyle={styles.buttonContainer}
              onPress={handleRegistro}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 500,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 40,
  },
  input: {
    height: 45,
    width: 350,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  inputsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo_form: {
    fontWeight: 'bold',
    fontSize: 25,
    marginVertical: 10,
  },
  subtitulo: {
    fontSize: 13,
    opacity: 0.5,
    marginVertical: 5,
  },
  button: {
    width: 250,
    height: 50,
    backgroundColor: '#001061',
    borderRadius: 10,
  },
  buttonTitle: {
    fontWeight: '500',
    fontSize: 17,
    color: 'white',
    borderRadius: 20,
  },
  buttonContainer: {
    marginVertical: 20,
    height: 100,
    width: 250,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Registro;
