import api from "../../api/api"
import toast from "react-hot-toast";

export const fetchProducts = (queryString) => async (dispatch) => {
    try {
        dispatch({type: "IS_FETCHING"});
        dispatch({ type: "SET_LOADING", payload: true });
        const {data} = await api.get(`/public/products?${queryString}`);
        dispatch({
            type: "FETCH_PRODUCTS",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({type: "IS_SUCCESS"});
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR", 
            payload: error.response?.data?.message || "Failed to fetch products" 
        });
    } finally {
        dispatch({ type: "SET_LOADING", payload: false });
    }
};

export const fetchCategories = () => async (dispatch) => {
    try {
        dispatch({type: "CATEGORY_LOADER"});
        const {data} = await api.get(`/public/categories`);
        dispatch({
            type: "FETCH_CATEGORIES",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({type: "IS_SUCCESS"});
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR", 
            payload: error.response?.data?.message || "Failed to fetch categories" 
        });
    } finally {
        dispatch({ type: "SET_LOADING", payload: false });
    }
};

export const addToCart = (data, qty=1, toast) =>
    async (dispatch, getState) => {
        try {
            const products = getState().Products.products || [];
            // Try both productId and id for matching
            const getProduct = products.find(
                (item) => item.productId === data.productId || item.id === data.productId || item.productId === data.id
            );
            // Use quantity from store if found, else from data, else default to 1
            const availableQuantity = getProduct ? getProduct.quantity : (data.quantity ?? 1);
            const isQuantityExist = availableQuantity >= qty;

            if(isQuantityExist) {
                // Add to local cart first for immediate UI feedback
                dispatch({type: "ADD_CART", payload:{...data, quantity: qty}});
                localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));

                // Sync with backend if user is authenticated
                const { user } = getState().auth;
                if (user && (user.email || user.username)) {
                    try {
                        await api.post(`/carts/products/${data.productId}/quantity/${qty}`);
                    } catch (error) {
                        console.warn('Failed to sync cart with backend:', error);
                        // Don't show error to user as local cart still works
                    }
                }

                if (toast) toast.success(`${data?.productName} added to cart`);
            } else {
                if (toast) toast.error("Out of stock");
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            if (toast) toast.error("Failed to add item to cart");
        }
    };

export const increaseCartQuantity = (data, toast, currentQuantity, setCurrentQuantity) =>
(dispatch, getState) => {
    const products = getState().Products.products || [];
    const getProduct = products.find(
        (item) => String(item.productId) === String(data.productId)
    );
    if (!getProduct) {
        toast.error("Product not found");
        return;
    }
    const isQuantityExist = getProduct.quantity >= currentQuantity + 1;

    if (isQuantityExist) {
        const newQuantity = currentQuantity + 1;
        setCurrentQuantity(newQuantity);

        dispatch({
            type: "ADD_CART",
            payload: {...data, quantity: newQuantity },
        });
        localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
    } else {
        toast.error("Quantity Reached to Limit");
    }
};

export const decreaseCartQuantity = (data, newQuantity) =>
(dispatch, getState) => {
    dispatch({
        type: "ADD_CART",
        payload: {...data, quantity: newQuantity },
    });
    localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
}

export const removeFromCart = (data, toast) =>
(dispatch, getState) => {
    dispatch({type:"REMOVE_CART", payload: data});
    toast.success(`${data.productName} removed from cart `);
    localStorage.setItem("cartItems", JSON.stringify(getState().carts.cart));
}

export const authenticateSignInUser = (sendData, toast, reset, navigate, setLoader) => async(dispatch) => {
    try {
        setLoader(true);
        const {data} = await api.post("/auth/signin",sendData);
        dispatch({type: "LOGIN_USER", payload: data});
        localStorage.setItem("auth", JSON.stringify(data));
        reset();
        toast.success("LOgin Success");
        navigate("/");
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Internal Server Error");
        
    } finally{
        setLoader(false)
    }
}

export const RegisterNewUser = (sendData, toast, reset, navigate, setLoader) => async(dispatch) => {
    try {
        setLoader(true);
        const {data} = await api.post("/auth/signup",sendData);
        reset();
        toast.success(data?.message || "User Registered Successfully");
        navigate("/login");
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || error?.response?.data?.password || "Internal Server Error");
        
    } finally{
        setLoader(false)
    }
}


export const logOutUser = (navigate) => (dispatch) => {
    dispatch({ type:"LOG_OUT" });
    localStorage.removeItem("auth");
    navigate("/login");
};

