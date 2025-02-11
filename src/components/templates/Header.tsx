import { NavLink, useLocation } from "react-router-dom";
import { routeInfo } from "../../contants/route";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";

import "swiper/swiper-bundle.css";
import { layoutContainerWidthStyle } from "../RootLayout";
import { FreeMode } from "swiper/modules";
import { useEffect, useRef } from "react";

export default function Header() {
  const swiperRef = useRef<SwiperClass | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (swiperRef.current) {
      const index = Object.values(routeInfo).findIndex(
        (route) => route.path === location.pathname
      );
      if (index !== -1) {
        swiperRef.current.slideTo(index);
      }
    }
  }, [location.pathname]);

  return (
    <header
      className={`absolute  top-0 left-0 z-50 bg-header h-header ${layoutContainerWidthStyle}`}
    >
      <nav className="h-full">
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          modules={[FreeMode]}
          className="flex flex-row h-full items-center justify-between font-bold"
          initialSlide={0}
          slidesPerView={Object.keys(routeInfo).length - 2 + 0.2}
          spaceBetween={20}
          grabCursor
          freeMode={{ enabled: true, momentum: true, sticky: true }}
          slideToClickedSlide
          loop
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
      </nav>
    </header>
  );
}
