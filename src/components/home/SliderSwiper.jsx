import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/pagination'
import './styles.css'

import { Pagination } from 'swiper/modules'

export function SliderSwiper({ t }) {
  const [activeIndex, setActiveIndex] = useState(1)
  const [swiperInstance, setSwiperInstance] = useState(null)

  // Function to toggle visibility
  const toggleInfo = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
    if (swiperInstance) {
      swiperInstance.slideTo(index)
    }
  }

  // Handle slide change
  const handleSlideChange = (swiper) => {
    const currentIndex = swiper.activeIndex
    toggleInfo(currentIndex)
  }

  return (
    <Swiper
      centeredSlides={true}
      spaceBetween={30}
      pagination={{ clickable: true }}
      modules={[Pagination]}
      className='mySwiper'
      onSwiper={(swiper) => {
        setSwiperInstance(swiper)
        handleSlideChange(swiper) // Call toggleInfo on initial load
      }}
      onSlideChange={handleSlideChange} // Call toggleInfo on slide change
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
      {[1, 2, 3, 4].map((num, index) => (
        <SwiperSlide key={index} onClick={() => toggleInfo(index)}>
          <div
            className={`relative flex flex-col gap-2 w-full cursor-pointer transition-all duration-700 ease-in-out  ${
              activeIndex === index ? 'lg:flex-row' : 'lg:flex-col'
            }`}
          >
            <img
              src={`/img/bg_categoria${num}.webp`}
              alt={`Categoria ${num}`}
              className={`rounded-2xl h-[420px] object-cover transition-all duration-700 ease-in-out ${
                activeIndex === index ? ' lg:max-w-[40%]' : 'w-full'
              }`}
            />

            <div
              className={`w-full pt-2 transition-all duration-1000 ease-in-out overflow-hidden h-[420px] flex-1 ${
                activeIndex === index
                  ? 'opacity-100 initial'
                  : 'lg:opacity-0 lg:max-w-0 lg:hidden'
              }`}
            >
              <div className='grid md:flex gap-1'>
                <p className='pt-3'>
                  <span className='border rounded-full px-5 py-3'>
                    {index + 1}
                  </span>
                </p>
                <div className='p-3 md:p-0'>
                  <p className='pt-3 font-bold text-lg text-left'>
                    {t[`category${num}`]}
                  </p>
                  <ul className='pt-5 ps-4 text-start list-disc text-sm'>
                    {Object.keys(t)
                      .filter((key) => key.startsWith(`category${num}_`))
                      .map((key, i) => (
                        <li key={i}>{t[key]}</li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
