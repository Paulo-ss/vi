import { VI } from "@/types/VI";

export interface IVIContent {
  residentSoil?: number;
  industrialSoil?: number;
  tapWater?: number;
  VRQ?: number;
  VP?: number;
  agricola?: number;
  residencial?: number;
  industrial?: number;
  VI?: number;
}

export interface IVIFile {
  lastUpdated: string;
  vi: VI;
}
