import { useCallback, useEffect, useState } from "react";
import { CurationContentItemType } from "../../../types/curationContent.type";
import { fakeFetchChart } from "../../../utils/fakeFetchChart";
import CurationChartItem from "../../molecules/CurationChartItem";
import CustomIntersectionObserver from "../../molecules/CustomIntersectionObserver";
import { ClipLoader } from "react-spinners";
import { debounce } from "../../../utils/debounce";

export default function ChartBodySection() {
  const [curationChartContent, setCurationChartContent] = useState<{
    contents: CurationContentItemType[];
    pageParam: number;
    pageDataLength: number;
    isLoading: boolean;
  }>({ contents: [], pageParam: 1, pageDataLength: 10, isLoading: true });

  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setCurationChartContent((prev) => ({ ...prev, isLoading: true }));

      const result = await fakeFetchChart({
        pageParam: curationChartContent.pageParam,
        pageDataLength: curationChartContent.pageDataLength,
        delay: 1000,
      });

      setInitialLoading(false);

      setCurationChartContent((prev) => ({
        ...prev,
        contents: result,
        isLoading: false,
        pageParam: prev.pageParam + 1,
      }));
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMoreCurationChartData = useCallback(
    debounce(async () => {
      setCurationChartContent((prev) => ({ ...prev, isLoading: true }));

      const result = await fakeFetchChart({
        pageParam: curationChartContent.pageParam,
        pageDataLength: curationChartContent.pageDataLength,
        delay: 1000,
      });

      setCurationChartContent((prev) => ({
        ...prev,
        contents: [...prev.contents, ...result],
        isLoading: false,
        pageParam: prev.pageParam + 1,
      }));
    }, 100),
    [curationChartContent]
  );

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

        {/* @FIXME: 마지막 data일 때도 계속 fetching을 하여 pageParam의 값이 증가하며 무한 state mutation이 발생 */}
      {!curationChartContent.isLoading && (
        <CustomIntersectionObserver callback={fetchMoreCurationChartData} />
      )}
      {curationChartContent.isLoading && (
        <div className="flex justify-center items-center shrink-0 h-12">
          <ClipLoader key="ClipLoader" size={20} loading color="#643927" />
        </div>
      )}
    </section>
  );
}
