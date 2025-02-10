import { CurationContentItemType } from "../../types/curationContent.type";
import Card from "../atoms/Card";
import Container from "../atoms/Container";
import Img from "../atoms/Img";

export default function CurationChartItem({
  id,
  albumTitle,
  artistName,
  imgSrc,
  indexScore,
  linkSrc,
  rank,
  sales,
}: CurationContentItemType) {
  return (
    <a href={linkSrc} target="_blank" rel="noreferrer">
      <Card className="text-neutral-900 py-2.5">
        <Container.FlexRow className="items-start">
          <Container.FlexRow className="translate-y-6 items-center text-lg font-bold">
            {rank}
          </Container.FlexRow>
          <Container.FlexRow className="mx-4 size-20 rounded-md overflow-hidden shrink-0">
            <Img className="object-fill" src={imgSrc} alt={`image-${id}`} />
          </Container.FlexRow>
        </Container.FlexRow>
        <Container.FlexRow className="flex-1">
          <Container.FlexCol className="justify-center gap-1">
            <p className="text-md break-all">{albumTitle}</p>
            <p className="font-bold uppercase text-neutral-500">{artistName}</p>
          </Container.FlexCol>
        </Container.FlexRow>
        <Container.FlexRow className="flex max-w-[212px] flex-1 justify-between text-md font-semibold">
          <p className="flex items-center justify-end min-w-24">{sales}</p>
          <p className="flex items-center justify-end min-w-[7rem]">
            {indexScore}
          </p>
        </Container.FlexRow>
      </Card>
    </a>
  );
}
