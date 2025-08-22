// Utilitaires pour gérer le processus de signup
export const setSignupFlag = () => {
  try {
    localStorage.setItem('divehub_signup_in_progress', 'true');
  } catch (error) {
    console.warn('Impossible de définir le flag de signup dans localStorage:', error);
  }
};

export const clearSignupFlag = () => {
  try {
    localStorage.removeItem('divehub_signup_in_progress');
  } catch (error) {
    console.warn('Impossible de supprimer le flag de signup du localStorage:', error);
  }
};

export const isSignupInProgress = (): boolean => {
  try {
    return localStorage.getItem('divehub_signup_in_progress') === 'true';
  } catch (error) {
    console.warn('Impossible de lire le flag de signup du localStorage:', error);
    return false; // Valeur par défaut sécurisée
  }
};
