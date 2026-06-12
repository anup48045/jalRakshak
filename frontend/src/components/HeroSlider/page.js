'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import Link from 'next/link'

import 'swiper/css'
import 'swiper/css/pagination'

const images = [
  '/images/water4.webp',
  '/images/water5.webp',
  '/images/water6.webp',
]

export default function HeroSlider(){
    return (
         <div className="relative h-[650px]">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop
        pagination={{ clickable: true }}
        className="h-full"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <div
              className="h-full bg-cover bg-center space-y-10"
              style={{
                backgroundImage: `url(${img})`,
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Overlay */}
       {/* bg-black/40 */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-gray-900/40 to-white/5" />

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold text-white text-left">
          Delhi Water Bodies Real-Time Monitoring System
        </h1>

        <p className="mt-4 max-w-3xl text-white/90 text-left">
          Ensuring the health, protection, and sustainable management of
          Delhi's blue infrastructure through real-time monitoring and
          community reporting.
        </p>
        <div className="mt-6 ml-[-268px] flex gap-4">
              <Link href="/geomap" className="px-6 py-3 bg-blue-600 text-white rounded-md shadow hover:brightness-95">Water Bodies Geo Map</Link>
              <Link href="/about" className="px-6 py-3 border border-slate-300 rounded-md text-slate-100 hover:bg-blue-600">Learn More</Link>
            </div>
      </div>
    </div>
    )
}