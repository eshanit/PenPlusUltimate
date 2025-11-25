interface District {
  district: string;
  facilities: Array<string>;
}

type IDistrict  = Readonly<District>

export type { IDistrict  as default}