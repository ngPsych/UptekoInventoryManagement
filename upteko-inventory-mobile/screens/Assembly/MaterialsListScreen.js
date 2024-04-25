import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, FlatList } from "react-native";
import { NavBar } from "../../components/NavBar/NavBar";
import { getMaterialLocation, getMaterialsNeeded } from "../../api/firebase/assemblyManagement";

const windowHeight = Dimensions.get('window').height;

export const MaterialsListScreen = ({ route }) => {
    const { assemblyId, subAssemblyId } = route.params;
    const [materialsNeeded, setMaterialsNeeded] = useState([]);
    const [navbarHeight, setNavbarHeight] = useState(0);

    const handleNavBarLayout = (height) => {
        setNavbarHeight(height);
    };

    const fetchMaterialsNeeded = async (matAssemblyId, matSubAssemblyId) => {
        try {
            const materials = await getMaterialsNeeded(matAssemblyId, matSubAssemblyId);
            const mats = await Promise.all(materials.map(async (material) => {
                const location = await getMaterialLocation(material.id);
                return { ...material, location };
            }));
            setMaterialsNeeded(mats);
        } catch (error) {
            console.error('Error fetching materials needed:', error);
        }
    }

    const maxListHeight = windowHeight - navbarHeight - 150;

    useEffect(() => {
        fetchMaterialsNeeded(assemblyId, subAssemblyId);
    }, []);

    const renderMaterial = ({ item }) => {
        return(
            <View>
                <View style={styles.material}>
                    <Text style={[styles.materialText, styles.materialId]} numberOfLines={1} ellipsizeMode="tail">{item.id}</Text>
                    <Text style={[styles.materialText, styles.materialName]} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                    <Text style={[styles.materialText, styles.materialLocation]} numberOfLines={1} ellipsizeMode="tail">{item.location}</Text>
                    <Text style={[styles.materialText, styles.materialQuantity]}>x{item.quantity}</Text>
                </View>
                <View style={styles.separator} />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {/* {materialsNeeded.map(material => (
                <Text key={material.id}>
                    ID: {material.id}, Name: {material.name}, Quantity: {material.quantity}
                </Text>
            ))} */}
            <View style={styles.header}>
                <Text style={[styles.headerText, styles.headerId]}>ID</Text>
                <Text style={[styles.headerText, styles.headerName]}>Name</Text>
                <Text style={[styles.headerText, styles.headerLocation]}>Location</Text>
                <Text style={[styles.headerText, styles.headerQuantity]}>Qty</Text>
            </View>
            <View style={[styles.content, { maxHeight: maxListHeight }]}>
                <FlatList
                    data={materialsNeeded}
                    renderItem={renderMaterial}
                    keyExtractor={(item) => item.id}
                />
            </View>
            <NavBar activeItem="Assembly" onNavBarLayout={handleNavBarLayout}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#666',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#444',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerId: {
        flex: 1,
        textAlign: 'center',
    },
    headerName: {
        flex: 2,
        textAlign: 'center',
    },
    headerLocation: {
        flex: 2,
        textAlign: 'center',
    },
    headerQuantity: {
        flex: 1,
        textAlign: 'center',
    },
    content: {
        flex: 1,
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
    },
    material: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
    },
    materialText: {
        fontSize: 16,
        color: 'white',
    },
    materialId: {
        flex: 1,
        textAlign: 'center',
    },
    materialName: {
        flex: 2,
        textAlign: 'center',
    },
    materialLocation: {
        flex: 2,
        textAlign: 'center',
    },
    materialQuantity: {
        flex: 1,
        textAlign: 'center',
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
    },  
});