import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/pagination'
import './styles.css'

import { Pagination } from 'swiper/modules'
import { summit } from '../../data/summit.js'

export function SliderSummit({ language }) {
  const [activeIndex, setActiveIndex] = useState(null)
  const [swiperInstance, setSwiperInstance] = useState(null)

  // Function to toggle visibility
  const toggleInfo = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
    if (swiperInstance) {
      swiperInstance.slideTo(index)
    }
  }

  return (
    <Swiper
      centeredSlides={true}
      spaceBetween={30}
      pagination={{ clickable: true }}
      modules={[Pagination]}
      className='mySwiper'
      onSwiper={setSwiperInstance} // Store Swiper instance
      speed={1000}
      breakpoints={{
        640: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
      }}
    >
      {summit.map((summit, index) => (
        <SwiperSlide key={index} onClick={() => toggleInfo(index)}>
          <div className='relative md:flex grid justify-center items-center gap-5 w-full cursor-pointer border-2 rounded-2xl px-5 py-5 md:py-0 h-full'>
            <img
              src={summit.img}
              alt={summit.name}
              className='rounded-full w-32 h-32 object-cover '
            />
            <div className='w-full'>
              <p className='pt-3 font-bold text-2xl text-left'>{summit.name}</p>
              <p className='text-lg text-left'>
                {language === 'es' ? summit.position : summit.position_en}
              </p>
              <p className='pt-3 text-left'>
                "
                {language === 'es' ? summit.description : summit.description_en}
                "
              </p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
