import { io } from "socket.io-client";

const socketServerUrl = "ws://localhost:3001";

/**
 * Socket connection to send/receive messages.
 */
export default class SocketConnection {
    constructor(id, recipientId) {
        this.id = id;
        this.recipientId = recipientId;
        this.isReady = false;
        this.postSetup();
        this.domElement = document.createElement("div");
    }

    /**
     * Asynchronous setup of the connection.
     */
    async postSetup() {
        try {
            this.socket = await this.connectToServerSocket();
            this.socket.emit("register", this.id);
        } catch (error) {
            console.error("Error setting up sender connection:", error);
        }
    }

    /**
     * Returns promise that resolves to Socket connection to server, or rejects if error.
     * @returns {Promise<Socket>}
     */
    connectToServerSocket() {
        return new Promise((resolve, reject) => {
            const socket = io(socketServerUrl, { transports: ["websocket"] });
            socket.on("disconnect", () => console.error("Disconnected from socket server")); 
            socket.on("message", (message) => this.handleMessage(message));
            socket.on("registered", () => this.isReady = true);
            socket.on("connect_error", (error) => {
                console.error("Error connecting to socket server", error);
                reject(error);
            });
            socket.on("connect", () => {
                resolve(socket);
            });
        });
    }

    addListener(cb) {
        this.domElement.addEventListener("message", cb);
    }

    handleMessage(message) {
        this.domElement.dispatchEvent(new CustomEvent("message", {detail: message}));
    }

    /**
     * Sending data to recipient. Retry 20 times to wait for the socket to get ready.
     * @param {*} data 
     * @returns 
     */
    async sendData(data) {
        try {
            const retries = 20;
            while(retries > 0) {
                if (this.isReady) {
                    this.socket.emit("send", {data, recipient: this.recipientId});
                    return;
                }
                await new Promise((resolve) => setTimeout(resolve, 250));
                retries--;
            }

            console.error("Socket connection is not ready yet");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }
}
