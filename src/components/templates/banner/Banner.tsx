import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { bannerInfo } from "../../../contants/banner";
import { Settings } from "react-slick";
import "./banner.style.css";
import { useRef, useState } from "react";
import Img from "../../atoms/Img";
import Container from "../../atoms/Container";

type PaginationBulletsProps = {
  length: number;
  currentIndex: number;
  callback: (index: number) => void;
  className?: string;
};

function PaginationBullets({
  length,
  callback,
  currentIndex,
  className = "",
}: PaginationBulletsProps) {
  return (
    <Container.FlexRow
      className={`w-full py-2 gap-2 items-center justify-center mt-2 ${className}`}
    >
      {Array(length)
        .fill(0)
        .map((_, index) => (
          <span
            className={`size-2 rounded-full cursor-pointer ${
              currentIndex === index ? "bg-[#FC5BA8]" : "bg-neutral-400"
            }`}
            key={index}
            onClick={() => callback(index)}
          />
        ))}
    </Container.FlexRow>
  );
}

export default function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<Slider>(null);

  const settings: Settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    afterChange: (currentIndex) => setCurrentIndex(currentIndex),
  };

  const onClickPaginationBullet = (index: number) => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
  };

  return (
    <div className="flex flex-col size-full max-h-80">
      <Slider {...settings} ref={sliderRef}>
        {bannerInfo.map((banner) => (
          <div key={banner.id}>
            <a href={banner.href} target="_blank">
              <Img src={banner.imgSrc} className="object-fill" />
            </a>
          </div>
        ))}
      </Slider>
      <PaginationBullets
        length={bannerInfo.length}
        callback={onClickPaginationBullet}
        currentIndex={currentIndex}
      />
    </div>
  );
}
