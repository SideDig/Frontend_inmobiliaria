// context/PreferenciasContext.js
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PreferenciasContextData {
  address: string;
  setAddress: (address: string) => void;
  selectedRooms: string;
  setSelectedRooms: (rooms: string) => void;
  precioDesde: string;
  setPrecioDesde: (precio: string) => void;
  precioHasta: string;
  setPrecioHasta: (precio: string) => void;
}

const PreferenciasContext = createContext<PreferenciasContextData | undefined>(undefined);

export const PreferenciasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string>('');
  const [selectedRooms, setSelectedRooms] = useState<string>('1');
  const [precioDesde, setPrecioDesde] = useState<string>('');
  const [precioHasta, setPrecioHasta] = useState<string>('');

  return (
    <PreferenciasContext.Provider value={{ address, setAddress, selectedRooms, setSelectedRooms, precioDesde, setPrecioDesde, precioHasta, setPrecioHasta }}>
      {children}
    </PreferenciasContext.Provider>
  );
};

export const usePreferenciasContext = (): PreferenciasContextData => {
  const context = useContext(PreferenciasContext);
  if (!context) {
    throw new Error('usePreferenciasContext must be used within a PreferenciasProvider');
  }
  return context;
};
