import { useEffect, useState } from 'react';
import type { Equipment, EquipmentDto } from '../types/Equipment';
import { addEquipment, deleteEquipment, getEquipments, updateEquipment } from '../services/equipmentApi';

export function useEquipmentApi() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipments = async () => {
    setLoading(true);
    try {
      const data = await getEquipments();
      setEquipments(data);
    } catch {
      setError('Erreur de chargement des équipements de plongées');
    } finally {
      setLoading(false);
    }
  };

  const addNewEquipment = async (Equipment: EquipmentDto) => {
    const newEquipment = await addEquipment(Equipment);
    setEquipments((prev) => [...prev, newEquipment]);
  };
  
  const updateExistingEquipment = async (Equipment: Equipment) => {
    if (!Equipment.equipmentId) return;
    try {
      // Assuming updateEquipment is imported from services/EquipmentApi
      await updateEquipment(Equipment);
      setEquipments((prev) =>
        prev.map((d) => (d.equipmentId === Equipment.equipmentId ? Equipment : d))
      );
    } catch {
      setError('Erreur lors de la mise à jour de la plongée');
    }
  };

  const removeEquipment = async (id: number) => {
    await deleteEquipment(id);
    setEquipments((prev) => prev.filter((d) => d.equipmentId !== id));
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  return { equipments, loading, error, addNewEquipment, removeEquipment, updateExistingEquipment };
}
