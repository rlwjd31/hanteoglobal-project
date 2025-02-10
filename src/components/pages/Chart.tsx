import { Suspense } from "react";
import Container from "../atoms/Container";
import ChartBodySection from "../organisms/chart/ChartBodySection.tsx";
import ChartHeaderSection from "../organisms/chart/ChartHeaderSection";
import Banner from "../templates/banner/Banner";
import { ClipLoader } from "react-spinners";

function Loading() {
  return (
    <div className="flex h-full justify-center items-center">
      <ClipLoader key="ClipLoader" size={40} loading color="#643927" />
    </div>
  );
}

export default function Chart() {
  return (
    <>
      <Container.FlexCol className="size-full">
        <Banner />
        <ChartHeaderSection />
        <Suspense fallback={<Loading />}>
          <ChartBodySection />
        </Suspense>
      </Container.FlexCol>
    </>
  );
}
