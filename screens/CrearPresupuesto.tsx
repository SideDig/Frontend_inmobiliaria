import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TextInput, SafeAreaView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../conexionApi/axios';
import { AxiosError } from 'axios';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Propiedad, Item, Category } from '../types';

type RouteParams = {
    CrearPresupuesto: {
        propiedad: Propiedad;
    };
};

const CrearPresupuesto = () => {
    const route = useRoute<RouteProp<RouteParams, 'CrearPresupuesto'>>();
    const propiedad = route.params?.propiedad || {
        id: 0,
        nombre_propiedad: '',
        direccion: '',
        descripcion: '',
        precio: 0,
        habitaciones: 0,
        baños: 0,
        tamaño_terreno: 0,
        caracteristicas: [],
        ubicacion: '',
        imagen: '',
        agente: {
            id: 0,
            nombre: '',
            email: '',
            telefono: '',
            total_ventas: 0,
            num_propiedades: 0
        }
    };

    const [selectedBuilder, setSelectedBuilder] = useState<string>('');
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        api.get('/item/categories')
            .then(response => {
                console.log('Datos recibidos:', JSON.stringify(response.data, null, 2));
                setCategories(response.data);
            })
            .catch((error: AxiosError) => {
                console.error('Error al obtener categorías e ítems:', error);
            });
    }, []);

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [categoryId]: !prev[categoryId],
        }));
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.propertyDetails}>
                    <Text style={styles.propertyTitle}>{propiedad.nombre_propiedad}</Text>
                    <Text style={styles.propertyDescription}>{propiedad.descripcion}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {propiedad.imagen ? (
                            <Image source={{ uri: propiedad.imagen }} style={styles.propertyImage} />
                        ) : (
                            <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.propertyImage} />
                        )}
                    </ScrollView>
                </View>
                <Text style={styles.label}>Selecciona Items Personalizables:</Text>
                {categories.map((category) => (
                    <View key={category.id} style={styles.categoryContainer}>
                        <TouchableOpacity onPress={() => toggleCategory(category.id)} style={styles.categoryHeader}>
                            <Text style={styles.categoryTitle}>{category.name}</Text>
                        </TouchableOpacity>
                        {expandedCategories[category.id] && (
                            <View style={styles.itemsContainer}>
                                {category.items.map((item) => (
                                    <View key={item.id} style={styles.itemContainer}>
                                        <Image source={{ uri: item.url_imagen }} style={styles.itemImage} />
                                        <View style={styles.itemDetails}>
                                            <Text style={styles.itemText}>{item.nombre}</Text>
                                            <Text style={styles.itemDescription}>{item.descripcion}</Text>
                                            <Text style={styles.itemCost}>{item.costo !== undefined ? `$${parseFloat(item.costo).toFixed(2)}` : 'Precio no disponible'}</Text>
                                            <TouchableOpacity style={styles.addButton} onPress={() => { /* Lógica para agregar ítem */ }}>
                                                <Text style={styles.addButtonText}>Agregar</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                ))}
                <Text style={styles.label}>Selecciona un Maestro Albañil:</Text>
                <Picker
                    selectedValue={selectedBuilder}
                    onValueChange={(itemValue) => setSelectedBuilder(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Seleccione un maestro albañil" value="" />
                    {[
                        { id: '1', name: 'Juan Pérez' },
                        { id: '2', name: 'Carlos López' }
                    ].map((builder) => (
                        <Picker.Item key={builder.id} label={builder.name} value={builder.id} />
                    ))}
                </Picker>
                <Text style={styles.label}>Presupuesto Total:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ingresa el presupuesto"
                    keyboardType="numeric"
                />
                <TouchableOpacity style={styles.saveButton} onPress={() => { /* Lógica para guardar el presupuesto */ }}>
                    <Text style={styles.saveButtonText}>Guardar Presupuesto</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
        color: '#555',
    },
    picker: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    propertyDetails: {
        marginBottom: 20,
        alignItems: 'center',
    },
    propertyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    propertyDescription: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
        color: '#666',
    },
    propertyImage: {
        width: 100,
        height: 100,
        marginRight: 10,
        borderRadius: 5,
    },
    categoryContainer: {
        marginBottom: 20,
    },
    categoryHeader: {
        backgroundColor: '#e9ecef',
        padding: 10,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    itemsContainer: {
        padding: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    itemImage: {
        width: 50,
        height: 50,
        marginRight: 10,
        borderRadius: 5,
    },
    itemDetails: {
        flex: 1,
    },
    itemText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    itemDescription: {
        fontSize: 14,
        color: '#666',
    },
    itemCost: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'black',
    },
    addButton: {
        backgroundColor: '#001061',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    saveButton: {
        backgroundColor: '#001061',
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default CrearPresupuesto;
