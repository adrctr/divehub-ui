import axios from "axios";

//const API_URLs = "https://localhost:7186/api/Secure"; //TODO: Add rthe ENDPOIN URL TO .ENV
const API_URL = `${import.meta.env.VITE_API_URL}/api/Secure`; // Use Vite env variable for API URL

export async function GetSecureTest(token: string): Promise<string> {

  console.log("Token:", token);
  const response = await axios.get<string>(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
