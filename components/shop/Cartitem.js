import React from 'react';
import {View, Text,StyleSheet, TouchableOpacity, Platform} from 'react-native';
import { Ionicons} from '@expo/vector-icons';

const Cartitem = (props) => {

    return (
        <View style={styles.cartitem}>
            <Text style={styles.itemData}>
                <Text style={styles.quantity}> {props.quantity} </Text>
                <Text style={styles.title}> {props.title}</Text>
            </Text>
            <View style={styles.itemData}>
                <Text style={styles.amount}>${props.amount.toFixed(2)}</Text>
               
               
                {
                props.deletable && <TouchableOpacity onPress={ () => { props.onRemove(); }}  style={styles.deleteButton} >
                                        <Ionicons 
                                            name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash' } 
                                            size={23}
                                            color="red"
                                        />
                                    </TouchableOpacity>
                }
                
            </View>
        </View>
    );
};


const styles= StyleSheet.create({

    cartitem: {
        padding: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        marginVertical:2
    },
    itemData: {
        flexDirection: 'row',
        alignItems: 'center',          
    },
    quantity: {
        fontFamily: 'open-sans',
        color: '#000',
        fontSize: 26,                
        backgroundColor: 'yellow'
    },
    title: {
        fontSize: 'open-sans-bold',
        fontSize: 16,        
    },
    amount: {
        fontSize: 'open-sans-bold',
        fontSize: 18,        
    },
    deleteButton: {
        marginLeft: 10
    },
    
});

export default Cartitem;