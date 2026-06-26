const PROD_API_URL = 'https://sense-backend-0589.onrender.com';
// const PROD_API_URL = 'http://127.0.0.1:5000';


export function resolveApiBaseUrl() {
  const configured = process.env.REACT_APP_API_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, '');
  }
  return PROD_API_URL;
}

export const apiBaseUrl = resolveApiBaseUrl();

export async function postJson(path, body) {
  const url = `${apiBaseUrl}${path}`;
  console.log("++++++++",url)
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }
}
