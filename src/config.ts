const stunStr =
  "stun:stun.qq.com,stun:stun.miwifi.com";
export const stuns = stunStr.split(",");

export const mqttStr = "wss://broker.emqx.io:8084/mqtt,wss://mqtt.flespi.io:443,ws://broker.hivemq.com:8000/mqtt,ws://broker.emqx.io:8083/mqtt,ws://test.mosquitto.org:8080/mqtt";
export const mqtts = mqttStr.split(",");

export const topic = "test/webrtc/topic";
