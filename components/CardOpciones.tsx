import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export interface Agente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  total_ventas: number;
  num_propiedades: number;
}

export interface Propiedad {
  id: number;
  nombre_propiedad: string;
  direccion: string;
  descripcion: string;
  precio: number;
  agente: Agente;
  habitaciones: number;
  baños: number;
  tamaño_terreno: number;
  caracteristicas: string[];
  ubicacion: string;
  imagen?: string;
}

interface CardsProps {
  propiedad: Propiedad;
}

const Cardsopciones: React.FC<CardsProps> = ({ propiedad }) => {
  const navigation = useNavigation<any>();  // Usar `any` para los parámetros de la navegación

  const handlePress = () => {
    navigation.navigate('DetallesPropiedad', { propiedadId: propiedad.id });
  };

  return (
    <TouchableOpacity style={styles.propertyCard} onPress={handlePress}>
      <Image source={{ uri: propiedad.imagen || 'https://via.placeholder.com/150' }} style={styles.propertyImage} />
      <View style={styles.propertyInfo}>
        <Text style={styles.propertyTitle}>{propiedad.nombre_propiedad}</Text>
        <Text style={styles.propertyPrice}>{`$${propiedad.precio}`}</Text>
        <View style={styles.ubicaciones}>
          <Text style={styles.propertyAddress}>{propiedad.direccion}</Text>
          <Text style={styles.propertyAddress}>, {propiedad.ubicacion}</Text>
        </View>
        <View style={styles.propertyDetails}>
          <View style={styles.detailItem}>
            <FontAwesome name="bed" size={20} color="#333" style={styles.icon} />
            <Text style={styles.detailText}>{propiedad.habitaciones}</Text>
          </View>
          <View style={styles.detailItem}>
            <FontAwesome name="bath" size={20} color="#333" style={styles.icon} />
            <Text style={styles.detailText}>{propiedad.baños}</Text>
          </View>
          <View style={styles.detailItem}>
            <SimpleLineIcons name="size-fullscreen" size={20} color="#333" style={styles.icon} />
            <Text style={styles.detailText}>{`${propiedad.tamaño_terreno} m²`}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  propertyCard: {
    width: '95%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 10,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  propertyImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  propertyInfo: {
    padding: 15,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  propertyPrice: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  propertyAddress: {
    color: '#666',
    fontSize: 14,
    marginBottom: 10,
  },
  propertyDetails: {
    flexDirection: 'row',
    gap: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 5,
  },
  detailText: {
    color: '#333',
    fontSize: 14,
  },
  ubicaciones: {
    flexDirection: 'row',
  },
});

export default Cardsopciones;
