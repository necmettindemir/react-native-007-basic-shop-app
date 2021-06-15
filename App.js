import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';

import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';

import { createStore,combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import productReducer from './store/reducers/productReducer';
import cartReducer from './store/reducers/cartReducer';
import orderReducer from './store/reducers/orderReducer';
import authReducer from './store/reducers/authReducer';

//import ShopNavigator from './navigation/ShopNavigator';
import NavigationContainer from './navigation/NavigationContainer';

import { composeWithDevTools } from 'redux-devtools-extension';

const rootReducer = combineReducers({
    products: productReducer,
    cart: cartReducer,
    orders: orderReducer,
    auth: authReducer
});


//for release
const store =  createStore( 
            rootReducer, 
            applyMiddleware(ReduxThunk));

//for dev to debug in chrome only
//const store =  createStore(rootReducer, composeWithDevTools);

const fetchFonts = () => {  
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')

  });
};

export default function App() {  


  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {        
      return (
        <AppLoading 
            startAsync={fetchFonts} 
            onFinish={ () =>  setFontLoaded(true) } 
            onError={ (err) =>  console.log(err) }
        />
      );      
  }

  return (
    <Provider store={store}>           

      <NavigationContainer />

    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
