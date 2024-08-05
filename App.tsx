import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import PrimerPantalla from './screens/PrimerPantalla';
import Login from './screens/Login';
import Registro from './screens/Registro';
import FormDatosPersonales from './screens/FormDatosPersonales';
import PreferenciasUsuario from './screens/PreferenciasUsuario';
import PerfilUsuario from './screens/PerfilUsuario';
import CrearPresupuesto from './screens/CrearPresupuesto';
import Inicio from './screens/Inicio';
import DetallesPropiedad from './screens/DetallesPropiedad';
import { AuthProvider } from './context/AuthContext';
import { UbicacionProvider } from './context/UbicacionContext';
import { PreferenciasProvider } from './context/MapaContext';
import { DataProvider } from './context/DataContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string = 'default-icon';
          if (route.name === 'HomeTab') {
            iconName = 'home-outline';
          } else if (route.name === 'PreferenciasUsuarioTab') {
            iconName = 'filter';
          } else if (route.name === 'PerfilUsuarioTab') {
            iconName = 'person-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'rgba(21,51,210,1)',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 50,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: 'bold',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomeTab" component={Inicio} options={{ tabBarLabel: 'Inicio' }} />
      <Tab.Screen name="PreferenciasUsuarioTab" component={PreferenciasUsuario} options={{ tabBarLabel: 'Preferencias' }} />
      <Tab.Screen name="PerfilUsuarioTab" component={PerfilUsuario} options={{ tabBarLabel: 'Perfil' }} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <UbicacionProvider>
        <PreferenciasProvider>
          <DataProvider>
            <NavigationContainer>
              <Stack.Navigator>
                {/* <Stack.Screen name="Home" component={PrimerPantalla} options={{ headerShown: false }} />
                <Stack.Screen name="Registro" component={Registro} options={{ headerShown: false }} />
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                <Stack.Screen name="FormDatosPersonales" component={FormDatosPersonales} options={{ headerShown: false }} />
                <Stack.Screen name="PreferenciasUsuario" component={PreferenciasUsuario} options={{ headerShown: false }} />  */}
                <Stack.Screen name="Inicio" component={Tabs} options={{ headerShown: false }} />
                <Stack.Screen name="DetallesPropiedad" component={DetallesPropiedad} options={{ headerShown: false }} /> 
                <Stack.Screen name="CrearPresupuesto" component={CrearPresupuesto} options={({ navigation }) => ({ headerTitle: "Crear presupuesto", headerLeft: () => ( <Icon.Button name="arrow-back" size={25} backgroundColor="#fff" color="#000" onPress={() => navigation.goBack()}/>),})}/>
              </Stack.Navigator>
            </NavigationContainer>
          </DataProvider>
        </PreferenciasProvider>
      </UbicacionProvider>
    </AuthProvider>
  );
};

export default App;
