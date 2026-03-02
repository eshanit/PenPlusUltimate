/**
 * Facility interface for healthcare facilities
 */
export interface IFacility {
  _id: string;
  name: string;
  district: string;
  facilities?: string[];
}

export type Facility = Readonly<IFacility>;
export type IFacilityType = Facility;
