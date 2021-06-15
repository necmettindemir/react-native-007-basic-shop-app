import React, {     
        useState,    
        useEffect, 
        useCallback, 
        useReducer 
} from 'react';

import {View, 
        ScrollView, 
        Text, 
        StyleSheet, 
        Platform,
        Alert,
        ActivityIndicator,
        KeyboardAvoidingView
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { HeaderButtons, Item} from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import { useSelector, useDispatch } from 'react-redux';
import * as productAction from '../../store/actions/productAction';
import Input from '../../components/UI/Input';
import Colors  from '../../constants/Colors';



const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
    
    if (action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        };

        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        };

        let updatedFormIsValid = true;

        for (const key in updatedValidities) {
            
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
        }

        return {
            formIsValid: updatedFormIsValid,
            inputValidities: updatedValidities,
            inputValues: updatedValues
        };
    }

    return state;
};




const EditProductScreen = (props) => {


        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState();

        const productId = props.navigation.getParam('productId');

        const editedProduct = useSelector( (state) => {
            return state.products.userProducts.find( p => p.id === productId);
        });        


        const dispatch = useDispatch();

        

        const [formState, dispatchFormState] = useReducer(formReducer, 
        {       inputValues: {
                    title: editedProduct ? editedProduct.title : '',
                    imageUrl: editedProduct ? editedProduct.imageUrl : '',
                    description: editedProduct ? editedProduct.description : '',
                    price: ''
                }, 
                inputValidities:{
                    title: editedProduct ? true : false,
                    imageUrl: editedProduct ? true : false,
                    description: editedProduct ? true : false,
                    price: editedProduct ? true : false
                }, 
                formIsValid: editedProduct ? true : false
        });
    

        useEffect( () => {
            if (error) {
                Alert.alert('opps!', 
                            error,
                            [{ text:'OK'}]);
            }
        }, [error]);


        const submitHandler = useCallback( async () => {
           console.log('submitting'); 

         
            if (!formState.formIsValid) {
                Alert.alert(
                    'opps..', 
                    'check error message in form',
                    { text:'OK'},
                )

                return;
            }

            setError(null);
            setIsLoading(true);

            try {

                if (editedProduct) {


                    await dispatch( productAction.updateProduct(
                             productId,
                             formState.inputValues.title, //title,
                             formState.inputValues.description,//description,
                             formState.inputValues.imageUrl//imageUrl                        
                             ));
                             
                }
                else {
                     await dispatch( productAction.createProduct(                
                         formState.inputValues.title, //title,
                         formState.inputValues.description,//description,
                         formState.inputValues.imageUrl,//imageUrl,
                         +formState.inputValues.price//+price                        
                         ));
                }                

                props.navigation.goBack();

            } catch (error) {
                setError(error.message);
            }

           setIsLoading(false);
           
        }, 
            //[ dispatch,productId, title,description,imageUrl,price, titleIsValid]
            [ dispatch,productId, formState]
        );
  
        useEffect( () => {
            props.navigation.setParams({submit: submitHandler});
        },[submitHandler]);

        //----------

        const inputChangeHandler = useCallback(
            (inputIdentifier, inputValue, inputValidity) => {
     
                dispatchFormState({
                    type: FORM_INPUT_UPDATE,
                    value: inputValue,
                    isValid: inputValidity,
                    input: inputIdentifier//'title'
                }); //setTitle(text)
            },
            [dispatchFormState]
        );


        //----------


        // const dispatch = useDispatch();

        // const saveFilters = useCallback( () => {

        //     const appliedFilters = {
        //         glutenFree: isGlutenFree,
        //         lactoseFree: isLactoseFree,
        //         vegan: isVegan,
        //         vegeterian: isVegeterian
        //     };

        //     //console.log('appliedFilters: ', appliedFilters);
        //     dispatch( setFilters(appliedFilters) );
        
        // }, [isGlutenFree, isLactoseFree, isVegan, isVegeterian, dispatch] );


        // useEffect( () => {
        //     navigation.setParams({save: saveFilters});
        // },[saveFilters]);

        //----------


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


        return (

            <KeyboardAvoidingView
                style={{flex:1}}
                behavior='padding'
                keyboardVerticalOffset={100}>
                <ScrollView>                    
                <View style={styles.form}>


                    <Input 
                         id='title'
                         label='Title'
                         errorText='Please enter valid title'

                         keyboardType='default'
                         autoCapitalize='sentences'
                         autoCorrect
                         returnKeyType='next'
                         onInputChange={ inputChangeHandler}
                         //onInputChange={ ()=> { inputChangeHandler('title'); }}
                         
                         initialValue= {editedProduct ? editedProduct.title : ''}
                         initialValid={!!editedProduct }

                         required
                    />


                    {/* <View style={styles.formControl}> 
                        <Text style={styles.label}>image URL</Text>
                        <TextInput style={styles.input} 
                            //value={imageUrl}
                            value={formState.inputValues.imageUrl}
                            //onChangeText={ text => setImageUrl(text)}
                            onChangeText={ text => textChangeHandler('imageUrl',text) }
                        />
                        
                    </View> */}

                    <Input 
                        id='imageUrl'
                        label='ImageUrl'
                        errorText='Please enter valid image url'

                        keyboardType='default'                   
                        returnKeyType='next'

                        onInputChange={ inputChangeHandler}
                        //onInputChange={ ()=> { inputChangeHandler('imageUrl'); }}

                        initialValue= {editedProduct ? editedProduct.imageUrl : ''}
                        initialValid={!!editedProduct }

                        required
                    />



                    {
                        editedProduct ? null :                     
                        (
                            // <View style={styles.formControl}> 
                            //     <Text style={styles.label}>Price</Text>
                            //     <TextInput style={styles.input} 
                            //         //value={price.toString()}
                            //         value={formState.inputValues.price}
                            //         //onChangeText={ text => setPrice(text)}
                            //         onChangeText={ text => textChangeHandler('price',text) }
                            //         keyboardType='decimal-pad'
                            //     />
                            // </View>


                            <Input 
                                id='price'
                                label='Price'
                                errorText='Please enter valid price'

                                keyboardType='decimal-pad'                               
                                returnKeyType='next'
                                onInputChange={ inputChangeHandler}
                                //onInputChange={ ()=> { inputChangeHandler('price'); }}
                                
                                required
                                min={0.1}
                            />

                        )
                    }

                    {/* <View style={styles.formControl}> 
                        <Text style={styles.label}>Desc</Text>
                        <TextInput style={styles.input} 
                            //value={description}
                            value={formState.inputValues.description}
                            //onChangeText={ text => setDescription(text)}
                            onChangeText={ text => textChangeHandler('description',text) }                            
                        />
                    </View> */}

                    <Input 
                            id='description'
                            label='Desc'
                            errorText='Please enter valid desc'

                            keyboardType='default'
                            autoCapitalize='sentences'
                            autoCorrect
                            multiline
                            numberOfLines={3}
                            
                            onInputChange={ inputChangeHandler}
                            //onInputChange={ ()=> { inputChangeHandler('description'); }}

                            initialValue= {editedProduct ? editedProduct.description : ''}
                            initialValid={!!editedProduct }

                            required
                            minLength={5}
                    />                    


                </View>
            </ScrollView>
            </KeyboardAvoidingView>
        );
};




