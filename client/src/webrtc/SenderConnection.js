import { io } from "socket.io-client";

const webRtcConfig = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]};
const socketServerUrl = "ws://localhost:3001";

/**
 * WebRTC Connection to send messages.
 */
export default class SenderConnection {
    constructor(senderId, receiverId) {
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.rtcConnection = this.createRtcConnection(webRtcConfig);
        this.dataChannel = this.createDataChannel(this.rtcConnection, "moves");
        this.isReady = false;
        this.postSetup();
    }

    /**
     * Create RTC connection and add appropriate event handlers.
     * @param {*} webRtcConfig 
     * @returns 
     */
    createRtcConnection(webRtcConfig) {
        const rtcConnection = new RTCPeerConnection(webRtcConfig);
        rtcConnection.onicecandidateerror = event => console.error("ICE candidate error:", event);
        rtcConnection.onicecandidate = event => {
            if (event.candidate) {
                this.handleIceCandidateDiscovery(event.candidate);
            }
        };
        return rtcConnection;
    }

    /**
     * Attach data channel to RTC connection.
     * @param {*} rtcConnection 
     * @param {*} channelLabel 
     * @returns 
     */
    createDataChannel(rtcConnection, channelLabel) {
        const dataChannel = rtcConnection.createDataChannel(channelLabel);
        dataChannel.onopen = () => {
            this.isReady = true;
        };
        dataChannel.onerror = (error) => console.error("Data channel error:", error);
        return dataChannel;
    }

    /**
     * Handle ICE candidate gathered by the RTC connection. Send to receiver if any discovered.
     * @param {*} candidate 
     */
    handleIceCandidateDiscovery(candidate) {
        this.socket.emit("send", {
            data: {
                candidate,
            },
            recipient: this.receiverId
        });
    }

    /**
     * Asynchronous setup of the sender connection.
     */
    async postSetup() {
        try {
            this.socket = await this.connectToServerSocket();
            this.socket.emit("register", this.senderId);
            await this.createAndSendOffer();
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
            socket.on("message", (message) => this.handleSignalingMessage(message));
            socket.on("connect_error", (error) => {
                console.error("Error connecting to socket server", error);
                reject(error);
            });
            socket.on("connect", () => {
                resolve(socket);
            });
        });
    }

    /**
     * Handles messages received from the server socket.
     * @param {*} message 
     */
    handleSignalingMessage(message) {
        if (message.answer) {
            this.setRemoteDescription(message.answer);
        }
    };

    /**
     * Create and send offer to receiver.
     */
    async createAndSendOffer() {
        const offer = await this.rtcConnection.createOffer();
        this.rtcConnection.setLocalDescription(offer);
        this.socket.emit("send", {
            data: {
                offer,
            },
            recipient: this.receiverId
        });
    }

    /**
     * Set remote connection description received from receiver.
     * @param {*} answer 
     */
    setRemoteDescription(answer) {
        this.rtcConnection.setRemoteDescription(new RTCSessionDescription(answer));
    }

    async sendMessage(message) {
        let retries = 5;
        while(this.isReady != true && retries > 0) {
            retries--;
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        if (retries == 0) {
            throw new Error("Sender connection failed to connect to receiver");
        }

        this.dataChannel.send(message);
    }
}
