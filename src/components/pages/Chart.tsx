import { CurationContentItemType } from "../../types/curationContent.type";
import { fakeFetchChart } from "../../utils/fakeFetchChart";
import Container from "../atoms/Container";
import CurationChartItem from "../molecules/CurationChartItem";
import Banner from "../templates/banner/Banner";
import { useEffect, useState } from "react";

function ChartHeaderSection() {
  return (
    <>
      <h2 className="text-neutral-800 font-bold text-2xl mt-2 mb-4">
        world chart
      </h2>
      <div className="flex justify-between pl-[46px] text-center text-sm font-medium text-neutral-600 mb-4">
        <p className="w-[27.6rem] text-left">Album Info</p>
        <div className="flex flex-1 gap-8 justify-between max-w-[240px]">
          <p className="min-w-24">Sales Amount</p>
          <div className="min-w-[7rem] justify-center">
            <p>Physical record</p>
            <p>index</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Chart() {
  const [curationChartContent, setCurationChartContent] = useState<
    CurationContentItemType[]
  >([]);

  useEffect(() => {
    (async () => {
      const result = await fakeFetchChart({
        pageParam: 1,
        pageDataLength: 10,
        delay: 500,
      });

      setCurationChartContent((prev) => [...result]);
    })();
  }, []);

  return (
    <>
      <Container.FlexCol className="size-full">
        <Banner />
        <ChartHeaderSection />
        <section className="flex flex-col h-full overflow-auto pb-8 gap-y-4">
          {(curationChartContent ?? []) &&
            curationChartContent.map((content) => (
              <CurationChartItem key={content.id} {...content} />
            ))}
        </section>
      </Container.FlexCol>
    </>
  );
}
