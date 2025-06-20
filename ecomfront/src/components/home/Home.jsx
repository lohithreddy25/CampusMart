import { useDispatch, useSelector } from "react-redux";
import HomeBanner from "./HomeBanner";
import { useEffect } from "react";
import { fetchProducts } from "../../store/actions";
import ProductCard from "../shared/ProductCard";
import Loader from "../shared/Loader";

const Home = () => {
    const dispatch = useDispatch();
    const {products} = useSelector((state)=> state.Products);
    const{isLoading, errorMessage} = useSelector(
        (state) => state.errors
    );
    useEffect(()=>{
        dispatch(fetchProducts());
    },[dispatch])
    return (
        <div className="mt-[90px] px-4 md:px-8 w-full">
            <HomeBanner />
            <div className="py-5 w-full">
                <div className="flex flex-col justify-center items-center space-y-2 w-full">
                    <h1 className="text-slate-700 text-4xl font-bold"> Products</h1>
                    <span className="text-slate-800">
                        Discover our handpicked selection of top-rated items for you
                    </span>
                </div>
                {isLoading ? (
                    <Loader/>
                ) : errorMessage ? (
                    <div className="bg-red-100 p-4 rounded-lg">
                        <p className="text-red-600">{errorMessage}</p>
                    </div>
                ) : (
                    <div className="pb-6 pt-14 grid w-full 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-y-6 gap-x-6">
                        {products &&
                        products?.slice(0,3)
                        .map((item, i) => <ProductCard key={i} {...item}/>)
                        }
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home;