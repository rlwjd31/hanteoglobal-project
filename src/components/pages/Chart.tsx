import Card from "../atoms/Card";
import Container from "../atoms/Container";
import Banner from "../templates/banner/Banner";
import { useEffect } from "react";

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
  useEffect(() => {
    (async () => {
      const result = await fetch("/db/curation-contents.json");
      const jsonData = await result.json();
      // jsonData.map(data => ({
      //   ...data,
      //   link: data.
      // }))

      const parsedData = jsonData.map((data) => {
        const id = data["imgSrc"].split("/")[4].split("_")[0];
        const linkSrc = `https://www.hanteochart.com/albumdetail/${id}/real`;

        return {
          ...data,
          id,
          linkSrc,
        };
      });
      console.log("parsedData", JSON.stringify(parsedData));
    })();
  }, []);





  
  return (
    <>
      <Banner />
      <Container.FlexCol className="flex-1 size-full mt-8">
        <ChartHeaderSection />
        <section className="flex flex-col h-full">
          <Card className="text-neutral-900">
            <Container.FlexRow className="items-start">
              <Container.FlexRow className="translate-y-6 items-center text-lg font-bold">
                1
              </Container.FlexRow>
              <Container.FlexRow className="mx-4 size-20 rounded-md overflow-hidden shrink-0">
                <img
                  className="size-full object-cover"
                  src="https://resource.hanteochart.io/album/900540088_s150.jpg?now=1738969210404"
                  alt="image1"
                />
              </Container.FlexRow>
            </Container.FlexRow>

            <Container.FlexRow className="flex-1">
              <Container.FlexCol className="justify-center gap-1">
                <p className="text-md break-all">
                  Caligo Pt.1: 미니앨범 3집, POCAALBUM Ver.
                </p>
                <p className="font-bold uppercase text-neutral-500">PLAVE</p>
              </Container.FlexCol>
            </Container.FlexRow>
            <Container.FlexRow className="flex max-w-[248px] flex-1 justify-between gap-[38px] text-md font-semibold">
              <p className="flex items-center justify-end min-w-24">96,512</p>
              <p className="flex items-center justify-end min-w-[7rem]">
                63,249.30
              </p>
            </Container.FlexRow>
          </Card>
        </section>
      </Container.FlexCol>
    </>
  );
}
