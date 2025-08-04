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
      const errorMessage = 'Erreur lors de la gestion de l\'utilisateur';
      setError(errorMessage);
      showErrorNotification(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Récupérer un utilisateur par Auth0 ID
  const fetchUserByAuth0Id = useCallback(async (auth0UserId: string): Promise<User | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const user = await getUserByAuth0Id(auth0UserId);
      setCurrentUser(user);
      return user;
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', err);
      const errorMessage = 'Erreur lors de la récupération de l\'utilisateur';
      setError(errorMessage);
      showErrorNotification(errorMessage);
      throw err;
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
