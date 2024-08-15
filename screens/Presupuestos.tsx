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
  const scrollX = new Animated.Value(0);

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

  const renderPresupuesto = ({ item, index }: { item: Presupuesto; index: number }) => {
    const inputRange = [(index - 1) * width * 0.8, index * width * 0.8, (index + 1) * width * 0.8];
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.presupuestoContainer, { transform: [{ scale }] }]}>
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
          <TouchableOpacity onPress={() => confirmDelete(item.id)} style={styles.deleteButton}>
            <Icon name="trash-outline" size={20} color="#FFFFFF" />
            <Text style={styles.deleteButtonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
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
        <Animated.FlatList
          data={presupuestos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPresupuesto}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          snapToAlignment="center"
          snapToInterval={width * 0.8 + 20}
          decelerationRate="fast"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          contentContainerStyle={{ paddingHorizontal: 10 }}
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
    width: width * 0.8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 10,
    borderLeftWidth: 8,
    borderLeftColor: '#1ABC9C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  propertyImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  propertyName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  total: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E67E22',
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
    color: '#34495E',
    textAlign: 'center',
    marginVertical: 20,
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
    backgroundColor: '#E74C3C',
    padding: 15,
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