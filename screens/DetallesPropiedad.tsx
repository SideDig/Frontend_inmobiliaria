import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useDataContext, Propiedad } from '../context/DataContext';
import { FontAwesome } from '@expo/vector-icons';

const DetallesPropiedad = () => {
    const route = useRoute<any>();
    const propiedadId = route.params?.propiedadId;
    const { fetchPropiedad } = useDataContext();

    const [propiedad, setPropiedad] = useState<Propiedad | null>(null);

    useEffect(() => {
        if (propiedadId) {
            const obtenerPropiedad = async () => {
                const data = await fetchPropiedad(propiedadId);
                setPropiedad(data);
            };

            obtenerPropiedad();
        }
    }, [propiedadId]);

    if (!propiedad) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Cargando...</Text>
            </View>
        );
    }

    // Asegúrate de que caracteristicas es siempre un array
    const caracteristicas = Array.isArray(propiedad.caracteristicas) ? propiedad.caracteristicas : [];

    const handleEmailPress = () => {
        Linking.openURL(`mailto:${propiedad.agente.email}`);
    };

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: propiedad.imagen || 'https://via.placeholder.com/150' }} style={styles.image} />
            <View style={styles.infoContainer}>
                <Text style={styles.title}>{propiedad.nombre_propiedad}</Text>
                <Text style={styles.address}><FontAwesome name="map-marker" size={14} color="#888" /> {propiedad.direccion}</Text>
                <Text style={styles.price}>{`$${propiedad.precio} MXM`}</Text>
                <View style={styles.iconContainer}>
                    <View style={styles.iconBox}>
                        <FontAwesome name="bed" size={24} color="#000" />
                        <Text style={styles.iconText}>{propiedad.habitaciones}</Text>
                        <Text style={styles.iconLabel}>Habitaciones</Text>
                    </View>
                    <View style={styles.iconBox}>
                        <FontAwesome name="bath" size={24} color="#000" />
                        <Text style={styles.iconText}>{propiedad.baños}</Text>
                        <Text style={styles.iconLabel}>Baños</Text>
                    </View>
                    <View style={styles.iconBox}>
                        <FontAwesome name="arrows-alt" size={24} color="#000" />
                        <Text style={styles.iconText}>{propiedad.tamaño_terreno} m²</Text>
                        <Text style={styles.iconLabel}>Tamaño</Text>
                    </View>
                </View>
                <Text style={styles.subTitle}>Características</Text>
                <View style={styles.featureContainer}>
                    {caracteristicas.map((caracteristica: string, index: number) => (
                        <View key={index} style={styles.featureItem}>
                            <FontAwesome name="check" size={16} color="#000" />
                            <Text style={styles.featureText}>{caracteristica}</Text>
                        </View>
                    ))}
                </View>
                <Text style={styles.subTitle}>Descripción</Text>
                <Text style={styles.description}>{propiedad.descripcion}</Text>
                <View style={styles.agentContainer}>
                    <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.agentImage} />
                    <View style={styles.agentInfo}>
                        <Text style={styles.agentName}>{propiedad.agente.nombre}</Text>
                        <Text style={styles.agentRole}>Agente de la propiedad</Text>
                        <Text style={styles.agentEmail}>{propiedad.agente.email}</Text>
                        <Text style={styles.agentPhone}>{propiedad.agente.telefono}</Text>
                    </View>
                    <TouchableOpacity onPress={handleEmailPress}>
                        <FontAwesome name="envelope" size={24} color="#000" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.subTitle}>Ubicación</Text>
                <Image source={{ uri: 'https://via.placeholder.com/300x200' }} style={styles.mapImage} />
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Crear presupuesto</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: 300,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    infoContainer: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    address: {
        fontSize: 15,
        color: '#888',
        marginBottom: 10,
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 20,
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    iconBox: {
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        width: '30%',
    },
    iconText: {
        fontSize: 15,
        fontWeight: 'bold',
        marginTop: 5,
    },
    iconLabel: {
        fontSize: 13,
        color: '#888',
        marginTop: 3,
    },
    subTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    featureContainer: {
        marginBottom: 20,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    featureText: {
        fontSize: 14,
        marginLeft: 10,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    agentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    agentImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    agentInfo: {
        flex: 1,
    },
    agentName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    agentRole: {
        fontSize: 14,
        color: '#888',
    },
    agentEmail: {
        fontSize: 14,
        color: '#888',
    },
    agentPhone: {
        fontSize: 14,
        color: '#888',
    },
    mapImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#0000FF',
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default DetallesPropiedad;
