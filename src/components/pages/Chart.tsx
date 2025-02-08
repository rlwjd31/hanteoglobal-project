import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { bannerInfo } from "../../contants/banner";
import { useRef } from "react";

import "./banner.style.css";

export default function Chart() {
  const swiperRef = useRef<SwiperClass>(null);

  return (
    <>
      <Swiper
        modules={[Pagination]}
        className="flex flex-row w-full items-center justify-between font-bold h-72 transition-all duration-200 ease-out"
        slidesPerView={1}
        pagination={{
          clickable: true,
        }}
        centeredSlides
        grabCursor
        loop
        onSwiper={(swiper) => (swiperRef.current = swiper)}
      >
        {bannerInfo.map((banner) => (
          <SwiperSlide
            className="w-full flex items-center justify-center size-full transition-all duration-200 ease-out pb-10"
            key={banner.id}
          >
            <a href={banner.href} target="_blank">
              <img
                className="size-full object-fill rounded-2xl"
                src={banner.imgSrc}
              />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="flex flex-1 size-full bg-neutral-200">something</div>
    </>
  );
}
