import axios from "axios";

const client = axios.create({
  baseURL: "http://192.168.1.6:3000",
  responseType: "json",
  withCredentials: true,
});

export const setHeader = (accessToken) => {
  client.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
};

export const clearHeader = () => {
  delete client.defaults.headers.common["Authorization"];
};
export default client;
