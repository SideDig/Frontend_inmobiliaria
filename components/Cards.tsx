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

const Cards: React.FC<CardsProps> = ({ propiedad }) => {
  const navigation = useNavigation<any>();  // Usar `any` para los parámetros de la navegación

  const handlePress = () => {
    navigation.navigate('DetallesPropiedad', { propiedadId: propiedad.id });
  };

  return (
    <TouchableOpacity style={styles.propertyCard} onPress={handlePress}>
      <Image source={{ uri: propiedad.imagen || 'https://via.placeholder.com/150' }} style={styles.propertyImage} />
      <Text style={styles.propertyTitle}>{propiedad.nombre_propiedad}</Text>
      <Text style={styles.propertyPrice}>{`$${propiedad.precio}`}</Text>
      <View style={styles.ubicaciones}>
        <Text style={styles.propertyAddress}>{propiedad.direccion}</Text>
        <Text style={styles.propertyAddress}>, {propiedad.ubicacion}</Text>
      </View>
      <View style={styles.propertyDetails}>
        <FontAwesome name="bed" size={20} color="black" style={{ margin: 5 }} />
        <Text>{propiedad.habitaciones}</Text>
        <FontAwesome name="bath" size={20} color="black" style={{ margin: 5 }} />
        <Text>{propiedad.baños}</Text>
        <SimpleLineIcons name="size-fullscreen" size={20} color="black" style={{ margin: 5 }} />
        <Text>{`${propiedad.tamaño_terreno} m²`}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  propertyCard: {
    width: 340,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
  propertyImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  propertyTitle: {
    fontSize: 15,
    fontWeight: '400',
    marginVertical: 2,
  },
  propertyPrice: {
    color: 'black',
    marginVertical: 3,
    fontWeight: 'bold',
  },
  propertyAddress: {
    color: '#888',
    fontSize: 12,
    marginVertical: 3,
  },
  propertyDetails: {
    alignItems: 'center',
    marginVertical: 2,
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'flex-start',
  },
  ubicaciones: {
    flexDirection: 'row',
  }
});

export default Cards;
