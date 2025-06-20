import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCreditCard, FaShoppingCart, FaCheckCircle } from 'react-icons/fa';
import { formatPrice } from '../../utils/formatPrice';
import { placeOrder } from '../../store/actions';
import OrderSuccess from './OrderSuccess';
import toast from 'react-hot-toast';

const OrderSummary = () => {
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { cart } = useSelector((state) => state.carts);
    const { selectedUserCheckoutAddress } = useSelector((state) => state.auth);
    const { paymentMethod } = useSelector((state) => state.payment);

    // Calculate totals
    const subtotal = cart?.reduce((acc, item) => acc + (item.specialPrice * item.quantity), 0) || 0;
    const shipping = 0; // Free shipping
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;

    const handlePlaceOrder = async () => {
        setIsPlacingOrder(true);

        try {
            // Calculate order totals
            const orderData = {
                subtotal,
                shipping,
                tax,
                totalAmount: total
            };

            // Place order using the API
            const result = await dispatch(placeOrder(orderData, toast, null));

            if (result && result.success) {
                setOrderPlaced(true);
            } else {
                // Error handling is done in the action
                setIsPlacingOrder(false);
            }
        } catch (error) {
            console.error('Order placement error:', error);
            toast.error('Failed to place order. Please try again.');
            setIsPlacingOrder(false);
        }
    };

    if (orderPlaced) {
        return <OrderSuccess onGoHome={() => navigate('/')} />;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Summary</h1>
                <p className="text-gray-600">Review your order before placing it</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Order Details */}
                <div className="space-y-6">
                    {/* Shipping Address */}
                    <div className="bg-white p-6 rounded-lg shadow-md border">
                        <div className="flex items-center mb-4">
                            <FaMapMarkerAlt className="text-blue-500 mr-3" />
                            <h3 className="text-lg font-semibold">Shipping Address</h3>
                        </div>
                        {selectedUserCheckoutAddress ? (
                            <div className="text-gray-700">
                                <p className="font-medium">{selectedUserCheckoutAddress.buildingName}</p>
                                <p>{selectedUserCheckoutAddress.street}</p>
                                <p>{selectedUserCheckoutAddress.city}, {selectedUserCheckoutAddress.state}</p>
                                <p>{selectedUserCheckoutAddress.pincode}</p>
                                <p>{selectedUserCheckoutAddress.country}</p>
                            </div>
                        ) : (
                            <p className="text-red-500">No address selected</p>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white p-6 rounded-lg shadow-md border">
                        <div className="flex items-center mb-4">
                            <FaCreditCard className="text-green-500 mr-3" />
                            <h3 className="text-lg font-semibold">Payment Method</h3>
                        </div>
                        <p className="text-gray-700 font-medium">{paymentMethod || 'COD'}</p>
                        <p className="text-sm text-gray-500">Cash on Delivery</p>
                    </div>
                </div>

                {/* Order Items & Total */}
                <div className="space-y-6">
                    {/* Items */}
                    <div className="bg-white p-6 rounded-lg shadow-md border">
                        <div className="flex items-center mb-4">
                            <FaShoppingCart className="text-purple-500 mr-3" />
                            <h3 className="text-lg font-semibold">Order Items ({cart?.length || 0})</h3>
                        </div>
                        <div className="space-y-4 max-h-60 overflow-y-auto">
                            {cart?.map((item, index) => (
                                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded">
                                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.productName}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        ) : (
                                            <FaShoppingCart className="text-gray-400 text-xl" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-800">{item.productName}</h4>
                                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">{formatPrice(item.specialPrice * item.quantity)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Total */}
                    <div className="bg-white p-6 rounded-lg shadow-md border">
                        <h3 className="text-lg font-semibold mb-4">Order Total</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span className="text-green-600">Free</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax (10%)</span>
                                <span>{formatPrice(tax)}</span>
                            </div>
                            <hr className="my-2" />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={isPlacingOrder || !selectedUserCheckoutAddress || cart?.length === 0}
                            className={`w-full mt-6 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                                isPlacingOrder || !selectedUserCheckoutAddress || cart?.length === 0
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg transform hover:scale-105'
                            }`}
                        >
                            {isPlacingOrder ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Placing Order...
                                </div>
                            ) : (
                                'Place Order'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
