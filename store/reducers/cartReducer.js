//import  PRODUCTS  from '../../data/dummy-data';

import { ADD_TO_CART, REMOVE_FROM_CART } from "../actions/cartAction";
import CartItem from '../../models/cart-item';
import { ADD_ORDER } from "../actions/orderAction";
import { DELETE_PRODUCT } from "../actions/productAction";


const initialState = {
    items: {},
    totalAmount: 0
};

export default (state = initialState, action) => {

    switch (action.type) {

        case ADD_TO_CART: {
            
            const addedProduct = action.product;
            const prodPrice = addedProduct.price;
            const prodTitle = addedProduct.title;
            
            let updatedOrNewCartItem;

            if ( state.items[addedProduct.id]) {
                //already have the item in the cart
                updatedOrNewCartItem = new CartItem(
                    state.items[addedProduct.id].quantity + 1,
                    prodPrice,
                    prodTitle,
                    state.items[addedProduct.id].sum + prodPrice
                );

            } else {
                //add this item to cart
                updatedOrNewCartItem = new CartItem(1,prodPrice, prodTitle, prodPrice);
            }

            return  {
                ...state,
                items: { ...state.items, [addedProduct.id]: updatedOrNewCartItem },
                totalAmount: state.totalAmount + prodPrice
            };                
        }


        case REMOVE_FROM_CART: {

            const selectedCartitem = state.items[action.productId];
            const currentPrice = selectedCartitem.productPrice;
            const currentQty = selectedCartitem.quantity;
            let updatedCartItems;

            if (currentQty > 1) {
                //decrease it by 1
                const updatedCartItem = new CartItem(
                    selectedCartitem.quantity-1,
                    selectedCartitem.productPrice,
                    selectedCartitem.productTitle,
                    selectedCartitem.sum - currentPrice//selectedCartitem.productPrice
                );
                
                updatedCartItems = { ...state.items, [action.productId]: updatedCartItem };
                
            } else {
                //delete it                
                updatedCartItems = { ...state.items };
                delete updatedCartItems[action.productId];               
            }
            
            return {
                ...state,
                items: updatedCartItems,
                totalAmount: state.totalAmount.toFixed(2) - currentPrice.toFixed(2)//selectedCartitem.productPrice
            };
       
        }

        case ADD_ORDER: {
            return initialState;
        }
        case DELETE_PRODUCT: {

            if (! state.items[action.productId] ) {
                return state;
            }

            const updatedItems = {...state.items};
            const itemTotal= state.items[action.productId].sum;
            delete updatedItems[action.productId];

            return {
                ...state,
                items: updatedItems,
                totalAmount: state.totalAmount - itemTotal
            }; 
        }

    }

    return state;
};