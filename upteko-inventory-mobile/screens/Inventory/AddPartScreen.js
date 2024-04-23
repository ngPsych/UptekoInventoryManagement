import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { NavBar } from '../../components/NavBar/NavBar';
import { ImageButton } from '../../components/Button/ImageButton';
import { generateUniquePartID } from '../../api/firebase/IDGenerationService';

import AddPartIcon from '../../assets/icons/add-part.png';
import { addNewPart } from '../../api/firebase/inventoryManagement';

export const AddPartScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [location, setLocation] = useState('');
    const [minPoint, setMinPoint] = useState('');
    const [description, setDescription] = useState('');
    const [supplier, setSupplier] = useState('');
    const [supplierItemNumber, setSupplierItemNumber] = useState('');
    const [emptyFields, setEmptyFields] = useState([]);

    const handleAddPartClick = async () => {
        const emptyFields = [];

        if (!name.trim()) {
            emptyFields.push('Name');
        }
        if (!quantity.trim()) {
            emptyFields.push('Quantity');
        }
        if (!location.trim()) {
            emptyFields.push('Location');
        }
        if (!minPoint.trim()) {
            emptyFields.push('Min. Point');
        }
        if (!description.trim()) {
            emptyFields.push('Description');
        }
        if (!supplier.trim()) {
            emptyFields.push('Supplier');
        }
        if (!supplierItemNumber.trim()) {
            emptyFields.push('Supplier Item Number');
        }

        setEmptyFields(emptyFields);

        if (emptyFields.length === 0) {
            navigation.goBack();
            const newUniqueID = await generateUniquePartID();

            await addNewPart(newUniqueID, name, quantity, location, 
                description, supplier, supplierItemNumber, minPoint);

            Alert.alert("Success", "Part added successfully");
        } else {
            console.log('Some fields are empty:', emptyFields);
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.label}>Name:</Text>
                    <TextInput
                        style={[styles.input, emptyFields.includes('Name') && styles.errorInput]}
                        placeholder="Enter Name"
                        placeholderTextColor={'white'}
                        color={'white'}
                        value={name}
                        onChangeText={text => setName(text)}
                    />
                    <Text style={styles.label}>Quantity:</Text>
                    <TextInput
                        style={[styles.numberInput, emptyFields.includes('Quantity') && styles.errorInput]}
                        placeholder="Quantity"
                        placeholderTextColor={'white'}
                        color={'white'}
                        keyboardType="numeric"
                        value={quantity}
                        onChangeText={text => setQuantity(text)}
                    />
                    <Text style={styles.label}>Location:</Text>
                    <TextInput
                        style={[styles.input, emptyFields.includes('Location') && styles.errorInput]}
                        placeholder="Enter Location"
                        placeholderTextColor={'white'}
                        color={'white'}
                        value={location}
                        onChangeText={text => setLocation(text)}
                    />
                    <Text style={styles.label}>Min. Point:</Text>
                    <TextInput
                        style={[styles.numberInput, emptyFields.includes('Min. Point') && styles.errorInput]}
                        placeholder="Min. Point"
                        placeholderTextColor={'white'}
                        color={'white'}
                        keyboardType="numeric"
                        value={minPoint}
                        onChangeText={text => setMinPoint(text)}
                    />
                    <Text style={styles.label}>Description:</Text>
                    <TextInput
                        style={[styles.input, emptyFields.includes('Description') && styles.errorInput]}
                        placeholder="Enter Description"
                        placeholderTextColor={'white'}
                        color={'white'}
                        multiline
                        value={description}
                        onChangeText={text => setDescription(text)}
                    />
                    <Text style={styles.label}>Supplier:</Text>
                    <TextInput
                        style={[styles.input, emptyFields.includes('Supplier') && styles.errorInput]}
                        placeholder="Enter Supplier"
                        placeholderTextColor={'white'}
                        color={'white'}
                        value={supplier}
                        onChangeText={text => setSupplier(text)}
                    />
                    <Text style={styles.label}>Supplier Item Number:</Text>
                    <TextInput
                        style={[styles.input, emptyFields.includes('Supplier Item Number') && styles.errorInput]}
                        placeholder="Enter Supplier Item Number"
                        placeholderTextColor={'white'}
                        color={'white'}
                        value={supplierItemNumber}
                        onChangeText={text => setSupplierItemNumber(text)}
                    />
                    <ImageButton
                        style={{ marginTop: 10 }}
                        onPress={handleAddPartClick}
                        imageSource={AddPartIcon}
                        width={75}
                        height={75}
                        whiteTint={true}
                        disabled={false}
                    />
                </View>
                <NavBar activeItem="Order" />
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#666',
    },
    content: {
        flex: 1,
        padding: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
        marginBottom: 5,
        color: 'white',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    numberInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        keyboardType: 'numeric',
    },
    errorInput: {
        borderColor: 'red',
    },
});

export default AddPartScreen;
