import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FaCalendar, FaMapMarkerAlt, FaCreditCard, FaBox } from 'react-icons/fa';
import { formatPrice } from '../../utils/formatPrice';
import Paginations from '../shared/Paginations';
import { fetchUserOrders } from '../../store/actions';

const UserOrders = ({ orders, pagination, onRefresh }) => {
    const [currentPage, setCurrentPage] = useState(pagination?.pageNumber || 0);
    const dispatch = useDispatch();

    const handlePageChange = (page) => {
        setCurrentPage(page);
        const queryParams = {
            pageNumber: page,
            pageSize: pagination?.pageSize || 10,
            sortBy: 'orderDate',
            sortOrder: 'desc'
        };

        dispatch(fetchUserOrders(queryParams));
    };



    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };



    return (
        <div>

            {/* Orders List */}
            <div className="space-y-6 mb-8">
                {orders.map((order) => (
                    <div key={order.orderId} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        {/* Order Header */}
                        <div className="p-4 border-b border-gray-100">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-gray-800 text-lg">
                                        Order #{order.orderId || 'N/A'}
                                    </h3>
                                    <div className="flex items-center text-sm text-gray-600 mt-1">
                                        <FaCalendar className="mr-2" />
                                        {formatDate(order.orderDate || new Date())}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-gray-800">
                                        {formatPrice(order.totalAmount || 0)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Order Details */}
                        <div className="p-4">
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                {/* Shipping Address */}
                                <div className="flex items-start">
                                    <FaMapMarkerAlt className="text-gray-400 mr-3 mt-1" />
                                    <div>
                                        <p className="font-medium text-gray-800">Shipping Address</p>
                                        <p className="text-sm text-gray-600">
                                            {order.address ?
                                                `${order.address.street || ''} ${order.address.buildingName || ''}, ${order.address.city || ''}, ${order.address.state || ''} ${order.address.pincode || ''}`.trim().replace(/^,\s*|,\s*$/g, '').replace(/,\s*,/g, ',')
                                                : 'Address not available'}
                                        </p>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="flex items-start">
                                    <FaCreditCard className="text-gray-400 mr-3 mt-1" />
                                    <div>
                                        <p className="font-medium text-gray-800">Payment Method</p>
                                        <p className="text-sm text-gray-600">
                                            {order.paymentMethod || 'COD'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="mb-4">
                                <div className="space-y-2">
                                    {order.items?.slice(0, 3).map((item, index) => (
                                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center mr-3">
                                                    {item.image ? (
                                                        <img
                                                            src={item.image}
                                                            alt={item.productName}
                                                            className="w-10 h-10 object-cover rounded"
                                                        />
                                                    ) : (
                                                        <FaBox className="text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{item.productName || 'Product'}</p>
                                                    <p className="text-xs text-gray-600">Qty: {item.quantity || 1}</p>
                                                </div>
                                            </div>
                                            <p className="font-medium text-sm">{formatPrice(item.price || 0)}</p>
                                        </div>
                                    ))}
                                    {order.items?.length > 3 && (
                                        <p className="text-sm text-gray-600 text-center">
                                            +{order.items.length - 3} more items
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Expected Delivery */}
                            <div className="pt-3 border-t border-gray-100">
                                <div className="text-sm text-gray-600">
                                    Expected delivery: {order.expectedDelivery || '3-5 business days'}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center">
                    <Paginations 
                        numberofPage={pagination.totalPages}
                        totalProducts={pagination.totalElements}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            {/* Order Summary Stats */}
            <div className="bg-gray-50 rounded-lg p-4 mt-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
                        <p className="text-sm text-gray-600">Total Orders</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">
                            {formatPrice(orders.reduce((total, order) => total + (order.totalAmount || 0), 0))}
                        </p>
                        <p className="text-sm text-gray-600">Total Spent</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserOrders;
