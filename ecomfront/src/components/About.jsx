import ProductCard from "./shared/ProductCard";

const About = () => {
    const products =[
    {
    image: "https://embarkx.com/sample/placeholder.png",
    productName: "iPhone 13 Pro Max",
    description:
      "The iPhone 13 Pro Max offers exceptional performance with its A15 Bionic chip, stunning Super Retina XDR display, and advanced camera features for breathtaking photos.",
    specialPrice: 70000,
    price: 75000,
  },
  {
    image: "https://embarkx.com/sample/placeholder.png",
    productName: "Samsung Galaxy S21",
    description:
      "Experience the brilliance of the Samsung Galaxy S21 with its vibrant AMOLED display, powerful camera, and sleek design that fits perfectly in your hand.",
    specialPrice: 36000,
    price: 39999,
  },
  {
    image: "https://embarkx.com/sample/placeholder.png",
    productName: "Google Pixel 6",
    description:
      "The Google Pixel 6 boasts cutting-edge AI features, exceptional photo quality, and a stunning display, making it a perfect choice for Android enthusiasts.",
    price: 32000,
    specialPrice: 36000,
  }]

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 mt-[90px]">
            <h1 className="text-slate-800 text-4xl font-bold text-center mb-12">
                About Us
            </h1>
            <div className="flex flex-col lg:flex-row justify-between items-center mb-12">
                <div className="w-full md:w-1/2 text-center md:text-left">
                    <p className="text-lg mb-5">We are a user-centric eCommerce platform where anyone can buy or sell with ease. From everyday essentials to unique finds, we bring buyers and sellers together in one seamless experience. With a focus on trust, quality, and convenience, our mission is to simplify online shopping for everyone</p>
                </div>
                <div className="w-full md:w-1/2 mb-4 md:mb-0">
                    <img src="https://embarkx.com/sample/placeholder.png" 
                    alt="About Us"
                    className="w-full h-auto rounded-lg shadow-lg tranform transition-transform duration-300 hover:scale-105" />
                </div>
            </div>

            <div className="py-7 space-y-8">
                <h1 className="text-slate-800 text-4xl font-bold text-center">Our Products</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product,index) => (
                        <ProductCard
                        key={index}
                        image={product.image}
                        productName={product.productName}
                        description={product.description}
                        specialPrice={product.specialPrice}
                        price={product.price}
                        about
                        />
                    ))
                    }
                    
                </div>
            </div>
        </div>
    );
}

export default About;