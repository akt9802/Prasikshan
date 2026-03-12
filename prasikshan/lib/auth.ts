// Utility functions for authentication

export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

export const setUserData = (user: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export const getUserData = (): any => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        return JSON.parse(user);
      } catch (e) {
        console.error("Failed to parse user data from localStorage:", e);
        return null;
      }
    }
  }
  return null;
};

export const removeUserData = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
};

export const clearAuth = () => {
  removeAuthToken();
  removeUserData();
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Fetch with auth header
export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
) => {
  const token = getAuthToken();
  const headers = {
    ...options.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  return fetch(url, {
    ...options,
    headers,
  });
};
