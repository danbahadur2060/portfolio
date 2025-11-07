export const isAuthenticated = () => {
  try {
    return localStorage.getItem('isLoggedIn') === 'true';
  } catch {
    return false;
  }
};

export const getUserRole = () => {
  try {
    return localStorage.getItem('role') || null;
  } catch {
    return null;
  }
};

export const isAdmin = () => getUserRole() === 'admin';

export const login = () => localStorage.setItem('isLoggedIn', 'true');
export const logout = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('token');
  localStorage.removeItem('role');
};
