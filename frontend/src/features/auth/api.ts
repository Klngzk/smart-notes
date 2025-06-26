const API_URL = import.meta.env.VITE_API_URL;

export const registerUser = async (email: string, password: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Registration failed");
  }

  return response.json();
};

export const verifyEmail = async (token: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_URL}/api/auth/verify-email?token=${token}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Email verification failed");
  }

  return data;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<{ token: string; user: { id: string; email: string } }> => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};
