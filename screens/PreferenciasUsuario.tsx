import React, { useState, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import api from '../conexionApi/axios';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { Button } from '@rneui/themed';
import { Picker } from '@react-native-picker/picker';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';
import { useAuth } from '../context/AuthContext';
import { PreferenciasuseContext } from '../context/MapaContext';
import { useNavigation } from '@react-navigation/native';
import { useDataContext } from '../context/DataContext';

const PreferenciasUsuario: React.FC = () => {
  const { token, user, updateUserPreferences } = useAuth();
  const {
    location,
    setLocation,
    address,
    setAddress,
    mapRegion,
    setMapRegion,
    isMapVisible,
    setIsMapVisible,
    selectedRooms,
    setSelectedRooms,
  } = PreferenciasuseContext();
  const navigation = useNavigation();
  const [precioDesde, setPrecioDesde] = useState('');
  const [precioHasta, setPrecioHasta] = useState('');
  const { fetchPropiedades } = useDataContext();

  useEffect(() => {
    if (user) {
      setAddress(user.ubicacion_casa || '');
      setSelectedRooms((user.num_recamaras || '').toString());
      setPrecioDesde((user.precio_desde || '').toString());
      setPrecioHasta((user.precio_hasta || '').toString());
    }
  }, [user]);

  const showAlertSuccess = (title: string, message: string) => {
    Dialog.show({
      type: ALERT_TYPE.SUCCESS,
      title: title,
      textBody: message,
      button: 'Cerrar',
    });
  };

  const showAlertWarning = (title: string, message: string) => {
    Dialog.show({
      type: ALERT_TYPE.WARNING,
      title: title,
      textBody: message,
      button: 'Cerrar',
    });
  };

  const getCoordinatesFromAddress = async (address: string) => {
    if (!address.trim()) {
      showAlertWarning('Error', 'Por favor, ingresa una dirección válida.');
      return;
    }

    try {
      const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
        params: {
          q: encodeURIComponent(address),
          key: '02883607502f46e8ac4aef1f6e54bcb6',
        },
      });

      const { results } = response.data;
      if (results.length > 0) {
        const { geometry } = results[0];
        const { lat, lng } = geometry;

        setMapRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta: mapRegion.latitudeDelta,
          longitudeDelta: mapRegion.longitudeDelta,
        });
        setLocation({ latitude: lat, longitude: lng });
      } else {
        showAlertWarning('No se encontraron resultados', 'No se pudo encontrar la dirección proporcionada.');
      }
    } catch (error) {
      console.error('Error fetching coordinates', error);
      showAlertWarning('Error', 'No se pudo obtener las coordenadas. Inténtalo de nuevo.');
    }
  };

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
        params: {
          q: `${latitude},${longitude}`,
          key: '02883607502f46e8ac4aef1f6e54bcb6',
        },
      });

      const { results } = response.data;
      if (results.length > 0) {
        const components = results[0].components;
        const { suburb, neighbourhood, state_district } = components;

        let address = '';
        if (neighbourhood) {
          address += neighbourhood;
        } else if (suburb) {
          address += suburb;
        }
        if (state_district) {
          address += (address ? ', ' : '') + state_district;
        }

        setAddress(address || 'Dirección no encontrada');
        if (!address) {
          showAlertWarning('Ubicación no encontrada', 'Si no se encontró la ubicación, ingresa manualmente la ubicación.');
        }
      } else {
        console.error('No address found for these coordinates');
        setAddress('Dirección no encontrada');
      }
    } catch (error) {
      console.error('Error fetching address', error);
      setAddress('Error al obtener dirección');
      showAlertWarning('Error', 'Error al obtener dirección');
    }
  };

  const handleMapPress = (event: MapPressEvent) => {
    const { coordinate } = event.nativeEvent;
    setLocation(coordinate);
    setMapRegion({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      latitudeDelta: mapRegion.latitudeDelta,
      longitudeDelta: mapRegion.longitudeDelta,
    });

    reverseGeocode(coordinate.latitude, coordinate.longitude);
  };

  const validateForm = async () => {
    if (!address.trim()) {
      showAlertWarning('Error', 'Por favor, ingresa una dirección válida.');
      return false;
    }

    try {
      const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
        params: {
          q: encodeURIComponent(address),
          key: '02883607502f46e8ac4aef1f6e54bcb6',
        },
      });

      const { results } = response.data;
      if (results.length === 0) {
        showAlertWarning('Error', 'La dirección ingresada no es válida.');
        return false;
      }
    } catch (error) {
      console.error('Error validating address', error);
      showAlertWarning('Error', 'No se pudo validar la dirección. Inténtalo de nuevo.');
      return false;
    }

    if (!precioDesde.trim() || !precioHasta.trim()) {
      showAlertWarning('Error', 'Por favor, ingresa un rango de precios válido.');
      return false;
    }

    const precioDesdeNum = parseFloat(precioDesde);
    const precioHastaNum = parseFloat(precioHasta);

    if (precioDesdeNum > precioHastaNum) {
      showAlertWarning('Error', 'El precio "Hasta" debe ser mayor que el precio "Desde".');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!(await validateForm())) {
      return;
    }

    try {
      const response = await api.post('/usuarios/completarPreferenciasUsuario', {
        ubicacion_casa: address,
        num_recamaras: selectedRooms,
        precio_desde: precioDesde,
        precio_hasta: precioHasta,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.message) {
        showAlertSuccess('Éxito', response.data.message);
        await updateUserPreferences({
          ubicacion_casa: address,
          num_recamaras: parseInt(selectedRooms),
          precio_desde: parseFloat(precioDesde),
          precio_hasta: parseFloat(precioHasta),
        });
        await fetchPropiedades(parseFloat(precioDesde), parseFloat(precioHasta), parseInt(selectedRooms));
        navigation.navigate('Inicio' as never);
      }
    } catch (error) {
      console.error('Error al completar las preferencias:', error);
      showAlertWarning('Error', 'Ocurrió un error al completar las preferencias.');
    }
  };

  return (
    <AlertNotificationRoot>
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

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingView}>
          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <View style={styles.inputsContainer}>
              <Text style={styles.titulo_form}>Preferencias</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>¿Dónde te gustaría la vivienda?</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa tu ubicación"
                  value={address}
                  onChangeText={setAddress}
                />
                <TouchableOpacity style={styles.toggleButton} onPress={() => setIsMapVisible(!isMapVisible)}>
                  <Text style={styles.buttonTitle}>{isMapVisible ? 'Ocultar Mapa' : 'Mostrar Mapa'}</Text>
                </TouchableOpacity>
              </View>

              {isMapVisible && (
                <View style={styles.mapContainer}>
                  <TouchableOpacity style={styles.button} onPress={() => getCoordinatesFromAddress(address)}>
                    <Text style={styles.buttonTitle}>Seleccionar ubicación</Text>
                  </TouchableOpacity>
                  <MapView
                    style={styles.map}
                    region={mapRegion}
                    onRegionChangeComplete={setMapRegion}
                    onPress={handleMapPress}
                  >
                    {location && <Marker coordinate={location} />}
                  </MapView>
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>¿Cuántas recámaras?</Text>
                <View style={styles.pickerContenedor}>
                  <Picker
                    selectedValue={selectedRooms}
                    onValueChange={(itemValue: string) => setSelectedRooms(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="1 recámara" value="1" />
                    <Picker.Item label="2 recámaras" value="2" />
                    <Picker.Item label="3 recámaras" value="3" />
                    <Picker.Item label="4 recámaras" value="4" />
                    <Picker.Item label="5 recámaras" value="+5" />
                  </Picker>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>¿Precio?</Text>
                <View style={styles.contenedor_Precio}>
                  <Text>Desde:</Text>
                  <TextInput
                    style={styles.input_Desde}
                    placeholder="Desde"
                    keyboardType="numeric"
                    value={precioDesde}
                    onChangeText={setPrecioDesde}
                  />
                  <Text>Hasta:</Text>
                  <TextInput
                    style={styles.input_hasta}
                    placeholder="Hasta"
                    keyboardType="numeric"
                    value={precioHasta}
                    onChangeText={setPrecioHasta}
                  />
                </View>
              </View>
              <Button
                title="Ingresar"
                buttonStyle={styles.button}
                titleStyle={styles.buttonTitle}
                containerStyle={styles.buttonContainer}
                onPress={handleSubmit}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AlertNotificationRoot>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  buttonContainer: {
    width: '80%',
    marginVertical: 20,
  },
  container: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 300,
    resizeMode: 'contain',
  },
  inputGroup: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  label: {
    textAlign: 'left',
    marginTop: 15,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    fontSize: 15,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#001061',
    borderRadius: 5,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginVertical: 20,
  },
  buttonTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleButton: {
    backgroundColor: '#001061',
    borderRadius: 5,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  mapContainer: {
    width: '90%',
    height: 400,
    borderColor: 'black',
    marginTop: 10,
  },
  map: {
    flex: 1,
  },
  inputsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  titulo_form: {
    fontWeight: 'bold',
    fontSize: 20,
    marginVertical: 25,
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  picker: {
    width: '100%',
    borderRadius: 5,
  },
  pickerContenedor: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ddd',
  },
  contenedor_Precio: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input_Desde: {
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    fontSize: 15,
    paddingHorizontal: 20,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  input_hasta: {
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    fontSize: 15,
    paddingHorizontal: 20,
    marginVertical: 10,
    marginHorizontal:10,
  },
});

export default PreferenciasUsuario;
