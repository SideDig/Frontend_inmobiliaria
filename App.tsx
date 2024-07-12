import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import  PrimerPantalla from './screens/PrimerPantalla';
import Login from './screens/Login';
import Registro from './screens/Registro';



const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={PrimerPantalla} options={{headerShown: false}} />
        <Stack.Screen name="Registro" component={Registro} options={{headerShown: false}} />
        <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}