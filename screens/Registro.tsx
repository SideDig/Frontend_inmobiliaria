import {
  Text,
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  StatusBar,
  TextInput,
} from "react-native";
import { Button } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";

export default function Registro() {
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

      <View style={styles.inputsContainer}>
        <Text style={styles.titulo_form}>Registro</Text>
        <Text style={styles.subtitulo}>Bienvenido crea una cuenta para continuar</Text>
        <TextInput style={styles.input} placeholder="Nombre" />
        <TextInput style={styles.input} placeholder="Correo electronico" />
        <TextInput style={styles.input} placeholder="Contraseña" />
        <TextInput style={styles.input} placeholder="Confirmar contraseña" />
        <Button
            title="Regístrate"
            buttonStyle={styles.button}
            titleStyle={styles.buttonTitle}
            containerStyle={styles.buttonContainer}
          />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 500,
    height: 300,
    resizeMode: "contain",
    marginBottom: 40,
  },
  input: {
    height: 45,
    width: 350,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  inputsContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  titulo_form: {
    fontWeight: "bold",
    fontSize: 25,
    marginVertical: 10,
  },
  subtitulo:{
    fontSize:13,
    opacity:0.5,
    marginVertical:5
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
    marginVertical:20,
    height: 100,
    width: 250,
  },
});
