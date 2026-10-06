import records from "@/data/works.json";
import type { Work } from "./types";

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;
export const works: Work[] = records.map((record) => ({
  ...record,
  mediaUrl: assetUrl(record.mediaUrl),
  posterUrl: assetUrl(record.posterUrl),
})) as Work[];
