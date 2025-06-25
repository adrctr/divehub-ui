import type { Equipment, EquipmentDto } from "./Equipment";

export interface Dive {
  diveId: number;
  diveDate: Date;
  description: string;
  diveName: string;
  depth: number;
  duration: number; 
  equipments: Equipment[]; 
}

export interface DiveDto {
  diveDate: Date;
  description: string;
  diveName: string;
  depth: number;
  duration: number;
  equipments: EquipmentDto[]; 
}
