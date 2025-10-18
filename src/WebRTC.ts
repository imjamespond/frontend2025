import { mqtts, stuns, topic } from "./config";
import { debugMqtt, MQTTClient } from "./mqtt";

if (!window.name) {
  window.name = crypto.randomUUID();
}

interface SignalMessage {
  id: string;
  type?: "PeerID" | "Reload" | "Reloading" | "GiveMeOffer";
  peerId?: string;
  offer?: { desc: RTCSessionDescriptionInit };
  answer?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
}

export interface Message {
  file?:
    | { type: "showSaveFilePicker"; name: string; chunks: number }
    | { type: "beginRecieve" }
    | { type: "chunk"; chunk: number };
}

export type State = RTCPeerConnectionState | "signal_connected" | "signal_disconnected" | void;

const MAX_BUFFER = 8 * 1024 * 1024; // 8MB，自行设定, 实际大小应该是15MB
const LOW_THRESHOLD = 1 * 1024 * 1024;

export class WebRTCDemo {
  private pc: RTCPeerConnection | null = null;
  // private peers: { [_: string]: RTCPeerConnection } = {}; TODO 广播id后 根据id分别创建peer connection
  private dataChannel: RTCDataChannel | null = null;
  signal: MQTTClient; // 信令 client
  id = window.name;
  peerId?: string; // peer id
  onMessage: (message: unknown) => void;
  onConnState: (_: State) => void;
  onPeerID: (_: string) => void;
  onStream: (stream: MediaStream) => void;

