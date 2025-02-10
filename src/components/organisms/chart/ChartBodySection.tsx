import { use, useRef, useState } from "react";
import { fakeFetchChart } from "../../../utils/fakeFetchChart";
import CurationChartItem from "../../molecules/CurationChartItem";
import { CurationContentItemType } from "../../../types/curationContent.type";
import CustomIntersectionObserver from "../../molecules/CustomIntersectionObserver";
import { ClipLoader } from "react-spinners";

const initialCurationChartContentPromise = fakeFetchChart({
  pageParam: 1,
  delay: 500,
});

export default function ChartBodySection() {
  const initialCurationChartContent = use(initialCurationChartContentPromise);
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
  const intersectingCount = useRef<number>(0);
  const commonHeight = "h-12";

  const fetchMoreCurationChartData = async () => {
    setCurationChartContent((prev) => ({ ...prev, isLoading: true }));

    const result = await fakeFetchChart({
      pageParam: curationChartContent.pageParam,
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

  return (
    <section className="flex flex-col h-full overflow-auto gap-y-4 px-2 pb-2">
      {curationChartContent.contents.map((content) => (
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
