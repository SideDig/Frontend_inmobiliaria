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
  // Agrega más campos según sea necesario
}

interface AuthContextData {
  user: UserData | null;
  token: string | null;
  registrarUsuario: (data: RegistroData) => Promise<void>;
  iniciarSesion: (data: LoginData) => Promise<void>;
  cerrarSesion: () => Promise<void>;
  cargarUsuario: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    cargarUsuario();
  }, []);

  const registrarUsuario = async (data: RegistroData): Promise<void> => {
    try {
      const response = await api.post('/register', data);
      const { token, ...userData } = response.data;
      setUser(userData);
      setToken(token);
      await AsyncStorage.setItem('userToken', token);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Ocurrió un error durante el registro.';
      throw new Error(errorMessage);
    }
  };

  const iniciarSesion = async (data: LoginData): Promise<void> => {
    try {
      const response = await api.post('/login', data);
      const { token, ...userData } = response.data;
      setUser(userData);
      setToken(token);
      await AsyncStorage.setItem('userToken', token);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Ocurrió un error durante el inicio de sesión.';
      throw new Error(errorMessage);
    }
  };

  const cerrarSesion = async (): Promise<void> => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem('userToken');
  };

  const cargarUsuario = async (): Promise<void> => {
    const storedToken = await AsyncStorage.getItem('userToken');
    if (storedToken) {
      try {
        const response = await api.get('/verifyToken', {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        });
        setUser(response.data);
        setToken(storedToken);
      } catch (error: any) {
        await cerrarSesion();
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, registrarUsuario, iniciarSesion, cerrarSesion, cargarUsuario }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  return useContext(AuthContext);
};