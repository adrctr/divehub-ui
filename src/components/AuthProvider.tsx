import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { setAuthToken as setDiveAuthToken, setCurrentUserId as setDiveUserId } from '../services/diveApi';
import { setAuthToken as setEquipmentAuthToken, setCurrentUserId as setEquipmentUserId } from '../services/equipmentApi';
import { setAuthToken as setUserAuthToken } from '../services/userApi';
import { useUserApi } from '../hooks/useUserApi';
import { AuthContext } from '../contexts/AuthContext';
import type { AuthContextType } from '../contexts/AuthContext';
import { splitFullName } from '../utils/nameUtils';
import { isSignupInProgress, clearSignupFlag } from '../utils/signupUtils';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
  const { currentUser, loading: userLoading, ensureUserExists, fetchUserByAuth0Id } = useUserApi();

  useEffect(() => {
    const setupAuthToken = async () => {
      if (isAuthenticated && user) {
        try {
          const token = await getAccessTokenSilently();
          console.log('Token Auth0 récupéré et configuré');
          
          // Configurer le token pour tous les services API
          setDiveAuthToken(token);
          setEquipmentAuthToken(token);
          setUserAuthToken(token);

          // Vérifier si l'utilisateur existe déjà dans la base de données
          if (user.sub && user.email && user.name) {
            try {
              // Tentative de récupération de l'utilisateur existant
              const existingUser = await fetchUserByAuth0Id(user.sub);
              
              if (existingUser) {
                // Utilisateur existant - simple connexion
                console.log('Utilisateur existant connecté:', `${existingUser.firstName} ${existingUser.lastName}`);
                
                // Configurer l'userId pour toutes les APIs
                setDiveUserId(existingUser.userId);
                setEquipmentUserId(existingUser.userId);
                console.log('UserId configuré pour toutes les APIs:', existingUser.userId);
                
                // Nettoyer le flag de signup si présent
                clearSignupFlag();
              } else {
                // Utilisateur n'existe pas dans la BD
                console.log('Utilisateur non trouvé dans la base de données');
                
                // Vérifier si c'est un processus de signup
                const isSignup = isSignupInProgress();
                
                if (isSignup) {
                  // C'est un signup - créer l'utilisateur
                  console.log('Processus de signup détecté - création de l\'utilisateur');
                  
                  // Séparer le nom complet en prénom et nom de famille
                  const { firstName, lastName } = splitFullName(user.name);
                  
                  const newUser = await ensureUserExists({
                    auth0UserId: user.sub,
                    firstName,
                    lastName,
                    email: user.email,
                    picture: user.picture
                  });
                  
                  // Configurer l'userId pour toutes les APIs
                  if (newUser.userId) {
                    setDiveUserId(newUser.userId);
                    setEquipmentUserId(newUser.userId);
                    console.log('UserId configuré pour le nouvel utilisateur:', newUser.userId);
                  }
                  
                  // Nettoyer le flag de signup
                  clearSignupFlag();
                } else {
                  // Ce n'est pas un signup, mais l'utilisateur n'existe pas - situation anormale
                  console.warn('Utilisateur authentifié mais non trouvé dans la BD et ce n\'est pas un signup');
                  
                  // Pour éviter les erreurs, on peut soit :
                  // 1. Créer l'utilisateur quand même (approche permissive)
                  // 2. Rediriger vers une page d'erreur (approche stricte)
                  // Ici, on choisit l'approche permissive
                  console.log('Création d\'urgence de l\'utilisateur manquant');
                  
                  const { firstName, lastName } = splitFullName(user.name);
                  
                  const newUser = await ensureUserExists({
                    auth0UserId: user.sub,
                    firstName,
                    lastName,
                    email: user.email,
                    picture: user.picture
                  });
                  
                  if (newUser.userId) {
                    setDiveUserId(newUser.userId);
                    setEquipmentUserId(newUser.userId);
                    console.log('UserId configuré pour l\'utilisateur manquant:', newUser.userId);
                  }
                }
              }
            } catch (error) {
              console.error('Erreur lors de la gestion de l\'utilisateur:', error);
              // Nettoyer le flag en cas d'erreur
              clearSignupFlag();
            }
          }
        } catch (error) {
          console.error('Erreur lors de la récupération du token:', error);
          
          // Nettoyer les tokens et flags en cas d'erreur
          setDiveAuthToken(null);
          setEquipmentAuthToken(null);
          setUserAuthToken(null);
          setDiveUserId(null);
          setEquipmentUserId(null);
          clearSignupFlag();
        }
      } else {
        // Nettoyer les tokens si non authentifié (mais pas le flag signup)
        setDiveAuthToken(null);
        setEquipmentAuthToken(null);
        setUserAuthToken(null);
        setDiveUserId(null);
        setEquipmentUserId(null);
      }
    };

    setupAuthToken();
  }, [isAuthenticated, getAccessTokenSilently, user, ensureUserExists, fetchUserByAuth0Id]);

  const contextValue: AuthContextType = {
    currentUser,
    userId: currentUser?.userId ?? null,
    loading: userLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
