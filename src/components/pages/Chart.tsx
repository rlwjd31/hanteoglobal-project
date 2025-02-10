import { Suspense } from "react";
import Container from "../atoms/Container";
import ChartBodySection from "../organisms/chart/ChartBodySection.tsx";
import ChartHeaderSection from "../organisms/chart/ChartHeaderSection";
import Banner from "../templates/banner/Banner";
import { ClipLoader } from "react-spinners";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

function Loading() {
  return (
    <Container.FlexRow className="h-full justify-center items-center">
      <ClipLoader key="ClipLoader" size={40} loading color="#643927" />
    </Container.FlexRow>
  );
}

function ErrorFallBack({ error, resetErrorBoundary }: FallbackProps) {
  console.error(error);

  return (
    <Container.FlexRow className="size-full items-center gap-4 justify-center">
      <p className="font-semibold text-2xl">something went wrong...🥵🥵🥵</p>
      <button
        className="py-2 px-4 text-white bg-neutral-400 rounded-md cursor-pointer hover:bg-neutral-300"
        onClick={resetErrorBoundary}
      >
        retry
      </button>
    </Container.FlexRow>
  );
}

export default function Chart() {
  console.log("chart rendered");
  return (
    <>
      <Container.FlexCol className="size-full">
        <Banner />
        <ChartHeaderSection />
        <ErrorBoundary FallbackComponent={ErrorFallBack}>
          <Suspense fallback={<Loading />}>
            <ChartBodySection />
          </Suspense>
        </ErrorBoundary>
      </Container.FlexCol>
    </>
  );
}
