import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../conexionApi/axios';
import { Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { DataContextProps, Propiedad, MaestroAlbanilItem, Category, Item } from '../types';

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { token, user } = useAuth();
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [otrasPropiedades, setOtrasPropiedades] = useState<Propiedad[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [maestrosAlbaniles, setMaestrosAlbaniles] = useState<MaestroAlbanilItem[]>([]);

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

  const fetchCategories = async () => {
    try {
      const response = await api.get('/item/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error al obtener categorías e ítems:', error);
    }
  };

  const fetchMaestrosParaItem = async (itemId: number) => {
    try {
      const response = await api.get(`/albaniles/item/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener maestros albañiles:', error);
      return [];
    }
  };

  const savePresupuesto = async (
    cliente_id: number,
    propiedad_id: number,
    agente_id: number,
    total: number,
    selectedItems: Item[],
    selectedBuilders: { [key: number]: string }
  ) => {
    try {
      const response = await api.post('/presupuestos', {
        cliente_id,
        propiedad_id,
        agente_id,
        total,
        fecha_creacion: new Date().toISOString(),
      });

      const presupuestoId = response.data.id;

      await Promise.all(selectedItems.map(async (item) => {
        const builderId = selectedBuilders[item.id];
        if (builderId) {
          const maestro = maestrosAlbaniles.find(m => m.id.toString() === builderId);
          if (maestro) {
            await api.post('/detalles_presupuesto', {
              presupuesto_id: presupuestoId,
              trabajo_maestro_albanil_id: maestro.id,
              costo_estimado: maestro.costo_estimado,
              tiempo_estimado: maestro.tiempo_estimado,
            });
          }
        }
      }));

      Alert.alert('Éxito', 'Presupuesto guardado correctamente.');
    } catch (error) {
      console.error('Error al guardar el presupuesto:', error);
      Alert.alert('Error', 'Hubo un problema al guardar el presupuesto.');
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchPropiedades();
      fetchCategories();
    }
  }, [user, token]);

  return (
    <DataContext.Provider value={{ propiedades, otrasPropiedades, categories, maestrosAlbaniles, fetchPropiedades, fetchPropiedad, fetchMaestrosParaItem, savePresupuesto }}>
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
