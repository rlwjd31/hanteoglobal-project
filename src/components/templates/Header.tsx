import { NavLink } from "react-router-dom";
import { routeInfo } from "../../contants/route";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";

import "swiper/swiper-bundle.css";
import { useRef } from "react";

export default function Header() {
  const swiperRef = useRef<SwiperClass>(null);

  return (
    <header className="absolute w-full top-0 left-0 bg-header h-header">
      <nav className="h-full">
        <Swiper
          className="flex flex-row h-full items-center justify-between font-bold"
          initialSlide={0}
          slidesPerView={Object.keys(routeInfo).length - 1 + 0.2}
          spaceBetween={20}
          grabCursor
          freeMode
          loop
        >
          {Object.values(routeInfo).map((route) => (
            <SwiperSlide
              className="h-full"
              key={route.id}
              onClick={() => swiperRef.current?.slideTo(1, 400)}
            >
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
