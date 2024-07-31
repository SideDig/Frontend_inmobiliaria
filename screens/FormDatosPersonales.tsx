// FormDatosPersonales.tsx
import React, { useState } from "react";
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
} from "react-native";
import { ExternalLink } from "../components/ExternalLink";
import api from '../conexionApi/axios'; 
import { Button } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../context/AuthContext'; 
import { useNavigation } from '@react-navigation/native';
import { useLocation } from '../context/UbicacionContext'; 

const FormDatosPersonales: React.FC = () => {
  const { user, token } = useAuth(); 
  const { states, cities, selectedState, setSelectedState, fetchCities } = useLocation();

  const [selectedCity, setSelectedCity] = useState<string>("");
  const [nombreCompleto, setNombreCompleto] = useState<string>("");
  const [telefono, setTelefono] = useState<string>("");
  const [curp, setCurp] = useState<string>("");
  const [direccion, setDireccion] = useState<string>("");
  const navigation = useNavigation();

  const handleFormSubmit = async () => {
    if (!token) {
      console.error("Token no disponible");
      return;
    }
  
    try {
      const stateName = states.find(state => state.ESTADO_ID === selectedState)?.ESTADO || "";
      const cityName = cities.find(city => city.MUNICIPIO_ID === selectedCity)?.MUNICIPIO || "";
  
      const response = await api.post(
        "/usuarios/completarDatosPersonales",
        {
          nombre_completo: nombreCompleto,
          telefono,
          curp,
          estado: stateName,
          ciudad: cityName,
          direccion,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Datos adicionales actualizados correctamente:", response.data);
      navigation.navigate('PreferenciasUsuario' as never); 
    } catch (error: any) {
      console.error("Error al completar datos adicionales:", error.response?.data || error.message);
    }
  };
  
  return (
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
            <Text style={styles.titulo_form}>Datos personales</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre Completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre completo"
                keyboardType="default"
                value={nombreCompleto}
                onChangeText={setNombreCompleto}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Numero de telefono</Text>
              <TextInput
                style={styles.input}
                placeholder="Numero de telefono"
                maxLength={10}
                keyboardType="numeric"
                value={telefono}
                onChangeText={setTelefono}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>CURP</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu CURP"
                keyboardType="default"
                maxLength={18}
                value={curp}
                onChangeText={setCurp}
              />
            </View>

            <Text style={styles.titulo_form}>Datos de dirección</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Estado</Text>
              <Picker
                selectedValue={selectedState}
                style={styles.picker}
                onValueChange={(itemValue: string) => setSelectedState(itemValue)}
              >
                <Picker.Item label="Selecciona un estado" value="" />
                {states.map((state) => (
                  <Picker.Item
                    key={state.ESTADO_ID}
                    label={state.ESTADO}
                    value={state.ESTADO_ID}
                  />
                ))}
              </Picker>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Municipio</Text>
              <Picker
                selectedValue={selectedCity}
                style={styles.picker}
                onValueChange={(itemValue: string) => setSelectedCity(itemValue)}
              >
                <Picker.Item label="Selecciona una ciudad" value="" />
                {cities.map((city) => (
                  <Picker.Item
                    key={city.MUNICIPIO_ID}
                    label={city.MUNICIPIO}
                    value={city.MUNICIPIO_ID}
                  />
                ))}
              </Picker>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dirección</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu dirección"
                keyboardType="default"
                value={direccion}
                onChangeText={setDireccion}
              />
            </View>

            <View style={styles.terminos_cond}>
              <Text style={{ textAlign: "center" }}>
                Al hacer clic en Ingresar, acepta nuestros{" "}
                <ExternalLink
                  style={{ fontWeight: 900 }}
                  href="https://tecnosoluciones.com/politicas-terminos-y-condiciones-de-uso-de-un-servicio-digital/"
                >
                  Términos de servicio y Política de privacidad
                </ExternalLink>
              </Text>
            </View>

            <Button
              title="Ingresar"
              buttonStyle={styles.button}
              titleStyle={styles.buttonTitle}
              containerStyle={styles.buttonContainer}
              onPress={handleFormSubmit}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  inputGroup: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  label: {
    textAlign: 'left',
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: 'white',
  },
  inputsContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
  },
  titulo_form: {
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 20,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  button: {
    backgroundColor: "rgba(7,11,31,1)",
    borderRadius: 5,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    width: "80%",
    marginVertical: 20,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  terminos_cond: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
});

export default FormDatosPersonales;
