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
import { showAuthErrorNotification } from '../utils/userNotifications';

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
                  
                  try {
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
                  } catch (userCreationError) {
                    console.error('Erreur lors de la création de l\'utilisateur:', userCreationError);
                    clearSignupFlag(); // Nettoyer le flag même en cas d'erreur
                    // Ne pas faire d'autres actions pour éviter les erreurs en cascade
                    return;
                  }
                } else {
                  // Ce n'est pas un signup, mais l'utilisateur n'existe pas
                  // Approche plus conservatrice : ne pas créer automatiquement l'utilisateur
                  console.warn('Utilisateur authentifié mais non trouvé dans la BD. Connexion en mode limité.');
                  
                  // Informer l'utilisateur du problème
                  showAuthErrorNotification('Votre compte n\'a pas été trouvé. Contactez le support si le problème persiste.');
                  
                  // Option : rediriger vers une page d'enregistrement ou afficher un message
                  // Pour l'instant, on laisse l'utilisateur sans userId (mode dégradé)
                  setDiveUserId(null);
                  setEquipmentUserId(null);
                }
              }
            } catch (userFetchError) {
              console.error('Erreur lors de la récupération de l\'utilisateur:', userFetchError);
              
              // En cas d'erreur de récupération, on peut essayer de créer l'utilisateur
              // seulement si c'est explicitement un signup
              const isSignup = isSignupInProgress();
              if (isSignup) {
                try {
                  console.log('Tentative de création d\'utilisateur après erreur de récupération...');
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
                    console.log('UserId configuré après création de récupération:', newUser.userId);
                  }
                } catch (fallbackError) {
                  console.error('Erreur lors de la création de récupération:', fallbackError);
                  // Laisser en mode dégradé
                  setDiveUserId(null);
                  setEquipmentUserId(null);
                }
              } else {
                // Simple login qui a échoué - mode dégradé
                setDiveUserId(null);
                setEquipmentUserId(null);
              }
              
              // Nettoyer le flag dans tous les cas
              clearSignupFlag();
            }
          }
        } catch (error) {
          console.error('Erreur lors de la récupération du token ou de la configuration:', error);
          
          // Informer l'utilisateur de manière discrète
          showAuthErrorNotification('Problème de connexion détecté. Tentative de reconnexion...');
          
          // Nettoyer tous les tokens et états en cas d'erreur majeure
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

    // Délai pour éviter les appels trop rapides et donner le temps à Auth0 de se stabiliser
    const timer = setTimeout(() => {
      setupAuthToken();
    }, 100);

    return () => clearTimeout(timer);
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
