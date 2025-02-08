import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { bannerInfo } from "../../../contants/banner";
import { Settings } from "react-slick";
import "./banner.style.css";

export default function Banner() {
  const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  return (
    <div className="flex flex-col size-full max-h-64">
      <Slider {...settings}>
        {bannerInfo.map((banner) => (
          <div key={banner.id}>
            <a href={banner.href} target="_blank">
              <img src={banner.imgSrc} />
            </a>
          </div>
        ))}
      </Slider>
    </div>
  );
}
