import { CurationContentItemType } from "../types/curationContent.type";
import { sleep } from "./sleep";

type fakeFetchChartProps = {
  pageParam: number;
  pageDataLength?: number;
  delay: number;
};

type ReturnTypeCurationContent = {
  data: CurationContentItemType[];
  isLastPage: boolean;
};

export const fakeFetchChart = async ({
  pageParam,
  pageDataLength = 10,
  delay,
}: fakeFetchChartProps): Promise<ReturnTypeCurationContent> => {
  const url = "/db/curation-contents.json";
  let isLastPage = false;

  try {
    const response = await fetch(url);

    if (response.ok) {
      const data = (await response.json()) as CurationContentItemType[];
      const [START, END] = [0, data.length];
      const startIndex =
        (pageParam - 1) * pageDataLength < START
          ? START
          : (pageParam - 1) * pageDataLength;
      const endIndex =
        pageParam * pageDataLength > END ? END : pageParam * pageDataLength;

      if (endIndex === END) isLastPage = true;

      const slicedData = data.slice(startIndex, endIndex);

      await sleep(delay);

      return {
        data: slicedData,
        isLastPage,
      };
    }

    return { data: [], isLastPage: true };
  } catch (e) {
    throw new Error(
      `Failed to fetch chart data\nerrormessage: ${(e as Error).message}`
    );
  }
};