export const addUpdateUserAddress =
     (sendData, toast, addressId, setOpenAddressModal) => async (dispatch, getState) => {
    
    /*const { user } = getState().auth;
    await api.post(`/addresses`, sendData, {
          headers: { Authorization: "Bearer " + user.jwtToken },
        });
    */
    dispatch({ type:"BUTTON_LOADER" });
    try {
        if (!addressId) {
            const { data } = await api.post("/addresses", sendData);
        } else {
            await api.put(`/addresses/${addressId}`, sendData);
        }
        dispatch(getUserAddresses());
        toast.success("Address saved successfully");
        dispatch({ type:"IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Internal Server Error");
        dispatch({ type:"IS_ERROR", payload: null });
    } finally {
        setOpenAddressModal(false);
    }
};

export const deleteUserAddress = 
    (toast, addressId, setOpenDeleteModal) => async (dispatch, getState) => {
    try {
        dispatch({ type: "BUTTON_LOADER" });
        await api.delete(`/addresses/${addressId}`);
        dispatch({ type: "IS_SUCCESS" });
        dispatch(getUserAddresses());
        dispatch(clearCheckoutAddress());
        toast.success("Address deleted successfully");
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Some Error Occured",
         });
    } finally {
        setOpenDeleteModal(false);
    }
};

export const clearCheckoutAddress = () =>{
    return {
        type: "REMOVE_CHECKOUT_ADDRESS",
    }
}


export const getUserAddresses = () => async (dispatch, getState) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const { data } = await api.get(`/users/addresses`);
        dispatch({type: "USER_ADDRESS", payload: data});
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch user addresses",
         });
    }
};

export const selectUserCheckoutAddress = (address) => {
    localStorage.setItem("CHECKOUT_ADDRESS", JSON.stringify(address));
    
    return {
        type: "SELECT_CHECKOUT_ADDRESS",
        payload: address,
    }
};

export const addPaymentMethod = (method) => {
    return {
        type: "ADD_PAYMENT_METHOD",
        payload: method,
    }
};

export const createUserCart = (sendCartItems) => async (dispatch, getState) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        await api.post('/cart/create', sendCartItems);
        await dispatch(getUserCart());
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to create cart items",
         });
    }
};

export const getUserCart = () => async (dispatch, getState) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const { data } = await api.get('/carts/users/cart');

        // Ensure we only store serializable data
        const serializedProducts = data.products?.map(product => ({
            ...product,
            // Remove any potential non-serializable fields
            createdAt: product.createdAt ? new Date(product.createdAt).toISOString() : null,
            updatedAt: product.updatedAt ? new Date(product.updatedAt).toISOString() : null,
        })) || [];

        dispatch({
            type: "GET_USER_CART_PRODUCTS",
            payload: serializedProducts,
            totalPrice: data.totalPrice,
            cartId: data.cartId
        })
        // Update localStorage with the new cart data
        localStorage.setItem("cartItems", JSON.stringify(serializedProducts));
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to fetch cart items",
         });
    }
};

export const clearCart = () => (dispatch) => {
    dispatch({ type: "CLEAR_CART" });
    localStorage.removeItem("cartItems");
};

export const addProduct = (productData, categoryId, toast, reset, setLoader) => async (dispatch) => {
    try {
        setLoader(true);
        dispatch({ type: "IS_FETCHING" });

        // Use different endpoints based on whether image is present
        let requestData;
        let endpoint;
        let headers = {};

        if (productData.image) {
            // Use multipart endpoint for products with images
            requestData = new FormData();
            Object.keys(productData).forEach(key => {
                if (key === 'image' && productData[key]) {
                    requestData.append('image', productData[key]);
                } else if (key !== 'image') {
                    requestData.append(key, productData[key]);
                }
            });
            endpoint = `/user/categories/${categoryId}/product/with-image`;
            headers['Content-Type'] = 'multipart/form-data';
        } else {
            // Use JSON endpoint for products without images
            const { image, ...dataWithoutImage } = productData;
            requestData = dataWithoutImage;
            endpoint = `/user/categories/${categoryId}/product`;
            headers['Content-Type'] = 'application/json';
        }

        const { data } = await api.post(endpoint, requestData, { headers });
        dispatch({ type: "IS_SUCCESS" });
        toast.success("Product added successfully!");
        reset(); // Reset the form
    } catch (error) {
        console.log(error);
        dispatch({
            type: "IS_ERROR",
            payload: error?.response?.data?.message || "Failed to add product",
         });
        toast.error(error?.response?.data?.message || "Failed to add product");
    } finally {
        setLoader(false);
    }
};

