const mqtt = require('mqtt')

// // MQTT 服务器地址
// const MQTT_BROKER = "iot.modbus.cn";
// // MQTT 端口号
// const MQTT_PORT = 1883;
// // MQTT 客户端 ID
// const MQTT_CLIENT_ID = "4QR8TZ9ThuL4G";
// // MQTT 用户名
// const MQTT_USERNAME = "ceshi";
// // MQTT 密码
// const MQTT_PASSWORD = "123456";
// // 订阅的主题
// const MQTT_TOPIC_SUBSCRIBE = "/server/coo/4QR8TZ9ThuL4G";
// // 发布的主题
// const MQTT_TOPIC_PUBLISH = "/dev/coo/4QR8TZ9ThuL4G";

// // 创建 MQTT 客户端
// const client = mqtt.connect({
//     host: MQTT_BROKER,
//     port: MQTT_PORT,
//     clientId: MQTT_CLIENT_ID,
//     username: MQTT_USERNAME,
//     password: MQTT_PASSWORD
// });

// 连接到MQTT代理 (这里使用公共测试代理)
const client = mqtt.connect('mqtt://broker.emqx.io');

const topic = 'test/nodejs/topic';
const messageToSend = 'Hello from Node.js MQTT client!';

// 处理连接成功事件
client.on('connect', () => {
  console.log('Connected to MQTT broker');

  // 订阅主题
  client.subscribe(topic, (err) => {
    if (err) {
      console.error('Subscribe error:', err);
    } else {
      console.log(`Subscribed to topic: ${topic}`);
    }
  });

  // 发布消息到主题
  // 为了演示，这里在连接后立即发布一条消息
  client.publish(topic, messageToSend, (err) => {
    if (err) {
      console.error('Publish error:', err);
    } else {
      console.log(`Published message: ${messageToSend} to topic: ${topic}`);
    }
    // 注意：在实际应用中，你可能不希望立即断开连接
    // client.end(); // 如果只发送一次消息后就断开，可以取消注释
  });
});

// 处理收到消息事件
client.on('message', (receivedTopic, payload) => {
  console.log(`Received message on topic ${receivedTopic}: ${payload.toString()}`);
  // 在这个简单示例中，发布者和订阅者是同一个客户端，
  // 所以它会收到自己发布的消息。
  // 收到消息后断开连接
  client.end();
});

// 处理错误事件
client.on('error', (err) => {
  console.error('MQTT Client Error:', err);
});
