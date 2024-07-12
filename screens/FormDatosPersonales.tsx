import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext'; 

const FormDatosPersonales: React.FC = () => {
  const { user, cerrarSesion } = useAuth(); 
  const navigation = useNavigation(); 

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigation.navigate('Login' as never); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>¡Bienvenido a la pantalla de inicio!</Text>
      {user && (
        <View>
          <Text style={styles.userInfo}>ID: {user.id}</Text>
          <Text style={styles.userInfo}>Nombre: {user.nombre}</Text>
          <Text style={styles.userInfo}>Email: {user.email}</Text>
        </View>
      )}
      <Button title="Cerrar Sesión" onPress={handleCerrarSesion} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userInfo: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default FormDatosPersonales;
