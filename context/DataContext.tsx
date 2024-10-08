import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../conexionApi/axios';
import { Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { DataContextProps, Propiedad, MaestroAlbanilItem, Category, Item, Presupuesto } from '../types';

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { token, user } = useAuth();
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [otrasPropiedades, setOtrasPropiedades] = useState<Propiedad[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [maestrosAlbaniles, setMaestrosAlbaniles] = useState<MaestroAlbanilItem[]>([]);
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);

  const fetchPropiedades = async (precioDesde?: number, precioHasta?: number, numRecamaras?: number) => {
    try {
      if (!user) return;
      const responseRecomendadas = await api.get('/propiedades/ubicacion', {
        params: {
          ubicacion: user.ubicacion_casa,
          precioDesde: precioDesde || user.precio_desde,
          precioHasta: precioHasta || user.precio_hasta,
          numRecamaras: numRecamaras || user.num_recamaras,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPropiedades(responseRecomendadas.data);

      const responseOtras = await api.get('/propiedades/ubicacion', {
        params: { ubicacion: user.ubicacion_casa },
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
        },
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

  const fetchPresupuestosUsuario = async () => {
    try {
      if (!user) return;
      const response = await api.get(`/presupuestos/usuario/${user.id}`);
      setPresupuestos(response.data);
    } catch (error) {
      console.error('Error fetching presupuestos:', error);
    }
  };

  const deletePresupuesto = async (presupuestoId: number) => {
    try {
      await api.delete(`/presupuestos/${presupuestoId}`);
      setPresupuestos((prevPresupuestos) =>
        prevPresupuestos.filter((presupuesto) => presupuesto.id !== presupuestoId)
      );
      Alert.alert('Éxito', 'Presupuesto eliminado correctamente.');
    } catch (error) {
      console.error('Error al eliminar el presupuesto:', error);
      Alert.alert('Error', 'No se pudo eliminar el presupuesto. Inténtalo de nuevo.');
    }
  };

  const deletePropiedad = async (propiedadId: number) => {
    try {
      await api.delete(`/propiedades/${propiedadId}`);
      setPropiedades((prevPropiedades) =>
        prevPropiedades.filter((propiedad) => propiedad.id !== propiedadId)
      );
      setOtrasPropiedades((prevPropiedades) =>
        prevPropiedades.filter((propiedad) => propiedad.id !== propiedadId)
      );
      Alert.alert('Éxito', 'Propiedad eliminada correctamente.');
    } catch (error) {
      console.error('Error al eliminar la propiedad:', error);
      Alert.alert('Error', 'No se pudo eliminar la propiedad. Inténtalo de nuevo.');
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
        items: selectedItems,
        builders: selectedBuilders,
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

      await api.post('/correos/enviar', {
        presupuesto_id: presupuestoId,
        cliente_id,
      });

      return presupuestoId;

    } catch (error) {
      console.error('Error al guardar el presupuesto o enviar el correo:', error);
      Alert.alert('Error', 'Hubo un problema al guardar el presupuesto o enviar el correo.');
      throw error;
    }
  };

  const fetchPropiedadesPorAgente = async (agenteId: number): Promise<Propiedad[]> => {
    try {
      const response = await api.get(`/propiedades/agente/${agenteId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener propiedades del agente:', error);
      Alert.alert('Error', 'No se pudieron obtener las propiedades del agente.');
      return [];
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchPropiedades();
      fetchCategories();
      fetchPresupuestosUsuario();
    }
  }, [user, token]);

  return (
    <DataContext.Provider value={{
      propiedades,
      otrasPropiedades,
      categories,
      maestrosAlbaniles,
      fetchPropiedades,
      fetchPropiedad,
      fetchMaestrosParaItem,
      fetchPropiedadesPorAgente,
      savePresupuesto,
      fetchPresupuestosUsuario,
      deletePresupuesto,
      deletePropiedad, 
      presupuestos,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};
