import React, {useState} from 'react';
import { View,  FlatList, Button, Text, StyleSheet, ActivityIndicator} from 'react-native';
import Colors from '../../constants/Colors';
import Cartitem from '../../components/shop/Cartitem';

import { useSelector, useDispatch } from 'react-redux';

import * as cartAction from '../../store/actions/cartAction';
import * as orderAction from '../../store/actions/orderAction';

import Card from '../../components/UI/Card';

const CartScreen = (props) => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const cartTotalAmount = useSelector(state => state.cart.totalAmount);
    
    const cartItems = useSelector(state => {

        const transformedCartItems = [];
        
        for (const key in state.cart.items) {

            transformedCartItems.push({
                productId: key,
                productTitle: state.cart.items[key].productTitle,
                productPrice: state.cart.items[key].productPrice,
                quantity: state.cart.items[key].quantity,
                sum: state.cart.items[key].sum
            });
        }

        return transformedCartItems.sort( (a,b) => 
                                a.productId > b.productId ? 1 :  -1 
                                        );
    });

        
    const dispatch = useDispatch();

    const sendOrderHandler = async () => {

        setIsLoading(true);
        await dispatch(orderAction.addOrder(cartItems,cartTotalAmount));
        setIsLoading(false);
    };


    // if (isLoading) {
    //     return (
    //         <View style={styles.centered}><ActivityIndicator 
    //                 size='large'
    //                 color={Colors.primary}/>
    //         </View>
    //     );
    // }

    return (
        <View style={styles.screen}>
            <Card style={styles.summary}>
                <Text style={styles.summaryText}>
                    Total: <Text style={styles.amount}>${cartTotalAmount.toFixed(2)}</Text>
                </Text>

                {
                    isLoading ? <ActivityIndicator size='small' color={Colors.primary} /> 
                    :   <Button color={Colors.accent} 
                                title="Order Now" 
                                disabled={cartItems.length === 0}
                                onPress={ () => {
                                    
                                    // dispatch(orderAction.addOrder(
                                    //     cartItems,
                                    //     cartTotalAmount
                                    // ));

                                    sendOrderHandler();
                                    
                                }}
                        />
                }
            </Card>

            <View>
                <Text>CART ITEMS</Text>

                <FlatList 
                    keyExtractor={ (item, index) => item.productId }
                    data={cartItems}
                    //renderItem={renderGridItem}
                    renderItem={itemdData => {
                        return (
                            <Cartitem  
                                quantity={itemdData.item.quantity}  
                                title={itemdData.item.productTitle}   
                                amount={itemdData.item.sum} 
                                deletable
                                onRemove={ ()=> {
                                    dispatch(cartAction.removeFromCart(itemdData.item.productId));
                                }} 
                            />
                        );
                    }}
                />

            </View>
        </View>
        
        
    );

};


CartScreen.navigationOptions = (navigationData) => {

 
    return {

        headerTitle: () => <View><Text style={styles.title}>Your Cart</Text></View>,
    
    };
};

const styles= StyleSheet.create({
    screen: {
        marginHorizontal: 5,
    },
    summary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 15,
        padding: 5,

     
    },
    summaryText: {
        fontFamily: 'open-sans-bold',
        fontSize: 18
    },
    amount: {
        color: Colors.primary
    },
    centered: {
        flex:1,
        justifyContent:'center',
        alignItems: 'center'
    }
});



export default CartScreen;