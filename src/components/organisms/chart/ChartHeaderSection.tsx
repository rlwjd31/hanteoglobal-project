import Container from "../../atoms/Container";

export default function ChartHeaderSection() {
  return (
    <>
      <h2 className="text-neutral-800 font-bold text-2xl mt-12 mb-4">
        world chart
      </h2>
      <Container.FlexRow className="justify-between pl-[2.875rem] text-center text-sm font-medium text-neutral-600 mb-4">
        <p className="w-[27.6rem] text-left">Album Info</p>
        <Container.FlexRow className="flex-1 gap-1 justify-between max-w-[13.25rem]">
          <p className="min-w-24">Sales Amount</p>
          <Container className="min-w-[7rem]">
            <p>Physical record</p>
            <p>index</p>
          </Container>
        </Container.FlexRow>
      </Container.FlexRow>
    </>
  );
}
