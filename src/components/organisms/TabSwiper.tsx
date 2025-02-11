import { NavLink, useLocation } from "react-router-dom";
import { routeInfo } from "../../contants/route";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";

import "swiper/swiper-bundle.css";
import { FreeMode } from "swiper/modules";
import { useEffect, useRef } from "react";

export default function TabSwiper() {
  const swiperRef = useRef<SwiperClass | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (swiperRef.current) {
      const activeIndex = Object.values(routeInfo).findIndex(
        (route) => route.path === location.pathname
      );

      swiperRef.current.slideTo(activeIndex);
    }
  }, [location.pathname]);

  return (
    <Swiper
      onSwiper={(swiper) => (swiperRef.current = swiper)}
      modules={[FreeMode]}
      className="flex flex-row h-full items-center font-bold"
      initialSlide={0}
      slidesPerView={Object.keys(routeInfo).length - 1.5}
      spaceBetween={0}
      grabCursor
      freeMode={{ enabled: true, momentum: true, sticky: true }}
      slideToClickedSlide
    >
      {Object.values(routeInfo).map((route) => (
        <SwiperSlide className="h-full" key={route.id}>
          <NavLink
            to={route.path}
            className={({ isActive }) =>
              `h-full flex items-center justify-center cursor-grab ${
                isActive ? "text-white" : "text-black"
              }`
            }
          >
            <li className="list-none">{route.content}</li>
          </NavLink>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
