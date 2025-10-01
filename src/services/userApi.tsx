import axios from 'axios';
import type { User, UserDto, UserResponse } from '../types/User';

const API_URL = `${import.meta.env.VITE_API_URL}/api/User`;

// Variable pour stocker le token
let authToken: string | null = null;

// Fonction pour définir le token
export function setAuthToken(token: string | null) {
  authToken = token;
}

// Fonction helper pour créer les headers avec le token
function getAuthHeaders() {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }
  
  return headers;
}

// Créer un nouvel utilisateur
export async function createUser(user: UserDto, retryCount = 0): Promise<User> {
  try {
    const response = await axios.post<UserResponse>(`${API_URL}`, user, {
      headers: getAuthHeaders(),
      timeout: 15000 // 15 secondes pour la création
    });
    
    // Convertir la date string en objet Date et ajouter l'auth0UserId
    return {
      ...response.data,
      auth0UserId: user.auth0UserId,
      picture: user.picture,
      createdAt: new Date(response.data.createdAt)
    };
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } };
      
      // Retry pour les erreurs serveur (5xx) ou de réseau
      if (((axiosError.response?.status && axiosError.response.status >= 500) || !axiosError.response) && retryCount < 1) {
        console.log(`Retry ${retryCount + 1}/2 pour createUser...`);
        await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
        return createUser(user, retryCount + 1);
      }
    }
    
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    throw error;
  }
}

// Récupérer un utilisateur par son Auth0 ID
export async function getUserByAuth0Id(auth0UserId: string, retryCount = 0): Promise<User | null> {
  try {
    const response = await axios.get<UserResponse>(`${API_URL}/auth0/${encodeURIComponent(auth0UserId)}`, {
      headers: getAuthHeaders(),
      timeout: 10000 // 10 secondes de timeout
    });
    
    return {
      ...response.data,
      auth0UserId, // Ajouter l'auth0UserId car il n'est pas retourné par le backend
      createdAt: new Date(response.data.createdAt)
    };
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 404) {
        return null; // Utilisateur non trouvé - c'est normal
      }
      
      // Retry pour les erreurs serveur (5xx) ou de réseau
      if (((axiosError.response?.status && axiosError.response.status >= 500) || !axiosError.response) && retryCount < 2) {
        console.log(`Retry ${retryCount + 1}/3 pour getUserByAuth0Id...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return getUserByAuth0Id(auth0UserId, retryCount + 1);
      }
    }
    
    console.error('Erreur lors de la récupération de l\'utilisateur par Auth0 ID:', error);
    throw error;
  }
}

// Récupérer un utilisateur par ID
export async function getUserById(userId: number): Promise<User> {
  const response = await axios.get<UserResponse>(`${import.meta.env.VITE_API_URL}/${userId}`, {
    headers: getAuthHeaders()
  });
  
  return {
    ...response.data,
    createdAt: new Date(response.data.createdAt)
  };
}

// Mettre à jour un utilisateur
export async function updateUser(user: User): Promise<User> {
  const response = await axios.put<UserResponse>(`${import.meta.env.VITE_API_URL}/${user.userId}`, user, {
    headers: getAuthHeaders()
  });
  
  return {
    ...response.data,
    createdAt: new Date(response.data.createdAt)
  };
}

// Créer ou récupérer un utilisateur (utilisé lors de la première connexion)
export async function createOrGetUser(userDto: UserDto): Promise<User> {
  try {
    // Essayer d'abord de récupérer l'utilisateur existant
    const existingUser = await getUserByAuth0Id(userDto.auth0UserId);
    if (existingUser) {
      return existingUser;
    }
    
    // Si l'utilisateur n'existe pas, le créer
    return await createUser(userDto);
  } catch (error) {
    console.error('Erreur lors de la création/récupération de l\'utilisateur:', error);
    throw error;
  }
}
