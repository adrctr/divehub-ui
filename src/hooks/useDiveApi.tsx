import { useEffect, useState, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import type { Dive, DiveDto } from '../types/Dive';
import { addDive, deleteDive, getDives, updateDive } from '../services/diveApi';

export function useDiveApi() {
  const [dives, setDives] = useState<Dive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading } = useAuth0();

  const fetchDives = useCallback(async (retryCount = 0) => {
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
      
      // Tentative de retry si c'est une erreur temporaire et qu'on n'a pas encore essayé 3 fois
      if (retryCount < 2) {
        console.log(`Tentative ${retryCount + 1}/3 de rechargement...`);
        setTimeout(() => fetchDives(retryCount + 1), 1000 * (retryCount + 1));
        return;
      }
      
      setError('Erreur de chargement des plongées');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const addNewDive = async (dive: DiveDto, retryCount = 0) => {
    if (!isAuthenticated) {
      setError('Vous devez être connecté pour ajouter une plongée');
      throw new Error('Utilisateur non authentifié');
    }

    try {
      await addDive(dive);
      // Attendre un peu pour s'assurer que la transaction est terminée côté serveur
      await new Promise(resolve => setTimeout(resolve, 200));
      await fetchDives();
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la plongée:', err);
      
      // Tentative de retry si c'est une erreur temporaire et qu'on n'a pas encore essayé 2 fois
      if (retryCount < 1) {
        console.log(`Tentative ${retryCount + 1}/2 d'ajout de plongée...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return addNewDive(dive, retryCount + 1);
      }
      
      setError('Erreur lors de l\'ajout de la plongée');
      throw err; // Re-throw pour que le composant appelant puisse gérer l'erreur
    }
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

  return { 
    dives, 
    loading, 
    error, 
    addNewDive, 
    removeDive, 
    updateExistingDive, 
    refreshDives: () => fetchDives() 
  };
}
