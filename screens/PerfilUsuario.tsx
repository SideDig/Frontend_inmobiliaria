import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const PerfilUsuario: React.FC = () => {
    const { user, cerrarSesion } = useAuth();
    const navigation = useNavigation();

    const handleLogout = async () => {
        await cerrarSesion();
        navigation.navigate('Login' as never);
    };

    const handleGoToDashboard = () => {
        navigation.navigate('PantallaAgente' as never);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar translucent={false} barStyle="light-content" backgroundColor="rgba(7,11,31,1)" />
            <LinearGradient
                colors={['rgba(7,11,31,1)', 'rgba(21,51,210,1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.container}
            >
                <View style={styles.logoContainer}>
                    <Image
                        style={styles.logo}
                        source={require("../assets/logo_etacarinae.png")}
                    />
                </View>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={styles.profileHeader}>
                    <Text style={styles.profileName}>{user?.nombre_completo || 'Usuario'}</Text>
                    <Text style={styles.profileEmail}>{user?.email}</Text>
                </View>

                <View style={styles.profileDetails}>
                    <Text style={styles.sectionTitle}>Información Personal</Text>
                    <View style={styles.infoRow}>
                        <Ionicons name="call" size={20} color="#666" />
                        <Text style={styles.infoLabel}>Teléfono:</Text>
                        <Text style={styles.infoValue}>{user?.telefono || 'No especificado'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="home" size={20} color="#666" />
                        <Text style={styles.infoLabel}>Estado:</Text>
                        <Text style={styles.infoValue}>{user?.estado || 'No especificado'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="location" size={20} color="#666" />
                        <Text style={styles.infoLabel}>Ciudad:</Text>
                        <Text style={styles.infoValue}>{user?.ciudad || 'No especificado'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="mail" size={20} color="#666" />
                        <Text style={styles.infoLabel}>Dirección:</Text>
                        <Text style={styles.infoValue}>{user?.direccion || 'No especificado'}</Text>
                    </View>
                </View>

                {user?.rol === 'agente' && (
                    <TouchableOpacity style={styles.dashboardButton} onPress={handleGoToDashboard}>
                        <Text style={styles.dashboardButtonText}>Dashboard</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "white",
    },
    container: {
        height: 100,
        justifyContent: "center",
        alignItems: "center",
    },
    logoContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        width: 120,
        height: 300,
        resizeMode: "contain",
        marginBottom: 0,
    },
    scrollViewContainer: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    profileHeader: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    profileEmail: {
        fontSize: 16,
        color: '#666',
        marginBottom: 15,
    },
    profileDetails: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        marginLeft: 5,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 10,
    },
    infoLabel: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
        flex: 1,
    },
    infoValue: {
        fontSize: 16,
        color: '#666',
        flex: 2,
        textAlign: 'right',
    },
    dashboardButton: {
        backgroundColor: '#4caf50',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 5,
        marginTop: 15,
        alignItems: 'center',
    },
    dashboardButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: 'red',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 5,
        marginTop: 30,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PerfilUsuario;
