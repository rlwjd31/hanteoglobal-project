import Container from "../atoms/Container";
import ChartBodySection from "../organisms/chart/ChartBodySection";
import ChartHeaderSection from "../organisms/chart/ChartHeaderSection";
import Banner from "../templates/banner/Banner";

export default function Chart() {
  return (
    <>
      <Container.FlexCol className="size-full">
        <Banner />
        <ChartHeaderSection />
        <ChartBodySection />
      </Container.FlexCol>
    </>
  );
}
