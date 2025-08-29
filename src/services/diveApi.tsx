import axios from 'axios';
import type { Dive,DiveDto } from '../types/Dive';

const API_URL = `${import.meta.env.VITE_API_URL}/api/Dive`;

// Variable pour stocker le token et l'userId
let authToken: string | null = null;
let currentUserId: number | null = null;

// Fonction pour définir le token
export function setAuthToken(token: string | null) {
  authToken = token;
}

// Fonction pour définir l'userId actuel
export function setCurrentUserId(userId: number | null) {
  currentUserId = userId;
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

export async function getDives(): Promise<Dive[]> {
  const response = await axios.get<Dive[]>(API_URL + '/All', {
    headers: getAuthHeaders()
  });
  return response.data;
}

export async function addDive(dive: DiveDto): Promise<Dive> {
    // Vérifier que l'userId est disponible
    if (!dive.userId && !currentUserId) {
        throw new Error('UserId non disponible. Veuillez vous reconnecter.');
    }

    // Ajouter automatiquement l'userId si il n'est pas déjà défini
    const diveWithUserId = {
      ...dive,
      userId: currentUserId
    };

    console.log('dive:', dive);
    console.log('dive.userId:', dive.userId);
    console.log('currentUserId:', currentUserId);
    console.log('diveWithUserId:', diveWithUserId);
    
    console.log('Ajout de plongée avec userId:', diveWithUserId.userId);

    const response = await axios.post<Dive>(API_URL, diveWithUserId, {
      headers: getAuthHeaders()
    });
    return response.data;
}

export async function updateDive(dive: Dive): Promise<void> {
    await axios.put(`${API_URL}`, dive, {
      headers: getAuthHeaders()
    });
}

export async function deleteDive(id: number): Promise<void> {
  await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeaders()
  });
}
