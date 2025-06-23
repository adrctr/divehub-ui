export interface Dive {
  diveId: number;
  diveDate: Date;
  description: string;
  diveName: string;
  depth: number;
  duration: number; // Duration in minutes
}

export interface DiveDto {
  diveDate: Date;
  description: string;
  diveName: string;
  depth: number;
  duration: number; // Duration in minutes
}