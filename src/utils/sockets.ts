// utils/socket.js
import { io } from "socket.io-client";

const socket = io("https://api.msgcart.net/ws");

export default socket;
