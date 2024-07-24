
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import PrimerPantalla from './screens/PrimerPantalla';
// import Login from './screens/Login';
// import Registro from './screens/Registro';
// import FormDatosPersonales from './screens/FormDatosPersonales';
import PreferenciasUsuario from './screens/PreferenciasUsuario';
import { AuthProvider } from './context/AuthContext';

const Stack = createStackNavigator();

const App = () => {
  return (
    <AuthProvider> 
      <NavigationContainer>
        <Stack.Navigator>
          {/* <Stack.Screen name="Home" component={PrimerPantalla} options={{headerShown: false}} />
          <Stack.Screen name="Registro" component={Registro} options={{headerShown: false}} />
          <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
          <Stack.Screen name="FormDatosPersonales" component={FormDatosPersonales} options={{headerShown: false}} /> */}
          <Stack.Screen name="PreferenciasUsuario" component={PreferenciasUsuario} options={{headerShown: false}} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
