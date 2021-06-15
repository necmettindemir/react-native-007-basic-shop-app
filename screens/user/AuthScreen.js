import React, { useState, 
                useEffect,
                useReducer, 
                useCallback
              } 
from 'react';

import {View, Text, Button, ScrollView, StyleSheet, 
        KeyboardAvoidingView,
        ActivityIndicator, Alert, Platform} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { useDispatch } from 'react-redux';
import * as authAction from '../../store/actions/authAction';

import Input from '../../components/UI/Input';
import Card  from '../../components/UI/Card';

import Colors from '../../constants/Colors';


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



const AuthScreen = (props) => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [isSignup, setIsSignUp] = useState(false);
    
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, 
        {       inputValues: {
                    email: '',
                    password: ''
                }, 
                inputValidities:{
                    email: false,
                    password: false
                }, 
                formIsValid: false
        });

    
    // useEffect( () => {
    //     if (error) {
    //         Alert.alert('opps..', error, [{ text: 'OK'}]);
    //     }
    // }, [error]);


 
    useEffect( () => {
        if (error) {
            Alert.alert('opps..', error, [{ text: 'OK'}]);
        }
    }, [error]);


    

    const authHandler = async () => {

        let action;

        if (isSignup) {
            
            action = authAction.signup(
                formState.inputValues.email,
                formState.inputValues.password
                );
        }
        else {
            action = authAction.login(
                formState.inputValues.email,
                formState.inputValues.password
                );
        }

        setError(null);
        setIsLoading(true);
        try {
            await dispatch(action);      

            //props.navigation.navigate('Shop');

            props.navigation.navigate({
                routeName: 'Shop',
                // params: {
                //     categoryId: itemData.item.id
                // }
            });

        } catch (error) {
            setError(error.message);            
            setIsLoading(false);
        }                

        
    };


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

    return (
        <KeyboardAvoidingView 
            behavior='padding'
            keyboardVerticalOffset={50}
            style={styles.screen}>
            <LinearGradient
                colors={['#f7feae','#045275']}
                style={styles.gradient}
            >
                <Card style={styles.authContainer}>
                    <ScrollView>
                        
                        <Input id="email" 
                                label="E-mail" 
                                keyboardType="email-address" 
                                required
                                email
                                autoCapitelize="none"
                                errorText="enter valid email address"
                                onInputChange={ inputChangeHandler } 
                                initialValue="Test@test.co"

                        />

                        <Input id="password" 
                                label="Pass" 
                                keyboardType="default" 
                                secureTextEntry
                                required
                                minLength={5} 
                                autoCapitelize="none"
                                errorText="enter valid pass"
                                onInputChange={ inputChangeHandler } 
                                initialValue="passwor"

                        />

                        <View style={styles.buttonContainer}>
                            
                            {
                                isLoading ? 
                                <ActivityIndicator 
                                    size="large"
                                    color={Colors.primary}
                                /> :
                                (
                                    <Button title= {isSignup ? "Sign Up" : "Login"  }
                                    color={Colors.primary} 
                                    onPress={ authHandler }
                                    />
                                )
                            }
                        </View>


                        <View style={styles.buttonContainer}>
                            <Button title={`Switch to ${isSignup ? 'Login' : 'Sign up' }`}
                                    color={Colors.accent} 
                                    onPress={ () => {
                                        setIsSignUp(!isSignup)
                                    }}
                            />
                        </View>

                    </ScrollView>
                
                </Card>
            </LinearGradient>
        </KeyboardAvoidingView>
    );

};




AuthScreen.navigationOptions = (navigationData) => {

    //both the followings are sent from Mealitem in MealList
    //const productId = navigationData.navigation.getParam('productId');    

    return {

        headerTitle: () => <View><Text style={styles.title}>Authenticate</Text></View>,
        
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
        
        // headerRight: () => //<View><Text>Cart</Text></View>
 
        //      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        //              <Item 
        //                  title='Cart' 
        //                  //iconName='ios-star' 
        //                  iconName={ Platform.OS  === 'android' ? 'md-cart' : 'ios-cart' }
        //                  onPress={ () => {
        //                         console.log('cart clicked!');  
                            
                                
        //                         navigationData.navigation.navigate({
        //                             routeName: 'Cart',
        //                             // params: {
        //                             //     categoryId: itemData.item.id
        //                             // }
        //                         })

        //                     }                            
        //                  }
        //                  //onPress={toggleFav}
        //                  />                      
        //      </HeaderButtons>     

    };
};


const styles = StyleSheet.create({
    screen: {
        flex:1,
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,          
        maxHeight: 400,
        padding: 10
    }, 
    gradient : {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        marginTop: 10
    }
});

export default AuthScreen;

