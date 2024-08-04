import React from "react";
import { Button } from "@rneui/themed";
import { 
  Text, 
  StyleSheet, 
  View, 
  SafeAreaView, 
  StatusBar, 
  Image 
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from '@react-navigation/native';  

export default function PrimerPantalla() {
  const navigation = useNavigation();

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
          <Button
              onPress={() => navigation.navigate("Registro" as never)}
            title="Regístrate"
            buttonStyle={styles.button}
            titleStyle={styles.buttonTitle}
            containerStyle={styles.buttonContainer}
          />
          <Button
             onPress={() => navigation.navigate("Login" as never)}
            title="Inicia sesión"
            buttonStyle={styles.button}
            titleStyle={styles.buttonTitle}
            containerStyle={styles.buttonContainer}
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
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
    marginBottom: 130 ,
  },
  button: {
    width: 250,
    height: 50,
    backgroundColor: "white",
    borderRadius: 5,
  },
  buttonTitle: {
    fontWeight: "500",
    fontSize: 17,
    color: "black",
    borderRadius: 5,
  },
  buttonContainer: {
    height: 80,
    width: 250,
    borderRadius: 5,
  },
});