  constructor({
    onMessage,
    onConnState,
    onPeerID,
    onStream,
  }: {
    onMessage: WebRTCDemo["onMessage"];
    onConnState: WebRTCDemo["onConnState"];
    onPeerID: WebRTCDemo["onPeerID"];
    onStream: WebRTCDemo["onStream"];
  }) {
    console.log("初始化 WebRTCDemo", this.id);

    // 1. 初始化 WebSocket 连接
    // const url = "wss://mqtt-dashboard.com:8884/mqtt";
    const url = mqtts[0];
    this.signal = new MQTTClient({ url, topic, });
    this.onMessage = onMessage;
    this.onConnState = onConnState;
    this.onPeerID = onPeerID;
    this.onStream = onStream;

    this.signal.handleConnectEvent = () => {
      console.log("成功连接到信令服务器");
      // WebSocket 连接成功后才初始化 PeerConnection
      this.initializePeerConnection();
      this.onConnState("signal_connected");
    };

    this.signal.handleMessageEvent = async (msg) => {
      const message = JSON.parse(msg) as SignalMessage;

      if (message.id === this.id) return; // ignore from self
      console.log("从信令服务器收到消息:", message);

      if (message.type === "PeerID") this.onPeerID(message.id);
      else if (message.type === "Reload") {
        this.onMessage(message);
        this.sendSignalingMessage({
          type: "Reloading",
          id: this.id,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2_000);
      } else if (message.type === "GiveMeOffer") {
        if (message.peerId !== this.id) return;
        this.createOffer(message.id);
      } else if (message.offer) {
        if (message.peerId !== this.id) return;
        // this.peerId = message.id; // 收到发起方id
        await this.receiveOffer(message.id, message.offer.desc);
      } else if (message.answer) {
        // if (message.id !== this.peerId) return;
        await this.receiveAnswer(message.answer);
      } else if (message.candidate) {
        // if (message.id !== this.peerId) return;
        await this.addIceCandidate(message.candidate);
      }
    };

    this.signal.handleErrorEvent = (error) => {
      console.error("信令服务器连接错误:", error);
    };

    this.signal.handleCloseEvent = () => {
      console.log("与信令服务器的连接已断开");
    };
  }

  destroy() {
    // 销毁webrtc实例
    this.signal.close();
    this.pc?.close();
  }

  disconnect() {
    // 断开webrtc连接
    this.pc?.close();
    this.onConnState("closed");
  }

  // 2. 发送信令消息的通用方法
  sendSignalingMessage(message: SignalMessage): void {
    this.signal.send(JSON.stringify(message));
  }

  private initializePeerConnection(): void {
    const configuration: RTCConfiguration = {
      iceServers: [
        {
          urls: stuns[0], // "stun:stun.l.google.com:19302", // 使用一个更通用的 STUN 服务器
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

    this.pc.onsignalingstatechange = () => {
      console.log("Signaling 状态:", this.pc?.signalingState);
    };

    // 当收到远程流时 (如果有的话)
    this.pc.ontrack = (event: RTCTrackEvent) => {
      // 实现处理接收到的媒体流的逻辑
      for (const stream of event.streams) this.onStream(stream);
      console.log("收到远程媒体流", event.streams.length);
    };

    this.pc.onnegotiationneeded = async () => {
      console.log("🧠 触发 renegotiation");
      if (this.peerId) this.renegotiate(this.peerId);
    };
  }

  // A 创建 Offer
  public async createOffer(peerId: string): Promise<void> {
    if (!this.pc) return;

    this.peerId = peerId;

    console.log("创建 Offer...");
    this.dataChannel = this.pc.createDataChannel("messageChannel"); // 发起连接方
    this.setupDataChannel();

    try {
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);

      // *** 优化点：通过 WebSocket 发送 offer ***
      console.log("发送本地 Offer:", offer);
      this.sendSignalingMessage({ id: this.id, peerId, offer: { desc: offer } });
    } catch (error) {
      console.error("创建 Offer 时出错:", error);
    }
  }

  // B 接收 Offer 并创建 Answer
  public async receiveOffer(peerId: string, offer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.pc) return;

    this.peerId = peerId;

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

    this.dataChannel.bufferedAmountLowThreshold = LOW_THRESHOLD;

    this.dataChannel.onopen = () => {
      console.log("数据通道已打开");
      this.sendMessage(`hello from ${this.id}`);
    };

    this.dataChannel.onclose = () => {
      console.log("数据通道已关闭");
    };

    this.dataChannel.onerror = (error) => {
      console.error("数据通道错误:", error);
    };

    this.dataChannel.onmessage = (event: MessageEvent) => {
      console.log("收到消息:", typeof event.data);
      // 可以在这里处理收到的消息，例如更新 UI
      this.onMessage(event.data);
    };

    this.dataChannel.onbufferedamountlow = () => {
      console.log("数据通道缓冲区已空闲");
      const resolve = this.writable;
      this.writable = undefined;
      resolve?.();
    };
  }

  writable?: () => void;
  // 发送消息，MAX_BUFFER已经预留，因此不判断缓冲区是否已满
  public sendMessage(message: string | Message): void {
    if (this.dataChannel && this.dataChannel.readyState === "open") {
      this.dataChannel.send(JSON.stringify(message));
      console.log("已发送消息:", message);
    } else {
      console.warn("数据通道未打开，无法发送消息。当前状态:", this.dataChannel?.readyState);
    }
  }

  public async sendData(data: Blob) {
    if (this.writable) {
      throw new Error("wait until writable");
    }
    if (this.dataChannel && this.dataChannel.readyState === "open") {
      if (this.dataChannel.bufferedAmount > MAX_BUFFER) {
        await new Promise<void>((resolve) => {
          this.writable = resolve;
        });
        this.sendData(data); // retry
        return;
      }

      try {
        this.dataChannel.send(data);
        // console.log("已发送data:", data.size);
      } catch (error) {
        console.error("发送数据时出错:", error);
      }
    } else {
      console.warn("数据通道未打开，无法发送消息。当前状态:", this.dataChannel?.readyState);
    }
  }

  // 发送信令
  // public signal(message: SignalMessage) {
  //   this.cli.send(JSON.stringify(message));
  // }

  public addTrack(track: MediaStreamTrack, stream: MediaStream) {
    return this.pc?.addTrack(track, stream);
  }
  public removeTrack(sender: RTCRtpSender) {
    try {
      return this.pc?.removeTrack(sender);
    } catch (error) {
      console.error("Failed to remove track:", error);
    }
  }

  public async renegotiate(peerId: string): Promise<void> {
    if (!this.pc) return;

    console.log("重新协商 Offer...");

    try {
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);

      // *** 优化点：通过 WebSocket 发送 offer ***
      console.log("发送本地 Offer:", offer);
      this.sendSignalingMessage({ id: this.id, peerId, offer: { desc: offer } });
    } catch (error) {
      console.error("创建 Offer 时出错:", error);
    }
  }

  get peerConnection () {
    return this.pc;
  }
}
