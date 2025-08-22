export interface Equipment {
  equipmentId: number;
  userId: number;
  equipmentName: string;
}

export interface EquipmentDto {
  userId?: number; // Optionnel car il peut être défini automatiquement côté client
  equipmentName: string;
}
