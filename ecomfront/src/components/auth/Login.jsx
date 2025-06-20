import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { FaSignInAlt} from 'react-icons/fa';
import InputField from "../shared/InputField";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { authenticateSignInUser } from "../../store/actions";

const Login= () => {
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

    const loginHandler = async (data) => {
        console.log("Login Click");
        dispatch(authenticateSignInUser(data, toast, reset, navigate, setLoader));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit(loginHandler)}
                className="bg-white shadow-lg rounded-lg w-full max-w-sm p-8 flex flex-col items-center">
                <FaSignInAlt className="text-4xl text-gray-700 mb-4" />
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login Here</h1>
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
                    label="Password"
                    required
                    id="password"
                    type="password"
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
                    {loader ? 'Loading...' : 'Login'}
            </button>
                <p className="text-center text-sm text-gray-600 mt-4">
                Don't have an account?
                <Link 
                        className="font-semibold underline hover:text-black ml-1"
                        to="/register"
                    >
                        SignUp
                </Link>
            </p>
            </form>
        </div>
    );
}

export default Login;