export const fetchUserProducts = (queryParams = {}) => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING" });

        // Build query string from parameters
        const params = new URLSearchParams();
        if (queryParams.pageNumber !== undefined) params.append('pageNumber', queryParams.pageNumber);
        if (queryParams.pageSize !== undefined) params.append('pageSize', queryParams.pageSize);
        if (queryParams.sortBy) params.append('sortBy', queryParams.sortBy);
        if (queryParams.sortOrder) params.append('sortOrder', queryParams.sortOrder);

        const queryString = params.toString();
        const { data } = await api.get(`/user/products${queryString ? `?${queryString}` : ''}`);

        dispatch({
            type: "FETCH_USER_PRODUCTS",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({
            type: "IS_ERROR",
            payload: error.response?.data?.message || "Failed to fetch user products"
        });
    }
};

export const fetchUserOrders = (queryParams = {}) => async (dispatch, getState) => {
    try {
        dispatch({ type: "IS_FETCHING" });

        // Get user from auth state
        const { user } = getState().auth;

        if (!user || (!user.email && !user.username)) {
            throw new Error("User not authenticated");
        }

        // Build query string from parameters
        const params = new URLSearchParams();
        if (queryParams.pageNumber !== undefined) params.append('pageNumber', queryParams.pageNumber);
        if (queryParams.pageSize !== undefined) params.append('pageSize', queryParams.pageSize);
        if (queryParams.sortBy) params.append('sortBy', queryParams.sortBy);
        if (queryParams.sortOrder) params.append('sortOrder', queryParams.sortOrder);

        const queryString = params.toString();
        // Use the JWT-based endpoint that uses email from the token
        const apiUrl = `/user/orders${queryString ? `?${queryString}` : ''}`;

        const response = await api.get(apiUrl);
        const data = response.data;

        dispatch({
            type: "FETCH_USER_ORDERS",
            payload: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        dispatch({
            type: "IS_ERROR",
            payload: error.response?.data?.message || "Failed to fetch user orders"
        });
    }
};

// Fetch user orders by status
export const fetchUserOrdersByStatus = (orderStatus, queryParams = {}) => async (dispatch, getState) => {
    try {
        dispatch({ type: "IS_FETCHING" });

        // Get user from auth state
        const { user } = getState().auth;

        if (!user || (!user.email && !user.username)) {
            throw new Error("User not authenticated");
        }

        // Build query string from parameters
        const params = new URLSearchParams();
        if (queryParams.pageNumber !== undefined) params.append('pageNumber', queryParams.pageNumber);
        if (queryParams.pageSize !== undefined) params.append('pageSize', queryParams.pageSize);
        if (queryParams.sortBy) params.append('sortBy', queryParams.sortBy);
        if (queryParams.sortOrder) params.append('sortOrder', queryParams.sortOrder);

        const queryString = params.toString();
        // Use the JWT-based endpoint that uses email from the token
        const { data } = await api.get(`/user/orders/status/${orderStatus}${queryString ? `?${queryString}` : ''}`);

        dispatch({
            type: "FETCH_USER_ORDERS_BY_STATUS",
            payload: data.content,
            orderStatus: orderStatus,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            lastPage: data.lastPage,
        });
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        dispatch({
            type: "IS_ERROR",
            payload: error.response?.data?.message || "Failed to fetch user orders by status"
        });
    }
};

// Fetch all user products (no pagination)
export const fetchAllUserProducts = () => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING" });
        const { data } = await api.get('/user/products/all');
        dispatch({
            type: "FETCH_ALL_USER_PRODUCTS",
            payload: data,
        });
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        console.log(error);
        dispatch({
            type: "IS_ERROR",
            payload: error.response?.data?.message || "Failed to fetch all user products"
        });
    }
};

// Fetch all user orders (no pagination)
export const fetchAllUserOrders = () => async (dispatch, getState) => {
    try {
        dispatch({ type: "IS_FETCHING" });

        // Get user from auth state
        const { user } = getState().auth;

        if (!user || (!user.email && !user.username)) {
            throw new Error("User not authenticated");
        }

        // Use the JWT-based endpoint that uses email from the token
        const { data } = await api.get(`/user/orders/all`);
        dispatch({
            type: "FETCH_ALL_USER_ORDERS",
            payload: data,
        });
        dispatch({ type: "IS_SUCCESS" });
    } catch (error) {
        dispatch({
            type: "IS_ERROR",
            payload: error.response?.data?.message || "Failed to fetch all user orders"
        });
    }
};

