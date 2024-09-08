import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

const API_KEY = "1eeac87a65c1b2c4f781fbe820023e1df1d2c8ad";
const API_URL = "https://api.tau.com.mx/dipomex/v1/";

interface UbicacionContextProps {
  states: { ESTADO_ID: string; ESTADO: string }[];
  cities: { MUNICIPIO_ID: string; MUNICIPIO: string }[];
  selectedState: string;
  setSelectedState: React.Dispatch<React.SetStateAction<string>>;
  fetchStates: () => Promise<void>;
  fetchCities: (stateId: string) => Promise<void>;
}

interface LocationProviderProps {
  children: ReactNode;
}

const UbicacionContext = createContext<UbicacionContextProps | undefined>(undefined);

export const UbicacionProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [states, setStates] = useState<{ ESTADO_ID: string; ESTADO: string }[]>([]);
  const [cities, setCities] = useState<{ MUNICIPIO_ID: string; MUNICIPIO: string }[]>([]);
  const [selectedState, setSelectedState] = useState<string>("");

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (selectedState) {
      fetchCities(selectedState);
    }
  }, [selectedState]);

  const fetchStates = async () => {
    try {
      const response = await axios.get(`${API_URL}estados`, {
        headers: {
          "APIKEY": API_KEY,
        },
      });
      setStates(response.data.estados);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchCities = async (stateId: string) => {
    try {
      const response = await axios.get(`${API_URL}municipios`, {
        headers: {
          "APIKEY": API_KEY,
        },
        params: {
          id_estado: stateId,
        },
      });
      setCities(response.data.municipios);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  return (
    <UbicacionContext.Provider
      value={{
        states,
        cities,
        selectedState,
        setSelectedState,
        fetchStates,
        fetchCities,
      }}
    >
      {children}
    </UbicacionContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(UbicacionContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
