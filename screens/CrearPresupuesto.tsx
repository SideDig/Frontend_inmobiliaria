import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TextInput, SafeAreaView, TouchableOpacity, FlatList, Modal } from 'react-native';
import api from '../conexionApi/axios';
import { AxiosError } from 'axios';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Propiedad, Category, MaestroAlbanilItem } from '../types';

type CrearPresupuestoRouteProp = RouteProp<{ CrearPresupuesto: { propiedad: Propiedad } }, 'CrearPresupuesto'>;

const CrearPresupuesto = () => {
    const route = useRoute<CrearPresupuestoRouteProp>();
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

    const [selectedBuilders, setSelectedBuilders] = useState<{ [key: number]: string }>({});
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
    const [categories, setCategories] = useState<Category[]>([]);
    const [maestrosPorItem, setMaestrosPorItem] = useState<{ [key: number]: MaestroAlbanilItem[] }>({});
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const [isModalVisible, setModalVisible] = useState<boolean>(false);

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

    const fetchMaestrosParaItem = async (itemId: number) => {
        try {
            const response = await api.get(`/albaniles/item/${itemId}`);
            setMaestrosPorItem(prev => ({ ...prev, [itemId]: response.data }));
        } catch (error) {
            console.error('Error al obtener maestros albañiles:', error);
        }
    };

    const handleToggleCategory = (categoryId: string) => {
        toggleCategory(categoryId);
        const category = categories.find(c => c.id === categoryId);
        if (category) {
            category.items.forEach(item => {
                if (!maestrosPorItem[item.id]) {
                    fetchMaestrosParaItem(item.id);
                }
            });
        }
    };

    const openModal = (itemId: number) => {
        setSelectedItemId(itemId);
        setModalVisible(true);
    };

    const closeModal = () => {
        setSelectedItemId(null);
        setModalVisible(false);
    };

    const handleBuilderSelect = (builderId: string) => {
        if (selectedItemId !== null) {
            setSelectedBuilders(prev => ({ ...prev, [selectedItemId]: builderId }));
            closeModal();
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Crear Presupuesto</Text>
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
                        <TouchableOpacity onPress={() => handleToggleCategory(category.id)} style={styles.categoryHeader}>
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
                                            <TouchableOpacity onPress={() => openModal(item.id)} style={styles.selectButton}>
                                                <Text style={styles.selectButtonText}>
                                                    {selectedBuilders[item.id] ? `Maestro seleccionado: ${selectedBuilders[item.id]}` : 'Seleccionar maestro'}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                ))}
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
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Selecciona un Maestro Albañil</Text>
                        <FlatList
                            data={selectedItemId ? maestrosPorItem[selectedItemId] : []}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.builderItem} onPress={() => handleBuilderSelect(item.id.toString())}>
                                    <Text style={styles.builderName}>{item.nombre}</Text>
                                    <Text style={styles.builderDetails}>Tiempo estimado: {item.tiempo_estimado} días</Text>
                                    <Text style={styles.builderDetails}>Costo estimado: ${item.costo_estimado}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                            <Text style={styles.closeButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    picker: {
        height: 50,
        width: '100%',
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
        width: 70,
        height: 70,
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
    },
    selectButton: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginTop: 10,
        width: '100%',
    },
    selectButtonText: {
        color: '#333',
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
        borderRadius: 5,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '100%',
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    builderItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        width: '100%',
    },
    builderName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    builderDetails: {
        fontSize: 14,
        color: '#666',
    },
    closeButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default CrearPresupuesto;
