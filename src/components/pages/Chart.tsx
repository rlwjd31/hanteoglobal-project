import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { bannerInfo } from "../../contants/banner";

export default function Chart() {
  return (
    <>
      <Swiper
        className="flex flex-row w-full items-center justify-between font-bold h-48 py-14 transition-all duration-200 ease-out"
        modules={[Pagination]}
        slidesPerView={1}
        onSlideChange={(something) => console.log(something.realIndex)}
        pagination={{ clickable: true }}
        centeredSlides
        grabCursor
        loop
      >
        {bannerInfo.map((banner) => (
          <SwiperSlide
            className="w-full flex items-center justify-center size-full bg-orange-200 transition-all duration-200 ease-out"
            key={banner.id}
          >
            <a href={banner.href} target="_blank">
              <img className="size-full object-fill" src={banner.imgSrc} />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="flex flex-1 size-full bg-neutral-200">something</div>
    </>
  );
}
