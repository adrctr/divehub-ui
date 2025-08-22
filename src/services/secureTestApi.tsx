import axios from "axios";

//const API_URLs = "https://localhost:7186/api/Secure"; //TODO: Add rthe ENDPOIN URL TO .ENV
const API_URL = "http://localhost:5109/api/Secure"; //TODO: Add rthe ENDPOIN URL TO .ENV

export async function GetSecureTest(token: string): Promise<string> {

  console.log("Token:", token);
  const response = await axios.get<string>(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
