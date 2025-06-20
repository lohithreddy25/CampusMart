import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { fetchUserOrders } from '../../store/actions';
import UserOrders from './UserOrders';
import Loader from '../shared/Loader';

const ProfileOrders = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);
    const { userOrders, ordersPagination } = useSelector((state) => state.profile);
    const { isLoading, errorMessage } = useSelector((state) => state.errors);

    useEffect(() => {
        // Only fetch data if user is authenticated
        if (user && (user.email || user.username)) {
            // Fetch user orders when component mounts
            const defaultQueryParams = {
                pageNumber: 0,
                pageSize: 10,
                sortBy: 'orderDate',
                sortOrder: 'desc'
            };

            dispatch(fetchUserOrders(defaultQueryParams));
        }
    }, [dispatch, user]);

    const handleBackToProfile = () => {
        navigate('/profile');
    };

    if (isLoading && !userOrders.length) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader text="Loading orders..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 mt-[90px]">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={handleBackToProfile}
                                className="mr-4 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <FaArrowLeft className="text-xl" />
                            </button>
                            <div className="flex items-center">
                                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                                    <FaShoppingCart className="text-white text-2xl" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
                                    <p className="text-gray-600">{user?.username || user?.name || 'User'}'s Order History</p>
                                    <p className="text-sm text-gray-500">Track and manage your orders</p>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-600">{userOrders?.length || 0}</p>
                                <p className="text-sm text-gray-600">Total Orders</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders Content */}
                <div className="bg-white rounded-lg shadow-md">
                    <div className="p-6">
                        {userOrders && userOrders.length > 0 ? (
                            <UserOrders
                                orders={userOrders}
                                pagination={ordersPagination}
                                onRefresh={() => dispatch(fetchUserOrders())}
                            />
                        ) : (
                            <div className="text-center py-12">
                                <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Orders Yet</h3>
                                <p className="text-gray-500 mb-6">You haven't placed any orders yet. Start shopping to see your orders here!</p>
                                <button
                                    onClick={() => navigate('/products')}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                                >
                                    Start Shopping
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Error Message */}
                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {errorMessage}
                    </div>
                )}


            </div>
        </div>
    );
};

export default ProfileOrders;
