import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaBoxOpen, FaArrowLeft, FaUpload } from 'react-icons/fa';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import InputField from '../shared/InputField';
import { fetchCategories, addProduct } from '../../store/actions';
import Loader from '../shared/Loader';

const AddProduct = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { categories } = useSelector((state) => state.Products);
    const { isLoading: categoriesLoading, errorMessage } = useSelector((state) => state.errors);
    
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        mode: "onTouched",
    });

    useEffect(() => {
        // Fetch categories when component mounts
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmitHandler = async (data) => {
        if (!selectedCategory) {
            toast.error("Please select a category");
            return;
        }

        // Find the selected category to get its ID
        const category = categories?.find(cat => cat.categoryName === selectedCategory);
        if (!category) {
            toast.error("Invalid category selected");
            return;
        }

        const productData = {
            productName: data.productName,
            description: data.description,
            quantity: parseInt(data.quantity),
            price: parseFloat(data.price),
            discount: parseFloat(data.discount) || 0,
            image: selectedImage
        };

        dispatch(addProduct(productData, category.categoryId, toast, reset, setIsLoading));
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    if (categoriesLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader text="Loading categories..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 mt-[90px]">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <FaBoxOpen className="text-3xl text-blue-600 mr-3" />
                            <h1 className="text-3xl font-bold text-gray-800">Add New Product</h1>
                        </div>
                        <button
                            onClick={handleGoBack}
                            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <FaArrowLeft className="mr-2" />
                            Back
                        </button>
                    </div>
                    <p className="text-gray-600">Fill in the details below to add a new product to your inventory.</p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
                        {/* Category Selection */}
                        <div className="mb-6">
                            <FormControl fullWidth variant="outlined" error={!selectedCategory && errorMessage}>
                                <InputLabel id="category-select-label">Select Category *</InputLabel>
                                <Select
                                    labelId="category-select-label"
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                    label="Select Category *"
                                    className="text-slate-800"
                                >
                                    {categories?.map((category) => (
                                        <MenuItem key={category.categoryId} value={category.categoryName}>
                                            {category.categoryName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {!selectedCategory && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Please select a category for your product
                                </p>
                            )}
                        </div>

                        {/* Product Details */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <InputField
                                label="Product Name"
                                required
                                id="productName"
                                type="text"
                                message="Product name is required"
                                placeholder="Enter product name"
                                register={register}
                                errors={errors}
                            />
                            
                            <InputField
                                label="Quantity"
                                required
                                id="quantity"
                                type="number"
                                message="Quantity is required"
                                placeholder="Enter quantity"
                                register={register}
                                errors={errors}
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <InputField
                                label="Price (₹)"
                                required
                                id="price"
                                type="number"
                                message="Price is required"
                                placeholder="Enter price"
                                register={register}
                                errors={errors}
                            />
                            
                            <InputField
                                label="Discount (%)"
                                id="discount"
                                type="number"
                                placeholder="Enter discount percentage (optional)"
                                register={register}
                                errors={errors}
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-800 mb-2">
                                Product Description *
                            </label>
                            <textarea
                                {...register("description", {
                                    required: { value: true, message: "Description is required" },
                                    minLength: { value: 10, message: "Description must be at least 10 characters" }
                                })}
                                rows={4}
                                className={`w-full px-3 py-2 border outline-none bg-transparent text-slate-800 rounded-md resize-none ${
                                    errors.description?.message ? "border-red-500" : "border-slate-700"
                                }`}
                                placeholder="Enter detailed product description..."
                            />
                            {errors.description?.message && (
                                <p className="text-sm font-semibold text-red-600 mt-1">
                                    {errors.description?.message}
                                </p>
                            )}
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-800 mb-2">
                                Product Image
                            </label>
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors">
                                    <FaUpload className="mr-2" />
                                    Choose Image
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                                {imagePreview && (
                                    <div className="flex items-center space-x-2">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-16 h-16 object-cover rounded-md border"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedImage(null);
                                                setImagePreview(null);
                                            }}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                Upload a product image (optional). Supported formats: JPG, PNG, GIF
                            </p>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4 pt-6">
                            <button
                                type="button"
                                onClick={() => reset()}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Reset Form
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || !selectedCategory}
                                className={`px-8 py-3 rounded-md font-semibold transition-all duration-200 ${
                                    isLoading || !selectedCategory
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:scale-105'
                                }`}
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Adding Product...
                                    </div>
                                ) : (
                                    'Add Product'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Help Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                    <h3 className="font-semibold text-blue-800 mb-2">Tips for Adding Products:</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Choose the most appropriate category for your product</li>
                        <li>• Write a clear and detailed description</li>
                        <li>• Set competitive pricing and reasonable quantities</li>
                        <li>• Discount is optional and should be a percentage (0-100)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
