import { useEffect, useState } from 'react';
import type { Dive, DiveDto } from '../types/Dive';
import { addDive, deleteDive, getDives } from '../services/diveApi';

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
    const newDive = await addDive(dive);
    setDives((prev) => [...prev, newDive]);
  };
      

// const updateExistingDive = async (dive: Dive) => {
//     if (!dive.diveId) return;
//     try {
//         await updateDive(dive);
//         setDives((prev) =>
//             prev.map((d) => (d.diveId === dive.diveId ? dive : d))
//         );
//     } catch {
//         setError('Erreur lors de la mise à jour de la plongée');
//     }
// };

  const removeDive = async (id: number) => {
    await deleteDive(id);
    setDives((prev) => prev.filter((d) => d.diveId !== id));
  };

  useEffect(() => {
    fetchDives();
  }, []);

  return { dives, loading, error, addNewDive, removeDive };
}
