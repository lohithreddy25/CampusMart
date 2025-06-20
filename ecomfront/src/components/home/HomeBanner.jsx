import { Swiper, SwiperSlide } from 'swiper/react';
import {Autoplay, EffectFade, Navigation, Pagination} from 'swiper/modules'
import { baneerLists } from '../../utils';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/autoplay';
import 'swiper/css/scrollbar';
import { Link } from 'react-router-dom';

const colors = ["bg-[#FDC200]", "bg-[#FF2C2C]", "bg-[#21AD61]"];
const HomeBanner = () => {
    return (
        <div className="w-full">
            <Swiper
            grabCursor = {true}
            autoplay ={{
                delay: 4000,
                disableOnInteraction: false,
            }}
            navigation
            modules={[Pagination, Autoplay, EffectFade, Navigation]}
            pagination={{clickable:true}}
            scrollbar = {{draggable:true}}
            slidesPerView={1}>
                {baneerLists.map((item,i) =>(
                    <SwiperSlide key={item.id}>
                      <div className={`carousel-item rounded-md sm:h-[500px] h-96 ${colors[i]} flex flex-col lg:flex-row items-center justify-between w-full`}>
                        {/* Text Section */}
                        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center h-full px-2">
                          <div className="text-center z-10">
                            <h3 className="text-3xl text-white font-bold">{item.title}</h3>
                            <h1 className="text-5xl text-white font-bold mt-2">{item.subtitle}</h1>
                            <p className="text-white font-bold mt-4">{item.description}</p>
                            <Link
                              to="/products"
                              className="mt-6 inline-block bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
                            >
                              Shop
                            </Link>
                          </div>
                        </div>
                        {/* Image Section */}
                        <div className="w-full lg:w-1/2 flex justify-center items-center px-2">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="max-h-[350px] w-auto object-contain"
                          />
                        </div>
                      </div>
                    </SwiperSlide>
                ) )}
            </Swiper>
        </div>
    );
}

export default HomeBanner;