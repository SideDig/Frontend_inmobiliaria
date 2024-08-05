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
  agente: Agente;
  habitaciones: number;
  baños: number;
  tamaño_terreno: number;
  caracteristicas: string[];
  ubicacion: string;
  imagen?: string;
}

export interface Item {
  id: number;
  nombre: string;
  descripcion: string;
  costo: string;
  url_imagen: string;
}

export interface Category {
  id: string;
  name: string;
  items: Item[];
}

export interface MaestroAlbanil {
  id: number;
  nombre: string;
  telefono: string;
  descripcion: string;
  foto_url: string;
  trabajos_realizados: number;
  costo_mano_obra: number;
}

export interface MaestroAlbanilItem extends MaestroAlbanil {
  costo_estimado: number;
  tiempo_estimado: number;
}

export interface DataContextProps {
  propiedades: Propiedad[];
  otrasPropiedades: Propiedad[];
  fetchPropiedades: (precioDesde?: number, precioHasta?: number, numRecamaras?: number) => void;
  fetchPropiedad: (propiedadId: number) => Promise<Propiedad | null>;
  maestrosAlbaniles: MaestroAlbanil[];
}
