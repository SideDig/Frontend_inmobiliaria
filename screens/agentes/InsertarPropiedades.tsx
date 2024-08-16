import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { useDataContext } from '../../context/DataContext'; 
import api from '../../conexionApi/axios'; 

const FormularioPropiedad = () => {
  const { fetchPropiedadesPorAgente } = useDataContext();
  
  const [nombrePropiedad, setNombrePropiedad] = useState<string>('');
  const [direccion, setDireccion] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');
  const [precio, setPrecio] = useState<string>('');
  const [agenteId, setAgenteId] = useState<string>('');
  const [habitaciones, setHabitaciones] = useState<string>('');
  const [banos, setBanos] = useState<string>('');
  const [tamanoTerreno, setTamanoTerreno] = useState<string>('');
  const [caracteristicas, setCaracteristicas] = useState<string>('');
  const [ubicacion, setUbicacion] = useState<string>('');
  const [img_propiedad, setimg_propiedad] = useState<string>('');

  const handleSubmit = async () => {
    try {
      const response = await api.post('/propiedades', {
        nombre_propiedad: nombrePropiedad,
        direccion,
        descripcion,
        precio: parseFloat(precio),
        agente_id: parseInt(agenteId, 10),
        habitaciones: parseInt(habitaciones, 10),
        baños: parseInt(banos, 10),
        tamaño_terreno: parseInt(tamanoTerreno, 10),
        caracteristicas,
        ubicacion,
        img_propiedad
      });

      if (response.status === 200) {
        Alert.alert('Éxito', 'Propiedad añadida correctamente.');
        await fetchPropiedadesPorAgente(parseInt(agenteId, 10)); 
      } else {
        Alert.alert('Error', 'No se pudo añadir la propiedad. Inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      Alert.alert('Error', 'Hubo un problema al enviar los datos. Inténtalo de nuevo.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGroup}>
        <Text>Nombre de la propiedad:</Text>
        <TextInput
          style={styles.input}
          value={nombrePropiedad}
          onChangeText={setNombrePropiedad}
        />
      </View>
      <View style={styles.formGroup}>
        <Text>Dirección:</Text>
        <TextInput
          style={styles.input}
          value={direccion}
          onChangeText={setDireccion}
        />
      </View>
      <View style={styles.formGroup}>
        <Text>Descripción:</Text>
        <TextInput
          style={styles.input}
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
        />
      </View>
      <View style={styles.formGroup}>
        <Text>Precio:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={precio}
          onChangeText={setPrecio}
        />
      </View>
      <View style={styles.formGroup}>
        <Text>ID del Agente:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={agenteId}
          onChangeText={setAgenteId}
        />
      </View>
      <View style={styles.formGroup}>
        <Text>Habitaciones:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={habitaciones}
          onChangeText={setHabitaciones}
        />
      </View>
      <View style={styles.formGroup}>
        <Text>Baños:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={banos}
          onChangeText={setBanos}
        />
      </View>
      <View style={styles.formGroup}>
        <Text>Tamaño del terreno:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={tamanoTerreno}
          onChangeText={setTamanoTerreno}
        />
      </View>
      <View style={styles.formGroup}>
        <Text>Características:</Text>
        <TextInput
          style={styles.input}
          value={caracteristicas}
          onChangeText={setCaracteristicas}
          multiline
        />
      </View>
      <View style={styles.formGroup}>
        <Text>Ubicación:</Text>
        <TextInput
          style={styles.input}
          value={ubicacion}
          onChangeText={setUbicacion}
        />
      </View>
      <View style={styles.formGroup}>
        <Text>Imagen propiedad:</Text>
        <TextInput
          style={styles.input}
          value={img_propiedad}
          onChangeText={setimg_propiedad}
        />
      </View>
      <Button title="Guardar Propiedad" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
  },
});

export default FormularioPropiedad;
