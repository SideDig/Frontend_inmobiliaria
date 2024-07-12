import React, { createContext, useState, useContext, ReactNode } from 'react';
import api from '../conexionApi/axios';

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
  registrarUsuario: (data: RegistroData) => Promise<void>;
  iniciarSesion: (data: LoginData) => Promise<void>;
  
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);

  const registrarUsuario = async (data: RegistroData): Promise<void> => {
    try {
      const response = await api.post('/register', data);
      setUser(response.data as UserData);
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  };

  const iniciarSesion = async (data: LoginData): Promise<void> => {
    try {
      const response = await api.post('/login', data);
      setUser(response.data as UserData);
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, registrarUsuario, iniciarSesion}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  return useContext(AuthContext);
};
