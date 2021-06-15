import React, {useEffect, useState} from 'react';
import {Text, Button, FlatList, View, StyleSheet, ActivityIndicator, Platform} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import * as orderAction from '../../store/actions/orderAction';

import { HeaderButtons, Item} from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/CustomHeaderButton';

import OrderItem from '../../components/shop/OrderItem';
import Colors  from '../../constants/Colors';

const OrdersScreen = (props) => {

    const [isLoading, setIsLoading] = useState(false);
    const orders = useSelector(state => state.orders.orders);

    const dispatch = useDispatch();

    useEffect( () => {

        setIsLoading(true);
        dispatch(orderAction.fetchOrders()).then( ()=> {
            setIsLoading(false);            
        });
                     
    } , [dispatch]);


    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator 
                    size='large'
                    color={Colors.primary}
                />                    
            </View>
        );
    }


    if (orders.length === 0) {
        return (
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text>No order found!</Text>
            </View>
        );
    }

    return (        
        <View>
            {/* <Text>All your orders!!</Text> */}
            <FlatList 
                data={orders}
                keyExtractor={ (order, index) => order.id}
                renderItem={ (itemData) => {
                    return (
                        //<Text>{itemData.item.amount}</Text>
                        <OrderItem                             
                            amount={itemData.item.amount}
                            date={itemData.item.readableDate}
                            items={itemData.item.items}
                        />
                    );
                }}
            />
        </View>
    );
};


OrdersScreen.navigationOptions = (navigationData) => {

 
    return {

        headerTitle: () => <View><Text style={styles.title}>All Your Orders</Text></View>,
        
        headerLeft: () => 
        
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item 
            title='Menu'             
            iconName={ Platform.OS  === 'android' ? 'md-menu' : 'ios-menu' }
            onPress={ () => {
                   console.log('menu clicked!');  
               
                   navigationData.navigation.toggleDrawer()

                //    navigationData.navigation.navigate({
                //        routeName: 'Cart',
                //        // params: {
                //        //     categoryId: itemData.item.id
                //        // }
                //    })

               }                            
            }
            //onPress={toggleFav}
            />                      
        </HeaderButtons>,   

    //     headerRight: () => //<View><Text>Cart</Text></View>
 
    //          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
    //                  <Item 
    //                      title='Cart' 
    //                      //iconName='ios-star' 
    //                      iconName={ Platform.OS  === 'android' ? 'md-cart' : 'ios-cart' }
    //                      onPress={ () => {
    //                             console.log('cart clicked!');  
                            
                                
    //                             navigationData.navigation.navigate({
    //                                 routeName: 'Cart',
    //                                 // params: {
    //                                 //     categoryId: itemData.item.id
    //                                 // }
    //                             })

    //                         }                            
    //                      }
    //                      //onPress={toggleFav}
    //                      />                      
    //          </HeaderButtons>     

    };
};

const styles= StyleSheet.create({
    centered: {
        flex:1,
        justifyContent:'center',
        alignItems: 'center'
    }
});

export default OrdersScreen;