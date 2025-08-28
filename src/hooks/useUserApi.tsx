import { useState, useCallback } from 'react';
import type { User, UserDto } from '../types/User';
import { createOrGetUser, getUserByAuth0Id, updateUser } from '../services/userApi';
import { showUserCreatedNotification, showUserWelcomeBackNotification, showErrorNotification } from '../utils/userNotifications';
import { combineNames } from '../utils/nameUtils';

export function useUserApi() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Créer ou récupérer un utilisateur
  const ensureUserExists = useCallback(async (userDto: UserDto): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      // Vérifier d'abord si l'utilisateur existe déjà
      const existingUser = await getUserByAuth0Id(userDto.auth0UserId);
      
      if (existingUser) {
        // Utilisateur existant - message de bienvenue
        setCurrentUser(existingUser);
        showUserWelcomeBackNotification(combineNames(existingUser.firstName, existingUser.lastName));
        return existingUser;
      } else {
        // Nouvel utilisateur - créer et message de création
        const newUser = await createOrGetUser(userDto);
        setCurrentUser(newUser);
        showUserCreatedNotification(combineNames(newUser.firstName, newUser.lastName));
        return newUser;
      }
    } catch (err) {
      console.error('Erreur lors de la création/récupération de l\'utilisateur:', err);
      
      // Essayer de créer l'utilisateur même si la vérification a échoué
      try {
        console.log('Tentative de création directe après échec de vérification...');
        const newUser = await createOrGetUser(userDto);
        setCurrentUser(newUser);
        showUserCreatedNotification(combineNames(newUser.firstName, newUser.lastName));
        return newUser;
      } catch (creationErr) {
        console.error('Échec de la création directe aussi:', creationErr);
        const errorMessage = 'Impossible de créer ou récupérer l\'utilisateur';
        setError(errorMessage);
        showErrorNotification(errorMessage);
        throw creationErr;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Récupérer un utilisateur par Auth0 ID
  const fetchUserByAuth0Id = useCallback(async (auth0UserId: string): Promise<User | null> => {
    setLoading(true);
    setError(null);
    
    try {
      console.info('INFO 1', 'Récupération de l\'utilisateur par Auth0 ID:', auth0UserId);
      const user = await getUserByAuth0Id(auth0UserId);
      console.info('INFO 2', 'Récupération de l\'utilisateur :', user);

      setCurrentUser(user);
      return user;
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', err);
      
      // Ne pas afficher d'erreur si l'utilisateur n'existe simplement pas
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          // Utilisateur non trouvé - c'est normal pour un nouveau compte
          console.info('Utilisateur non trouvé (404) - probablement un nouveau compte');
          setCurrentUser(null);
          return null;
        }
      }
      
      // Pour d'autres erreurs, on les signale mais sans notification utilisateur pour éviter la pollution
      const errorMessage = 'Erreur lors de la récupération de l\'utilisateur';
      setError(errorMessage);
      console.warn('Erreur de récupération utilisateur, mais continuation en mode dégradé');
      
      // Return null au lieu de throw pour permettre la continuation
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Mettre à jour un utilisateur
  const updateCurrentUser = useCallback(async (user: User): Promise<User> => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedUser = await updateUser(user);
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', err);
      const errorMessage = 'Erreur lors de la mise à jour de l\'utilisateur';
      setError(errorMessage);
      showErrorNotification(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    currentUser,
    loading,
    error,
    ensureUserExists,
    fetchUserByAuth0Id,
    updateCurrentUser,
    setCurrentUser
  };
}
