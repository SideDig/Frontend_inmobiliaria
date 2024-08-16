import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, Image, SafeAreaView, StatusBar, TouchableOpacity, Alert, Dimensions, Animated } from 'react-native';
import { useDataContext } from '../context/DataContext';
import { Presupuesto } from '../types';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const Presupuestos = () => {
  const { presupuestos, fetchPresupuestosUsuario, deletePresupuesto } = useDataContext();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPresupuestosUsuario();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPresupuestosUsuario();
    setRefreshing(false);
  };

  const confirmDelete = (presupuestoId: number) => {
    Alert.alert(
      'Eliminar presupuesto',
      '¿Estás seguro de que deseas eliminar este presupuesto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => deletePresupuesto(presupuestoId) },
      ]
    );
  };

  const renderPresupuesto = ({ item }: { item: Presupuesto }) => {
    return (
      <View style={styles.presupuestoContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.propertyName}>{item.nombre_propiedad}</Text>
          <Text style={styles.total}>${item.total.toLocaleString()}</Text>
          <View style={styles.detailRow}>
            <Icon name="location-outline" size={16} color="#34495E" />
            <Text style={styles.text}>{item.direccion}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="bed-outline" size={16} color="#34495E" />
            <Text style={styles.text}>{item.habitaciones} habitaciones</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="water-outline" size={16} color="#34495E" />
            <Text style={styles.text}>{item.baños} baños</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="resize-outline" size={16} color="#34495E" />
            <Text style={styles.text}>{item.tamaño_terreno} m²</Text>
          </View>
          <Text style={styles.fecha}>Creado el: {new Date(item.fecha_creacion).toLocaleDateString()}</Text>
          <TouchableOpacity onPress={() => confirmDelete(item.id)} style={styles.deleteButton}>
            <Icon name="trash-outline" size={20} color="#FFFFFF" />
            <Text style={styles.deleteButtonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar translucent={false} barStyle="light-content" backgroundColor="rgba(7,11,31,1)" />
      <LinearGradient
        colors={['rgba(7,11,31,1)', 'rgba(21,51,210,1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require("../assets/logo_etacarinae.png")}
          />
        </View>
      </LinearGradient>
      <View style={styles.container_listapresupuesto}>
        <Text style={styles.title}>Presupuestos</Text>
        <FlatList
          data={presupuestos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPresupuesto}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007AFF" />
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay presupuestos disponibles.</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ECEFF1",
  },
  container: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  container_listapresupuesto: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#ECEFF1',
  },
  presupuestoContainer: {
    width: width * 0.9,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    borderLeftWidth: 8,
    borderLeftColor: '#001061',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  propertyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  total: {
    fontSize: 18,
    fontWeight: '700',
    color: '#001061',
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginVertical: 5,
    letterSpacing: 1.2,
  },
  text: {
    fontSize: 16,
    color: '#34495E',
    marginLeft: 10,
  },
  fecha: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 8,
    textAlign: 'left',
  },
  deleteButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#BDC3C7',
    textAlign: 'center',
  },
});

export default Presupuestos;
