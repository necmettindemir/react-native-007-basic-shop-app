import Product from "../../models/Product";

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';


export const fbdblink = 'https://rn-complete-guide-001-default-rtdb.europe-west1.firebasedatabase.app';

export const  fetchProducts =  () => {

    // return dispatch => {
    //     dispatch(
    //         {
    //             type: SET_PRODUCTS,
    //             products: []
    //         }
    //     );
    // };

    return async (dispatch,getState) => {


        const userId = getState().auth.userId;

        try {
            
            // ---- any async code can be run here. e.g db operation
                    
            
                    
            const response = await fetch(fbdblink+'/products.json');


            if (!response.ok) {
                throw  new Error('sth went wrong..');
            }

            const resData =  await response.json();

            // console.log('req body: ',         
            //             JSON.stringify({
            //                 title,
            //                 description,
            //                 imageUrl,
            //                 price
            //             })                
            // );


            console.log('resData:', resData);        


            const loadedProducts = [];

            for (const key in resData) {
                loadedProducts.push(new Product(
                        key, 
                        resData[key].ownerId,//'u1', //userId,
                        resData[key].title,
                        resData[key].imageUrl,
                        resData[key].description,
                        resData[key].price
                        ));
            } 


            // ---- /any async code can be run here. e.g db operation

            dispatch({
                    type: SET_PRODUCTS,
                    products: loadedProducts,
                    userProducts: loadedProducts.filter( p => p.ownerId === userId)
            });

        } catch (error) {
                   throw error; 
        }

    };

};

export const deleteProduct = (productId) => {

    return  async (dispatch, getState) => {

        
        //----- rest-db operations  ---- 
        const token = getState().auth.token;

        let fullfbdblink = `${fbdblink}/products/${productId}.json?auth=${token}`;

        const response = await fetch(fullfbdblink, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('sth went wrong in deleteProd')
        }

        const resData = await response.json();

        //----- /rest-db operations  ---- 


        dispatch(
            {
                type: DELETE_PRODUCT,
                productId: productId
            }
        );

    };


};


/* export const createProduct = (title, description, imageUrl, price) => {
    return {
        type: CREATE_PRODUCT,
        productData: {
            title,
            description,
            imageUrl,
            price
        }
    };
}; */


export const createProduct = (title, description, imageUrl, price) => {
        

    // console.log('title: ', title);
    // console.log('description: ', description);
    // console.log('imageUrl: ', imageUrl);
    // console.log('price: ', price);


    return async (dispatch, getState) => {

        // ---- any async code can be run here. e.g db operation
        
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        
        let fullfbdblink = `${fbdblink}/products.json?auth=${token}`;
        

        const response = await fetch(
            //fbdblink+'/products.json'+'?auth='+token, 
            fullfbdblink,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                imageUrl,
                price,
                ownerId: userId
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

        if (!response.ok) {
            throw new Error('sth went wrong in createProd')
        }

        const resData = await response.json();

        //console.log('response:', response);

        // ---- /any async code can be run here. e.g db operation

        dispatch(
            {
                type: CREATE_PRODUCT,
                productData: {
                    id: resData.name,
                    title,
                    description,
                    imageUrl,
                    price,
                    ownerId: userId
                }
            }
        );

    };

};

export const updateProduct = (id, title, description, imageUrl) => {
    

    return  async (dispatch, getState) => {

        console.log('getState(): ' , getState());
        //---- do rest-db operations here ----- 
        const token = getState().auth.token;        

        let fullfbdblink = `${fbdblink}/products/${id}.json?auth=${token}`;
         
        console.log('fullfbdblink: ', fullfbdblink);
        //const response = await fetch(fbdblink+'/product.json', 
        //const response = await fetch(fbdblink + `/product/${id}.json`, 
        const response = await fetch(fullfbdblink, 
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({                
                title,
                description,
                imageUrl
            })
        });
    

        // if (!response.ok) {
        //     throw new Error('sth went wrong in updateProd')
        // }


        if (!response.ok) {

            //console.log('response:', response);

            const errorResData = await response.json();
            console.log('errorResData:', errorResData);
            const errorMsg = errorResData.error;

            let errorMessage = 'sth went wrong in upd prod : ' + errorMsg; 

            // if (errorId === 'EMAIL_NOT_FOUND') {                             
            //     errorMessage = 'email not found!';
            // } else if (errorId === 'INVALID_PASSWORD') {
            //     errorMessage = 'pass is not valid';
            // } else if ( errorId === 'USER_DISABLED') {
            //     errorMessage = 'user is disabled';
            // }


            throw new Error(errorMessage);        
        }

        const resData = await response.json();
        //console.log('response.ok: ',response.ok);

        //---- /do rest-db operations here ----- 


        dispatch(

            {
                type: UPDATE_PRODUCT,
                productId: id,
                productData: {
                    title,
                    description,
                    imageUrl            
                }
            }

        );

    };
    

};