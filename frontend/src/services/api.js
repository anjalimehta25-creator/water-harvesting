const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    ...options.headers
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong"
    );
  }

  return data;
};

export const api = {
  get: (endpoint) =>
    request(endpoint, {
      method: "GET"
    }),

  post: (endpoint, body) =>
    request(endpoint, {
      method: "POST",
      body: JSON.stringify(body)
    }),

  put: (endpoint, body) =>
    request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body)
    }),

  patch: (endpoint, body) =>
    request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body)
    }),

  delete: (endpoint) =>
    request(endpoint, {
      method: "DELETE"
    }),

  upload: (endpoint, body) =>
    request(endpoint, {
      method: "POST",
      body
    })
};