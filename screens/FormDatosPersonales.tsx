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
import React from "react";
import { Button } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";

const FormDatosPersonales: React.FC = () => {
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
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Numero de telefono</Text>
              <TextInput
                style={styles.input}
                placeholder="Numero de telefono"
                maxLength={10}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>CURP</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu CURP"
                keyboardType="default"
                maxLength={18}
              />
            </View>

            <Text style={styles.titulo_form}>Datos personales</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Estado</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu estado"
                keyboardType="default"
                maxLength={18}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ciudad</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu ciudad"
                keyboardType="default"
                maxLength={18}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Direccion</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu direccion"
                keyboardType="default"
                maxLength={18}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Codigo postal</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu codigo postal"
                keyboardType="default"
                maxLength={18}
              />
            </View>
            <Text>Al hacer clic en Ingresar, acepta nuestros Términos de servicio y Política de privacidad</Text>
            <Button
              title="Login"
              buttonStyle={styles.button}
              titleStyle={styles.buttonTitle}
              containerStyle={styles.buttonContainer}
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
    fontWeight:"bold"
  },
  input: {
    height: 45,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  inputsContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
  },
  titulo_form: {
    fontWeight: "bold",
    fontSize: 25,
    marginVertical: 20,
    textAlign: 'center',
  },
  button: {
    width: 250,
    height: 50,
    backgroundColor: "#001061",
    borderRadius: 10,
  },
  buttonTitle: {
    fontWeight: "500",
    fontSize: 17,
    color: "white",
    borderRadius: 20,
  },
  buttonContainer: {
    marginVertical: 20,
    height: 100,
    width: 250,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FormDatosPersonales;
