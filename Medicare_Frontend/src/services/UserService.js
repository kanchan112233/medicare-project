import api from './api';

class UserService {
  registerUser(userData) {
    return api.post('/user/saveUser', userData);
  }

  loginUser(loginCredentials) {
    return api.post('/user/login', loginCredentials);
  }

  getAllUsers() {
    return api.get('/user/getAllUsers');
  }

  getAllPatients() {
    return api.get('/patient/getAllPatients');
  }

  setCurrentUser(user) {
    localStorage.setItem('medicare_user', JSON.stringify(user));
  }

  getCurrentUser() {
    const user = localStorage.getItem('medicare_user');
    return user ? JSON.parse(user) : null;
  }

  logoutUser() {
    localStorage.removeItem('medicare_user');
  }

  isLoggedIn() {
    return !!this.getCurrentUser();
  }
}

const userServiceInstance = new UserService();
export default userServiceInstance;
