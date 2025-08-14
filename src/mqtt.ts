import MQTT from "mqtt";

export const debugMqtt = false;

export class MQTTClient {
  private client: MQTT.MqttClient;
  private topic: string;

  constructor({ url, topic }: { url: string; topic: string }) {
    this.topic = topic;
    this.client = MQTT.connect(url, { reconnectPeriod: debugMqtt ? 600_000 : 10_000 });
  }
  // 处理连接成功事件
  set handleConnectEvent(callback: () => void) {
    const { client, topic } = this;

    // 处理连接成功事件
    client.on("connect", () => {
      // console.log("Connected to MQTT broker");

      // 默认只 订阅一个主题
      client.subscribe(topic, (err) => {
        if (err) {
          console.error("Subscribe error:", err);
        } else {
          console.log(`Subscribed to topic: ${topic}`);
          callback();
        }
      });
    });
  }

  set handleMessageEvent(callback: (message: string) => void) {
    const { client, topic } = this;
    // 处理收到消息事件
    client.on("message", (receivedTopic, payload) => {
      const message = payload.toString();
      console.log(`Received message on topic ${receivedTopic}`);
      // 在这个简单示例中，发布者和订阅者是同一个客户端，
      // 所以它会收到自己发布的消息。
      // 收到消息后断开连接
      // client.end();
      if (receivedTopic === topic) {
        callback(message);
      }
    });
  }

  set handleErrorEvent(callback: (error: Error) => void) {
    const { client } = this;
    // 处理错误事件
    client.on("error", (err) => {
      // console.error("MQTT Client Error:", err);
      callback(err);
    });
  }

  set handleCloseEvent(callback: () => void) {
    const { client } = this;
    // 处理关闭事件
    client.on("close", () => {
      // console.log("MQTT Client Closed");
      callback();
    });
  }

  send(message: string): void {
    const { client, topic } = this;
    // 发布消息到主题
    // 为了演示，这里在连接后立即发布一条消息
    client.publish(topic, message, (err) => {
      if (err) {
        console.error("Publish error:", err);
      } else {
        console.log(`Published message to topic: ${topic}`);
      }
      // 注意：在实际应用中，你可能不希望立即断开连接
      // client.end(); // 如果只发送一次消息后就断开，可以取消注释
    });
  }

  close() {
    this.client.end();
  }
}

/**
 * 
1883 : MQTT, unencrypted, unauthenticated
1884 : MQTT, unencrypted, authenticated
8883 : MQTT, encrypted, unauthenticated
8884 : MQTT, encrypted, client certificate required
8885 : MQTT, encrypted, authenticated
8886 : MQTT, encrypted, unauthenticated
8887 : MQTT, encrypted, server certificate deliberately expired
8080 : MQTT over WebSockets, unencrypted, unauthenticated
8081 : MQTT over WebSockets, encrypted, unauthenticated
8090 : MQTT over WebSockets, unencrypted, authenticated
8091 : MQTT over WebSockets, encrypted, authenticated
 */
