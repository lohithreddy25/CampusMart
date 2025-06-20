import React from 'react';
import { FaCheckCircle, FaHome, FaShoppingBag } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const OrderSuccess = ({ onGoHome }) => {
    const navigate = useNavigate();
    
    const handleGoHome = () => {
        if (onGoHome) {
            onGoHome();
        } else {
            navigate('/');
        }
    };

    const handleViewOrders = () => {
        // Navigate to orders page (you can implement this later)
        navigate('/orders');
    };

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center">
                {/* Success Animation */}
                <div className="mb-8">
                    <div className="relative">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <FaCheckCircle className="text-green-500 text-4xl animate-bounce" />
                        </div>
                        <div className="absolute inset-0 w-24 h-24 bg-green-200 rounded-full mx-auto animate-ping opacity-20"></div>
                    </div>
                </div>

                {/* Success Message */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        Order Placed Successfully! 🎉
                    </h1>
                    <p className="text-gray-600 mb-2">
                        Thank you for your purchase!
                    </p>
                    <p className="text-sm text-gray-500">
                        Your order has been confirmed and will be delivered soon.
                    </p>
                </div>

                {/* Order Details */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                    <div className="flex items-center justify-center mb-2">
                        <FaShoppingBag className="text-green-600 mr-2" />
                        <span className="font-semibold text-green-800">Order Confirmed</span>
                    </div>
                    <p className="text-sm text-green-700">
                        Order ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </p>
                    <p className="text-sm text-green-700">
                        Estimated delivery: 3-5 business days
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <button
                        onClick={handleGoHome}
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold 
                                 hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 
                                 shadow-md hover:shadow-lg flex items-center justify-center"
                    >
                        <FaHome className="mr-2" />
                        Continue Shopping
                    </button>
                    
                    <button
                        onClick={handleViewOrders}
                        className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold 
                                 hover:bg-gray-200 transition-all duration-200 border border-gray-300
                                 flex items-center justify-center"
                    >
                        <FaShoppingBag className="mr-2" />
                        View My Orders
                    </button>
                </div>

                {/* Additional Info */}
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-2">What's Next?</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• You'll receive an email confirmation shortly</li>
                        <li>• Track your order status in "My Orders"</li>
                        <li>• Prepare for delivery in 3-5 business days</li>
                    </ul>
                </div>

                {/* Decorative Elements */}
                <div className="mt-8 flex justify-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
