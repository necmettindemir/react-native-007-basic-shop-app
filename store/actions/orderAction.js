import Order from "../../models/Order";
//import { SET_ORDERS } from "./orderAction";
//import { FIREBASE_KEY } from '../../config/key';

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

export const fbdblink = 'https://rn-complete-guide-001-default-rtdb.europe-west1.firebasedatabase.app';

export const fetchOrders = () => {


    return async (dispatch, getState) => {

          try {
                
            // ---- any async code can be run here. e.g db operation
                    
            const userId = getState().auth.userId;
                    
            let fullfbdblink = `${fbdblink}/orders/${userId}.json`;
        
            //const response = await fetch(fbdblink+'/orders/u1.json');
            //const response = await fetch(fbdblink+'/orders/'+ userId +'.json');
            const response = await fetch(fullfbdblink);


            if (!response.ok) {
                throw  new Error('sth went wrong..in fetch orders');
            }

            const resData =  await response.json();

            console.log('resData:', resData);        


            const loadedOrders = [];

            for (const key in resData) {
                loadedOrders.push(new Order(
                        key,                     
                        resData[key].cartItems,
                        resData[key].totalAmount,
                        new Date(resData[key].date)
                        ));
            } 


            // ---- /any async code can be run here. e.g db operation

        
            dispatch({ type: SET_ORDERS, orders: loadedOrders });


        } catch (error) {
                throw error; 
        }
      
    };
         

};



export const addOrder = (cartItems, totalAmount) => {


    return async (dispatch, getState) => {

        const date = new Date();
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        //----- rest-db opreations ---

        console.log('getState(): ', getState());

        let fullfbdblink = `${fbdblink}/orders/${userId}.json?auth=${token}`;
        

        const response = await fetch(
            //fbdblink+'/orders/u1.json', 
            fullfbdblink,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                //'Authorization': 'Bearer ' + token
                //'Authorization': 'key=' + FIREBASE_KEY
                
            },
            body: JSON.stringify({
                cartItems,
                totalAmount,
                date: date.toISOString()
            })
        });


        // console.log('req body: ',         
        //             JSON.stringify({
        //                 title,
        //                 description,
        //                 imageUrl,
        //                 price
        //             })                
        // );

        // if (!response.ok) {
        //     throw new Error('sth went wrong in createOrder')
        // }


        if (!response.ok) {

            //console.log('response:', response);

            const errorResData = await response.json();
            console.log('errorResData:', errorResData);
            const serverErrMsg = errorResData.error;

            let errorMessage = 'sth went wrong in adding order'; 

            throw new Error(errorMessage + " : " + serverErrMsg);        
        }

        const resData = await response.json();

        //console.log('response:', response);

        //----- /rest-db opreations ---

        dispatch({
                type: ADD_ORDER,
                orderData: {
                    id: resData.name,
                    items: cartItems,
                    amount: totalAmount,
                    date: date
                }
        });
        
    };

};