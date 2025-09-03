// Fetch requests for ISA data

import Constants from 'expo-constants';

const API_BASE_URL: string = Constants.expoConfig?.extra?.apiUrl ?? 'http://localhost:5000';

export async function getRequest(endpoint: string) {
  console.log(`${API_BASE_URL}${endpoint}`)
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "ngrok-skip-browser-warning": "123",
      Origin: window.location.origin,
    }
  });
  console.log(await response.json())
  if (!response.ok) {
    throw new Error(`HTTP error status: ${response.status}`);
  }
  return await response.json();
}

export async function postRequest(endpoint: string, args: any) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "ngrok-skip-browser-warning": "123",
    },
    body: JSON.stringify(args),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}