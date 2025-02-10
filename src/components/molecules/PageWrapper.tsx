import { useLocation, useNavigate } from "react-router-dom";
import {
  animate,
  motion,
  PanInfo,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { ReactNode, useLayoutEffect, useState } from "react";

export default function PageWrapper({
  currentPage,
  nextPage,
  prevPage,
  nextPath,
  prevPath,
}: {
  currentPage: ReactNode;
  nextPage: ReactNode;
  prevPage: ReactNode;
  nextPath: string;
  prevPath: string;
}) {
  const OFFSET = 200;
  const navigate = useNavigate();
  const x = useMotionValue(0);
  const location = useLocation();
  const [mainWidth, setMainWidth] = useState(768);

  useLayoutEffect(() => {
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

  const handleDragEnd = async (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x > OFFSET) {
      // 오른쪽으로 드래그
      await animate(x, mainWidth, {
        duration: 0.4,
      });

      navigate(prevPath);
      requestAnimationFrame(() => {
        x.set(0);
      });
    } else if (info.offset.x < -OFFSET) {
      // 왼쪽으로 드래그

      await animate(x, -mainWidth, {
        duration: 0.4,
      });

      navigate(nextPath);
      requestAnimationFrame(() => {
        x.set(0);
      });
    } else {
      await animate(x, 0, { duration: 0.4 }); // OFFSET만큼 이동하지 않았을 때 원래 위치로
    }
  };

  return (
    <div className="relative size-full grid grid-cols-1 grid-rows-1 overflow-hidden">
      {/* 현재 페이지 */}
      <motion.div
        key={location.pathname}
        className="size-full bg-white z-10"
        style={{ x }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {currentPage}
      </motion.div>

      {/* 다음 페이지 */}
      <motion.div
        key={nextPath}
        className="absolute top-0 left-0 size-full"
        style={{
          x: useTransform(x, (value) => value + mainWidth),
        }}
      >
        {nextPage}
      </motion.div>

      {/* 이전 페이지 */}
      <motion.div
        key={prevPath}
        className="absolute top-0 left-0 size-full"
        style={{
          x: useTransform(x, (value) => value - mainWidth),
        }}
      >
        {prevPage}
      </motion.div>
    </div>
  );
}
