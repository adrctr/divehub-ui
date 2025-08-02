import { useEffect, useState } from 'react';
import type { Dive, DiveDto } from '../types/Dive';
import { addDive, deleteDive, getDives, updateDive } from '../services/diveApi';

export function useDiveApi() {
  const [dives, setDives] = useState<Dive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDives = async () => {
    setLoading(true);
    try {
      const data = await getDives();
      setDives(data);
    } catch {
      setError('Erreur de chargement des plongées');
    } finally {
      setLoading(false);
    }
  };

  const addNewDive = async (dive: DiveDto) => {
    await addDive(dive);
    await fetchDives();
  };
  
  const updateExistingDive = async (dive: Dive) => {
    if (!dive.diveId) return;
    try {
      // Assuming updateDive is imported from services/diveApi
      await updateDive(dive);
      await fetchDives();
    } catch {
      setError('Erreur lors de la mise à jour de la plongée');
    }
  };

  const removeDive = async (id: number) => {
    await deleteDive(id);
    await fetchDives();
  };

  useEffect(() => {
    fetchDives();
  }, []);

  return { dives, loading, error, addNewDive, removeDive, updateExistingDive };
}
