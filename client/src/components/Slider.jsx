import React, { useEffect, useState } from 'react'
// Import Swiper styles
import "swiper/css";
import "../assets/css/swiperStyles.css";
import "swiper/css/bundle";
import { Swiper, SwiperSlide } from "swiper/react";
import { useSelector } from 'react-redux';
import {SliderCard} from '../components';

const Slider = () => {
    //getting only the fruits item

    const products = useSelector((state)=>state.products);
    const [fruits, setFruits] = useState(null);
    useEffect(()=>{
        setFruits(products?.filter((data)=> data.product_category==='fruits'));
        console.log(fruits);
    },[products]);
  return (
    <div className='w-full pt-24'>
        <Swiper
        slidesPerView={4}
        centeredSlides={false}
        spaceBetween={30}
        grabCursor={true}
        className="mySwiper"
      >
       {fruits && fruits.map((data,i)=>
        <SwiperSlide key={i}>
          <SliderCard key={i} data={data} index={i}/>
        </SwiperSlide>
       )} 
    </Swiper>
    </div>
  )
}

export default Slider