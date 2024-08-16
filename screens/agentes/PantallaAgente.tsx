import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, SafeAreaView, StatusBar, Alert, TouchableOpacity, Image } from 'react-native';
import { useDataContext } from '../../context/DataContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { Propiedad } from '../../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const PantallaAgente = () => {
  const { user, cerrarSesion } = useAuth();
  const { fetchPropiedadesPorAgente, deletePropiedad } = useDataContext();
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation();

  useEffect(() => {
    if (user && user.rol === 'agente') {
      const obtenerPropiedades = async () => {
        try {
          const propiedadesAgente = await fetchPropiedadesPorAgente(user.id);
          setPropiedades(propiedadesAgente);
        } catch (error) {
          setError('Error al obtener propiedades del agente.');
        } finally {
          setLoading(false);
        }
      };

      obtenerPropiedades();
    }
  }, [user, fetchPropiedadesPorAgente]);

  const handleLogout = async () => {
    try {
      await cerrarSesion();
    } catch (error) {
      Alert.alert('Error', 'No se pudo cerrar sesión.');
    }
  };

  const handleDelete = async (propiedadId: number) => {
    Alert.alert(
      'Eliminar Propiedad',
      '¿Estás seguro de que deseas eliminar esta propiedad?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              await deletePropiedad(propiedadId);
              setPropiedades((prevPropiedades) => prevPropiedades.filter(p => p.id !== propiedadId));
              Alert.alert('Éxito', 'Propiedad eliminada exitosamente.');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la propiedad.');
            }
          },
        },
      ]
    );
  };

  const handleAddPropiedad = () => {
    navigation.navigate('InsertarPropiedades' as never);
  };

  const handleGoHome = () => {
    navigation.navigate('MainTabs' as never);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#6200ee" />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

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
            source={require("../../assets/logo_etacarinae.png")}
          />
        </View>
      </LinearGradient>
      <View style={styles.container_propiedadesagentes}>
        <Text style={styles.title}>Propiedades del Agente</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddPropiedad}>
          <Text style={styles.addButtonText}>Agregar Propiedad</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
          <Text style={styles.homeButtonText}>Ir al Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
        <FlatList
          data={propiedades}
          keyExtractor={(item) => item.id.toString()}
          
          renderItem={({ item }) => (
            <View style={styles.propiedadContainer}>
              <Text style={styles.propiedadTitle}>{item.nombre_propiedad}</Text>
              <Text style={styles.propiedadDetail}>{item.direccion}</Text>
              <Text style={styles.propiedadDetail}>Precio: ${item.precio}</Text>
              <Text style={styles.propiedadDetail}>Habitaciones: {item.habitaciones}</Text>
              <Text style={styles.propiedadDetail}>Baños: {item.baños}</Text>
              <Text style={styles.propiedadDetail}>Tamaño del terreno: {item.tamaño_terreno} m²</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
              >
                <Icon name="delete" size={24} color="#ffffff" />
                <Text style={styles.deleteText}>Eliminar</Text>
              </TouchableOpacity>
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
  container: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
},
  container_propiedadesagentes: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  homeButton: {
    backgroundColor: '#2196f3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  homeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  propiedadContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  propiedadTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  propiedadDetail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  error: {
    color: '#d32f2f',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default PantallaAgente;
