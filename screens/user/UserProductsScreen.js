import React from 'react';
import {Text, Button, View, StyleSheet, Platform, FlatList, Alert} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { Ionicons } from '@expo/vector-icons';

import { HeaderButtons, Item} from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/CustomHeaderButton';

import Productitem from '../../components/shop/Productitem';
import Colors  from '../../constants/Colors';

import * as productAction from '../../store/actions/productAction';

const UserProductsScreen = (props) => {

    const userProducts = useSelector(state =>  state.products.userProducts);
    const dispatch = useDispatch();

    const editProductHandler = (id) => {
        

        props.navigation.navigate({
            routeName: 'EditProduct',
            params:{
                productId: id,
                 //   productId: itemData.item.id,
                //    productTitle: itemData.item.title,
            }
        });

    };

    //-------
    const deleteHandler = (id) => {
        Alert.alert('Sure?', 
                    'Delete?',
                    [
                        {text: 'No', style:'default'},
                        {text: 'Yes', style:'destructive', onPress: ()=>{
                            dispatch( productAction.deleteProduct(id) );
                        }},
                    ]

                    );
    };

    //-------

    if (userProducts.length === 0) {
        return (
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>No prod found!</Text></View>
        );
    }

    //-------

    return (
        <View>
            
            <FlatList 
                keyExtractor={ (item, index) => item.id}
                data={userProducts}
                renderItem={ (itemData) => {
                    return (
                        <Productitem 
                            imageUrl={itemData.item.imageUrl}
                            title={itemData.item.title}
                            price={itemData.item.price}
                            // onViewDetail={ () => {}}
                            // onVAddToCart={ () => {}}
                            onSelect={ () => {
                                editProductHandler(itemData.item.id);
                            }}>
                                <Button 
                                    color={ Colors.primary } 
                                    title="Edit Details" 
                                    //onPress={ () => { props.onViewDetail() } } 
                                    onPress={ () => {
                                        // selectItemHandler(
                                        //         itemData.item.id, 
                                        //         itemData.item.title);
                        
                                        editProductHandler(itemData.item.id);

                                    }}
                                />

                                <Button 
                                    color={ Colors.primary } 
                                    title="Delete" 
                                    onPress={ () => { 
                                        //dispatch( cartAction.addToCart(itemData.item) );
                                        //dispatch( productAction.deleteProduct(itemData.item.id) );
                                        deleteHandler(itemData.item.id);
                                    } }
                                /> 

                        </Productitem>
                    );                
                }}
            />
        </View>
    );
};




UserProductsScreen.navigationOptions = (navigationData) => {

    //both the followings are sent from Mealitem in MealList
    //const productId = navigationData.navigation.getParam('productId');    

    return {

        headerTitle: () => <View><Text style={styles.title}>User Products</Text></View>,
        
        headerLeft: () => 
            //<View><Text style={styles.title}>LEft</Text></View>,

            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item 
                title='Menu' 
                //iconName='ios-star' 
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
        
        headerRight: () => //<View><Text>Cart</Text></View>
 
             <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                     <Item 
                         title='Add' 
                         //iconName='ios-star' 
                         iconName={ Platform.OS  === 'android' ? 'md-create' : 'ios-create' }
                         onPress={ () => {
                                console.log('add product clicked!');  
                            
                                
                                navigationData.navigation.navigate({
                                    routeName: 'EditProduct',
                                    // params: {
                                    //     categoryId: itemData.item.id
                                    // }
                                })

                            }                            
                         }
                         //onPress={toggleFav}
                         />                      
             </HeaderButtons>     

    };
};


const styles= StyleSheet.create({

});

export default UserProductsScreen
