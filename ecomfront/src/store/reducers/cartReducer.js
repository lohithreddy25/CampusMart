const intialState = {
    cart: [],
    totalPrice: 0,
    cartId: null,
}

export const cartReducer = (state= intialState,action) => {
    switch (action.type) {
        case "ADD_CART":
            const productToAdd = action.payload;
            const existingProduct = state.cart.find(
                (item) => String(item.productId) === String(productToAdd.productId)
            );
            // console.log('ADD_CART', { productToAdd, existingProduct, cart: state.cart });
            if(existingProduct){
                const updatedCart = state.cart.map((item) =>
                    String(item.productId) === String(productToAdd.productId) ? productToAdd : item
                );
                return {
                    ...state,
                    cart: updatedCart,
                };
            } else {
                return {
                    ...state,
                    cart: [...state.cart, productToAdd],
                };
            }

            case "REMOVE_CART":
                return {
                    ...state,
                    cart: state.cart.filter(
                        (item) => item.productId !== action.payload.productId
                    ),
                };

            case "GET_USER_CART_PRODUCTS":
                return {
                    ...state,
                    cart: action.payload,
                    totalPrice : action.totalPrice,
                    cartId: action.cartId,
                };

            case "CLEAR_CART":
                return {
                    ...state,
                    cart: [],
                    totalPrice: 0,
                    cartId: null,
                };
        default:
            return state;
    }
}