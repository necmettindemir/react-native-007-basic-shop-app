import React, {useEffect, useCallback} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ScrollView, View, Text, Image, Button, StyleSheet, Platform} from 'react-native';
import Colors from '../../constants/Colors';
import * as cartAction from '../../store/actions/cartAction';

const ProductDetailsScreen = (props) => {
    
    const productId = props.navigation.getParam('productId');

    const selectedProduct = useSelector(state => 
        state.products.availableProducts.find( p=> p.id === productId)
    );

    const dispatch = useDispatch();


    useEffect( () => {
        
        props.navigation.setParams({            
            selectedProductTitle: selectedProduct.title
            //selectedProductSTR: JSON.stringify(selectedProduct)
        });

    },[productId]);

    return (
        <ScrollView>
      
            <Image style={styles.image} source={ {uri: selectedProduct.imageUrl} } />
            
            <View style={styles.actions}>
                <Button color={ Colors.primary } 
                        title="Add to Cart" 
                        onPress={ () => { 
                            console.log('add2cart clicked in detail'); 

                            dispatch(cartAction.addToCart(selectedProduct));
                        }} 
                />
            </View>

            <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
            <Text style={styles.description}>{selectedProduct.description}</Text>

            {/* <View>
                <Text>The product detail: {productId}</Text>
                <Text>product title: {selectedProduct.title}</Text>
            </View> */}
        </ScrollView>
    );
};


ProductDetailsScreen.navigationOptions = (navigationData) => {

    //const selectedProductTitle = navigationData.navigation.getParam('selectedProductTitle');
    //const selectedProductSTR = navigationData.navigation.getParam('selectedProductSTR');
    //const selectedProduct = JSON.parse(selectedProductSTR);

    const productTitle = navigationData.navigation.getParam('productTitle');

    return {
        // headerTitle: () => <View><Text style={styles.title}>{selectedMeal.title}</Text></View>,
        //headerTitle: () => <View><Text>{selectedProductTitle}</Text></View>,
        headerTitle: () => <View><Text style={styles.title}>{productTitle}</Text></View>,
        // headerRight: () => 
 
        //      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        //              <Item 
        //                  title='Favorite' 
        //                  //iconName='ios-star' 
        //                  iconName={ isFav === true ? 'ios-star' : 'ios-star-outline' }
        //                  onPress={ () => {
        //                       console.log('Marked as fav!');  
        //                       //toggleFav();                          
        //                       }                            
        //                  }
        //                  //onPress={toggleFav}
        //                  />                      
        //      </HeaderButtons>        
 
     };

};

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        color: Platform.OS === 'android' ? 'white' :  'black',        
    },
    image: {
        width: '100%',
        height: 300,
    },
    price: {
        fontSize: 20,
        color: '#888',
        textAlign: 'center',
        marginVertical: 20,
        fontFamily: 'open-sans-bold',
    },
    description:  {
        fontFamily: 'open-sans',
        fontSize: 14,
        textAlign: 'center',
        marginHorizontal: 20
    },
    actions: {
        marginVertical: 10,
        alignItems: 'center',        
    }

});

export default ProductDetailsScreen;