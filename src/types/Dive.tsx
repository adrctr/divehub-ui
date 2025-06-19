export interface Dive {
  diveId: number;
  diveDate: Date;
  description: string;
  diveName: string;
  depth: number;
}

export interface DiveDto {
  diveDate: Date;
  description: string;
  diveName: string;
  depth: number;
}