import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, SafeAreaView, StatusBar, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Cards from '../components/Cards';
import Cardsopciones from '../components/CardOpciones';
import { useDataContext } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const Inicio: React.FC = () => {
  const { propiedades, otrasPropiedades, fetchPropiedades } = useDataContext();
  const { user, isNewUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    if (user) {
      await fetchPropiedades(user.precio_desde, user.precio_hasta, user.num_recamaras);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    if (user) {
      fetchPropiedades(user.precio_desde, user.precio_hasta, user.num_recamaras);
    }
  }, [user]);

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
          <Image style={styles.logo} source={require('../assets/logo_etacarinae.png')} />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollViewContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <Text style={styles.welcomeText}>{isNewUser ? 'Hola, Bienvenido' : 'Bienvenido de vuelta'}</Text>
          <Text>{user ? user.nombre_completo : 'Usuario'}</Text>
        </View>

        <Text style={styles.titulos_seciones}>Recomendados para ti</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recomendaciones_parati}>
          {propiedades.map((propiedad, index) => (
            <Cards key={index} propiedad={propiedad} />
          ))}
        </ScrollView>

        <Text style={styles.titulos_seciones}>Otras opciones</Text>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.otras_opciones}>
          {otrasPropiedades.map((propiedad, index) => (
            <Cardsopciones key={index} propiedad={propiedad} />
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContainer: {
    marginHorizontal: 15,
    flexGrow: 1,
  },
  header: {
    marginTop: 20,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  logo: {
    width: 120,
    height: 300,
    resizeMode: 'contain',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '300',
  },
  titulos_seciones: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  recomendaciones_parati: {
    flexDirection: 'row',
  },
  otras_opciones: {
    flexDirection: 'column',
  },
});

export default Inicio;
