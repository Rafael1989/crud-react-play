const API_URL = 'http://localhost:9000/api/products';

async function parseResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    const message = data.details ? `${data.error}: ${data.details}` : data.error;
    throw new Error(message || 'Request error');
  }

  return data;
}

export async function listProducts() {
  const response = await fetch(API_URL);
  return parseResponse(response);
}

export async function createProduct(payload) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  return parseResponse(response);
}

export async function updateProduct(id, payload) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  return parseResponse(response);
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });

  return parseResponse(response);
}
