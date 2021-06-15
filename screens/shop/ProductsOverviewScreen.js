import React, {useState, useEffect, useCallback} from 'react';
import {View, 
        Text, 
        Button, 
        FlatList, 
        StyleSheet,
        ActivityIndicator,
        TouchableOpacity, 
        Platform} from 'react-native';

import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import { HeaderButtons, Item} from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/CustomHeaderButton';

import Productitem from '../../components/shop/Productitem';
import * as cartAction from '../../store/actions/cartAction';
import * as productAction from '../../store/actions/productAction';
import  Colors  from '../../constants/Colors';

const ProductsOverviewScreen = (props) => {

    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);    
    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();


    const loadProducts = useCallback(async () => {

            console.log('--- LOAD PRODUCTS --- ');

            setError(null);
            //setIsLoading(true);
            setIsRefreshing(true);
            
            try {
                await dispatch(productAction.fetchProducts());
            } catch (error) {
                setError(error.message);
            }
    
            //setIsLoading(false);
            setIsRefreshing(false);
    
        },
        [dispatch, setIsLoading, setIsRefreshing, setError]
    );

    
    //------ to load on each screen ----- 
    useEffect( () => {
        const willFocusSub = props.navigation.addListener('willFocus', ()=> {
            loadProducts();
        });

        return ( () => {
            willFocusSub.remove();
        });

    }, [loadProducts]);
    //------ /to load on each screen ----- 


    //------ like componentDidMount ----- 
    useEffect( () => {    
        setIsLoading(true);           
        loadProducts().then( () => {
            setIsLoading(false);
        });        
    },[dispatch, loadProducts]);
    //------ /like componentDidMount ----- 


    const selectItemHandler = (id, title) => {

           props.navigation.navigate({
                    routeName: 'ProductDetail',
                    params: {
                            productId: id,
                            productTitle: title
                    }
                });

    };

    const renderGridItem = (itemData) => {
        return (
          <Productitem 
            title={itemData.item.title}      
            price={itemData.item.price.toFixed(2)}   
            imageUrl={itemData.item.imageUrl}  
                        
            onAddToCart={ () => { 
                console.log('add to cart clicked'); 
                            
                dispatch( cartAction.addToCart(itemData.item) );
            }}     
            
            onViewDetail={ () => { 
                console.log('detail view clicked'); 
            
                // props.navigation.navigate({
                //     routeName: 'ProductDetail',
                //     params: {
                //             productId: itemData.item.id,
                //             productTitle: itemData.item.title,
                //     }
                // });                
            }}     

            onSelect={ () => {

                selectItemHandler(
                        itemData.item.id, 
                        itemData.item.title);

            }}
            // onSelect={ () => {

            //     props.navigation.navigate({
            //         routeName: 'ProductDetails',
            //         params: {
            //             categoryId: itemData.item.id
            //         }
            //     })

            // }}
          >

                                <Button 
                                    color={ Colors.primary } 
                                    title="View Details" 
                                    //onPress={ () => { props.onViewDetail() } } 
                                    onPress={ () => {
                                        selectItemHandler(
                                                itemData.item.id, 
                                                itemData.item.title);
                        
                                    }}
                                />

                                <Button 
                                    color={ Colors.primary } 
                                    title="To Cart" 
                                    onPress={ () => { 
                                        dispatch( cartAction.addToCart(itemData.item) );
                                    } }
                                /> 

          </Productitem>
        );
    };    


    if (error) {
        return (
            <View style={styles.centered}>
                <Text>Error occured: {error}</Text>
                <Text> {new Date().toLocaleString()}</Text>
                <Button title="try again" 
                        onPress={ () => {loadProducts();}}
                        color={Colors.primary}
                />
            </View>
        );
    }

    if (isLoading) {
        return (
            <View style={styles.centered}><ActivityIndicator 
                    size='large'
                    color={Colors.primary}/>
            </View>
        );
    }


    if (!isLoading && products.length === 0) {

        return (
            <View style={styles.centered}>
                <Text>No products found</Text>
            </View>
        );

    }


    return (
        <View>
            
            <FlatList    
                onRefresh={ () => { loadProducts(); }}   
                refreshing={ isRefreshing }                  
                keyExtractor= { (item,index) => item.id }
                data={products}
                renderItem={renderGridItem}
                //renderItem={ itemData => <Text>{itemData.item.title}</Text> }                
            />

        </View>
    );
};



ProductsOverviewScreen.navigationOptions = (navigationData) => {

    //both the followings are sent from Mealitem in MealList
    //const productId = navigationData.navigation.getParam('productId');    

    return {

        headerTitle: () => <View><Text style={styles.title}>All Products</Text></View>,
        
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
                         title='Cart' 
                         //iconName='ios-star' 
                         iconName={ Platform.OS  === 'android' ? 'md-cart' : 'ios-cart' }
                         onPress={ () => {
                                console.log('cart clicked!');  
                            
                                
                                navigationData.navigation.navigate({
                                    routeName: 'Cart',
                                    // params: {
                                    //     categoryId: itemData.item.id
                                    // }
                                });

                            }                            
                         }
                         //onPress={toggleFav}
                         />                      
             </HeaderButtons>     

    };
};


const styles=StyleSheet.create({
    title: {
        color: Platform.OS === 'android' ? 'white' : Colors.primary
    },
    centered: {
        flex:1,
        justifyContent:'center',
        alignItems: 'center'
    }
});

export default ProductsOverviewScreen;