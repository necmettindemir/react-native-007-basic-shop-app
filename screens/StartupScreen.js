
import React, { useEffect } from 'react';
import { useDispatch} from 'react-redux';
import {View, Text, StyleSheet, ActivityIndicator, Platform} from 'react-native';
import AsyncStorage  from '@react-native-async-storage/async-storage';
import Colors from '../constants/Colors';
import  * as authAction from '../store/actions/authAction';

const StartupScreen = (props) => {

    const dispatch =  useDispatch();


    useEffect( () => {

        const tryLogin = async () => {

            console.log('--- in tryLogin---');

            const userData = await AsyncStorage.getItem('userData');

            if (!userData) {
                props.navigation.navigate('Auth');
                return;
            }
            
            const transformedUserData = JSON.parse(userData);
            const { token, userId, expirationDate } = transformedUserData;        

            const checkExpirationDate = new Date(expirationDate);

            if (

                (checkExpirationDate <= new Date())  ||
                !token ||
                !userId
            )
            {
                props.navigation.navigate('Auth');
                return;
            }

            const expirationTimeAsMS = checkExpirationDate.getTime() - new Date().getTime();

            dispatch(authAction.authenticate(userId,token, expirationTimeAsMS));

            props.navigation.navigate('Shop');
        };

        tryLogin();

    },[dispatch]);


    return (
        <View style={styles.screen}>
            <ActivityIndicator 
                size="large"
                color={Colors.primary}
            />
        </View>
    );
};


const styles= StyleSheet.create({
    screen: {
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
});

export default StartupScreen;

