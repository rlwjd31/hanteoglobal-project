import { useNavigate } from "react-router-dom";
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
  const OFFSET = 300;
  const navigate = useNavigate();
  const x = useMotionValue(0);
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

  // @FIXME: 전역 상태인 x(useMotionValue)를 사용함에 따라 x.set(0)을 하게되면 페이지가 좌우로 이동하여
  // 깜빡거리는 이슈가 발생
  const handleDragEnd = async (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x > OFFSET) {
      // 오른쪽으로 드래그
      animate(x, mainWidth, {
        duration: 0.4,
        onComplete: () => {
          navigate(prevPath);
          x.set(0);
        },
      });
    } else if (info.offset.x < -OFFSET) {
      // 왼쪽으로 드래그
      animate(x, -mainWidth, {
        duration: 0.4,
        onComplete: () => {
          navigate(nextPath);
          x.set(0);
        },
      });
    } else {
      animate(x, 0, { duration: 0.4 }); // 300만큼 이동하지 않았을 때 원래 위치로
    }
  };

  return (
    <div className="grid grid-cols-1 relative grid-rows-1 size-full">
      {/* 현재 페이지 */}
      <motion.div
        className="bg-white z-20"
        style={{ x }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
      >
        {currentPage}
      </motion.div>

      {/* 다음 페이지 */}
      <motion.div
        className="absolute size-full z-30"
        style={{
          x: useTransform(x, (value) => value + mainWidth),
        }}
      >
        {nextPage}
      </motion.div>

      {/* 이전 페이지 */}
      <motion.div
        className="absolute size-full z-10"
        style={{
          x: useTransform(x, (value) => value - mainWidth),
        }}
      >
        {prevPage}
      </motion.div>
    </div>
  );
}
