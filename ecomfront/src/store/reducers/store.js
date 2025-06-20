import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./ProductReducer";
import { errorReducer } from "./errorReducer";
import { cartReducer } from "./cartReducer";
import { authReducer } from "./authReducer";
import { paymentMethodReducer } from "./paymentMethodReducer";
import { profileReducer } from "./profileReducer";

const user = localStorage.getItem("auth")?
JSON.parse(localStorage.getItem("auth"))
: null;


const cartItems = localStorage.getItem("cartItems")?
JSON.parse(localStorage.getItem("cartItems"))
: [];

const intialState = {
    auth: {user : user},
    carts: {cart: cartItems},
};


export const store = configureStore({
    reducer: {
        Products: productReducer,
        errors: errorReducer,
        carts : cartReducer,
        auth : authReducer,
        payment: paymentMethodReducer,
        profile: profileReducer,

    },
    preloadedState: intialState,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
                // Ignore these field paths in all actions
                ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
                // Ignore these paths in the state
                ignoredPaths: ['items.dates'],
                // Increase the warning threshold to 100ms
                warnAfter: 100,
            },
        }),
});

export default store;