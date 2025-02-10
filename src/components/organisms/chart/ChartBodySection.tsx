import { useEffect, useRef, useState } from "react";
import { CurationContentItemType } from "../../../types/curationContent.type";
import { fakeFetchChart } from "../../../utils/fakeFetchChart";
import CurationChartItem from "../../molecules/CurationChartItem";
import CustomIntersectionObserver from "../../molecules/CustomIntersectionObserver";
import { ClipLoader } from "react-spinners";

export default function ChartBodySection() {
  const [curationChartContent, setCurationChartContent] = useState<{
    contents: CurationContentItemType[];
    pageParam: number;
    pageDataLength: number;
    isLoading: boolean;
    isLastPage: boolean;
  }>({
    contents: [],
    pageParam: 1,
    pageDataLength: 10,
    isLoading: false,
    isLastPage: false,
  });
  const [initialLoading, setInitialLoading] = useState(true);
  const firstMount = useRef<boolean>(true);
  const intersectingCount = useRef<number>(0);

  const commonHeight = "h-12";

  useEffect(() => {
    if (firstMount.current) {
      (async () => {
        const result = await fakeFetchChart({
          pageParam: curationChartContent.pageParam,
          pageDataLength: curationChartContent.pageDataLength,
          delay: 500,
        });

        setInitialLoading(false);

        setCurationChartContent((prev) => {
          return {
            ...prev,
            contents: [...result.data],
            pageParam: prev.pageParam + 1,
            isLastPage: result.isLastPage,
          };
        });
      })();

      return () => {
        firstMount.current = false;
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMoreCurationChartData = async () => {
    setCurationChartContent((prev) => ({ ...prev, isLoading: true }));

    const result = await fakeFetchChart({
      pageParam: curationChartContent.pageParam,
      pageDataLength: curationChartContent.pageDataLength,
      delay: 500,
    });

    intersectingCount.current = 0;

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

  return initialLoading ? (
    <div className="flex h-full justify-center items-center">
      <ClipLoader key="ClipLoader" size={40} loading color="#643927" />
    </div>
  ) : (
    <section className="flex flex-col h-full overflow-auto gap-y-4 px-2">
      {(curationChartContent.contents ?? []) &&
        curationChartContent.contents.map((content) => (
          <CurationChartItem key={content.id} {...content} />
        ))}
      {!curationChartContent.isLastPage && !curationChartContent.isLoading && (
        <CustomIntersectionObserver
          callback={() => {
            intersectingCount.current += 1;
            if (intersectingCount.current > 1) return;

            fetchMoreCurationChartData();
          }}
          className={commonHeight}
        />
      )}
      {!curationChartContent.isLastPage && curationChartContent.isLoading && (
        <div
          className={`flex justify-center items-center shrink-0 h-12 ${commonHeight}`}
        >
          <ClipLoader key="ClipLoader" size={20} loading color="#643927" />
        </div>
      )}
    </section>
  );
}
