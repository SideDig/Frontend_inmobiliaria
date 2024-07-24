import React, { useState } from "react";
import { Text, StyleSheet, View, Image, SafeAreaView, StatusBar, TextInput, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from "react-native";
import MapView, { Marker, MapPressEvent } from "react-native-maps";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';

// Definición de tipos
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

const FormDatosPersonales: React.FC = () => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [address, setAddress] = useState<string>("");
  const [mapRegion, setMapRegion] = useState<MapRegion>({
    latitude: 23.868667894047714,
    longitude: -102.70353657966429,
    latitudeDelta: 20.0922,
    longitudeDelta: 0.0421
  });
  const [isMapVisible, setIsMapVisible] = useState<boolean>(false);

  const showAlert = (title: string, message: string) => {
    Dialog.show({
      type: ALERT_TYPE.WARNING,
      title: title,
      textBody: message,
      button: 'cerrar',
    });
  };

  const getCoordinatesFromAddress = async (address: string) => {
    if (!address.trim()) {
      showAlert("Error", "Por favor, ingresa una dirección válida.");
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
          longitudeDelta: mapRegion.longitudeDelta
        });
        setLocation({ latitude: lat, longitude: lng });
      } else {
        showAlert("No se encontraron resultados", "No se pudo encontrar la dirección proporcionada.");
      }
    } catch (error) {
      console.error("Error fetching coordinates", error);
      showAlert("Error", "No se pudo obtener las coordenadas. Inténtalo de nuevo.");
    }
  };

  // Función para obtener dirección a partir de coordenadas
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

        // Construir la dirección deseada (colonia y municipio)
        let address = '';
        if (neighbourhood) {
          address += neighbourhood;
        } else if (suburb) {
          address += suburb;
        }
        if (state_district) {
          address += (address ? ', ' : '') + state_district;
        }

        setAddress(address || "Dirección no encontrada");
        if (!address) {
          showAlert("Ubicación no encontrada", "Si no se encontró la ubicación, ingresa manualmente la ubicación.");
        }
      } else {
        console.error("No address found for these coordinates");
        setAddress("Dirección no encontrada");
      }
    } catch (error) {
      console.error("Error fetching address", error);
      setAddress("Error al obtener dirección");
      showAlert("Error", "Error al obtener dirección");
    }
  };

  const handleMapPress = (event: MapPressEvent) => {
    const { coordinate } = event.nativeEvent;
    setLocation(coordinate);
    setMapRegion({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      latitudeDelta: mapRegion.latitudeDelta,
      longitudeDelta: mapRegion.longitudeDelta
    });

    // Llama a la función de geocodificación inversa para obtener la dirección
    reverseGeocode(coordinate.latitude, coordinate.longitude);
  };

  return (
    <AlertNotificationRoot>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          translucent={false}
          barStyle="light-content"
          backgroundColor="rgba(7,11,31,1)"
        />
        <LinearGradient
          colors={["rgba(7,11,31,1)", "rgba(21,51,210,1)"]}
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

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
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
                
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={() => setIsMapVisible(!isMapVisible)}
                >
                  <Text style={styles.buttonTitle}>
                    {isMapVisible ? "Ocultar Mapa" : "Mostrar Mapa"}
                  </Text>
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
  },
  inputGroup: {
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  label: {
    textAlign: "left",
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#001061",
    borderRadius: 5,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginVertical:20,
  },
  buttonTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  toggleButton: {
    backgroundColor: "#001061",
    borderRadius: 5,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  mapContainer: {
    width: "90%",
    height: 400,
    borderColor: "black",
    marginTop: 10,
  },
  map: {
    flex: 1,
  },
  inputsContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  titulo_form: {
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 25,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
});

export default FormDatosPersonales;
