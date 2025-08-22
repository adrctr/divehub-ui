import type { Equipment, EquipmentDto } from "./Equipment";

export interface Dive {
  diveId: number;
  userId: number;
  diveDate: Date;
  description: string;
  diveName: string;
  depth: number;
  duration: number; 
  equipments: Equipment[]; 
}

export interface DiveDto {
  userId?: number; // Optionnel car il peut être défini automatiquement côté client
  diveDate: Date;
  description: string;
  diveName: string;
  depth: number;
  duration: number;
  equipments: EquipmentDto[]; 
}
