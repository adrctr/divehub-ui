import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { setAuthToken as setDiveAuthToken } from '../services/diveApi';
import { setAuthToken as setEquipmentAuthToken } from '../services/equipmentApi';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  useEffect(() => {
    const setupAuthToken = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          console.log('Token Auth0 récupéré et configuré');
          
          // Configurer le token pour tous les services API
          setDiveAuthToken(token);
          setEquipmentAuthToken(token);
        } catch (error) {
          console.error('Erreur lors de la récupération du token:', error);
          
          // Nettoyer les tokens en cas d'erreur
          setDiveAuthToken(null);
          setEquipmentAuthToken(null);
        }
      } else {
        // Nettoyer les tokens si non authentifié
        setDiveAuthToken(null);
        setEquipmentAuthToken(null);
      }
    };

    setupAuthToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  return <>{children}</>;
}
