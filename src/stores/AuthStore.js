import { decorate, observable, computed } from "mobx";
import instance from "./instance";
import jwt_decode from "jwt-decode";

class AuthStore {
  user = null;
  signup = async (userData, history) => {
    try {
      const res = await instance.post("signup/", userData);
      const user = res.data;
      this.setCurrentUser(user.token);
      history.replace("/");
    } catch (error) {
      console.error(error.response);
    }
  };
  login = async (userData, history) => {
    try {
      const res = await instance.post("login/", userData);
      const user = res.data;
      this.setCurrentUser(user.token);
      console.log("logged in");
      history.push("/");
    } catch (error) {
      console.error(error.response);
    }
  };
  setCurrentUser = token => {
    let user;
    if (token) {
      localStorage.setItem("token", token);
      instance.defaults.headers.common.Authorization = `jwt ${token}`;
      user = jwt_decode(token);
    } else {
      localStorage.removeItem("token");
      delete instance.defaults.headers.common.Authorization;
      user = null;
    }
    this.user = user;
  };
  
  checkForExpiredToken = () => {
    const token = localStorage.getItem("token");
    let user;
    if (token) {
      const currentTimeInSeconds = Date.now() / 1000;
      user = jwt_decode(token);
      if (user.exp >= currentTimeInSeconds) {
        return this.setCurrentUser(token);
      }
    }
    this.logout();
  };
  logout = () => {
    this.setCurrentUser();
  };
}
decorate(AuthStore, {
  user: observable
});
const authStore = new AuthStore();
authStore.checkForExpiredToken();
export default authStore;