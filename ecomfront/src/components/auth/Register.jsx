import React, { useState } from 'react'
import { FaUserPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../shared/InputField';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { RegisterNewUser } from '../../store/actions';
import toast from 'react-hot-toast';

const Register = () => {
 const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm({
        mode: "onTouched",
    });

    const registerHandler = async (data) => {
        console.log("Register Click");
        dispatch(RegisterNewUser(data, toast, reset, navigate, setLoader));
    };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <form onSubmit={handleSubmit(registerHandler)}
                    className="bg-white shadow-lg rounded-lg w-full max-w-sm p-8 flex flex-col items-center">
                    <FaUserPlus className="text-4xl text-gray-700 mb-4" />
                    <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Register Here</h1>
                    <div className="w-full flex flex-col gap-4 mb-4">
                        <InputField
                            label="UserName"
                            required
                            id="username"
                            type="text"
                            message="*UserName is required"
                            placeholder="Enter your username"
                            register={register}
                            errors={errors}
                        />
                        <InputField
                            label="Email"
                            required
                            id="email"
                            type="email"
                            message="*Email is required"
                            placeholder="Enter your email"
                            register={register}
                            errors={errors}
                        />
                        <InputField
                            label="Password"
                            required
                            id="password"
                            type="password"
                            min = {6}
                            message="*Password is required"
                            placeholder="Enter your password"
                            register={register}
                            errors={errors}
                        />
                    </div>
                    <button
                        disabled={loader}
                        className="w-full py-2 rounded bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold text-lg hover:from-purple-500 hover:to-pink-400 transition-colors duration-200 mb-2"
                        type="submit"
                    >
                        {loader ? 'Loading...' : 'Register'}
                    </button>
                    <p className="text-center text-sm text-gray-600 mt-4">
                        ALready have an account?
                        <Link
                            className="font-semibold underline hover:text-black ml-1"
                            to="/login"
                        >
                            Login
                        </Link>
                    </p>
                </form>
            </div>
  )
}

export default Register
