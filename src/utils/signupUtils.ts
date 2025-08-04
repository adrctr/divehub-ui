// Utilitaires pour gérer le processus de signup
export const setSignupFlag = () => {
  localStorage.setItem('divehub_signup_in_progress', 'true');
};

export const clearSignupFlag = () => {
  localStorage.removeItem('divehub_signup_in_progress');
};

export const isSignupInProgress = (): boolean => {
  return localStorage.getItem('divehub_signup_in_progress') === 'true';
};
