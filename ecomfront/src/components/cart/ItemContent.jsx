import { FiTrash } from "react-icons/fi";
import SetQuantity from "./SetQuantity";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { decreaseCartQuantity, increaseCartQuantity, removeFromCart } from "../../store/actions";
import { formatPrice } from "../../utils/formatPrice";
import truncateText from "../../utils/truncateText";

const ItemContent = ({
    productId,
    productName,
    image,
    description,
    quantity,
    price,
    discount,
    specialPrice,
    cartId
}) => {

    const [currentQuantity, setCurrentQuantity] = useState(quantity);
    const dispatch = useDispatch();
    const handleQtyIncrease = (cartItems) => {
        dispatch(increaseCartQuantity(
            cartItems,
            toast,
            currentQuantity,
            setCurrentQuantity
        ));
    };

    const handleQtyDecrease = (cartItems) =>{
        if (currentQuantity > 1) {
            const newQuantity = currentQuantity-1;
            setCurrentQuantity(newQuantity);
            dispatch(decreaseCartQuantity(
                cartItems,
                newQuantity
            ))
        }
    }

    const removeItemFromCart = (cartItems) =>{
        dispatch(removeFromCart(cartItems,toast));
    };


    return (
        <>
            <div className="md:col-span-2 col-span-2 flex flex-col gap-2">
                <h3 className="lg:text-[17px] text-sm font-semibold text-slate-600 mb-2">
                    {truncateText (productName)}
                </h3>
                <div className="flex md:flex-row flex-col lg:gap-4 sm:gap-3 gap-0 items-start">
                    <img
                        src={image}
                        alt={productName}
                        className="md:h-36 sm:h-24 h-12 w-24 object-cover rounded-md"
                    />
                </div>
                <button
                    onClick={() => removeItemFromCart({
                        image,
                        productName,
                        description,
                        specialPrice,
                        price,
                        productId,
                        quantity,
                    })}
                    className="flex items-center font-semibold space-x-2 px-4 py-1 text-xs border-rose-600 text-rose-600 rounded-md hover:bg-red-50 transition-colors duration-200 mt-2"
                >
                    <FiTrash size={16} className="text-rose-600" />
                    Remove
                </button>
            </div>
            <div className="justify-self-center flex items-center">
                {formatPrice (Number(specialPrice))}
            </div>
            <div className="justify-self-center flex items-center">
                <SetQuantity 
                    quantity={quantity}
                    cardCounter={true}
                    handeQtyIncrease={()=>handleQtyIncrease({
                        image,
                        productName,
                        description,
                        specialPrice,
                        price,
                        productId,
                        quantity,
                    })}
                    handleQtyDecrease={()=>handleQtyDecrease({
                        image,
                        productName,
                        description,
                        specialPrice,
                        price,
                        productId,
                        quantity,
                    })}
                />
            </div>
            <div className="justify-self-center flex items-center">
                {formatPrice(Number(currentQuantity) * Number(specialPrice))}
            </div>
        </>
    );
};

export default ItemContent;