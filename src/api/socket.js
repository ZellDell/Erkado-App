import { io } from "socket.io-client";
const socket = io.connect("http://93.127.198.109:3000/");
// const socket = io.connect("http://192.168.1.5:3000/");
export default socket;
