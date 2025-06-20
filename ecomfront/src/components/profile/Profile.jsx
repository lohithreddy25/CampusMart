import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaBoxOpen, FaPlus, FaShoppingCart } from 'react-icons/fa';
import { fetchUserProducts, fetchUserOrders } from '../../store/actions';
import UserProducts from './UserProducts';
import Loader from '../shared/Loader';

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);
    const { userProducts, productsPagination, userOrders } = useSelector((state) => state.profile);
    const { isLoading, errorMessage } = useSelector((state) => state.errors);

    useEffect(() => {
        // Only fetch data if user is authenticated
        if (user && (user.email || user.username)) {
            // Fetch user products when component mounts
            const defaultQueryParams = {
                pageNumber: 0,
                pageSize: 10,
                sortBy: 'productId',
                sortOrder: 'desc'
            };

            dispatch(fetchUserProducts(defaultQueryParams));

            // Also fetch user orders for the summary
            const orderQueryParams = {
                pageNumber: 0,
                pageSize: 5, // Just get a few recent orders for summary
                sortBy: 'orderDate',
                sortOrder: 'desc'
            };
            dispatch(fetchUserOrders(orderQueryParams));
        }
    }, [dispatch, user]);

    const handleAddProduct = () => {
        navigate('/profile/addProduct');
    };

    const handleViewOrders = () => {
        navigate('/profile/orders');
    };



    if (isLoading && !userProducts.length) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader text="Loading profile..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 mt-[90px]">
            <div className="max-w-7xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                                <FaUser className="text-white text-2xl" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">{user?.username || 'User'}</h1>
                                <p className="text-sm text-gray-500">Member since {new Date().getFullYear()}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex gap-8">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-600">{userProducts?.length || 0}</p>
                                    <p className="text-sm text-gray-600">Products</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Section Header */}
                <div className="bg-white rounded-lg shadow-md mb-8">
                    <div className="flex border-b">
                        <div className="flex items-center px-6 py-4 font-semibold text-blue-600 border-b-2 border-blue-600 bg-blue-50">
                            <FaBoxOpen className="mr-2" />
                            My Products ({userProducts?.length || 0})
                        </div>
                    </div>

                    {/* Products Content */}
                    <div className="p-6">
                        {/* Add Product Button */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">My Products</h2>
                            <button
                                onClick={handleAddProduct}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                            >
                                <FaPlus className="mr-2" />
                                Add Product
                            </button>
                        </div>

                        {/* Products Content */}
                        {userProducts && userProducts.length > 0 ? (
                            <UserProducts
                                products={userProducts}
                                pagination={productsPagination}
                                onRefresh={() => dispatch(fetchUserProducts())}
                            />
                        ) : (
                            <div className="text-center py-12">
                                <FaBoxOpen className="text-6xl text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Products Yet</h3>
                                <p className="text-gray-500 mb-6">Start selling by adding your first product!</p>
                                <button
                                    onClick={handleAddProduct}
                                    className="flex items-center mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                                >
                                    <FaPlus className="mr-2" />
                                    Add Your First Product
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Orders Section */}
                <div className="bg-white rounded-lg shadow-md mb-8">
                    <div className="flex border-b">
                        <div className="flex items-center px-6 py-4 font-semibold text-green-600 border-b-2 border-green-600 bg-green-50">
                            <FaShoppingCart className="mr-2" />
                            Recent Orders
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Recent Orders</h2>
                            <button
                                onClick={handleViewOrders}
                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
                            >
                                <FaShoppingCart className="mr-2" />
                                View All Orders
                            </button>
                        </div>

                        {userOrders && userOrders.length > 0 ? (
                            <div className="space-y-4">
                                {userOrders.slice(0, 3).map((order, index) => (
                                    <div key={order.orderId || index} className="bg-gray-50 p-4 rounded-lg border">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold text-gray-800">
                                                    Order #{order.orderId || 'N/A'}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'Date not available'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    order.status?.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-800' :
                                                    order.status?.toLowerCase() === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                    order.status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {order.status || 'Pending'}
                                                </span>
                                                <p className="font-bold text-gray-800 mt-1">
                                                    ${order.totalAmount?.toFixed(2) || '0.00'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {userOrders.length > 3 && (
                                    <div className="text-center">
                                        <button
                                            onClick={handleViewOrders}
                                            className="text-green-600 hover:text-green-700 font-medium"
                                        >
                                            View more
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <FaShoppingCart className="text-4xl text-gray-300 mx-auto mb-3" />
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Orders Yet</h3>
                                <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                                <button
                                    onClick={() => navigate('/products')}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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

export default Profile;
