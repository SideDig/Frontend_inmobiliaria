import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../conexionApi/axios';
import { useAuth } from '../context/AuthContext';
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
  fetchPropiedades: (precioDesde?: number, precioHasta?: number, numRecamaras?: number) => void;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user } = useAuth();
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);

  const fetchPropiedades = async (precioDesde?: number, precioHasta?: number, numRecamaras?: number) => {
    try {
      const response = await api.get('/propiedades/ubicacion', {
        params: { 
          ubicacion: user?.ubicacion_casa, 
          precioDesde: precioDesde || user?.precio_desde, 
          precioHasta: precioHasta || user?.precio_hasta, 
          numRecamaras: numRecamaras || user?.num_recamaras 
        },
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
    if (user && token) {
      fetchPropiedades();
    }
  }, [user, token]);

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
