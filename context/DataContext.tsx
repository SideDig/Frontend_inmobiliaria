import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../conexionApi/axios'; // Asegúrate de que la ruta sea correcta
import { useAuth } from '../context/AuthContext';
import { PreferenciasuseContext } from '../context/PreferenciasContext';
import { Alert } from 'react-native';

export interface Propiedad {
  id: number;
  nombre_propiedad: string;
  direccion: string;
  descripcion: string;
  precio: number;
  agente_id: number;
  habitaciones: number;
  baños: number;
  tamaño_terreno: number;
  caracteristicas: string;
  ubicacion: string;
  imagen?: string;
}

interface DataContextProps {
  propiedades: Propiedad[];
  fetchPropiedades: () => void;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const { address } = PreferenciasuseContext();
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);

  const fetchPropiedades = async () => {
    try {
      const response = await api.get('/propiedades/ubicacion', {
        params: { ubicacion: address },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPropiedades(response.data);
    } catch (error) {
      console.error('Error al obtener propiedades:', error);
      Alert.alert('Error', 'No se pudieron obtener las propiedades. Verifica tu conexión.');
    }
  };

  useEffect(() => {
    if (address) {
      fetchPropiedades();
    }
  }, [address, token]);

  return (
    <DataContext.Provider value={{ propiedades, fetchPropiedades }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};
