import React from 'react';

import { 
        TouchableOpacity, 
        View, 
        Text, 
        Button,
        Image,
        StyleSheet,
        Platform,
        TouchableNativeFeedback
     } from 'react-native';

//import Colors from '../../constants/Colors';
import Card from '../UI/Card';

const Productitem = (props) => {

    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && (Platform.Version >= 21)){
        TouchableCmp = TouchableNativeFeedback;
    }

    return (
         <Card style={styles.product}>
             <View style={styles.touchable}>
            <TouchableCmp   
                            
                           // onPress={ () => { props.onViewDetail(); }}
                            onPress={ () => {props.onSelect();}}
                            useForegorund
            >
                <View>
                    <View style={styles.ImageContainer}>
                        <Image style={styles.image} source={{uri: props.imageUrl}} />
                    </View>
                    
                    
                    <View style={styles.details}>
                        <Text style={styles.title}>{props.title}</Text>
                        <Text style={styles.price}>${props.price}</Text>
                    </View>
                    
                    <View style={styles.action}>

                        {/* <Button 
                            color={ Colors.primary } 
                            title="View Details" 
                            onPress={ () => { props.onViewDetail() } } 
                        />

                        <Button 
                            color={ Colors.primary } 
                            title="To Cart" 
                            onPress={ () => { props.onAddToCart() } }/> */}

                        {props.children}

                    </View>
                </View>
            </TouchableCmp>
            </View>
         </Card>
    );

};


const styles = StyleSheet.create({
     product:{

        height:300,
        margin:20,        
    },
    ImageContainer: {
        width: '100%',
        height: '60%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%'
    },
    title: {
        fontFamily: 'open-sans-bold',
        fontSize: 18,
        marginVertical: 2,        
    },
    price: {
        fontFamily: 'open-sans',
        fontSize: 14,
        color: '#888'
    },
    action:  {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '23%',
        paddingHorizontal: 20,
    },
    details: {
        alignItems:'center',
        height: '17%',
        padding: 10
    },
    touchable: {
        borderRadius: 10,
        overflow: 'hidden'
    }    
});


export default Productitem;