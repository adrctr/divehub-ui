import { useEffect, useState, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import type { Dive, DiveDto } from '../types/Dive';
import { addDive, deleteDive, getDives, updateDive } from '../services/diveApi';

export function useDiveApi() {
  const [dives, setDives] = useState<Dive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading } = useAuth0();

  const fetchDives = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getDives();
      setDives(data);
      setError(null);
    } catch (err) {
      console.error('Erreur de chargement des plongées:', err);
      setError('Erreur de chargement des plongées');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const addNewDive = async (dive: DiveDto) => {
    await addDive(dive);
    await fetchDives();
  };
  
  const updateExistingDive = async (dive: Dive) => {
    if (!dive.diveId) return;
    try {
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
    // Attendre que Auth0 ait fini de charger et que l'utilisateur soit authentifié
    if (!isLoading && isAuthenticated) {
      // Petit délai pour s'assurer que le token est configuré
      const timer = setTimeout(() => {
        fetchDives();
      }, 100);
      
      return () => clearTimeout(timer);
    } else if (!isLoading && !isAuthenticated) {
      setLoading(false);
    }
  }, [isLoading, isAuthenticated, fetchDives]);

  return { dives, loading, error, addNewDive, removeDive, updateExistingDive };
}
