import axios from 'axios';
import type { Equipment,EquipmentDto } from '../types/Equipment';

const API_URL = 'https://localhost:7186/api/Equipment'; //TODO: Add rthe ENDPOIN URL TO .ENV

export async function getEquipments(): Promise<Equipment[]> {
  const response = await axios.get<Equipment[]>(API_URL+ '/All');
  return response.data;
}

export async function addEquipment(Equipment: EquipmentDto): Promise<Equipment> {
    const response = await axios.post<Equipment>(API_URL, Equipment);
    return response.data;
}

export async function updateEquipment(Equipment: Equipment): Promise<void> {
    await axios.put(`${API_URL}`, Equipment);
}

export async function deleteEquipment(id: number): Promise<void> {
  await axios.delete(`${API_URL}/${id}`);
}
