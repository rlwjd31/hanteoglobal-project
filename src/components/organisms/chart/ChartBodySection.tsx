import { useEffect, useState } from "react";
import { CurationContentItemType } from "../../../types/curationContent.type";
import { fakeFetchChart } from "../../../utils/fakeFetchChart";
import CurationChartItem from "../../molecules/CurationChartItem";
import CustomIntersectionObserver from "../../molecules/CustomIntersectionObserver";
import { ClipLoader } from "react-spinners";

export default function ChartBodySection() {
  const [curationChartContent, setCurationChartContent] = useState<
    CurationContentItemType[]
  >([]);

  useEffect(() => {
    (async () => {
      const result = await fakeFetchChart({
        pageParam: 1,
        pageDataLength: 20,
        delay: 500,
      });

      setCurationChartContent((prev) => [...result]);
    })();
  }, []);

  return (
    <section className="flex flex-col h-full overflow-auto pb-4 gap-y-4 px-2">
      {(curationChartContent ?? []) &&
        curationChartContent.map((content) => (
          <CurationChartItem key={content.id} {...content} />
        ))}
      {/* TODO: fetch more curation chart data when intersecting observer */}
      <CustomIntersectionObserver
        callback={() => console.log("fetch more chart data")}
      >
        <ClipLoader key="ClipLoader" size={20} loading color="#643927" />
      </CustomIntersectionObserver>
    </section>
  );
}
