import axios from "axios";

const instance = axios.create({
    baseURL: "https://the-index-api.herokuapp.com"
  });
  

export default instance;