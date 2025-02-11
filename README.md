# 실행
```shell
$) yarn install
$) yarn dev --host #휴대폰 및 다른 기기에서 확인
```

# 구현 기능

1. chart페이지 내 무한 스크롤 & fetching기능
2. gesture page navigation(양끝 drag시)
3. tab swiper
4. banner 무한 slide


## 1️⃣ Infinite Scroll & Fetching

구현된 backend가 없어 fake fetch api를 이용하여 api request를 sleep(delay)을 이용하여 흉내내어 구현.
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
