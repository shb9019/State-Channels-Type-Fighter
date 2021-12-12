import { io } from "socket.io-client";

const webRtcConfig = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]};
const socketServerUrl = "ws://localhost:3001";

/**
 * WebRTC connection to receive messages from a sender.
 */
export default class ReceiverConnection {
    constructor(receiverId, senderId) {
        console.log('Setting up receiver connection...');
        this.receiverId = receiverId;
        this.senderId = senderId;
        this.rtcConnection = this.createRtcConnection(webRtcConfig);
        this.postSetup();
    }

    /**
     * Create RTC connection and add appropriate event handlers.
     * @param {*} webRtcConfig 
     * @returns 
     */
    createRtcConnection(webRtcConfig) {
        const rtcConnection = new RTCPeerConnection(webRtcConfig);
        rtcConnection.ondatachannel = (event) => this.setDataChannel(event.channel);
        return rtcConnection;
    }

    /**
     * Assign data channel once received from sender.
     * @param {*} channel 
     */
    setDataChannel(channel) {
        this.dataChannel = channel;
        this.dataChannel.onerror = (error) => console.error('Data channel error:', error);
        this.dataChannel.onmessage = (event) => console.log(event.data);
    }

    /**
     * Asynchronous setup operations.
     */
    async postSetup() {
        try {
            this.socket = await this.connectToServerSocket();
            this.socket.emit("register", this.receiverId);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Returns promise that resolves to a socket connecting to server, or rejects with error.
     * @returns {Promise<Socket>}
     */
    connectToServerSocket() {
        return new Promise((resolve, reject) => {
            const socket = io(socketServerUrl, { transports: ["websocket"] });
            socket.on("message", (message) => this.handleSignalingMessage(message));
            socket.on("connect_error", (error) => {
                console.error("Error connecting to socket server", error);
                reject(error);
            });
            socket.on("disconnect", () => console.error("Disconnected from socket server"));
            socket.on("connect", () => resolve(socket));
        });
    }

    /**
     * Handles signaling messages from socket server.
     * @param {*} message 
     */
    handleSignalingMessage(message) {
        if (message.offer) {
            this.createAndSendAnswer(message.offer);
        } else if (message.candidate) {
            this.handleIceCandidate(message.candidate);
        }
    };

    /**
     * Sends back answer on receiving offer from sender.
     * @param {*} offer 
     */
    createAndSendAnswer(offer) {
        this.rtcConnection.setRemoteDescription(new RTCSessionDescription(offer));
        this.rtcConnection.createAnswer().then(answer => {
            this.rtcConnection.setLocalDescription(answer);
            this.socket.emit("send", {
                data: {
                    answer: answer,
                },
                recipient: this.senderId
            });
        });
    }

    /**
     * Adds ICE candidate to RTC connection upon receiving from sender.
     * @param {*} candidate 
     */
    handleIceCandidate(candidate) {
        this.rtcConnection.addIceCandidate(new RTCIceCandidate(candidate))
            .catch(err => {console.error('Error adding ICE candidate:', err)});
    };
}
