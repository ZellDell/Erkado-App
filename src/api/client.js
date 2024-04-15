import axios from "axios";

const client = axios.create({
  baseURL: "http://93.127.198.109:3000/",
  // baseURL: "http://192.168.1.5:3000/",
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
