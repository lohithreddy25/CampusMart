import { FaExclamationTriangle } from "react-icons/fa";
import ProductCard from "../shared/ProductCard";
import "tailwindcss"
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchCategories} from "../../store/actions";
import Filter from "./Filter";
import useProductFilter from "../../hooks/useProductFilter";
import Loader from "../shared/Loader";
import Paginations from "../shared/Paginations";

const Products = () => {
    const{isLoading, errorMessage} = useSelector(
        (state) => state.errors
    ); 
    const { products, categories ,pagination} = useSelector(
        (state) => state.Products
    );
    const dispatch = useDispatch();
    useProductFilter();
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <div className="mt-[90px] px-4 md:px-8 w-full">
            <Filter categories= {categories ? categories : []}/>
            {isLoading ? (
                <>
                    <div className="flex flex-col items-center justify-start mt-24 min-h-[30vh]">
                        <Loader text={"Products Loading"}/>
                    </div>

                </>

            ) : errorMessage ? (
                <div className="bg-red-100 p-4 rounded-lg">
                    <p className="text-red-600">{errorMessage}</p>
                </div>
            ) : (
                <div className="min-h-[700px]">
                    <div className="pb-6 pt-14 grid w-full 2xl:grid-cols-4 xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-y-6 gap-x-6">
                        {products && 
                        products.map((item) => <ProductCard key={item.productId} {...item}/>)
                        }
                    </div>
                    <div className="flex justify-center pt-10">
                        <Paginations 
                          numberofPage = {pagination?.totalPages}
                          totalProducts = {pagination?.totalElements}
                          />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Products