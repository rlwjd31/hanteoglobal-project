# 실행
```shell
$) yarn install
$) yarn dev --host #휴대폰 및 다른 기기에서 확인
```

- 🎉 배포 vercel link: [production url](https://hanteoglobal-project.vercel.app/)

| **Infinite Scroll** | **Gesture Page Navigation Effect** |
|-------|-------|
| ![1](https://github.com/user-attachments/assets/d575edc3-86a2-456f-8dd2-d96766fc2856) | ![2](https://github.com/user-attachments/assets/e634a3d0-9075-4218-aab6-68f3f2f2ff5a) |
| **Swiper Tab Navigation** | **Infinite Slide Bannder** |
| ![3](https://github.com/user-attachments/assets/a246cc0f-cc08-4899-855d-6f07f0a171d4) | ![4](https://github.com/user-attachments/assets/6b1f0e8f-672d-4b0d-a565-74740e722494) |



# 구현 기능

1. chart페이지 내 무한 스크롤 & fetching기능
2. gesture page navigation(양끝 drag시)
3. tab swiper
4. banner 무한 slide


## 1️⃣ Infinite Scroll & Fetching

### Infinite Scroll & Fetching GIF

![untitle](https://github.com/user-attachments/assets/d575edc3-86a2-456f-8dd2-d96766fc2856)


구현된 backend가 없어 fake fetch api를 이용하여 api request를 sleep(delay = 0.5s)을 이용하여 흉내내어 구현.
chart에 관련한 data는 배포 시를 고려하여 `public/db/curation-contents.json`에 저장하여 `/db/curation-contents.json`에 
접근하여 `paraParam(현재 해당하는 page 번호)`과 `pageDataLenght(페이지에 필요한 데이터의 개수)`만큼을 다음 promise를 return하도록 구현함.

### fake fetch 구현부
```typescript
// src/utils/sleep.ts

export const sleep = async (delay: number) => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};
```

```typescript
// src/utils/fakeFetchChart.ts
... //

export const fakeFetchChart = async ({
  pageParam,
  pageDataLength = 10,
  delay,
}: fakeFetchChartProps): Promise<ReturnTypeCurationContent> => {
  const url = "/db/curation-contents.json";
  let isLastPage = false;

  try {
    const response = await fetch(url);

    if (response.ok) {
      const data = (await response.json()) as CurationContentItemType[];
      const [START, END] = [0, data.length];
      const startIndex =
        (pageParam - 1) * pageDataLength < START
          ? START
          : (pageParam - 1) * pageDataLength;
      const endIndex =
        pageParam * pageDataLength > END ? END : pageParam * pageDataLength;

      if (endIndex === END) isLastPage = true;

      const slicedData = data.slice(startIndex, endIndex);

      await sleep(delay); // 👉🏻 sleep을 주어 latency를 임의적으로 조절

      return {
        data: slicedData,
        isLastPage,
      };
    }

    return { data: [], isLastPage: true };
  } catch (e) {
    throw new Error(
      `Failed to fetch chart data\nerrormessage: ${(e as Error).message}`
    );
  }
};
```

---

### 무한 스크롤 및 무한 페칭 구현부

초기 curation data설정은 `use hook & Suspense & Error Boundary`를 이용하여 구현함.

- 초기 data intializiation 시 loading fallback UI를 보여주어 UX개선
- data fetching실패시 다시 시도할 수 있는 fallback UI를 보여주어 UX개선

```typescript
// src/components/pages/Chart.tsx

export default function Chart() {
  return (
    <>
      <Container.FlexCol className="size-full">
        <Banner />
        <ChartHeaderSection />
        <ErrorBoundary FallbackComponent={ErrorFallBack}> // 👉🏻 초기 chart에 대한 fallback UI설정
          <Suspense fallback={<Loading />}>
            <ChartBodySection />
          </Suspense>
        </ErrorBoundary>
      </Container.FlexCol>
    </>
  );
}

```

```typescript
// src/components/organisms/chart/ChartBodySection.tsx

const initialCurationChartContentPromise = fakeFetchChart({
  pageParam: 1,
  delay: 500,
});

export default function ChartBodySection() {
  const initialCurationChartContent = use(initialCurationChartContentPromise);

  ... //

  return (
    <section className="flex flex-col h-full overflow-auto gap-y-4 px-2 pb-2">
      {curationChartContent.contents.map((content) => (
        <CurationChartItem key={content.id} {...content} />
      ))}

      ... //
    </section>
  );
}
```

이후 scroll에 따른 더 가져와야하는 데이터는 `observer intersecting & fetchMoreCurationChartData`를 이용하여 구현함

- 데이터를 더 가져올 때 loading ui를 표시
- 더 가져올 데이터가 없을 땐 data fetching을 trigger할 observer를 제거하여 더 이상 페칭하지 못하도록 함.

```typescript
// src/components/organisms/chart/ChartBodySection.tsx

export default function ChartBodySection() {
  const [curationChartContent, setCurationChartContent] = useState<{
    contents: CurationContentItemType[];
    pageParam: number;
    isLoading: boolean;
    isLastPage: boolean;
  }>({
    contents: initialCurationChartContent.data,
    pageParam: 2,
    isLoading: false,
    isLastPage: false,
  });

  const fetchMoreCurationChartData = async () => {
    setCurationChartContent((prev) => ({ ...prev, isLoading: true }));

    // 👇 무한 스크롤에서 observer intersecting시 fetching data 함수
    const result = await fakeFetchChart({
      pageParam: curationChartContent.pageParam,
      delay: 500,
    });

    setCurationChartContent((prev) => {
      return {
        ...prev,
        contents: [...prev.contents, ...result.data],
        isLoading: false,
        pageParam: prev.pageParam + 1,
        isLastPage: result.isLastPage,
      };
    });
  };

  return (
    <section className="flex flex-col h-full overflow-auto gap-y-4 px-2 pb-2">
      ... //
      {!curationChartContent.isLastPage && !curationChartContent.isLoading && (
        <CustomIntersectionObserver
          callback={fetchMoreCurationChartData()} // 👉🏻 observer intersecting시 데이터 더 가져옴
        />
      )}
      {!curationChartContent.isLastPage && curationChartContent.isLoading && (
        <LoadingUI />
      )}
    </section>
  );
}
```

---

## 2️⃣ gesture page navigation(양끝 drag시)

framer motion과 custom한 `gesture handler(handlePointerMove, handleDragEnd)`를 이용하여 구현.
기본적으로 `overflow-hidden`을 설정 `이전 페이지 & 다음 페이지 & 현재페이지`를 위치시키고 drag시 `translateX`를 적용하여 
page navigation을 구현.

### gesture page navigation GIF

![untitle](https://github.com/user-attachments/assets/e634a3d0-9075-4218-aab6-68f3f2f2ff5a)

---

### drag시 page navigation 구현 부

Custom 컴포넌트('PageWrapper')를 구현하여 각 page를 HOC형태로 감싸 page navigation시 animation이 적용되도록 구현

```typescript
// Router.tsx
const routes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <PageWrapper
            currentPage={<Chart />}
            nextPage={<Whook />}
            prevPage={<ChargeShop />}
            nextPath={routeInfo.whook.path}
            prevPath={routeInfo.chargeShop.path}
          />
        ),
      },
    ],
  },
  // 👉🏻 나머지 page Whook, Events, News, Store, ChargShop을 PageWrapper로 감쌈
];
```

`OFFSET`을 이용하여 `OFFSET만큼 드래그를 진행했을 시` navigate를 진행하며 `navigate 도중에 animation(translateX)를 적용`하여
부드러운 페이지 전환 효과를 구현.

```typescript
// src/components/organisms/PageWrapper.tsx

export default function PageWrapper({ ... }) {
  const OFFSET = 200; // 👉🏻 navigation trigger condition
  const navigate = useNavigate();
  const x = useMotionValue(0);
  const location = useLocation();
  const [mainSizeInfo, setMainSizeInfo] = useState({
    width: 768,
    left: 0,
    right: 0,
  });

  const handleDragEnd = async (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
      if (info.offset.x > OFFSET) { // 👉🏻 OFFSET만큼 drag가 되었을 시 navigate
        // 오른쪽으로 드래그
        await animate(x, mainSizeInfo.width, {
          duration: 0.4,
        });

        navigate(prevPath);
        requestAnimationFrame(() => {
          x.set(0);
        });
      } else if (info.offset.x < -OFFSET) { // 👉🏻 OFFSET만큼 drag가 되었을 시 navigate
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
  };

  return (
    // 👇 이전, 현재, 다음 페이지를 두어 translate를 적용
    <div
      className={`relative size-full grid grid-cols-1 grid-rows-1 overflow-hidden`}
    >
      {/* 현재 페이지 */}
      <motion.div
        key={location.pathname}
        style={{ x }}
        drag={"x"}
        onDragEnd={handleDragEnd}
        ... //</div>
      >
        {currentPage}
      </motion.div>

      {/* 다음 페이지 */}
      <motion.div
        key={nextPath}
        style={{
          x: useTransform(x, (value) => value + mainSizeInfo.width),
        }}
      >
        {nextPage}
      </motion.div>

      {/* 이전 페이지 */}
      <motion.div
        key={prevPath}
        style={{
          x: useTransform(x, (value) => value - mainSizeInfo.width),
        }}
      >
        {prevPage}
      </motion.div>
    </div>
  );
}
```

이 때 page의 `아무곳을 드래그해도 page navigation`이 진행되므로 양끝을 drag시에만 page navigation이 적용되도록 수정함.
pointer가 움직일 때 event를 이용하여 `handlePointerMove`에서 양끝을 touch하는 중인지 아닌지를 `isEdgeTouch 상태`를 갱신함으로써 drag의 여부를 결정할 수 있게 구현.

```typescript

export default function PageWrapper( ... ) {
  const EDGE_WIDTH = 50;
  const [isEdgeTouch, setIsEdgeTouch] = useState(false);

  const handlePointerMove = (event: PointerEvent) => {
    const isPointerPressed = event.pressure;
    const touchX = event.clientX;
    // 👇 양끝 EDGE_WIDTH내부에서 터치 감지
    const edgeCondition =
      touchX - mainSizeInfo.left <= EDGE_WIDTH ||
      mainSizeInfo.right - touchX <= EDGE_WIDTH;

    setIsEdgeTouch(!!isPointerPressed || edgeCondition); // 👉🏻 양끝을 감지하는 상태
  };

  const handleDragEnd = async ( ... ) => {
    if (isEdgeTouch) {
      // navigation & animation logic
    }

    setIsEdgeTouch(false);
  };

  return (
    <div>
      {/* 현재 페이지 */}
      <motion.div
        drag={isEdgeTouch ? "x" : false} // 👉🏻 양끝을 touch중일 때만 drag를 활성화
        onPointerMove={handlePointerMove}
      >
        {currentPage}
      </motion.div>

      {/* 다음 페이지 */}
      <motion.div />
      
      {/* 이전 페이지 */}
      <motion.div />
    </div>
  );
}
```

양끝 gesture를 page navigation시 `header에 존재하는 tab active상태도 갱신`.
```typescript
// src/components/organisms/TabSwiper.tsx

export default function TabSwiper() {
  const swiperRef = useRef<SwiperClass | null>(null);
  const location = useLocation();

  // 👇 route 변경 감지시 해당 tab활성화
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
    >
     ... //
    </Swiper>
  );
}
```

---

## 3️⃣ tab swiper

### tab swiper gif

![untitle](https://github.com/user-attachments/assets/a246cc0f-cc08-4899-855d-6f07f0a171d4)

### tab siwper 구현부
TabSipwer component내부에서 `Swiper`를 이용하여 구현

- grab시 좌우로 움직여 다른 tab을 볼 수 있는 기능
- click시 해당 page로 navigation

```typescript
// src/components/organisms/TabSwiper.tsx

export default function TabSwiper() {
  return (
    <Swiper
      ... // swiper options
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
```

## 4️⃣ banner 무한 slide

swiper를 가지고 구현하려했지만 무한 swiper를 구현 시 `activeIndex & realIndex`의 차이로 인해 불필요한 re-rendering을 방지하고자 react-slick`을 이용하여 구현함.
pagination을 나타내는 UI인 `Bullets`은 스타일을 커스터마이징하는데 제한이 있어 `PaginationBullets`을 구현하여 pagniation을 적용

- 무한 swiper
- pagination
- 클릭 시 해당 url로 이동

### banner 무한 slide GIF

![untitle](https://github.com/user-attachments/assets/6b1f0e8f-672d-4b0d-a565-74740e722494)


### banner 무한 slide 구현부

custom한 pagination bullets 구현.

```typescript
// src/components/templates/banner/Banner.tsx

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

```

pagination에 `onClickPaginationBullet`를 props로 전달하여 현재 active된 slide를 표시할 수 있게 함.

```typescript
// src/components/templates/banner/Banner.tsx

export default function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<Slider>(null);

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
            <a href={banner.href} target="_blank"> // 👉🏻 클릭시 해당 page로 새창을 열어서 이동
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
```

