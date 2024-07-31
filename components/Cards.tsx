import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';

export interface Propiedad {
  id: number;
  nombre_propiedad: string;
  direccion: string;
  descripcion: string;
  precio: number;
  agente_id: number;
  habitaciones: number;
  baños: number;
  tamaño_terreno: number;
  caracteristicas: string;
  ubicacion: string;
  imagen?: string;
}

interface CardsProps {
  propiedad: Propiedad;
}

const Cards: React.FC<CardsProps> = ({ propiedad }) => {
  return (
    <View style={styles.propertyCard}>
      <Image source={{ uri: propiedad.imagen || 'https://via.placeholder.com/150' }} style={styles.propertyImage} />
      <Text style={styles.propertyTitle}>{propiedad.nombre_propiedad}</Text>
      <Text style={styles.propertyPrice}>{`$${propiedad.precio}`}</Text>
      <Text style={styles.propertyAddress}>{propiedad.direccion}</Text>
      <View style={styles.propertyDetails}>
        <FontAwesome name="bed" size={20} color="black" style={{ margin: 5 }} />
        <Text>{propiedad.habitaciones}</Text>
        <FontAwesome name="bath" size={20} color="black" style={{ margin: 5 }} />
        <Text>{propiedad.baños}</Text>
        <SimpleLineIcons name="size-fullscreen" size={20} color="black" style={{ margin: 5 }} />
        <Text>{`${propiedad.tamaño_terreno} m²`}</Text>
      </View>
    </View>
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
    justifyContent: 'flex-start',
  },
});

export default Cards;
