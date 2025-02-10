import { useNavigate } from "react-router-dom";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";
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
  const navigate = useNavigate();
  const x = useMotionValue(0);
  const opacity = useTransform(
    x,
    [-window.innerWidth, 0, window.innerWidth],
    [0, 1, 0]
  );

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 300) {
      // 오른쪽으로 드래그
      animate(x, 768, {
        duration: 0.4,
        onComplete: () => navigate(routeInfo.chargeShop.path), // navigation상 이전 페이지
      });
    } else if (info.offset.x < -300) {
      // 왼쪽으로 드래그
      animate(x, -768, {
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
        className="absolute size-full bg-orange-100"
        style={{
          x: useTransform(x, (value) => value + 768),
        }}
        initial={{ x: window.innerWidth }}
      >
        {nextPage}
      </motion.div>

      <motion.div
        className="absolute size-full bg-red-400"
        style={{
          x: useTransform(x, (value) => value - 768),
        }}
        initial={{ x: window.innerWidth }}
      >
        {prevPage}
      </motion.div>
    </div>
  );
}
