import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../conexionApi/axios';
import { useAuth } from '../context/AuthContext';
import { Alert } from 'react-native';

export interface Agente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  total_ventas: number;
  num_propiedades: number;
}

export interface Propiedad {
  id: number;
  nombre_propiedad: string;
  direccion: string;
  descripcion: string;
  precio: number;
  agente: Agente;  // Cambia de agente_id a agente
  habitaciones: number;
  baños: number;
  tamaño_terreno: number;
  caracteristicas: string[];
  ubicacion: string;
  imagen?: string;
}

interface DataContextProps {
  propiedades: Propiedad[];
  otrasPropiedades: Propiedad[];
  fetchPropiedades: (precioDesde?: number, precioHasta?: number, numRecamaras?: number) => void;
  fetchPropiedad: (propiedadId: number) => Promise<Propiedad | null>;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user } = useAuth();
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [otrasPropiedades, setOtrasPropiedades] = useState<Propiedad[]>([]);

  const fetchPropiedades = async (precioDesde?: number, precioHasta?: number, numRecamaras?: number) => {
    try {
      const responseRecomendadas = await api.get('/propiedades/ubicacion', {
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
      setPropiedades(responseRecomendadas.data);

      const responseOtras = await api.get('/propiedades/ubicacion', {
        params: { ubicacion: user?.ubicacion_casa },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOtrasPropiedades(responseOtras.data);
    } catch (error) {
      console.error('Error al obtener propiedades:', error);
      Alert.alert('Error', 'No se pudieron obtener las propiedades. Verifica tu conexión.');
    }
  };

  const fetchPropiedad = async (propiedadId: number): Promise<Propiedad | null> => {
    try {
      const response = await api.get(`/propiedades/${propiedadId}`);
      const data = response.data;
  
      // Convierte caracteristicas de una cadena a un array
      const caracteristicasArray = data.caracteristicas.split(',').map((item: string) => item.trim());
  
      return {
        ...data,
        caracteristicas: caracteristicasArray,
        agente: {
          id: data.agente_id,
          nombre: data.agente_nombre,
          email: data.agente_email,
          telefono: data.agente_telefono,
          total_ventas: data.agente_total_ventas,
          num_propiedades: data.agente_num_propiedades,
        }
      };
    } catch (error) {
      console.error('Error al obtener los detalles de la propiedad:', error);
      return null;
    }
  };
  

  useEffect(() => {
    if (user && token) {
      fetchPropiedades();
    }
  }, [user, token]);

  return (
    <DataContext.Provider value={{ propiedades, otrasPropiedades, fetchPropiedades, fetchPropiedad }}>
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
