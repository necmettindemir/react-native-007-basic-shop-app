import React from 'react';
import { Button, View, Platform, SafeAreaView } from 'react-native';

//import { createAppContainer} from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';
//import { createDrawerNavigator } from 'react-navigation-drawer';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';

//import { createSwitchNavigator } from 'react-navigation-switch-transitioner';

// import { createSwitchNavigator, 
//          FadeTransition, 
//          withTransition, 
//          withFadeTransition } from 'react-navigation-switch-transitioner';

import { createAppContainer,          
         createSwitchNavigator  } from 'react-navigation';



import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import ProductDetailsScreen from '../screens/shop/ProductDetailsScreen';

import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
import UserProductsScreen from '../screens/user/UserProductsScreen';
import EditProductScreen from '../screens/user/EditProductScreen';

import AuthScreen from '../screens/user/AuthScreen';
import StartupScreen from '../screens/StartupScreen';

import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

import * as authAction from '../store/actions/authAction';

import { useDispatch }  from 'react-redux';


const defaultNavOptions = {
    headerStyle: {
        backgroundColor: Platform.OS === 'android' ? Colors.accent : ''
    },
    headerTitleStyle: {
        fontFamily: 'open-sans-bold',
    },
    headerBackTitleStyle: {
        fontFamily: 'open-sans',
    },
    headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
};

const ProductNavigator= createStackNavigator(
    {
        ProductsOverview: ProductsOverviewScreen,
        ProductDetail: ProductDetailsScreen,
        Cart: CartScreen
    }, 
    {
        navigationOptions: {
            drawerIcon: drawerConfig => 
                <Ionicons 
                    name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'} 
                    size={23}
                    color={drawerConfig.activeTintColor }
                />
        },
        defaultNavigationOptions: defaultNavOptions
    }
);


const OrdersNavigator = createStackNavigator(
    {
        Orders: OrdersScreen
    },
    {
        navigationOptions: {
            drawerIcon: drawerConfig => 
                <Ionicons 
                    name={Platform.OS === 'android' ? 'md-list' : 'ios-list'} 
                    size={23}
                    color={drawerConfig.activeTintColor }
                />
        },
        defaultNavigationOptions: defaultNavOptions
    }
);


const AdminNavigator = createStackNavigator(
    {
        UserProducts: UserProductsScreen,
        EditProduct: EditProductScreen
    },
    {
        navigationOptions: {
            drawerIcon: drawerConfig => 
                <Ionicons 
                    name={Platform.OS === 'android' ? 'md-create' : 'ios-create'} 
                    size={23}
                    color={drawerConfig.activeTintColor }
                />
        },
        defaultNavigationOptions: defaultNavOptions
    }
);



const ShopNavigator = createDrawerNavigator(
    {
        Products: ProductNavigator,
        Orders: OrdersNavigator,
        Admin: AdminNavigator
    },
    {
        contentOptions: {
          activeTintColor: Colors.primary
        },
        contentComponent: (props) => {

            const dispatch = useDispatch();

            return (
                <View style={{ flex:1, padding: 20}}>
                    <SafeAreaView forceInset={{ top:'always', horizontal:'never'}} >
                        <DrawerItems {...props} />
                        <Button title="Logout" 
                                color={Colors.primary} 
                                onPress={ () => {
                                    dispatch( authAction.logout() );
                                    //props.navigation.navigate('Auth');
                                }}
                        />
                    </SafeAreaView>
                </View>
                );
        }
    }
);

const  AuthNavigator = createStackNavigator(
    {
        Auth: AuthScreen
    },
    {
        defaultNavigationOptions: defaultNavOptions
    }
);


const MainNavigator = createSwitchNavigator({
     Startup: StartupScreen,
     Auth: AuthNavigator,
     Shop: ShopNavigator

    //Auth: withTransition(FadeTransition)(AuthNavigator),
    //Shop: withFadeTransition(ShopNavigator)

});



//export default createAppContainer(ProductNavigator);
//export default createAppContainer(ShopNavigator);
export default createAppContainer(MainNavigator);