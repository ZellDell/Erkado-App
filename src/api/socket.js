import { io } from "socket.io-client";
const socket = io.connect("http://192.168.1.6:3000");
export default socket;
