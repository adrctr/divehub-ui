/**
 * Service pour gérer l'état d'authentification et distinguer signup/login
 */

const SIGNUP_INTENT_KEY = 'divehub_signup_intent';
const USER_CREATION_PENDING_KEY = 'divehub_user_creation_pending';

/**
 * Marque que l'utilisateur a l'intention de s'inscrire
 */
export function markSignupIntent(): void {
  localStorage.setItem(SIGNUP_INTENT_KEY, 'true');
  localStorage.setItem(USER_CREATION_PENDING_KEY, 'true');
}

/**
 * Marque que l'utilisateur a l'intention de se connecter (pas de signup)
 */
export function markLoginIntent(): void {
  localStorage.removeItem(SIGNUP_INTENT_KEY);
  localStorage.removeItem(USER_CREATION_PENDING_KEY);
}

/**
 * Vérifie si l'utilisateur a l'intention de s'inscrire
 */
export function hasSignupIntent(): boolean {
  return localStorage.getItem(SIGNUP_INTENT_KEY) === 'true';
}

/**
 * Vérifie si la création d'utilisateur est en attente
 */
export function isUserCreationPending(): boolean {
  return localStorage.getItem(USER_CREATION_PENDING_KEY) === 'true';
}

/**
 * Marque que l'utilisateur a été créé avec succès
 */
export function markUserCreated(): void {
  localStorage.removeItem(SIGNUP_INTENT_KEY);
  localStorage.removeItem(USER_CREATION_PENDING_KEY);
}

/**
 * Nettoie tous les marqueurs d'intention
 */
export function clearAuthIntents(): void {
  localStorage.removeItem(SIGNUP_INTENT_KEY);
  localStorage.removeItem(USER_CREATION_PENDING_KEY);
}

/**
 * Vérifie si c'est probablement un signup basé sur l'URL ou l'état
 */
export function detectSignupFromContext(): boolean {
  // Vérifier l'URL pour des paramètres de signup
  const urlParams = new URLSearchParams(window.location.search);
  const screenHint = urlParams.get('screen_hint');
  
  // Vérifier les paramètres Auth0 communs pour le signup
  const isSignupFlow = screenHint === 'signup' || 
                      window.location.hash.includes('signup') ||
                      window.location.pathname.includes('signup');
  
  return isSignupFlow || hasSignupIntent();
}
