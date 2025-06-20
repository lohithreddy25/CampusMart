const initialState = {
    userProducts: [],
    userOrders: [],
    allUserProducts: [],
    allUserOrders: [],
    userProductsCount: 0,
    productsPagination: {},
    ordersPagination: {},
    filteredOrderStatus: null,
};

export const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_USER_PRODUCTS":
            return {
                ...state,
                userProducts: action.payload,
                productsPagination: {
                    pageNumber: action.pageNumber,
                    pageSize: action.pageSize,
                    totalElements: action.totalElements,
                    totalPages: action.totalPages,
                    lastPage: action.lastPage,
                },
            };

        case "FETCH_USER_ORDERS":
            return {
                ...state,
                userOrders: action.payload,
                ordersPagination: {
                    pageNumber: action.pageNumber,
                    pageSize: action.pageSize,
                    totalElements: action.totalElements,
                    totalPages: action.totalPages,
                    lastPage: action.lastPage,
                },
                filteredOrderStatus: null,
            };

        case "FETCH_USER_ORDERS_BY_STATUS":
            return {
                ...state,
                userOrders: action.payload,
                ordersPagination: {
                    pageNumber: action.pageNumber,
                    pageSize: action.pageSize,
                    totalElements: action.totalElements,
                    totalPages: action.totalPages,
                    lastPage: action.lastPage,
                },
                filteredOrderStatus: action.orderStatus,
            };

        case "FETCH_ALL_USER_PRODUCTS":
            return {
                ...state,
                allUserProducts: action.payload,
            };

        case "FETCH_ALL_USER_ORDERS":
            return {
                ...state,
                allUserOrders: action.payload,
            };

        case "FETCH_USER_PRODUCTS_COUNT":
            return {
                ...state,
                userProductsCount: action.payload,
            };

        default:
            return state;
    }
};
