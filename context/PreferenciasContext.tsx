import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Coordinates {
    latitude: number;
    longitude: number;
}

interface MapRegion {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}

interface PreferenciasContextProps {
    location: Coordinates | null;
    setLocation: React.Dispatch<React.SetStateAction<Coordinates | null>>;
    address: string;
    setAddress: React.Dispatch<React.SetStateAction<string>>;
    mapRegion: MapRegion;
    setMapRegion: React.Dispatch<React.SetStateAction<MapRegion>>;
    isMapVisible: boolean;
    setIsMapVisible: React.Dispatch<React.SetStateAction<boolean>>;
    selectedRooms: string;
    setSelectedRooms: React.Dispatch<React.SetStateAction<string>>;
}

const PreferenciasContext = createContext<PreferenciasContextProps | undefined>(undefined);

export const PreferenciasProvider = ({ children }: { children: ReactNode }) => {
    const [location, setLocation] = useState<Coordinates | null>(null);
    const [address, setAddress] = useState<string>('');
    const [mapRegion, setMapRegion] = useState<MapRegion>({
        latitude: 23.868667894047714,
        longitude: -102.70353657966429,
        latitudeDelta: 20.0922,
        longitudeDelta: 0.0421
    });
    const [isMapVisible, setIsMapVisible] = useState<boolean>(false);
    const [selectedRooms, setSelectedRooms] = useState<string>('1');

    return (
        <PreferenciasContext.Provider
            value={{
                location,
                setLocation,
                address,
                setAddress,
                mapRegion,
                setMapRegion,
                isMapVisible,
                setIsMapVisible,
                selectedRooms,
                setSelectedRooms
            }}
        >
            {children}
        </PreferenciasContext.Provider>
    );
};

export const PreferenciasuseContext = () => {
    const context = useContext(PreferenciasContext);
    if (context === undefined) {
        throw new Error('useDataContext must be used within a DataProvider');
    }
    return context;
};
