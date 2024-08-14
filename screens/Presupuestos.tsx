import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, Image, SafeAreaView, StatusBar } from 'react-native';
import { useDataContext } from '../context/DataContext';
import { Presupuesto } from '../types';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

const Presupuestos = () => {
  const { presupuestos, fetchPresupuestosUsuario } = useDataContext();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPresupuestosUsuario();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPresupuestosUsuario();
    setRefreshing(false);
  };

  const renderPresupuesto = ({ item }: { item: Presupuesto }) => {
    return (
      <View style={styles.presupuestoContainer}>
        <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.propertyImage} />
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
    backgroundColor: "white",
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
    height: 300,
    resizeMode: "contain",
    marginBottom: 0,
  },
  container_listapresupuesto: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F4F6F9',
  },
  presupuestoContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 7,
    alignItems: 'center',
  },
  propertyImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  propertyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34495E',
    marginBottom: 4,
  },
  total: {
    fontSize: 16,
    fontWeight: '600',
    color: '#27AE60',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginVertical: 15,
    letterSpacing: 1,
  },
  text: {
    fontSize: 14,
    color: '#2C3E50',
    marginLeft: 8,
  },
  fecha: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 8,
    textAlign: 'right',
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
