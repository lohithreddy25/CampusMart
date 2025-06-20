import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FaEdit, FaTrash, FaBox } from 'react-icons/fa';
import { formatPrice } from '../../utils/formatPrice';
import Paginations from '../shared/Paginations';
import { fetchUserProducts, deleteProduct } from '../../store/actions';
import EditProductModal from './EditProductModal';
import toast from 'react-hot-toast';

const UserProducts = ({ products, pagination, onRefresh }) => {
    const [currentPage, setCurrentPage] = useState(pagination?.pageNumber || 0);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handlePageChange = (page) => {
        setCurrentPage(page);
        const queryParams = {
            pageNumber: page,
            pageSize: pagination?.pageSize || 10,
            sortBy: 'productId',
            sortOrder: 'desc'
        };
        dispatch(fetchUserProducts(queryParams));
    };

    const handleEdit = (productId) => {
        const product = products.find(p => p.productId === productId);
        if (product) {
            setSelectedProduct(product);
            setEditModalOpen(true);
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            setLoading(true);
            try {
                await dispatch(deleteProduct(productId, toast));
                onRefresh();
            } catch (error) {
                console.error('Error deleting product:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleEditModalClose = () => {
        setEditModalOpen(false);
        setSelectedProduct(null);
    };

    const getStatusColor = (quantity) => {
        if (quantity > 10) return 'text-green-600 bg-green-100';
        if (quantity > 0) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    const getStatusText = (quantity) => {
        if (quantity > 10) return 'In Stock';
        if (quantity > 0) return 'Low Stock';
        return 'Out of Stock';
    };

    return (
        <div>
            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {products.map((product) => (
                    <div key={product.productId} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        {/* Product Image */}
                        <div className="h-48 bg-gray-100 rounded-t-lg flex items-center justify-center">
                            {product.image ? (
                                <img 
                                    src={product.image} 
                                    alt={product.productName}
                                    className="h-full w-full object-cover rounded-t-lg"
                                />
                            ) : (
                                <FaBox className="text-4xl text-gray-400" />
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-gray-800 text-lg truncate">{product.productName}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.quantity)}`}>
                                    {getStatusText(product.quantity)}
                                </span>
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                            
                            <div className="flex justify-between items-center mb-3">
                                <div>
                                    <p className="text-lg font-bold text-gray-800">{formatPrice(product.specialPrice || product.price)}</p>
                                    {product.discount > 0 && (
                                        <p className="text-sm text-gray-500 line-through">{formatPrice(product.price)}</p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">Qty: {product.quantity}</p>
                                    {product.discount > 0 && (
                                        <p className="text-sm text-green-600">{product.discount}% off</p>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end items-center pt-3 border-t border-gray-100 gap-2">
                                <button
                                    onClick={() => handleEdit(product.productId)}
                                    className="flex items-center px-3 py-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                                >
                                    <FaEdit className="mr-1" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(product.productId)}
                                    disabled={loading}
                                    className="flex items-center px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                                >
                                    <FaTrash className="mr-1" />
                                    {loading ? 'Deleting...' : 'Delete'}
                                </button>
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

            {/* Summary Stats */}
            <div className="bg-gray-50 rounded-lg p-4 mt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold text-blue-600">{products.length}</p>
                        <p className="text-sm text-gray-600">Total Products</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-green-600">
                            {products.filter(p => p.quantity > 10).length}
                        </p>
                        <p className="text-sm text-gray-600">In Stock</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-yellow-600">
                            {products.filter(p => p.quantity > 0 && p.quantity <= 10).length}
                        </p>
                        <p className="text-sm text-gray-600">Low Stock</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-red-600">
                            {products.filter(p => p.quantity === 0).length}
                        </p>
                        <p className="text-sm text-gray-600">Out of Stock</p>
                    </div>
                </div>
            </div>

            {/* Edit Product Modal */}
            <EditProductModal
                product={selectedProduct}
                isOpen={editModalOpen}
                onClose={handleEditModalClose}
                onRefresh={onRefresh}
            />
        </div>
    );
};

export default UserProducts;
