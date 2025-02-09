import { sleep } from "./sleep";

type CurationContentItemsType = {
  rank: number;
  imgSrc: string;
  albumTitle: string;
  artistName: string;
  sales: string;
  indexScore: string;
  id: number;
  linkSrc: string;
};

type fakeFetchChartProps = {
  pageParam: number;
  pageDataLength: number;
  delay: number;
};

export const fakeFetchChart = async ({
  pageParam,
  pageDataLength,
  delay,
}: fakeFetchChartProps): Promise<CurationContentItemsType[]> => {
  const url = "/db/curation-contents.json";

  try {
    const response = await fetch(url);

    if (response.ok) {
      const data = (await response.json()) as CurationContentItemsType[];
      const [START, END] = [0, data.length];
      const startIndex =
        (pageParam - 1) * pageDataLength < START
          ? START
          : (pageParam - 1) * pageDataLength;
      const endIndex =
        pageParam * pageDataLength > END ? END : pageParam * pageDataLength;

      const slicedData = data.slice(startIndex, endIndex);

      console.log(slicedData);
      await sleep(delay);

      return slicedData;
    }

    return [];
  } catch (e) {
    throw new Error(
      `Failed to fetch chart data\nterrormessage: ${(e as Error).message}`
    );
  }
};
