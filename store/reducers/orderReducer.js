import Order from "../../models/Order";
import { ADD_ORDER, SET_ORDERS } from "../actions/orderAction";

const initialState = {
    orders: []
};


export default (state=initialState, action) =>  {

    switch (action.type) {

        case SET_ORDERS: {
            return {
                ...state,
                orders: action.orders
            };
        }

        case ADD_ORDER: {
            const newOrder = new Order(
                action.orderData.id, //new Date().toString(),
                action.orderData.items,
                action.orderData.amount,
                action.orderData.date//new Date()
            );

            return {
                ...state,
                orders: state.orders.concat(newOrder)
                //orders: [orders, newOrder]
            }    

        }

                                    
    }

    return state;

};