// Place order with COD payment method
export const placeOrder = (orderData, toast, navigate) => async (dispatch, getState) => {
    try {
        dispatch({ type: "IS_FETCHING" });

        // Get cart and user data from state
        const { cart } = getState().carts;
        const { selectedUserCheckoutAddress } = getState().auth;
        const { paymentMethod } = getState().payment;

        // Validate required data
        if (!selectedUserCheckoutAddress || !selectedUserCheckoutAddress.addressId) {
            throw new Error("Please select a delivery address");
        }

        if (!cart || cart.length === 0) {
            throw new Error("Your cart is empty");
        }

        // Prepare order data according to backend CODOrderRequestDTO structure
        const orderPayload = {
            addressId: selectedUserCheckoutAddress.addressId
        };

        const { data } = await api.post('/order/users/cod', orderPayload);

        dispatch({ type: "IS_SUCCESS" });
        dispatch({ type: "CLEAR_CART" }); // Clear cart after successful order
        localStorage.removeItem("cartItems");

        if (toast) {
            toast.success(data?.message || "Order placed successfully!");
        }

        // Navigate to success page or profile orders
        if (navigate) {
            navigate('/profile/orders');
        }

        return { success: true, data };
    } catch (error) {
        dispatch({
            type: "IS_ERROR",
            payload: error.response?.data?.message || "Failed to place order"
        });

        if (toast) {
            toast.error(error.response?.data?.message || "Failed to place order");
        }

        return { success: false, error: error.response?.data?.message || "Failed to place order" };
    }
};

// Get user products count
export const fetchUserProductsCount = () => async (dispatch) => {
    try {
        const { data } = await api.get('/user/products/count');
        dispatch({
            type: "FETCH_USER_PRODUCTS_COUNT",
            payload: data,
        });
    } catch (error) {
        console.log(error);
        dispatch({
            type: "IS_ERROR",
            payload: error.response?.data?.message || "Failed to fetch user products count"
        });
    }
};

// Product CRUD operations
export const updateProduct = (productId, productData, toast) => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING" });

        // Update product data first
        const { image, ...dataWithoutImage } = productData;

        const { data } = await api.put(`/user/products/${productId}`, dataWithoutImage, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // If image is provided, update it separately
        if (image) {
            const imageFormData = new FormData();
            imageFormData.append('image', image);

            await api.put(`/user/products/${productId}/image`, imageFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        }

        dispatch({ type: "UPDATE_PRODUCT_SUCCESS", payload: data });

        if (toast) toast.success("Product updated successfully!");

        return data;
    } catch (error) {
        dispatch({ type: "UPDATE_PRODUCT_FAILURE", payload: error.response?.data?.message || error.message });
        if (toast) toast.error(error.response?.data?.message || "Failed to update product");
        throw error;
    }
};

export const deleteProduct = (productId, toast) => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING" });

        await api.delete(`/user/products/${productId}`);

        dispatch({ type: "DELETE_PRODUCT_SUCCESS", payload: productId });

        if (toast) toast.success("Product deleted successfully!");

        return productId;
    } catch (error) {
        dispatch({ type: "DELETE_PRODUCT_FAILURE", payload: error.response?.data?.message || error.message });
        if (toast) toast.error(error.response?.data?.message || "Failed to delete product");
        throw error;
    }
};

export const createProduct = (productData, toast) => async (dispatch) => {
    try {
        dispatch({ type: "IS_FETCHING" });

        const formData = new FormData();

        // Append product data
        Object.keys(productData).forEach(key => {
            if (key === 'image' && productData[key]) {
                formData.append('image', productData[key]);
            } else if (key !== 'image') {
                formData.append(key, productData[key]);
            }
        });

        const { data } = await api.post('/admin/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        dispatch({ type: "CREATE_PRODUCT_SUCCESS", payload: data });

        if (toast) toast.success("Product created successfully!");

        return data;
    } catch (error) {
        dispatch({ type: "CREATE_PRODUCT_FAILURE", payload: error.response?.data?.message || error.message });
        if (toast) toast.error(error.response?.data?.message || "Failed to create product");
        throw error;
    }
};
