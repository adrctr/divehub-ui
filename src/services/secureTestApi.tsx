import axios from 'axios';

const API_URL = 'https://localhost:7186/api'; //TODO: Add rthe ENDPOIN URL TO .ENV

export async function GetSecureTest(): Promise<string> {
  const response = await axios.get<string>(API_URL+ '/secure');
  return response.data;
}
