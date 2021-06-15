
import AsyncStorage  from '@react-native-async-storage/async-storage';
                           

import { FIREBASE_KEY } from '../../config/key';

export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';
export const AUTHENTICATE =  'AUTHENTICATE';
export const LOGOUT =  'LOGOUT';

let timer;

const fbdbSignupLink = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
const fbdbLoginLink =  'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';




export const authenticate = (userId, token, expiryTimeAsMS) => {
    
    //setLogoutTimer(15000);

    return dispatch => {
        
        dispatch(setLogoutTimer(expiryTimeAsMS));
        //dispatch(setLogoutTimer(1*5*1000));

        dispatch({
                type: AUTHENTICATE,
                userId: userId,
                token: token
        });

    };

    // return {
    //     type: AUTHENTICATE,
    //     userId: userId,
    //     token: token
    // };
};

const saveDataToStorage = (token, userId, expirationDate) => {
    AsyncStorage.setItem('userData', JSON.stringify({
        token: token,
        userId: userId,
        expirationDate: expirationDate
    }));
};

export const logout = () => {
    clearLogoutTimer();
    AsyncStorage.removeItem('userData');
    return {
        type: LOGOUT
    };
};

const clearLogoutTimer = () => {
    if (timer) {
        clearTimeout(timer);
    }
};

const setLogoutTimer = (expirationTimeAsMS) => {
    return dispatch => {
        timer =  setTimeout( ()=> {
            dispatch(logout());
        }, 
            expirationTimeAsMS  
            //expirationTimeAsMS/1000 
        );
    };
    
};


export const signup  = (email, password) => {

    return async dispatch => {

        //--------
        //console.log('fbdblink+fbKEY:', fbdblink+fbKEY);

        const response =  await fetch(fbdbSignupLink+FIREBASE_KEY,
            {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',                    
                },                
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            });

        if (!response.ok) {

            //console.log('response:', response);

            const errorResData = await response.json();
            console.log('errorResData:', errorResData);
            const errorId = errorResData.error.message;

            let errorMessage = 'sth went wrong in signup'; 

            if (errorId === 'EMAIL_EXISTS') {                             
                errorMessage = 'email exists!';
            } else if (errorId === 'OPERATION_NOT_ALLOWED') {
                errorMessage = 'operation not allowed';
            } else if ( errorId === 'TOO_MANY_ATTEMPTS_TRY_LATER') {
                errorMessage = 'too many attempts.. try later';
            }


            throw new Error(errorMessage);        
        }

        const respData = await response.json();

        console.log('respData in signup',respData);
        

        //--------

        // dispatch(            
        //     {
        //         type: SIGNUP,
        //         token: respData.idToken,
        //         userId: respData.localId
        //     }
        // );


        dispatch(            
            authenticate(
                    respData.idToken,
                    respData.localId, 
                    parseInt( respData.expiresIn) * 1000
            )
        );

        //--------

        //--------

        const expirationDate = new Date(
            new Date().getTime() +  parseInt(respData.expiresIn)*1000
        );

        saveDataToStorage(
                respData.idToken, 
                respData.localId, 
                expirationDate.toISOString() 
        );

        //--------

    };

};

export const login  = (email, password) => {

    return async dispatch => {

        //--------
        
        const response =  await fetch(fbdbLoginLink+FIREBASE_KEY,
            {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',                    
                },                
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            });


            if (!response.ok) {

                //console.log('response:', response);
    
                const errorResData = await response.json();
                console.log('errorResData:', errorResData);
                const errorId = errorResData.error.message;
    
                let errorMessage = 'sth went wrong in login'; 
    
                if (errorId === 'EMAIL_NOT_FOUND') {                             
                    errorMessage = 'email not found!';
                } else if (errorId === 'INVALID_PASSWORD') {
                    errorMessage = 'pass is not valid';
                } else if ( errorId === 'USER_DISABLED') {
                    errorMessage = 'user is disabled';
                }
    
    
                throw new Error(errorMessage);        
            }

        const respData = await response.json();

        console.log('login respData:', respData);

        console.log('login respData.idToken:', respData.idToken);
        console.log('login respData.localId:', respData.localId);
        

        //--------

        // dispatch(            
        //     {
        //         type: LOGIN,
        //         token: respData.idToken,
        //         userId: respData.localId
        //     }
        // );

        dispatch(            
            authenticate(
                    respData.idToken,
                    respData.localId,
                    parseInt( respData.expiresIn) * 1000
            )
        );

        //--------


        //--------

        //expiresIn: as sec
        const expirationDate = new Date(new Date().getTime() +  parseInt(respData.expiresIn)*1000);

        saveDataToStorage(
                respData.idToken, 
                respData.localId, 
                expirationDate.toISOString() 
        );

        //--------
    };

};


