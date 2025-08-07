import { MQTTClient } from "./mqtt";

interface Message {
  id: string;
  type?: "PeerID";
  offer?: { desc: RTCSessionDescriptionInit; peerId: string };
  answer?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
}

export type State = RTCPeerConnectionState | "subscribed" | void;

export class WebRTCDemo {
  private pc: RTCPeerConnection | null = null;
  // private peers: { [_: string]: RTCPeerConnection } = {}; TODO 广播id后 根据id分别创建peer connection
  private dataChannel: RTCDataChannel | null = null;
  private cli: MQTTClient;
  id = crypto.randomUUID();
  // peerId?: string; // peer id
  onMessage: (message: string) => void;
  onConnState: (_: State) => void;
  onPeerID: (_: string) => void;

  constructor({
    onMessage,
    onConnState,
    onPeerID,
  }: {
    onMessage: WebRTCDemo["onMessage"];
    onConnState: WebRTCDemo["onConnState"];
    onPeerID: WebRTCDemo["onPeerID"];
  }) {
    console.log("初始化 WebRTCDemo", this.id);

    // 1. 初始化 WebSocket 连接
    // const url = "wss://mqtt-dashboard.com:8884/mqtt";
    const url = "wss://test.mosquitto.org:8081";
    this.cli = new MQTTClient({ url, topic: "test/webrtc/topic" });
    this.onMessage = onMessage;
    this.onConnState = onConnState;
    this.onPeerID = onPeerID;

    this.cli.handleConnectEvent = () => {
      console.log("成功连接到信令服务器");
      // WebSocket 连接成功后才初始化 PeerConnection
      this.initializePeerConnection();
      this.onConnState("subscribed");
    };

    this.cli.handleMessageEvent = async (msg) => {
      const message = JSON.parse(msg) as Message;

      if (message.id === this.id) return;
      console.log("从信令服务器收到消息:", message);

      if (message.type === "PeerID") this.onPeerID(message.id);
      else if (message.offer) {
        if (message.offer.peerId !== this.id) return;
        // this.peerId = message.id; // 收到发起方id
        await this.receiveOffer(message.offer.desc);
      } else if (message.answer) {
        // if (message.id !== this.peerId) return;
        await this.receiveAnswer(message.answer);
      } else if (message.candidate) {
        // if (message.id !== this.peerId) return;
        await this.addIceCandidate(message.candidate);
      }
    };

    this.cli.handleErrorEvent = (error) => {
      console.error("信令服务器连接错误:", error);
    };

    this.cli.handleCloseEvent = () => {
      console.log("与信令服务器的连接已断开");
    };
  }

  destroy() {
    // 销毁webrtc实例
    this.cli.close();
    this.pc?.close();
  }

  // 2. 发送信令消息的通用方法
  private sendSignalingMessage(message: Message): void {
    this.cli.send(JSON.stringify(message));
  }

  private initializePeerConnection(): void {
    const configuration: RTCConfiguration = {
      iceServers: [
        {
          urls: "stun:stun.miwifi.com", // "stun:stun.l.google.com:19302", // 使用一个更通用的 STUN 服务器
        },
      ],
    };

    this.pc = new RTCPeerConnection(configuration);

    // 当需要发送 ICE 候选地址时
    this.pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate) {
        // *** 优化点：通过 WebSocket 发送 ICE candidate ***
        console.log("发送本地 ICE candidate:", event.candidate);
        this.sendSignalingMessage({ id: this.id, candidate: event.candidate });
      }
    };

    // 当远程数据通道打开时
    this.pc.ondatachannel = (event: RTCDataChannelEvent) => {
      console.log("收到远程数据通道");
      this.dataChannel = event.channel; // 接受 发起方的数据通道
      this.setupDataChannel();
    };

    // 当 ICE 连接状态改变时
    this.pc.oniceconnectionstatechange = () => {
      console.log("ICE 连接状态:", this.pc?.iceConnectionState);
      if (this.pc?.iceConnectionState === "failed") {
        console.error("ICE 连接失败。");
        // 可以在这里添加重试逻辑
      }
    };

    this.pc.onconnectionstatechange = () => {
      console.log("Connection 状态:", this.pc?.connectionState);
      this.onConnState(this.pc?.connectionState);
    };

    // 当收到远程流时 (如果有的话)
    this.pc.ontrack = (event: RTCTrackEvent) => {
      // 实现处理接收到的媒体流的逻辑
      console.log("收到远程媒体流", event.streams[0]);
    };
  }

  // A 创建 Offer
  public async createOffer(peerId: string): Promise<void> {
    if (!this.pc) return;

    console.log("创建 Offer...");
    this.dataChannel = this.pc.createDataChannel("messageChannel"); // 发起连接方
    this.setupDataChannel();

    try {
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);

      // *** 优化点：通过 WebSocket 发送 offer ***
      console.log("发送本地 Offer:", offer);
      this.sendSignalingMessage({ id: this.id, offer: { desc: offer, peerId } });
    } catch (error) {
      console.error("创建 Offer 时出错:", error);
    }
  }

  // B 接收 Offer 并创建 Answer
  public async receiveOffer(offer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.pc) return;

    console.log("收到 Offer, 创建 Answer...");
    try {
      await this.pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await this.pc.createAnswer();
      await this.pc.setLocalDescription(answer);

      // *** 优化点：通过 WebSocket 发送 answer ***
      console.log("发送本地 Answer:", answer);
      this.sendSignalingMessage({ id: this.id, answer: answer });
    } catch (error) {
      console.error("处理 Offer 时出错:", error);
    }
  }

  // A 接收 Answer
  public async receiveAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.pc) return;

    console.log("收到 Answer");
    try {
      await this.pc.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      console.error("处理 Answer 时出错:", error);
    }
  }

  // 添加 ICE Candidate
  public async addIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    if (!this.pc) return;

    console.log("添加远程 ICE Candidate");
    try {
      await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error("添加 ICE candidate 时出错:", error);
    }
  }

  // 设置数据通道
  private setupDataChannel(): void {
    if (!this.dataChannel) return;

    this.dataChannel.onopen = () => {
      console.log("数据通道已打开");
      this.sendMessage(JSON.stringify(`hello from ${this.id}`));
    };

    this.dataChannel.onclose = () => {
      console.log("数据通道已关闭");
    };

    this.dataChannel.onerror = (error) => {
      console.error("数据通道错误:", error);
    };

    this.dataChannel.onmessage = (event: MessageEvent) => {
      console.log("收到消息:", event.data);
      // 可以在这里处理收到的消息，例如更新 UI
      this.onMessage(event.data);
    };
  }

  // 发送消息
  public sendMessage(message: string): void {
    if (this.dataChannel && this.dataChannel.readyState === "open") {
      this.dataChannel.send(message);
      console.log("已发送消息:", message);
    } else {
      console.warn("数据通道未打开，无法发送消息。当前状态:", this.dataChannel?.readyState);
    }
  }

  // 发送信令
  public signal(message: Message) {
    this.cli.send(JSON.stringify(message));
  }
}
