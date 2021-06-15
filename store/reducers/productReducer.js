import  PRODUCTS  from '../../data/dummy-data';
import Product from '../../models/Product';
import { 
    CREATE_PRODUCT, 
    DELETE_PRODUCT, 
    SET_PRODUCTS, 
    UPDATE_PRODUCT 
} from '../actions/productAction';

const initialState = {
    availableProducts: [], //PRODUCTS,
    userProducts: [],//PRODUCTS.filter( p => p.ownerId === 'u1')
};

export default (state = initialState, action) => {

    switch (action.type) {

        case SET_PRODUCTS: {
            return {
                ...state,
                availableProducts: action.products,
                userProducts: action.userProducts
                // userProducts: action.products.filter(
                //     prod => prod.ownerId === 'u1'                    
                // )
            };
        }
        case DELETE_PRODUCT: {
            return {
                ...state,
                userProducts: state.userProducts.filter( 
                    product => product.id != action.productId
                ),
                // userProducts: state.userProducts.filter( (product) => {
                //     return product.id != action.productId;
                // })
                availableProducts: state.availableProducts.filter( 
                    product => product.id != action.productId
                )
                
            };
        }

        case CREATE_PRODUCT: {

            const newProduct = new Product(
                                    action.productData.id, //new Date().toString(),
                                    action.productData.ownerId, //'u1',
                                    action.productData.title,
                                    action.productData.imageUrl,
                                    action.productData.description,
                                    action.productData.price,
                                );

             
            return {
                ...state,
                availableProducts: state.availableProducts.concat(newProduct),
                userProducts: state.userProducts.concat(newProduct),
            };
        }

        case UPDATE_PRODUCT: {

                //-----
                const userProductIndex = state.userProducts.findIndex( p => p.id === action.productId );
                const updatedProduct = new Product(
                                    action.productId,
                                    state.userProducts[userProductIndex].ownerId, //'u1',
                                    action.productData.title,
                                    action.productData.imageUrl,
                                    action.productData.description,
                                    state.userProducts[userProductIndex].price
                                  );

                const updatedUserProducts = [...state.userProducts];
                updatedUserProducts[userProductIndex] = updatedProduct;
                //-----

                //-----
                
                const availableProductIndex = state.availableProducts.findIndex( p => p.id === action.productId );       
                const updatedAvailableProducts = [...state.availableProducts];
                updatedAvailableProducts[availableProductIndex] = updatedProduct;

                //-----

                return {
                    ...state, 
                    availableProducts: updatedAvailableProducts,
                    userProducts: updatedUserProducts                    
                };

        }            
    
        default:
            break;
    }


    return state;
};