EditProductScreen.navigationOptions = (navigationData) => {

    const submitFunc = navigationData.navigation.getParam('submit');

    return {

        headerTitle: () => <View>
                                <Text>
                            {navigationData.navigation.getParam('productId') ? "Edit Product" : "Add Product" }        
                                </Text>
                            </View>,
        
        // headerLeft: () => 
        //     //<View><Text style={styles.title}>LEft</Text></View>,

        //     <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        //     <Item 
        //         title='Menu' 
        //         //iconName='ios-star' 
        //         iconName={ Platform.OS  === 'android' ? 'md-menu' : 'ios-menu' }
        //         onPress={ () => {
        //                console.log('menu clicked!');  
                   
        //                navigationData.navigation.toggleDrawer()

        //             //    navigationData.navigation.navigate({
        //             //        routeName: 'Cart',
        //             //        // params: {
        //             //        //     categoryId: itemData.item.id
        //             //        // }
        //             //    })

        //            }                            
        //         }
        //         //onPress={toggleFav}
        //         />                      
        //     </HeaderButtons>,     
        
        headerRight: () => //<View><Text>Cart</Text></View>
 
             <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                     <Item 
                         title='Save' 
                         //iconName='ios-star' 
                         iconName={ Platform.OS  === 'android' ? 'md-checkmark' : 'ios-checkmark' }
                         onPress={ () => {
                                console.log('save product clicked!');  
                            
                                submitFunc();
                                // navigationData.navigation.navigate({
                                //     routeName: 'EditProduct',
                                //     // params: {
                                //     //     categoryId: itemData.item.id
                                //     // }
                                // })

                            }                            
                         }
                         //onPress={toggleFav}
                         />                      
             </HeaderButtons>     

    };
};


const styles = StyleSheet.create({
    form: {
        margin: 20
    },
    centered: {
        flex:1,
        justifyContent:'center',
        alignItems: 'center'
    }
    
});

export default EditProductScreen;



