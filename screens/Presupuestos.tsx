import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useDataContext } from '../context/DataContext';
import { Presupuesto } from '../types';

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
        <Text style={styles.propertyName}>Propiedad ID: {item.propiedad_id.toString()}</Text>
        <Text style={styles.total}>Total: ${item.total}</Text>
        <Text style={styles.fecha}>Fecha de Creación: {new Date(item.fecha_creacion).toLocaleDateString()}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={presupuestos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPresupuesto}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay presupuestos disponibles.</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  presupuestoContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  total: {
    fontSize: 16,
    color: '#333',
    marginVertical: 5,
  },
  fecha: {
    fontSize: 14,
    color: '#555',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#777',
  },
});

export default Presupuestos;
