import { useNavigate } from "react-router-dom";
import {
  animate,
  motion,
  PanInfo,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";
import { routeInfo } from "../contants/route";

export default function PageWrapper({
  currentPage,
  nextPage,
  prevPage,
}: {
  currentPage: React.ReactNode;
  nextPage: React.ReactNode;
  prevPage: React.ReactNode;
}) {
  const OFFSET = 300;
  const navigate = useNavigate();
  const x = useMotionValue(0);
  const [mainWidth, setMainWidth] = useState(768);
  useEffect(() => {
    const mainElement = document.querySelector("main");
    if (mainElement) {
      const updateMainWidth = () =>
        setMainWidth(mainElement.getBoundingClientRect().width);
      updateMainWidth();

      window.addEventListener("resize", updateMainWidth);

      return () => {
        if (updateMainWidth)
          window.removeEventListener("resize", updateMainWidth);
      };
    }
  }, []);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x > OFFSET) {
      // 오른쪽으로 드래그
      animate(x, mainWidth, {
        duration: 0.4,
        onComplete: () => navigate(routeInfo.chargeShop.path), // navigation상 이전 페이지
      });
    } else if (info.offset.x < -OFFSET) {
      // 왼쪽으로 드래그
      animate(x, -mainWidth, {
        duration: 0.4,
        onComplete: () => navigate(routeInfo.whook.path), // navigation상 다음 페이지
      });
    } else {
      animate(x, 0, { duration: 0.4 }); // 300만큼 이동하지 않았을 때 원래 위치로
    }
  };

  return (
    <div className="grid grid-cols-1 relative grid-rows-1 size-full">
      {/* 현재 페이지 */}
      <motion.div
        className="bg-white"
        style={{ x }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
      >
        {currentPage}
      </motion.div>

      {/* 다음 페이지 */}
      <motion.div
        className="absolute size-full"
        style={{
          x: useTransform(x, (value) => value + mainWidth),
        }}
        initial={{ x: window.innerWidth }}
      >
        {nextPage}
      </motion.div>

      {/* 이전 페이지 */}
      <motion.div
        className="absolute size-full"
        style={{
          x: useTransform(x, (value) => value - mainWidth),
        }}
        initial={{ x: window.innerWidth }}
      >
        {prevPage}
      </motion.div>
    </div>
  );
}
