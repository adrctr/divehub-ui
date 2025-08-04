import axios from 'axios';
import type { Dive,DiveDto } from '../types/Dive';

const API_URL = 'https://localhost:7186/api/Dive'; //TODO: Add rthe ENDPOIN URL TO .ENV

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

export async function getDives(): Promise<Dive[]> {
  const response = await axios.get<Dive[]>(API_URL + '/All', {
    headers: getAuthHeaders()
  });
  return response.data;
}

export async function addDive(dive: DiveDto): Promise<Dive> {
    const response = await axios.post<Dive>(API_URL, dive, {
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
