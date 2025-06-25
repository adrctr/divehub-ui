import axios from 'axios';
import type { Dive,DiveDto } from '../types/Dive';

const API_URL = 'https://localhost:7186/api/Dive'; //TODO: Add rthe ENDPOIN URL TO .ENV

export async function getDives(): Promise<Dive[]> {
  const response = await axios.get<Dive[]>(API_URL+ '/All');
  return response.data;
}

export async function addDive(dive: DiveDto): Promise<Dive> {
    const response = await axios.post<Dive>(API_URL, dive);
    return response.data;
}

export async function updateDive(dive: Dive): Promise<void> {
    await axios.put(`${API_URL}`, dive);
}

export async function deleteDive(id: number): Promise<void> {
  await axios.delete(`${API_URL}/${id}`);
}
