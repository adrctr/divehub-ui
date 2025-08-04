import axios from 'axios';
import type { User, UserDto, UserResponse } from '../types/User';

const API_URL = 'https://localhost:7186/api/User'; //TODO: Add the ENDPOINT URL TO .ENV

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
export async function createUser(user: UserDto): Promise<User> {
  const response = await axios.post<UserResponse>(API_URL, user, {
    headers: getAuthHeaders()
  });
  
  // Convertir la date string en objet Date et ajouter l'auth0UserId
  return {
    ...response.data,
    auth0UserId: user.auth0UserId,
    picture: user.picture,
    createdAt: new Date(response.data.createdAt)
  };
}

// Récupérer un utilisateur par son Auth0 ID
export async function getUserByAuth0Id(auth0UserId: string): Promise<User | null> {
  try {
    const response = await axios.get<UserResponse>(`${API_URL}/auth0/${encodeURIComponent(auth0UserId)}`, {
      headers: getAuthHeaders()
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
        return null; // Utilisateur non trouvé
      }
    }
    throw error;
  }
}

// Récupérer un utilisateur par ID
export async function getUserById(userId: number): Promise<User> {
  const response = await axios.get<UserResponse>(`${API_URL}/${userId}`, {
    headers: getAuthHeaders()
  });
  
  return {
    ...response.data,
    createdAt: new Date(response.data.createdAt)
  };
}

// Mettre à jour un utilisateur
export async function updateUser(user: User): Promise<User> {
  const response = await axios.put<UserResponse>(`${API_URL}/${user.userId}`, user, {
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
