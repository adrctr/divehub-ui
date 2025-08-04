import axios from 'axios';
import type { Equipment,EquipmentDto } from '../types/Equipment';

const API_URL = 'https://localhost:7186/api/Equipment'; //TODO: Add rthe ENDPOIN URL TO .ENV

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

export async function getEquipments(): Promise<Equipment[]> {
  const response = await axios.get<Equipment[]>(API_URL + '/All', {
    headers: getAuthHeaders()
  });
  return response.data;
}

export async function addEquipment(equipment: EquipmentDto): Promise<Equipment> {
    // Ajouter automatiquement l'userId si il n'est pas déjà défini
    const equipmentWithUserId = {
      ...equipment,
      userId: equipment.userId ?? currentUserId
    };

    const response = await axios.post<Equipment>(API_URL, equipmentWithUserId, {
      headers: getAuthHeaders()
    });
    return response.data;
}

export async function updateEquipment(equipment: Equipment): Promise<void> {
    await axios.put(`${API_URL}`, equipment, {
      headers: getAuthHeaders()
    });
}

export async function deleteEquipment(id: number): Promise<void> {
  await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeaders()
  });
}
