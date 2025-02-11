import { useLocation, useNavigate } from "react-router-dom";
import {
  animate,
  motion,
  PanInfo,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { PointerEvent, ReactNode, useLayoutEffect, useState } from "react";

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
  const EDGE_WIDTH = 50;
  const navigate = useNavigate();
  const x = useMotionValue(0);
  const location = useLocation();
  const [mainSizeInfo, setMainSizeInfo] = useState({
    width: 768,
    left: 0,
    right: 0,
  });
  const [isEdgeTouch, setIsEdgeTouch] = useState(false);

  useLayoutEffect(() => {
    const mainElement = document.querySelector("main");
    if (mainElement) {
      const updateMainSizeInfo = () => {
        const { left, right, width } = mainElement.getBoundingClientRect();
        setMainSizeInfo({
          width,
          left,
          right,
        });
      };
      updateMainSizeInfo();

      window.addEventListener("resize", updateMainSizeInfo);

      return () => {
        if (updateMainSizeInfo)
          window.removeEventListener("resize", updateMainSizeInfo);
      };
    }
  }, []);

  const handlePointerMove = (event: PointerEvent) => {
    const isPointerPressed = event.pressure;
    const touchX = event.clientX;
    // 양끝 EDGE_WIDTH내부에서 터치 감지
    const edgeCondition =
      touchX - mainSizeInfo.left <= EDGE_WIDTH ||
      mainSizeInfo.right - touchX <= EDGE_WIDTH;

    // 맨처음 rendering시에는 isEdgeTouch가 false로 인해 drag가 안 되므로 두 번의 클릭이 존재해야 page navigation이 가능한 상태가 된다.
    // 따라서, edge area에 들어오는 순간 touch가 되었다고 가정하고 isEdgeTouch를 true로 설정한다.
    // 또한 edge area에서 벗어나면 isEdgeTouch를 false로 설정되는데 pointer가 눌러지고 있다면 isEdgeTouch를 true로 유지하여
    // motion.div가 drag되도록 한다.
    setIsEdgeTouch(!!isPointerPressed || edgeCondition);
  };

  const handleDragEnd = async (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (isEdgeTouch) {
      if (info.offset.x > OFFSET) {
        // 오른쪽으로 드래그
        await animate(x, mainSizeInfo.width, {
          duration: 0.4,
        });

        navigate(prevPath);
        requestAnimationFrame(() => {
          x.set(0);
        });
      } else if (info.offset.x < -OFFSET) {
        // 왼쪽으로 드래그

        await animate(x, -mainSizeInfo.width, {
          duration: 0.4,
        });

        navigate(nextPath);
        requestAnimationFrame(() => {
          x.set(0);
        });
      } else {
        await animate(x, 0, { duration: 0.4 }); // OFFSET만큼 이동하지 않았을 때 원래 위치로
      }
    }

    setIsEdgeTouch(false);
  };

  return (
    <div
      className={`relative size-full grid grid-cols-1 grid-rows-1 overflow-hidden`}
    >
      {/* 현재 페이지 */}
      <motion.div
        key={location.pathname}
        className="size-full bg-white z-10"
        style={{ x }}
        drag={isEdgeTouch ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        transition={{ duration: 1, ease: "easeOut" }}
        onPointerMove={handlePointerMove}
      >
        {currentPage}
      </motion.div>

      {/* 다음 페이지 */}
      <motion.div
        key={nextPath}
        className="absolute top-0 left-0 size-full"
        style={{
          x: useTransform(x, (value) => value + mainSizeInfo.width),
        }}
      >
        {nextPage}
      </motion.div>

      {/* 이전 페이지 */}
      <motion.div
        key={prevPath}
        className="absolute top-0 left-0 size-full"
        style={{
          x: useTransform(x, (value) => value - mainSizeInfo.width),
        }}
      >
        {prevPage}
      </motion.div>
    </div>
  );
}
