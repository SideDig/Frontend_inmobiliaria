import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import api from '../conexionApi/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RegistroData {
  nombre: string;
  email: string;
  contrasena: string;
}

interface LoginData {
  email: string;
  contrasena: string;
}

interface UserData {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  contrasena: string;
  rol: 'agente' | 'cliente';
  total_ventas: number;
  num_propiedades: number;
  nombre_usuario: string;
  nombre_completo: string;
  curp: string;
  estado: string;
  ciudad: string;
  direccion: string;
  codigo_postal: string;
  ubicacion_casa: string;
  num_recamaras: number;
  precio_desde: number;
  precio_hasta: number;
}

interface AuthContextData {
  user: UserData | null;
  token: string | null;
  isNewUser: boolean;
  registrarUsuario: (data: RegistroData) => Promise<void>;
  iniciarSesion: (data: LoginData) => Promise<void>;
  cerrarSesion: () => Promise<void>;
  cargarUsuario: () => Promise<void>;
  updateUserPreferences: (preferences: Partial<UserData>) => Promise<void>; // Nueva función
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);

  useEffect(() => {
    cargarUsuario();
  }, []);

  const registrarUsuario = async (data: RegistroData): Promise<void> => {
    try {
      const response = await api.post('/register', data);
      const { token, ...userData } = response.data;
      setUser(userData as UserData);
      setToken(token);
      setIsNewUser(true);
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Ocurrió un error durante el registro.';
      throw new Error(errorMessage);
    }
  };

  const iniciarSesion = async (data: LoginData): Promise<void> => {
    try {
      const response = await api.post('/login', data);
      const { token, ...userData } = response.data;
      setUser(userData as UserData);
      setToken(token);
      setIsNewUser(false);
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Ocurrió un error durante el inicio de sesión.';
      throw new Error(errorMessage);
    }
  };

  const cerrarSesion = async (): Promise<void> => {
    setUser(null);
    setToken(null);
    setIsNewUser(false);
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
  };

  const cargarUsuario = async (): Promise<void> => {
    const storedToken = await AsyncStorage.getItem('userToken');
    const storedUserData = await AsyncStorage.getItem('userData');
    if (storedToken && storedUserData) {
      try {
        const response = await api.get('/verifyToken', {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        });
        setUser(JSON.parse(storedUserData) as UserData);
        setToken(storedToken);
      } catch (error: any) {
        await cerrarSesion();
      }
    }
  };

  const updateUserPreferences = async (preferences: Partial<UserData>): Promise<void> => {
    if (!user) return;

    const updatedUser = { ...user, ...preferences };
    setUser(updatedUser);
    await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, isNewUser, registrarUsuario, iniciarSesion, cerrarSesion, cargarUsuario, updateUserPreferences }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  return useContext(AuthContext);
};
