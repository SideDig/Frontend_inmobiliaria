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
import PantallaAgente from './screens/agentes/PantallaAgente';
import InsertarPropiedades from './screens/agentes/InsertarPropiedades';
import PerfilUsuario from './screens/PerfilUsuario';
import CrearPresupuesto from './screens/CrearPresupuesto';
import Presupuestos from './screens/Presupuestos';
import Inicio from './screens/Inicio';
import DetallesPropiedad from './screens/DetallesPropiedad';
import { AuthProvider, useAuth } from './context/AuthContext';
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
          if (route.name === 'InicioTab') {
            iconName = 'home-outline';
          } else if (route.name === 'PreferenciasUsuarioTab') {
            iconName = 'filter';
          } else if (route.name === 'Presupuestos') {
            iconName = 'copy';
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
          height: 55,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: 'bold',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="InicioTab" component={Inicio} options={{ tabBarLabel: 'Inicio' }} />
      <Tab.Screen name="PreferenciasUsuarioTab" component={PreferenciasUsuario} options={{ tabBarLabel: 'Preferencias' }} />
      <Tab.Screen name="Presupuestos" component={Presupuestos} options={{ tabBarLabel: 'Presupuestos' }} />
      <Tab.Screen name="PerfilUsuarioTab" component={PerfilUsuario} options={{ tabBarLabel: 'Perfil' }} />
    </Tab.Navigator>
  );
};

const Lasrutasdetodalaaplicacion = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator>
      {!user ? (
        <>
          <Stack.Screen name="Home" component={PrimerPantalla} options={{ headerShown: false }} />
          <Stack.Screen name="Registro" component={Registro} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        </>
      ) : user.rol === 'agente' ? (
        <>
          <Stack.Screen name="PantallaAgente" component={PantallaAgente} options={{ headerShown: false }} />
          <Stack.Screen name="InsertarPropiedades" component={InsertarPropiedades} options={{ headerShown: false }} />
          <Stack.Screen name="MainTabs" component={Tabs} options={{ headerShown: false }} />
          <Stack.Screen name="FormDatosPersonales" component={FormDatosPersonales} options={{ headerShown: false }} />
          <Stack.Screen name="PreferenciasUsuario" component={PreferenciasUsuario} options={{ headerShown: false }} />
          <Stack.Screen name="DetallesPropiedad" component={DetallesPropiedad} options={{ headerShown: false }} />
          <Stack.Screen name="CrearPresupuesto" component={CrearPresupuesto} options={({ navigation }) => ({
            headerTitle: "Crear presupuesto", headerLeft: () => (<Icon.Button name="arrow-back" size={25} backgroundColor="#fff" color="#000" onPress={() => navigation.goBack()} />),
          })} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={Tabs} options={{ headerShown: false }} />
          <Stack.Screen name="FormDatosPersonales" component={FormDatosPersonales} options={{ headerShown: false }} />
          <Stack.Screen name="PreferenciasUsuario" component={PreferenciasUsuario} options={{ headerShown: false }} />
          <Stack.Screen name="DetallesPropiedad" component={DetallesPropiedad} options={{ headerShown: false }} />
          <Stack.Screen name="CrearPresupuesto" component={CrearPresupuesto} options={({ navigation }) => ({
            headerTitle: "Crear presupuesto", headerLeft: () => (<Icon.Button name="arrow-back" size={25} backgroundColor="#fff" color="#000" onPress={() => navigation.goBack()} />),
          })} />
        </>
      )}
    </Stack.Navigator>
  );
};


const App = () => {
  return (
    <AuthProvider>
      <UbicacionProvider>
        <PreferenciasProvider>
          <DataProvider>
            <NavigationContainer>
              <Lasrutasdetodalaaplicacion />
            </NavigationContainer>
          </DataProvider>
        </PreferenciasProvider>
      </UbicacionProvider>
    </AuthProvider>
  );
};

export default App;
